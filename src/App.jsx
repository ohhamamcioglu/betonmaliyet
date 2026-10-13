import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import Header from './components/Header';
import QuickLookup from './components/QuickLookup';
import InputPanel from './components/InputPanel';
import PriceMatrixTable from './components/PriceMatrixTable';
import CostBreakdownChart from './components/CostBreakdownChart';
import SensitivityAnalysis from './components/SensitivityAnalysis';
import RecipeManager from './components/RecipeManager';
import AdvancedSettingsModal from './components/AdvancedSettingsModal';
import QuotationGenerator from './components/QuotationGenerator';
import CalculationGuide from './components/CalculationGuide';

import { DEFAULT_INPUTS, DEFAULT_RECIPES, CONCRETE_CLASSES, PRODUCTION_TYPES } from './data/defaultData';
import { calculateConcreteCosts } from './utils/calculator';
import { fetchLiveRates } from './utils/liveRates';

const SAVED_INPUTS_KEY = 'beton_saved_inputs_v1';
const LAST_RATES_KEY = 'beton_last_rates_info_v1';

const getInitialInputs = () => {
  try {
    const saved = localStorage.getItem(SAVED_INPUTS_KEY);
    return saved ? { ...DEFAULT_INPUTS, ...JSON.parse(saved) } : DEFAULT_INPUTS;
  } catch {
    return DEFAULT_INPUTS;
  }
};

const getInitialRatesInfo = () => {
  try {
    const saved = localStorage.getItem(LAST_RATES_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export default function App() {
  const [inputs, setInputs] = useState(getInitialInputs);
  const [recipes, setRecipes] = useState(DEFAULT_RECIPES);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Live Rates fetching state
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [lastRatesInfo, setLastRatesInfo] = useState(getInitialRatesInfo);

  // Handler to fetch live USD rate and Fuel price
  const handleFetchLiveRates = async (isAuto = false) => {
    setIsFetchingRates(true);
    try {
      const data = await fetchLiveRates();
      if (data && data.success) {
        setInputs(prev => {
          const updated = {
            ...prev,
            dolarKuru: data.dolarKuru || prev.dolarKuru,
            mazotFiyati: data.mazotFiyati || prev.mazotFiyati,
          };
          try {
            localStorage.setItem(SAVED_INPUTS_KEY, JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
        setLastRatesInfo(data);
        try {
          localStorage.setItem(LAST_RATES_KEY, JSON.stringify(data));
        } catch (e) {}
      }
    } catch (err) {
      console.error('Error in handleFetchLiveRates:', err);
      if (!isAuto) {
        alert('Canlı kur/mazot çekilirken bir hata oluştu.');
      }
    } finally {
      setIsFetchingRates(false);
    }
  };

  // Auto-fetch live rates on app startup + load fresh data silently
  React.useEffect(() => {
    handleFetchLiveRates(true);
  }, []);

  // Save inputs to localStorage whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem(SAVED_INPUTS_KEY, JSON.stringify(inputs));
    } catch (e) {}
  }, [inputs]);

  // Live calculation output matching Excel 100%
  const calculatedData = useMemo(() => {
    return calculateConcreteCosts(inputs, recipes);
  }, [inputs, recipes]);

  // Reset to original Excel default values
  const handleResetDefaults = () => {
    if (window.confirm('Tüm verileri Excel varsayılan değerlerine sıfırlamak istediğinize emin misiniz?')) {
      setInputs(DEFAULT_INPUTS);
      setRecipes(DEFAULT_RECIPES);
      setLastRatesInfo(null);
      try {
        localStorage.removeItem(SAVED_INPUTS_KEY);
        localStorage.removeItem(LAST_RATES_KEY);
      } catch (e) {}
    }
  };

  // Export current calculated matrix & inputs to 100% valid XLSX file
  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // SHEET 1: FIYAT LISTESI MATRISI
      const matrixRows = [
        ['MALAKLAR İNŞAAT TAAHHÜT GIDA MADEN SANAYİ VE TİCARET A.Ş.'],
        ['BETON MALİYET & SATIŞ FİYATI DETAYLI MATRİS RAPORU'],
        [`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`],
        [],
        [
          'Döküm / Üretim Tipi',
          'Beton Sınıfı',
          'Taban Maliyet (TL/m³)',
          `Kâr 1 (%${Math.round(inputs.karOrani1 * 100)}) - KDV Hariç`,
          `Kâr 1 (%${Math.round(inputs.karOrani1 * 100)}) - KDV Dahil`,
          `Kâr 2 (%${Math.round(inputs.karOrani2 * 100)}) - KDV Hariç`,
          `Kâr 2 (%${Math.round(inputs.karOrani2 * 100)}) - KDV Dahil`,
          `Kâr 3 (%${Math.round(inputs.karOrani3 * 100)}) - KDV Hariç`,
          `Kâr 3 (%${Math.round(inputs.karOrani3 * 100)}) - KDV Dahil`,
        ]
      ];

      PRODUCTION_TYPES.forEach(prodType => {
        CONCRETE_CLASSES.forEach(cls => {
          const pObj = calculatedData.classResults[cls]?.productionTypes[prodType.id];
          if (pObj) {
            matrixRows.push([
              prodType.label,
              cls,
              Number(pObj.baseCost.toFixed(2)),
              Number(pObj.tier1.excl.toFixed(2)),
              Number(pObj.tier1.incl.toFixed(2)),
              Number(pObj.tier2.excl.toFixed(2)),
              Number(pObj.tier2.incl.toFixed(2)),
              Number(pObj.tier3.excl.toFixed(2)),
              Number(pObj.tier3.incl.toFixed(2)),
            ]);
          }
        });
      });

      const wsMatrix = XLSX.utils.aoa_to_sheet(matrixRows);
      wsMatrix['!cols'] = [
        { wch: 18 }, { wch: 14 }, { wch: 20 },
        { wch: 22 }, { wch: 22 }, { wch: 22 },
        { wch: 22 }, { wch: 22 }, { wch: 22 }
      ];
      XLSX.utils.book_append_sheet(wb, wsMatrix, 'Fiyat Listesi Matrisi');

      // SHEET 2: GİRDİ PARAMETRELERİ
      const inputRows = [
        ['MALAKLAR A.Ş. - GİRDİ PARAMETRELERİ VE HESAPLAMA GİRDİLERİ'],
        [`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`],
        [],
        ['Parametre Adı', 'Değer', 'Birim', 'Açıklama'],
        ['Çimento Fiyatı', inputs.cimentoFiyati, 'TL / Ton', 'Fabrika teslim çimento fiyatı'],
        ['Agrega Fiyatı', inputs.agregaFiyati, 'TL / Ton', 'Ocak teslim agrega ton fiyatı'],
        ['Kimyasal Katkı Fiyatı (USD)', inputs.katkiFiyatiUSD, '$ / kg', 'İthal katkı fiyatı'],
        ['Dolar Kuru ($/TL)', inputs.dolarKuru, 'TL / $', 'Güncel TCMB / Piyasa Kuru'],
        ['Mazot Fiyatı (KDV Dahil)', inputs.mazotFiyati, 'TL / Litre', 'Güncel akaryakıt pompası fiyatı'],
        ['Elektrik Fiyatı', inputs.elektrikFiyati, 'TL / kWh', 'Sanayi tarifesi elektrik birim fiyatı'],
        ['Su Fiyatı', inputs.suFiyati, 'TL / Ton', 'Tesis su maliyeti'],
        ['Personel Maaşı', inputs.isciMaasi, 'TL / Ay', 'Ortalama personel maliyeti'],
        ['Beton Döküm Mesafesi', inputs.dokumMesafesi, 'km', 'Ortalama şantiye mesafesi'],
        ['Agrega Nakliye Mesafesi', inputs.agregaMesafesi, 'km', 'Ocak - Tesis arası nakliye'],
        ['Günlük Üretim Hacmi', inputs.gunlukDokum, 'm³ / Gün', 'Ortalama günlük santral üretimi'],
        ['Mikser Kapasitesi', inputs.mikserKapasitesi, 'm³', 'Standart mikser hacmi'],
        ['KDV Oranı', `%${Math.round(inputs.kdvOrani * 100)}`, '%', 'Katma Değer Vergisi'],
        ['Kâr Oranı Tier 1', `%${Math.round(inputs.karOrani1 * 100)}`, '%', 'Düşük marj'],
        ['Kâr Oranı Tier 2', `%${Math.round(inputs.karOrani2 * 100)}`, '%', 'Standart marj'],
        ['Kâr Oranı Tier 3', `%${Math.round(inputs.karOrani3 * 100)}`, '%', 'Yüksek marj'],
      ];

      const wsInputs = XLSX.utils.aoa_to_sheet(inputRows);
      wsInputs['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 35 }];
      XLSX.utils.book_append_sheet(wb, wsInputs, 'Maliyet Girdileri');

      // SHEET 3: REÇETELER
      const recipeRows = [
        ['BETON REÇETELERİ KARIŞIM ORANLARI (1 m³ İÇİN)'],
        [],
        ['Beton Sınıfı', 'Çimento (kg)', 'Agrega (kg)', 'Su (litre)', 'Katkı (kg)']
      ];

      Object.entries(recipes).forEach(([cls, r]) => {
        recipeRows.push([cls, r.cimento, r.agrega, r.su, r.katki]);
      });

      const wsRecipes = XLSX.utils.aoa_to_sheet(recipeRows);
      wsRecipes['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsRecipes, 'Beton Reçeteleri');

      // Write binary array buffer blob for 100% clean Excel opening across desktop & mobile
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `Malaklar_Beton_Maliyet_Raporu_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Excel export error:', err);
      alert('Excel dosyası oluşturulurken bir hata oluştu: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      
      {/* Header Bar */}
      <Header
        onReset={handleResetDefaults}
        onOpenAdvanced={() => setIsAdvancedOpen(true)}
        onExportExcel={handleExportExcel}
        onPrintQuote={() => setActiveTab('quote')}
        onFetchLiveRates={handleFetchLiveRates}
        isFetchingRates={isFetchingRates}
        lastRatesInfo={lastRatesInfo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6">
        
        {/* TAB 1: DASHBOARD (Genel Bakış) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Hızlı Fiyat Sorgulama Banner */}
            <QuickLookup
              calculatedData={calculatedData}
              inputs={inputs}
              setInputs={setInputs}
            />

            {/* Maliyet Girdileri Paneli */}
            <InputPanel
              inputs={inputs}
              setInputs={setInputs}
              onFetchLiveRates={handleFetchLiveRates}
              isFetchingRates={isFetchingRates}
            />

            {/* Detaylı Fiyat Listesi */}
            <PriceMatrixTable
              calculatedData={calculatedData}
              inputs={inputs}
            />
          </div>
        )}

        {/* TAB 2: INPUTS (Sarı Kutular) */}
        {activeTab === 'inputs' && (
          <div className="space-y-6 animate-fadeIn">
            <InputPanel
              inputs={inputs}
              setInputs={setInputs}
              onFetchLiveRates={handleFetchLiveRates}
              isFetchingRates={isFetchingRates}
            />
          </div>
        )}

        {/* TAB 3: MATRIX (Fiyat Listesi) */}
        {activeTab === 'matrix' && (
          <div className="space-y-6 animate-fadeIn">
            <PriceMatrixTable
              calculatedData={calculatedData}
              inputs={inputs}
            />
          </div>
        )}

        {/* TAB 4: ANALYTICS (Grafik & Dağılım) */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <CostBreakdownChart
              calculatedData={calculatedData}
            />
          </div>
        )}

        {/* TAB 5: SIMULATION (Hassasiyet Analizi) */}
        {activeTab === 'simulation' && (
          <div className="space-y-6 animate-fadeIn">
            <SensitivityAnalysis
              baseInputs={inputs}
              recipes={recipes}
            />
          </div>
        )}

        {/* TAB 6: RECIPES (Reçeteler) */}
        {activeTab === 'recipes' && (
          <div className="space-y-6 animate-fadeIn">
            <RecipeManager
              recipes={recipes}
              setRecipes={setRecipes}
              onOpenMethodology={() => setActiveTab('methodology')}
            />
          </div>
        )}

        {/* TAB 7: METHODOLOGY (Hesaplama Yöntemi & Formüller) */}
        {activeTab === 'methodology' && (
          <div className="space-y-6 animate-fadeIn">
            <CalculationGuide
              inputs={inputs}
              recipes={recipes}
              calculatedData={calculatedData}
            />
          </div>
        )}

        {/* TAB 8: QUOTE (Müşteri Teklifi) */}
        {activeTab === 'quote' && (
          <div className="space-y-6 animate-fadeIn">
            <QuotationGenerator
              calculatedData={calculatedData}
              inputs={inputs}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-1">
          <p className="font-bold text-amber-400/90 text-sm">
            Geliştiren: Ömer Hilmi Hamamcıoğlu
          </p>
          <p className="font-semibold text-slate-400">
            Beton Maliyet & Satış Fiyatı Hesaplama Sistemi © 2026
          </p>
          <p>
            Hazır beton santralleri, müteahhitler ve şantiye yöneticileri için geliştirilmiş dinamik web uygulaması.
          </p>
        </div>
      </footer>

      {/* Advanced Settings Modal */}
      <AdvancedSettingsModal
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        inputs={inputs}
        setInputs={setInputs}
      />

    </div>
  );
}
