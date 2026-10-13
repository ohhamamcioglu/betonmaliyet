import React, { useState } from 'react';
import { 
  Calculator, 
  BookOpen, 
  Layers, 
  Fuel, 
  Truck, 
  Users, 
  Zap, 
  Droplets, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  Percent, 
  Info,
  DollarSign,
  FileSpreadsheet,
  TrendingUp,
  Cpu,
  AlertCircle
} from 'lucide-react';
import { CONCRETE_CLASSES, PRODUCTION_TYPES } from '../data/defaultData';
import { formatCurrency, formatPercent } from '../utils/calculator';

export default function CalculationGuide({ inputs, recipes, calculatedData }) {
  const [selectedClass, setSelectedClass] = useState('C 25');
  const [selectedType, setSelectedType] = useState('POMPALI');
  const [activeProfitTier, setActiveProfitTier] = useState('tier2'); // tier1, tier2, tier3

  // Current calculation result for the selected class and type
  const classData = calculatedData?.classResults?.[selectedClass];
  const costs = classData?.costs || {};
  const recipe = classData?.recipe || recipes[selectedClass] || {};
  const prodPrices = classData?.productionTypes?.[selectedType] || {};

  // Input numbers
  const cimentoFiyati = Number(inputs.cimentoFiyati) || 0;
  const agregaFiyati = Number(inputs.agregaFiyati) || 0;
  const katkiFiyatiUSD = Number(inputs.katkiFiyatiUSD) || 0;
  const dolarKuru = Number(inputs.dolarKuru) || 0;
  const mazotFiyati = Number(inputs.mazotFiyati) || 0;
  const elektrikFiyati = Number(inputs.elektrikFiyati) || 0;
  const suFiyati = Number(inputs.suFiyati) || 0;
  const isciMaasi = Number(inputs.isciMaasi) || 0;
  const isciSayisi = Number(inputs.isciSayisi) || 21;
  const dokumMesafesi = Number(inputs.dokumMesafesi) || 0;
  const agregaMesafesi = Number(inputs.agregaMesafesi) || 0;
  const gunlukDokum = Number(inputs.gunlukDokum) || 140;
  const mikserKapasitesi = Number(inputs.mikserKapasitesi) || 10;
  const agregaKamyonKapasitesi = Number(inputs.agregaKamyonKapasitesi) || 38;

  // Selected profit tier details
  const profitRate = activeProfitTier === 'tier1' 
    ? inputs.karOrani1 
    : activeProfitTier === 'tier2' 
      ? inputs.karOrani2 
      : inputs.karOrani3;

  const currentTierObj = prodPrices[activeProfitTier] || { excl: 0, incl: 0 };
  const baseCost = prodPrices.baseCost || 0;

  // Breakdown calculations for live simulator
  const cimentoKg = recipe.cimentoKg || recipe.cimento || 0;
  const agregaKg = recipe.agregaKg || recipe.agrega || 0;
  const katkiKg = recipe.katkiKg || (cimentoKg * 0.01);

  // Transportation values
  const mikserFuelConsumptionLiters = selectedType === 'SANTRAL ALTI' 
    ? 0 
    : (0.7 * 2 * dokumMesafesi / mikserKapasitesi);
  const agregaFuelConsumptionLiters = (0.4 * 2 * agregaMesafesi / agregaKamyonKapasitesi);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
              <Calculator className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Resmi Matematiksel Model
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300">
                  Excel ile %100 Birebir
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                📐 Hazır Beton Maliyet ve Fiyat Hesaplama Metodolojisi
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mt-1">
                Sistem; hammadde reçetesi, çift yönlü akaryakıt lojistiği, santral işletme giderleri, işçilik ve sabit kira dağıtımlarını 1 m³ beton birimi üzerinden kuruşu kuruşuna hesaplar.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Aktif Dolar & Mazot</p>
              <p className="font-mono font-bold text-emerald-400 text-sm">{dolarKuru.toFixed(2)} ₺ / $ &nbsp;|&nbsp; {mazotFiyati.toFixed(2)} ₺/L <span className="text-[11px] text-amber-300 font-sans">(KDV Hariç)</span></p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* VERGİ VE MUHASEBE UYARISI: MAZOT KDV HARİÇ HESAPLANIR */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-sky-500/15 border border-amber-500/30 flex items-start space-x-3.5 text-xs shadow-md">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-amber-300 text-sm">
              💡 Vergi & Maliyet Muhasebesi Kuralı: Mazot Maliyete Neden "KDV Hariç" Girer?
            </p>
            <p className="text-slate-300 leading-relaxed text-[11.5px]">
              Tüm ticari işletmeler ve hazır beton santralleri satın aldıkları akaryakıtın faturasındaki <strong>%20 KDV tutarını 'İndirilecek KDV' olarak mahsup eder (vergiden düşer)</strong>. Bu nedenle hazır beton birim maliyet analizine akaryakıtın pompa satış fiyatı değil, <strong>KDV Hariç net birim maliyeti</strong> ({mazotFiyati.toFixed(2)} ₺/L) girer (Pompa perakende: {Number((mazotFiyati * 1.20).toFixed(2))} ₺/L). Akaryakıt pompa fiyatıyla maliyetlendirilirse maliyet yapay olarak şişer. Sistem tüm kâr paylarını bu net taban maliyete ekledikten sonra en son nihai satış faturasında müşteriye %20 KDV tek seferde yansıtılır.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: İNTERAKTİF CANLI ADIM ADIM HESAPLAMA SİMÜLATÖRÜ */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                🔍 Canlı Hesaplama Laboratuvarı (Adım Adım İzleme)
              </h2>
              <p className="text-xs text-slate-400">
                Aşağıdan beton sınıfını ve üretim tipini seçin; sistemin o sınıf için nasıl sonuç ürettiğini formülleriyle canlı izleyin.
              </p>
            </div>
          </div>

          {/* Selectors */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Sınıf:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                {CONCRETE_CLASSES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Tip:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none cursor-pointer"
              >
                {PRODUCTION_TYPES.map(t => <option key={t.id} value={t.id} className="bg-slate-900">{t.label}</option>)}
              </select>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Kâr:</span>
              <select
                value={activeProfitTier}
                onChange={(e) => setActiveProfitTier(e.target.value)}
                className="bg-transparent text-emerald-400 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="tier1" className="bg-slate-900">Tier 1 (%{Math.round(inputs.karOrani1 * 100)})</option>
                <option value="tier2" className="bg-slate-900">Tier 2 (%{Math.round(inputs.karOrani2 * 100)})</option>
                <option value="tier3" className="bg-slate-900">Tier 3 (%{Math.round(inputs.karOrani3 * 100)})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Calculation Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* ADIM 1: HAMMADDE */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-sky-400 flex items-center space-x-1.5">
                <Layers className="w-4 h-4" />
                <span>1. Hammadde Maliyetleri</span>
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {formatCurrency((costs.cimentoTL || 0) + (costs.agregaTL || 0) + (costs.katkiTL || 0))}
              </span>
            </div>
            
            <div className="text-[11px] space-y-2 text-slate-300 font-mono">
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">Çimento ({cimentoKg} kg)</span>
                  <span>({cimentoKg} × {cimentoFiyati}) / 1000</span>
                </div>
                <span className="font-bold text-white">{formatCurrency(costs.cimentoTL)}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">Agrega ({agregaKg} kg)</span>
                  <span>({agregaKg} × {agregaFiyati}) / 1000</span>
                </div>
                <span className="font-bold text-white">{formatCurrency(costs.agregaTL)}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded">
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">Katkı ({katkiKg.toFixed(2)} kg)</span>
                  <span>{katkiKg.toFixed(2)} × ${katkiFiyatiUSD} × {dolarKuru.toFixed(2)}₺</span>
                </div>
                <span className="font-bold text-white">{formatCurrency(costs.katkiTL)}</span>
              </div>
            </div>
          </div>

          {/* ADIM 2: LOJİSTİK & NAKLİYE */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                <Truck className="w-4 h-4" />
                <span>2. Lojistik & Nakliye</span>
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {formatCurrency((costs.agregaNakliyeTL || 0) + (selectedType === 'SANTRAL ALTI' ? 0 : (costs.mikserMotorinTL || 0)))}
              </span>
            </div>

            <div className="text-[11px] space-y-2 text-slate-300 font-mono">
              <div className="bg-slate-900/60 p-2 rounded space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans text-[10px]">Agrega Nakliyesi (Ocak → Santral)</span>
                  <span className="font-bold text-white">{formatCurrency(costs.agregaNakliyeTL)}</span>
                </div>
                <p className="text-[9.5px] text-slate-500 font-sans leading-tight">
                  Formül: (0.4 L/km × 2 × {agregaMesafesi} km / 38 Ton) × {mazotFiyati}₺ (KDV Hariç) × {agregaKg/1000} Ton × 1.15
                </p>
              </div>

              <div className="bg-slate-900/60 p-2 rounded space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans text-[10px]">Mikser Nakliyesi (Santral → Şantiye)</span>
                  <span className="font-bold text-white">
                    {selectedType === 'SANTRAL ALTI' ? '0,00 ₺ (Santral Teslim)' : formatCurrency(costs.mikserMotorinTL)}
                  </span>
                </div>
                <p className="text-[9.5px] text-slate-500 font-sans leading-tight">
                  {selectedType === 'SANTRAL ALTI' 
                    ? 'Santral altı teslimde mikser yakıtı sıfırdır.' 
                    : `Formül: (0.7 L/km × 2 × ${dokumMesafesi} km / ${mikserKapasitesi} m³) × ${mazotFiyati}₺ (KDV Hariç)`}
                </p>
              </div>
            </div>
          </div>

          {/* ADIM 3: SANTRAL OPERASYONU */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <Zap className="w-4 h-4" />
                <span>3. Tesis Operasyon Giderleri</span>
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {formatCurrency(
                  (costs.kepceMotorinTL || 0) + 
                  (selectedType === 'POMPALI' ? (costs.pompaMotorinTL || 0) : 0) + 
                  (costs.iscilikTL || 0) + 
                  (costs.elektrikTL || 0) + 
                  (costs.suTL || 0)
                )}
              </span>
            </div>

            <div className="text-[11px] space-y-1.5 text-slate-300 font-mono">
              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
                <span className="text-slate-400 font-sans text-[10px]">Kepçe / Yükleyici (0.35 L/m³)</span>
                <span className="font-bold text-white">{formatCurrency(costs.kepceMotorinTL)}</span>
              </div>

              {selectedType === 'POMPALI' && (
                <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
                  <span className="text-amber-400 font-sans text-[10px]">Pompa Yakıtı (0.73 L/m³)</span>
                  <span className="font-bold text-amber-300">{formatCurrency(costs.pompaMotorinTL)}</span>
                </div>
              )}

              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
                <span className="text-slate-400 font-sans text-[10px]">İşçilik ({isciSayisi} personel)</span>
                <span className="font-bold text-white">{formatCurrency(costs.iscilikTL)}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
                <span className="text-slate-400 font-sans text-[10px]">Elektrik (5.5 kWh)</span>
                <span className="font-bold text-white">{formatCurrency(costs.elektrikTL)}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
                <span className="text-slate-400 font-sans text-[10px]">Su (1.0 Ton)</span>
                <span className="font-bold text-white">{formatCurrency(costs.suTL)}</span>
              </div>
            </div>
          </div>

          {/* ADIM 4: SABİT KİRALAR */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-purple-400 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4" />
                <span>4. Sabit Ekipman & Tesis Kira Payı</span>
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {formatCurrency(costs.toplamKiraTL)}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              Aylık sabit araç ve tesis kiraları aylık üretim kapasitesine ({gunlukDokum} m³/gün × 30 gün = {(gunlukDokum * 30).toLocaleString('tr-TR')} m³/ay) bölünerek m³ başına dağıtılır.
            </p>

            <div className="text-[11px] space-y-1.5 text-slate-300 font-mono">
              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
                <span className="text-slate-400 font-sans text-[10px]">6 Mikser Kira Payı</span>
                <span className="font-bold text-white">{formatCurrency(costs.mikserKiraTL)}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
                <span className="text-slate-400 font-sans text-[10px]">3 Pompa Kira Payı</span>
                <span className="font-bold text-white">{formatCurrency(costs.pompaKiraTL)}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
                <span className="text-slate-400 font-sans text-[10px]">Santral & Loader & Servis</span>
                <span className="font-bold text-white">
                  {formatCurrency((costs.santralKiraTL || 0) + (costs.loaderKiraTL || 0) + (costs.servisKiraTL || 0))}
                </span>
              </div>
            </div>
          </div>

          {/* ADIM 5: DİĞER GİDERLER (%5) & TABAN MALİYET */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-rose-400 flex items-center space-x-1.5">
                <Percent className="w-4 h-4" />
                <span>5. Diğer Giderler & Taban Maliyet</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {formatCurrency(baseCost)}
              </span>
            </div>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="bg-slate-900/60 p-2 rounded flex justify-between">
                <span className="text-slate-400 font-sans text-[10px]">Ortak Ara Toplam:</span>
                <span className="font-bold text-white">{formatCurrency(costs.ortakAraToplam)}</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded flex justify-between">
                <span className="text-slate-400 font-sans text-[10px]">Beklenmeyen / Diğer (%5):</span>
                <span className="font-bold text-rose-400">
                  {formatCurrency(baseCost - (costs.ortakAraToplam + (selectedType !== 'SANTRAL ALTI' ? costs.mikserMotorinTL : 0) + (selectedType === 'POMPALI' ? costs.pompaMotorinTL : 0)))}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-sans text-xs">
                <strong>TABAN MALİYET (KÂRSIZ):</strong>
                <p className="font-mono text-sm font-black text-amber-400 mt-0.5">{formatCurrency(baseCost)} / m³</p>
              </div>
            </div>
          </div>

          {/* ADIM 6: KÂR MARJI & KDV'Lİ SATIŞ FİYATI */}
          <div className="bg-gradient-to-br from-slate-950 to-emerald-950/30 p-4 rounded-xl border border-emerald-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>6. Satış Fiyatı & KDV</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded">
                %{Math.round(profitRate * 100)} Kâr
              </span>
            </div>

            <div className="space-y-2 text-[11px] font-mono">
              <div className="bg-slate-900/70 p-2 rounded flex justify-between">
                <span className="text-slate-400 font-sans text-[10px]">Taban Maliyet:</span>
                <span className="font-bold text-white">{formatCurrency(baseCost)}</span>
              </div>

              <div className="bg-slate-900/70 p-2 rounded flex justify-between">
                <span className="text-slate-400 font-sans text-[10px]">Kâr Payı (%{Math.round(profitRate * 100)}):</span>
                <span className="font-bold text-emerald-400">
                  +{formatCurrency(currentTierObj.excl - baseCost)}
                </span>
              </div>

              <div className="bg-slate-900/70 p-2 rounded flex justify-between border border-slate-700">
                <span className="text-white font-sans font-bold text-[10px]">Satış Fiyatı (KDV Hariç):</span>
                <span className="font-bold text-white">{formatCurrency(currentTierObj.excl)}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-sans">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] font-bold">KDV DAHİL (%{Math.round(inputs.kdvOrani * 100)}):</span>
                  <span className="font-mono text-base font-black text-emerald-400">
                    {formatCurrency(currentTierObj.incl)}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: GÖRSEL AKIŞ ŞEMASI (PIPELINE PROCESS) */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ArrowRight className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              🔄 7 Kademeli Maliyet Akış Diyagramı
            </h2>
            <p className="text-xs text-slate-400">
              Ocak ve fabrikalardan çıkan hammaddelerin nihai müşteri teklif fiyatına dönüşüm süreci.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 text-xs pt-2">
          
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1.5 flex flex-col justify-between">
            <div className="w-7 h-7 mx-auto rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">1</div>
            <div>
              <p className="font-bold text-white text-[11px]">Hammadde</p>
              <p className="text-[10px] text-slate-400">Çimento, agrega ve katkı reçetesi</p>
            </div>
            <span className="text-[9px] font-mono text-sky-300">kg × TL / 1000</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1.5 flex flex-col justify-between">
            <div className="w-7 h-7 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">2</div>
            <div>
              <p className="font-bold text-white text-[11px]">Agrega Nakliyesi</p>
              <p className="text-[10px] text-slate-400">Ocak → Tesis 38T kamyon yakıtı</p>
            </div>
            <span className="text-[9px] font-mono text-amber-300">2x Mesafe + %15</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1.5 flex flex-col justify-between">
            <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">3</div>
            <div>
              <p className="font-bold text-white text-[11px]">Operasyon</p>
              <p className="text-[10px] text-slate-400">İşçilik, elektrik, su, kepçe yakıtı</p>
            </div>
            <span className="text-[9px] font-mono text-emerald-300">m³ başına pay</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1.5 flex flex-col justify-between">
            <div className="w-7 h-7 mx-auto rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">4</div>
            <div>
              <p className="font-bold text-white text-[11px]">Ekipman Kiraları</p>
              <p className="text-[10px] text-slate-400">Mikser, pompa, santral kira payı</p>
            </div>
            <span className="text-[9px] font-mono text-purple-300">Kira / (30 × Döküm)</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1.5 flex flex-col justify-between">
            <div className="w-7 h-7 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">5</div>
            <div>
              <p className="font-bold text-white text-[11px]">Diğer (%5)</p>
              <p className="text-[10px] text-slate-400">Aşınma, yağ, bakım & fire payı</p>
            </div>
            <span className="text-[9px] font-mono text-rose-300">× 1.05 Çarpanı</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1.5 flex flex-col justify-between">
            <div className="w-7 h-7 mx-auto rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">6</div>
            <div>
              <p className="font-bold text-white text-[11px]">Kâr Marjı</p>
              <p className="text-[10px] text-slate-400">Tier 1 (%10), Tier 2 (%15), Tier 3 (%20)</p>
            </div>
            <span className="text-[9px] font-mono text-teal-300">Maliyet × (1 + Kâr)</span>
          </div>

          <div className="bg-gradient-to-b from-amber-500/20 to-emerald-500/20 p-3 rounded-xl border border-amber-500/40 text-center space-y-1.5 flex flex-col justify-between">
            <div className="w-7 h-7 mx-auto rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">7</div>
            <div>
              <p className="font-black text-amber-300 text-[11px]">Nihai Fiyat</p>
              <p className="text-[10px] text-slate-300">+ %20 KDV ile Müşteri Teklifi</p>
            </div>
            <span className="text-[9px] font-mono font-bold text-emerald-400">KDV Hariç × 1.20</span>
          </div>

        </div>
      </div>

      {/* SECTION 3: DETAYLI FORMÜL VE KATSAYI KÜTÜPHANESİ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sol Kolon: Lojistik & Araç Katsayıları */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl space-y-5">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Fuel className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              🚚 Akaryakıt & Lojistik Tüketim Formülleri
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-amber-300 font-bold">
                <span>Mikser Nakliye Yakıtı (m³ Başına)</span>
                <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded">0.70 L / km</span>
              </div>
              <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-200">
                Mikser Mazotu = (0.70 × 2 × Döküm Mesafesi / Mikser Kapasitesi) × Mazot Fiyatı (KDV Hariç)
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                • <strong>Neden 2 ile çarpılır?</strong> Mikser şantiyeye betonu götürüp santrale boş döner (gidiş-dönüş toplam mesafe).<br />
                • <strong>Neden mikser kapasitesine bölünür?</strong> Harcanan toplam yakıt mikserin taşıdığı m³ miktarına pay edilir.<br />
                • <em>Santral Altı satışlarda bu bedel 0 TL'dir.</em>
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-amber-300 font-bold">
                <span>Agrega Taşıma Yakıtı (Ocak → Santral)</span>
                <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded">0.40 L / km &nbsp;|&nbsp; 38 Ton</span>
              </div>
              <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-200">
                Agrega Nakliyesi = (0.40 × 2 × Agrega Mesafesi / 38) × Mazot Fiyatı (KDV Hariç) × (Agrega kg / 1000) × 1.15
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                • 38 tonluk damperli kamyonların gidiş-dönüş yakıt maliyeti hesaplanır.<br />
                • 1 m³ betonda kullanılan agrega tonajına göre oranlanır.<br />
                • <strong>1.15 Çarpanı:</strong> Nakliye operasyon kâr marjını (%15) yansıtır.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-amber-300 font-bold">
                <span>Santral İçi Kepçe & Pompa Yakıtı</span>
                <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded">Kepçe: 0.35 &nbsp;|&nbsp; Pompa: 0.73 L/m³</span>
              </div>
              <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-200">
                Kepçe Mazotu = 0.35 L/m³ × Mazot Fiyatı (KDV Hariç)<br />
                Pompa Mazotu = 0.73 L/m³ × Mazot Fiyatı (KDV Hariç)
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                • Kepçe (Loader) agreganın bunkerlere beslenmesi sırasında m³ başına 0.35 litre yakıt tüketir.<br />
                • Pompalı dökümde hidrolik beton pompası basım esnasında m³ başına 0.73 litre motorin harcar.
              </p>
            </div>

          </div>
        </div>

        {/* Sağ Kolon: Tesis, İşçilik & Sabit Kira Dağıtımı */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl space-y-5">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              🏢 Sabit Tesis, İşçilik ve Enerji Formülleri
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-sky-300 font-bold">
                <span>İşçilik Maliyeti (m³ Başına)</span>
                <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded">{isciSayisi} Personel</span>
              </div>
              <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-200">
                İşçilik (TL/m³) = (İşçi Sayısı × Ortalama Maaş & SGK) / (30 Gün × Günlük Döküm m³)
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                • 21 kişilik santral personel kadrosunun aylık toplam maaş + SGK maliyeti bulunur.<br />
                • Aylık toplam üretilen beton miktarına ({gunlukDokum * 30} m³) bölünerek m³ başına işçilik maliyeti hesaplanır.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-sky-300 font-bold">
                <span>Sabit Ekipman Kiraları (Amortisman Dağıtımı)</span>
                <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded">6 Mikser • 3 Pompa • Santral</span>
              </div>
              <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-200">
                Kira Payı (TL/m³) = (Araç Adedi × Aylık Kira) / (30 Gün × Günlük Döküm m³)
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                • Mikser, pompa, santral, loader ve servis araçlarının aylık kiraları varsa sisteme girilir.<br />
                • <strong>Ölçek Ekonomisi:</strong> Günlük döküm miktarı arttıkça (örn. 140 m³ yerine 300 m³), metreküp başına düşen sabit kira payı hızla düşer.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-sky-300 font-bold">
                <span>Elektrik ve Su Tüketimi</span>
                <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded">Elektrik: 5.5 kWh &nbsp;|&nbsp; Su: 1.0 Ton</span>
              </div>
              <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-200">
                Elektrik = 5.5 kWh × Elektrik Fiyatı (TL/kWh)<br />
                Su = 1.0 Ton × Su Fiyatı (TL/Ton)
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                • 1 m³ beton karıştırmak ve bunkerleri çalıştırmak için ortalama 5.5 kWh elektrik tüketilir.<br />
                • Su tüketimi; beton karışım suyu ile mikser kazan yıkama sularının toplamı olarak 1.0 ton kabul edilir.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* SECTION 4: SIKÇA SORULAN SORULAR / ÖNEMLİ PÜF NOKTALARI */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              💡 Kritik Bilgiler ve Sektörel Püf Noktaları
            </h3>
            <p className="text-xs text-slate-400">
              Santral yöneticileri ve teklif hazırlayanların bilmesi gereken temel maliyet dinamikleri.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center space-x-1.5">
              <span>❓ Pompalı ve Mikserli Arasındaki Fiyat Farkı Nereden Gelir?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Pompalı dökümlerde; betonun şantiyede katlara basılması için hidrolik beton pompası kullanılır. Bu durum m³ başına <strong>0.73 litre ilave motorin</strong> ve pompanın sabit kira/amortisman payını maliyete ekler. Mikserli dökümde ise beton doğrudan mikser oluğundan aktığı için pompa yakıtı sıfırdır.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-sky-300 flex items-center space-x-1.5">
              <span>❓ Diğer Giderler (%5) Neden Eklenir?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Hazır beton üretiminde mikser kazanlarında kalan artık harç (fire), santral filtre bakımları, aşınma plakaları, gres yağlama ve şantiye bekleme süreleri gibi öngörülemeyen küçük giderler için sektör standardı olarak <strong>%5 emniyet payı (1.05 çarpanı)</strong> taban maliyete dahil edilir.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-300 flex items-center space-x-1.5">
              <span>❓ Döküm Mesafesi Fiyatı Nasıl Değiştirir?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Döküm mesafesi arttıkça mikserin şantiyeye gidiş-dönüşte yaktığı mazot doğrudan artar. Örneğin 20 km mesafede mikser m³ başına ~2.8 litre mazot yakarken, mesafe 40 km'ye çıktığında bu rakam 5.6 litreye çıkar ve taban maliyeti doğrudan yükseltir.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-purple-300 flex items-center space-x-1.5">
              <span>❓ Kimyasal Katkı Oranı Nasıl Hesaplanır?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Sistemde süperakışkanlaştırıcı kimyasal katkı, aksi belirtilmedikçe çimento ağırlığının <strong>%1'i</strong> olarak otomatik hesaplanır (Örn: C25 sınıfında 290 kg çimento için 2.9 kg katkı). Katkı birim fiyatı döviz cinsinden ($/kg) olduğu için güncel TCMB dolar kuruyla TL'ye çevrilir.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
