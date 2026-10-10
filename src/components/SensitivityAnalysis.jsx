import React, { useState } from 'react';
import { Sliders, Zap, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { calculateConcreteCosts, formatCurrency, formatPercent } from '../utils/calculator';
import { CONCRETE_CLASSES, PRODUCTION_TYPES } from '../data/defaultData';

export default function SensitivityAnalysis({ baseInputs, recipes }) {
  // Slider states (multiplier percentages: 0 = no change, +20 = %20 artış)
  const [mazotChangePct, setMazotChangePct] = useState(0);
  const [cimentoChangePct, setCimentoChangePct] = useState(0);
  const [dolarChangePct, setDolarChangePct] = useState(0);
  const [agregaChangePct, setAgregaChangePct] = useState(0);

  const [simClass, setSimClass] = useState('C 25');
  const [simType, setSimType] = useState('MİKSERLİ');

  // Compute Base
  const baseCalc = calculateConcreteCosts(baseInputs, recipes);
  const basePriceObj = baseCalc.classResults[simClass]?.productionTypes[simType];
  const baseCost = basePriceObj ? basePriceObj.baseCost : 0;
  const basePriceTier2 = basePriceObj ? basePriceObj.tier2.incl : 0;

  // Compute Simulated Inputs
  const simulatedInputs = {
    ...baseInputs,
    mazotFiyati: baseInputs.mazotFiyati * (1 + mazotChangePct / 100),
    cimentoFiyati: baseInputs.cimentoFiyati * (1 + cimentoChangePct / 100),
    dolarKuru: baseInputs.dolarKuru * (1 + dolarChangePct / 100),
    agregaFiyati: baseInputs.agregaFiyati * (1 + agregaChangePct / 100),
  };

  const simCalc = calculateConcreteCosts(simulatedInputs, recipes);
  const simPriceObj = simCalc.classResults[simClass]?.productionTypes[simType];
  const simCost = simPriceObj ? simPriceObj.baseCost : 0;
  const simPriceTier2 = simPriceObj ? simPriceObj.tier2.incl : 0;

  const costDelta = simCost - baseCost;
  const priceDelta = simPriceTier2 - basePriceTier2;

  // Monthly total impact (Monthly volume = gunlukDokum * aylikGun)
  const monthlyVolume = (baseInputs.gunlukDokum || 140) * (baseInputs.aylikGunSayisi || 30);
  const totalMonthlyImpact = costDelta * monthlyVolume;

  const handleResetSim = () => {
    setMazotChangePct(0);
    setCimentoChangePct(0);
    setDolarChangePct(0);
    setAgregaChangePct(0);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              ⚡ HASSASİYET VE SENARYO SİMÜLASYONU ("NE OLURSA NE OLUR?")
            </h2>
            <p className="text-xs text-slate-400">
              Mazot, çimento veya döviz artışlarının m³ maliyetinize ve aylık toplam kârlılığınıza etkisini canlı görün.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetSim}
          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
          Simülasyonu Sıfırla
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Sliders Controls (Left 6 Columns) */}
        <div className="lg:col-span-6 bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-5">
          
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
            <span className="text-xs font-bold uppercase text-slate-400">Simülasyon Değişkenleri</span>
            <div className="flex space-x-2">
              <select
                value={simClass}
                onChange={(e) => setSimClass(e.target.value)}
                className="bg-slate-900 text-sky-300 font-bold text-xs px-2.5 py-1 rounded border border-slate-700"
              >
                {CONCRETE_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={simType}
                onChange={(e) => setSimType(e.target.value)}
                className="bg-slate-900 text-amber-300 font-bold text-xs px-2.5 py-1 rounded border border-slate-700"
              >
                {PRODUCTION_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {/* Slider 1: Mazot */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
              <span className="text-slate-300">Mazot Fiyat Değişimi:</span>
              <span className={`font-mono ${mazotChangePct > 0 ? 'text-red-400' : mazotChangePct < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {mazotChangePct > 0 ? `+${mazotChangePct}%` : `${mazotChangePct}%`} ({simulatedInputs.mazotFiyati.toFixed(2)} TL/L)
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="1"
              value={mazotChangePct}
              onChange={(e) => setMazotChangePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Slider 2: Çimento */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
              <span className="text-slate-300">Çimento Fiyat Değişimi:</span>
              <span className={`font-mono ${cimentoChangePct > 0 ? 'text-red-400' : cimentoChangePct < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {cimentoChangePct > 0 ? `+${cimentoChangePct}%` : `${cimentoChangePct}%`} ({simulatedInputs.cimentoFiyati.toFixed(0)} TL/ton)
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="1"
              value={cimentoChangePct}
              onChange={(e) => setCimentoChangePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Slider 3: Dolar */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
              <span className="text-slate-300">Dolar Kuru Değişimi:</span>
              <span className={`font-mono ${dolarChangePct > 0 ? 'text-red-400' : dolarChangePct < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {dolarChangePct > 0 ? `+${dolarChangePct}%` : `${dolarChangePct}%`} ({simulatedInputs.dolarKuru.toFixed(2)} TL)
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="1"
              value={dolarChangePct}
              onChange={(e) => setDolarChangePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Slider 4: Agrega */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
              <span className="text-slate-300">Agrega Fiyat Değişimi:</span>
              <span className={`font-mono ${agregaChangePct > 0 ? 'text-red-400' : agregaChangePct < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {agregaChangePct > 0 ? `+${agregaChangePct}%` : `${agregaChangePct}%`} ({simulatedInputs.agregaFiyati.toFixed(0)} TL/ton)
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="1"
              value={agregaChangePct}
              onChange={(e) => setAgregaChangePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

        </div>

        {/* Dynamic Live Result Display (Right 6 Columns) */}
        <div className="lg:col-span-6 bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Simülasyon Sonuç Özeti ({simClass} - {simType})
            </h3>

            <div className="grid grid-cols-2 gap-3">
              
              {/* Orijinal Birim Maliyet */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Mevcut Kârsız Maliyet</span>
                <span className="text-lg font-bold text-slate-200 font-mono">{formatCurrency(baseCost)}</span>
              </div>

              {/* Simüle Edilen Birim Maliyet */}
              <div className={`p-3 rounded-xl border ${
                costDelta > 0 ? 'bg-red-950/20 border-red-500/30' : 
                costDelta < 0 ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-900/80 border-slate-800'
              }`}>
                <span className="text-[11px] text-slate-300 block font-semibold">Simüle Edilen Maliyet</span>
                <span className={`text-lg font-bold font-mono ${costDelta > 0 ? 'text-red-400' : costDelta < 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {formatCurrency(simCost)}
                </span>
              </div>

            </div>

            {/* Impact Badge */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-300 font-semibold">1 m³ Birim Farkı:</span>
                <span className={`text-sm font-extrabold font-mono ${costDelta > 0 ? 'text-red-400' : costDelta < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {costDelta > 0 ? `+${costDelta.toFixed(2)} ₺` : `${costDelta.toFixed(2)} ₺`}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-300 font-semibold">Aylık Toplam Finansal Etki ({monthlyVolume.toLocaleString('tr-TR')} m³):</span>
                <span className={`text-base font-black font-mono ${totalMonthlyImpact > 0 ? 'text-red-400' : totalMonthlyImpact < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {totalMonthlyImpact > 0 ? `+${formatCurrency(totalMonthlyImpact)}` : formatCurrency(totalMonthlyImpact)}
                </span>
              </div>
            </div>
          </div>

          {totalMonthlyImpact > 0 ? (
            <div className="p-3.5 bg-red-500/10 rounded-xl border border-red-500/20 text-xs text-red-300 flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div>
                <span className="font-bold text-red-200 block mb-0.5">⚠️ Kârlılık Uyarısı (Maliyet Artışı):</span>
                <span>
                  Simüle edilen fiyat artışları m³ maliyetinizi <strong>+{costDelta.toFixed(2)} ₺</strong> artırdı. Satış fiyatlarına doğrudan yansıtılmazsa, bu durum şirket kârlılığınızı aylık ortalama <strong>{formatCurrency(totalMonthlyImpact)}</strong> düşürür.
                </span>
              </div>
            </div>
          ) : totalMonthlyImpact < 0 ? (
            <div className="p-3.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-emerald-300 flex items-start space-x-2.5">
              <TrendingUp className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-200 block mb-0.5">🎉 Kârlılık Fırsatı (Lehinize Değişim):</span>
                <span>
                  Girdi fiyatlarındaki düşüş lehinize işledi! m³ maliyetiniz <strong>{costDelta.toFixed(2)} ₺</strong> azaldı. Satış fiyatları aynı kalırsa, bu durum şirket kârlılığınızı aylık ortalama <strong>{formatCurrency(Math.abs(totalMonthlyImpact))}</strong> arttırır.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-300/90 flex items-start space-x-2.5">
              <Zap className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold text-amber-200 block mb-0.5">💡 Simülasyon Tavsiyesi:</span>
                <span>
                  Slider'ları kaydırarak çimento, mazot, dolar veya agrega fiyat düşüş/artışlarının şirket kârlılığınıza canlı etkisini test edebilirsiniz.
                </span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
