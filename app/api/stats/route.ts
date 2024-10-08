// unsued
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const incomingData = await req.text();

    const response = await fetch('http://localhost:8000/api/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: incomingData,
    });

    const result = await response.text();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to post data to localhost' }, { status: 500 });
  }
}