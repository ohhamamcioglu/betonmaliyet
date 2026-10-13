// Default values extracted from Excel sheet 'Beton Maliyet-1.xlsx'

export const DEFAULT_INPUTS = {
  // 1. Güncel Fiyatlar (KDV Hariç)
  cimentoFiyati: 4300,      // TL / ton
  agregaFiyati: 200,       // TL / ton
  katkiFiyatiUSD: 0.62,     // $ / kg
  dolarKuru: 49.16,         // TL / $
  mazotFiyati: 82.40,       // TL / litre (KDV Hariç net maliyet - Pompa: 98.88 TL/L)
  elektrikFiyati: 2.92,     // TL / kWh
  suFiyati: 12.175,         // TL / ton
  isciMaasi: 70000,         // TL / kişi / ay (Maaş + SGK)

  // 2. İşletme ve Lojistik Bilgileri
  dokumMesafesi: 13,        // km (Ortalama Beton Döküm Mesafesi - Bolvadin Santral Çıkışlı)
  agregaMesafesi: 21,       // km (Agrega Taşıma Mesafesi)
  gunlukDokum: 140,         // m³ / gün
  mikserKapasitesi: 10,     // m³

  // 3. Aylık Kira Bedelleri (TL / ay)
  santralKira: 0,
  mikserKira: 0,
  pompaKira: 0,
  loaderKira: 0,
  servisKira: 0,

  // 4. Kâr ve KDV Oranları
  karOrani1: 0.10,   // %10
  karOrani2: 0.15,   // %15
  karOrani3: 0.20,   // %20
  kdvOrani: 0.20,    // %20

  // 5. Gelişmiş Teknik Parametreler
  mikserYakitTuketimi: 0.7,   // L / km
  agregaYakitTuketimi: 0.4,   // L / km
  agregaKamyonKapasitesi: 38, // ton
  agregaNakliyeKarOrani: 0.15,// %15 (Agrega nakliye kâr payı)
  pompaYakitTuketimi: 0.73,   // L / m³
  kepceYakitTuketimi: 0.35,   // L / m³
  isciSayisi: 21,             // kişi
  elektrikTuketimi: 5.5,      // kWh / m³
  suTuketimi: 1.0,            // ton / m³
  digerGiderOrani: 0.05,      // %5
  katkiOrani: 0.01,           // çimentonun %1'i

  // Araç Adetleri
  mikserAdedi: 6,
  pompaAdedi: 3,
  loaderAdedi: 1,
  santralAdedi: 1,
  servisAdedi: 1,
  aylikGunSayisi: 30,
};

// Standard Mix Recipes per m³
export const DEFAULT_RECIPES = {
  'C 16': { cimento: 170, agrega: 1940, katkiOverride: 1.9 },
  'C 20': { cimento: 230, agrega: 1868.4 },
  'C 25': { cimento: 290, agrega: 1939 },
  'C 30': { cimento: 330, agrega: 1892 },
  'C 35': { cimento: 370, agrega: 1859 },
  'C 40': { cimento: 410, agrega: 1819 },
};

export const CONCRETE_CLASSES = ['C 16', 'C 20', 'C 25', 'C 30', 'C 35', 'C 40'];
export const PRODUCTION_TYPES = [
  { id: 'POMPALI', label: 'Pompalı', desc: 'Beton mikserle taşınır ve pompa ile dökülür.' },
  { id: 'MİKSERLİ', label: 'Mikserli', desc: 'Beton mikserle şantiyeye taşınır, pompa kullanılmaz.' },
  { id: 'SANTRAL ALTI', label: 'Santral Altı', desc: 'Müşteri betonu santralden kendi aracıyla teslim alır.' }
];
