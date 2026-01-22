
import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(
  process.env.AIRTABLE_BASE_ID!
);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, trade, experience, phone, email, notes } = data;

    if (!name || !phone || !trade) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const record = await base('Candidates').create([
      {
        fields: {
          Name: name,
          Trade: trade,
          Experience: Number(experience),
          Status: 'New',
          Phone: phone,
          Email: email,
          'Recruiter Note': notes || '',
        },
      },
    ]);

    return NextResponse.json({ success: true, id: record[0].id });
  } catch (error: any) {
    console.error('Airtable Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application', details: error.message },
      { status: 500 }
    );
  }
}
