import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function authHeaders(request: NextRequest): HeadersInit {
  const auth = request.headers.get('authorization');
  return {
    'Content-Type': 'application/json',
    ...(auth ? { Authorization: auth } : {}),
  };
}

async function proxy(request: NextRequest, path: string) {
  const auth = request.headers.get('authorization');
  if (!auth) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: authHeaders(request),
    });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Dashboard API unavailable. Is the backend running?' },
        { status: 502 },
      );
    }
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Dashboard proxy error:', path, error);
    return NextResponse.json(
      {
        error:
          'Backend API is offline (port 3001). The database connection is failing, so Nest never stays up. Fix backend/.env DATABASE_URL, then restart with npm run dev.',
        code: 'API_UNAVAILABLE',
      },
      { status: 503 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const suffix = path.join('/');
  return proxy(request, `/dashboard/${suffix}`);
}
