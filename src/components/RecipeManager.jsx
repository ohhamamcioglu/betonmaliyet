import React from 'react';
import { FlaskConical, RotateCcw, Calculator, ArrowRight } from 'lucide-react';
import { CONCRETE_CLASSES, DEFAULT_RECIPES } from '../data/defaultData';

export default function RecipeManager({ recipes, setRecipes, onOpenMethodology }) {
  
  const handleRecipeChange = (cls, field, value) => {
    if (value === '' || value === undefined) {
      setRecipes(prev => ({
        ...prev,
        [cls]: {
          ...prev[cls],
          [field]: ''
        }
      }));
      return;
    }
    const num = parseFloat(value);
    setRecipes(prev => ({
      ...prev,
      [cls]: {
        ...prev[cls],
        [field]: isNaN(num) ? '' : num
      }
    }));
  };

  const handleResetRecipes = () => {
    setRecipes(DEFAULT_RECIPES);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              🧪 BETON REÇETE VE KARIŞIM HESAPLARI (1 m³ İÇİN MİKTARLAR)
            </h2>
            <p className="text-xs text-slate-400">
              Her beton sınıfı için 1 m³ karışıma giren Çimento (kg) ve Agrega (kg) dozajlarını özelleştirin.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenMethodology && (
            <button
              onClick={onOpenMethodology}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/20 transition active:scale-95"
            >
              <Calculator className="w-3.5 h-3.5 mr-1.5" />
              📐 Hesaplama Yöntemi & Formüller
            </button>
          )}

          <button
            onClick={handleResetRecipes}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
            Reçeteleri Sıfırla
          </button>
        </div>
      </div>

      {/* Informational Callout */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-500/10 via-slate-900 to-indigo-500/10 border border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5 text-slate-300">
          <Calculator className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Bu reçete dozajlarının nakliye, işçilik ve operasyon maliyetleriyle nasıl birleşip satış fiyatına dönüştüğünü adım adım görmek ister misiniz?</span>
        </div>
        {onOpenMethodology && (
          <button
            onClick={onOpenMethodology}
            className="text-sky-400 hover:text-sky-300 font-bold underline whitespace-nowrap text-left sm:text-right flex items-center"
          >
            <span>Formül Rehberini İncele</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        )}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONCRETE_CLASSES.map((cls) => {
          const recipe = recipes[cls] || { cimento: 300, agrega: 1900 };

          const cimentoVal = Number(recipe.cimento) || 0;

          return (
            <div 
              key={cls}
              className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 hover:border-sky-500/30 transition-all space-y-3"
            >
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-sm font-extrabold text-white font-sans">{cls} Beton Sınıfı</span>
                <span className="text-[10px] font-mono text-slate-400">1 m³ Reçetesi</span>
              </div>

              {/* Çimento Dozajı */}
              <div>
                <label className="block text-xs font-bold text-sky-300 mb-1">
                  Çimento Dozajı (kg / m³)
                </label>
                <input
                  type="number"
                  step="5"
                  value={recipe.cimento ?? ''}
                  onChange={(e) => handleRecipeChange(cls, 'cimento', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Agrega Dozajı */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  Agrega Dozajı (kg / m³)
                </label>
                <input
                  type="number"
                  step="10"
                  value={recipe.agrega ?? ''}
                  onChange={(e) => handleRecipeChange(cls, 'agrega', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Katkı Dozajı Info */}
              <div className="p-2 bg-slate-900/80 rounded border border-slate-800/80 text-[11px] text-slate-400 flex justify-between font-mono">
                <span>Katkı (%1 Oranıyla):</span>
                <span className="font-bold text-emerald-400">
                  {recipe.katkiOverride !== undefined ? recipe.katkiOverride : (cimentoVal * 0.01).toFixed(2)} kg
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
