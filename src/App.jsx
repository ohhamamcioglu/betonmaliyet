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

import { DEFAULT_INPUTS, DEFAULT_RECIPES, CONCRETE_CLASSES, PRODUCTION_TYPES } from './data/defaultData';
import { calculateConcreteCosts } from './utils/calculator';
import { fetchLiveRates } from './utils/liveRates';

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [recipes, setRecipes] = useState(DEFAULT_RECIPES);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Live Rates fetching state
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [lastRatesInfo, setLastRatesInfo] = useState(null);

  // Live calculation output matching Excel 100%
  const calculatedData = useMemo(() => {
    return calculateConcreteCosts(inputs, recipes);
  }, [inputs, recipes]);

  // Handler to fetch live USD rate and Fuel price
  const handleFetchLiveRates = async () => {
    setIsFetchingRates(true);
    try {
      const data = await fetchLiveRates();
      if (data && data.success) {
        setInputs(prev => ({
          ...prev,
          dolarKuru: data.dolarKuru || prev.dolarKuru,
          mazotFiyati: data.mazotFiyati || prev.mazotFiyati,
        }));
        setLastRatesInfo(data);
      }
    } catch (err) {
      console.error('Error in handleFetchLiveRates:', err);
      alert('Canlı kur/mazot çekilirken bir hata oluştu.');
    } finally {
      setIsFetchingRates(false);
    }
  };

  // Reset to original Excel default values
  const handleResetDefaults = () => {
    if (window.confirm('Tüm verileri Excel varsayılan değerlerine sıfırlamak istediğinize emin misiniz?')) {
      setInputs(DEFAULT_INPUTS);
      setRecipes(DEFAULT_RECIPES);
      setLastRatesInfo(null);
    }
  };

  // Export current calculated matrix & inputs to XLSX file
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    const matrixRows = [];
    matrixRows.push(['BETON FİYAT HESAPLAMA PANELİ']);
    matrixRows.push(['Dönem:', 'EKİM 2026']);
    matrixRows.push([]);
    matrixRows.push(['Üretim Tipi', 'Beton Sınıfı', 'Maliyet (Kârsız)', 'Kâr Oranı 1 (%10)', 'KDV Dahil 1', 'Kâr Oranı 2 (%15)', 'KDV Dahil 2', 'Kâr Oranı 3 (%20)', 'KDV Dahil 3']);

    PRODUCTION_TYPES.forEach(prodType => {
      CONCRETE_CLASSES.forEach(cls => {
        const pObj = calculatedData.classResults[cls]?.productionTypes[prodType.id];
        if (pObj) {
          matrixRows.push([
            prodType.label,
            cls,
            Math.round(pObj.baseCost * 100) / 100,
            Math.round(pObj.tier1.excl * 100) / 100,
            Math.round(pObj.tier1.incl * 100) / 100,
            Math.round(pObj.tier2.excl * 100) / 100,
            Math.round(pObj.tier2.incl * 100) / 100,
            Math.round(pObj.tier3.excl * 100) / 100,
            Math.round(pObj.tier3.incl * 100) / 100,
          ]);
        }
      });
    });

    const wsMatrix = XLSX.utils.aoa_to_sheet(matrixRows);
    XLSX.utils.book_append_sheet(wb, wsMatrix, 'Fiyat Listesi');

    const inputRows = [
      ['GİRDİ PARAMETRELERİ', 'DEĞER', 'BİRİM'],
      ['Çimento Fiyatı', inputs.cimentoFiyati, 'TL/ton'],
      ['Agrega Fiyatı', inputs.agregaFiyati, 'TL/ton'],
      ['Katkı Fiyatı', inputs.katkiFiyatiUSD, '$/kg'],
      ['Dolar Kuru', inputs.dolarKuru, 'TL/$'],
      ['Mazot Fiyatı', inputs.mazotFiyati, 'TL/litre'],
      ['Elektrik Fiyatı', inputs.elektrikFiyati, 'TL/kWh'],
      ['Su Fiyatı', inputs.suFiyati, 'TL/ton'],
      ['İşçi Maaşı', inputs.isciMaasi, 'TL/kişi/ay'],
      ['Döküm Mesafesi', inputs.dokumMesafesi, 'km'],
      ['Agrega Mesafesi', inputs.agregaMesafesi, 'km'],
      ['Günlük Döküm', inputs.gunlukDokum, 'm³/gün'],
      ['Mikser Kapasitesi', inputs.mikserKapasitesi, 'm³'],
    ];
    const wsInputs = XLSX.utils.aoa_to_sheet(inputRows);
    XLSX.utils.book_append_sheet(wb, wsInputs, 'Girdiler');

    XLSX.writeFile(wb, 'Beton_Maliyet_Hesaplama_Raporu.xlsx');
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
            />
          </div>
        )}

        {/* TAB 7: QUOTE (Müşteri Teklifi) */}
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
