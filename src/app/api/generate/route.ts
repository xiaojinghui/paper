import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

    const promptTemplate = fs.readFileSync(path.join(process.cwd(), 'prompt.txt'), 'utf-8');
    
    // 使用环境变量中的代理URL和API KEY
    const PROXY_URL = process.env.GEMINI_PROXY_URL; 
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!PROXY_URL || !API_KEY) {
      return NextResponse.json({ error: 'Missing API configuration' }, { status: 500 });
    }

    const response = await fetch(`${PROXY_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${promptTemplate}\n\n输入文本:\n${text}` }] }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Proxy Error:', errorText);
      return NextResponse.json({ error: 'Proxy request failed' }, { status: response.status });
    }

    const result = await response.json();
    // 解析标准的 Gemini API 响应结构
    const responseText = result.candidates[0].content.parts[0].text;
    
    const jsonString = responseText.replace(/```json\n?|```/g, '').trim();
    const data = JSON.parse(jsonString);

    await dbConnect();
    
    // 确保数据符合模型并保存
    const savedQuestions = await Promise.all(
      data.questions.map((q: any) => new Question({ ...q, metadata: data.metadata }).save())
    );

    return NextResponse.json({ success: true, count: savedQuestions.length });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate or save questions' }, { status: 500 });
  }
}
