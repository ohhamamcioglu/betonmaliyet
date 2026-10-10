import React from 'react';
import { X, SlidersHorizontal, Check, RotateCcw } from 'lucide-react';
import { DEFAULT_INPUTS } from '../data/defaultData';

export default function AdvancedSettingsModal({ isOpen, onClose, inputs, setInputs }) {
  if (!isOpen) return null;

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

  const handleResetSection = () => {
    setInputs(prev => ({
      ...prev,
      mikserYakitTuketimi: DEFAULT_INPUTS.mikserYakitTuketimi,
      agregaYakitTuketimi: DEFAULT_INPUTS.agregaYakitTuketimi,
      agregaKamyonKapasitesi: DEFAULT_INPUTS.agregaKamyonKapasitesi,
      agregaNakliyeKarOrani: DEFAULT_INPUTS.agregaNakliyeKarOrani,
      pompaYakitTuketimi: DEFAULT_INPUTS.pompaYakitTuketimi,
      kepceYakitTuketimi: DEFAULT_INPUTS.kepceYakitTuketimi,
      isciSayisi: DEFAULT_INPUTS.isciSayisi,
      elektrikTuketimi: DEFAULT_INPUTS.elektrikTuketimi,
      suTuketimi: DEFAULT_INPUTS.suTuketimi,
      digerGiderOrani: DEFAULT_INPUTS.digerGiderOrani,
      katkiOrani: DEFAULT_INPUTS.katkiOrani,
      mikserAdedi: DEFAULT_INPUTS.mikserAdedi,
      pompaAdedi: DEFAULT_INPUTS.pompaAdedi,
      loaderAdedi: DEFAULT_INPUTS.loaderAdedi,
      santralAdedi: DEFAULT_INPUTS.santralAdedi,
      servisAdedi: DEFAULT_INPUTS.servisAdedi,
      aylikGunSayisi: DEFAULT_INPUTS.aylikGunSayisi,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-6 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Gelişmiş Teknik & Operasyonel Parametreler
              </h3>
              <p className="text-xs text-slate-400">
                Yakıt sarfiyat katsayıları, araç sayıları ve genel gider oranlarını ayarlayın.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 scrollbar-thin">
          
          {/* Yakıt Sarfiyatatsayıları */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              ⛽ Yakıt Sarfiyat Katsayıları
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mikser Yakıt Sarfiyatı</label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.05"
                    value={inputs.mikserYakitTuketimi}
                    onChange={(e) => handleChange('mikserYakitTuketimi', e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                  />
                  <span className="text-[11px] text-slate-400">L/km</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Agrega Kamyon Yakıtı</label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.05"
                    value={inputs.agregaYakitTuketimi}
                    onChange={(e) => handleChange('agregaYakitTuketimi', e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                  />
                  <span className="text-[11px] text-slate-400">L/km</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pompa Motorin</label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.05"
                    value={inputs.pompaYakitTuketimi}
                    onChange={(e) => handleChange('pompaYakitTuketimi', e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                  />
                  <span className="text-[11px] text-slate-400">L/m³</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kepçe Motorin</label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.05"
                    value={inputs.kepceYakitTuketimi}
                    onChange={(e) => handleChange('kepceYakitTuketimi', e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                  />
                  <span className="text-[11px] text-slate-400">L/m³</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Agrega Kamyon Kapasitesi</label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    value={inputs.agregaKamyonKapasitesi}
                    onChange={(e) => handleChange('agregaKamyonKapasitesi', e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                  />
                  <span className="text-[11px] text-slate-400">ton</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Agrega Nakliye Kâr Payı</label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="1"
                    value={Math.round(inputs.agregaNakliyeKarOrani * 100)}
                    onChange={(e) => handlePercentChange('agregaNakliyeKarOrani', e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                  />
                  <span className="text-[11px] text-slate-400">%</span>
                </div>
              </div>

            </div>
          </div>

          {/* Tesis Tüketim & Genel Giderler */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
              ⚡ Tüketim Oranları & Genel Giderler
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Toplam İşçi Sayısı</label>
                <input
                  type="number"
                  value={inputs.isciSayisi}
                  onChange={(e) => handleChange('isciSayisi', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Elektrik Tüketimi</label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.elektrikTuketimi}
                    onChange={(e) => handleChange('elektrikTuketimi', e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                  />
                  <span className="text-[11px] text-slate-400">kWh/m³</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Su Tüketimi</label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.suTuketimi}
                    onChange={(e) => handleChange('suTuketimi', e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                  />
                  <span className="text-[11px] text-slate-400">ton/m³</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Diğer Genel Gider Oranı</label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="1"
                    value={Math.round(inputs.digerGiderOrani * 100)}
                    onChange={(e) => handlePercentChange('digerGiderOrani', e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                  />
                  <span className="text-[11px] text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Katkı Dozaj Oranı</label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={(inputs.katkiOrani * 100).toFixed(1)}
                    onChange={(e) => handlePercentChange('katkiOrani', e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                  />
                  <span className="text-[11px] text-slate-400">% (çimento)</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Aylık Çalışma Gün Sayısı</label>
                <input
                  type="number"
                  value={inputs.aylikGunSayisi}
                  onChange={(e) => handleChange('aylikGunSayisi', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                />
              </div>

            </div>
          </div>

          {/* Araç ve Ekipman Sayıları */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              🚜 Tesis & Araç Adetleri
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mikser Adedi</label>
                <input
                  type="number"
                  value={inputs.mikserAdedi}
                  onChange={(e) => handleChange('mikserAdedi', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pompa Adedi</label>
                <input
                  type="number"
                  value={inputs.pompaAdedi}
                  onChange={(e) => handleChange('pompaAdedi', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Loader Adedi</label>
                <input
                  type="number"
                  value={inputs.loaderAdedi}
                  onChange={(e) => handleChange('loaderAdedi', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Santral Adedi</label>
                <input
                  type="number"
                  value={inputs.santralAdedi}
                  onChange={(e) => handleChange('santralAdedi', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Servis Adedi</label>
                <input
                  type="number"
                  value={inputs.servisAdedi}
                  onChange={(e) => handleChange('servisAdedi', e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono px-2 py-1 rounded border border-slate-700"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={handleResetSection}
            className="inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Teknik Değerleri Sıfırla
          </button>
          
          <button
            onClick={onClose}
            className="inline-flex items-center px-5 py-2 text-xs font-bold rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Kaydet & Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
