import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { FieldFormSection, DashedDivider } from '../components/FieldFormSection';
import { StampButton } from '../components/StampButton';

export const Account = () => {
  const { user, login, logout } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('All fields are required for authorization.');
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      const from = location.state?.from || '/orders';
      navigate(from);
    } else {
      setError(result.error);
    }
  };

  if (user) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl uppercase tracking-widest font-bold mb-12">Personnel Record</h1>
        <div className="border-4 border-ink p-8 bg-cream">
          <p className="font-mono mb-4 text-lg">Active Authorization: <strong className="text-rust">{user.username}</strong></p>
          <DashedDivider />
          <div className="flex gap-4">
            <StampButton onClick={() => navigate('/orders')}>View Ledger</StampButton>
            <StampButton variant="outline" onClick={logout}>Revoke Access</StampButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl uppercase tracking-widest font-bold mb-12">Authorization Required</h1>
      
      <form onSubmit={handleLogin} className="border-4 border-ink p-8 bg-cream">
        {error && (
          <div className="mb-8 p-4 border-2 border-rust bg-paper font-mono text-rust text-sm font-bold">
            [!] {error}
          </div>
        )}

        <FieldFormSection number="01" title="Credentials">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block font-mono text-sm uppercase tracking-widest mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="field-input"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block font-mono text-sm uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="field-input"
                autoComplete="current-password"
              />
            </div>
            <p className="font-mono text-xs opacity-60 italic">Hint: explorer / field123</p>
          </div>
        </FieldFormSection>

        <DashedDivider />
        
        <StampButton type="submit" className="w-full">Authenticate</StampButton>
      </form>
    </div>
  );
};
