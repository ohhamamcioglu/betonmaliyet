import { CONCRETE_CLASSES, PRODUCTION_TYPES } from '../data/defaultData';

/**
 * Calculates concrete cost breakdown and final price matrix
 * @param {Object} inputs User configured input parameters
 * @param {Object} recipes Concrete recipes (mix design) per m³
 * @returns {Object} Comprehensive calculation result
 */
export function calculateConcreteCosts(inputs = {}, recipes = {}) {
  // Parse inputs safely (convert empty string '' or NaN to 0)
  const cimentoFiyati = Number(inputs.cimentoFiyati) || 0;
  const agregaFiyati = Number(inputs.agregaFiyati) || 0;
  const katkiFiyatiUSD = Number(inputs.katkiFiyatiUSD) || 0;
  const dolarKuru = Number(inputs.dolarKuru) || 0;
  const mazotFiyati = Number(inputs.mazotFiyati) || 0;
  const elektrikFiyati = Number(inputs.elektrikFiyati) || 0;
  const suFiyati = Number(inputs.suFiyati) || 0;
  const isciMaasi = Number(inputs.isciMaasi) || 0;

  const dokumMesafesi = Number(inputs.dokumMesafesi) || 0;
  const agregaMesafesi = Number(inputs.agregaMesafesi) || 0;
  const gunlukDokum = Number(inputs.gunlukDokum) || 0;
  const mikserKapasitesi = Number(inputs.mikserKapasitesi) || 0;

  const santralKira = Number(inputs.santralKira) || 0;
  const mikserKira = Number(inputs.mikserKira) || 0;
  const pompaKira = Number(inputs.pompaKira) || 0;
  const loaderKira = Number(inputs.loaderKira) || 0;
  const servisKira = Number(inputs.servisKira) || 0;

  const karOrani1 = Number(inputs.karOrani1) || 0;
  const karOrani2 = Number(inputs.karOrani2) || 0;
  const karOrani3 = Number(inputs.karOrani3) || 0;
  const kdvOrani = Number(inputs.kdvOrani) || 0;

  const mikserYakitTuketimi = Number(inputs.mikserYakitTuketimi) || 0;
  const agregaYakitTuketimi = Number(inputs.agregaYakitTuketimi) || 0;
  const agregaKamyonKapasitesi = Number(inputs.agregaKamyonKapasitesi) || 0;
  const agregaNakliyeKarOrani = Number(inputs.agregaNakliyeKarOrani) || 0;
  const pompaYakitTuketimi = Number(inputs.pompaYakitTuketimi) || 0;
  const kepceYakitTuketimi = Number(inputs.kepceYakitTuketimi) || 0;
  const isciSayisi = Number(inputs.isciSayisi) || 0;
  const elektrikTuketimi = Number(inputs.elektrikTuketimi) || 0;
  const suTuketimi = Number(inputs.suTuketimi) || 0;
  const digerGiderOrani = Number(inputs.digerGiderOrani) || 0;
  const katkiOrani = Number(inputs.katkiOrani) || 0;

  const mikserAdedi = Number(inputs.mikserAdedi) || 0;
  const pompaAdedi = Number(inputs.pompaAdedi) || 0;
  const loaderAdedi = Number(inputs.loaderAdedi) || 0;
  const santralAdedi = Number(inputs.santralAdedi) || 0;
  const servisAdedi = Number(inputs.servisAdedi) || 0;
  const aylikGunSayisi = Number(inputs.aylikGunSayisi) || 30;

  // Safe checks for zero denominators
  const safeGunlukDokum = gunlukDokum > 0 ? gunlukDokum : 1;
  const safeAylikGun = aylikGunSayisi > 0 ? aylikGunSayisi : 30;
  const safeMikserKapasitesi = mikserKapasitesi > 0 ? mikserKapasitesi : 10;
  const safeKamyonKapasitesi = agregaKamyonKapasitesi > 0 ? agregaKamyonKapasitesi : 38;

  // Global unit operational costs (TL / m³ or TL / unit)
  const kepceMotorinTL = kepceYakitTuketimi * mazotFiyati;
  const iscilikTL = (isciSayisi * isciMaasi) / (safeAylikGun * safeGunlukDokum);
  const elektrikTL = elektrikTuketimi * elektrikFiyati;
  const suTL = suTuketimi * suFiyati;

  // Fixed equipment rental unit costs per m³
  const mikserKiraTL = (mikserAdedi * mikserKira) / (safeAylikGun * safeGunlukDokum);
  const pompaKiraTL = (pompaAdedi * pompaKira) / (safeAylikGun * safeGunlukDokum);
  const loaderKiraTL = (loaderAdedi * loaderKira) / (safeAylikGun * safeGunlukDokum);
  const santralKiraTL = (santralAdedi * santralKira) / (safeAylikGun * safeGunlukDokum);
  const servisKiraTL = (servisAdedi * servisKira) / (safeAylikGun * safeGunlukDokum);

  const toplamKiraTL = mikserKiraTL + pompaKiraTL + loaderKiraTL + santralKiraTL + servisKiraTL;

  // Transport motor fuel per m³
  const mikserMotorinTL = (mikserYakitTuketimi * 2 * dokumMesafesi / safeMikserKapasitesi) * mazotFiyati;
  const pompaMotorinTL = pompaYakitTuketimi * mazotFiyati;

  // Per-class detailed calculations
  const classResults = {};

  CONCRETE_CLASSES.forEach((cls) => {
    const recipe = recipes[cls] || { cimento: 300, agrega: 1900 };
    const cimentoKg = Number(recipe.cimento) || 0;
    const agregaKg = Number(recipe.agrega) || 0;
    
    // Katkı kg (use recipe override if specified, otherwise cimento * katkiOrani)
    const katkiKg = recipe.katkiOverride !== undefined 
      ? Number(recipe.katkiOverride) 
      : (cimentoKg * katkiOrani);

    // Component Costs
    const cimentoTL = (cimentoKg * cimentoFiyati) / 1000;
    const agregaTL = (agregaKg * agregaFiyati) / 1000;
    const katkiTL = katkiKg * katkiFiyatiUSD * dolarKuru;

    // Agrega Nakliye formula
    const agregaNakliyeTL = (agregaYakitTuketimi * 2 * agregaMesafesi / safeKamyonKapasitesi) 
      * mazotFiyati 
      * (agregaKg / 1000) 
      * (1 + agregaNakliyeKarOrani);

    // Subtotal of raw materials + general overheads (Ortak Maliyet Ara Toplam)
    const ortakAraToplam = cimentoTL + agregaTL + katkiTL + agregaNakliyeTL + kepceMotorinTL + iscilikTL + elektrikTL + suTL + toplamKiraTL;

    // Production type base total costs (including 5% other expenses)
    const pompaliMaliyet = (ortakAraToplam + mikserMotorinTL + pompaMotorinTL) * (1 + digerGiderOrani);
    const mikserliMaliyet = (ortakAraToplam + mikserMotorinTL) * (1 + digerGiderOrani);
    const santralAltiMaliyet = ortakAraToplam * (1 + digerGiderOrani);

    // Price calculation builder helper
    const buildPrices = (baseCost) => {
      const p1_excl = baseCost * (1 + karOrani1);
      const p1_incl = p1_excl * (1 + kdvOrani);

      const p2_excl = baseCost * (1 + karOrani2);
      const p2_incl = p2_excl * (1 + kdvOrani);

      const p3_excl = baseCost * (1 + karOrani3);
      const p3_incl = p3_excl * (1 + kdvOrani);

      return {
        baseCost,
        tier1: { profitRate: karOrani1, excl: p1_excl, incl: p1_incl },
        tier2: { profitRate: karOrani2, excl: p2_excl, incl: p2_incl },
        tier3: { profitRate: karOrani3, excl: p3_excl, incl: p3_incl },
      };
    };

    classResults[cls] = {
      recipe: { cimentoKg, agregaKg, katkiKg },
      costs: {
        cimentoTL,
        agregaTL,
        katkiTL,
        agregaNakliyeTL,
        kepceMotorinTL,
        iscilikTL,
        elektrikTL,
        suTL,
        mikserKiraTL,
        pompaKiraTL,
        loaderKiraTL,
        santralKiraTL,
        servisKiraTL,
        toplamKiraTL,
        ortakAraToplam,
        mikserMotorinTL,
        pompaMotorinTL,
      },
      productionTypes: {
        POMPALI: buildPrices(pompaliMaliyet),
        MİKSERLİ: buildPrices(mikserliMaliyet),
        'SANTRAL ALTI': buildPrices(santralAltiMaliyet),
      }
    };
  });

  return {
    classResults,
    sharedMetrics: {
      kepceMotorinTL,
      iscilikTL,
      elektrikTL,
      suTL,
      toplamKiraTL,
      mikserMotorinTL,
      pompaMotorinTL,
    }
  };
}

/**
 * Utility to format TL values cleanly
 */
export function formatCurrency(value, decimals = 2) {
  if (value === undefined || value === null || isNaN(value)) return '0,00 ₺';
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value) + ' ₺';
}

/**
 * Utility to format percentages cleanly
 */
export function formatPercent(value, decimals = 1) {
  if (value === undefined || value === null || isNaN(value)) return '%0';
  return `%${(Number(value) * 100).toFixed(decimals)}`;
}
