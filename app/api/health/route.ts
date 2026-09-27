import { HealthResponse } from '../../../src/health';

export const dynamic = 'force-dynamic'; // timestamp не має запектися під час build

export function GET() {
  const body: HealthResponse = { status: 'ok', timestamp: new Date().toISOString() };
  return Response.json(body);
}
