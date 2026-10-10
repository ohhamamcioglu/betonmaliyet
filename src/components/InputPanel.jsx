import React from 'react';
import { DollarSign, Truck, Building, Percent, Fuel, Sparkles, Globe, Loader2 } from 'lucide-react';

export default function InputPanel({ inputs, setInputs, onFetchLiveRates, isFetchingRates }) {
  
  const handleChange = (field, value) => {
    const num = parseFloat(value);
    setInputs(prev => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num
    }));
  };

  const handlePercentChange = (field, value) => {
    const num = parseFloat(value);
    setInputs(prev => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num / 100
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* 1. GÜNCEL MALZEME VE OPERASYON FİYATLARI (Sarı Kutular) */}
      <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 bg-slate-900/90 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                ① GÜNCEL BİRİM FİYATLARI (KDV Hariç)
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-amber-500 text-slate-950 rounded">
                  Sarı Kutular = Girdi Alanları
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Piyasa koşullarına göre değişen birim maliyetleri buradan güncelleyin.
              </p>
            </div>
          </div>

          {/* Direct Live Fetch Button inside Input Panel */}
          {onFetchLiveRates && (
            <button
              onClick={onFetchLiveRates}
              disabled={isFetchingRates}
              className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg border transition shadow-sm ${
                isFetchingRates 
                  ? 'bg-sky-950 text-sky-400 border-sky-800 cursor-not-allowed'
                  : 'bg-sky-500/15 text-sky-300 border-sky-500/30 hover:bg-sky-500/25'
              }`}
            >
              {isFetchingRates ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Globe className="w-3.5 h-3.5 mr-1.5 text-sky-400" />}
              {isFetchingRates ? 'Çekiliyor...' : '🌐 Dolar & Mazot Canlı Çek'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Çimento */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/40 focus-within:border-amber-400 transition-all">
            <label className="block text-xs font-bold text-amber-300 mb-1">
              Çimento Fiyatı
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="50"
                value={inputs.cimentoFiyati}
                onChange={(e) => handleChange('cimentoFiyati', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">TL / ton</span>
            </div>
          </div>

          {/* Agrega */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/40 focus-within:border-amber-400 transition-all">
            <label className="block text-xs font-bold text-amber-300 mb-1">
              Agrega Fiyatı
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="5"
                value={inputs.agregaFiyati}
                onChange={(e) => handleChange('agregaFiyati', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">TL / ton</span>
            </div>
          </div>

          {/* Katkı ($/kg) */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/40 focus-within:border-amber-400 transition-all">
            <label className="block text-xs font-bold text-amber-300 mb-1">
              Kimyasal Katkı Fiyatı
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.01"
                value={inputs.katkiFiyatiUSD}
                onChange={(e) => handleChange('katkiFiyatiUSD', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">$ / kg</span>
            </div>
          </div>

          {/* Dolar Kuru */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/40 focus-within:border-amber-400 transition-all relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-sky-300">
                Dolar Kuru (USD/TRY)
              </label>
              <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-1 rounded">Canlı</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.01"
                value={inputs.dolarKuru}
                onChange={(e) => handleChange('dolarKuru', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">TL</span>
            </div>
          </div>

          {/* Mazot */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/40 focus-within:border-amber-400 transition-all relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-sky-300">
                Mazot (Motorin) Fiyatı
              </label>
              <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-1 rounded">Canlı</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.1"
                value={inputs.mazotFiyati}
                onChange={(e) => handleChange('mazotFiyati', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">TL / litre</span>
            </div>
          </div>

          {/* Elektrik */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/40 focus-within:border-amber-400 transition-all">
            <label className="block text-xs font-bold text-amber-300 mb-1">
              Elektrik Birim Fiyatı
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.1"
                value={inputs.elektrikFiyati}
                onChange={(e) => handleChange('elektrikFiyati', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">TL / kWh</span>
            </div>
          </div>

          {/* Su */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/40 focus-within:border-amber-400 transition-all">
            <label className="block text-xs font-bold text-amber-300 mb-1">
              Su Birim Fiyatı
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.5"
                value={inputs.suFiyati}
                onChange={(e) => handleChange('suFiyati', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">TL / ton</span>
            </div>
          </div>

          {/* Ortalama İşçi Maliyeti */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/40 focus-within:border-amber-400 transition-all">
            <label className="block text-xs font-bold text-amber-300 mb-1">
              İşçi Maliyeti (Maaş + SGK)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="1000"
                value={inputs.isciMaasi}
                onChange={(e) => handleChange('isciMaasi', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-amber-500/30 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">TL/kişi/ay</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2 & 3. İŞLETME, LOJİSTİK VE AYLIK KİRALAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* İşletme & Lojistik Bilgileri */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/90 shadow-lg">
          <div className="flex items-center space-x-2.5 mb-4 border-b border-slate-800 pb-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                ② İŞLETME & LOJİSTİK BİLGİLERİ
              </h3>
              <p className="text-xs text-slate-400">
                Taşıma mesafeleri ve santral kapasite parametreleri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ort. Beton Döküm Mesafesi
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={inputs.dokumMesafesi}
                  onChange={(e) => handleChange('dokumMesafesi', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-sky-400"
                />
                <span className="text-xs font-semibold text-slate-400">km</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Agrega Taşıma Mesafesi
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={inputs.agregaMesafesi}
                  onChange={(e) => handleChange('agregaMesafesi', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-sky-400"
                />
                <span className="text-xs font-semibold text-slate-400">km</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Günlük Ortalama Beton Dökümü
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="10"
                  value={inputs.gunlukDokum}
                  onChange={(e) => handleChange('gunlukDokum', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-sky-400"
                />
                <span className="text-xs font-semibold text-slate-400">m³ / gün</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mikser Taşıma Kapasitesi
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={inputs.mikserKapasitesi}
                  onChange={(e) => handleChange('mikserKapasitesi', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-sky-400"
                />
                <span className="text-xs font-semibold text-slate-400">m³</span>
              </div>
            </div>

          </div>
        </div>

        {/* Aylık Kira Bedelleri */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/90 shadow-lg">
          <div className="flex items-center space-x-2.5 mb-4 border-b border-slate-800 pb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                ③ AYLIK KİRA BEDELLERİ (TL / ay)
              </h3>
              <p className="text-xs text-slate-400">
                Varsa kiralık tesis ve araçların aylık giderleri (0 girilirse öz mal kabul edilir).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Santral Kira
              </label>
              <input
                type="number"
                step="10000"
                value={inputs.santralKira}
                onChange={(e) => handleChange('santralKira', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-xs px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Mikser Kira (araç başı)
              </label>
              <input
                type="number"
                step="5000"
                value={inputs.mikserKira}
                onChange={(e) => handleChange('mikserKira', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-xs px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Pompa Kira
              </label>
              <input
                type="number"
                step="10000"
                value={inputs.pompaKira}
                onChange={(e) => handleChange('pompaKira', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-xs px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Loader (Kepçe) Kira
              </label>
              <input
                type="number"
                step="5000"
                value={inputs.loaderKira}
                onChange={(e) => handleChange('loaderKira', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-xs px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Servis Aracı Kira
              </label>
              <input
                type="number"
                step="2000"
                value={inputs.servisKira}
                onChange={(e) => handleChange('servisKira', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-xs px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-emerald-400"
              />
            </div>

          </div>
        </div>

      </div>

      {/* 4. KÂR VE KDV ORANLARI */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/90 shadow-lg">
        <div className="flex items-center space-x-2.5 mb-4 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              ④ KÂR MARJLARI VE KDV ORANI
            </h3>
            <p className="text-xs text-slate-400">
              Fiyat listesi tablosunda aynı anda karşılaştırılacak 3 farklı kâr oranı ve resmi KDV oranı.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <label className="block text-xs font-bold text-indigo-300 mb-1">
              Kâr Oranı 1 (Düşük)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="1"
                value={Math.round(inputs.karOrani1 * 100)}
                onChange={(e) => handlePercentChange('karOrani1', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-indigo-400"
              />
              <span className="text-xs font-bold text-slate-400">%</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <label className="block text-xs font-bold text-indigo-300 mb-1">
              Kâr Oranı 2 (Hedef)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="1"
                value={Math.round(inputs.karOrani2 * 100)}
                onChange={(e) => handlePercentChange('karOrani2', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-indigo-400"
              />
              <span className="text-xs font-bold text-slate-400">%</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <label className="block text-xs font-bold text-indigo-300 mb-1">
              Kâr Oranı 3 (Yüksek)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="1"
                value={Math.round(inputs.karOrani3 * 100)}
                onChange={(e) => handlePercentChange('karOrani3', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-indigo-400"
              />
              <span className="text-xs font-bold text-slate-400">%</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <label className="block text-xs font-bold text-emerald-400 mb-1">
              KDV Oranı
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="1"
                value={Math.round(inputs.kdvOrani * 100)}
                onChange={(e) => handlePercentChange('kdvOrani', e.target.value)}
                className="w-full bg-slate-900 text-white font-mono font-bold text-sm px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:border-emerald-400"
              />
              <span className="text-xs font-bold text-slate-400">%</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
