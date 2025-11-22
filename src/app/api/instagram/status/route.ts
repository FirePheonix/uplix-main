import { NextResponse } from 'next/server';

// This route is no longer needed as we use localStorage on the client
// Keeping it for backwards compatibility, but it always returns not connected
export async function GET() {
  return NextResponse.json({ connected: false });
}
