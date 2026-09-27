import { NextResponse } from 'next/server';

import type { HealthResponse } from '@/src/health';

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const body: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body);
}
