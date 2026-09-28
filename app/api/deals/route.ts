import { NextRequest, NextResponse } from 'next/server';
import { updateDealStatus } from '@/lib/store';

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const updated = updateDealStatus(Number(body.id), body.stage);

  if (!updated) {
    return NextResponse.json({ success: false, message: 'Deal not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, deal: updated });
}
