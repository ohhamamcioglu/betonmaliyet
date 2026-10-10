import React, { useState } from 'react';
import { Table, Filter, Layers, FileSpreadsheet, Eye, EyeOff } from 'lucide-react';
import { CONCRETE_CLASSES, PRODUCTION_TYPES } from '../data/defaultData';
import { formatCurrency, formatPercent } from '../utils/calculator';

export default function PriceMatrixTable({ calculatedData, inputs }) {
  const [selectedProdType, setSelectedProdType] = useState('ALL'); // 'ALL', 'POMPALI', 'MİKSERLİ', 'SANTRAL ALTI'
  const [showKdvIncluded, setShowKdvIncluded] = useState(true);

  const k1 = formatPercent(inputs.karOrani1, 0);
  const k2 = formatPercent(inputs.karOrani2, 0);
  const k3 = formatPercent(inputs.karOrani3, 0);

  const renderSection = (prodType) => {
    return (
      <div key={prodType.id} className="mb-8 last:mb-0">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950/90 p-3.5 rounded-t-xl border-x border-t border-slate-800">
          <div className="flex items-center space-x-2.5">
            <span className={`w-3 h-3 rounded-full ${
              prodType.id === 'POMPALI' ? 'bg-amber-400' :
              prodType.id === 'MİKSERLİ' ? 'bg-sky-400' : 'bg-emerald-400'
            }`} />
            <h3 className="text-base font-extrabold text-white tracking-wider uppercase font-sans">
              {prodType.id} HESAPLAMA TABLOSU
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 sm:mt-0 font-medium italic">
            {prodType.desc}
          </p>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-slate-800 rounded-b-xl shadow-lg">
          <table className="w-full text-xs text-left text-slate-300 font-mono">
            
            {/* Table Header */}
            <thead className="text-[11px] uppercase bg-slate-900/90 text-slate-400 border-b border-slate-800 font-sans">
              <tr>
                <th rowSpan="2" className="py-3 px-3 border-r border-slate-800 text-slate-200 font-bold w-24">
                  Beton Sınıfı
                </th>
                <th rowSpan="2" className="py-3 px-3 border-r border-slate-800 text-amber-300 font-bold text-center bg-slate-950/50">
                  Maliyet (Kârsız)
                </th>
                <th colSpan={showKdvIncluded ? 2 : 1} className="py-2 px-3 border-r border-slate-800 text-center bg-slate-900">
                  {k1} Kâr ile Satış
                </th>
                <th colSpan={showKdvIncluded ? 2 : 1} className="py-2 px-3 border-r border-slate-800 text-center bg-amber-500/10 text-amber-300">
                  {k2} Kâr ile Satış
                </th>
                <th colSpan={showKdvIncluded ? 2 : 1} className="py-2 px-3 text-center bg-emerald-500/10 text-emerald-300">
                  {k3} Kâr ile Satış
                </th>
              </tr>

              <tr className="border-t border-slate-800 text-[10px] text-slate-400">
                <th className="py-1.5 px-2 border-r border-slate-800/60 text-center">KDV Hariç</th>
                {showKdvIncluded && <th className="py-1.5 px-2 border-r border-slate-800 text-center text-slate-300 font-semibold">KDV Dahil</th>}

                <th className="py-1.5 px-2 border-r border-slate-800/60 text-center text-amber-300/90">KDV Hariç</th>
                {showKdvIncluded && <th className="py-1.5 px-2 border-r border-slate-800 text-center text-amber-200 font-semibold">KDV Dahil</th>}

                <th className="py-1.5 px-2 border-r border-slate-800/60 text-center text-emerald-300/90">KDV Hariç</th>
                {showKdvIncluded && <th className="py-1.5 px-2 text-center text-emerald-200 font-semibold">KDV Dahil</th>}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {CONCRETE_CLASSES.map((cls, idx) => {
                const classData = calculatedData.classResults[cls];
                const prodData = classData?.productionTypes[prodType.id];
                if (!prodData) return null;

                const { baseCost, tier1, tier2, tier3 } = prodData;

                return (
                  <tr 
                    key={cls}
                    className={`hover:bg-slate-800/60 transition-colors ${
                      idx % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-950/40'
                    }`}
                  >
                    {/* Beton Sınıfı */}
                    <td className="py-2.5 px-3 font-extrabold text-white font-sans border-r border-slate-800 flex items-center justify-between">
                      <span>{cls}</span>
                      <span className="text-[10px] font-mono text-slate-500 font-normal">
                        ({classData.recipe.cimentoKg}kg çim)
                      </span>
                    </td>

                    {/* Maliyet (kârsız) */}
                    <td className="py-2.5 px-3 border-r border-slate-800 text-right font-bold text-slate-300 bg-slate-950/30">
                      {formatCurrency(baseCost)}
                    </td>

                    {/* Tier 1 (%10) */}
                    <td className="py-2.5 px-3 border-r border-slate-800/60 text-right text-slate-300">
                      {formatCurrency(tier1.excl)}
                    </td>
                    {showKdvIncluded && (
                      <td className="py-2.5 px-3 border-r border-slate-800 text-right font-bold text-slate-100 bg-slate-800/30">
                        {formatCurrency(tier1.incl)}
                      </td>
                    )}

                    {/* Tier 2 (%15) */}
                    <td className="py-2.5 px-3 border-r border-slate-800/60 text-right font-semibold text-amber-300/90 bg-amber-500/5">
                      {formatCurrency(tier2.excl)}
                    </td>
                    {showKdvIncluded && (
                      <td className="py-2.5 px-3 border-r border-slate-800 text-right font-extrabold text-amber-300 bg-amber-500/10">
                        {formatCurrency(tier2.incl)}
                      </td>
                    )}

                    {/* Tier 3 (%20) */}
                    <td className="py-2.5 px-3 border-r border-slate-800/60 text-right font-semibold text-emerald-300/90 bg-emerald-500/5">
                      {formatCurrency(tier3.excl)}
                    </td>
                    {showKdvIncluded && (
                      <td className="py-2.5 px-3 text-right font-extrabold text-emerald-300 bg-emerald-500/10">
                        {formatCurrency(tier3.incl)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    );
  };

  const filteredTypes = selectedProdType === 'ALL'
    ? PRODUCTION_TYPES
    : PRODUCTION_TYPES.filter(t => t.id === selectedProdType);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl">
      
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              📋 BETON FİYAT LİSTESİ TABLOSU (TL / m³)
            </h2>
            <p className="text-xs text-slate-400">
              Tüm beton sınıfları ve üretim tipleri için birim maliyet ve kârlılık matrisi.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
          {/* Filter Type Buttons */}
          <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            {[
              { id: 'ALL', label: 'Tümü' },
              { id: 'POMPALI', label: 'Pompalı' },
              { id: 'MİKSERLİ', label: 'Mikserli' },
              { id: 'SANTRAL ALTI', label: 'Santral Altı' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSelectedProdType(btn.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedProdType === btn.id
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Toggle KDV Column */}
          <button
            onClick={() => setShowKdvIncluded(!showKdvIncluded)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
          >
            {showKdvIncluded ? <EyeOff className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />}
            {showKdvIncluded ? 'KDV Dahil Gizle' : 'KDV Dahil Göster'}
          </button>

        </div>
      </div>

      {/* Render Table Sections */}
      <div>
        {filteredTypes.map(type => renderSection(type))}
      </div>

      {/* Footer Legend */}
      <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Tüm fiyatlar 1 m³ hazır beton içindir. Kârsız maliyet; malzeme, nakliye, işçilik, elektrik, su ve kira giderlerini kapsar.</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          * KDV Oranı: %{Math.round(inputs.kdvOrani * 100)} olarak hesaplanmaktadır.
        </span>
      </div>

    </div>
  );
}
