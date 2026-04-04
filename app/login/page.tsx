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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #050505; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          font-family: 'Red Hat Display', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* Ambient glow */
        .wrap::before {
          content: '';
          position: fixed;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 700px;
          background: radial-gradient(ellipse at center top, rgba(225,20,24,0.22) 0%, rgba(225,20,24,0.08) 35%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Grid lines */
        .wrap::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
          z-index: 0;
        }

        .login-wrap {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 420px;
        }

        .login-logo {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          margin-bottom: 40px;
          text-decoration: none;
          color: #fff;
        }

        .login-logo-dot {
          display: inline-block;
          width: 5px; height: 5px;
          background: #e11418;
          border-radius: 50%;
          margin: 0 2px;
        }

        .login-headline {
          text-align: center;
          margin-bottom: 36px;
        }

        .login-headline h1 {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.1;
          color: #fff;
          margin-bottom: 6px;
        }

        .login-headline h1 em {
          font-style: normal;
          color: #e11418;
        }

        .login-headline p {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
        }

        .login-card {
          width: 100%;
          background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 40%, rgba(0,0,0,0.2) 100%);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border-top: 1px solid rgba(255,255,255,0.18);
          border-left: 1px solid rgba(255,255,255,0.12);
          border-right: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          border-radius: 24px;
          padding: 40px 40px 36px;
          box-shadow:
            0 1px 0 0 rgba(255,255,255,0.12) inset,
            0 32px 80px rgba(0,0,0,0.6),
            0 0 60px rgba(225,20,24,0.08),
            0 0 0 1px rgba(255,255,255,0.04);
        }

        .card-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: 6px;
        }

        .card-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 28px;
          line-height: 1.5;
        }

        .field { margin-bottom: 16px; }

        .field label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 8px;
        }

        .field-inner { position: relative; }

        .field-inner input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 13px 16px 13px 40px;
          font-size: 14px;
          font-family: 'Red Hat Display', -apple-system, sans-serif;
          color: rgba(255,255,255,0.5);
          outline: none;
          transition: border-color 0.2s;
          -webkit-text-fill-color: rgba(255,255,255,0.5);
        }

        .field-inner input::placeholder { color: rgba(255,255,255,0.2); }
        .field-inner input:focus { border-color: rgba(255,255,255,0.18); }

        .field-inner input:-webkit-autofill,
        .field-inner input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px rgba(10,10,10,1) inset;
          -webkit-text-fill-color: rgba(255,255,255,0.5);
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.35;
          pointer-events: none;
          color: #fff;
        }

        .error-box {
          background: rgba(225,20,24,0.1);
          border: 1px solid rgba(225,20,24,0.3);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #ff6b6e;
          margin-bottom: 16px;
          text-align: center;
        }

        .submit-btn {
          width: 100%;
          background: #e11418;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 15px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Red Hat Display', -apple-system, sans-serif;
          letter-spacing: 0.01em;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 24px rgba(225,20,24,0.45), 0 0 60px rgba(225,20,24,0.2), 0 4px 16px rgba(225,20,24,0.3);
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 0 32px rgba(225,20,24,0.6), 0 0 80px rgba(225,20,24,0.3);
        }

        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        .login-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
        }

        .login-footer a {
          color: #e11418;
          text-decoration: none;
          font-weight: 600;
        }
      `}</style>

      <div className="wrap">
        <div className="login-wrap">

          <a href="/" className="login-logo">
            MAKEN<span className="login-logo-dot"></span>MEDIA
          </a>

          <div className="login-headline">
            <h1>Turn attention into <em>revenue.</em></h1>
            <p>Sign in to your client portal to continue</p>
          </div>

          <div className="login-card">
            <div className="card-title">Welcome Back</div>
            <div className="card-sub">Login to your account to continue</div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Email address</label>
                <div className="field-inner">
                  <svg className="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field">
                <label>Password</label>
                <div className="field-inner">
                  <svg className="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type="password" required value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {error && <div className="error-box">{error}</div>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading && <div className="spinner" />}
                {loading ? 'Signing in…' : 'Login →'}
              </button>
            </form>
          </div>

          <div className="login-footer">
            Not a client yet? <a href="https://maken-site.vercel.app/contact">Book a strategy call →</a>
          </div>

        </div>
      </div>
    </>
  );
}
