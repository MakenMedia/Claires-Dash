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
      minHeight: '100vh', background: '#0d0f14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <img src="/logo.png" alt="Maken Media" style={{ height: 64, width: 'auto' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        </div>

        {/* Card */}
        <div style={{
          background: '#141720', border: '1px solid #252a38',
          borderRadius: 16, padding: '40px 36px',
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#e2e8f0', marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
            Sign in to your Maken Media account
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@makenmedia.co"
                style={{
                  width: '100%', background: '#1a1e2b', border: '1px solid #252a38',
                  borderRadius: 8, color: '#e2e8f0', fontSize: 14, padding: '11px 14px',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#5b6af0'}
                onBlur={e => e.target.style.borderColor = '#252a38'}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                style={{
                  width: '100%', background: '#1a1e2b', border: '1px solid #252a38',
                  borderRadius: 8, color: '#e2e8f0', fontSize: 14, padding: '11px 14px',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#5b6af0'}
                onBlur={e => e.target.style.borderColor = '#252a38'}
              />
            </div>

            {error && (
              <div style={{ background: '#ef444415', border: '1px solid #ef444430', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ef4444' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: '100%', background: loading ? '#3d4899' : '#5b6af0',
                color: '#fff', border: 'none', borderRadius: 8,
                padding: '12px', fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background .15s',
              }}>
              {loading && (
                <div style={{ width: 14, height: 14, border: '2px solid #ffffff50', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 24 }}>
          Maken Media — Internal Platform
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
