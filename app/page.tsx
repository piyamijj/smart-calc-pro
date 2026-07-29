"use client";
'use client';
import { useState } from 'react';

export default function Home() {
  const [tab, setTab] = useState<'comp' | 'hist' | 'solve'>('comp');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSolution, setAiSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleBtn = (val: string) => {
    if (val === 'AC') { setInput(''); setResult(''); }
    else if (val === 'DEL') { setInput(prev => prev.slice(0, -1)); }
    else if (val === '=') {
      try {
        const res = eval(input.replace(/×/g, '*').replace(/÷/g, '/'));
        setResult(String(res));
        setHistory(prev => [`${input} = ${res}`, ...prev]);
      } catch {
        setResult('Hata');
      }
    } else {
      setInput(prev => prev + val);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAiSolve = async () => {
    if (!aiPrompt && !selectedImage) return;
    setLoading(true);
    setAiSolution('');
    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: selectedImage, promptText: aiPrompt })
      });
      const data = await res.json();
      setAiSolution(data.result || data.error);
    } catch {
      setAiSolution("Sunucuyla iletişim kurulamadı.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black text-orange-500 flex flex-col justify-between p-4 border border-zinc-800">
      <header className="flex justify-between items-center border-b border-zinc-800 pb-2">
        <h1 className="text-xl font-bold tracking-widest">fx-SMART PRO</h1>
        <span className="text-xs bg-zinc-800 text-orange-400 px-2 py-1 rounded">DEG</span>
      </header>

      {tab === 'comp' && (
        <div className="flex-1 flex flex-col justify-end my-4">
          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-right mb-4">
            <div className="text-zinc-400 text-sm h-6">{input || '0'}</div>
            <div className="text-3xl font-bold text-white h-10">{result || '0'}</div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-white">
            {['AC', 'DEL', '(', ')', 'sin', 'cos', 'tan', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '=']
              .map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleBtn(btn)}
                  className={`p-4 rounded text-lg font-semibold active:opacity-70 ${
                    btn === '=' ? 'bg-orange-600 col-span-2' : btn === 'AC' || btn === 'DEL' ? 'bg-red-900 text-red-200' : 'bg-zinc-900 hover:bg-zinc-800'
                  }`}
                >
                  {btn}
                </button>
              ))}
          </div>
        </div>
      )}

      {tab === 'hist' && (
        <div className="flex-1 my-4 overflow-y-auto">
          <h2 className="text-lg font-bold border-b border-zinc-800 pb-2 mb-2">İşlem Geçmişi</h2>
          {history.length === 0 ? (
            <p className="text-zinc-600">Henüz işlem yapılmadı.</p>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="bg-zinc-900 p-2 my-1 rounded text-white font-mono">{item}</div>
            ))
          )}
        </div>
      )}

      {tab === 'solve' && (
        <div className="flex-1 my-4 flex flex-col gap-3 text-white overflow-y-auto">
          <h2 className="text-lg font-bold text-orange-500 border-b border-zinc-800 pb-2">AI Kamera & Ekran Çözücü</h2>
          <textarea
            placeholder="Sorunu yaz veya aşağıdan fotoğraf yükle..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-white focus:outline-none"
            rows={3}
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs text-zinc-400" />
          {selectedImage && <img src={selectedImage} alt="Önizleme" className="max-h-32 object-contain rounded border border-zinc-800" />}
          <button
            onClick={handleAiSolve}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded transition"
          >
            {loading ? "AI Çözüyor..." : "Adım Adım Çöz"}
          </button>
          {aiSolution && (
            <div className="bg-zinc-900 p-3 rounded border border-zinc-800 text-sm whitespace-pre-wrap leading-relaxed text-zinc-200">
              {aiSolution}
            </div>
          )}
        </div>
      )}

      <nav className="flex justify-around border-t border-zinc-800 pt-3 text-xs">
        <button onClick={() => setTab('comp')} className={tab === 'comp' ? 'text-orange-500 font-bold' : 'text-zinc-500'}>COMP</button>
        <button onClick={() => setTab('hist')} className={tab === 'hist' ? 'text-orange-500 font-bold' : 'text-zinc-500'}>HIST</button>
        <button onClick={() => setTab('solve')} className={tab === 'solve' ? 'text-orange-500 font-bold' : 'text-zinc-500'}>SOLVE (AI)</button>
      </nav>
    </div>
  );
}
