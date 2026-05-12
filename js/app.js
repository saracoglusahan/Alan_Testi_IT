import { UZMANLIK_YAPISI, getDomainQuestionIndices, getExpertiseQuestionSet } from "./quiz-data.js";

// Firebase CDN (compat) üzerinden yüklenir — index.html'deki script tagları gerekli
// Hata olursa uygulama yine de çalışır, sadece Firestore kaydı atlanır
let db = null;
try {
  const firebaseConfig = {
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  };
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} catch (err) {
  console.warn("Firebase başlatılamadı — veriler yalnızca localStorage'a kaydedilecek.", err);
}


// --- KATEGORİ SABİTLERİ ---
const KATEGORILER = {
    "SD": "Yazılım Geliştirme",
    "DS-AI": "Veri Bilimi ve Yapay Zeka",
    "CS-NET": "Siber Güvenlik ve Ağ",
    "IS-MT": "Bilişim Sistemleri ve BT Yönetimi",
    "CL-DN": "Bulut, Altyapı ve DevOps",
};
const AGIRLIKLANDIRMA_MATRISI = {
    "Q1":  { "SD": 0.35, "DS-AI": 0.10, "CS-NET": 0.00, "IS-MT": 0.20, "CL-DN": 0.35 },
    "Q2":  { "SD": 0.10, "DS-AI": 0.55, "CS-NET": 0.15, "IS-MT": 0.20, "CL-DN": 0.00 },
    "Q3":  { "SD": 0.20, "DS-AI": 0.00, "CS-NET": 0.55, "IS-MT": 0.10, "CL-DN": 0.15 },
    "Q4":  { "SD": 0.20, "DS-AI": 0.10, "CS-NET": 0.00, "IS-MT": 0.60, "CL-DN": 0.10 },
    "Q5":  { "SD": 0.30, "DS-AI": 0.00, "CS-NET": 0.10, "IS-MT": 0.10, "CL-DN": 0.50 },
    "Q6":  { "SD": 0.55, "DS-AI": 0.00, "CS-NET": 0.10, "IS-MT": 0.15, "CL-DN": 0.20 },
    "Q7":  { "SD": 0.10, "DS-AI": 0.55, "CS-NET": 0.00, "IS-MT": 0.25, "CL-DN": 0.10 },
    "Q8":  { "SD": 0.25, "DS-AI": 0.00, "CS-NET": 0.50, "IS-MT": 0.10, "CL-DN": 0.15 },
    "Q9":  { "SD": 0.15, "DS-AI": 0.20, "CS-NET": 0.00, "IS-MT": 0.55, "CL-DN": 0.10 },
    "Q10": { "SD": 0.35, "DS-AI": 0.00, "CS-NET": 0.10, "IS-MT": 0.15, "CL-DN": 0.40 },
    "Q11": { "SD": 0.55, "DS-AI": 0.15, "CS-NET": 0.00, "IS-MT": 0.15, "CL-DN": 0.15 },
    "Q12": { "SD": 0.15, "DS-AI": 0.65, "CS-NET": 0.00, "IS-MT": 0.20, "CL-DN": 0.00 },
    "Q13": { "SD": 0.00, "DS-AI": 0.00, "CS-NET": 0.60, "IS-MT": 0.20, "CL-DN": 0.20 },
    "Q14": { "SD": 0.10, "DS-AI": 0.00, "CS-NET": 0.25, "IS-MT": 0.20, "CL-DN": 0.45 },
    "Q15": { "SD": 0.45, "DS-AI": 0.00, "CS-NET": 0.00, "IS-MT": 0.45, "CL-DN": 0.10 },
    "Q16": { "SD": 0.20, "DS-AI": 0.00, "CS-NET": 0.65, "IS-MT": 0.15, "CL-DN": 0.00 },
    "Q17": { "SD": 0.10, "DS-AI": 0.45, "CS-NET": 0.00, "IS-MT": 0.35, "CL-DN": 0.10 },
    "Q18": { "SD": 0.40, "DS-AI": 0.00, "CS-NET": 0.10, "IS-MT": 0.10, "CL-DN": 0.40 },
    "Q19": { "SD": 0.00, "DS-AI": 0.00, "CS-NET": 0.55, "IS-MT": 0.25, "CL-DN": 0.20 },
    "Q20": { "SD": 0.25, "DS-AI": 0.20, "CS-NET": 0.00, "IS-MT": 0.10, "CL-DN": 0.45 },
    "Q21": { "SD": 0.50, "DS-AI": 0.00, "CS-NET": 0.00, "IS-MT": 0.30, "CL-DN": 0.20 },
    "Q22": { "SD": 0.15, "DS-AI": 0.00, "CS-NET": 0.15, "IS-MT": 0.60, "CL-DN": 0.10 },
    "Q23": { "SD": 0.10, "DS-AI": 0.55, "CS-NET": 0.00, "IS-MT": 0.25, "CL-DN": 0.10 },
    "Q24": { "SD": 0.35, "DS-AI": 0.00, "CS-NET": 0.45, "IS-MT": 0.10, "CL-DN": 0.10 },
    "Q25": { "SD": 0.25, "DS-AI": 0.00, "CS-NET": 0.10, "IS-MT": 0.15, "CL-DN": 0.50 },
    "Q26": { "SD": 0.30, "DS-AI": 0.00, "CS-NET": 0.10, "IS-MT": 0.10, "CL-DN": 0.50 },
    "Q27": { "SD": 0.45, "DS-AI": 0.15, "CS-NET": 0.00, "IS-MT": 0.30, "CL-DN": 0.10 },
    "Q28": { "SD": 0.00, "DS-AI": 0.25, "CS-NET": 0.50, "IS-MT": 0.25, "CL-DN": 0.00 },
    "Q29": { "SD": 0.00, "DS-AI": 0.40, "CS-NET": 0.30, "IS-MT": 0.20, "CL-DN": 0.10 },
    "Q30": { "SD": 0.45, "DS-AI": 0.00, "CS-NET": 0.00, "IS-MT": 0.30, "CL-DN": 0.25 },
};

const DOGRU_CEVAPLAR = {
    "Q1": "B", "Q2": "C", "Q3": "D", "Q4": "C", "Q5": "C", "Q6": "C",
    "Q7": "B", "Q8": "E", "Q9": "C", "Q10": "C", "Q11": "C", "Q12": "B",
    "Q13": "B", "Q14": "C", "Q15": "C", "Q16": "C", "Q17": "C", "Q18": "C",
    "Q19": "C", "Q20": "C", "Q21": "A", "Q22": "B", "Q23": "C", "Q24": "C",
    "Q25": "C", "Q26": "C", "Q27": "C", "Q28": "C", "Q29": "C", "Q30": "C",
};

// A, B, C, D harflerini tutan dizi
const optionLabels = ["A", "B", "C", "D", "E"];

// 30 soruluk test

const questions = [

  {

    id: 1,

    text:

      "Soru 1 \nAni performans düşüşü\n\nBir e-ticaret uygulamasında kampanya başladıktan sonra kullanıcılar sepet ekranında gecikme yaşamaya başlıyor. Hata loglarında kritik hata görünmüyor. Veritabanı, API ve önbellek sistemleri ayrı servisler olarak çalışıyor. İlk teknik yaklaşımınız ne olur?",

    options: [

      "Sunucu kapasitesini artırıp gecikmenin düşüp düşmediğini gözlemlemek",

      "İstek yolunu uçtan uca izleyip gecikmenin API, veritabanı, ağ, önbellek veya dış servislerden hangisinde yoğunlaştığını metriklerle ayırmak",

      "Sepet ekranının arayüzünü sadeleştirip kullanıcı tarafındaki işlem yükünü azaltmak",

      "Kampanya süresince bazı raporlama servislerini geçici olarak kapatmak",

      "Veritabanı indekslerini yeniden oluşturup sorgu planlarının değişmesini beklemek",

    ],

  },

  {

    id: 2,

    text:

      "Soru 2 \nYapay zekâ modelinde taraflılık riski\n\nBir kredi ön değerlendirme modeli, geçmiş verilerde daha az temsil edilen bir müşteri grubunu sürekli daha riskli sınıflandırıyor. Modelin genel doğruluk oranı yüksek görünüyor. En dengeli değerlendirme yaklaşımı hangisidir?",

    options: [

      "Genel doğruluk oranı yüksek olduğu için modeli canlıya almak",

      "Modelin karar eşiklerini tüm gruplar için aynı tutup sonucu gözlemlemek",

      "Veriyi alt gruplara ayırıp hata dağılımını, veri temsilini, karar eşiklerini ve iş kuralı etkilerini birlikte incelemek",

      "Modelin kullandığı değişken sayısını azaltıp daha basit bir sınıflandırıcıya geçmek",

      "Daha büyük bir model kullanarak varyansı azaltmaya çalışmak",

    ],

  },

  {

    id: 3,

    text:

      "Soru 3 \nŞüpheli oturum hareketleri\n\nBir SaaS sisteminde bazı kullanıcıların kendi hesaplarından işlem yapmadığını söylediği destek talepleri geliyor. Loglarda farklı ülkelerden aynı kullanıcıya ait kısa aralıklarla oturum açıldığı görülüyor. En uygun ilk müdahale hangisidir?",

    options: [

      "Kullanıcılardan parolalarını değiştirmelerini isteyip yeni talepleri beklemek",

      "Şüpheli IP adreslerini engelleyip sistemi çalışır durumda bırakmak",

      "Oturum süresini azaltıp yeni login kurallarını yayına almak",

      "Şüpheli oturumları geçersiz kılmak, token ve anahtar riskini değerlendirmek, erişim kayıtlarını koruyarak olay incelemesi başlatmak",

      "Kullanıcı arayüzüne güvenlik uyarısı eklemek",

    ],

  },

  {

    id: 4,

    text:

      "Soru 4 \nERP süreç uyumsuzluğu\n\nBir işletmede satış ekibi “sipariş onayı” sürecini hızlı isterken, finans ekibi aynı süreçte kredi limit kontrolü yapılmadan ilerlenmesini istemiyor. Yazılım tarafı ise net gereksinim olmadığı için geliştirmeye başlayamıyor. En sağlıklı analiz adımı hangisidir?",

    options: [

      "Satış ekibinin akışını temel alıp finans kontrolünü sonraki sürüme bırakmak",

      "Finans ekibinin kuralını zorunlu yapıp satış ekranını buna göre tasarlamak",

      "Mevcut süreci, istisna durumlarını, veri sahipliğini, onay noktalarını ve performans beklentilerini birlikte modellemek",

      "Hazır ERP paketindeki standart sipariş akışını değiştirmeden kullanmak",

      "Tüm ekiplerden ayrı ayrı gereksinim dokümanı alıp ortak alanları birleştirmek",

    ],

  },

  {

    id: 5,

    text:

      "Soru 5 \nKubernetes üzerinde kararsız servis\n\nBir mikroservis Kubernetes üzerinde çalışıyor. Servis bazen yeniden başlıyor, bazen de trafik almasına rağmen cevap veremiyor. CPU kullanımı bazı anlarda yükseliyor, fakat her yeniden başlatmada aynı metrik görünmüyor. En doğru inceleme yaklaşımı hangisidir?",

    options: [

      "Pod sayısını artırarak yükü yaymak",

      "Container image’ını küçültüp deploy süresini azaltmak",

      "Resource limitlerini, liveness/readiness probe davranışını, node baskısını ve servis bağımlılıklarını birlikte korele etmek",

      "Servisi ayrı bir node grubuna taşıyıp davranışı gözlemlemek",

      "Uygulama log seviyesini debug moduna alıp yeniden başlatmaları takip etmek",

    ],

  },

  {

    id: 6,

    text:

      "Soru 6 \nTeknik soru — ödeme API’sinde idempotency\n\nBir ödeme API’si, ağ zaman aşımı nedeniyle aynı ödeme isteğini iki kez alabiliyor. Müşteri tarafında tek işlem görünse bile sunucuya iki istek düşebiliyor. En doğru tasarım hangisidir?",

    options: [

      "İstek zaman aşımı değerini yükseltmek",

      "Kullanıcıdan ödeme butonuna ikinci kez basmamasını istemek",

      "Her ödeme isteğine idempotency key verip bu anahtarı işlem kaydıyla ilişkilendirmek ve tekrar gelen istekte aynı sonucu döndürmek",

      "Ödeme sonucunu istemci tarafındaki local storage içinde saklamak",

      "Aynı tutardaki ikinci ödemeyi gün sonunda manuel kontrol etmek",

    ],

  },

  {

    id: 7,

    text:

      "Soru 7 \nVeri hattında tutarsız rapor\n\nBir satış panosunda günlük gelir bir gün içinde iki kez artmış gibi görünüyor. Ham veride aynı siparişlerin bazıları iki kez işlenmiş. Veri mühendisliği açısından en doğru yaklaşım hangisidir?",

    options: [

      "Pano tarafında aynı sipariş numaralarını gizlemek",

      "ETL sürecine veri tekilleştirme, işlem kimliği kontrolü, veri soyu takibi ve kalite testi eklemek",

      "Günlük raporu haftalık rapora çevirerek dalgalanmayı azaltmak",

      "Sipariş verilerini daha büyük bir depolama alanına taşımak",

      "Görselleştirme aracındaki toplam alma fonksiyonunu değiştirmek",

    ],

  },

  {

    id: 8,

    text:

      "Soru 8 \nSSRF riski\n\nBir uygulama, kullanıcıdan aldığı URL’den dosya indiriyor. Güvenlik testi sırasında bu mekanizmanın iç ağdaki metadata servislerine erişmek için kullanılabileceği görülüyor. En dengeli savunma hangisidir?",

    options: [

      "URL alanına daha uzun karakter sınırı koymak",

      "Dosya indirme işlemini arka plan kuyruğuna almak",

      "Kullanıcıya yalnızca HTTPS adresleri kabul ettirmek",

      "Dosya türünü kontrol edip izin verilen uzantıları sınırlamak",

      "Hedef adres doğrulaması, allowlist, iç ağ/metadata erişim engeli, egress kontrolü ve izleme mekanizmasını birlikte uygulamak",

    ],

  },

  {

    id: 9,

    text:

      "Soru 9 \nCRM özelliğinin başarısı\n\nBir CRM sistemine “otomatik müşteri önceliklendirme” özelliği eklenecek. Yönetim bu özelliğin iş değerini görmek istiyor. En anlamlı başarı ölçümü hangisidir?",

    options: [

      "Özelliğin planlanan tarihte yayına alınması",

      "Ekranın kullanıcılar tarafından açılma sayısı",

      "Satış ekibinin özelliği kullanma oranı, müşteri takip süresindeki değişim, veri kalitesi ve dönüşüm oranının birlikte izlenmesi",

      "Algoritmanın karmaşıklık seviyesinin artırılması",

      "Özelliğin mobil ve web arayüzünde aynı görünmesi",

    ],

  },

  {

    id: 10,

    text:

      "Soru 10 \nCDN ve eski fiyat problemi\n\nBir ürün sayfası CDN üzerinden hızlı açılıyor ancak fiyat değişiklikleri bazı kullanıcılarda geç yansıyor. Bu durum müşteri şikâyetine yol açıyor. En iyi mimari yaklaşım hangisidir?",

    options: [

      "CDN kullanımını tamamen kaldırmak",

      "Ürün sayfasındaki tüm verileri kısa süreli cachelemek",

      "Fiyat bilgisini cache dışı veya kontrollü invalidation mekanizmalı ayrı bir veri kaynağından sunmak",

      "Kullanıcı tarayıcısına sayfayı yenileme uyarısı koymak",

      "Fiyat değişikliklerini gün sonunda toplu olarak yayına almak",

    ],

  },

  {

    id: 11,

    text:

      "Soru 11 \nMobil uygulamada cihaz bağımlı hata\n\nBir mobil uygulama yeni cihazlarda sorunsuz çalışırken eski cihazlarda bazen kapanıyor. Hata her kullanıcıda oluşmuyor. En uygun çözüm yolu hangisidir?",

    options: [

      "Minimum desteklenen işletim sistemi sürümünü yükseltmek",

      "Eski cihaz kullanıcılarına hafif arayüz seçeneği sunmak",

      "Cihaz modeli, OS sürümü, bellek durumu ve ekran akışını crash raporlarıyla eşleştirip kontrollü düzeltme yapmak",

      "Uygulamanın tüm ekranlarını yeniden yazmak",

      "Animasyonları azaltıp yeni sürüm yayınlamak",

    ],

  },

  {

    id: 12,

    text:

      "Soru 12 \nTeknik soru — veri sızıntısı / leakage\n\nBir makine öğrenmesi modeli, siparişin iptal edilip edilmeyeceğini sipariş anında tahmin edecek. Eğitim verisinde “teslimat tamamlanma süresi” değişkeni de kullanılmış ve model çok yüksek başarı göstermiştir. Bu durumda temel problem nedir?",

    options: [

      "Modelin fazla hızlı eğitilmesi",

      "Tahmin anında bilinmeyen bir değişkenin eğitimde kullanılması",

      "Sınıflandırma yerine regresyon yapılması",

      "Veri setinin çok büyük olması",

      "Modelin açıklanabilirlik seviyesinin yüksek olması",

    ],

  },

  {

    id: 13,

    text:

      "Soru 13 \nYanal hareket şüphesi\n\nBir kurum ağında tek bir istemciden başlayan olağan dışı bağlantıların farklı sunuculara yayıldığı görülüyor. Aynı istemcide yönetici hesabıyla oturum açılmış. En iyi ilk müdahale yaklaşımı hangisidir?",

    options: [

      "Tüm ağ parolalarını aynı anda değiştirmek",

      "İstemciyi izole etmek, delilleri korumak, oturum ve kimlik bilgisi kullanımını incelemek, yayılım yolunu çıkarmak",

      "Sadece antivirüs taraması başlatmak",

      "Sunucuların tamamını yeniden başlatmak",

      "Ağ trafiğini geçici olarak yavaşlatmak",

    ],

  },

  {

    id: 14,

    text:

      "Soru 14 \nBlockchain ile tedarik zinciri kaydı\n\nBir firma, tedarik zinciri olaylarını blockchain üzerinde tutmak istiyor. Ancak ticari sırların herkese açık kalmasını istemiyor ve kayıtların sonradan değiştirilememesini önemsiyor. En uygun yaklaşım hangisidir?",

    options: [

      "Tüm veriyi açık zincire ham olarak yazmak",

      "Veriyi merkezi veritabanında tutup blockchain’i yalnızca pazarlama amacıyla kullanmak",

      "Hassas veriyi zincir dışında tutup zincire hash/kanıt yazmak, izinli erişim ve anahtar yönetimi tasarlamak",

      "Blockchain yerine sadece PDF imzalama süreci kullanmak",

      "Her tedarikçiye ayrı zincir kurup entegrasyonu manuel yapmak",

    ],

  },

  {

    id: 15,

    text:

      "Soru 15 \nMimariyi tamamen değiştirme önerisi\n\nBir yazılım ekibi, mevcut sistemin bakımı zorlaştığı için tüm sistemi baştan mikroservis mimarisine geçirmek istiyor. Ancak ürün aktif kullanılıyor ve teslim tarihleri yakın. En sağlıklı karar yaklaşımı hangisidir?",

    options: [

      "Tüm sistemi durdurup yeniden geliştirme sürecine başlamak",

      "Mikroservis kararını yönetim onayına bırakmak",

      "Bakım maliyetini, darboğazları, ekip yetkinliğini ve riskleri analiz edip aşamalı ayrıştırma veya modüler iyileştirme planı çıkarmak",

      "Yeni özellik geliştirmeyi tamamen durdurmak",

      "Mevcut sistemi değiştirmeden sadece dokümantasyon eklemek",

    ],

  },

  {

    id: 16,

    text:

      "Soru 16 \nTeknik soru — parola saklama\n\nBir sistem kullanıcı parolalarını güvenli saklamak istiyor. En doğru teknik yaklaşım hangisidir?",

    options: [

      "Parolaları AES ile şifreleyip anahtarı uygulama içinde tutmak",

      "Parolaları SHA-256 ile hashleyip veritabanına yazmak",

      "Parolaları Argon2id, bcrypt veya scrypt gibi yavaş ve salt destekli algoritmalarla saklamak, ek olarak hız sınırlama ve MFA gibi kontroller kullanmak",

      "Parolaları Base64 formatına çevirip okunabilirliği azaltmak",

      "Parola alanını veritabanında gizli kolon olarak işaretlemek",

    ],

  },

  {

    id: 17,

    text:

      "Soru 17 \nAynı metrik, farklı sonuç\n\nPazarlama ve finans ekipleri “aylık aktif müşteri” metriğini farklı raporlarda farklı sayılarla görüyor. Her iki ekip de kendi raporunun doğru olduğunu savunuyor. En doğru çözüm yaklaşımı hangisidir?",

    options: [

      "Daha güncel görünen raporu doğru kabul etmek",

      "Raporlama aracını değiştirip tek panele geçmek",

      "Metrik tanımını, veri kaynağını, zaman penceresini, filtreleri ve sahipliği belirleyen ortak bir semantik katman oluşturmak",

      "İki raporun ortalamasını alıp yönetim raporunda kullanmak",

      "Müşteri verisini daha sık güncellemek",

    ],

  },

  {

    id: 18,

    text:

      "Soru 18 \nOrtam farkı nedeniyle üretim hatası\n\nBir uygulama test ortamında tüm testlerden geçiyor ancak üretimde konfigürasyon farkları nedeniyle hata veriyor. En güçlü iyileştirme hangisidir?",

    options: [

      "Test ekibine daha fazla manuel senaryo yazdırmak",

      "Geliştiricilerin üretim sunucusuna doğrudan erişmesini sağlamak",

      "Ortamları IaC ve konfigürasyon yönetimiyle standartlaştırmak, canary/rollback ve gözlemlenebilirlik mekanizması kurmak",

      "Üretim hatası olduğunda hızlı hotfix süreci tanımlamak",

      "Test ortamındaki verileri üretimden kopyalamak",

    ],

  },

  {

    id: 19,

    text:

      "Soru 19 \nOlay sonrası log eksikliği\n\nBir güvenlik olayından sonra logların bir kısmının döndüğü ve eski kayıtların silindiği fark ediliyor. İnceleme yapılamıyor. Gelecek için en doğru tasarım hangisidir?",

    options: [

      "Uygulama log seviyesini sürekli debug modunda tutmak",

      "Logları her sunucuda yerel dosya olarak daha uzun süre saklamak",

      "Merkezi, zaman senkronize, değiştirilmesi zor, erişim kontrollü loglama ve saklama politikası kurmak",

      "Kullanıcı işlemlerini veritabanında ayrı tabloya yazmak",

      "Olay olduğunda ekran görüntüsü alınmasını süreç haline getirmek",

    ],

  },

  {

    id: 20,

    text:

      "Soru 20 \nEdge cihazlarda kopan bağlantı\n\nBir üretim hattındaki edge cihazları sensör verilerini buluta gönderiyor. Ağ bağlantısı zaman zaman kesiliyor. Veri kaybı olmadan sistemin devam etmesi isteniyor. En uygun yaklaşım hangisidir?",

    options: [

      "Cihazların gönderim sıklığını azaltmak",

      "Ağ kesildiğinde cihazı yeniden başlatmak",

      "Yerel tamponlama, sıra numarası, idempotent gönderim ve bağlantı gelince senkronizasyon mekanizması kullanmak",

      "Sensör verilerini sadece bağlantı varken üretmek",

      "Buluttaki veritabanını daha büyük kapasiteye taşımak",

    ],

  },

  {

    id: 21,

    text:

      "Soru 21 \nYazılım mimarisi eğilimi\n\nBir ekipte yeni bir modül geliştirilecek. Gereksinimler tam net değil, ama modül ileride başka sistemlerle de konuşacak. Hangi davranış yazılım mimarisi ve soyutlama eğilimini daha güçlü gösterir?",

    options: [

      "Önce arayüzleri, veri sözleşmelerini, bağımlılık sınırlarını ve değişebilecek noktaları modellemek",

      "Hızlıca çalışan bir ekran çıkarıp geri bildirim toplamak",

      "En popüler framework ile projeyi başlatmak",

      "Geliştirilecek tüm özellikleri aynı servis içinde toplamak",

      "İş kurallarını veritabanı prosedürlerine yerleştirmek",

    ],

  },

  {

    id: 22,

    text:

      "Soru 22 \nTeknik soru — ITIL olay, problem, değişiklik ayrımı\n\nBir kurumda ödeme sistemi iki saat kesinti yaşıyor. Ekip önce hizmeti geri getiriyor, sonra kök nedeni araştırıyor ve kalıcı düzeltme için planlı yayın süreci açıyor. Bu akış IT yönetimi açısından nasıl sınıflandırılır?",

    options: [

      "İlk adım problem yönetimi, ikinci adım değişiklik yönetimi, üçüncü adım olay yönetimi",

      "İlk adım olay yönetimi, kök neden analizi problem yönetimi, kalıcı düzeltmenin kontrollü yayını değişiklik yönetimi",

      "Tüm adımlar proje yönetimi kapsamındadır",

      "İlk adım değişiklik yönetimi, kalan adımlar olay yönetimidir",

      "Bu süreç yalnızca yazılım test yönetimiyle ilgilidir",

    ],

  },

  {

    id: 23,

    text:

      "Soru 23 \nTavsiye sistemi başarısı\n\nBir öneri sistemi tıklanma oranını artırıyor, ancak kullanıcılar daha az kaliteli içerikle karşılaştığını söylüyor. Yönetim “metrik iyi, devam edelim” diyor. En doğru veri bilimi yaklaşımı hangisidir?",

    options: [

      "Tıklanma oranı yüksek olduğu için modeli korumak",

      "Daha fazla veriyle aynı modeli yeniden eğitmek",

      "Memnuniyet, içerik kalitesi, uzun dönem elde tutma ve olası yan etkileri de içeren çoklu hedef metriği kurmak",

      "Önerileri tamamen rastgeleleştirerek tarafsızlık sağlamak",

      "Modeli yalnızca en çok izlenen içeriklere göre eğitmek",

    ],

  },

  {

    id: 24,

    text:

      "Soru 24 \nAPI rate limit aşımı\n\nBir API’de rate limit var ancak saldırgan farklı token ve IP kombinasyonlarıyla sınırı aşabiliyor. En sağlam savunma yaklaşımı hangisidir?",

    options: [

      "Rate limit değerini herkes için düşürmek",

      "Sadece IP bazlı limit uygulamak",

      "Kullanıcı, token, IP, cihaz izi ve davranış sinyallerini birlikte değerlendiren dağıtık kota ve kötüye kullanım tespiti kurmak",

      "API dokümantasyonundan limit bilgisini kaldırmak",

      "Limit aşımında daha uzun hata mesajı döndürmek",

    ],

  },

  {

    id: 25,

    text:

      "Soru 25 \nÇok bölgeli sistemde tutarlılık\n\nBir sistem hem Avrupa hem Asya bölgelerinde çalışacak. Kullanıcı profili hızlı açılmalı, ödeme işlemlerinde ise veri tutarlılığı kritik. En doğru mimari karar yaklaşımı hangisidir?",

    options: [

      "Tüm veriler için eventual consistency kullanmak",

      "Tüm işlemleri tek merkezden yürütüp diğer bölgeleri kapatmak",

      "Her veri türü için tutarlılık ihtiyacını ayrı değerlendirip kritik işlemlerde güçlü tutarlılık, okunabilir verilerde bölgesel cache/eventual consistency kullanmak",

      "Tüm veritabanlarını her bölgede bağımsız çalıştırmak",

      "Kullanıcıyı her zaman en yakın bölgeye yönlendirmek",

    ],

  },

  {

    id: 26,

    text:

      "Soru 26 \nTeknik soru — Kubernetes rolling update ve migration\n\nBir Kubernetes uygulamasında yeni sürüm veritabanı şemasında değişiklik gerektiriyor. Rolling update sırasında eski ve yeni pod’lar kısa süre birlikte çalışacak. En güvenli yaklaşım hangisidir?",

    options: [

      "Önce tüm eski pod’ları kapatıp sonra veritabanını değiştirmek",

      "Migration’ı uygulama başlarken her pod’un çalıştırmasına izin vermek",

      "Geriye uyumlu şema değişikliği, ayrı migration adımı, readiness kontrolü ve rollback planı ile yayına çıkmak",

      "Veritabanı değişikliğini deploy sonrasına bırakmak",

      "Rolling update yerine her zaman blue-green kullanmak",

    ],

  },

  {

    id: 27,

    text:

      "Soru 27 \nKullanıcı hatasına açık yönetim paneli\n\nBir yönetim panelinde kullanıcılar yanlışlıkla kritik kayıtları kapatıyor. Sistem teknik olarak çalışıyor ama iş kaybı oluşuyor. En iyi çözüm yaklaşımı hangisidir?",

    options: [

      "Kullanıcılara daha uzun eğitim dokümanı hazırlamak",

      "Kritik butonları ekranın altına taşımak",

      "Kullanıcı akışını inceleyip hata önleyici arayüz, yetki kontrolü, geri alma mekanizması ve işlem doğrulama tasarlamak",

      "Paneli sadece deneyimli personele açmak",

      "Hatalı işlemleri gün sonunda raporlamak",

    ],

  },

  {

    id: 28,

    text:

      "Soru 28 \nSOC alarm yorgunluğu\n\nBir güvenlik operasyon merkezinde her gün yüzlerce alarm oluşuyor. Analistler kritik olayları kaçırmaktan endişe ediyor. En iyi iyileştirme hangisidir?",

    options: [

      "Tüm alarm eşiklerini yükseltmek",

      "Daha fazla analist işe almak",

      "Tehdit modeline göre alarm önceliklendirme, korelasyon, triage playbook’ları ve geri bildirimle kural iyileştirme süreci kurmak",

      "Düşük seviyeli alarmları tamamen kapatmak",

      "Her alarm için ayrı e-posta bildirimi göndermek",

    ],

  },

  {

    id: 29,

    text:

      "Soru 29 \nVeri ambarına kişisel veri eklenmesi\n\nBir veri ambarına yeni müşteri veri kaynağı eklenecek. Kaynakta kişisel veriler, işlem geçmişi ve destek kayıtları var. En doğru ilk tasarım yaklaşımı hangisidir?",

    options: [

      "Tüm veriyi ham haliyle veri ambarına almak",

      "Sadece analistlerin görebileceği ayrı bir tablo oluşturmak",

      "Veri sınıflandırma, minimizasyon, maskeleme, erişim kontrolü, veri soyu ve saklama politikasını birlikte belirlemek",

      "Veriyi sadece CSV olarak saklamak",

      "Verinin tamamını anonim kabul edip raporlamaya açmak",

    ],

  },

  {

    id: 30,

    text:

      "Soru 30 \nMonolit mi mikroservis mi?\n\nYeni kurulan bir ekip, henüz ürün-pazar uyumu netleşmemiş bir platform geliştirecek. Ekip küçük, gereksinimler sık değişiyor, ancak ileride yüksek trafik bekleniyor. En mantıklı mimari yaklaşım hangisidir?",

    options: [

      "İlk günden tüm sistemi mikroservis olarak kurmak",

      "Tek dosyalı hızlı prototip geliştirip mimariyi sonraya bırakmak",

      "Modüler sınırları net, gözlemlenebilir ve ayrıştırılmaya hazır bir monolit ile başlayıp gerçek ölçek ve ekip ihtiyacı oluşunca servisleştirmek",

      "Tüm iş kurallarını veritabanına yerleştirerek uygulama kodunu azaltmak",

      "Backend geliştirmeden önce tüm bulut altyapısını maksimum ölçeğe göre kurmak",

    ],

  },

];

const introSection = document.getElementById("intro-section");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");
const resultFollowupEl = document.getElementById("result-followup");

const questionTextEl = document.getElementById("question-text");
const optionsEl = document.getElementById("options");
const progressTextEl = document.getElementById("question-text-num") || document.getElementById("progress-text");
const percentTextEl = document.getElementById("percent-text");
const progressBarInnerEl = document.getElementById("progress-bar-inner");
const errorMessageEl = document.getElementById("error-message");

const nextBtn = document.getElementById("next-btn");
const finishBtn = document.getElementById("finish-btn");
const afterQuizActions = document.getElementById("after-quiz-actions");
const showResultBtn = document.getElementById("show-result-btn");

const resultScoreEl = document.getElementById("result-score");
const resultSummaryEl = document.getElementById("result-summary");
const resultTagEl = document.getElementById("result-tag");

let currentQuestionIndex = 0;

/** @type {'general'|'domain'|'expertise'} */
let quizKind = "general";
let activeQuestions = questions;
let activeAnswers = new Array(questions.length).fill(null);
let activeDomainCode = null;
/** Uzmanlık testi doğru cevap anahtarları (Q1,Q2,...) veya null */
let activeExpertiseDogru = null;
/** @type {{ domainCode: string, expertiseId: string, label: string } | null} */
let activeExpertiseMeta = null;

/** Kayıt formu sonrası hangi testin başlayacağı */
let pendingQuizStart = null;

function getDurationMsForKind(kind) {
  if (kind === "general") return 60 * 60 * 1000;
  if (kind === "domain") return 20 * 60 * 1000;
  return 15 * 60 * 1000;
}

function getWarningRemainingMsForKind(kind) {
  if (kind === "general") return 10 * 60 * 1000;
  if (kind === "domain") return 5 * 60 * 1000;
  return 3 * 60 * 1000;
}

let quizEndTime = null;
let fiveMinWarningShown = false;
let timerIntervalId = null;

const UNIFIED_STORAGE_KEY = "it_quiz_unified_state_v1";
const LEGACY_STORAGE_KEY = "it_yetenek_testi_state_v1";

const quizTimerDisplayEl = document.getElementById("quiz-timer-display");
const timerWarningBannerEl = document.getElementById("timer-warning-banner");

function stopQuizTimer() {
  if (timerIntervalId != null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

function updateTimerDisplay() {
  if (!quizTimerDisplayEl) return;
  if (quizEndTime == null) {
    quizTimerDisplayEl.textContent = "—:—";
    quizTimerDisplayEl.classList.remove("is-urgent");
    return;
  }
  const remain = Math.max(0, quizEndTime - Date.now());
  const totalSec = Math.floor(remain / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  quizTimerDisplayEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  const warnAt = getWarningRemainingMsForKind(quizKind);
  if (remain <= warnAt && remain > 0) {
    quizTimerDisplayEl.classList.add("is-urgent");
  } else {
    quizTimerDisplayEl.classList.remove("is-urgent");
  }
}

function startQuizTimer() {
  stopQuizTimer();
  const tick = () => {
    if (quizEndTime == null) return;
    const remain = Math.max(0, quizEndTime - Date.now());
    if (remain <= 0) {
      stopQuizTimer();
      if (timerWarningBannerEl) timerWarningBannerEl.classList.add("hidden");
      quizEndTime = null;
      fiveMinWarningShown = false;
      saveState();
      showResults();
      return;
    }
    updateTimerDisplay();
    if (!fiveMinWarningShown && remain <= getWarningRemainingMsForKind(quizKind)) {
      fiveMinWarningShown = true;
      if (timerWarningBannerEl) timerWarningBannerEl.classList.remove("hidden");
      saveState();
    }
  };
  tick();
  timerIntervalId = setInterval(tick, 1000);
}

function startQuizSession() {
  stopQuizTimer();
  quizEndTime = Date.now() + getDurationMsForKind(quizKind);
  fiveMinWarningShown = false;
  if (timerWarningBannerEl) timerWarningBannerEl.classList.add("hidden");

  introSection.classList.add("hidden");
  if (resultFollowupEl) {
    resultFollowupEl.classList.add("hidden");
    resultFollowupEl.innerHTML = "";
  }
  afterQuizActions.classList.add("hidden");
  resultSection.classList.remove("is-visible");

  quizSection.classList.remove("hidden");

  currentQuestionIndex = 0;
  for (let i = 0; i < activeAnswers.length; i++) activeAnswers[i] = null;
  saveState();
  renderQuestion();
  updateProgress();
  startQuizTimer();
}

function startGeneralTest() {
  quizKind = "general";
  activeQuestions = questions;
  activeAnswers = new Array(questions.length).fill(null);
  activeDomainCode = null;
  activeExpertiseDogru = null;
  activeExpertiseMeta = null;
  startQuizSession();
}

function startDomainTest(domainCode) {
  const ids = getDomainQuestionIndices(domainCode, questions, AGIRLIKLANDIRMA_MATRISI);
  activeQuestions = ids.map((id) => questions.find((q) => q.id === id)).filter(Boolean);
  if (activeQuestions.length === 0) return;
  quizKind = "domain";
  activeDomainCode = domainCode;
  activeAnswers = new Array(activeQuestions.length).fill(null);
  activeExpertiseDogru = null;
  activeExpertiseMeta = null;
  startQuizSession();
}

function startExpertiseTest(domainCode, expertiseId, label) {
  const pack = getExpertiseQuestionSet(domainCode, expertiseId, label);
  if (!pack || !pack.questions.length) {
    console.warn("Uzmanlık soru seti bulunamadı:", domainCode, expertiseId);
    return;
  }
  quizKind = "expertise";
  activeQuestions = pack.questions;
  activeExpertiseDogru = pack.dogruCevaplar;
  activeExpertiseMeta = { domainCode, expertiseId, label: pack.title };
  activeAnswers = new Array(activeQuestions.length).fill(null);
  activeDomainCode = null;
  startQuizSession();
}


function renderQuestion() {
    const q = activeQuestions[currentQuestionIndex];
    questionTextEl.textContent = q.text;

    optionsEl.innerHTML = "";

    // Düzeltilmiş renderQuestion fonksiyonu: A/B/C/D yapısını ve value değerini doğru atar
    q.options.forEach((optionText, index) => {
        const optionLetter = optionLabels[index];
        const soruName = `Q${q.id}`;
        const uniqueId = `${soruName}_${optionLetter}`;

        const isChecked = activeAnswers[currentQuestionIndex] === optionLetter;

        const optionHTML = `
            <label for="${uniqueId}" class="option-label">
                <div class="option-letter">${optionLetter}</div> 
                <input type="radio" 
                       id="${uniqueId}" 
                       name="${soruName}" 
                       value="${optionLetter}" 
                       ${isChecked ? 'checked' : ''} 
                       required>
                <span>${optionText}</span>
            </label>
        `;
        optionsEl.innerHTML += optionHTML;
    });

    syncSelectedUI();
    saveState();

    errorMessageEl.classList.add("hidden");
    errorMessageEl.textContent = "";
}

function updateProgress() {
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = activeQuestions.length;
  progressTextEl.textContent = `Soru ${questionNumber} / ${totalQuestions}`;

  const answeredCount = activeAnswers.filter((v) => v !== null).length;
  const percentage = Math.round((answeredCount / totalQuestions) * 100);
  percentTextEl.textContent = `${percentage}%`;
  progressBarInnerEl.style.width = `${percentage}%`;
}

function showError(message) {
  errorMessageEl.textContent = message;
  errorMessageEl.classList.remove("hidden");
}

function saveState() {
  try {
    const payload = {
      kind: quizKind,
      currentQuestionIndex,
      answers: activeAnswers,
    };
    if (quizEndTime != null) {
      payload.quizEndTime = quizEndTime;
      payload.fiveMinWarningShown = fiveMinWarningShown;
    }
    if (quizKind === "domain") {
      payload.domainCode = activeDomainCode;
      payload.domainSnapshotIds = activeQuestions.map((q) => q.id);
    }
    if (quizKind === "expertise" && activeExpertiseMeta) {
      payload.domainCode = activeExpertiseMeta.domainCode;
      payload.expertiseId = activeExpertiseMeta.expertiseId;
      payload.expertiseLabel = activeExpertiseMeta.label;
    }
    localStorage.setItem(UNIFIED_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {}
}

function rehydrateFromPayload(parsed) {
  if (!parsed || !Array.isArray(parsed.answers)) return false;
  const kind = parsed.kind || "general";
  if (kind === "general") {
    if (parsed.answers.length !== questions.length) return false;
    quizKind = "general";
    activeQuestions = questions;
    activeAnswers = parsed.answers;
    activeDomainCode = null;
    activeExpertiseDogru = null;
    activeExpertiseMeta = null;
    return true;
  }
  if (kind === "domain") {
    const ids = parsed.domainSnapshotIds;
    if (!Array.isArray(ids)) return false;
    activeQuestions = ids.map((id) => questions.find((q) => q.id === id)).filter(Boolean);
    if (activeQuestions.length !== ids.length) return false;
    if (parsed.answers.length !== activeQuestions.length) return false;
    quizKind = "domain";
    activeAnswers = parsed.answers;
    activeDomainCode = parsed.domainCode || null;
    activeExpertiseDogru = null;
    activeExpertiseMeta = null;
    return true;
  }
  if (kind === "expertise") {
    const pack = getExpertiseQuestionSet(parsed.domainCode, parsed.expertiseId, parsed.expertiseLabel);
    if (!pack) return false;
    activeQuestions = pack.questions;
    activeExpertiseDogru = pack.dogruCevaplar;
    activeExpertiseMeta = {
      domainCode: parsed.domainCode,
      expertiseId: parsed.expertiseId,
      label: parsed.expertiseLabel || pack.title,
    };
    if (parsed.answers.length !== activeQuestions.length) return false;
    quizKind = "expertise";
    activeAnswers = parsed.answers;
    activeDomainCode = null;
    return true;
  }
  return false;
}

/** @returns {"active"|"expired"|null} */
function loadState() {
  try {
    const rawUnified = localStorage.getItem(UNIFIED_STORAGE_KEY);
    if (rawUnified) {
      const parsed = JSON.parse(rawUnified);
      if (!rehydrateFromPayload(parsed)) return null;
      currentQuestionIndex = Math.max(0, Math.min(parsed.currentQuestionIndex | 0, activeQuestions.length - 1));
      if (typeof parsed.quizEndTime === "number") {
        if (parsed.quizEndTime <= Date.now()) {
          quizEndTime = null;
          fiveMinWarningShown = false;
          return "expired";
        }
        quizEndTime = parsed.quizEndTime;
        fiveMinWarningShown = !!parsed.fiveMinWarningShown;
        return "active";
      }
      return null;
    }
  } catch (e) {}

  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.answers) || parsed.answers.length !== questions.length) return null;
    quizKind = "general";
    activeQuestions = questions;
    activeAnswers = parsed.answers;
    activeDomainCode = null;
    activeExpertiseDogru = null;
    activeExpertiseMeta = null;
    if (Number.isInteger(parsed.currentQuestionIndex)) {
      currentQuestionIndex = Math.max(0, Math.min(parsed.currentQuestionIndex, questions.length - 1));
    }
    if (typeof parsed.quizEndTime === "number") {
      if (parsed.quizEndTime <= Date.now()) {
        quizEndTime = null;
        fiveMinWarningShown = false;
        return "expired";
      }
      quizEndTime = parsed.quizEndTime;
      fiveMinWarningShown = !!parsed.fiveMinWarningShown;
      return "active";
    }
  } catch (e) {}
  return null;
}

function clearState() {
  try {
    localStorage.removeItem(UNIFIED_STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch (e) {}
}

function syncSelectedUI() {
  const labels = optionsEl.querySelectorAll(".option-label");
  labels.forEach((l) => l.classList.remove("is-selected"));

  const checked = optionsEl.querySelector('input[type="radio"]:checked');
  if (checked) {
    const label = checked.closest(".option-label");
    if (label) label.classList.add("is-selected");
  }
}




function handleNext() {
    const q = activeQuestions[currentQuestionIndex];
    const currentQName = `Q${q.id}`;
    const selected = document.querySelector(`input[name="${currentQName}"]:checked`);
    
    if (!selected) {
      showError("Devam etmek için bir seçenek işaretlemen gerekiyor.");
      return;
    }
    const selectedValue = selected.value; 
    activeAnswers[currentQuestionIndex] = selectedValue;

    if (currentQuestionIndex < activeQuestions.length - 1) {
        currentQuestionIndex += 1;
        saveState();
        renderQuestion();
        updateProgress();
    } else {
        showResults();
    }
}

function handleFinishQuiz() {
  const unansweredCount = activeAnswers.filter((answer) => answer === null).length;
  if (unansweredCount > 0) {
    const confirmMessage =
      unansweredCount === 1
        ? "Çözülmemiş 1 soru var. Testi bitirmek istediğinizden emin misiniz?"
        : `Çözülmemiş ${unansweredCount} soru var. Testi bitirmek istediğinizden emin misiniz?`;
    const userConfirmed = window.confirm(confirmMessage);
    if (!userConfirmed) return;
  }
  showResults();
}

function goToTestHub() {
  clearState();
  quizKind = "general";
  activeQuestions = questions;
  activeAnswers = new Array(questions.length).fill(null);
  activeDomainCode = null;
  activeExpertiseDogru = null;
  activeExpertiseMeta = null;
  currentQuestionIndex = 0;
  introSection.classList.remove("hidden");
  quizSection.classList.add("hidden");
  afterQuizActions.classList.add("hidden");
  resultSection.classList.remove("is-visible");
  if (resultFollowupEl) {
    resultFollowupEl.classList.add("hidden");
    resultFollowupEl.innerHTML = "";
  }
}

function renderResultFollowupGeneral(strongDomainCode) {
  if (!resultFollowupEl) return;
  const dom = KATEGORILER[strongDomainCode];
  resultFollowupEl.innerHTML = `
    <div class="result-followup-hubtitle">Sonraki adımlar</div>
    <p class="result-note" style="margin-top:0">
      Öne çıkan alanın <strong>${dom}</strong> uzmanlık testlerinden birini şimdi çözebilir veya ana menüden başka bir temel alan seçebilirsin.
    </p>
    <button type="button" class="btn btn-secondary btn-sm" data-follow="domain-expertise" data-domain="${strongDomainCode}">
      ${dom} uzmanlık testleri
    </button>
    <button type="button" class="btn btn-ghost btn-sm" data-follow="hub">Test seçim ekranına dön</button>
  `;
  resultFollowupEl.classList.remove("hidden");
  resultFollowupEl.querySelector('[data-follow="hub"]').addEventListener("click", goToTestHub);
  resultFollowupEl.querySelector('[data-follow="domain-expertise"]').addEventListener("click", () => {
    scrollExpertiseIntoView(strongDomainCode);
    goToTestHub();
  });
}

function scrollExpertiseIntoView(domainCode) {
  requestAnimationFrame(() => {
    const el = document.querySelector(`[data-hub-domain="${domainCode}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function renderResultFollowupDomain(domainCode) {
  if (!resultFollowupEl) return;
  const domain = UZMANLIK_YAPISI.find((d) => d.code === domainCode);
  const lines = (domain?.specialties || [])
    .map(
      (s) =>
        `<li><button type="button" class="btn btn-ghost btn-sm" data-exp-start="${domainCode}" data-exp-id="${s.id}">${s.label.replace(/</g, "&lt;")}</button></li>`,
    )
    .join("");
  resultFollowupEl.innerHTML = `
    <div class="result-followup-hubtitle">Uzmanlık testleri</div>
    <p class="result-note" style="margin-top:0">Aynı temel alan altındaki bir uzmanlığı seçerek devam edebilirsin (alanını biliyorsan baştan da bu ekrandan başlaman yeterliydi).</p>
    <ul class="hub-specialties" style="list-style:none;padding:0;margin:0">${lines}</ul>
    <button type="button" class="btn btn-secondary btn-sm" data-follow="hub">Test seçim ekranına dön</button>
  `;
  resultFollowupEl.classList.remove("hidden");
  resultFollowupEl.querySelector('[data-follow="hub"]').addEventListener("click", goToTestHub);
  resultFollowupEl.querySelectorAll("[data-exp-start]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dc = btn.getAttribute("data-exp-start");
      const eid = btn.getAttribute("data-exp-id");
      const lab = btn.textContent.trim();
      pendingQuizStart = { kind: "expertise", domainCode: dc, expertiseId: eid, label: lab };
      openRegModal();
    });
  });
}

function renderResultFollowupExpertise(domainCode) {
  if (!resultFollowupEl) return;
  const dom = KATEGORILER[domainCode];
  resultFollowupEl.innerHTML = `
    <div class="result-followup-hubtitle">Devam</div>
    <p class="result-note" style="margin-top:0">Aynı alanda başka bir uzmanlık testi seçebilir veya <strong>${dom}</strong> temel alan testini çözebilirsin.</p>
    <button type="button" class="btn btn-secondary btn-sm" data-follow="domain-base" data-domain="${domainCode}">${dom} — temel alan testi</button>
    <button type="button" class="btn btn-ghost btn-sm" data-follow="hub">Test seçim ekranına dön</button>
  `;
  resultFollowupEl.classList.remove("hidden");
  resultFollowupEl.querySelector('[data-follow="hub"]').addEventListener("click", goToTestHub);
  resultFollowupEl.querySelector('[data-follow="domain-base"]').addEventListener("click", () => {
    const dc = domainCode;
    pendingQuizStart = { kind: "domain", domainCode: dc };
    openRegModal();
  });
}

function showResults() {
  stopQuizTimer();
  quizEndTime = null;
  fiveMinWarningShown = false;
  if (timerWarningBannerEl) timerWarningBannerEl.classList.add("hidden");
  saveState();

  afterQuizActions.classList.remove("hidden");
  quizSection.classList.add("hidden");
  resultSection.classList.remove("is-visible");
  if (resultFollowupEl) {
    resultFollowupEl.classList.add("hidden");
    resultFollowupEl.innerHTML = "";
  }

  if (quizKind === "general") {
    const kategoriSkorlari = skorlariHesapla(
      activeAnswers,
      AGIRLIKLANDIRMA_MATRISI,
      DOGRU_CEVAPLAR,
      questions,
    );
    let enYuksekSkor = -1;
    let enGucluKategoriKodu = null;
    for (const kategoriKodu in kategoriSkorlari) {
      if (kategoriSkorlari[kategoriKodu] > enYuksekSkor) {
        enYuksekSkor = kategoriSkorlari[kategoriKodu];
        enGucluKategoriKodu = kategoriKodu;
      }
    }
    const enGucluKategoriAdi = KATEGORILER[enGucluKategoriKodu] || "Belirlenemedi";
    resultScoreEl.textContent = `En yüksek eğilim: ${enGucluKategoriAdi}`;
    let summary = `Problem çözme yaklaşımın ve eğilimin en çok <strong>${enGucluKategoriAdi}</strong> alanıyla örtüşüyor. Ağırlıklı puan özeti:`;
    for (const kategoriKodu in kategoriSkorlari) {
      const ad = KATEGORILER[kategoriKodu];
      const skor = kategoriSkorlari[kategoriKodu].toFixed(2);
      summary += `<br/>— ${ad}: ${skor} puan`;
    }
    resultSummaryEl.innerHTML = summary;
    resultTagEl.textContent = enGucluKategoriAdi;
    renderResultFollowupGeneral(enGucluKategoriKodu);
    saveResultWithProfile(kategoriSkorlari, enGucluKategoriAdi, { testKind: "general" });
  } else if (quizKind === "domain") {
    let dogru = 0;
    for (let i = 0; i < activeQuestions.length; i++) {
      const key = `Q${activeQuestions[i].id}`;
      if (DOGRU_CEVAPLAR[key] === activeAnswers[i]) dogru += 1;
    }
    const pct = Math.round((dogru / activeQuestions.length) * 1000) / 10;
    const alanAd = KATEGORILER[activeDomainCode] || activeDomainCode;
    resultScoreEl.textContent = `${alanAd} — temel alan testi`;
    resultSummaryEl.innerHTML = `
      <p><strong>${dogru}</strong> / ${activeQuestions.length} doğru · <strong>%${pct}</strong></p>
      <p>Bu alan için ana testte ağırlığı en yüksek 10 soru ile ölçüm yapıldı. İstersen doğrudan aşağıdan bir uzmanlık testine geçebilirsin.</p>
    `;
    resultTagEl.textContent = alanAd;
    renderResultFollowupDomain(activeDomainCode);
    saveResultWithProfile(null, alanAd, {
      testKind: "domain",
      domainCode: activeDomainCode,
      dogruSayisi: dogru,
      soruSayisi: activeQuestions.length,
      yuzde: pct,
    });
  } else {
    let dogru = 0;
    for (let i = 0; i < activeQuestions.length; i++) {
      const key = `Q${activeQuestions[i].id}`;
      if (activeExpertiseDogru && activeExpertiseDogru[key] === activeAnswers[i]) dogru += 1;
    }
    const pct = Math.round((dogru / activeQuestions.length) * 1000) / 10;
    const baslik = activeExpertiseMeta?.label || "Uzmanlık testi";
    resultScoreEl.textContent = `${baslik}`;
    resultSummaryEl.innerHTML = `
      <p><strong>${dogru}</strong> / ${activeQuestions.length} doğru · <strong>%${pct}</strong></p>
      <p>Bu sonuç seçtiğin uzmanlık başlığına özgü kısa senaryo setine dayanır. Yazılım geliştirme altında her uzmanlık için ayrı soru bankası kullanılır; diğer temel alanlarda şimdilik alan genelinde ortak bir uzmanlık soru seti vardır (sonuçta seçtiğin alt başlık korunur).</p>
    `;
    resultTagEl.textContent = baslik;
    if (activeExpertiseMeta) renderResultFollowupExpertise(activeExpertiseMeta.domainCode);
    saveResultWithProfile(null, baslik, {
      testKind: "expertise",
      domainCode: activeExpertiseMeta.domainCode,
      expertiseId: activeExpertiseMeta.expertiseId,
      dogruSayisi: dogru,
      soruSayisi: activeQuestions.length,
      yuzde: pct,
    });
  }

  renderResultProfileRow();
}

/**
 * Mevcut profili (currentProfile) ve hesaplanan kategori skorlarını
 * RESULTS_KEY'deki diziye ekler. Her çalıştırmada aynı profil kaydını
 * günceller (startedAt ile eşleşme).
 */
function saveResultWithProfile(kategoriSkorlari, enGucluKategori, extra = {}) {
  if (!currentProfile) {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) currentProfile = JSON.parse(raw);
    } catch {}
  }

  const testKind = extra.testKind || "general";
  const baseEntry = {
    nickname: currentProfile?.nickname || "anonim",
    egitim: currentProfile?.egitim || "",
    bolum: currentProfile?.bolum || "",
    startedAt: currentProfile?.startedAt || null,
    completedAt: new Date().toISOString(),
    enGucluKategori: enGucluKategori,
    kategoriler: KATEGORILER,
    testKind,
  };

  let entry = { ...baseEntry };

  if (testKind === "general" && kategoriSkorlari) {
    const maxPuanHesap = () => {
      let toplam = 0;
      for (const k of Object.keys(AGIRLIKLANDIRMA_MATRISI)) {
        const row = AGIRLIKLANDIRMA_MATRISI[k];
        const max = Math.max(...Object.values(row));
        toplam += max;
      }
      return toplam || 1;
    };
    const maxPuan = maxPuanHesap();
    const skorYuzde = {};
    for (const [kod, skor] of Object.entries(kategoriSkorlari)) {
      skorYuzde[kod] = parseFloat(((skor / maxPuan) * 100).toFixed(1));
    }
    entry.skorlar = kategoriSkorlari;
    entry.skorlarYuzde = skorYuzde;
  } else {
    entry.domainCode = extra.domainCode;
    entry.dogruSayisi = extra.dogruSayisi;
    entry.soruSayisi = extra.soruSayisi;
    entry.yuzde = extra.yuzde;
    if (testKind === "expertise") entry.expertiseId = extra.expertiseId;
  }

  const all = getAllResults();
  const idx = all.findIndex((r) => r.startedAt && r.startedAt === entry.startedAt);
  if (idx >= 0) all[idx] = entry;
  else all.push(entry);
  saveAllResults(all);

  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch {}

  submitToFirestore(entry);
}

/** Firestore'a sonuç gönderir. db null ise (init hatası) sessizce atlar. */
async function submitToFirestore(entry) {
  if (!db) return;
  try {
    await db.collection("sonuclar").add(entry);
  } catch (err) {
    console.warn("Firestore kayıt hatası:", err);
  }
}

/** Sonuç ekranında nickname / bölüm / sınıf çiplerini oluşturur. */
function renderResultProfileRow() {
  const rowEl = document.getElementById("result-profile-row");
  if (!rowEl) return;

  const profile = currentProfile || (() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null"); } catch { return null; }
  })();

  if (!profile || !profile.nickname) { rowEl.classList.add("hidden"); return; }

  rowEl.innerHTML = [
    chip("👤", "Takma Ad", profile.nickname),
    chip("🎓", "Sınıf",    profile.egitim),
    chip("📚", "Bölüm",    profile.bolum),
  ].join("");
  rowEl.classList.remove("hidden");
}

function chip(icon, label, value) {
  if (!value) return "";
  return `<span class="profile-chip"><span class="profile-chip-label">${label}:</span> ${icon} ${value}</span>`;
}

nextBtn.addEventListener("click", handleNext);
finishBtn.addEventListener("click", handleFinishQuiz);


optionsEl.addEventListener("change", (e) => {
  const t = e.target;
  if (!(t instanceof HTMLInputElement)) return;
  if (t.type !== "radio") return;

  // Anında kaydet
  activeAnswers[currentQuestionIndex] = t.value;
  syncSelectedUI();
  updateProgress();
  saveState();
});


// --- SKOR HESAPLAMA FONKSİYONU (Eksik olan kısım buraya eklendi) ---
function skorlariHesapla(kullaniciCevaplari, matris, dogruCevaplar, questionList) {
    const list = questionList || questions;
    const skorlar = { "SD": 0.0, "DS-AI": 0.0, "CS-NET": 0.0, "IS-MT": 0.0, "CL-DN": 0.0 };

    for (let i = 0; i < list.length; i++) {
        const soruNo = `Q${list[i].id}`;
        const secilenCevap = kullaniciCevaplari[i];

        if (!secilenCevap) continue;

        if (dogruCevaplar[soruNo] === secilenCevap && matris[soruNo]) {
            const row = matris[soruNo];
            for (const kategoriKodu in skorlar) {
                skorlar[kategoriKodu] += row[kategoriKodu] || 0.0;
            }
        }
    }

    return skorlar;
}



function initTestHub() {
  const root = document.getElementById("test-hub-root");
  if (!root) return;

  const generalBtn = document.createElement("button");
  generalBtn.type = "button";
  generalBtn.className = "btn btn-primary hub-btn-general";
  generalBtn.innerHTML = `<span>Genel IT testi — 30 soru, 5 alan</span>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  generalBtn.addEventListener("click", () => {
    pendingQuizStart = { kind: "general" };
    openRegModal();
  });
  root.appendChild(generalBtn);

  const grid = document.createElement("div");
  grid.className = "test-hub-columns";
  for (const domain of UZMANLIK_YAPISI) {
    const block = document.createElement("div");
    block.className = "hub-domain-block";
    block.dataset.hubDomain = domain.code;

    const h = document.createElement("h3");
    h.className = "hub-domain-title";
    h.textContent = domain.label;
    block.appendChild(h);

    const actions = document.createElement("div");
    actions.className = "hub-domain-actions";
    const baseBtn = document.createElement("button");
    baseBtn.type = "button";
    baseBtn.className = "btn btn-secondary btn-sm";
    baseBtn.textContent = "Temel alan testi";
    baseBtn.addEventListener("click", () => {
      pendingQuizStart = { kind: "domain", domainCode: domain.code };
      openRegModal();
    });
    actions.appendChild(baseBtn);
    block.appendChild(actions);

    const lab = document.createElement("div");
    lab.className = "hub-specialties-label";
    lab.textContent = "Uzmanlık testi (atlayarak)";

    const specWrap = document.createElement("div");
    specWrap.className = "hub-specialties";
    for (const sp of domain.specialties) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn-ghost btn-sm";
      b.textContent = sp.label;
      b.addEventListener("click", () => {
        pendingQuizStart = {
          kind: "expertise",
          domainCode: domain.code,
          expertiseId: sp.id,
          label: sp.label,
        };
        openRegModal();
      });
      specWrap.appendChild(b);
    }
    block.appendChild(lab);
    block.appendChild(specWrap);
    grid.appendChild(block);
  }
  root.appendChild(grid);
}

function tryResumeQuiz() {
  const status = loadState();

  // Aktif profili her durumda yükle (sayfa yenileme desteği)
  if (!currentProfile) {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) currentProfile = JSON.parse(raw);
    } catch {}
  }

  if (status === "expired") {
    introSection.classList.add("hidden");
    quizSection.classList.add("hidden");
    afterQuizActions.classList.remove("hidden");
    showResults();
    return;
  }
  if (status === "active") {
    introSection.classList.add("hidden");
    quizSection.classList.remove("hidden");
    resultSection.classList.remove("is-visible");
    afterQuizActions.classList.add("hidden");
    if (fiveMinWarningShown && timerWarningBannerEl) {
      timerWarningBannerEl.classList.remove("hidden");
    }
    renderQuestion();
    updateProgress();
    updateTimerDisplay();
    startQuizTimer();
  }
}

quizSection.classList.add("hidden");

showResultBtn.addEventListener("click", () => {
  afterQuizActions.classList.add("hidden");
  resultSection.classList.add("is-visible");

  resultSection.scrollIntoView({ behavior: "smooth" });
});



document.addEventListener("DOMContentLoaded", () => {
  initRegModule();
  initTestHub();
  tryResumeQuiz();
});

// ============================================================
// KAYIT (REGISTRATION) MODÜLÜ
// ============================================================

/** localStorage anahtarları */
const RESULTS_KEY   = "it_test_results_v1";      // tüm sonuçlar dizisi
const PROFILE_KEY   = "it_test_current_profile_v1"; // aktif kullanıcı profili
const USERS_KEY     = "it_test_users_v1"; // nickname + parola hash kayıtları

/** Bölüm listesi */
const BOLUMLER = [
  "Bilgisayar Mühendisliği",
  "Yazılım Mühendisliği",
  "Yönetim Bilişim Sistemleri (YBS)",
  "Matematik",
  "İstatistik",
  "Elektrik-Elektronik Mühendisliği",
  "Endüstri Mühendisliği",
  "Bilişim Sistemleri Mühendisliği",
  "Yapay Zeka Mühendisliği",
  "Veri Bilimi",
  "Siber Güvenlik",
  "Bilgisayar Bilimleri",
  "Diğer",
];

let currentProfile = null;  // { nickname, egitim, bolum, startedAt }
let nicknameDebounceTimer = null;
let passwordDebounceTimer = null;

// ---------- Yardımcı: tüm sonuçları oku / yaz ----------

function getAllResults() {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveAllResults(arr) {
  try { localStorage.setItem(RESULTS_KEY, JSON.stringify(arr)); } catch {}
}

// ---------- Kullanıcı hesabı yardımcıları ----------

function getAllUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAllUsers(arr) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(arr)); } catch {}
}

async function hashPassword(rawPassword) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("Tarayıcı SHA-256 desteği bulunamadı.");

  const input = String(rawPassword || "");
  const bytes = new TextEncoder().encode(input);
  const digest = await subtle.digest("SHA-256", bytes);
  const hashArray = Array.from(new Uint8Array(digest));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateSalt(byteLength = 16) {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.getRandomValues) {
    throw new Error("Tarayıcı random salt üretimini desteklemiyor.");
  }
  const bytes = new Uint8Array(byteLength);
  cryptoApi.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPasswordWithSalt(rawPassword, salt) {
  return hashPassword(`${salt}:${String(rawPassword || "")}`);
}

/**
 * @returns {{ok:true,nickname:string}|{ok:false,error:string}}
 */
async function authenticateOrRegisterNickname(nickRaw, passwordRaw) {
  const nickname = nickRaw.trim();
  const nicknameLower = nickname.toLowerCase();
  const users = getAllUsers();
  const existing = users.find((u) => u.nicknameLower === nicknameLower);

  if (!existing) {
    const salt = generateSalt();
    const passwordHash = await hashPasswordWithSalt(passwordRaw, salt);
    users.push({
      nickname,
      nicknameLower,
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
    });
    saveAllUsers(users);
    return { ok: true, nickname };
  }

  const existingSalt = typeof existing.salt === "string" ? existing.salt : "";
  const expectedHash = existingSalt
    ? await hashPasswordWithSalt(passwordRaw, existingSalt)
    : await hashPassword(passwordRaw); // eski tuzsuz kayıtlarla geriye uyumluluk

  if (existing.passwordHash !== expectedHash) {
    return { ok: false, error: "Bu nickname kayıtlı. Şifre yanlış." };
  }

  return { ok: true, nickname: existing.nickname };
}

// ---------- Modal DOM referansları ----------

let regOverlay, regForm, inputNickname, inputPassword, nicknameStatus, nicknameMsg, passwordStatus, passwordMsg,
    inputEgitim, egitimMsg, inputBolum, bolumMsg,
    bolumTrigger, bolumDisplay, bolumDropdown, bolumSearchInput, bolumList,
    regSubmitBtn;

function initRegModule() {
  regOverlay        = document.getElementById("reg-overlay");
  regForm           = document.getElementById("reg-form");
  inputNickname     = document.getElementById("input-nickname");
  inputPassword     = document.getElementById("input-password");
  nicknameStatus    = document.getElementById("nickname-status");
  nicknameMsg       = document.getElementById("nickname-msg");
  passwordStatus    = document.getElementById("password-status");
  passwordMsg       = document.getElementById("password-msg");
  inputEgitim       = document.getElementById("input-egitim");
  egitimMsg         = document.getElementById("egitim-msg");
  inputBolum        = document.getElementById("input-bolum");
  bolumMsg          = document.getElementById("bolum-msg");
  bolumTrigger      = document.getElementById("bolum-trigger");
  bolumDisplay      = document.getElementById("bolum-display");
  bolumDropdown     = document.getElementById("bolum-dropdown");
  bolumSearchInput  = document.getElementById("bolum-search-input");
  bolumList         = document.getElementById("bolum-list");
  regSubmitBtn      = document.getElementById("reg-submit-btn");

  buildBolumList(BOLUMLER);
  bindBolumDropdown();
  bindNicknameValidation();
  bindFormSubmit();
  
    // Close button event
  document.getElementById("reg-close-btn").addEventListener("click", closeRegModal);
  
  // Overlay dışına tıklama ile kapatma iptal (istersen açarsın)
  // regOverlay.addEventListener("click", (e) => { if (e.target === regOverlay) closeRegModal(); });
}

// ---------- Modal aç / kapat ----------

function openRegModal() {
  if (!regOverlay) return;
  regOverlay.classList.remove("hidden");
  requestAnimationFrame(() => regOverlay.classList.add("is-visible"));
  document.body.style.overflow = "hidden";
  setTimeout(() => inputNickname && inputNickname.focus(), 250);
}

function closeRegModal() {
  regOverlay.classList.remove("is-visible");
  document.body.style.overflow = "";
  setTimeout(() => regOverlay.classList.add("hidden"), 230);
}

// ---------- Nickname doğrulama ----------

function setNicknameState(state, msg) {
  // state: "ok" | "error" | "checking" | ""
  inputNickname.classList.remove("is-valid", "is-error");
  nicknameMsg.className = "reg-field-msg";
  nicknameStatus.textContent = "";
  nicknameMsg.textContent = msg || "";

  if (state === "ok") {
    inputNickname.classList.add("is-valid");
    nicknameMsg.classList.add("is-ok");
    nicknameStatus.textContent = "✓";
  } else if (state === "error") {
    inputNickname.classList.add("is-error");
    nicknameMsg.classList.add("is-error");
    nicknameStatus.textContent = "✕";
  } else if (state === "checking") {
    nicknameMsg.classList.add("is-checking");
    nicknameStatus.textContent = "…";
  }
}

function validateNickname(value) {
  const nick = value.trim();
  if (!nick) {
    setNicknameState("error", "Takma ad boş bırakılamaz.");
    return false;
  }
  if (nick.length < 3) {
    setNicknameState("error", "En az 3 karakter olmalı.");
    return false;
  }
  if (!/^[A-Za-zÇçĞğİıÖöŞşÜü0-9_\-\.]+$/.test(nick)) {
    setNicknameState("error", "Yalnızca harf, rakam ve _ - . karakterleri.");
    return false;
  }
  setNicknameState("ok", "Takma ad geçerli.");
  return true;
}

function setPasswordState(state, msg) {
  // state: "ok" | "error" | "checking" | ""
  inputPassword.classList.remove("is-valid", "is-error");
  passwordMsg.className = "reg-field-msg";
  passwordStatus.textContent = "";
  passwordMsg.textContent = msg || "";

  if (state === "ok") {
    inputPassword.classList.add("is-valid");
    passwordMsg.classList.add("is-ok");
    passwordStatus.textContent = "✓";
  } else if (state === "error") {
    inputPassword.classList.add("is-error");
    passwordMsg.classList.add("is-error");
    passwordStatus.textContent = "✕";
  } else if (state === "checking") {
    passwordMsg.classList.add("is-checking");
    passwordStatus.textContent = "…";
  }
}

function validatePassword(value) {
  const pwd = value.trim();
  if (!pwd) {
    setPasswordState("error", "Şifre boş bırakılamaz.");
    return false;
  }
  if (pwd.length < 4) {
    setPasswordState("error", "Şifre en az 4 karakter olmalı.");
    return false;
  }
  setPasswordState("ok", "Şifre geçerli.");
  return true;
}

function bindNicknameValidation() {
  inputNickname.addEventListener("input", () => {
    clearTimeout(nicknameDebounceTimer);
    const val = inputNickname.value;
    if (!val.trim()) { setNicknameState("", ""); return; }
    setNicknameState("checking", "Kontrol ediliyor…");
    nicknameDebounceTimer = setTimeout(() => validateNickname(val), 420);
  });

  inputNickname.addEventListener("blur", () => {
    clearTimeout(nicknameDebounceTimer);
    if (inputNickname.value.trim()) validateNickname(inputNickname.value);
  });

  inputPassword.addEventListener("input", () => {
    clearTimeout(passwordDebounceTimer);
    const val = inputPassword.value;
    if (!val.trim()) { setPasswordState("", ""); return; }
    setPasswordState("checking", "Kontrol ediliyor…");
    passwordDebounceTimer = setTimeout(() => validatePassword(val), 420);
  });

  inputPassword.addEventListener("blur", () => {
    clearTimeout(passwordDebounceTimer);
    if (inputPassword.value.trim()) validatePassword(inputPassword.value);
  });
}

// ---------- Searchable Bölüm Dropdown ----------

function buildBolumList(items) {
  bolumList.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.setAttribute("data-empty", "");
    li.textContent = "Sonuç bulunamadı";
    bolumList.appendChild(li);
    return;
  }
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    li.dataset.value = item;
    if (inputBolum.value === item) li.classList.add("is-selected");
    li.addEventListener("mousedown", (e) => {
      e.preventDefault();
      selectBolum(item);
    });
    bolumList.appendChild(li);
  });
}

function selectBolum(value) {
  inputBolum.value = value;
  bolumDisplay.textContent = value;
  bolumDisplay.classList.add("has-value");
  bolumTrigger.classList.remove("is-error");
  closeBolumDropdown();
  bolumMsg.textContent = "";
  bolumMsg.className = "reg-field-msg";
  buildBolumList(BOLUMLER);  // listeyi yenile (seçili işareti)
}

function openBolumDropdown() {
  bolumDropdown.classList.remove("hidden");
  bolumTrigger.classList.add("is-open");
  bolumTrigger.setAttribute("aria-expanded", "true");
  bolumSearchInput.value = "";
  buildBolumList(BOLUMLER);
  bolumSearchInput.focus();
}

function closeBolumDropdown() {
  bolumDropdown.classList.add("hidden");
  bolumTrigger.classList.remove("is-open");
  bolumTrigger.setAttribute("aria-expanded", "false");
}

function bindBolumDropdown() {
  bolumTrigger.addEventListener("click", () => {
    bolumDropdown.classList.contains("hidden") ? openBolumDropdown() : closeBolumDropdown();
  });

  bolumTrigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBolumDropdown(); }
    if (e.key === "Escape") closeBolumDropdown();
  });

  bolumSearchInput.addEventListener("input", () => {
    const q = bolumSearchInput.value.toLowerCase();
    const filtered = BOLUMLER.filter(b => b.toLowerCase().includes(q));
    buildBolumList(filtered);
  });

  document.addEventListener("click", (e) => {
    const wrap = document.getElementById("bolum-searchable");
    if (wrap && !wrap.contains(e.target)) closeBolumDropdown();
  });
}

// ---------- Form submit ----------

function bindFormSubmit() {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let ok = true;

    const nickOk = validateNickname(inputNickname.value);
    if (!nickOk) ok = false;
    const passOk = validatePassword(inputPassword.value);
    if (!passOk) ok = false;

    if (!inputEgitim.value) {
      inputEgitim.classList.add("is-error");
      egitimMsg.textContent = "Eğitim durumunu seçmelisin.";
      egitimMsg.className = "reg-field-msg is-error";
      ok = false;
    } else {
      inputEgitim.classList.remove("is-error");
      egitimMsg.textContent = "";
      egitimMsg.className = "reg-field-msg";
    }

    if (!inputBolum.value) {
      bolumTrigger.classList.add("is-error");
      bolumMsg.textContent = "Bölümünü seçmelisin.";
      bolumMsg.className = "reg-field-msg is-error";
      ok = false;
    } else {
      bolumTrigger.classList.remove("is-error");
      bolumMsg.textContent = "";
      bolumMsg.className = "reg-field-msg";
    }

    if (!ok) return;

    let authResult;
    try {
      authResult = await authenticateOrRegisterNickname(inputNickname.value, inputPassword.value);
    } catch (err) {
      setPasswordState("error", "Şifre doğrulama sırasında bir hata oluştu.");
      console.warn("SHA-256 doğrulama hatası:", err);
      return;
    }
    if (!authResult.ok) {
      setPasswordState("error", authResult.error);
      return;
    }

    // Profili kaydet
    currentProfile = {
      nickname : authResult.nickname,
      egitim   : inputEgitim.value,
      bolum    : inputBolum.value,
      startedAt: new Date().toISOString(),
    };
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(currentProfile)); } catch {}

    closeRegModal();

    // Smooth geçiş: modal kapanma animasyonu bitmeden test başlamasın
    setTimeout(() => {
      document.body.style.overflow = "";
      const p = pendingQuizStart;
      pendingQuizStart = null;
      if (!p || p.kind === "general") startGeneralTest();
      else if (p.kind === "domain") startDomainTest(p.domainCode);
      else if (p.kind === "expertise") startExpertiseTest(p.domainCode, p.expertiseId, p.label);
    }, 240);
  });
}
