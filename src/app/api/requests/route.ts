
import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(
    process.env.AIRTABLE_BASE_ID!
);

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { companyName, contactPerson, email, city, trades, url, phone, amount, projectType, description, startDate } = data;

        if (!companyName || !email || !trades || !Array.isArray(trades) || trades.length === 0 || !description) {
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
                    'Trade': trades, // trades is now an array
                    'URL': url,
                    'Phone': phone,
                    'Count': Number(amount),
                    'Project Type': projectType,
                    'Description': description,
                    'StartDate': startDate,
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
