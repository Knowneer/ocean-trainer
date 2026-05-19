'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { allMenuData } from '@/data/database';

export default function MenuTrainer() {
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof allMenuData>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState<'photo' | 'ingredients'>('photo'); 
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Перемешивание вопросов при старте
  useEffect(() => {
    const shuffled = [...allMenuData].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [quizMode,allMenuData]);

  const currentDish = shuffledQuestions[currentIndex];

  // Генерация вариантов ответов
  useEffect(() => {
    if (!currentDish) return;

    if (quizMode === 'photo') {
      const wrongNames = allMenuData
        .filter(d => d.id !== currentDish.id && d.category === currentDish.category)
        .map(d => d.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setOptions([...wrongNames, currentDish.name].sort(() => Math.random() - 0.5));
    } else {
      const wrongIngredients = allMenuData
        .filter(d => d.id !== currentDish.id)
        .map(d => d.ingredients.slice(0, 5).join(', '))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setOptions([...wrongIngredients, currentDish.ingredients.join(', ')].sort(() => Math.random() - 0.5));
    }
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [currentDish, quizMode, allMenuData]);

  const handleAnswerClick = (option: string) => {
    if (selectedAnswer) return; // Запрет повторного клика

    setSelectedAnswer(option);
    const correctTarget = quizMode === 'photo' ? currentDish.name : currentDish.ingredients.join(', ');
    const check = option === correctTarget;
    setIsCorrect(check);
    if (check) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 < shuffledQuestions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <Card className="w-full border-0 sm:border shadow-none">
        <CardHeader><CardTitle className="text-center text-2xl">Тест завершен!</CardTitle></CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg">Твой результат: <span className="font-bold text-primary">{score}</span> из {shuffledQuestions.length}</p>
          <Button onClick={() => setShuffledQuestions([...allMenuData].sort(() => Math.random() - 0.5))} className="w-full py-6 text-lg">Пройти заново</Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentDish) return <div className="text-center p-4">Загрузка меню...</div>;

  return (
    <div className="space-y-4 pb-12">
      {/* Переключатель режимов */}
      <div className="flex gap-2 bg-muted p-1 rounded-lg">
        <Button 
          variant={quizMode === 'photo' ? 'default' : 'ghost'} 
          className="flex-1 text-xs sm:text-sm"
          onClick={() => setQuizMode('photo')}
        >
          Угадай по фото
        </Button>
        <Button 
          variant={quizMode === 'ingredients' ? 'default' : 'ghost'} 
          className="flex-1 text-xs sm:text-sm"
          onClick={() => setQuizMode('ingredients')}
        >
          Угадай состав
        </Button>
      </div>

      <Card className="border-0 sm:border shadow-none">
        <CardHeader className="pb-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{currentDish.category}</div>
          <CardTitle className="text-xl">
            {quizMode === 'photo' ? 'Что это за блюдо?' : `Что входит в состав: ${currentDish.name}?`}
          </CardTitle>
          <div className="text-xs text-muted-foreground">Вопрос {currentIndex + 1} из {shuffledQuestions.length}</div>
        </CardHeader>

        <CardContent className="space-y-4">
          {quizMode === 'photo' && currentDish.image && (
            <div className="relative w-full h-52 sm:h-64 overflow-hidden rounded-xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={currentDish.image} 
                alt="Dish" 
                className="object-cover w-full h-full"
                onError={(e) => {
                  // Фоллбек если картинки еще не загружены в папку
                  e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500";
                }}
              />
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            {options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const correctTarget = quizMode === 'photo' ? currentDish.name : currentDish.ingredients.join(', ');
              const isOptionCorrect = option === correctTarget;

              let btnVariant: "outline" | "default" | "destructive" = "outline";
              if (selectedAnswer) {
                if (isOptionCorrect) btnVariant = "default"; // Подсветка правильного зеленым (или дефолтным цветом)
                else if (isSelected) btnVariant = "destructive"; // Подсветка неверного выбора красным
              }

              return (
                <Button
                  key={index}
                  variant={btnVariant}
                  className={`h-auto py-3.5 px-4 text-left justify-start whitespace-normal font-normal text-sm sm:text-base transition-all ${
                    selectedAnswer && isOptionCorrect ? 'bg-emerald-600 text-white hover:bg-emerald-600' : ''
                  }`}
                  onClick={() => handleAnswerClick(option)}
                >
                  {option}
                </Button>
              );
            })}
          </div>

          {selectedAnswer && (
            <div className="pt-2 space-y-3">
              <div className={`p-3 rounded-lg text-sm ${isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                <p className="font-semibold">{isCorrect ? 'Правильно!' : 'Неверно!'}</p>
                <p className="text-xs mt-1 leading-relaxed"><span className="font-medium">Описание:</span> {currentDish.description}</p>
              </div>
              <Button onClick={handleNext} className="w-full py-5 text-base">Дальше</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}