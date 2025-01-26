import Airtable from 'airtable';
import { NextResponse } from 'next/server';

interface AirtableError {
  message: string;
  statusCode?: number;
  error?: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    console.log('Config:', { 
      hasApiKey: !!apiKey, 
      hasBaseId: !!baseId 
    });

    if (!apiKey || !baseId) {
      throw new Error('Missing Airtable configuration');
    }

    const base = new Airtable({ apiKey }).base(baseId);
    const { email } = await req.json();

    console.log('Received email:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    try {
      // Check for existing email
      const existingRecords = await base('waitlist')
        .select({
          filterByFormula: `Email = '${email}'`,
          maxRecords: 1,
        })
        .firstPage();

      if (existingRecords.length > 0) {
        return NextResponse.json(
          { error: 'Already subscribed' },
          { status: 400 }
        );
      }

      const result = await base('waitlist').create([
        {
          fields: {
            Email: email,
            SignupDate: new Date().toISOString()
          }
        }
      ]);

      console.log('Airtable response:', result);

      return NextResponse.json(
        { message: 'Successfully subscribed' },
        { status: 200 }
      );
    } catch (airtableError) {
      console.error('Airtable error:', airtableError);
      throw airtableError;
    }
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe: ' + (error as AirtableError).message },
      { status: 500 }
    );
  }
} 