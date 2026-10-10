// Afyonkarahisar, Bolvadin, Çay, Çobanlar, Sultandağı ve Tüm İlçeler / Beldeler Mesafeleri
// Santral Çıkış Adresi: Selçuklu, M27V+MQ, 03300 Bolvadin/Afyonkarahisar (Google Haritalar Gerçek Sürüş Rotaları)

export const PLANT_ADDRESS = {
  title: 'Bolvadin Beton Santrali',
  address: 'Selçuklu, M27V+MQ, 03300 Bolvadin/Afyonkarahisar',
  defaultDistanceKm: 13
};

export const AFYON_LOCATIONS = [
  // 1. BOLVADİN İLÇESİ, BELDELERİ VE KÖYLERİ (Selçuklu Mah. Santral Çıkışlı)
  { id: 'bolvadin-selcuklu', name: 'Bolvadin Selçuklu Mah. (Santral Çevresi)', distanceKm: 2, category: 'Bolvadin ve Beldeler/Köyler' },
  { id: 'bolvadin-merkez', name: 'Bolvadin Şehir Merkezi', distanceKm: 4, category: 'Bolvadin ve Beldeler/Köyler' },
  { id: 'bolvadin-sanayi', name: 'Bolvadin Sanayi Sitesi & OSB', distanceKm: 5, category: 'Bolvadin ve Beldeler/Köyler' },
  { id: 'disli', name: 'Dişli Kasabası (Bolvadin)', distanceKm: 7, category: 'Bolvadin ve Beldeler/Köyler' },
  { id: 'karayokus', name: 'Karayokuş Köyü (Bolvadin)', distanceKm: 9, category: 'Bolvadin ve Beldeler/Köyler' },
  { id: 'hamidiye', name: 'Hamidiye Köyü (Bolvadin)', distanceKm: 11, category: 'Bolvadin ve Beldeler/Köyler' },
  { id: 'ozburun', name: 'Özburun Kasabası (Bolvadin)', distanceKm: 13, category: 'Bolvadin ve Beldeler/Köyler' },
  { id: 'kurucaova', name: 'Kurucaova Köyü (Bolvadin)', distanceKm: 15, category: 'Bolvadin ve Beldeler/Köyler' },
  { id: 'tasagil', name: 'Taşağıl Köyü (Bolvadin)', distanceKm: 17, category: 'Bolvadin ve Beldeler/Köyler' },
  { id: 'kemerkaya', name: 'Kemerkaya Köyü (Bolvadin)', distanceKm: 21, category: 'Bolvadin ve Beldeler/Köyler' },
  { id: 'buyukkarabag', name: 'Büyükkarabağ Köyü (Bolvadin)', distanceKm: 26, category: 'Bolvadin ve Beldeler/Köyler' },
  { id: 'derekarabag', name: 'Derekarabağ Köyü (Bolvadin)', distanceKm: 30, category: 'Bolvadin ve Beldeler/Köyler' },

  // 2. ÇAY İLÇESİ, BELDELERİ VE KÖYLERİ (D675 Rotalı)
  { id: 'pazaragac', name: 'Pazarağaç Kasabası (Çay)', distanceKm: 10, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'cay-merkez', name: 'Çay İlçe Merkezi', distanceKm: 13, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'eber', name: 'Eber Köyü (Göl Çevresi - Çay)', distanceKm: 15, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'inli', name: 'İnli Köyü (Çay)', distanceKm: 17, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'vakif', name: 'Vakıf Köyü (Çay)', distanceKm: 18, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'aydogmus', name: 'Aydoğmuş Köyü (Çay)', distanceKm: 21, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'cayiryazi', name: 'Çayıryazı Köyü (Çay)', distanceKm: 22, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'deresinek', name: 'Deresinek Kasabası (Çay)', distanceKm: 23, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'karamikkaracaoren', name: 'Karamıkkaracaören Kasabası (Çay)', distanceKm: 24, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'armutlu', name: 'Armutlu Köyü (Çay)', distanceKm: 26, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'kocbeyli', name: 'Koçbeyli Köyü (Çay)', distanceKm: 27, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'orhaniye', name: 'Orhaniye Köyü (Çay)', distanceKm: 28, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'yesilyurt-cay', name: 'Yeşilyurt Köyü (Çay)', distanceKm: 29, category: 'Çay İlçesi ve Belde/Köyleri' },
  { id: 'karamik', name: 'Karamık Köyü (Çay)', distanceKm: 31, category: 'Çay İlçesi ve Belde/Köyleri' },

  // 3. ÇOBANLAR İLÇESİ, BELDELERİ VE KÖYLERİ (Çobanlar-Bolvadin Rotalı)
  { id: 'kocaoz', name: 'Kocaöz Kasabası (Çobanlar)', distanceKm: 16, category: 'Çobanlar İlçesi ve Belde/Köyleri' },
  { id: 'akkoyunlu', name: 'Akkoyunlu Köyü (Çobanlar)', distanceKm: 25, category: 'Çobanlar İlçesi ve Belde/Köyleri' },
  { id: 'cobanlar-merkez', name: 'Çobanlar İlçe Merkezi', distanceKm: 28, category: 'Çobanlar İlçesi ve Belde/Köyleri' },
  { id: 'kale', name: 'Kale Köyü (Çobanlar)', distanceKm: 31, category: 'Çobanlar İlçesi ve Belde/Köyleri' },
  { id: 'ciftlik-cobanlar', name: 'Çiftlik Köyü (Çobanlar)', distanceKm: 33, category: 'Çobanlar İlçesi ve Belde/Köyleri' },
  { id: 'goynuk', name: 'Göynük Köyü (Çobanlar)', distanceKm: 35, category: 'Çobanlar İlçesi ve Belde/Köyleri' },

  // 4. SULTANDAĞI İLÇESİ, BELDELERİ VE KÖYLERİ (Çay Üzeri D300 Rotalı)
  { id: 'uckuyu', name: 'Üçkuyu Kasabası (Sultandağı)', distanceKm: 21, category: 'Sultandağı İlçesi ve Belde/Köyleri' },
  { id: 'kirca', name: 'Kırca Kasabası (Sultandağı)', distanceKm: 26, category: 'Sultandağı İlçesi ve Belde/Köyleri' },
  { id: 'taskopru', name: 'Taşköprü Köyü (Sultandağı)', distanceKm: 27, category: 'Sultandağı İlçesi ve Belde/Köyleri' },
  { id: 'ormeli', name: 'Örmeli Köyü (Sultandağı)', distanceKm: 29, category: 'Sultandağı İlçesi ve Belde/Köyleri' },
  { id: 'sultandagi-merkez', name: 'Sultandağı İlçe Merkezi', distanceKm: 32, category: 'Sultandağı İlçesi ve Belde/Köyleri' },
  { id: 'yesilciftlik', name: 'Yeşilçiftlik Kasabası (Sultandağı)', distanceKm: 35, category: 'Sultandağı İlçesi ve Belde/Köyleri' },
  { id: 'karakisla', name: 'Karakışla Köyü (Sultandağı)', distanceKm: 37, category: 'Sultandağı İlçesi ve Belde/Köyleri' },
  { id: 'yakasinek', name: 'Yakasinek Kasabası (Sultandağı)', distanceKm: 38, category: 'Sultandağı İlçesi ve Belde/Köyleri' },
  { id: 'camozu', name: 'Çamözü Köyü (Sultandağı)', distanceKm: 39, category: 'Sultandağı İlçesi ve Belde/Köyleri' },
  { id: 'derecine', name: 'Dereçine Kasabası (Sultandağı)', distanceKm: 41, category: 'Sultandağı İlçesi ve Belde/Köyleri' },
  { id: 'cukurcak', name: 'Çukurcak Köyü (Sultandağı)', distanceKm: 43, category: 'Sultandağı İlçesi ve Belde/Köyleri' },
  { id: 'dogancik', name: 'Doğancık Köyü (Sultandağı)', distanceKm: 45, category: 'Sultandağı İlçesi ve Belde/Köyleri' },

  // 5. DİĞER YAKIN İLÇELER (Emirdağ, İscehisar, Bayat vb.)
  { id: 'emirdag', name: 'Emirdağ İlçe Merkezi', distanceKm: 42, category: 'Diğer Yakın İlçeler' },
  { id: 'iscehisar', name: 'İscehisar Mermer İhtisas & Merkez', distanceKm: 46, category: 'Diğer Yakın İlçeler' },
  { id: 'bayat', name: 'Bayat İlçe Merkezi', distanceKm: 52, category: 'Diğer Yakın İlçeler' },

  // 6. AFYONKARAHİSAR MERKEZ VE DİĞER İLÇELER
  { id: 'afyon-merkez', name: 'Afyonkarahisar Şehir Merkezi', distanceKm: 53, category: 'Afyon Merkez & Diğer İlçeler' },
  { id: 'suhut', name: 'Şuhut İlçe Merkezi', distanceKm: 68, category: 'Afyon Merkez & Diğer İlçeler' },
  { id: 'ihsaniye', name: 'İhsaniye İlçe Merkezi', distanceKm: 76, category: 'Afyon Merkez & Diğer İlçeler' },
  { id: 'sinanpasa', name: 'Sinanpaşa İlçe Merkezi', distanceKm: 85, category: 'Afyon Merkez & Diğer İlçeler' },
  { id: 'sandikli', name: 'Sandıklı İlçe Merkezi', distanceKm: 98, category: 'Afyon Merkez & Diğer İlçeler' },
  { id: 'dinar', name: 'Dinar İlçe Merkezi', distanceKm: 118, category: 'Afyon Merkez & Diğer İlçeler' },
  { id: 'hocalar', name: 'Hocalar İlçe Merkezi', distanceKm: 120, category: 'Afyon Merkez & Diğer İlçeler' },
  { id: 'kiziloren', name: 'Kızılören İlçe Merkezi', distanceKm: 122, category: 'Afyon Merkez & Diğer İlçeler' },
  { id: 'evciler', name: 'Evciler İlçe Merkezi', distanceKm: 142, category: 'Afyon Merkez & Diğer İlçeler' },
  { id: 'basmakci', name: 'Başmakçı İlçe Merkezi', distanceKm: 148, category: 'Afyon Merkez & Diğer İlçeler' },
  { id: 'dazkiri', name: 'Dazkırı İlçe Merkezi', distanceKm: 158, category: 'Afyon Merkez & Diğer İlçeler' },
];
