import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Layers } from 'lucide-react';
import { CONCRETE_CLASSES, PRODUCTION_TYPES } from '../data/defaultData';
import { formatCurrency, formatPercent } from '../utils/calculator';

const COLORS = ['#38bdf8', '#fbbf24', '#34d399', '#f472b6', '#a78bfa', '#f87171', '#4ade80', '#fb923c'];

export default function CostBreakdownChart({ calculatedData }) {
  const [selectedClass, setSelectedClass] = useState('C 25');
  const [selectedProdType, setSelectedProdType] = useState('POMPALI');

  const classData = calculatedData.classResults[selectedClass];
  const costs = classData?.costs || {};
  const baseCostObj = classData?.productionTypes[selectedProdType];
  const baseCost = baseCostObj ? baseCostObj.baseCost : 0;

  // Calculate specific fuel costs based on production type
  const totalYakit = (costs.kepceMotorinTL || 0) +
    (selectedProdType !== 'SANTRAL ALTI' ? (costs.mikserMotorinTL || 0) : 0) +
    (selectedProdType === 'POMPALI' ? (costs.pompaMotorinTL || 0) : 0);

  // Other expenses (5%)
  const digerGiderTL = baseCost - (
    (costs.cimentoTL || 0) + 
    (costs.agregaTL || 0) + 
    (costs.katkiTL || 0) + 
    (costs.agregaNakliyeTL || 0) + 
    totalYakit + 
    (costs.iscilikTL || 0) + 
    (costs.elektrikTL || 0) + 
    (costs.suTL || 0) + 
    (costs.toplamKiraTL || 0)
  );

  const pieData = [
    { name: 'Çimento', value: Number((costs.cimentoTL || 0).toFixed(2)) },
    { name: 'Agrega (Malzeme)', value: Number((costs.agregaTL || 0).toFixed(2)) },
    { name: 'Agrega Nakliyesi', value: Number((costs.agregaNakliyeTL || 0).toFixed(2)) },
    { name: 'Motorin / Yakıt', value: Number(totalYakit.toFixed(2)) },
    { name: 'İşçilik', value: Number((costs.iscilikTL || 0).toFixed(2)) },
    { name: 'Kimyasal Katkı', value: Number((costs.katkiTL || 0).toFixed(2)) },
    { name: 'Elektrik + Su', value: Number(((costs.elektrikTL || 0) + (costs.suTL || 0)).toFixed(2)) },
    { name: 'Kira & Diğer Gider', value: Number(((costs.toplamKiraTL || 0) + Math.max(0, digerGiderTL)).toFixed(2)) },
  ].filter(d => d.value > 0);

  // Bar Chart Data for all concrete classes
  const barData = CONCRETE_CLASSES.map(cls => {
    const res = calculatedData.classResults[cls]?.productionTypes;
    return {
      class: cls,
      'Pompalı': Math.round(res?.['POMPALI']?.baseCost || 0),
      'Mikserli': Math.round(res?.['MİKSERLİ']?.baseCost || 0),
      'Santral Altı': Math.round(res?.['SANTRAL ALTI']?.baseCost || 0),
    };
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              📈 MALİYET YAPISI VE GRAFİK ANALİZİ
            </h2>
            <p className="text-xs text-slate-400">
              1 m³ hazır beton üretimine etki eden kalemlerin yüzdesel ve parasal dağılımı.
            </p>
          </div>
        </div>

        {/* Selection Switches */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-950 text-sky-300 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-sky-400"
          >
            {CONCRETE_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={selectedProdType}
            onChange={(e) => setSelectedProdType(e.target.value)}
            className="bg-slate-950 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-400"
          >
            {PRODUCTION_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* Grid Layout for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Pie Chart Card (Left 6 Columns) */}
        <div className="lg:col-span-6 bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center">
                <PieIcon className="w-4 h-4 mr-1.5 text-amber-400" />
                {selectedClass} ({selectedProdType}) Maliyet Dağılımı
              </h3>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Toplam: {formatCurrency(baseCost)}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Maliyet']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Item List Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-xs font-mono">
            {pieData.map((item, idx) => {
              const pct = baseCost > 0 ? (item.value / baseCost) * 100 : 0;
              return (
                <div key={item.name} className="flex items-center justify-between p-1.5 rounded bg-slate-900/60 border border-slate-800/50">
                  <div className="flex items-center space-x-1.5 truncate mr-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-slate-300 font-sans text-[11px] truncate">{item.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-100">{item.value} ₺</span>
                    <span className="text-[10px] text-slate-400 block">%{pct.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bar Chart Card (Right 6 Columns) */}
        <div className="lg:col-span-6 bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1.5 text-sky-400" />
                Beton Sınıfları Kârsız Birim Maliyet Karşılaştırması
              </h3>
              <span className="text-[11px] text-slate-400 font-sans">TL / m³</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="class" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    formatter={(val) => [`${val} ₺`, 'Maliyet']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Pompalı" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Mikserli" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Santral Altı" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400 mt-4">
            <span className="font-bold text-slate-200 block mb-0.5">🔍 İnceleme Notu:</span>
            Çimento dozu arttıkça (C16'dan C40'a) birim maliyet yükselir. Pompalı dökümlerde pompa motorin ve kira maliyeti eklendiği için ortalama %8-10 daha yüksek maliyet oluşur.
          </div>

        </div>

      </div>

    </div>
  );
}
