'use client';
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setMessage('正在调用 AI 生成并保存题目...');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`成功生成并保存 ${data.count} 道题目！`);
      } else {
        setMessage(`错误: ${data.error}`);
      }
    } catch (e) {
      setMessage('生成失败，请检查 API 配置。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">古诗文命题助手</h1>
      <textarea
        className="w-full h-64 p-4 border rounded mb-4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入古诗文原文或背景信息..."
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? '生成中...' : '生成题目并存入题库'}
      </button>
      {message && <p className="mt-4 font-medium">{message}</p>}
      <a href="/quiz" className="block mt-6 text-blue-500 underline">前往答题练习</a>
    </main>
  );
}
