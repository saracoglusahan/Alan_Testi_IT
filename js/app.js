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


// --- KATEGORİ SABİTLERİ (Eklemeniz Gereken Kısım) ---
const KATEGORILER = { 
    "SD": "Yazılım Geliştirme", 
    "DM": "Veri Yönetimi", 
    "IM": "Altyapı Yönetimi", 
    "CS": "Siber Güvenlik", 
    "PM": "BT Süreç Yönetimi" 
};
const AGIRLIKLANDIRMA_MATRISI = {
    // Matris verilerinizi buradan alıyoruz
    "Q1":  { "SD": 0.7, "DM": 0.0, "IM": 0.2, "CS": 0.0, "PM": 0.1 },
    "Q2":  { "SD": 0.9, "DM": 0.0, "IM": 0.0, "CS": 0.0, "PM": 0.1 },
    "Q3":  { "SD": 0.4, "DM": 0.0, "IM": 0.0, "CS": 0.0, "PM": 0.6 },
    "Q4": {
        "SD": 0.5,
        "DM": 0.0,
        "IM": 0.2,
        "CS": 0.0,
        "PM": 0.3
    },
    "Q5": {
        "SD": 0.8,
        "DM": 0.0,
        "IM": 0.0,
        "CS": 0.0,
        "PM": 0.2
    },
    "Q6": {
        "SD": 0.8,
        "DM": 0.0,
        "IM": 0.0,
        "CS": 0.0,
        "PM": 0.2
    },
    "Q7": {
        "SD": 0.0,
        "DM": 0.8,
        "IM": 0.0,
        "CS": 0.0,
        "PM": 0.2
    },
    "Q8": {
        "SD": 0.3,
        "DM": 0.7,
        "IM": 0.0,
        "CS": 0.0,
        "PM": 0.0
    },
    "Q9": {
        "SD": 0.0,
        "DM": 0.9,
        "IM": 0.0,
        "CS": 0.0,
        "PM": 0.1
    },
    "Q10": {
        "SD": 0.0,
        "DM": 0.6,
        "IM": 0.4,
        "CS": 0.0,
        "PM": 0.0
    },
    "Q11": {
        "SD": 0.0,
        "DM": 0.9,
        "IM": 0.0,
        "CS": 0.0,
        "PM": 0.1
    },
    "Q12": {
        "SD": 0.1,
        "DM": 0.9,
        "IM": 0.0,
        "CS": 0.0,
        "PM": 0.0
    },
    "Q13": {
        "SD": 0.0,
        "DM": 0.0,
        "IM": 0.7,
        "CS": 0.3,
        "PM": 0.0
    },
    "Q14": {
        "SD": 0.4,
        "DM": 0.0,
        "IM": 0.6,
        "CS": 0.0,
        "PM": 0.0
    },
    "Q15": {
        "SD": 0.0,
        "DM": 0.0,
        "IM": 0.8,
        "CS": 0.0,
        "PM": 0.2
    },
    "Q16": {
        "SD": 0.0,
        "DM": 0.0,
        "IM": 0.5,
        "CS": 0.5,
        "PM": 0.0
    },
    "Q17": {
        "SD": 0.1,
        "DM": 0.0,
        "IM": 0.7,
        "CS": 0.0,
        "PM": 0.2
    },
    "Q18": {
        "SD": 0.0,
        "DM": 0.0,
        "IM": 0.8,
        "CS": 0.0,
        "PM": 0.2
    },
    "Q19": {
        "SD": 0.0,
        "DM": 0.0,
        "IM": 0.1,
        "CS": 0.9,
        "PM": 0.0
    },
    "Q20": {
        "SD": 0.4,
        "DM": 0.0,
        "IM": 0.0,
        "CS": 0.6,
        "PM": 0.0
    },
    "Q21": {
        "SD": 0.1,
        "DM": 0.0,
        "IM": 0.1,
        "CS": 0.8,
        "PM": 0.0
    },
    "Q22": {
        "SD": 0.0,
        "DM": 0.0,
        "IM": 0.0,
        "CS": 0.7,
        "PM": 0.3
    },
    "Q23": {
        "SD": 0.2,
        "DM": 0.0,
        "IM": 0.0,
        "CS": 0.8,
        "PM": 0.0
    },
    "Q24": {
        "SD": 0.0,
        "DM": 0.0,
        "IM": 0.3,
        "CS": 0.7,
        "PM": 0.0
    },
    "Q25": {
        "SD": 0.4,
        "DM": 0.0,
        "IM": 0.0,
        "CS": 0.0,
        "PM": 0.6
    },
    "Q26": {
        "SD": 0.0,
        "DM": 0.4,
        "IM": 0.0,
        "CS": 0.0,
        "PM": 0.6
    },
    "Q27": {
        "SD": 0.3,
        "DM": 0.0,
        "IM": 0.4,
        "CS": 0.0,
        "PM": 0.3
    },
    "Q28": {
        "SD": 0.3,
        "DM": 0.0,
        "IM": 0.0,
        "CS": 0.0,
        "PM": 0.7
    },
    "Q29": {
        "SD": 0.0,
        "DM": 0.0,
        "IM": 0.0,
        "CS": 0.0,
        "PM": 1.0
    },
    "Q30_A": { "SD": 0.8, "DM": 0.0, "IM": 0.0, "CS": 0.1, "PM": 0.1 },
    "Q30_B": { "SD": 0.0, "DM": 0.9, "IM": 0.0, "CS": 0.0, "PM": 0.1 },
    "Q30_C": { "SD": 0.0, "DM": 0.0, "IM": 0.1, "CS": 0.9, "PM": 0.0 },
    "Q30_D": { "SD": 0.0, "DM": 0.0, "IM": 0.0, "CS": 0.0, "PM": 1.0 }
};

const DOGRU_CEVAPLAR = {
    // Doğru cevaplarınızı buraya harf olarak tanımlayın
    "Q1": "D", "Q2": "C", "Q3": "B", "Q4": "E", "Q5": "C", "Q6": "B", 
    "Q7": "C", "Q8": "A", "Q9": "E", "Q10": "B", "Q11": "D", "Q12": "C",
    "Q13": "C", "Q14": "C", "Q15": "B", "Q16": "D", "Q17": "C", "Q18": "A",
    "Q19": "B", "Q20": "C", "Q21": "D", "Q22": "B", "Q23": "E", "Q24": "E",
    "Q25": "B", "Q26": "A", "Q27": "B", "Q28": "A", "Q29": "D",
    // Q30 burada yer almaz (Yönelim sorusu)
};

// A, B, C, D harflerini tutan dizi
const optionLabels = ["A", "B", "C", "D", "E"];

// 30 soruluk test
const questions = [
  {
    id: 1,
    text: "Soru 1 \nBir mobil uygulama geliştiriyorsunuz. Uygulama, kullanıcı bir butona bastığında arka planda sunucudan veri çekiyor. Ancak, kullanıcı butona tekrar tekrar hızlıca bastığında, aynı veri çekme işlemi defalarca tetikleniyor ve bu da sunucuda gereksiz yüke neden oluyor. Bu durumu kodlama düzeyinde önlemek için en temel ve etkili yaklaşımınız ne olur?",
    options:  [
  "Sunucuya giden her istek için bir sayaç tutarak, bir saniye içinde belli bir sayının üzerindeki istekleri reddetmek.",
  "Her istekten önce sunucuya, bu isteğin daha önce yapılıp yapılmadığını soran bir kontrol isteği göndermek.",
  "Uygulamanın açılışında, kullanıcının bir saat içinde kaç istek yapabileceğini belirleyen bir limitasyon tanımlamak.",
  "Butona basıldıktan hemen sonra butonu devre dışı bırakmak ve sadece veri çekme işlemi başarıyla tamamlandıktan veya bir hata aldıktan sonra butonu tekrar etkinleştirmek.",
  " Veri çekme isteği başlamadan önce, mevcut durumda zaten devam eden başka bir veri çekme işlemi olup olmadığını kontrol etmek ve varsa yenisini başlatmamak.",
],
  },
  {
    id: 2,
    text: "Soru 2 \nBir hastane yönetim sistemi tasarlıyorsunuz. Sistemde 'Doktor', 'Hemşire' ve 'Hasta' gibi temel roller var. Her rolün kendine has özellikleri (Doktor'un uzmanlığı, Hemşire'nin vardiyası, Hasta'nın hastalık geçmişi) ve ortak işlevleri (Kişisel bilgileri görüntüleme, randevu kaydı oluşturma) bulunuyor. Nesne Yönelimli Programlama (NYP) prensiplerini kullanarak bu yapıyı en verimli şekilde nasıl modelledirsiniz?",
    options: [
    "Her rol için tamamen bağımsız üç ayrı sınıf (Doktor, Hemşire, Hasta) oluşturur ve ortak işlevleri her sınıfta ayrı ayrı kopyalarım.", 
  "Tüm rolleri temsil eden tek bir 'Kişi' sınıfı oluşturur ve her rol için özel bilgileri bu sınıf içindeki koşullu alanlarla (if/else) yönetirim.", 
  "Ortak işlevleri ve temel bilgileri içeren bir 'Kullanıcı' üst sınıfı (Superclass) oluşturur ve 'Doktor', 'Hemşire', 'Hasta' sınıflarını bu sınıftan türeterek (Inheritance) özelleştiririm.", 
  "Her bir rolün (Doktor, Hemşire, Hasta) özelliklerini saklayan ayrı tablolar oluşturur, ancak kodda bunları doğrudan birbirine bağlamadan kullanırım.",
 "Her rol için bir Arayüz (Interface) tanımlar, ancak her rolün ortak işlevlerinin implementasyonunu her sınıfta ayrı ayrı tekrarlarım.",
],
  },
  {
  id: 3,
  text: "Soru 3 \nBir uygulamanın son sürümünde, nadiren ve tahmin edilemeyen zamanlarda kullanıcıların profil fotoğrafının kaybolduğu bildiriliyor. Kendi testlerinizde bu hatayı yeniden oluşturamıyorsunuz. Hatanın kaynağını bulmak için izleyeceğiniz en sistematik ilk adım ne olmalıdır?",
  options: [
    "Derhal tüm fotoğraf yükleme ve silme kodlarını gözden geçirerek olası senaryoları düşünmek.",
    "Kullanıcıların cihaz türü, işletim sistemi sürümü ve kaybolmanın gerçekleştiği yaklaşık zaman gibi çevresel verileri toplayarak bir desen (pattern) aramak.",
    "Hatanın oluştuğu anda çalışan sunucu loglarını incelemek, ancak önce hatanın tekrar oluşmasını beklemek.",
    "Son sürümdeki tüm yeni kodları geri alarak eski sürüme dönmek ve sorunun ortadan kalkıp kalkmadığını kontrol etmek.",
    "Hatanın oluştuğu anı kaydetmek için tüm kullanıcılara ekran kaydı yapmalarını söyleyen bir uyarı mesajı göndermek.",
  ],
},
{
  id: 4,
  text: "Soru 4 \nBir ekip toplantısında, mevcut sistemin yavaşlığı tartışılıyor. Geliştiricilerin çoğu, kodun içindeki spesifik yavaş fonksiyonları optimize etmeyi önerirken, siz farklı bir görüş belirtiyorsunuz. Sizin yaklaşımınız aşağıdakilerden hangisidir?",
  options: [
    "Yavaş çalışan fonksiyonları bulmak için bir performans analiz aracı (profiler) kullanır, sadece en çok zaman tüketen kısımlara odaklanırım.",
    "Sadece veritabanının sorgu sürelerini analiz eden bir araç kullanır, uygulamanın kodundaki performans sorunlarını göz ardı ederim.",
    "Geliştiricilerden, her fonksiyonu daha hızlı hale getirmek için paralel işlem (multithreading) kullanmalarını isterim.",
    "Kullanıcılardan en az kullandıkları özellikleri belirlemelerini ve bu özellikleri sistemden tamamen kaldırmayı öneririm.",
    "Sistemin tüm katmanları arasındaki veri akışını ve iletişimi (örneğin, veritabanı sorgularının sayısını ve sunucu yanıt sürelerini) haritalandırarak mimari düzeyde bir tıkanıklık (bottleneck) ararım.",
  ],
},
{
  id: 5,
  text: "Soru 5 \nBir çizgi film karakteri koleksiyonu uygulaması geliştiriyorsunuz. Her karakterin adı, rengi ve özel gücü var. Bazı karakterler uçabiliyor, bazıları hızlı koşabiliyor, bazıları ise görünmez olabiliyor. Bu farklı yetenekleri kod yapısına en esnek şekilde dahil etmek için hangi Nesne Yönelimli Tasarım Kalıbını (Design Pattern) kullanmayı tercih edersiniz?",
  options: [
    "Decorator: Karakterleri sürekli sarmallayarak (wrap) yetenek eklemek.",
    "Factory: Her karakter tipini tek bir merkezi yerden oluşturmak.",
    "Strategy: Uçma, koşma ve görünmezlik gibi yetenekleri ayrı sınıflar olarak tanımlayıp, karakter nesnesine çalışma zamanında bu yetenekleri atamak.",
    "Singleton: Tüm karakterlerin tek bir örnek (instance) üzerinden erişilebilir olmasını sağlamak.",
    " Observer: Karakterlerin yeteneklerini, yetenekleri kullanan diğer nesnelere anlık bildirim gönderecek şekilde tasarlamak.",
  ],
},
{
  id: 6,
  text: "Soru 6 \nBir geliştirici olarak, 1000 satırlık bir fonksiyonun içindeki bir hatayı (bug) bulmaya çalışıyorsunuz. Fonksiyon, birçok farklı girdi (input) alıyor ve çıktı (output) üretiyor. Fonksiyonun çıktısı beklediğiniz gibi değil. Hata ayıklama sürecini hızlandırmak için ilk olarak ne yaparsınız?",
  options: [
    "Kodun ilk 500 satırını siler, çıktının değişip değişmediğini kontrol ederim.",
    "Fonksiyonun ortasına, girdilerin ve o noktaya kadar hesaplanan kritik ara değerlerin ne olduğunu yazdıran (loglayan) bir çıktı eklerim (Binary Search yaklaşımı).",
    "Tüm girdileri tek tek değiştirerek çıktıyı izlerim.",
    "Fonksiyonu tamamen baştan yazmayı teklif ederim.",
    "Fonksiyonun tamamını bir kerede hata ayıklayıcı (debugger) ile adım adım çalıştırmak yerine, sadece fonksiyonun en başında ve sonunda çıktıları kontrol ederim.",
  ],
},
{
  id: 7,
  text: "Soru 7 \nBir A/B testi yaptınız. A versiyonunda dönüşüm oranı %5.0, B versiyonunda ise %5.2 çıktı. İstatistiksel olarak anlamlı bir fark olup olmadığını anlamak için hangi temel bilgiyi bilmeniz gerekir?",
  options: [
    "İki sürümün geliştirilmesi için harcanan toplam zaman.",
    "Testin yapıldığı sunucunun işlemci gücü.",
    "Her iki versiyon için toplanan örneklem büyüklüğü (kullanıcı sayısı).",
    "B versiyonundaki kullanıcıların demografik bilgileri.",
    "A versiyonundaki kullanıcıların demografik bilgileri.",
  ],
},
{
  id: 8,
  text: "Soru 8 \nBir model kurucu olarak, müşterilerinizin bir sonraki ay ne kadar harcama yapacağını tahmin eden bir model tasarlıyorsunuz. Modelin tahmin sonuçlarını ne zaman ve nasıl güncelleyeceğinize dair bir strateji belirlemelisiniz. Aşağıdaki yaklaşımlardan hangisi, kaynak verimliliği ve tahmin güncelliği arasında en iyi dengeyi sağlar?",
  options: [
    "Modeli her ayın ilk günü, geçmiş bir yılın verisiyle yeniden eğitir ve tahmini yayınlarım.",
    "Her müşteri sisteme her giriş yaptığında, modelin o müşteri için yeniden tahmin yapmasını sağlarım (Gerçek zamanlı yeniden eğitim).",
    "Modeli bir kez eğitir, sonuçları bir yıla kadar kullanırım.",
    "Sadece müşteri harcamaları büyük bir sapma gösterdiğinde (outlier) modeli yeniden eğitmek için manuel bir süreç başlatırım.",
    "Modelin tahminlerini her hafta sonu, sadece son 7 günlük yeni veriyi ekleyerek güncellerim.",
  ],
},
{
  id: 9,
  text: "Soru 9 \n10.000 farklı ürüne ait satış verisini analiz ediyorsunuz. Her ürünün Fiyatı, Satış Miktarı, Stok Durumu ve Kategori Bilgisi var. Yöneticinize, \"Hangi ürün kategorileri en yüksek kâr marjına sahiptir?\" sorusunu görsel olarak açıklamak istiyorsunuz. En uygun görselleştirme yöntemi ne olur?",
  options: [
    "Her bir ürünün ayrı ayrı fiyat-satış miktarını gösteren bir Dağılım Grafiği (Scatter Plot).",
    "Kategorilerin toplam stok durumunu gösteren bir Halka Grafik (Donut Chart).",
    "Kategorilerin ürün sayısı içindeki payını gösteren bir Pasta Grafik (Pie Chart).",
    "Tüm ürünlerin satış miktarlarını zaman içindeki değişimini gösteren bir Çizgi Grafik (Line Chart).",
    "Tüm kategorileri listeleyen ve her kategorinin toplam Kâr Marjını gösteren bir Çubuk Grafik (Bar Chart).",
  ],
},
{
  id: 10,
  text: "Soru 10 \n100 GB büyüklüğünde, sık sık güncellenen bir müşteri verisi tablosuna sahipsiniz. Her ay, bu tablodaki verilere dayanarak karmaşık analizler yapmanız gerekiyor. Analiz sorgularının süresi giderek artıyor. Sorgu süresini düşürmek için veriye dayalı ilk müdahaleniz ne olur?",
  options: [
    "Daha hızlı bir sunucu satın almayı talep etmek.",
    "En sık kullanılan arama kriterleri (örneğin, Müşteri ID, Kayıt Tarihi) üzerinde veri tabanı indeksleri (Indexes) oluşturmak.",
    "Tüm veriyi daha küçük, aylık dosyalara bölmek ve analizi bu dosyalarda yapmak.",
    "Tablodan, son 6 aydan eski olan tüm verileri kalıcı olarak silmek.",
    "Tablodaki tüm verilerin bir kopyasını farklı bir veritabanı sistemine taşımak.",
  ],
},
{
  id: 11,
  text: "Soru 11 \nBir e-posta pazarlama kampanyasının başarısını ölçüyorsunuz. Açıktır ki tıklama oranı (CTR) kampanyanın başarısının önemli bir göstergesidir. Ancak, yöneticiniz sadece CTR'ye bakmanın yeterli olmadığını iddia ediyor ve daha sağlam bir metrik önermenizi istiyor. Hangi metrik, sadece açılma ve tıklanma sayısından daha derin bir etkiyi ölçer?",
  options: [
    "Bounce Rate (Hemen Çıkma Oranı): E-postadan gelen kullanıcıların sitede hemen ayrılma oranı.",
    "Spam Şikayet Oranı: E-postayı spam olarak işaretleyen kullanıcıların oranı.",
    "Unsubscribe Rate (Abonelikten Çıkma Oranı): Kampanya sonrası listeden çıkan kullanıcıların oranı.",
    "Goal Conversion Rate (Hedef Dönüşüm Oranı): E-postadan gelip, belirlenen bir satın alma veya kayıt hedefini tamamlayan kullanıcıların oranı.",
    "Açılma Oranı (Open Rate): Gönderilen e-postaların kaç tanesinin açıldığının yüzdesi.",
  ],
},
{
  id: 12,
  text: "Soru 12 \nBir Tahmin Modeli oluşturuyorsunuz. Modeliniz eğitim verilerinde %99 doğruluk gösteriyor, ancak gerçek dünyadan gelen yeni verilerde bu doğruluk %60'a düşüyor. Bu durum, modelinizin hangi temel problemi yaşadığını gösterir?",
  options: [
    "Underfitting (Eksik Öğrenme): Model, eğitim verisindeki genel trendi bile öğrenememiştir.",
    "Data Leakage (Veri Sızıntısı): Test verisi yanlışlıkla eğitim verisine karışmıştır.",
    "Overfitting (Aşırı Uyum): Model, eğitim verisindeki gürültüyü ve rastlantısal desenleri ezberlemiştir, genelleme yeteneği kaybolmuştur.",
    "Feature Scaling (Özellik Ölçeklendirme) Eksikliği: Veri özellikleri doğru şekilde normalleştirilmemiştir.",
    "Bias (Yanlılık): Eğitim verisi, temsil etmesi gereken gerçek dünya popülasyonunu yeterince yansıtmamaktadır.",
  ],
},
{
  id: 13,
  text: "Soru 13 \nBir sunucu odasındaki kritik bir veritabanı sunucusunu yönetiyorsunuz. Bu sunucunun donanımsal bir arıza nedeniyle çökmesi durumunda sistemin işleyişini aksatmamasını sağlamak için uygulayacağınız en temel ve hayati altyapı stratejisi ne olur?",
  options: [
    "Sunucunun her gün, geceleri otomatik olarak yeniden başlatılmasını planlamak.",
    "Sunucunun her saat başı tüm veriyi harici bir diske yedeklemesini sağlamak (Backup).",
    "Aynı veritabanı yazılımını, aynı verinin kopyasıyla birlikte çalışan ikinci bir sunucu (Replication/Failover) kurmak.",
    "Sunucunun işlemci ve bellek kullanımını sürekli izleyen bir araç kurmak.",
    "Veritabanı sunucusunun yerine, tüm verileri bir depolama alanına (Storage Area Network) taşımak.",
  ],
},
{
  id: 14,
  text: "Soru 14 \nUygulamanızın kullanıcı sayısı beklenenin çok üzerinde artıyor ve tek bir sunucu artık tüm isteklere yetişemiyor. Uygulamanızın mimarisini, kullanıcı sayısındaki gelecekteki artışlara kolayca uyum sağlayacak şekilde \"yatay olarak ölçeklenebilir\" (Horizontally Scalable) kılmak için ilk hangi adımı atarsınız?",
  options: [
    "Mevcut sunucunun CPU ve RAM'ini yükseltmek (Dikey Ölçekleme).",
    "Uygulamayı tamamen mikro hizmetlere (microservices) dönüştürmek.",
    "Uygulamanın durumsuz (Stateless) hale getirilmesini sağlamak ve isteği birden fazla sunucuya dağıtmak için bir Yük Dengeleyici (Load Balancer) eklemek.",
    "Veri tabanını, sunucuyu yormaması için farklı bir konuma taşımak.",
    "Tüm statik içerikleri (resimler, CSS dosyaları) bir İçerik Dağıtım Ağı (CDN) üzerinden sunmaya başlamak.",
  ],
},
{
  id: 15,
  text: "Soru 15 \nBir bulut bilişim ortamında (Cloud Environment) bir e-posta bildirim hizmeti çalıştırıyorsunuz. Hizmet, günün büyük bir bölümünde boştadır ve sadece belirli saatlerde (örneğin, 09:00 ve 18:00) yoğun e-posta trafiği yaşar. Maliyetleri düşürmek için hangi altyapı stratejisini benimsemelisiniz?",
  options: [
    "Hizmeti, en yüksek trafik saatine göre boyutlandırılmış, 7/24 çalışan bir sanal sunucuda (VM) tutmak.",
    "Hizmeti, sadece ihtiyaç duyulduğunda otomatik olarak başlatılıp, işi bittiğinde kapanan sunucusuz bir fonksiyona (Serverless Function) dönüştürmek.",
    "Hizmeti, daha az güçlü ama daha ucuz bir sunucuya taşımak.",
    "E-posta bildirimlerinin yoğun saatlerde gönderilmesini kısıtlamak.",
    "Hizmetin çalıştırıldığı VM'yi, sadece yoğun saatlerde açıp manuel olarak geri kalan zamanda kapatmak.",
  ],
},
{
  id: 16,
  text: "Soru 16 \nBir kullanıcının web tarayıcısından sunucunuza güvenli ve şifreli veri göndermesini sağlamak için hangi protokolün kullanılması esastır?",
  options: [
    "HTTP",
    "FTP",
    "SMTP",
    "HTTPS",
    "SSH",
  ],
},
{
  id: 17,
  text: "Soru 17 \nYeni bir yazılımı üretim ortamına (Production Environment) dağıtmadan önce, yazılımın beklenen yük altında çalışıp çalışmayacağını test etmek istiyorsunuz. Bu amaçla yapılması gereken en uygun test türü nedir?",
  options: [
    "Unit Testing (Birim Testi): Kodun küçük parçalarının doğru çalışıp çalışmadığını kontrol etmek.",
    "Smoke Testing (Duman Testi): En temel işlevlerin çalışıp çalışmadığını hızlıca kontrol etmek.",
    "Load Testing (Yük Testi): Sisteme aynı anda binlerce kullanıcı isteği göndererek performans ve istikrarını ölçmek.",
    "Regression Testing (Regresyon Testi): Yeni bir değişiklikten sonra eski işlevlerin bozulup bozulmadığını kontrol etmek.",
    "Integration Testing (Entegrasyon Testi): Farklı modüllerin birbirleriyle doğru şekilde iletişim kurup kurmadığını kontrol etmek.",
  ],
},
{
  id: 18,
  text: "Soru 18 \nBir ağ üzerindeki cihazlar arasında büyük dosyaların hızlı ve güvenilir bir şekilde transfer edilmesini sağlamak istiyorsunuz. Hangi yöntem, dosya transfer hızını artırmak ve ağ üzerindeki yükü azaltmak için dosyanın kendisini değiştirmeden en etkili şekilde kullanılabilir?",
  options: [
    "Dosyayı sıkıştırıp (compression) göndermek.",
    "Transfer sırasında dosyayı daha küçük parçalara bölmek (chunking) ve bu parçaları paralel olarak göndermek.",
    "Dosyanın kopyasını, gönderimden önce hedef makinaya manuel olarak yüklemek.",
    "Transfer sırasında kullanılan ağ kablosunu daha uzun bir kabloyla değiştirmek.",
    " Ağdaki tüm cihazların sadece bu dosya transferi süresince başka bir işlem yapmasını engellemek.",
  ],
},
{
  id: 19,
  text: "Soru 19 \nKullanıcılarınızın parolalarını saklarken, bir güvenlik ihlali durumunda bile parolaların çalınmasını en zor hale getirecek yöntem hangisidir?",
  options: [
    "Parolaları, standart bir şifreleme algoritması (örneğin AES) ile şifreleyip bir veritabanında saklamak.",
    "Parolaları, her birine rastgele bir değer (salt) ekleyip, ardından SHA-256 gibi tek yönlü bir hash algoritması ile karıştırıp saklamak.",
    "Parolaları, sadece sunucunun kendisinin erişebileceği bir metin dosyasına şifresiz olarak kaydetmek.",
    "Parolaları bir veritabanı tablosuna, tamamen şifresiz metin (plaintext) olarak kaydetmek.",
    "Parolaları, kullanıcı adının bir parçası ile birlikte birleştirip, sadece hash'leyerek saklamak.",
  ],
},
{
  id: 20,
  text: "Soru 20 \nBir web sitesinin giriş formunda, kullanıcı adının bir kod parçası (örneğin <script>alert('XSS')</script>) girmesini engelleyen bir güvenlik mekanizması tasarlıyorsunuz. Bu tür bir saldırıyı (XSS - Cross-Site Scripting) önlemek için kullanıcı girdisine yapmanız gereken temel işlem nedir?",
  options: [
    "Girdiyi, yalnızca rakam ve harf içermesi için zorunlu kılmak.",
    "Girdiyi, veritabanına kaydetmeden önce şifrelemek.",
    "Girdideki tüm özel HTML karakterlerini (örneğin <, >) onların HTML varlıklarına (&lt;, &gt;) dönüştürmek (Escaping).",
    "Girdinin 50 karakterden uzun olmasını engellemek.",
    "Girdiyi, kullanıcıya göstermeden önce yalnızca sunucuda saklamak.",
  ],
},
{
  id: 21,
  text: "Soru 21 \nBir uygulama, dışarıdan gelen bir kullanıcının kimliğini doğrulamak için bir token (jeton) kullanıyor. Bu tokenin süresi dolduğunda (expired) kullanıcının otomatik olarak oturumunu kapatmak ve yeni bir oturum açmasını istemek, hangi güvenlik prensibini destekler?",
  options: [
    "Non-repudiation (İnkar Edilemezlik): Kullanıcının yaptığı eylemi sonradan inkar edememesini sağlamak.",
    "Confidentiality (Gizlilik): Verinin yetkisiz kişilere karşı korunması.",
    "Least Privilege (En Az Yetki Prensibi): Kullanıcıya sadece işini yapmak için ihtiyacı olan yetkiyi vermek.",
    "Session Management (Oturum Yönetimi): Oturumların yaşam döngüsünü kontrol ederek, eski veya çalınmış tokenlerin kullanımını önlemek.",
    "Integrity (Bütünlük): Verinin yetkisiz kişiler tarafından değiştirilmediğini garanti etmek.",
  ],
},
{
  id: 22,
  text: "Soru 22 \nBir güvenlik açığı (vulnerability) tespit ettiniz: Veri tabanınızdaki hassas müşteri bilgileri, sistemdeki bir hata nedeniyle düz metin (plaintext) olarak görünür hale gelme riski taşıyor. Bu kritik durumda ilk yapmanız gereken nedir?",
  options: [
    "Hemen hatayı düzeltmek için kod yazmaya başlamak ve düzelttikten sonra kimseye haber vermemek.",
    "Kritik verilerin erişimini geçici olarak kesmek, üst yönetime ve ilgili ekiplere (hukuk, iletişim) durumu acilen bildirmek ve bir düzeltme planı yapmak.",
    "Veritabanındaki tüm verileri hemen silmek ve sıfırdan başlamak.",
    "Durumu izlemek ve hiçbir sızıntı gerçekleşmezse kimseye haber vermemek.",
    "Sistemin savunma duvarı (Firewall) ayarlarını daha katı hale getirmek.",
  ],
},
{
  id: 23,
  text: "Soru 23 \nSaldırgan perspektifinden bakıldığında, bir web uygulamasının güvenlik açıklarını keşfetmeye çalışıyorsunuz. Başarılı bir SQL Enjeksiyonu (SQL Injection) saldırısı gerçekleştirmek için öncelikle hangi kodlama hatasını ararsınız?",
  options: [
    "HTML'de CSS sınıflarının yanlış kullanılması.",
    "Kullanıcıların parolalarının çok kısa olmasına izin verilmesi.",
    "JavaScript kodunun bir hataya neden olması.",
    "Sunucunun, istemciye HTTP 404 hatası göndermesi.",
    "Kullanıcıdan gelen girdilerin (input) doğrudan SQL sorgularında kullanılması ve temizlenmemesi (sanitization).",
  ],
},
{
  id: 24,
  text: "Soru 24 \nBir şirketin dahili ağından dışarıya izinsiz veri sızdırılmasını önlemek istiyorsunuz. Bu tür bir sızıntıyı tespit etmek ve engellemek için tasarlanmış ana güvenlik aracı hangisidir?",
  options: [
    "Intrusion Detection System (IDS): İzinsiz girişleri tespit eden sistem.",
    "Firewall: Ağ trafiğini kurallara göre filtreleyen sistem.",
    "Anti-virüs Yazılımı: Bilgisayarlardaki kötü amaçlı yazılımları tespit eden sistem.",
    "Virtual Private Network (VPN): Uzak kullanıcıların ağa güvenli bağlanmasını sağlayan sistem.",
    "Data Loss Prevention (DLP) Sistemi: Hassas verinin ağdan veya cihazlardan ayrılmasını izleyen ve engelleyen sistem.",
  ],
},
{
  id: 25,
  text: "Soru 25 \nBir yazılım projesinde, geliştiriciler kod kalitesine odaklanmak isterken, proje yöneticisi mümkün olduğunca çok özelliği kısa sürede teslim etme baskısı yapıyor. Bu çatışmayı yönetmek için hangi yaklaşım en dengeli çözümü sunar?",
  options: [
    "Kod kalitesini tamamen göz ardı ederek sadece hızlı teslimata odaklanmak.",
    "Her sprintin (döngünün) bir kısmını (örneğin %20'sini) teknik borcu (technical debt) temizlemeye ve refaktör etmeye ayırarak, kalan zamanda özellik geliştirmeye odaklanmak.",
    "Proje yöneticisine, kod kalitesinin önemli olmadığını söylemek.",
    "Geliştiricilerin, proje yöneticisinden bağımsız olarak kendi hızlarında çalışmalarını sağlamak.",
    "Tüm kod kalitesi tartışmasını, projenin tamamlanmasından sonraki bakım aşamasına ertelemek.",
  ],
},
{
  id: 26,
  text: "Soru 26 \nÖnemli bir müşteri, yazılımınızın \"verileri yanlış gösterdiğini\" iddia ediyor. Kendi testlerinizde bir sorun bulamadınız. Müşteriyle olan iletişimi en verimli ve objektif şekilde yönetmek için ilk adımınız ne olmalıdır?",
  options: [
    "Müşteriden, sorunun nasıl oluştuğunu (hangi adımları izlediğini, hangi verileri gördüğünü) adım adım gösteren ekran görüntüleri veya video talep etmek.",
    "Müşteriye test sonuçlarınızı gönderip yanıldığını söylemek.",
    "Müşterinin hesap erişimini geçici olarak askıya almak.",
    "Müşterinin verilerine dokunmadan, tüm veri tabanını sıfırlamak.",
    "Müşterinin sorunuyla ilgili genel bir \"biliyoruz, düzeltiyoruz\" e-postası göndermek.",
  ],
},
{
  id: 27,
  text: "Soru 27 \nYeni bir özellik geliştirdiniz. Bu özelliği, önce küçük bir kullanıcı grubunda test etmek ve herhangi bir sorun olursa hızla geri alabilmek (rollback) istiyorsunuz. Bu süreç için en uygun Dağıtım Stratejisi (Deployment Strategy) hangisidir?",
  options: [
    "Blue/Green Deployment: Tüm trafiği aniden yeni sürüme geçirmek.",
    "Canary Deployment: Yeni sürümü, trafiğin küçük bir yüzdesine (örneğin %5) açmak, izlemek ve sorun yoksa kademeli olarak artırmak.",
    "All-at-once (Hepsi Aynı Anda): Özelliği tüm kullanıcılara aynı anda dağıtmak.",
    "Manual Deployment (Manuel Dağıtım): Her sunucuya manuel olarak kurmak.",
    "Dark Launch (Karanlık Lansman): Özelliği arka planda tüm kullanıcılara dağıtmak, ancak kullanıcılara görünür hale getirmemek.",
  ],
},
{
  id: 28,
  text: "Soru 28 \nBir hesaplama modülündeki hatayı arıyorsunuz. Modül, 10 farklı parametre alıyor ve 5 farklı sonuç üretiyor. Tüm olası girdi kombinasyonlarını test etmek pratik değil. Hata bulma şansınızı artırmak için hangi test stratejisini kullanırsınız?",
  options: [
    "Boundary Value Analysis (Sınır Değer Analizi): Her bir parametrenin minimum, maksimum ve bu değerlere yakın uç noktalarını girdi olarak kullanmak.",
    "Random Testing (Rastgele Test Etme): Tamamen rastgele girdi değerleri üretmek.",
    "Maximum Coverage Testing (Maksimum Kapsam Testi): Her bir kod satırının bir kez çalışmasını sağlamaya odaklanmak.",
    "End-user Testing (Son Kullanıcı Testi): Modülü son kullanıcıya verip ne olduğunu görmek.",
    "Security Testing (Güvenlik Testi): Modülün sadece güvenlik açıklarını test etmek.",
  ],
},
{
  id: 29,
  text: "Soru 29 \nProjeniz iki hafta içinde teslim edilmeli, ancak en önemli ve karmaşık özellik hala bitmedi. Geri kalan tüm görevler tamamlandı. Takımınız tükenmiş durumda. Proje yöneticisi olarak bu durumu nasıl yönetirsiniz?",
  options: [
    "Takıma, en karmaşık özelliği bitirene kadar fazla mesai yapmalarını emretmek.",
    "Projenin teslim tarihini, müşteriye bilgi vermeden iki hafta ileriye kaydırmak.",
    "Özellikleri tamamlanmamış haliyle teslim etmek ve hatalı olduğunu ummak.",
    "Müşteriyle görüşerek, yalnızca en önemli özelliğin kritik kısımlarını içeren bir \"Minimum Uygulanabilir Ürün\" (MVP) teslimatını ve geri kalanın bir sonraki aşamaya bırakılmasını müzakere etmek.",
    "En karmaşık özellikten tamamen vazgeçmek ve teslimat tarihini korumak.",
  ],
},
{
  id: 30,
  text: "Soru 30 \nAşağıdaki görev tanımlarından hangisi size mesleki açıdan en çok çekici gelmektedir?",
  options: [
    "Geliştirme ekibiyle yakın çalışarak yazılımın temiz ve bakımı kolay bir kod yapısına sahip olmasını sağlamak.",
    "Büyük veri kümelerini analiz ederek iş süreçlerini optimize edecek yeni öngörüler (insights) bulmak.",
    "Sürekli olarak değişen bir tehdit ortamında sistemlerin zayıf noktalarını tespit etmek ve saldırıları önleyici mekanizmalar geliştirmek.",
    "Farklı paydaşlar (geliştirici, tasarımcı, müşteri) arasındaki koordinasyonu sağlamak ve projenin bütçe/zaman çizelgesine uygun ilerlemesini yönetmek.",
    "Şirket içindeki tüm cihazların ve ağların sorunsuz çalışmasını sağlamak için donanım ve yazılım kurulumlarını yönetmek.",
  ],
},
];


const introSection = document.getElementById("intro-section");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");

const questionTextEl = document.getElementById("question-text");
const optionsEl = document.getElementById("options");
const progressTextEl = document.getElementById("question-text-num") || document.getElementById("progress-text");
const percentTextEl = document.getElementById("percent-text");
const progressBarInnerEl = document.getElementById("progress-bar-inner");
const errorMessageEl = document.getElementById("error-message");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");

const resultScoreEl = document.getElementById("result-score");
const resultSummaryEl = document.getElementById("result-summary");
const resultTagEl = document.getElementById("result-tag");

let currentQuestionIndex = 0;
const answers = new Array(questions.length).fill(null);

/** Toplam test süresi (ms). Sitedeki “~30 dk” metniyle uyumlu. */
const TEST_DURATION_MS = 30 * 60 * 1000;
/** Kalan süre bu değerin altına inince uyarı gösterilir. */
const WARNING_REMAINING_MS = 5 * 60 * 1000;

let quizEndTime = null;
let fiveMinWarningShown = false;
let timerIntervalId = null;

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
  if (remain <= WARNING_REMAINING_MS && remain > 0) {
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
    if (!fiveMinWarningShown && remain <= WARNING_REMAINING_MS) {
      fiveMinWarningShown = true;
      if (timerWarningBannerEl) timerWarningBannerEl.classList.remove("hidden");
      saveState();
    }
  };
  tick();
  timerIntervalId = setInterval(tick, 1000);
}

function startTest() {
  stopQuizTimer();
  quizEndTime = Date.now() + TEST_DURATION_MS;
  fiveMinWarningShown = false;
  if (timerWarningBannerEl) timerWarningBannerEl.classList.add("hidden");

  // Giriş ekranını kapat, testi göster
  introSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  quizSection.classList.remove("hidden");

  currentQuestionIndex = 0;
  for (let i = 0; i < answers.length; i++) answers[i] = null;
  saveState();
  renderQuestion();
  updateProgress();
  startQuizTimer();
}


function renderQuestion() {
    const q = questions[currentQuestionIndex];
    questionTextEl.textContent = q.text;

    optionsEl.innerHTML = "";

    // Düzeltilmiş renderQuestion fonksiyonu: A/B/C/D yapısını ve value değerini doğru atar
    q.options.forEach((optionText, index) => {
        const optionLetter = optionLabels[index];
        const soruName = `Q${q.id}`;
        const uniqueId = `${soruName}_${optionLetter}`;

        const isChecked = answers[currentQuestionIndex] === optionLetter;

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
  const totalQuestions = questions.length;
  progressTextEl.textContent = `Soru ${questionNumber} / ${totalQuestions}`;

  const answeredCount = answers.filter((v) => v !== null).length;
  const percentage = Math.round((answeredCount / totalQuestions) * 100);
  percentTextEl.textContent = `${percentage}%`;
  progressBarInnerEl.style.width = `${percentage}%`;
}

function showError(message) {
  errorMessageEl.textContent = message;
  errorMessageEl.classList.remove("hidden");
}

const STORAGE_KEY = "it_yetenek_testi_state_v1";

function saveState() {
  try {
    const payload = { answers, currentQuestionIndex };
    if (quizEndTime != null) {
      payload.quizEndTime = quizEndTime;
      payload.fiveMinWarningShown = fiveMinWarningShown;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {}
}

/** @returns {"active"|"expired"|null} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed.answers) && parsed.answers.length === answers.length) {
      for (let i = 0; i < answers.length; i++) answers[i] = parsed.answers[i];
    }

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
    localStorage.removeItem(STORAGE_KEY);
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
    const currentQName = `Q${questions[currentQuestionIndex].id}`;
    const selected = document.querySelector(`input[name="${currentQName}"]:checked`);
    
    if (!selected) {
      // DOM'da name'i dinamik olarak (Q1, Q2) atadık.
        showError("Devam etmek için bir seçenek işaretlemen gerekiyor.");
        return;
    }
    // Seçilen değeri HARF (String) olarak yakala 
    const selectedValue = selected.value; 
    answers[currentQuestionIndex] = selectedValue;

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex += 1;
        saveState();
        renderQuestion();
        updateProgress();
    } else {
        // Test bitti
        showResults();
    }
}

function showResults() {
  stopQuizTimer();
  quizEndTime = null;
  fiveMinWarningShown = false;
  if (timerWarningBannerEl) timerWarningBannerEl.classList.add("hidden");
  saveState();

  // ➜ Test bittikten sonra "Analiz Sonucunu Gör" butonunu aç
  afterQuizActions.classList.remove("hidden");

    quizSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    // **DÜZELTME 3: Ağırlıklandırma matrisi ile gerçek skorları hesapla**
    const kategoriSkorlari = skorlariHesapla(answers, AGIRLIKLANDIRMA_MATRISI, DOGRU_CEVAPLAR);

    // En yüksek skoru ve kategoriyi bul
    let enYuksekSkor = -1;
    let enGucluKategoriKodu = null;

    for (const kategoriKodu in kategoriSkorlari) {
        if (kategoriSkorlari[kategoriKodu] > enYuksekSkor) {
            enYuksekSkor = kategoriSkorlari[kategoriKodu];
            enGucluKategoriKodu = kategoriKodu;
        }
    }
    
    const enGucluKategoriAdi = KATEGORILER[enGucluKategoriKodu] || "Belirlenemedi";

    // Sonuçların gösterilmesi (Grafik için ayrı bir fonksiyon önerilir)
    resultScoreEl.textContent = `En Yüksek Yetkinlik Alanınız: ${enGucluKategoriAdi}`;
    
    let summary = `Problem çözme yaklaşımınız ve eğiliminiz en çok <strong>${enGucluKategoriAdi}</strong> alanındaki görevlerle örtüşmektedir. Toplam Skorlar:`;
    
    // Her kategorinin puanını özette listele
    for (const kategoriKodu in kategoriSkorlari) {
        const ad = KATEGORILER[kategoriKodu];
        const skor = kategoriSkorlari[kategoriKodu].toFixed(2);
        summary += `<br/>- ${ad}: ${skor} Puan`;
    }
    
    resultSummaryEl.innerHTML = summary;
    resultTagEl.textContent = enGucluKategoriAdi;

    // --- Profil + skor verisini birleştirip kaydet ---
    saveResultWithProfile(kategoriSkorlari, enGucluKategoriAdi);

    // --- Sonuç ekranında profil çiplerini göster ---
    renderResultProfileRow();
}

/**
 * Mevcut profili (currentProfile) ve hesaplanan kategori skorlarını
 * RESULTS_KEY'deki diziye ekler. Her çalıştırmada aynı profil kaydını
 * günceller (startedAt ile eşleşme).
 */
function saveResultWithProfile(kategoriSkorlari, enGucluKategori) {
  // Profili localStorage'dan yükle (sayfa yenilenmiş olabilir)
  if (!currentProfile) {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) currentProfile = JSON.parse(raw);
    } catch {}
  }

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

  const entry = {
    nickname        : currentProfile?.nickname  || "anonim",
    egitim          : currentProfile?.egitim    || "",
    bolum           : currentProfile?.bolum     || "",
    startedAt       : currentProfile?.startedAt || null,
    completedAt     : new Date().toISOString(),
    enGucluKategori : enGucluKategori,
    kategoriler     : KATEGORILER,
    skorlar         : kategoriSkorlari,
    skorlarYuzde    : skorYuzde,
  };

  const all = getAllResults();
  // Aynı startedAt varsa üzerine yaz, yoksa ekle
  const idx = all.findIndex(r => r.startedAt && r.startedAt === entry.startedAt);
  if (idx >= 0) all[idx] = entry; else all.push(entry);
  saveAllResults(all);

  // Aktif profil kaydını temizle
  try { localStorage.removeItem(PROFILE_KEY); } catch {}

  // Firestore'a da gönder (db null ise sessizce atla)
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

startBtn.addEventListener("click", openRegModal);
nextBtn.addEventListener("click", handleNext);


optionsEl.addEventListener("change", (e) => {
  const t = e.target;
  if (!(t instanceof HTMLInputElement)) return;
  if (t.type !== "radio") return;

  // Anında kaydet
  answers[currentQuestionIndex] = t.value;
  syncSelectedUI();
  updateProgress();
  saveState();
});


// --- SKOR HESAPLAMA FONKSİYONU (Eksik olan kısım buraya eklendi) ---
function skorlariHesapla(kullaniciCevaplari, matris, dogruCevaplar) {
    const skorlar = { "SD": 0.0, "DM": 0.0, "IM": 0.0, "CS": 0.0, "PM": 0.0 };
    
    // Kullanıcının cevaplarını (answers dizisi) döngüye alıyoruz
    for (let i = 0; i < questions.length; i++) {
        const soruNo = `Q${questions[i].id}`; // Örn: Q1, Q2, ..., Q30
        const secilenCevap = kullaniciCevaplari[i]; // Örn: "A", "B", null

        if (!secilenCevap) continue; // Cevaplanmamışsa atla
        
        let agirlikKey = soruNo;
        let skorEkle = false;

        // Q30 (Yönelim Sorusu)
        if (soruNo === "Q30") {
            agirlikKey = `Q30_${secilenCevap}`; // Örn: Q30_C
            if (matris[agirlikKey]) {
                skorEkle = true; 
            }
        } 
        // Q1'den Q29'a kadar olan Yetenek Soruları
        else if (dogruCevaplar[soruNo] === secilenCevap) {
            skorEkle = true; // Sadece doğru cevap verildiğinde puan katar
        }

        // Skorları Toplama
        if (skorEkle && matris[agirlikKey]) {
            for (const kategoriKodu in skorlar) {
                // Matristeki ağırlığı ilgili kategori skoruna ekle
                skorlar[kategoriKodu] += matris[agirlikKey][kategoriKodu] || 0.0;
            }
        }
    }

    return skorlar;
}



const afterQuizActions = document.getElementById("after-quiz-actions");
const showResultBtn = document.getElementById("show-result-btn");
// testi bitirince sonucu gösterme butonuna basılacak

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
    resultSection.classList.add("hidden");
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
  tryResumeQuiz();
});

// ============================================================
// KAYIT (REGISTRATION) MODÜLÜ
// ============================================================

/** localStorage anahtarları */
const RESULTS_KEY   = "it_test_results_v1";      // tüm sonuçlar dizisi
const PROFILE_KEY   = "it_test_current_profile_v1"; // aktif kullanıcı profili

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

let currentProfile = null;  // { nickname, egitim, bolum }
let nicknameDebounceTimer = null;

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

// ---------- Nickname benzersizlik kontrolü ----------

function isNicknameTaken(nick) {
  const all = getAllResults();
  const lower = nick.trim().toLowerCase();
  return all.some(r => r.nickname && r.nickname.toLowerCase() === lower);
}

// ---------- Modal DOM referansları ----------

let regOverlay, regForm, inputNickname, nicknameStatus, nicknameMsg,
    inputEgitim, egitimMsg, inputBolum, bolumMsg,
    bolumTrigger, bolumDisplay, bolumDropdown, bolumSearchInput, bolumList,
    regSubmitBtn;

function initRegModule() {
  regOverlay        = document.getElementById("reg-overlay");
  regForm           = document.getElementById("reg-form");
  inputNickname     = document.getElementById("input-nickname");
  nicknameStatus    = document.getElementById("nickname-status");
  nicknameMsg       = document.getElementById("nickname-msg");
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
  if (isNicknameTaken(nick)) {
    setNicknameState("error", "Bu takma ad zaten kullanılmış. Başka bir tane dene.");
    return false;
  }
  setNicknameState("ok", "Kullanılabilir.");
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
  regForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    const nickOk = validateNickname(inputNickname.value);
    if (!nickOk) ok = false;

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

    // Profili kaydet
    currentProfile = {
      nickname : inputNickname.value.trim(),
      egitim   : inputEgitim.value,
      bolum    : inputBolum.value,
      startedAt: new Date().toISOString(),
    };
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(currentProfile)); } catch {}

    closeRegModal();

    // Smooth geçiş: modal kapanma animasyonu bitmeden test başlamasın
    setTimeout(() => {
      document.body.style.overflow = "";
      startTest();
    }, 240);
  });
}
