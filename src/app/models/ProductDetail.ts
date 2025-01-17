export class ProductDetail {
  id: number; // Ürün ID'si
  description: string; // Ürün açıklaması
  brand: string; // Marka
  color: string; // Renk
  material: string; // Malzeme türü (ör. plastik, metal, ahşap)
  originCountry: string; // Menşei (ör. Türkiye, Çin)
  warrantyPeriodMonths: number; // Garanti süresi (ay cinsinden)
  energyClass: string; // Enerji sınıfı (ör. A++, B)
  dimensions: string; // Ürün boyutları (ör. 15x10x5 cm)
  weight: number; // Ağırlık (kg cinsinden)
  model: string; // Model adı veya kodu
  processor: string; // İşlemci türü
  ram: number; // RAM kapasitesi (GB cinsinden)
  storage: number; // Depolama kapasitesi (GB cinsinden)
  screenSize: string; // Ekran boyutu (ör: 15.6 inç)
  resolution: string; // Çözünürlük (ör: 1920x1080)
  operatingSystem: string; // İşletim sistemi (ör: Windows, Android)
  batteryCapacity: number; // Batarya kapasitesi (mAh)
  connectivity: string; // Bağlantı türleri (ör: WiFi, Bluetooth)
  images: string[]; // Ürün resimleri
}
