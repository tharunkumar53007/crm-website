import { NextRequest, NextResponse } from 'next/server';
import { createLead, getCRMData, updateDealStatus } from '@/lib/store';

export async function GET() {
  return NextResponse.json(getCRMData());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = createLead({
    name: body.name,
    company: body.company,
    email: body.email || 'unknown@email.com',
    score: Number(body.score ?? 80),
    status: body.status || 'In Review',
    value: Number(body.value ?? 15000),
  });

  return NextResponse.json({ success: true, lead: result });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const updated = updateDealStatus(Number(body.id), body.stage);

  if (!updated) {
    return NextResponse.json({ success: false, message: 'Deal not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, deal: updated });
}
