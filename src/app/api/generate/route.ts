import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

    const promptTemplate = fs.readFileSync(path.join(process.cwd(), 'prompt.txt'), 'utf-8');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(`${promptTemplate}\n\n输入文本:\n${text}`);
    const responseText = result.response.text();
    
    const jsonString = responseText.replace(/```json\n?|```/g, '').trim();
    const data = JSON.parse(jsonString);

    await dbConnect();
    
    const savedQuestions = await Promise.all(
      data.questions.map((q: any) => new Question({ ...q, metadata: data.metadata }).save())
    );

    return NextResponse.json({ success: true, count: savedQuestions.length });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate or save questions' }, { status: 500 });
  }
}
