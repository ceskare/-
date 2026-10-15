import React from 'react';
import { DungeonTheme } from '../types/game.ts';
import { Sparkles, X, Check } from 'lucide-react';
import { SoundEngine } from '../services/audio.ts';

interface DungeonThemeSelectorProps {
  isOpen: boolean;
  currentTheme: DungeonTheme;
  onSelectTheme: (theme: DungeonTheme) => void;
  onClose: () => void;
}

export const DungeonThemeSelector: React.FC<DungeonThemeSelectorProps> = ({
  isOpen,
  currentTheme,
  onSelectTheme,
  onClose
}) => {
  if (!isOpen) return null;

  const themes: { id: DungeonTheme; title: string; desc: string; icon: string; previewBg: string }[] = [
    {
      id: 'dungeon',
      title: 'Классическое Подземелье',
      desc: 'Каменные своды, бочка с мечом, факелы и лужа слизи (Doors & Treasures)',
      icon: '🏰',
      previewBg: 'from-[#4d3826] to-[#19110a]'
    },
    {
      id: 'bridge',
      title: 'Пропасть с Мостом и Драконом',
      desc: 'Каменный мост над бездной перед логовом Плутонического Дракона',
      icon: '💀',
      previewBg: 'from-[#2e3b44] to-[#12191f]'
    },
    {
      id: 'crypt',
      title: 'Склеп с Люстрой и Пиццей',
      desc: 'Готический склеп с кованой люстрой, паутиной и постером крутой крысы',
      icon: '🕸️',
      previewBg: 'from-[#3a3528] to-[#15120c]'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#241a15] border-3 border-amber-600 rounded-3xl max-w-md w-full p-5 text-[#f4ecd8] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            onClose();
          }}
          className="absolute top-3 right-3 text-stone-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif font-black text-base text-amber-300 flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Выбор дизайна подземелья (Фоны)
        </h3>
        <p className="text-xs text-stone-400 mb-4">
          Атмосферные фоны, полностью воссозданные по классическому стилю Манчкина.
        </p>

        <div className="space-y-2.5 mb-5">
          {themes.map((th) => {
            const isSelected = currentTheme === th.id;
            return (
              <div
                key={th.id}
                onClick={() => {
                  SoundEngine.playDoorOpen();
                  onSelectTheme(th.id);
                  onClose();
                }}
                className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-950/90 border-amber-400 shadow-lg ring-1 ring-amber-400'
                    : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{th.icon}</span>
                  <div>
                    <div className="font-serif font-bold text-xs text-amber-200">
                      {th.title}
                    </div>
                    <div className="text-[10px] text-stone-400 leading-tight mt-0.5">
                      {th.desc}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 font-serif font-bold text-xs text-stone-300 transition-colors cursor-pointer"
        >
          Готово
        </button>
      </div>
    </div>
  );
};
