
import Airtable from 'airtable';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(
    process.env.AIRTABLE_BASE_ID
);

async function inspectExistingRecords() {
    console.log('\n--- Inspecting Existing Records ---');
    try {
        const records = await base('Candidates').select({ maxRecords: 5 }).firstPage();
        if (records.length === 0) {
            console.log("No records found to inspect.");
            return;
        }
        records.forEach(record => {
            const val = record.get('Recruiter Note');
            console.log(`ID: ${record.id} | Fields Found: ${JSON.stringify(Object.keys(record.fields))} | Val:`, val, `| Type: ${typeof val} | IsArray: ${Array.isArray(val)}`);
        });
    } catch (err) {
        console.error('Fetch Failed:', err);
    }
}

inspectExistingRecords();
