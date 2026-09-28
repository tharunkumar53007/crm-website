import { NextRequest, NextResponse } from 'next/server';
import { createLead, getCRMData } from '@/lib/store';

export async function GET() {
  return NextResponse.json(getCRMData());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const created = createLead({
    name: body.name,
    company: body.company,
    email: body.email || 'unknown@email.com',
    score: Number(body.score || 80),
    status: body.status || 'In Review',
    value: Number(body.value || 15000),
  });

  return NextResponse.json({ success: true, lead: created });
}
