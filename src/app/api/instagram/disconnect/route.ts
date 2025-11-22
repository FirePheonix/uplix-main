import { NextResponse } from 'next/server';

// This route is no longer needed as we use localStorage on the client
// Keeping it for backwards compatibility
export async function POST() {
  return NextResponse.json({ success: true });
}
