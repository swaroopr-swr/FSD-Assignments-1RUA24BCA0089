# Pluto - A Full-Stack Real-Time Messaging Platform

Pluto is a privacy-oriented MERN messaging application. It uses generated Pluto identities instead of phone numbers, temporary connection codes/QR codes for intentional contact discovery, connection requests, and one-to-one real-time chat.

## Foundation

This college project is based on the architecture and learning path of a WhatsApp MERN tutorial:

https://youtu.be/fgaGVHLH2kY?si=ocAUkX_tWW3uJ_2v

Pluto is not a WhatsApp rebrand. The project adapts the common MERN + Socket.IO messaging foundation into an original application with its own identity model, connection workflow, and interface.

## Stack

- React + Vite frontend
- Node.js + Express backend
- MongoDB + Mongoose database
- Socket.IO real-time updates
- JWT authentication
- bcrypt password hashing

## Demo Flow

1. Register User A and User B.
2. Log in as User A.
3. Generate a temporary Pluto connection code.
4. Display the QR code for that connection code.
5. Log in as User B.
6. Enter or scan User A's code.
7. User A accepts the incoming request.
8. A one-to-one conversation is created.
9. Users exchange messages in real time.
10. Refresh the app and confirm the messages persist.

## Local Setup

Install dependencies:

```bash
npm install
```

Create the backend environment file:

```bash
cp server/.env.example server/.env
```

Start MongoDB locally, then run the app:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

## Environment Variables

See [server/.env.example](server/.env.example).

## What Was Customized For Pluto

- Generated public Pluto identity, for example `@7KX9P2`
- Temporary connection code, for example `PLU-8F2K-91Q`
- QR display and browser-supported QR scanning
- Connection request and acceptance gate before conversations
- Original dark Pluto UI and branding
- One-to-one text and simple image messages

## Current Limitations

- Image messages are stored as data URLs for a simple local demo. A production app should use Cloudinary/S3 or similar storage.
- QR scanning depends on browser support for `BarcodeDetector` and camera access.
- This is not an offline mesh network, Bluetooth messenger, end-to-end encrypted system, or production-scale deployment.
