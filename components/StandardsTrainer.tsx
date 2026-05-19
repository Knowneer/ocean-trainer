'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { standardsData, guestTypesData } from '@/data/database';

export default function StandardsTrainer() {
  const [subMode, setSubMode] = useState<'situations' | 'psychotypes'>('situations');
  
  // Состояния для теста по ситуациям
  const [currentSecIndex, setCurrentSecIndex] = useState(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  // Генерация перемешанных ответов для текущего вопроса
  const currentSituation = standardsData[currentSecIndex];
  const allOptions = currentSituation 
    ? [...currentSituation.wrong, currentSituation.correct].sort(() => Math.random() - 0.5)
    : [];

  const handleSituationAnswer = (ans: string) => {
    if (selectedAns) return;
    setSelectedAns(ans);
    if (ans === currentSituation.correct) setScore(s => s + 1);
  };

  return (
    <div className="space-y-4 pb-12">
      <div className="flex gap-2 bg-muted p-1 rounded-lg">
        <Button 
          variant={subMode === 'situations' ? 'default' : 'ghost'} 
          className="flex-1 text-xs sm:text-sm"
          onClick={() => setSubMode('situations')}
        >
          Решение ситуаций
        </Button>
        <Button 
          variant={subMode === 'psychotypes' ? 'default' : 'ghost'} 
          className="flex-1 text-xs sm:text-sm"
          onClick={() => setSubMode('psychotypes')}
        >
          Психотипы гостей
        </Button>
      </div>

      {subMode === 'situations' ? (
        <Card className="border-0 sm:border shadow-none">
          <CardHeader>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Стандарты сервиса</div>
            <CardTitle className="text-lg leading-snug">{currentSituation?.situation}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              {allOptions.map((opt, i) => {
                let btnVar: "outline" | "default" | "destructive" = "outline";
                if (selectedAns) {
                  if (opt === currentSituation.correct) btnVar = "default";
                  else if (selectedAns === opt) btnVar = "destructive";
                }
                return (
                  <Button
                    key={i}
                    variant={btnVar}
                    className={`h-auto py-3 px-4 text-left justify-start whitespace-normal text-sm ${
                      selectedAns && opt === currentSituation.correct ? 'bg-emerald-600 hover:bg-emerald-600 text-white' : ''
                    }`}
                    onClick={() => handleSituationAnswer(opt)}
                  >
                    {opt}
                  </Button>
                );
              })}
            </div>

            {selectedAns && (
              <Button 
                onClick={() => {
                  setSelectedAns(null);
                  if (currentSecIndex + 1 < standardsData.length) {
                    setCurrentSecIndex(s => s + 1);
                  } else {
                    alert(`Тест пройден! Успешно решено ситуаций: ${score} из ${standardsData.length}`);
                    setCurrentSecIndex(0);
                    setScore(0);
                  }
                }} 
                className="w-full py-5 text-base mt-2"
              >
                Следующая ситуация
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {guestTypesData.map((guest) => (
            <Card key={guest.id} className="overflow-hidden border shadow-sm">
              <CardHeader className="bg-muted/40 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    guest.type === 'Экспрессивный' ? 'bg-amber-500' :
                    guest.type === 'Прямолинейный' ? 'bg-rose-500' :
                    guest.type === 'Дружелюбный' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />
                  {guest.type} тип гостя 
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2 text-sm leading-relaxed">
                <div>
                  <span className="font-semibold text-muted-foreground block text-xs uppercase">Поведение:</span>
                  <p className="text-neutral-700">{guest.behavior} </p>
                </div>
                <div className="pt-1 border-t border-dashed">
                  <span className="font-semibold text-emerald-700 block text-xs uppercase">Как работать:</span>
                  <p className="text-emerald-900 font-medium">{guest.strategy} </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}