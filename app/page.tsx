'use client';

import { useState } from 'react';
import MenuTrainer from '@/components/MenuTrainer';
import StandardsTrainer from '@/components/StandardsTrainer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'menu' | 'standards'>('menu');

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-neutral-200">
      {/* Шапка сайта */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200 px-4 py-3.5 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">Океан · Тренажер</h1>
          <div className="flex bg-neutral-100 p-1 rounded-full text-sm">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-1.5 rounded-full font-medium transition-all ${
                activeTab === 'menu' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Меню
            </button>
            <button
              onClick={() => setActiveTab('standards')}
              className={`px-4 py-1.5 rounded-full font-medium transition-all ${
                activeTab === 'standards' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Сервис
            </button>
          </div>
        </div>
      </header>

      {/* Основной контейнер с адаптивными отступами под мобилки */}
      <div className="max-w-md mx-auto px-4 pt-4 pb-10">
        {activeTab === 'menu' ? <MenuTrainer /> : <StandardsTrainer />}
      </div>
    </main>
  );
}