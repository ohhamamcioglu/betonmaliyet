import React, { useState } from 'react';
import { Search, TrendingUp, DollarSign, Zap, Fuel, Truck, Layers, Info, MapPin, ExternalLink, Map } from 'lucide-react';
import { CONCRETE_CLASSES, PRODUCTION_TYPES } from '../data/defaultData';
import { AFYON_LOCATIONS, PLANT_ADDRESS } from '../data/afyonLocations';
import { formatCurrency, formatPercent } from '../utils/calculator';

export default function QuickLookup({ calculatedData, inputs, setInputs }) {
  const [selectedType, setSelectedType] = useState('MİKSERLİ');
  const [selectedClass, setSelectedClass] = useState('C 25');
  const [selectedProfitKey, setSelectedProfitKey] = useState('tier2'); // tier1, tier2, tier3
  const [selectedLocationObj, setSelectedLocationObj] = useState(null);
  const [showEmbeddedMap, setShowEmbeddedMap] = useState(false);

  const classData = calculatedData.classResults[selectedClass];
  const prodData = classData?.productionTypes[selectedType];
  const activeProfitObj = prodData ? prodData[selectedProfitKey] : null;

  const baseCost = prodData ? prodData.baseCost : 0;
  const priceExcl = activeProfitObj ? activeProfitObj.excl : 0;
  const priceIncl = activeProfitObj ? activeProfitObj.incl : 0;
  const profitMarginTL = priceExcl - baseCost;

  const costs = classData?.costs || {};
  const recipe = classData?.recipe || {};

  const handleLocationSelect = (e) => {
    const locId = e.target.value;
    const loc = AFYON_LOCATIONS.find(l => l.id === locId);
    if (loc) {
      setSelectedLocationObj(loc);
      setInputs(prev => ({ ...prev, dokumMesafesi: loc.distanceKm }));
    } else {
      setSelectedLocationObj(null);
    }
  };

  const getGoogleMapsRouteUrl = () => {
    const destName = selectedLocationObj ? selectedLocationObj.name : 'Bolvadin Afyonkarahisar';
    // Direct Plus Code search origin M27V+MQ Bolvadin
    return `https://www.google.com/maps/dir/?api=1&origin=M27V%2BMQ+Bolvadin&destination=${encodeURIComponent(destName + ' Afyonkarahisar')}`;
  };

  const getGoogleMapsEmbedUrl = () => {
    const query = selectedLocationObj 
      ? `M27V+MQ Bolvadin to ${selectedLocationObj.name} Afyonkarahisar` 
      : 'M27V+MQ Bolvadin';
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl glow-amber relative overflow-hidden">
      {/* Decorative subtle background gradient */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -top-12 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              🔍 HIZLI FİYAT SORGULAMA PANELİ
            </h2>
            <p className="text-xs text-slate-400">
              Üretim tipi, beton sınıfı, mesafe ve kâr oranını seçin; maliyet ve satış fiyatı anında hesaplansın.
            </p>
          </div>
        </div>

        {/* Plant Base Badge */}
        <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-amber-300 block text-[11px]">Santral Plus Code</span>
            <span className="text-[11px] text-sky-400 font-mono font-bold">M27V+MQ Bolvadin</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Selection Form Controls (Left 5 Columns) */}
        <div className="lg:col-span-5 space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          
          {/* Üretim Tipi */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              1. Üretim Tipi Seçimi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRODUCTION_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                    selectedType === type.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center">
              <Info className="w-3 h-3 mr-1 text-sky-400 inline" />
              {PRODUCTION_TYPES.find(t => t.id === selectedType)?.desc}
            </p>
          </div>

          {/* Beton Sınıfı */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              2. Beton Sınıfı Seçimi
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {CONCRETE_CLASSES.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`py-2 text-xs font-extrabold rounded-lg border transition-all ${
                    selectedClass === cls
                      ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Döküm Konumu & Şantiye Mesafesi */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase text-slate-400">
                3. Şantiye / Döküm Yeri Seçimi (Afyon)
              </label>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                {inputs.dokumMesafesi || 13} km
              </span>
            </div>

            <select
              onChange={handleLocationSelect}
              className="w-full bg-slate-900 text-sky-300 font-bold text-xs p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-sky-400"
            >
              <option value="">📍 Şantiye Konumu Seçin (Afyonkarahisar / Bolvadin & Tüm İlçeler)</option>
              {Object.entries(
                AFYON_LOCATIONS.reduce((acc, loc) => {
                  acc[loc.category] = acc[loc.category] || [];
                  acc[loc.category].push(loc);
                  return acc;
                }, {})
              ).map(([category, locations]) => (
                <optgroup key={category} label={`--- ${category} ---`}>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.distanceKm} km)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Google Maps Actions */}
            <div className="flex items-center justify-between gap-2 mt-2">
              <a
                href={getGoogleMapsRouteUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25 transition"
              >
                <ExternalLink className="w-3 h-3 mr-1 text-sky-400" />
                M27V+MQ Rota Aç
              </a>

              <button
                type="button"
                onClick={() => setShowEmbeddedMap(!showEmbeddedMap)}
                className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
              >
                <Map className="w-3 h-3 mr-1 text-amber-400" />
                {showEmbeddedMap ? 'Haritayı Gizle' : 'Haritayı Göster'}
              </button>
            </div>

            {/* Embedded Google Map */}
            {showEmbeddedMap && (
              <div className="mt-3 rounded-xl overflow-hidden border border-slate-700 shadow-md">
                <iframe
                  title="Google Maps Navigation Preview"
                  width="100%"
                  height="180"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={getGoogleMapsEmbedUrl()}
                />
              </div>
            )}
          </div>

          {/* Kâr Oranı */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              4. Kâr Oranı Seviyesi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'tier1', label: `%${(inputs.karOrani1 * 100).toFixed(0)} Kâr`, val: inputs.karOrani1 },
                { key: 'tier2', label: `%${(inputs.karOrani2 * 100).toFixed(0)} Kâr`, val: inputs.karOrani2 },
                { key: 'tier3', label: `%${(inputs.karOrani3 * 100).toFixed(0)} Kâr`, val: inputs.karOrani3 },
              ].map((tier) => (
                <button
                  key={tier.key}
                  onClick={() => setSelectedProfitKey(tier.key)}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                    selectedProfitKey === tier.key
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selection Info Pill */}
          <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-xs text-slate-300 flex justify-between items-center">
            <span className="text-slate-400">Reçete İhtiyacı (1 m³):</span>
            <span className="font-mono font-semibold text-amber-300">
              Çimento: {recipe.cimentoKg}kg | Agrega: {recipe.agregaKg}kg | Katkı: {recipe.katkiKg?.toFixed(1)}kg
            </span>
          </div>

        </div>

        {/* Dynamic Calculation Cards (Right 7 Columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Maliyet (Kârsız) Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Maliyet (Kârsız)
                </span>
                <p className="text-xl lg:text-2xl font-black text-slate-200 font-mono tracking-tight">
                  {formatCurrency(baseCost)}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
                <span>Diğer gider (%5) dahil</span>
                <span className="font-semibold text-slate-300">1 m³</span>
              </div>
            </div>

            {/* Satış Fiyatı (KDV Hariç) Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                    Satış (KDV Hariç)
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    +{formatPercent(activeProfitObj?.profitRate || 0)} Kâr
                  </span>
                </div>
                <p className="text-xl lg:text-2xl font-black text-amber-300 font-mono tracking-tight">
                  {formatCurrency(priceExcl)}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-emerald-400 flex justify-between font-medium">
                <span>Net Kâr Marjı:</span>
                <span className="font-bold font-mono">+{formatCurrency(profitMarginTL)}</span>
              </div>
            </div>

            {/* Satış Fiyatı (KDV Dahil) Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-emerald-950/20 to-slate-950">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                    Satış (KDV Dahil)
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    +{formatPercent(inputs.kdvOrani)} KDV
                  </span>
                </div>
                <p className="text-xl lg:text-2xl font-black text-emerald-400 font-mono tracking-tight">
                  {formatCurrency(priceIncl)}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
                <span>Fatura Tutarı:</span>
                <span className="font-semibold text-slate-200">{formatCurrency(priceIncl)}</span>
              </div>
            </div>

          </div>

          {/* Detailed Cost Breakdown Pills */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
              {selectedClass} ({selectedType}) Birim Maliyet Dağılımı (TL / m³) • {inputs.dokumMesafesi || 13} km Mesafe
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 font-mono">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Çimento</span>
                <span className="font-bold text-slate-200">{formatCurrency(costs.cimentoTL)}</span>
              </div>

              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Agrega + Nakliye</span>
                <span className="font-bold text-slate-200">{formatCurrency((costs.agregaTL || 0) + (costs.agregaNakliyeTL || 0))}</span>
              </div>

              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Toplam Yakıt (Mazot)</span>
                <span className="font-bold text-amber-300">
                  {formatCurrency(
                    (costs.kepceMotorinTL || 0) + 
                    (selectedType !== 'SANTRAL ALTI' ? (costs.mikserMotorinTL || 0) : 0) + 
                    (selectedType === 'POMPALI' ? (costs.pompaMotorinTL || 0) : 0)
                  )}
                </span>
              </div>

              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">İşçilik + Enerji</span>
                <span className="font-bold text-sky-300">
                  {formatCurrency((costs.iscilikTL || 0) + (costs.elektrikTL || 0) + (costs.suTL || 0))}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
