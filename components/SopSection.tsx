'use client';

const RULES = [
  { rule: 'Available M-F 10am–2pm MST',        detail: 'No exceptions. Confirm in chat by 10:05am each day.' },
  { rule: 'Respond within 2 hours',             detail: 'During availability window. No exceptions.' },
  { rule: 'Hit every due date',                 detail: 'Not close. Not a day late. Hit it.' },
  { rule: 'Flag risks 24 hrs early',            detail: 'If something is slipping, communicate before it\'s late — not after.' },
  { rule: 'Join 11am Monday call',              detail: 'Weekly alignment. Non-negotiable. Confirm attendance Sunday night.' },
  { rule: 'Proactive updates on active tasks',  detail: 'Don\'t wait to be asked. Send a status update if nothing has moved in 24 hrs.' },
];

const SCHEDULE = [
  {
    time: '10:00 AM',
    task: 'Check all ClickUp tasks',
    detail: 'See if we have content for the next 5 days for every account. Content has to be completely finished and ready to be posted.',
    color: '#5b6af0',
  },
  {
    time: '11:00 AM',
    task: 'Review all content from editors — QC',
    detail: 'Strict guidelines. Make sure it\'s content you would enjoy watching. If it feels blah in any way, tell them in the notes and ask for a switch.',
    color: '#38bdf8',
  },
  {
    time: '12:00 PM',
    task: 'Post for all accounts',
    detail: '12pm–1pm is strictly posting for clients. Monitor performance for the first hour.',
    color: '#22c55e',
  },
  {
    time: '1:00 PM',
    task: 'ClickUp tasks + Market Research',
    detail: 'Work on ClickUp tasks and market research for clients. You are in charge of ClickUp — any tasks that need to be done, including if Sam is holding it up.',
    color: '#f97316',
  },
];

const TASK_STANDARDS = [
  {
    title: 'Market Research',
    items: [
      '60 minimum videos added to the sheet',
      'Prioritize content the client said they want to replicate (from onboarding sheet)',
    ],
  },
  {
    title: '30 Day Content Planner',
    note: 'ChatGPT and AI is NOT allowed',
    items: [
      'Identify 3–4 content pillars from market research that clearly works for the client',
      '10–15 content ideas under each pillar, slightly tweaked to fit the client\'s account',
      'Each idea needs: content idea explained for client, title overlay/hook for editors, reference video',
    ],
  },
];

export default function SopSection() {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <div className="icon" style={{ background: '#5b6af020' }}>📋</div>
          SOPs & Daily Checklist
        </div>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>Account Manager — Claire Arlandis</span>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Check-in protocol */}
        <div style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--accent)', marginBottom: 8 }}>Daily Check-In Protocol</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Every day M–F, confirm availability at <strong style={{ color: 'var(--text)' }}>10:00am MST</strong> with:</div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontStyle: 'italic', fontSize: 13, color: 'var(--text)' }}>
            "Good morning. Online and available. Here's where I'm at today: [brief task update]"
          </div>
          <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 8, fontWeight: 600 }}>No check-in by 10:30am = absence. Three absences = automatic end of test week.</div>
        </div>

        {/* Non-negotiable rules */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--muted)', marginBottom: 12 }}>Non-Negotiable Rules</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
            {RULES.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '11px 16px', background: 'var(--card2)', borderBottom: i < RULES.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: '0 0 220px', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{r.rule}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{r.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily schedule */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--muted)', marginBottom: 12 }}>Daily Schedule</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {SCHEDULE.map((s, i) => (
              <div key={i} style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderLeft: `3px solid ${s.color}`, borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.time}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{s.task}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{s.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Task standards */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--muted)', marginBottom: 12 }}>Task Standards</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
            {TASK_STANDARDS.map((t, i) => (
              <div key={i} style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: t.note ? 4 : 12 }}>{t.title}</div>
                {t.note && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', background: '#ef444415', border: '1px solid #ef444430', borderRadius: 6, padding: '3px 8px', marginBottom: 12, width: 'fit-content' }}>⚠ {t.note}</div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {t.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 6 }} />
                      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
