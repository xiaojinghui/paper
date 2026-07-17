import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET() {
  try {
    await dbConnect();
    const questions = await Question.find({}).sort({ createdAt: -1 });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
