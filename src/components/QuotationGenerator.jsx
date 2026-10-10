import React, { useState } from 'react';
import { Printer, Plus, Trash2, Building, Calendar, CheckCircle2, FileText } from 'lucide-react';
import { CONCRETE_CLASSES, PRODUCTION_TYPES } from '../data/defaultData';
import { formatCurrency, formatPercent } from '../utils/calculator';

export default function QuotationGenerator({ calculatedData, inputs }) {
  const [customerName, setCustomerName] = useState('YILMAZ İNŞAAT A.Ş.');
  const [projectName, setProjectName] = useState('Şantiye Konut Projesi - Bolvadin');
  const [offerDate, setOfferDate] = useState(new Date().toISOString().split('T')[0]);
  const [validityDays, setValidityDays] = useState(15);
  const [selectedProfitTier, setSelectedProfitTier] = useState('tier2'); // tier1, tier2, tier3

  // Offer Line Items
  const [lineItems, setLineItems] = useState([
    { id: 1, class: 'C 25', type: 'POMPALI', volume: 500 },
    { id: 2, class: 'C 30', type: 'MİKSERLİ', volume: 200 }
  ]);

  const handleAddItem = () => {
    setLineItems(prev => [
      ...prev,
      { id: Date.now(), class: 'C 30', type: 'POMPALI', volume: 100 }
    ]);
  };

  const handleRemoveItem = (id) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id, field, val) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: field === 'volume' ? parseFloat(val) || 0 : val };
      }
      return item;
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculations for Offer Items
  let subtotalExcl = 0;

  const processedItems = lineItems.map(item => {
    const classData = calculatedData.classResults[item.class];
    const prodObj = classData?.productionTypes[item.type];
    const profitObj = prodObj ? prodObj[selectedProfitTier] : null;

    const unitPriceExcl = profitObj ? profitObj.excl : 0;
    const itemTotalExcl = unitPriceExcl * item.volume;
    subtotalExcl += itemTotalExcl;

    return {
      ...item,
      unitPriceExcl,
      itemTotalExcl
    };
  });

  const kdvAmount = subtotalExcl * inputs.kdvOrani;
  const grandTotal = subtotalExcl + kdvAmount;

  return (
    <div className="space-y-6">
      
      {/* Controls Card (Hidden on Print) */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/90 shadow-xl no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                📄 MÜŞTERİ FİYAT TEKLİFİ OLUŞTURUCU
              </h2>
              <p className="text-xs text-slate-400">
                Resmi müşteri teklifi hazırlayın ve doğrudan yazdırın veya PDF olarak kaydedin.
              </p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition active:scale-95"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            Teklifi Yazdır / PDF Yap
          </button>
        </div>

        {/* Input Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs mb-5">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Müşteri / Firma Adı</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-950 text-white font-bold px-3 py-1.5 rounded border border-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Şantiye / Proje Adı</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-slate-950 text-white font-bold px-3 py-1.5 rounded border border-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Teklif Tarihi</label>
            <input
              type="date"
              value={offerDate}
              onChange={(e) => setOfferDate(e.target.value)}
              className="w-full bg-slate-950 text-white font-bold px-3 py-1.5 rounded border border-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Kâr Seviyesi Seçimi</label>
            <select
              value={selectedProfitTier}
              onChange={(e) => setSelectedProfitTier(e.target.value)}
              className="w-full bg-slate-950 text-amber-300 font-bold px-3 py-1.5 rounded border border-slate-800"
            >
              <option value="tier1">Tier 1 (%{Math.round(inputs.karOrani1 * 100)} Kâr)</option>
              <option value="tier2">Tier 2 (%{Math.round(inputs.karOrani2 * 100)} Kâr)</option>
              <option value="tier3">Tier 3 (%{Math.round(inputs.karOrani3 * 100)} Kâr)</option>
            </select>
          </div>
        </div>

        {/* Line Items Builder */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span>Teklif Kalemleri (Metreküp Miktarları)</span>
            <button
              onClick={handleAddItem}
              className="inline-flex items-center text-sky-400 hover:text-sky-300 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Kalem Ekle
            </button>
          </div>

          {lineItems.map((item, idx) => (
            <div key={item.id} className="flex flex-wrap items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-500 w-5">{idx + 1}.</span>
              
              <select
                value={item.class}
                onChange={(e) => handleUpdateItem(item.id, 'class', e.target.value)}
                className="bg-slate-900 text-white font-bold text-xs px-2.5 py-1 rounded border border-slate-700"
              >
                {CONCRETE_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                value={item.type}
                onChange={(e) => handleUpdateItem(item.id, 'type', e.target.value)}
                className="bg-slate-900 text-amber-300 font-bold text-xs px-2.5 py-1 rounded border border-slate-700"
              >
                {PRODUCTION_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>

              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  step="10"
                  value={item.volume}
                  onChange={(e) => handleUpdateItem(item.id, 'volume', e.target.value)}
                  className="w-24 bg-slate-900 text-white font-mono font-bold text-xs px-2 py-1 rounded border border-slate-700 text-right"
                />
                <span className="text-xs text-slate-400 font-semibold">m³</span>
              </div>

              <button
                onClick={() => handleRemoveItem(item.id)}
                className="p-1 rounded text-red-400 hover:bg-red-500/10 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Official Offer Document Printable View */}
      <div className="glass-panel rounded-2xl p-8 border border-slate-800 bg-white text-slate-900 shadow-2xl print:shadow-none print:border-none print:p-0">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-sans uppercase">
              HAZIR BETON FİYAT TEKLİF FORMU
            </h1>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              Beton Santrali Üretim & Sevkiyat Koordinatörlüğü
            </p>
          </div>
          <div className="text-right text-xs font-mono">
            <p className="font-bold text-slate-900">Teklif No: BT-{offerDate.replace(/-/g, '')}-01</p>
            <p className="text-slate-600">Tarih: {new Date(offerDate).toLocaleDateString('tr-TR')}</p>
            <p className="text-slate-600">Geçerlilik: {validityDays} Gün</p>
          </div>
        </div>

        {/* Customer & Project Info Box */}
        <div className="grid grid-cols-2 gap-6 bg-slate-100 p-4 rounded-lg mb-6 border border-slate-300 text-xs">
          <div>
            <span className="font-bold uppercase text-slate-500 block text-[10px] mb-1">MÜŞTERİ BİLGİLERİ</span>
            <p className="font-bold text-sm text-slate-900">{customerName}</p>
          </div>
          <div>
            <span className="font-bold uppercase text-slate-500 block text-[10px] mb-1">ŞANTİYE / PROJE</span>
            <p className="font-bold text-sm text-slate-900">{projectName}</p>
          </div>
        </div>

        {/* Table of Items */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            <thead className="bg-slate-200 text-slate-900 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-2.5 border border-slate-300">Sıra</th>
                <th className="p-2.5 border border-slate-300">Beton Sınıfı</th>
                <th className="p-2.5 border border-slate-300">Döküm / Üretim Tipi</th>
                <th className="p-2.5 border border-slate-300 text-right">Miktar (m³)</th>
                <th className="p-2.5 border border-slate-300 text-right">Birim Fiyat (KDV Hariç)</th>
                <th className="p-2.5 border border-slate-300 text-right">Toplam Tutar (KDV Hariç)</th>
              </tr>
            </thead>
            <tbody className="font-mono text-slate-800">
              {processedItems.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="p-2.5 border border-slate-300 font-bold text-center">{idx + 1}</td>
                  <td className="p-2.5 border border-slate-300 font-bold font-sans">{item.class}</td>
                  <td className="p-2.5 border border-slate-300 font-sans">{item.type}</td>
                  <td className="p-2.5 border border-slate-300 text-right font-bold">{item.volume.toLocaleString('tr-TR')} m³</td>
                  <td className="p-2.5 border border-slate-300 text-right">{formatCurrency(item.unitPriceExcl)}</td>
                  <td className="p-2.5 border border-slate-300 text-right font-bold">{formatCurrency(item.itemTotalExcl)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Calculations */}
        <div className="flex justify-end mb-8">
          <div className="w-72 bg-slate-50 p-4 rounded-lg border border-slate-300 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-700">
              <span>Ara Toplam (KDV Hariç):</span>
              <span className="font-bold">{formatCurrency(subtotalExcl)}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>KDV (%{Math.round(inputs.kdvOrani * 100)}):</span>
              <span className="font-bold">{formatCurrency(kdvAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-400">
              <span>GENEL TOPLAM:</span>
              <span className="text-amber-700">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Signatures */}
        <div className="border-t border-slate-300 pt-4 text-[11px] text-slate-600 space-y-2">
          <p className="font-bold text-slate-900">Teklif Koşulları:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Beton dökümü öncesinde zemin ve kalıp kontrolü şantiye sorumlusu tarafından yapılmalıdır.</li>
            <li>Pompalı dökümlerde mikser bekleme süreleri standart 45 dakikayı aşmamalıdır.</li>
            <li>Teklif verilen fiyatlar belirtilen teklif geçerlilik süresince sabittir.</li>
          </ul>

          <div className="grid grid-cols-2 gap-12 pt-8 text-center text-xs font-bold text-slate-800">
            <div>
              <p className="border-t border-slate-400 pt-2">Teklifi Hazırlayan (Beton Santrali)</p>
              <p className="text-[10px] text-slate-500 font-normal">İmza & Kaşe</p>
            </div>
            <div>
              <p className="border-t border-slate-400 pt-2">Müşteri Onayı</p>
              <p className="text-[10px] text-slate-500 font-normal">İmza & Kaşe</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
