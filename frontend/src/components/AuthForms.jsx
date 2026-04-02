import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

export default function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loading, error } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '400px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        <button 
          className={`tab ${isLogin ? 'active' : ''}`}
          onClick={() => { setIsLogin(true); setEmail(''); setPassword(''); }}
        >
          <span style={{display: 'flex', alignItems:'center', gap: '0.5rem'}}>
            <LogIn size={18} /> Login
          </span>
        </button>
        <button 
          className={`tab ${!isLogin ? 'active' : ''}`}
          onClick={() => { setIsLogin(false); setEmail(''); setPassword(''); }}
        >
          <span style={{display: 'flex', alignItems:'center', gap: '0.5rem'}}>
            <UserPlus size={18} /> Register
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="input-field"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="input-field"
          />
        </div>

        {error && <div className="error-msg" style={{justifyContent: 'center', marginBottom: '1rem'}}>{error}</div>}

        <button type="submit" className="btn-primary" disabled={loading} style={{width: '100%'}}>
          {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
        </button>
      </form>
    </div>
  );
}
