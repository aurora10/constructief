
import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(
    process.env.AIRTABLE_BASE_ID!
);

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { companyName, contactPerson, email, city, trade, url, phone } = data;

        if (!companyName || !email) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const record = await base('Employers').create([
            {
                fields: {
                    'Company Name': companyName,
                    'Contact Person': contactPerson,
                    'Email': email,
                    'City': city,
                    'Trade': trade,
                    'URL': url,
                    'Phone': phone,
                },
            },
        ]);

        return NextResponse.json({ success: true, id: record[0].id });
    } catch (error: any) {
        console.error('Airtable Error:', error);
        return NextResponse.json(
            { error: 'Failed to submit request', details: error.message },
            { status: 500 }
        );
    }
}
