import React from 'react';
import { Building2, RotateCcw, SlidersHorizontal, Download, Printer, Globe, FileSpreadsheet, Loader2 } from 'lucide-react';

export default function Header({ 
  onReset, 
  onOpenAdvanced, 
  onExportExcel, 
  onPrintQuote,
  onFetchLiveRates,
  isFetchingRates,
  lastRatesInfo,
  activeTab,
  setActiveTab 
}) {
  return (
    <header className="relative z-40 glass-panel border-b border-slate-800 bg-slate-950/90 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-11 px-2.5 py-1 rounded-xl bg-white flex items-center justify-center shadow-lg ring-1 ring-slate-700">
              <img src="/images/image1.jpeg" alt="MİG Malaklar Logo" className="h-9 w-auto object-contain" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                  Beton Maliyet & Satış Fiyatı Paneli
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/30 shadow-sm">
                  👑 Ömer Hilmi Hamamcıoğlu
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v1.1
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Hazır beton reçete, nakliye, operasyon maliyeti ve kârlılık hesaplama yazılımı
              </p>
            </div>
          </div>

          {/* Actions & Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Live Fetch Button */}
            <button
              onClick={onFetchLiveRates}
              disabled={isFetchingRates}
              className={`inline-flex items-center px-3.5 py-2 text-xs font-bold rounded-lg transition duration-150 active:scale-95 shadow-md ${
                isFetchingRates 
                  ? 'bg-sky-600/50 text-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/20'
              }`}
              title="TCMB Dolar Kuru ve Petrol Ofisi Mazot Fiyatını Canlı Çek"
            >
              {isFetchingRates ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Globe className="w-3.5 h-3.5 mr-1.5 text-sky-200" />
              )}
              {isFetchingRates ? 'Canlı Veri Çekiliyor...' : '🌐 Canlı Kur & Mazot Çek'}
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition duration-150 active:scale-95"
              title="Varsayılan Excel Değerlerine Dön"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Varsayılana Dön
            </button>

            <button
              onClick={onOpenAdvanced}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition duration-150 active:scale-95"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
              Gelişmiş Parametreler
            </button>

            <button
              onClick={onExportExcel}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition duration-150 active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Excel Export
            </button>

            <button
              onClick={onPrintQuote}
              className="inline-flex items-center px-3.5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition duration-150 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-950" />
              Teklif Al / Yazdır
            </button>
          </div>
        </div>

        {/* Live Rates Status Alert Banner */}
        {lastRatesInfo && (
          <div className="mt-3 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs flex justify-between items-center font-mono">
            <span>
              ✅ <strong>Canlı Güncelleme Başarılı:</strong> Dolar/TL: <strong>{lastRatesInfo.dolarKuru} ₺</strong> | Mazot (KDV Dahil): <strong>{lastRatesInfo.mazotFiyati} ₺/L</strong> (KDV Hariç: {lastRatesInfo.mazotKdvHaric} ₺)
            </span>
            <span className="text-[10px] text-sky-400/80 font-sans">
              {lastRatesInfo.updatedAt} • {lastRatesInfo.source}
            </span>
          </div>
        )}

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-1 mt-4 border-t border-slate-800/80 pt-2 no-print overflow-x-auto scrollbar-none">
          {[
            { id: 'dashboard', label: '📊 Genel Bakış & Sorgulama' },
            { id: 'inputs', label: '💛 Maliyet Girdileri (Sarı Kutular)' },
            { id: 'matrix', label: '📋 Detaylı Fiyat Listesi Tablosu' },
            { id: 'analytics', label: '📈 Maliyet Grafiği & Analiz' },
            { id: 'simulation', label: '⚡ Hassasiyet & Senaryo Analizi' },
            { id: 'recipes', label: '🧪 Reçete & Karışım Ayarları' },
            { id: 'methodology', label: '📐 Hesaplama Yöntemi & Formüller' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
