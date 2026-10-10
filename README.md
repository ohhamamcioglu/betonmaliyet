# 🏗️ Beton Maliyet & Satış Fiyatı Hesaplama Sistemi

Hazır beton üreticileri, şantiye yöneticileri ve müteahhitler için geliştirilmiş **dinamik maliyet, reçete, nakliye, kârlılık ve fiyatlama paneli**.

![Beton Maliyet Paneli](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat&logo=tailwindcss&logoColor=white)
![Veri](https://img.shields.io/badge/TCMB%20%26%20PO-Canlı%20Kur-0076C9)

---

## 🌟 Öne Çıkan Özellikler

- **🔍 Hızlı Fiyat Sorgulama**: Üretim tipi (*Pompalı*, *Mikserli*, *Santral Altı*), beton sınıfı (`C 16` - `C 40`) ve kâr oranı seçimiyle anında maliyet ve fatura tutarı hesaplama.
- **🌐 Canlı Kur & Mazot Entegrasyonu**: TCMB canlı Dolar kuru ve Petrol Ofisi motorin/mazot pompa fiyatlarını tek tıkla canlı çekebilme.
- **💛 Dinamik Maliyet Girdileri**: Çimento, agrega, katkı ($), elektrik, su, işçilik maaşları ve aylık araç/tesis kira bedelleri.
- **📋 Detaylı Fiyat Listesi Tablosu**: 3 farklı kâr seviyesi (%10, %15, %20) ile KDV Hariç ve KDV Dahil fiyat matrisi.
- **📈 Grafik & Maliyet Yapısı Analizi**: Recharts ile 1 m³ beton maliyet bileşenlerinin ve beton sınıfları maliyet eğrilerinin görselleştirilmesi.
- **⚡ Hassasiyet & Senaryo Analizi ("Ne Olursa Ne Olur?")**: Mazot, çimento ve döviz fiyatlarındaki % değişimlerin m³ maliyetine ve aylık toplam şirket kârlılığına etkisini simüle eden canlı kaydırıcılar.
- **🧪 Reçete & Karışım Ayarları**: Beton sınıflarına göre 1 m³ karışıma giren Çimento (kg) ve Agrega (kg) dozaj özelleştirmeleri.
- **📄 Müşteri Teklifi Oluşturucu & Yazdır / PDF**: Resmi fiyat teklifi formu oluşturma, A4 yazdırma ve PDF aktarımı.
- **📊 Excel Export**: Tüm hesaplama ve fiyat listelerini `.xlsx` formatında dışa aktarma.
- **📱 Mobil Odaklı (Mobile-First)**: Tüm akıllı telefon, tablet ve masaüstü cihazlarla %100 tam duyarlı (responsive) tasarım.

---

## 🚀 Yerel Geliştirme (Local Setup)

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

---

## 🛠️ Kullanılan Teknolojiler

- **Core**: React 18, Vite 6, JavaScript (ES6+)
- **Styling**: Tailwind CSS, Glassmorphism UI, Lucide Icons
- **Grafikler**: Recharts
- **Export & Excel**: XLSX (SheetJS)
