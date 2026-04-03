import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      send({ type: 'connected', timestamp: Date.now() });

      const interval = setInterval(async () => {
        try {
          const r = await fetch(`${req.nextUrl.origin}/api/clickup`);
          const data = await r.json();
          send({ type: 'update', ...data });
        } catch {
          send({ type: 'error', message: 'fetch failed' });
        }
      }, parseInt(process.env.POLL_CLICKUP_MS || '60000'));

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
