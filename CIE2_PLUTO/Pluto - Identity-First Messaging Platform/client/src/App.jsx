import {
  Check,
  Copy,
  Image,
  KeyRound,
  LogOut,
  MessageCircle,
  QrCode,
  RefreshCw,
  ScanLine,
  Send,
  Settings,
  Shield,
  User,
  X
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { apiRequest } from "./lib/api.js";
import { createPlutoSocket } from "./lib/socket.js";

const emptyRequests = { incoming: [], outgoing: [] };

function loadStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem("pluto_auth")) || null;
  } catch {
    return null;
  }
}

function saveStoredAuth(auth) {
  if (auth) {
    localStorage.setItem("pluto_auth", JSON.stringify(auth));
    return;
  }

  localStorage.removeItem("pluto_auth");
}

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function normalizeCode(value) {
  return value.trim().toUpperCase();
}

function mergeUniqueById(items, item) {
  if (!item) return items;
  if (items.some((existing) => existing.id === item.id)) return items;
  return [item, ...items];
}

function sortConversations(conversations) {
  return [...conversations].sort(
    (first, second) => new Date(second.updatedAt) - new Date(first.updatedAt)
  );
}

function Avatar({ user, size = "medium" }) {
  return (
    <div className={`avatar avatar-${size}`}>
      {user?.avatar ? <img src={user.avatar} alt="" /> : <span>{user?.username?.slice(0, 2)}</span>}
    </div>
  );
}

function IconButton({ label, children, ...props }) {
  return (
    <button className="icon-button" aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submitLogin(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: { username: loginId, password: loginPassword }
      });
      onAuth(data);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitRegister(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: { password: registerPassword, avatar }
      });
      onAuth(data);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setBusy(false);
    }
  }

  function pickAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <main className="auth-shell">
      <section className="brand-panel">
        <div className="brand-mark">
          <Shield size={38} />
        </div>
        <p className="eyebrow">PLUTO</p>
        <h1>Chat Freely. Stay Private.</h1>
        <p className="brand-copy">
          Connect through Pluto IDs, temporary codes, and accepted requests.
        </p>
      </section>

      <section className="auth-panel">
        <div className="segmented">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Login
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={submitLogin} className="form-stack">
            <label>
              Pluto ID
              <input
                value={loginId}
                onChange={(event) => setLoginId(event.target.value)}
                placeholder="@7KX9P2"
                autoComplete="username"
              />
            </label>
            <label>
              Password
              <input
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                type="password"
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button className="primary-button" disabled={busy}>
              <KeyRound size={18} />
              {busy ? "Checking" : "Enter Pluto"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitRegister} className="form-stack">
            <label>
              Password
              <input
                value={registerPassword}
                onChange={(event) => setRegisterPassword(event.target.value)}
                type="password"
                minLength={6}
                autoComplete="new-password"
              />
            </label>
            <label>
              Profile image
              <input accept="image/*" onChange={pickAvatar} type="file" />
            </label>
            {avatar ? <img className="avatar-preview" src={avatar} alt="" /> : null}
            {error ? <p className="form-error">{error}</p> : null}
            <button className="primary-button" disabled={busy}>
              <User size={18} />
              {busy ? "Creating" : "Create Pluto ID"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

function IdentityPanel({
  user,
  connectionCode,
  onGenerateCode,
  onCopy,
  codeBusy,
  connectCode,
  setConnectCode,
  onConnect,
  connectBusy,
  onOpenScanner
}) {
  return (
    <section className="surface identity-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Your Pluto ID</p>
          <h2>{user.plutoId}</h2>
        </div>
        <Avatar user={user} />
      </div>

      <div className="code-grid">
        <div className="code-display">
          <p>Connection Code</p>
          <strong>{connectionCode?.code || "No active code"}</strong>
          <span>{connectionCode ? `Expires ${formatDateTime(connectionCode.expiresAt)}` : ""}</span>
        </div>

        <div className="qr-box">
          {connectionCode?.code ? (
            <QRCodeSVG value={connectionCode.code} size={136} bgColor="#f8fafc" fgColor="#111827" />
          ) : (
            <QrCode size={58} />
          )}
        </div>
      </div>

      <div className="action-row">
        <button className="secondary-button" onClick={onGenerateCode} disabled={codeBusy}>
          <RefreshCw size={17} />
          {codeBusy ? "Generating" : "My Code"}
        </button>
        <button
          className="secondary-button"
          onClick={() => onCopy(connectionCode?.code)}
          disabled={!connectionCode?.code}
        >
          <Copy size={17} />
          Copy
        </button>
      </div>

      <form className="connect-form" onSubmit={onConnect}>
        <label>
          Connect
          <input
            value={connectCode}
            onChange={(event) => setConnectCode(event.target.value)}
            placeholder="PLU-8F2K-91Q"
          />
        </label>
        <div className="action-row">
          <button className="primary-button" disabled={connectBusy}>
            <MessageCircle size={17} />
            {connectBusy ? "Sending" : "Request"}
          </button>
          <button type="button" className="secondary-button" onClick={onOpenScanner}>
            <ScanLine size={17} />
            Scan
          </button>
        </div>
      </form>
    </section>
  );
}

function RequestsPanel({ requests, onRespond }) {
  return (
    <section className="surface requests-panel">
      <div className="section-header compact">
        <div>
          <p className="eyebrow">Connection Requests</p>
          <h2>{requests.incoming.length + requests.outgoing.length}</h2>
        </div>
      </div>

      <div className="request-list">
        {requests.incoming.length === 0 && requests.outgoing.length === 0 ? (
          <p className="empty-state">No pending requests.</p>
        ) : null}

        {requests.incoming.map((request) => (
          <article className="request-item" key={request.id}>
            <Avatar user={request.sender} size="small" />
            <div>
              <strong>{request.sender.plutoId}</strong>
              <span>wants to connect</span>
            </div>
            <div className="request-actions">
              <IconButton label="Accept request" onClick={() => onRespond(request.id, "accept")}>
                <Check size={17} />
              </IconButton>
              <IconButton label="Decline request" onClick={() => onRespond(request.id, "decline")}>
                <X size={17} />
              </IconButton>
            </div>
          </article>
        ))}

        {requests.outgoing.map((request) => (
          <article className="request-item muted" key={request.id}>
            <Avatar user={request.receiver} size="small" />
            <div>
              <strong>{request.receiver.plutoId}</strong>
              <span>pending</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ConversationList({ conversations, selectedConversationId, onSelect }) {
  return (
    <section className="surface conversation-list">
      <div className="section-header compact">
        <div>
          <p className="eyebrow">Conversations</p>
          <h2>{conversations.length}</h2>
        </div>
      </div>

      <div className="conversation-scroll">
        {conversations.length === 0 ? (
          <p className="empty-state">Accepted connections will appear here.</p>
        ) : null}
        {conversations.map((conversation) => (
          <button
            className={`conversation-item ${
              selectedConversationId === conversation.id ? "selected" : ""
            }`}
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
          >
            <Avatar user={conversation.partner} />
            <span>
              <strong>{conversation.partner?.plutoId || "Pluto user"}</strong>
              <small>
                {conversation.lastMessage
                  ? conversation.lastMessage.type === "image"
                    ? "Image"
                    : conversation.lastMessage.content
                  : "Start the chat"}
              </small>
            </span>
            <time>{formatTime(conversation.lastMessage?.createdAt || conversation.updatedAt)}</time>
          </button>
        ))}
      </div>
    </section>
  );
}

function ChatPanel({
  conversation,
  messages,
  user,
  messageText,
  setMessageText,
  onSend,
  onPickImage,
  sending
}) {
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (!conversation) {
    return (
      <section className="surface chat-panel blank-chat">
        <Shield size={54} />
        <h2>Choose a conversation</h2>
        <p>Messages appear after a connection request is accepted.</p>
      </section>
    );
  }

  return (
    <section className="surface chat-panel">
      <header className="chat-header">
        <Avatar user={conversation.partner} />
        <div>
          <h2>{conversation.partner?.plutoId}</h2>
          <p>Connected on Pluto</p>
        </div>
      </header>

      <div className="message-list">
        {messages.length === 0 ? <p className="empty-state">No messages yet.</p> : null}
        {messages.map((message) => {
          const mine = message.sender?.id === user.id;

          return (
            <article className={`message-bubble ${mine ? "mine" : "theirs"}`} key={message.id}>
              {message.type === "image" ? (
                <img src={message.mediaUrl} alt="Shared Pluto message" />
              ) : (
                <p>{message.content}</p>
              )}
              <time>{formatTime(message.createdAt)}</time>
            </article>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={onSend}>
        <input
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          placeholder="Message"
        />
        <input
          ref={imageInputRef}
          accept="image/*"
          className="hidden-input"
          onChange={onPickImage}
          type="file"
        />
        <IconButton label="Attach image" type="button" onClick={() => imageInputRef.current?.click()}>
          <Image size={19} />
        </IconButton>
        <button className="send-button" disabled={sending}>
          <Send size={19} />
        </button>
      </form>
    </section>
  );
}

function QrScannerModal({ onClose, onScan }) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let frameId;
    let stream;
    let stopped = false;

    async function startScanner() {
      try {
        if (!("BarcodeDetector" in window)) {
          setError("QR scanning is not supported in this browser.");
          return;
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });

        const video = videoRef.current;
        video.srcObject = stream;
        await video.play();

        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });

        async function scanFrame() {
          if (stopped) return;

          if (video.readyState >= 2) {
            const codes = await detector.detect(video);
            const value = codes[0]?.rawValue;

            if (value) {
              onScan(value);
              onClose();
              return;
            }
          }

          frameId = requestAnimationFrame(scanFrame);
        }

        scanFrame();
      } catch (scannerError) {
        setError(scannerError.message || "Camera access was blocked.");
      }
    }

    startScanner();

    return () => {
      stopped = true;
      cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [onClose, onScan]);

  return (
    <div className="modal-backdrop">
      <section className="scanner-modal">
        <div className="section-header compact">
          <div>
            <p className="eyebrow">Scan QR</p>
            <h2>Connection Code</h2>
          </div>
          <IconButton label="Close scanner" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <video ref={videoRef} muted playsInline />
      </section>
    </div>
  );
}

function App() {
  const [auth, setAuth] = useState(loadStoredAuth);
  const [conversations, setConversations] = useState([]);
  const [requests, setRequests] = useState(emptyRequests);
  const [connectionCode, setConnectionCode] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [connectCode, setConnectCode] = useState("");
  const [notice, setNotice] = useState("");
  const [socketStatus, setSocketStatus] = useState("offline");
  const [codeBusy, setCodeBusy] = useState(false);
  const [connectBusy, setConnectBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const token = auth?.token;
  const user = auth?.user;

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const showNotice = useCallback((value) => {
    setNotice(value);
    window.clearTimeout(showNotice.timeoutId);
    showNotice.timeoutId = window.setTimeout(() => setNotice(""), 3500);
  }, []);

  const upsertConversation = useCallback((conversation) => {
    if (!conversation) return;

    setConversations((current) =>
      sortConversations([
        conversation,
        ...current.filter((existing) => existing.id !== conversation.id)
      ])
    );
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!token) return;

    const [conversationData, requestData, codeData] = await Promise.all([
      apiRequest("/conversations", { token }),
      apiRequest("/connections/requests", { token }),
      apiRequest("/connections/code", { token })
    ]);

    setConversations(sortConversations(conversationData.conversations || []));
    setRequests(requestData || emptyRequests);
    setConnectionCode(codeData.connectionCode || null);
  }, [token]);

  useEffect(() => {
    saveStoredAuth(auth);
  }, [auth]);

  useEffect(() => {
    if (!token) return;

    apiRequest("/auth/me", { token })
      .then((data) => setAuth((current) => (current ? { ...current, user: data.user } : current)))
      .then(loadDashboard)
      .catch(() => {
        setAuth(null);
      });
  }, [loadDashboard, token]);

  useEffect(() => {
    if (!token) return undefined;

    const socket = createPlutoSocket(token);

    socket.on("connect", () => setSocketStatus("online"));
    socket.on("disconnect", () => setSocketStatus("offline"));
    socket.on("connect_error", () => setSocketStatus("offline"));

    socket.on("connection:request", (connectionRequest) => {
      setRequests((current) => ({
        ...current,
        incoming: mergeUniqueById(current.incoming, connectionRequest)
      }));
      showNotice(`${connectionRequest.sender.plutoId} wants to connect.`);
    });

    socket.on("connection:accepted", ({ connectionRequest, conversation }) => {
      setRequests((current) => ({
        incoming: current.incoming.filter((request) => request.id !== connectionRequest.id),
        outgoing: current.outgoing.filter((request) => request.id !== connectionRequest.id)
      }));
      upsertConversation(conversation);
      setSelectedConversationId((current) => current || conversation.id);
      showNotice(`${conversation.partner.plutoId} is now connected.`);
    });

    socket.on("connection:declined", (connectionRequest) => {
      setRequests((current) => ({
        ...current,
        outgoing: current.outgoing.filter((request) => request.id !== connectionRequest.id)
      }));
      showNotice(`${connectionRequest.receiver.plutoId} declined the request.`);
    });

    socket.on("message:new", ({ message, conversation }) => {
      upsertConversation(conversation);

      if (conversation.id === selectedConversationId) {
        setMessages((current) => {
          if (current.some((existing) => existing.id === message.id)) return current;
          return [...current, message];
        });
      }
    });

    return () => socket.disconnect();
  }, [selectedConversationId, showNotice, token, upsertConversation]);

  useEffect(() => {
    if (!selectedConversationId || !token) {
      setMessages([]);
      return;
    }

    apiRequest(`/messages/${selectedConversationId}`, { token })
      .then((data) => setMessages(data.messages || []))
      .catch((error) => showNotice(error.message));
  }, [selectedConversationId, showNotice, token]);

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  function handleAuth(data) {
    setAuth(data);
    setSelectedConversationId("");
    setMessages([]);
  }

  function logout() {
    setAuth(null);
    setConversations([]);
    setRequests(emptyRequests);
    setConnectionCode(null);
    setSelectedConversationId("");
    setMessages([]);
  }

  async function generateCode() {
    setCodeBusy(true);

    try {
      const data = await apiRequest("/connections/code", { method: "POST", token });
      setConnectionCode(data.connectionCode);
      showNotice("New connection code generated.");
    } catch (error) {
      showNotice(error.message);
    } finally {
      setCodeBusy(false);
    }
  }

  async function copyCode(code) {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    showNotice("Connection code copied.");
  }

  async function submitConnectionRequest(event) {
    event.preventDefault();
    const code = normalizeCode(connectCode);
    if (!code) return;

    setConnectBusy(true);

    try {
      const data = await apiRequest("/connections/requests", {
        method: "POST",
        token,
        body: { code }
      });
      setRequests((current) => ({
        ...current,
        outgoing: mergeUniqueById(current.outgoing, data.connectionRequest)
      }));
      setConnectCode("");
      showNotice("Connection request sent.");
    } catch (error) {
      showNotice(error.message);
    } finally {
      setConnectBusy(false);
    }
  }

  async function respondToRequest(id, action) {
    try {
      const data = await apiRequest(`/connections/requests/${id}`, {
        method: "PATCH",
        token,
        body: { action }
      });

      setRequests((current) => ({
        incoming: current.incoming.filter((request) => request.id !== id),
        outgoing: current.outgoing.filter((request) => request.id !== id)
      }));

      if (data.conversation) {
        upsertConversation(data.conversation);
        setSelectedConversationId(data.conversation.id);
      }

      showNotice(action === "accept" ? "Connection accepted." : "Connection declined.");
    } catch (error) {
      showNotice(error.message);
    }
  }

  async function sendTextMessage(event) {
    event.preventDefault();
    const content = messageText.trim();
    if (!content || !selectedConversationId) return;

    setSending(true);

    try {
      await apiRequest(`/messages/${selectedConversationId}`, {
        method: "POST",
        token,
        body: { type: "text", content }
      });
      setMessageText("");
    } catch (error) {
      showNotice(error.message);
    } finally {
      setSending(false);
    }
  }

  async function pickImageMessage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !selectedConversationId) return;

    if (!file.type.startsWith("image/")) {
      showNotice("Choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showNotice("Choose an image under 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      setSending(true);

      try {
        await apiRequest(`/messages/${selectedConversationId}`, {
          method: "POST",
          token,
          body: {
            type: "image",
            content: file.name,
            mediaUrl: reader.result
          }
        });
      } catch (error) {
        showNotice(error.message);
      } finally {
        setSending(false);
      }
    };
    reader.readAsDataURL(file);
  }

  if (!auth) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <main className="app-shell">
      <aside className="left-rail">
        <header className="app-header">
          <div>
            <p className="eyebrow">PLUTO</p>
            <h1>Messages</h1>
          </div>
          <div className={`status-pill ${socketStatus}`}>{socketStatus}</div>
        </header>

        <IdentityPanel
          codeBusy={codeBusy}
          connectBusy={connectBusy}
          connectCode={connectCode}
          connectionCode={connectionCode}
          onConnect={submitConnectionRequest}
          onCopy={copyCode}
          onGenerateCode={generateCode}
          onOpenScanner={() => setScannerOpen(true)}
          setConnectCode={setConnectCode}
          user={user}
        />

        <RequestsPanel requests={requests} onRespond={respondToRequest} />
      </aside>

      <section className="center-rail">
        <ConversationList
          conversations={conversations}
          onSelect={setSelectedConversationId}
          selectedConversationId={selectedConversationId}
        />
      </section>

      <section className="right-rail">
        <div className="top-actions">
          <div className="profile-chip">
            <Avatar user={user} size="small" />
            <span>{user.plutoId}</span>
          </div>
          <button className="secondary-button compact-button" onClick={logout}>
            <LogOut size={17} />
            Logout
          </button>
          <Settings size={18} className="settings-icon" />
        </div>

        <ChatPanel
          conversation={selectedConversation}
          messageText={messageText}
          messages={messages}
          onPickImage={pickImageMessage}
          onSend={sendTextMessage}
          sending={sending}
          setMessageText={setMessageText}
          user={user}
        />
      </section>

      {notice ? <div className="toast">{notice}</div> : null}
      {scannerOpen ? (
        <QrScannerModal
          onClose={() => setScannerOpen(false)}
          onScan={(value) => setConnectCode(normalizeCode(value))}
        />
      ) : null}
    </main>
  );
}

export default App;
