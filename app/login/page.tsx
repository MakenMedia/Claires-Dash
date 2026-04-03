'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok) { setError(data.error || 'Login failed'); return; }
      window.location.href = data.redirectTo;
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0f14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Maken Media" style={{ height: 52, width: 'auto' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: '#111318',
        border: '1px solid #1e2230',
        borderRadius: 4,
        padding: '36px 32px 32px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}>
        <h1 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center', marginBottom: 28 }}>
          Welcome back
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Email field */}
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                width: '100%',
                background: '#0d0f14',
                border: '1px solid #1e2230',
                borderRadius: 3,
                color: '#e2e8f0',
                fontSize: 13,
                padding: '12px 40px 12px 14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color .15s',
              }}
              onFocus={e => e.target.style.borderColor = '#5b6af0'}
              onBlur={e => e.target.style.borderColor = '#1e2230'}
            />
            <svg style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>

          {/* Password field */}
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: '100%',
                background: '#0d0f14',
                border: '1px solid #1e2230',
                borderRadius: 3,
                color: '#e2e8f0',
                fontSize: 13,
                padding: '12px 40px 12px 14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color .15s',
              }}
              onFocus={e => e.target.style.borderColor = '#5b6af0'}
              onBlur={e => e.target.style.borderColor = '#1e2230'}
            />
            <svg style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          {error && (
            <div style={{ background: '#ef444415', border: '1px solid #ef444430', borderRadius: 3, padding: '9px 12px', fontSize: 12, color: '#ef4444', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'transparent',
              color: '#e2e8f0',
              border: '1px solid #2d3347',
              borderRadius: 3,
              padding: '12px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'border-color .15s, background .15s',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#5b6af0'; (e.currentTarget as HTMLButtonElement).style.color = '#5b6af0'; }}}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2d3347'; (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0'; }}
          >
            {loading && (
              <div style={{ width: 12, height: 12, border: '2px solid #ffffff30', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
            )}
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#374151', marginTop: 24, marginBottom: 0 }}>
          Sign in to your Maken Media account
        </p>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: '#1f2937', marginTop: 24 }}>
        Maken Media — Internal Platform
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
