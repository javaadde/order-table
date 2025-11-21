import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/google';

type SheetRow = {
  name: string;
  token: string;
};

export async function GET(
  req: Request
): Promise<
  NextResponse<{ data: SheetRow[]; success: boolean }> |
  NextResponse<{ error: string; success: boolean }>
> {
  try {
    const data: SheetRow[] = await getSheetData();
    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error('Error fetching sheet:', (error as Error).message);
    return NextResponse.json(
      { error: 'Failed to fetch data', success: false },
      { status: 500 }
    );
  }
}
