import React, { useState } from 'react';
import { Printer, Plus, Trash2, Building, Calendar, CheckCircle2, FileText, Info } from 'lucide-react';
import { CONCRETE_CLASSES, PRODUCTION_TYPES } from '../data/defaultData';
import { formatCurrency, formatPercent } from '../utils/calculator';

export default function QuotationGenerator({ calculatedData, inputs }) {
  const [customerName, setCustomerName] = useState('YILMAZ İNŞAAT A.Ş.');
  const [projectName, setProjectName] = useState('Şantiye Konut Projesi - Bolvadin');
  const [offerDate, setOfferDate] = useState(new Date().toISOString().split('T')[0]);
  const [validityDays, setValidityDays] = useState(15);
  const [selectedProfitTier, setSelectedProfitTier] = useState('tier2'); // tier1, tier2, tier3

  // Offer Line Items (customPrice: empty string = use system price)
  const [lineItems, setLineItems] = useState([
    { id: 1, class: 'C 25', type: 'POMPALI', volume: 500, customPrice: '' },
    { id: 2, class: 'C 30', type: 'MİKSERLİ', volume: 200, customPrice: '' }
  ]);

  const handleAddItem = () => {
    setLineItems(prev => [
      ...prev,
      { id: Date.now(), class: 'C 30', type: 'POMPALI', volume: 100, customPrice: '' }
    ]);
  };

  const handleRemoveItem = (id) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id, field, val) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        if (field === 'volume') {
          return { ...item, volume: parseFloat(val) || 0 };
        }
        if (field === 'customPrice') {
          return { ...item, customPrice: val };
        }
        return { ...item, [field]: val };
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

    const systemPriceExcl = profitObj ? profitObj.excl : 0;
    
    // Check if custom price is entered by user
    const parsedCustomPrice = parseFloat(item.customPrice);
    const isCustom = !isNaN(parsedCustomPrice) && parsedCustomPrice >= 0 && item.customPrice !== '' && item.customPrice !== null;
    const unitPriceExcl = isCustom ? parsedCustomPrice : systemPriceExcl;

    const itemTotalExcl = unitPriceExcl * item.volume;
    subtotalExcl += itemTotalExcl;

    return {
      ...item,
      systemPriceExcl,
      isCustom,
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
            <span className="flex items-center space-x-2">
              <span>Teklif Kalemleri (Metreküp Miktarları & Birim Fiyatlar)</span>
              <span className="text-[11px] text-slate-500 font-normal hidden sm:inline">(Fiyatı boş bırakırsanız sistem kâr oranından çeker)</span>
            </span>
            <button
              onClick={handleAddItem}
              className="inline-flex items-center text-sky-400 hover:text-sky-300 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Kalem Ekle
            </button>
          </div>

          {lineItems.map((item, idx) => {
            const processed = processedItems.find(p => p.id === item.id);
            return (
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

                {/* Custom Unit Price Input (Optional, fallbacks to system calculated price) */}
                <div className="flex items-center space-x-1.5 ml-auto sm:ml-0">
                  <span className="text-[11px] text-slate-400 font-semibold">Özel Fiyat:</span>
                  <input
                    type="number"
                    step="1"
                    placeholder={`Sistem: ${Math.round(processed?.systemPriceExcl || 0)} ₺`}
                    value={item.customPrice ?? ''}
                    onChange={(e) => handleUpdateItem(item.id, 'customPrice', e.target.value)}
                    className={`w-36 bg-slate-900 font-mono font-bold text-xs px-2 py-1 rounded border text-right transition ${
                      item.customPrice ? 'text-emerald-400 border-emerald-500/50' : 'text-slate-300 border-slate-700 placeholder:text-slate-500'
                    }`}
                    title="Boş bırakırsanız sistem kâr marjlı birim fiyatını çeker. İsterseniz elle özel teklif fiyatı yazabilirsiniz."
                  />
                  <span className="text-xs text-slate-400 font-semibold">₺/m³</span>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1 rounded text-red-400 hover:bg-red-500/10 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Offer Document Printable View */}
      <div className="printable-quote-container bg-white text-slate-950 p-8 sm:p-10 rounded-2xl border border-slate-300 shadow-2xl print:shadow-none print:border-none print:p-0">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-5 mb-6 gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider mb-1">
              RESMİ TEKLİF BELGESİ
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-sans uppercase">
              MALAKLAR İNŞAAT TAAHHÜT GIDA MADEN SANAYİ VE TİCARET A.Ş.
            </h1>
            <p className="text-xs font-bold text-amber-800 tracking-wide mt-0.5 uppercase">
              HAZIR BETON SANTRAİLİ ÜRETİM & SEVKİYAT KOORDİNATÖRLÜĞÜ
            </p>
            <p className="text-xs text-slate-700 font-medium mt-1">
              Adres: Selçuklu Mah. M27V+MQ, 03300 Bolvadin / AFYONKARAHİSAR
            </p>
          </div>
          <div className="text-left sm:text-right text-xs font-mono shrink-0 bg-slate-100 p-3 rounded-lg border border-slate-300 print:bg-transparent print:border-none print:p-0">
            <p className="font-black text-slate-950 text-sm">Teklif No: BT-{offerDate.replace(/-/g, '')}-01</p>
            <p className="text-slate-800 font-bold mt-1">Tarih: {new Date(offerDate).toLocaleDateString('tr-TR')}</p>
            <p className="text-slate-700 font-semibold">Geçerlilik: {validityDays} Gün</p>
          </div>
        </div>

        {/* Customer & Project Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-100 p-4 rounded-xl mb-6 border border-slate-300 text-xs">
          <div>
            <span className="font-extrabold uppercase text-slate-600 block text-[10px] tracking-wider mb-1">SAYIN / MÜŞTERİ BİLGİLERİ</span>
            <p className="font-black text-base text-slate-950">{customerName}</p>
          </div>
          <div>
            <span className="font-extrabold uppercase text-slate-600 block text-[10px] tracking-wider mb-1">ŞANTİYE / PROJE LOKASYONU</span>
            <p className="font-black text-base text-slate-950">{projectName}</p>
          </div>
        </div>

        {/* Table of Items */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs text-left border-collapse border border-slate-400">
            <thead className="bg-slate-200 text-slate-950 font-black uppercase text-[11px]">
              <tr>
                <th className="p-3 border border-slate-400 text-center">Sıra</th>
                <th className="p-3 border border-slate-400">Beton Sınıfı</th>
                <th className="p-3 border border-slate-400">Döküm / Üretim Tipi</th>
                <th className="p-3 border border-slate-400 text-right">Miktar (m³)</th>
                <th className="p-3 border border-slate-400 text-right">Birim Fiyat (KDV Hariç)</th>
                <th className="p-3 border border-slate-400 text-right">Toplam Tutar (KDV Hariç)</th>
              </tr>
            </thead>
            <tbody className="font-mono text-slate-900">
              {processedItems.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-300 hover:bg-slate-50">
                  <td className="p-3 border border-slate-300 font-bold text-center">{idx + 1}</td>
                  <td className="p-3 border border-slate-300 font-black font-sans text-sm text-slate-950">{item.class}</td>
                  <td className="p-3 border border-slate-300 font-sans font-bold text-slate-800">{item.type}</td>
                  <td className="p-3 border border-slate-300 text-right font-black text-slate-950">{item.volume.toLocaleString('tr-TR')} m³</td>
                  <td className="p-3 border border-slate-300 text-right font-bold text-slate-900">{formatCurrency(item.unitPriceExcl)}</td>
                  <td className="p-3 border border-slate-300 text-right font-black text-slate-950 text-sm">{formatCurrency(item.itemTotalExcl)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Calculations */}
        <div className="flex justify-end mb-8">
          <div className="w-full sm:w-80 bg-slate-100 p-4 rounded-xl border border-slate-400 space-y-2.5 text-xs font-mono text-slate-900">
            <div className="flex justify-between text-slate-800 font-bold">
              <span>Ara Toplam (KDV Hariç):</span>
              <span className="font-black text-slate-950">{formatCurrency(subtotalExcl)}</span>
            </div>
            <div className="flex justify-between text-slate-800 font-bold">
              <span>KDV (%{Math.round(inputs.kdvOrani * 100)}):</span>
              <span className="font-black text-slate-950">{formatCurrency(kdvAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-950 pt-2.5 border-t-2 border-slate-400">
              <span>GENEL TOPLAM:</span>
              <span className="text-amber-800">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Signatures */}
        <div className="border-t-2 border-slate-900 pt-5 text-[11px] text-slate-800 space-y-3">
          <p className="font-extrabold text-slate-950 uppercase text-xs">Teklif Şartları & Genel Esaslar:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 font-medium">
            <li className="leading-relaxed">
              <strong>Hammadde & Fiyat Farkı Esası:</strong> İşbu teklifte belirtilen birim fiyatlar, teklif tarihindeki güncel <strong>çimento hammadde fiyatı ({inputs.cimentoFiyati.toLocaleString('tr-TR')} TL/Ton)</strong> ve <strong>motorin yakıt fiyatı ({inputs.mazotFiyati.toFixed(2)} TL/Litre)</strong> baz alınarak hesaplanmıştır. Sözleşme veya teslimat sürecinde hammadde ve yakıt fiyatlarında meydana gelebilecek değişiklikler, ilgili beton sınıfının reçete dozaj oranları ve nakliye mesafeleri doğrultusunda birim fiyatlara aynen fiyat farkı olarak eklenecektir.
            </li>
            <li>Beton dökümü öncesinde zemin, mikser yanaşma yolu ve kalıp kontrolü şantiye yetkilisi tarafından sağlanmalıdır.</li>
            <li>Pompalı dökümlerde araç bekleme süreleri standart 45 dakikayı aşmamalıdır.</li>
            <li>Teklif verilen fiyatlar belirtilen geçerlilik süresince ({validityDays} gün) sabittir.</li>
          </ul>

          <div className="grid grid-cols-2 gap-12 pt-10 text-center text-xs font-bold text-slate-950">
            <div>
              <p className="font-black text-slate-950">MALAKLAR İNŞAAT TAAHHÜT GIDA MADEN SANAYİ VE TİCARET A.Ş.</p>
              <div className="h-12"></div>
              <p className="border-t border-slate-400 pt-1 text-[11px] text-slate-700 font-semibold">Yetkili İmza & Kaşe</p>
            </div>
            <div>
              <p className="font-black text-slate-950">MÜŞTERİ ONAYI</p>
              <div className="h-12"></div>
              <p className="border-t border-slate-400 pt-1 text-[11px] text-slate-700 font-semibold">İmza & Kaşe</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
