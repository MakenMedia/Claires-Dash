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
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #000; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .wrap {
          display: flex;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ── LEFT PANEL ── */
        .left {
          flex: 1;
          background: #000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 44px 52px;
          position: relative;
          overflow: hidden;
        }
        .left::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 55%;
          background: linear-gradient(to top, rgba(225,20,24,0.08) 0%, transparent 100%);
          pointer-events: none;
        }
        .left-logo {
          position: relative;
          z-index: 1;
        }
        .left-logo img {
          height: 38px;
          width: auto;
          filter: brightness(0) invert(1);
        }
        .left-copy {
          position: relative;
          z-index: 1;
        }
        .left-headline {
          font-size: 42px;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.03em;
        }
        .left-headline span {
          color: #e11418;
        }
        .left-sub {
          font-size: 15px;
          color: #525252;
          margin-top: 16px;
          line-height: 1.6;
          max-width: 340px;
        }
        .left-footer {
          position: relative;
          z-index: 1;
          font-size: 12px;
          color: #2a2a2a;
        }

        /* ── RIGHT PANEL ── */
        .right {
          width: 480px;
          flex-shrink: 0;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 52px;
          border-left: 1px solid #f0f0f0;
        }
        .form-wrap {
          width: 100%;
          max-width: 340px;
        }
        .form-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #e11418;
          margin-bottom: 10px;
        }
        .form-title {
          font-size: 30px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          margin-bottom: 6px;
        }
        .form-sub {
          font-size: 13.5px;
          color: #888;
          margin-bottom: 36px;
          line-height: 1.5;
        }
        .field {
          margin-bottom: 16px;
        }
        .field label {
          display: block;
          font-size: 11.5px;
          font-weight: 600;
          color: #333;
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }
        .field-inner {
          position: relative;
        }
        .field-inner input {
          width: 100%;
          background: #fff;
          border: 1.5px solid #e8e8e8;
          border-radius: 8px;
          color: #0a0a0a;
          font-size: 14px;
          padding: 13px 42px 13px 16px;
          outline: none;
          transition: border-color .15s;
          font-family: inherit;
        }
        .field-inner input::placeholder { color: #bbb; }
        .field-inner input:focus { border-color: #e11418; }
        .field-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.3;
          pointer-events: none;
        }
        .error-box {
          background: #fff5f5;
          border: 1.5px solid #fecaca;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #dc2626;
          margin-bottom: 16px;
          text-align: center;
        }
        .submit-btn {
          width: 100%;
          background: #e11418;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 15px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background .15s, transform .08s;
          font-family: inherit;
          letter-spacing: 0.02em;
        }
        .submit-btn:hover:not(:disabled) { background: #c41013; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        .form-footer {
          font-size: 11.5px;
          color: #bbb;
          text-align: center;
          margin-top: 28px;
        }

        @media (max-width: 800px) {
          .left { display: none; }
          .right { width: 100%; border-left: none; }
        }
      `}</style>

      <div className="wrap">
        {/* LEFT */}
        <div className="left">
          <div className="left-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Maken Media"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </div>

          <div className="left-copy">
            <div className="left-headline">
              We don&rsquo;t just<br />shoot video.<br />
              <span>We create impact.</span>
            </div>
            <div className="left-sub">
              The internal platform powering Maken Media's content operations, client delivery, and team workflow.
            </div>
          </div>

          <div className="left-footer">
            © {new Date().getFullYear()} Maken Media. All rights reserved.
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="form-wrap">
            <div className="form-eyebrow">Maken Media</div>
            <div className="form-title">Sign In</div>
            <div className="form-sub">Access your internal dashboard</div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Email or username</label>
                <div className="field-inner">
                  <input
                    type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@makenmedia.co"
                  />
                  <svg className="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              </div>

              <div className="field">
                <label>Password</label>
                <div className="field-inner">
                  <input
                    type="password" required value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                  />
                  <svg className="field-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              </div>

              {error && <div className="error-box">{error}</div>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading && <div className="spinner" />}
                {loading ? 'Signing in…' : '→ Sign In'}
              </button>
            </form>

            <div className="form-footer">
              Maken Media — Internal Platform
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
