import React from 'react';
import { BookOpen, X, Shield, Swords, Flame, Skull, Coins, Crown } from 'lucide-react';
import { SoundEngine } from '../services/audio.ts';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#241a15] border-2 border-amber-600 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl text-[#f4ecd8] relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h2 className="text-lg font-serif font-bold text-amber-300">
              Справочник Правил Манчкина (Манчкинопедия)
            </h2>
          </div>
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onClose();
            }}
            className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Rules Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs leading-relaxed text-stone-200">
          <section className="bg-stone-900/60 p-3.5 rounded-xl border border-stone-800">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5 mb-2">
              <Crown className="w-4 h-4 text-amber-400" />
              1. Главная цель игры
            </h3>
            <p>
              Первый игрок, достигший <span className="font-bold text-amber-300">10-го Уровня</span>,
              немедленно объявляется абсолютным победителем! Победный 10-й уровень можно получить
              ТОЛЬКО убив монстра в бою (зелья повышения и продажа шмоток дают максимум 9 уровень).
            </p>
          </section>

          <section className="bg-stone-900/60 p-3.5 rounded-xl border border-stone-800">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5 mb-2">
              <Swords className="w-4 h-4 text-emerald-400" />
              2. Фазы хода манчкина
            </h3>
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>
                <span className="font-bold text-amber-200">Вышибаем дверь:</span> Возьми верхнюю карту
                из колоды дверей в открытую. Если там Монстр — бой начинается немедленно! Если
                Проклятие — оно сразу обрушивается на тебя. Если другая карта — бери её в руку.
              </li>
              <li>
                <span className="font-bold text-amber-200">Ищем неприятности или Чистим нычки:</span>{' '}
                Если за дверью не было монстра, ты можешь сыграть монстра из своей руки и сразиться с
                ним («Искать неприятности»), либо взять вторую карту дверей в закрытую («Чистить
                нычки»).
              </li>
              <li>
                <span className="font-bold text-amber-200">От щедрот:</span> В конце хода у тебя в
                руке должно остаться не более 5 карт (или 6 для Дварфа). Излишки отдаются игрокам с
                наименьшим уровнем.
              </li>
            </ol>
          </section>

          <section className="bg-stone-900/60 p-3.5 rounded-xl border border-stone-800">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5 mb-2">
              <Flame className="w-4 h-4 text-red-500" />
              3. Правила боя и Смывка
            </h3>
            <p className="mb-2">
              Боевая сила манчкина = Твой Уровень + Бонусы всех надетых шмоток + Одноразовые зелья.
              Если твоя сила СТРОГО БОЛЬШЕ силы монстра (или РАВНА, если ты Воин) — ты победил!
            </p>
            <p className="mb-2">
              <span className="font-bold text-rose-300">Смывка:</span> Если монстр сильнее, ты
              обязан попытаться смыться: бросай кубик d6. При выпадении 5 или 6 ты успешно сбегаешь.
              Иначе монстр творит <span className="font-bold text-rose-400">Непотребство</span>{' '}
              (потеря уровней, сброс шмота или смерть!).
            </p>
            <p>
              <span className="font-bold text-indigo-300">Помощь друга:</span> Ты можешь позвать
              одного игрока на помощь. Его боевая сила прибавится к твоей. Взамен вы делите сокровища.
            </p>
          </section>

          <section className="bg-stone-900/60 p-3.5 rounded-xl border border-stone-800">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5 mb-2">
              <Coins className="w-4 h-4 text-amber-400" />
              4. Шмотки, Слоты и Золото
            </h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>1 Головняк, 1 Броня, 1 Обувка.</li>
              <li>2 Оружия в 1 руку ИЛИ 1 Двуручное оружие.</li>
              <li>Только 1 большая шмотка (если ты не Дварф).</li>
              <li>
                Шмотки на сумму 1000 голдов можно сбросить в любой момент своего хода, чтобы
                получить +1 Уровень!
              </li>
            </ul>
          </section>

          <section className="bg-stone-900/60 p-3.5 rounded-xl border border-stone-800">
            <h3 className="text-sm font-bold text-amber-300 mb-2">
              5. Классы и Расы
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="font-bold text-amber-200">Воин:</span> побеждает вничью.
              </div>
              <div>
                <span className="font-bold text-indigo-300">Волшебник:</span> +1 к смывке, усмирение.
              </div>
              <div>
                <span className="font-bold text-emerald-300">Вор:</span> подрезка в бою, кража.
              </div>
              <div>
                <span className="font-bold text-yellow-300">Клирик:</span> +3 против нежити.
              </div>
              <div>
                <span className="font-bold text-teal-300">Эльф:</span> +1 уровень за помощь, +1 смывка.
              </div>
              <div>
                <span className="font-bold text-stone-300">Дварф:</span> много больших шмоток, 6 карт в руке.
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-stone-950 text-xs transition-colors shadow-lg cursor-pointer"
          >
            Понятно, в бой!
          </button>
        </div>
      </div>
    </div>
  );
};
