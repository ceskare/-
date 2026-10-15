import React, { useState, useEffect } from 'react';
import { SoundEngine } from '../services/audio.ts';
import { Dices, CheckCircle, XCircle } from 'lucide-react';

interface DiceRollerProps {
  isOpen: boolean;
  targetValue?: number; // Usually 5
  modifier?: number; // e.g. +2 from boots
  purpose: 'runaway' | 'steal' | 'curse';
  playerName: string;
  onRollComplete: (roll: number, success: boolean) => void;
  onClose?: () => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  isOpen,
  targetValue = 5,
  modifier = 0,
  purpose,
  playerName,
  onRollComplete,
  onClose
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentFace, setCurrentFace] = useState(1);
  const [hasRolled, setHasRolled] = useState(false);
  const [finalRoll, setFinalRoll] = useState<number | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHasRolled(false);
      setFinalRoll(null);
      setSuccess(null);
      triggerRoll();
    }
  }, [isOpen]);

  const triggerRoll = () => {
    if (isRolling) return;
    setIsRolling(true);

    let count = 0;
    const interval = setInterval(() => {
      const face = Math.floor(Math.random() * 6) + 1;
      setCurrentFace(face);
      SoundEngine.playDiceClick();
      count++;

      if (count > 12) {
        clearInterval(interval);
        const result = Math.floor(Math.random() * 6) + 1;
        setCurrentFace(result);
        setFinalRoll(result);
        setIsRolling(false);
        setHasRolled(true);

        const total = result + modifier;
        const isSuccess = total >= targetValue;
        setSuccess(isSuccess);

        if (isSuccess) {
          SoundEngine.playFleeSuccess();
        } else {
          SoundEngine.playCurse();
        }

        setTimeout(() => {
          onRollComplete(result, isSuccess);
        }, 1200);
      }
    }, 70);
  };

  if (!isOpen) return null;

  const totalScore = (finalRoll || currentFace) + modifier;

  // Dice dot positions for authentic d6
  const renderDots = (num: number) => {
    switch (num) {
      case 1:
        return <div className="w-4 h-4 bg-red-600 rounded-full m-auto" />;
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <div className="w-3.5 h-3.5 bg-stone-900 rounded-full" />
            <div className="w-3.5 h-3.5 bg-stone-900 rounded-full self-end" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <div className="w-3 h-3 bg-stone-900 rounded-full" />
            <div className="w-3 h-3 bg-stone-900 rounded-full self-center" />
            <div className="w-3 h-3 bg-stone-900 rounded-full self-end" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 p-2 place-items-center">
            <div className="w-3 h-3 bg-stone-900 rounded-full" />
            <div className="w-3 h-3 bg-stone-900 rounded-full" />
            <div className="w-3 h-3 bg-stone-900 rounded-full" />
            <div className="w-3 h-3 bg-stone-900 rounded-full" />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full relative p-2">
            <div className="absolute top-2 left-2 w-3 h-3 bg-stone-900 rounded-full" />
            <div className="absolute top-2 right-2 w-3 h-3 bg-stone-900 rounded-full" />
            <div className="absolute inset-0 m-auto w-3 h-3 bg-red-600 rounded-full" />
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-stone-900 rounded-full" />
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-stone-900 rounded-full" />
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-3 p-2 place-items-center">
            <div className="w-3 h-3 bg-stone-900 rounded-full" />
            <div className="w-3 h-3 bg-stone-900 rounded-full" />
            <div className="w-3 h-3 bg-stone-900 rounded-full" />
            <div className="w-3 h-3 bg-stone-900 rounded-full" />
            <div className="w-3 h-3 bg-stone-900 rounded-full" />
            <div className="w-3 h-3 bg-stone-900 rounded-full" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#241a15] border-2 border-amber-600/80 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center text-[#f4ecd8] relative animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-serif font-bold text-amber-300 flex items-center justify-center gap-2">
          <Dices className="w-6 h-6 text-amber-400" />
          {purpose === 'runaway' && 'Бросок на Смывку!'}
          {purpose === 'steal' && 'Бросок на Кражу!'}
          {purpose === 'curse' && 'Бросок Судьбы'}
        </h3>

        <p className="text-xs text-amber-200/80 mt-1">
          {playerName} пытается сбежать от монстра (нужно {targetValue}+)
        </p>

        {/* 3D-styled animated Dice */}
        <div className="my-6 flex justify-center">
          <div
            className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-[#fffbf0] via-[#f7ecd1] to-[#e6d3a8] border-4 border-amber-800 shadow-[0_12px_24px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform ${
              isRolling ? 'rotate-12 scale-110 duration-75' : 'duration-300'
            }`}
          >
            {renderDots(currentFace)}
          </div>
        </div>

        {/* Breakdown readout */}
        <div className="bg-stone-900/80 border border-stone-700/60 rounded-xl p-3 mb-4">
          <div className="text-lg font-mono font-bold flex items-center justify-center gap-2">
            <span>Выпало: {currentFace}</span>
            {modifier !== 0 && (
              <span className="text-emerald-400 text-sm">
                ({modifier > 0 ? `+${modifier}` : modifier} бонус)
              </span>
            )}
            <span>= {totalScore}</span>
          </div>

          {hasRolled && success !== null && (
            <div
              className={`mt-2 font-bold text-sm flex items-center justify-center gap-1.5 ${
                success ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {success ? (
                <>
                  <CheckCircle className="w-4 h-4" /> УСПЕХ! Манчкин благополучно смылся!
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> ПРОВАЛ! Наступает Непотребство...
                </>
              )}
            </div>
          )}
        </div>

        {hasRolled && onClose && (
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 font-bold text-stone-950 transition-colors shadow-lg"
          >
            Продолжить
          </button>
        )}
      </div>
    </div>
  );
};
