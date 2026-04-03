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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        body { background: #0d0f14; }

        .login-wrap {
          display: flex;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #13151c;
        }

        /* LEFT PANEL */
        .login-left {
          flex: 1;
          position: relative;
          background: linear-gradient(160deg, #1a0a0a 0%, #0d0f14 40%, #1a0505 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 36px 40px;
          overflow: hidden;
          min-height: 100vh;
        }
        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 30% 60%, rgba(225,20,24,0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(225,20,24,0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        .left-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }
        .left-logo img {
          height: 40px;
          width: auto;
        }
        .back-link {
          color: #94a3b8;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color .15s;
        }
        .back-link:hover { color: #e2e8f0; }
        .left-bottom {
          position: relative;
          z-index: 1;
        }
        .left-tagline {
          font-size: 28px;
          font-weight: 800;
          color: #e2e8f0;
          line-height: 1.25;
          letter-spacing: -0.02em;
          max-width: 280px;
        }
        .left-sub {
          font-size: 13px;
          color: #64748b;
          margin-top: 12px;
          font-weight: 400;
        }

        /* RIGHT PANEL */
        .login-right {
          width: 460px;
          flex-shrink: 0;
          background: #0d0f14;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 48px;
        }
        .login-form-wrap {
          width: 100%;
          max-width: 340px;
        }
        .form-title {
          font-size: 26px;
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .form-sub {
          font-size: 13px;
          color: #475569;
          margin-bottom: 36px;
        }
        .input-wrap {
          position: relative;
          margin-bottom: 14px;
        }
        .input-wrap input {
          width: 100%;
          background: #141720;
          border: 1px solid #1e2535;
          border-radius: 8px;
          color: #e2e8f0;
          font-size: 14px;
          padding: 13px 42px 13px 16px;
          outline: none;
          transition: border-color .15s;
          font-family: inherit;
        }
        .input-wrap input::placeholder { color: #374151; }
        .input-wrap input:focus { border-color: #e11418; }
        .input-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.25;
          pointer-events: none;
        }
        .login-btn {
          width: 100%;
          background: #e11418;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background .15s, transform .1s;
          font-family: inherit;
          letter-spacing: 0.01em;
        }
        .login-btn:hover:not(:disabled) { background: #c41013; }
        .login-btn:active:not(:disabled) { transform: scale(0.99); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .error-box {
          background: #ef444415;
          border: 1px solid #ef444430;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 12.5px;
          color: #ef4444;
          text-align: center;
          margin-bottom: 14px;
        }
        .spinner {
          width: 13px;
          height: 13px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { width: 100%; padding: 40px 28px; }
        }
      `}</style>

      <div className="login-wrap">
        {/* Left panel */}
        <div className="login-left">
          <div className="left-top">
            <div className="left-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Maken Media"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <a href="https://maken.media" className="back-link">
              Back to website
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <div className="left-bottom">
            <div className="left-tagline">We don&rsquo;t just shoot video.<br />We create impact.</div>
            <div className="left-sub">Maken Media — Internal Platform</div>
          </div>
        </div>

        {/* Right panel */}
        <div className="login-right">
          <div className="login-form-wrap">
            <div className="form-title">Welcome back</div>
            <div className="form-sub">Sign in to your Maken Media account</div>

            <form onSubmit={handleSubmit}>
              <div className="input-wrap">
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <svg className="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>

              <div className="input-wrap">
                <input
                  type="password" required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <svg className="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>

              {error && <div className="error-box">{error}</div>}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading && <div className="spinner" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
