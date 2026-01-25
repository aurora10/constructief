
import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(
  process.env.AIRTABLE_BASE_ID!
);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, trades, experience, phone, email, notes } = data;

    // Validate required fields - trades should be an array with at least one item
    if (!name || !phone || !trades || !Array.isArray(trades) || trades.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For Airtable Multiple Select fields, pass the array directly
    const record = await base('Candidates').create([
      {
        fields: {
          Name: name,
          Trade: trades, // Airtable Multiple Select expects an array
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
