import React, { useState, useEffect } from 'react';
import { Printer, Plus, Trash2, Building, Calendar, CheckCircle2, FileText, Info, Save, History, ExternalLink, Download, FolderOpen, RotateCcw, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { CONCRETE_CLASSES, PRODUCTION_TYPES } from '../data/defaultData';
import { formatCurrency, formatPercent } from '../utils/calculator';
import { fetchCloudData, pushCloudData } from '../utils/cloudSync';

// Local Storage Keys
const SAVED_OFFERS_KEY = 'beton_saved_offers_v1';
const OFFER_COUNTER_KEY = 'beton_offer_counter_v1';

const getInitialCounter = () => {
  try {
    const saved = localStorage.getItem(OFFER_COUNTER_KEY);
    return saved ? parseInt(saved, 10) : 1;
  } catch {
    return 1;
  }
};

const getInitialOffers = () => {
  try {
    const saved = localStorage.getItem(SAVED_OFFERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const generateOfferNo = (counter, dateStr) => {
  const cleanDate = (dateStr || new Date().toISOString().split('T')[0]).replace(/-/g, '');
  const seq = String(counter).padStart(2, '0');
  return `BT-${cleanDate}-${seq}`;
};

export default function QuotationGenerator({ calculatedData, inputs }) {
  const [customerName, setCustomerName] = useState('YILMAZ İNŞAAT A.Ş.');
  const [projectName, setProjectName] = useState('Şantiye Konut Projesi - Bolvadin');
  const [offerDate, setOfferDate] = useState(new Date().toISOString().split('T')[0]);
  const [validityDays, setValidityDays] = useState(15);
  const [selectedProfitTier, setSelectedProfitTier] = useState('tier2'); // tier1, tier2, tier3

  // Storage & Counter State
  const [offerCounter, setOfferCounter] = useState(getInitialCounter);
  const [savedOffers, setSavedOffers] = useState(getInitialOffers);
  const [currentOfferNo, setCurrentOfferNo] = useState(() => generateOfferNo(getInitialCounter(), new Date().toISOString().split('T')[0]));
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  // Cloud Sync States
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Initial Cloud Sync Effect on Mount (Background Sync)
  useEffect(() => {
    let isMounted = true;
    const loadFromCloud = async () => {
      setIsCloudSyncing(true);
      const cloudRes = await fetchCloudData();
      if (isMounted && cloudRes.success) {
        const cloudOffers = cloudRes.offers || [];
        const cloudCounter = cloudRes.counter || 1;

        if (cloudOffers.length > 0) {
          setSavedOffers(cloudOffers);
          try {
            localStorage.setItem(SAVED_OFFERS_KEY, JSON.stringify(cloudOffers));
          } catch (e) {}

          // If the form currently has default placeholder customer, auto-load the most recent offer from cloud
          if (customerName === 'YILMAZ İNŞAAT A.Ş.') {
            const latest = cloudOffers[0];
            if (latest) {
              setCurrentOfferNo(latest.offerNo);
              setCustomerName(latest.customerName || '');
              setProjectName(latest.projectName || '');
              setOfferDate(latest.offerDate || new Date().toISOString().split('T')[0]);
              setValidityDays(latest.validityDays || 15);
              setSelectedProfitTier(latest.selectedProfitTier || 'tier2');
              setLineItems(latest.lineItems || []);
              setSaveSuccessMsg(`☁️ Buluttan ${cloudOffers.length} adet teklif eşitlendi. En son teklif #${latest.offerNo} forma yüklendi.`);
              setTimeout(() => setSaveSuccessMsg(null), 5000);
            }
          }
        }

        setOfferCounter(prevCounter => {
          const maxCounter = Math.max(prevCounter, cloudCounter);
          try {
            localStorage.setItem(OFFER_COUNTER_KEY, maxCounter.toString());
          } catch (e) {}
          if (maxCounter > prevCounter) {
            setCurrentOfferNo(generateOfferNo(maxCounter, offerDate));
          }
          return maxCounter;
        });
      }
      if (isMounted) setIsCloudSyncing(false);
    };

    loadFromCloud();
    return () => { isMounted = false; };
  }, []);

  // Cloud Sync Helper (Push to Cloud Store in background)
  const syncToCloud = async (offersToSync, counterToSync) => {
    setIsCloudSyncing(true);
    await pushCloudData(offersToSync, counterToSync);
    setIsCloudSyncing(false);
  };

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
          if (val === '' || val === undefined) {
            return { ...item, volume: '' };
          }
          const num = parseFloat(val);
          return { ...item, volume: isNaN(num) ? '' : num };
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
    const originalTitle = document.title;
    document.title = 'MALAKLAR İNŞAAT TAAHHÜT GIDA MADEN SANAYİ VE TİCARET A.Ş.';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
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
  const totalVolume = lineItems.reduce((acc, curr) => acc + (curr.volume || 0), 0);

  // SAVE OFFER TO LOCALSTORAGE & CLOUD & INCREMENT OFFER NO
  const handleSaveOffer = () => {
    const newOffer = {
      id: Date.now(),
      offerNo: currentOfferNo,
      customerName,
      projectName,
      offerDate,
      validityDays,
      selectedProfitTier,
      totalVolume,
      lineItems: JSON.parse(JSON.stringify(lineItems)),
      subtotalExcl,
      kdvAmount,
      grandTotal,
      createdAt: new Date().toISOString()
    };

    const updatedOffers = [newOffer, ...savedOffers];
    setSavedOffers(updatedOffers);
    try {
      localStorage.setItem(SAVED_OFFERS_KEY, JSON.stringify(updatedOffers));
    } catch (e) {}

    // Increment Counter for Next Offer
    const nextCounter = offerCounter + 1;
    setOfferCounter(nextCounter);
    try {
      localStorage.setItem(OFFER_COUNTER_KEY, nextCounter.toString());
    } catch (e) {}

    // Auto-generate Next Offer No
    const nextNo = generateOfferNo(nextCounter, offerDate);
    const savedNo = currentOfferNo;
    setCurrentOfferNo(nextNo);

    // Push to Cloud Store in Background
    syncToCloud(updatedOffers, nextCounter);

    setSaveSuccessMsg(`Teklif #${savedNo} cihazınıza ve Canlı Buluta kaydedildi! Sıradaki Teklif No (${nextNo}) atandı.`);
    setTimeout(() => setSaveSuccessMsg(null), 6000);
  };

  // LOAD SAVED OFFER FROM HISTORY
  const handleLoadOffer = (offer) => {
    setCurrentOfferNo(offer.offerNo);
    setCustomerName(offer.customerName || '');
    setProjectName(offer.projectName || '');
    setOfferDate(offer.offerDate || new Date().toISOString().split('T')[0]);
    setValidityDays(offer.validityDays || 15);
    setSelectedProfitTier(offer.selectedProfitTier || 'tier2');
    setLineItems(offer.lineItems || []);

    setSaveSuccessMsg(`Teklif #${offer.offerNo} başarıyla forma yüklendi.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // DELETE SAVED OFFER FROM HISTORY
  const handleDeleteOffer = (id) => {
    if (window.confirm('Bu teklifi kayıtlı geçmişten silmek istediğinize emin misiniz?')) {
      const updated = savedOffers.filter(o => o.id !== id);
      setSavedOffers(updated);
      try {
        localStorage.setItem(SAVED_OFFERS_KEY, JSON.stringify(updated));
      } catch (e) {}
      syncToCloud(updated, offerCounter);
    }
  };

  // CLEAR ALL SAVED OFFERS
  const handleClearAllOffers = () => {
    if (window.confirm('TÜM geçmiş teklif kayıtlarını silmek istediğinize emin misiniz?')) {
      setSavedOffers([]);
      localStorage.removeItem(SAVED_OFFERS_KEY);
      syncToCloud([], offerCounter);
    }
  };

  // EXPORT OFFERS TO JSON FILE FOR DEVICE TRANSFER
  const handleExportJson = () => {
    if (savedOffers.length === 0) {
      alert('Henüz kaydedilmiş teklif bulunmuyor.');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedOffers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Beton_Teklifleri_Yedek_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // IMPORT OFFERS FROM JSON FILE
  const handleImportJson = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (Array.isArray(imported)) {
            const existingIds = new Set(savedOffers.map(o => o.id));
            const newUnique = imported.filter(o => !existingIds.has(o.id));
            const merged = [...newUnique, ...savedOffers];
            setSavedOffers(merged);
            localStorage.setItem(SAVED_OFFERS_KEY, JSON.stringify(merged));
            syncToCloud(merged, offerCounter);
            setSaveSuccessMsg(`${newUnique.length} adet yeni teklif başarıyla aktarıldı! (Toplam ${merged.length} teklif)`);
            setTimeout(() => setSaveSuccessMsg(null), 5000);
          } else {
            alert('Geçersiz dosya biçimi.');
          }
        } catch (err) {
          alert('Dosya okuma hatası: ' + err.message);
        }
      };
    }
  };

  // MANUAL CLOUD SYNC TRIGGER
  const handleManualCloudSync = async () => {
    setIsCloudSyncing(true);
    const cloudRes = await fetchCloudData();
    if (cloudRes.success) {
      const cloudOffers = cloudRes.offers || [];
      const cloudCounter = cloudRes.counter || 1;

      if (cloudOffers.length > 0) {
        setSavedOffers(cloudOffers);
        try {
          localStorage.setItem(SAVED_OFFERS_KEY, JSON.stringify(cloudOffers));
        } catch (e) {}

        const latest = cloudOffers[0];
        if (latest) {
          handleLoadOffer(latest);
        }
      }

      setOfferCounter(prevCounter => {
        const maxCounter = Math.max(prevCounter, cloudCounter);
        try {
          localStorage.setItem(OFFER_COUNTER_KEY, maxCounter.toString());
        } catch (e) {}
        return maxCounter;
      });

      setSaveSuccessMsg(`☁️ Canlı bulut senkronizasyonu tamamlandı. ${cloudOffers.length} adet teklif eşitlendi.`);
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } else {
      alert('Bulut senkronizasyonunda hata oluştu: ' + (cloudRes.error || 'Bilinmeyen hata'));
    }
    setIsCloudSyncing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Card (Hidden on Print) */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/90 shadow-xl no-print space-y-5">
        
        {/* Top Header & Main Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  📄 MÜŞTERİ FİYAT TEKLİFİ OLUŞTURUCU
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Cloud className="w-3 h-3 mr-1 text-emerald-400" /> Canlı Bulut Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Teklif hazırlayın, kaydedin, PC ve mobil cihazlarınız arasında otomatik senkronize edin.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* MANUAL CLOUD SYNC BUTTON */}
            <button
              onClick={handleManualCloudSync}
              disabled={isCloudSyncing}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 transition active:scale-95 disabled:opacity-50"
              title="Tüm cihazların tekliflerini canlı buluttan şimdi eşitle"
            >
              <Cloud className={`w-3.5 h-3.5 mr-1.5 ${isCloudSyncing ? 'animate-pulse text-amber-400' : 'text-emerald-400'}`} />
              {isCloudSyncing ? '☁️ Eşitleniyor...' : '☁️ Canlı Bulut Eşitle'}
            </button>

            {/* SAVE BUTTON */}
            <button
              onClick={handleSaveOffer}
              className="inline-flex items-center px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition active:scale-95"
              title="Bu teklifi tarayıcıya ve buluta kaydet, teklif numarasını artır"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Teklifi Kaydet (Geçmişe Ekle)
            </button>

            {/* HISTORY TOGGLE BUTTON */}
            <button
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              className={`inline-flex items-center px-3.5 py-2 text-xs font-bold rounded-lg border transition active:scale-95 ${
                showHistoryPanel
                  ? 'bg-sky-500 text-slate-950 border-sky-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700'
              }`}
            >
              <History className="w-4 h-4 mr-1.5" />
              Geçmiş Teklifler ({savedOffers.length})
            </button>

            {/* PRINT BUTTON */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition active:scale-95"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Teklifi Yazdır / PDF Yap
            </button>
          </div>
        </div>

        {/* Save Alert Notification Banner */}
        {saveSuccessMsg && (
          <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between font-semibold animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-400 hover:text-white font-bold ml-3 text-xs underline">
              Kapat
            </button>
          </div>
        )}

        {/* SAVED OFFERS HISTORY EXPANDABLE PANEL */}
        {showHistoryPanel && (
          <div className="p-4 bg-slate-950/80 rounded-xl border border-sky-500/30 space-y-3 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  📜 KAYITLI GEÇMİŞ TEKLİFLER ARŞİVİ ({savedOffers.length} Teklif)
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ☁️ Canlı Bulut Senkronize
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Export Backup JSON */}
                <button
                  onClick={handleExportJson}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-bold border border-slate-700 flex items-center space-x-1"
                  title="Tüm teklifleri bilgisayar/telefon transfer dosyası (.json) olarak indir"
                >
                  <Download className="w-3 h-3 text-sky-400" />
                  <span>📥 Yedek İndir (Cihaz Transfer)</span>
                </button>

                {/* Import Backup JSON */}
                <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-bold border border-slate-700 flex items-center space-x-1 cursor-pointer">
                  <FolderOpen className="w-3 h-3 text-amber-400" />
                  <span>📤 Yedek Dosyası Yükle</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>

                {savedOffers.length > 0 && (
                  <button
                    onClick={handleClearAllOffers}
                    className="text-[11px] text-red-400 hover:text-red-300 font-bold ml-1"
                  >
                    Tümünü Temizle
                  </button>
                )}
              </div>
            </div>

            {savedOffers.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                Henüz kaydedilmiş teklif bulunmuyor. Yukarıdaki "Teklifi Kaydet" butonuna basarak tekliflerinizi tarayıcınıza ve buluta kaydedebilirsiniz.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-800">
                  <thead className="bg-slate-900 text-slate-300 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-2 border border-slate-800">Teklif No</th>
                      <th className="p-2 border border-slate-800">Tarih</th>
                      <th className="p-2 border border-slate-800">Müşteri Adı</th>
                      <th className="p-2 border border-slate-800">Proje / Şantiye</th>
                      <th className="p-2 border border-slate-800 text-right">Toplam (m³)</th>
                      <th className="p-2 border border-slate-800 text-right">Genel Toplam (KDV Dahil)</th>
                      <th className="p-2 border border-slate-800 text-center">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-slate-300">
                    {savedOffers.map((off) => (
                      <tr key={off.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                        <td className="p-2 border border-slate-800 font-bold text-amber-400">{off.offerNo}</td>
                        <td className="p-2 border border-slate-800 font-sans text-slate-400">{off.offerDate}</td>
                        <td className="p-2 border border-slate-800 font-sans font-bold text-white">{off.customerName}</td>
                        <td className="p-2 border border-slate-800 font-sans text-slate-300">{off.projectName}</td>
                        <td className="p-2 border border-slate-800 text-right font-bold">{off.totalVolume?.toLocaleString('tr-TR')} m³</td>
                        <td className="p-2 border border-slate-800 text-right font-bold text-emerald-400">{formatCurrency(off.grandTotal)}</td>
                        <td className="p-2 border border-slate-800 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleLoadOffer(off)}
                              className="px-2 py-1 bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 rounded text-[11px] font-sans font-bold transition"
                              title="Bu teklif verilerini forma yükle"
                            >
                              Forma Yükle
                            </button>
                            <button
                              onClick={() => handleDeleteOffer(off.id)}
                              className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                              title="Teklifi Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Input Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Teklif No (Otomatik Sıralı)</label>
            <input
              type="text"
              value={currentOfferNo}
              onChange={(e) => setCurrentOfferNo(e.target.value)}
              className="w-full bg-slate-950 text-amber-400 font-mono font-bold px-3 py-1.5 rounded border border-slate-800 focus:border-amber-500"
              title="Kaydet butonuna her bastığınızda otomatik artar, isterseniz elle değiştirebilirsiniz."
            />
          </div>

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
      <div className="printable-quote-container bg-white text-slate-950 p-5 sm:p-7 rounded-2xl border border-slate-300 shadow-2xl">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-3 mb-3 gap-3">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <img src="/images/image1.jpeg" alt="MİG Malaklar Logo" className="h-16 sm:h-18 w-auto object-contain shrink-0 mt-2 sm:mt-2.5" />
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider mb-0.5">
                RESMİ TEKLİF BELGESİ
              </span>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-950 font-sans uppercase leading-tight">
                MALAKLAR İNŞAAT TAAHHÜT GIDA MADEN SANAYİ VE TİCARET A.Ş.
              </h1>
              <p className="text-[11px] font-bold text-amber-800 tracking-wide uppercase mt-0.5">
                HAZIR BETON SANTRALİ ÜRETİM & SEVKİYAT KOORDİNATÖRLÜĞÜ
              </p>
              <div className="text-[10.5px] text-slate-700 font-medium mt-1 space-y-0.5 leading-snug">
                <p><strong>Merkez Adres:</strong> Susuz Beldesi, Sakarya Mahallesi, Hayat Caddesi No:9 AFYONKARAHİSAR</p>
                <p><strong>Tesis / Santral:</strong> Malaklar Hazır Beton - Selçuklu Mah. (Plus Kod: M27V+MQ), 03300 Bolvadin / AFYONKARAHİSAR</p>
                <p><strong>Tel:</strong> 0.272.221.12.12 – 0.272.221.15.75 &nbsp;|&nbsp; <strong>V.D. / No:</strong> TINAZTEPE V.D. - 611 052 27 44</p>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs font-mono shrink-0 bg-slate-100 p-2.5 rounded-lg border border-slate-300">
            <p className="font-black text-slate-950 text-xs sm:text-sm">Teklif No: {currentOfferNo}</p>
            <p className="text-slate-800 font-bold mt-0.5 text-[11px]">Tarih: {new Date(offerDate).toLocaleDateString('tr-TR')}</p>
            <p className="text-slate-700 font-semibold text-[11px]">Geçerlilik: {validityDays} Gün</p>
          </div>
        </div>

        {/* Corporate Quality Certification Badges Bar */}
        <div className="flex items-center justify-between border-y border-slate-300 py-2.5 my-3.5 bg-slate-50 px-4 rounded-xl">
          <span className="text-[10px] font-extrabold uppercase text-slate-600 tracking-wider">
            KALİTE & UYGUNLUK STANDARTLARIMIZ:
          </span>
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-1.5" title="KGS - Hazır Beton Kalite Güvence Sistemi">
              <img src="/images/image4.jpeg" alt="KGS Kalite Güvence Sistemi" className="h-7 w-auto object-contain mix-blend-multiply" />
            </div>
            <div className="flex items-center space-x-1.5" title="TSE - Türk Standartları Enstitüsü">
              <img src="/images/image5.jpeg" alt="TSE Türk Standartları Enstitüsü" className="h-6 w-auto object-contain mix-blend-multiply" />
            </div>
            <div className="flex items-center space-x-1.5" title="G Belgesi - Ürün Uygunluk Belgesi">
              <img src="/images/g-belgesi-logo-400x400.png" alt="G Belgesi" className="h-6 w-auto object-contain mix-blend-multiply" />
            </div>
            <div className="flex items-center space-x-1.5" title="Geri Dönüşüm Çevre Dostu Tesis">
              <img src="/images/image2.jpeg" alt="Geri Dönüşüm Çevre Dostu Tesis" className="h-6 w-auto object-contain mix-blend-multiply" />
            </div>
          </div>
        </div>

        {/* Customer & Project Info Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-100 p-3.5 rounded-xl mb-4 border border-slate-300 text-xs">
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
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs text-left border-collapse border border-slate-400">
            <thead className="bg-slate-200 text-slate-950 font-black uppercase text-[11px]">
              <tr>
                <th className="p-2.5 border border-slate-400 text-center">Sıra</th>
                <th className="p-2.5 border border-slate-400">Beton Sınıfı</th>
                <th className="p-2.5 border border-slate-400">Döküm / Üretim Tipi</th>
                <th className="p-2.5 border border-slate-400 text-right">Miktar (m³)</th>
                <th className="p-2.5 border border-slate-400 text-right">Birim Fiyat (KDV Hariç)</th>
                <th className="p-2.5 border border-slate-400 text-right">Toplam Tutar (KDV Hariç)</th>
              </tr>
            </thead>
            <tbody className="font-mono text-slate-900">
              {processedItems.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-300 hover:bg-slate-50">
                  <td className="p-2.5 border border-slate-300 font-bold text-center">{idx + 1}</td>
                  <td className="p-2.5 border border-slate-300 font-black font-sans text-sm text-slate-950">{item.class}</td>
                  <td className="p-2.5 border border-slate-300 font-sans font-bold text-slate-800">{item.type}</td>
                  <td className="p-2.5 border border-slate-300 text-right font-black text-slate-950">{item.volume.toLocaleString('tr-TR')} m³</td>
                  <td className="p-2.5 border border-slate-300 text-right font-bold text-slate-900">
                    {formatCurrency(item.unitPriceExcl)}
                    {item.isCustom && <span className="text-[10px] text-emerald-700 font-sans ml-1 no-print">(Özel)</span>}
                  </td>
                  <td className="p-2.5 border border-slate-300 text-right font-black text-slate-950 text-sm">{formatCurrency(item.itemTotalExcl)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Calculations */}
        <div className="flex justify-end mb-5">
          <div className="w-full sm:w-80 bg-slate-100 p-3.5 rounded-xl border border-slate-400 space-y-2 text-xs font-mono text-slate-900">
            <div className="flex justify-between text-slate-800 font-bold">
              <span>Ara Toplam (KDV Hariç):</span>
              <span className="font-black text-slate-950">{formatCurrency(subtotalExcl)}</span>
            </div>
            <div className="flex justify-between text-slate-800 font-bold">
              <span>KDV (%{Math.round(inputs.kdvOrani * 100)}):</span>
              <span className="font-black text-slate-950">{formatCurrency(kdvAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t-2 border-slate-400">
              <span>GENEL TOPLAM:</span>
              <span className="text-amber-800">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Signatures */}
        <div className="border-t-2 border-slate-900 pt-4 text-[11px] text-slate-800 space-y-2.5">
          <p className="font-extrabold text-slate-950 uppercase text-xs">Teklif Şartları & Genel Esaslar:</p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-medium">
            <li className="leading-relaxed">
              <strong>Hammadde & Fiyat Farkı Esası:</strong> İşbu teklifte belirtilen birim fiyatlar, teklif tarihindeki güncel <strong>çimento hammadde fiyatı ({inputs.cimentoFiyati.toLocaleString('tr-TR')} TL/Ton)</strong> ve <strong>motorin yakıt fiyatı ({inputs.mazotFiyati.toFixed(2)} TL/Litre KDV Hariç)</strong> baz alınarak hesaplanmıştır. Sözleşme veya teslimat sürecinde hammadde ve yakıt fiyatlarında meydana gelebilecek değişiklikler, ilgili beton sınıfının reçete dozaj oranları ve nakliye mesafeleri doğrultusunda birim fiyatlara aynen fiyat farkı olarak eklenecektir.
            </li>
            <li>Beton dökümü öncesinde zemin, mikser yanaşma yolu ve kalıp kontrolü şantiye yetkilisi tarafından sağlanmalıdır.</li>
            <li>Pompalı dökümlerde araç bekleme süreleri standart 45 dakikayı aşmamalıdır.</li>
            <li>Teklif verilen fiyatlar belirtilen geçerlilik süresince ({validityDays} gün) sabittir.</li>
          </ul>

          <div className="grid grid-cols-2 gap-12 pt-5 text-center text-xs font-bold text-slate-950 items-stretch">
            <div className="flex flex-col justify-between min-h-[90px]">
              <div>
                <p className="font-black text-slate-950 leading-tight">MALAKLAR İNŞAAT TAAHHÜT GIDA MADEN SANAYİ VE TİCARET A.Ş.</p>
                <p className="text-[10px] text-slate-600 font-semibold font-mono mt-0.5">TINAZTEPE V.D. - 611 052 27 44</p>
              </div>
              <p className="border-t border-slate-400 pt-1 text-[11px] text-slate-700 font-semibold mt-3">Yetkili İmza & Kaşe</p>
            </div>
            <div className="flex flex-col justify-between min-h-[90px]">
              <div>
                <p className="font-black text-slate-950 leading-tight">MÜŞTERİ ONAYI</p>
              </div>
              <p className="border-t border-slate-400 pt-1 text-[11px] text-slate-700 font-semibold mt-3">İmza & Kaşe</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
