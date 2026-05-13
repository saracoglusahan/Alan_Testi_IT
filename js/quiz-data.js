/**
 * 5 temel alan + uzmanlık ağacı ve uzmanlık soru setleri.
 * Yazılım geliştirme (SD) için her alt alan ayrı soru bankası;
 * diğer temel alanlarda şimdilik alan bazında ortak kısa set (seçilen uzmanlık başlığı sonuçta gösterilir).
 */

export const UZMANLIK_YAPISI = [
  {
    code: "SD",
    label: "Yazılım Geliştirme",
    specialties: [
      { id: "fullstack", label: "Fullstack Developer" },
      { id: "game", label: "Oyun Geliştirme (Game Development)" },
      { id: "mobile", label: "Mobil Geliştirme (Mobile Development)" },
      { id: "qa", label: "Test / Kalite Güvence (QA / Test Engineering)" },
      { id: "architect", label: "Yazılım Mimarı (Software Architect)" },
    ],
  },
  {
    code: "DS-AI",
    label: "Veri Bilimi ve Yapay Zeka",
    specialties: [
      { id: "ml", label: "Makine Öğrenmesi (ML + Derin Öğrenme)" },
      { id: "nlp", label: "Doğal Dil İşleme (NLP)" },
      { id: "de", label: "Veri Mühendisliği" },
      { id: "bi", label: "İş Zekâsı (BI)" },
      { id: "stats", label: "İstatistik" },
      { id: "mlops", label: "MLOps" },
    ],
  },
  {
    code: "CS-NET",
    label: "Siber Güvenlik ve Ağ",
    specialties: [
      { id: "pentest", label: "Sızma Testi (Pentest)" },
      { id: "soc", label: "SOC" },
      { id: "crypto", label: "Kriptografi" },
      { id: "net", label: "Ağ Güvenliği ve Altyapı" },
      { id: "forensics", label: "Adli Bilişim" },
      { id: "appsec", label: "Uygulama Güvenliği (AppSec)" },
    ],
  },
  {
    code: "IS-MT",
    label: "Bilişim Sistemleri ve BT Yönetimi",
    specialties: [
      { id: "erp", label: "ERP" },
      { id: "itil", label: "ITIL / Hizmet Yönetimi" },
      { id: "pm", label: "Proje Yönetimi" },
      { id: "ea", label: "Kurumsal Mimari" },
      { id: "crm", label: "CRM" },
    ],
  },
  {
    code: "CL-DN",
    label: "Bulut, Altyapı ve DevOps",
    specialties: [
      { id: "cloud", label: "AWS / Azure / Bulut Mimari" },
      { id: "k8s", label: "Kubernetes" },
      { id: "blockchain", label: "Blockchain / Web3" },
      { id: "edge", label: "Edge Bilişim" },
      { id: "cdn", label: "CDN ve İçerik Dağıtımı" },
    ],
  },
];

/** Ana testteki soru kimliğine göre temel alan testinde kullanılacak soru sırası */
export function getDomainQuestionIndices(domainCode, allQuestions, matrix) {
  const scored = allQuestions.map((q) => {
    const key = `Q${q.id}`;
    const row = matrix[key];
    if (!row) return { q, w: 0, isPrimary: false };
    const w = row[domainCode] || 0;
    const maxW = Math.max(...Object.values(row));
    const isPrimary = Math.abs(w - maxW) < 1e-9 && w > 0;
    return { q, w, isPrimary };
  });
  const primaries = scored.filter((s) => s.isPrimary).sort((a, b) => b.w - a.w);
  const others = scored.filter((s) => !s.isPrimary).sort((a, b) => b.w - a.w);
  const ordered = [...primaries, ...others];
  const seen = new Set();
  const out = [];
  for (const s of ordered) {
    if (!seen.has(s.q.id)) {
      seen.add(s.q.id);
      out.push(s.q.id);
    }
  }
  return out.slice(0, 10);
}

function qBlock(text, options, correctLetter) {
  return { text, options, correctLetter };
}

const SD_BANK = {
  fullstack: [
    qBlock(
      "Fullstack · Bir REST uç noktası hem web istemcisi hem mobil istemci tarafından kullanılacak. Oturum yönetimini sunucu tarafında paylaşırken en sürdürülebilir yaklaşım hangisidir?",
      [
        "Her istemci tipi için ayrı veritabanı şeması",
        "JWT veya benzeri taşınabilir oturum belirteci + ortak yetkilendirme katmanı",
        "Yalnızca çerez tabanlı oturum; mobilde aynı davranışı taklit etmek",
        "Oturum durumunu yalnızca istemci localStorage içinde saklamak",
        "Sunucu başına tek kullanıcı kilidi",
      ],
      "B",
    ),
    qBlock(
      "Fullstack · SSR ile kodlanmış bir sayfada ilk boyama süresini iyileştirmek istiyorsunuz; veri getirme paralel ama kritik içerik için suistimal riski var. Ne yaparsınız?",
      [
        "Tüm veriyi istemci tarafında useEffect ile yüklemek",
        "Kritik veriyi sunucuda çözüp stream/ön izleme ile göndermek, ikincil veriyi ertelemek",
        "CDN önbelleğini tüm kullanıcı oturumları için ortaklamak",
        "Hydration'ı kapatıp saf CSR'ye dönmek",
        "Kritik CSS'yi inline etmekten kaçınmak",
      ],
      "B",
    ),
    qBlock(
      "Fullstack · GraphQL şemasında N+1 sorgu problemi ortaya çıktı. En doğru kalıcı çözüm hangisidir?",
      [
        "Tüm resolver'ları senkron tutmak",
        "DataLoader benzeri toplu yükleme / önbellek veya join tabanlı tek sorgu stratejisi",
        "İstemci tarafında sonsuz scroll ile sorunu gizlemek",
        "Şema derinliğini sabit 1 seviyede tutmak",
        "HTTP önbelleğini devre dışı bırakmak",
      ],
      "B",
    ),
    qBlock(
      "Fullstack · Monorepo içinde paylaşılan tip güvenliği (TS) ve paket sürümleri çakışıyor. En dengeli ilk adım?",
      [
        "Her uygulamayı ayrı repoya bölmek",
        "workspace protokolü, tek versiyon politikası ve sınır modülleri (packlets) ile ortak paketleri sabitlemek",
        "Tip kontrolünü kapatmak",
        "Tüm bağımlılıkları en son major sürüme zorlamak",
        "Paylaşımı kopyala-yapıştır ile çözmek",
      ],
      "B",
    ),
    qBlock(
      "Fullstack · Ödeme iş akışında webhooks güvenilirliği sağlanmalı. İmzayı doğrulamadan işlem yapılıyor. Ne eklenmeli?",
      [
        "Webhook URL'lerini robots.txt'te gizlemek",
        "Sağlayıcı imzası + idempotency + tekrar teslimat (retry) koruması",
        "Yalnızca IP allowlist",
        "Webhook'u senkron HTTP çağrısı ile değiştirmek",
        "İstemci tarafı callback",
      ],
      "B",
    ),
  ],
  game: [
    qBlock(
      "Oyun · Deterministik çok oyunculu için simülasyon senkronu seçiyorsunuz. Kısa gecikmede ne tercih edilir?",
      [
        "Her karede tam sunucu otoritesi ve kilitleme adımı (lockstep) — uygun bant genişliğinde",
        "Tüm fizik istemcide serbest; çakışmada son gelen kazanır",
        "Sadece görsel efektleri sunucuya taşımak",
        "UDP'yi tamamen devre dışı bırakıp yalnızca e-posta ile durum almak",
        "Ağ kodunu yalnızca tek oyunculu modda test etmek",
      ],
      "A",
    ),
    qBlock(
      "Oyun · Frame pacing ve VSync etkileşiminde mikro takılmalar var. Profilde GPU bekliyor. İlk adım?",
      [
        "Çözünürlüğü düşürmek ve asset streaming / LOD ile GPU yükünü düzenlemek",
        "VSync'i kapatıp tearing'i göze almak",
        "Fizik adımını kare başına rastgele yapmak",
        "Tüm gölgeleri 4K yapmak",
        "Update ve render'i tek iş parçacığında kilitlemek",
      ],
      "A",
    ),
    qBlock(
      "Oyun · Büyük açık dünyada varlık örneklem (instancing) ve frustum culling birlikte kullanılmalı. Ağaçlar takılıyor. Sorun muhtemelen?",
      [
        "Her ağaç için ayrı draw call ve materyal varyantı patlaması",
        "Çok az poligon",
        "Instancing'in aşırı kullanımı",
        "Sabit zaman adımının olmaması",
        "Yalnızca ses motoru ayarı",
      ],
      "A",
    ),
    qBlock(
      "Oyun · DLC içeriğini ana paketten güvenli ve atomik yüklemek için?",
      [
        "Adreslenebilir varlıklar / paket manifest + imza doğrulama + hot reload stratejisi",
        "Tüm DLC'yi Resources.Load ile derleme içine gömmek",
        "Kullanıcıdan manuel kopyalama istemek",
        "Yalnızca şifresiz ZIP indirmek",
        "Sürüm numarası olmadan CDN kullanmak",
      ],
      "A",
    ),
    qBlock(
      "Oyun · Oyun ekonomisinde hileli hızlandırılmış ilerleme tespiti için?",
      [
        "Yalnızca istemci zaman damgasına güvenmek",
        "Sunucu tarafı oran sınırları, anomali modeli ve kritik ödülleri sunucu doğrulaması",
        "Tüm ödülleri istemci rastgele üretmek",
        "Anti-cheat'i yalnızca tek oyunculu modda çalıştırmak",
        "Log tutmamak",
      ],
      "B",
    ),
  ],
  mobile: [
    qBlock(
      "Mobil · Arka planda konum izni “yalnızca kullanımdayken” istenmeli. iOS/Android için en uyumlu desen?",
      [
        "İlk açılışta tüm izinleri üst üste istemek",
        "Bağlamsal açıklama + aşamalı istek; gereksiz arka plan takibinden kaçınmak",
        "İzni atlayıp UUID ile cihazı sürekli izlemek",
        "Sadece manifest'te yazmak, kullanıcıya göstermemek",
        "Konum olmadan uygulamayı tamamen engellemek",
      ],
      "B",
    ),
    qBlock(
      "Mobil · Bellek baskısı altında liste kaydırmasında GC tetikleniyor. Ne iyileştirilir?",
      [
        "Recycler/List virtualization ve görüntü önbelleği + nesne havuzu",
        "Listeye her öğede yeni büyük bitmap allocate etmek",
        "Tüm listeyi tek seferde DOM'a basmak",
        "Animasyonları dondurmak yerine her karede string birleştirmek",
        "Offline modu kapatmak",
      ],
      "A",
    ),
    qBlock(
      "Mobil · Deep link ve güvenli yönlendirme; şüpheli URL şemaları filtrelenmeli. Temel savunma?",
      [
        "Tüm harici şemaları otomatik kabul",
        "Allowlist, doğrulama ve güvenli geçiş (app links / universal links)",
        "Yalnızca http kullanmak",
        "SSL pinning'i devre dışı bırakmak",
        "Intent'i loglamamak",
      ],
      "B",
    ),
    qBlock(
      "Mobil · Pil tüketimini ölçmek ve regresyonu yakalamak için?",
      [
        "Yalnızca CPU profili",
        "OS pil raporları + arka plan işlerini sınırlama + uyku uyarıları ve ağ/ GPS kullanım kayıtları",
        "Kullanıcıdan pil seviyesini tahmin etmesini istemek",
        "Release modda profil almamak",
        "Wake lock'u sürekli açık tutmak",
      ],
      "B",
    ),
    qBlock(
      "Mobil · Çevrimdışı önbellek senkronu; çakışan düzenlemeler için?",
      [
        "Son yazan her zaman kazanır; uyarı yok",
        "Versiyon vektörü / son yazma zamanı + kullanıcı çözümü veya otomatik birleştirme kuralları",
        "SQLite veritabanını silip baştan indirmek",
        "Yalnızca sunucuya güvenmek",
        "Çakışmayı sessizce atmak",
      ],
      "B",
    ),
  ],
  qa: [
    qBlock(
      "QA · Kritik kullanıcı akışı için test piramidinde en iyi denge?",
      [
        "Yalnızca manuel E2E",
        "Çoğunluk birim + sözleşme/API + seçilmiş E2E dumanı",
        "Sadece yük testi",
        "Tüm ortamda rastgele tıklama",
        "Otomasyonu üretim verisiyle çalıştırmak",
      ],
      "B",
    ),
    qBlock(
      "QA · Kararsız (flaky) test: ağ zaman aşımı. Kalıcı çözüm?",
      [
        "Zaman aşımını 1 sn yapıp geçmek",
        "Deterministik stub, kontrollü bekleme ve izolasyon + paralel çalıştırmada kaynak limiti",
        "Testi @Ignore etmek",
        "Prod veriyle koşmak",
        "Her seferinde tam yeniden başlatmak",
      ],
      "B",
    ),
    qBlock(
      "QA · Yayın öncesi risk matrisinde önceliklendirme için?",
      [
        "En son eklenen özellik her zaman en kritik",
        "Etki × olasılık, kullanım sıklığı ve geri alınabilirlik ile odaklanmış senaryo setleri",
        "Geliştiricinin favori modülü",
        "Sadece UI regresyonu",
        "Test sayısını maksimize etmek",
      ],
      "B",
    ),
    qBlock(
      "QA · Özellik bayrakları (feature flags) ile test stratejisi?",
      [
        "Bayrak kombinasyonlarını denetimsiz üretimde açmak",
        "Bayrak matrisinin küçük bir alt kümesi için otomatik + kademeli açılış (canary)",
        "Tüm bayrakları her zaman aynı anda açmak",
        "Test ortamında bayrak yok saymak",
        "Logları kapatmak",
      ],
      "B",
    ),
    qBlock(
      "QA · Erişilebilirlik (a11y) denetimi CI'de?",
      [
        "Yalnızca ekran görüntüsü karşılaştırma",
        "Kural tabanlı tarayıcı denetimleri + odak sırası ve ekran okuyucu spot kontrolleri",
        "Renk kontrastını tahmin etmek",
        "Klavye ile hiç test etmemek",
        "WCAG'i sadece pazarlama sayfasında uygulamak",
      ],
      "B",
    ),
  ],
  architect: [
    qBlock(
      "Mimari · On yıl ölçeklenecek bir e-ticaret için ilk kararlar. Hangisi en isabetli?",
      [
        "İlk günden 40 mikroservis",
        "Modüler monolit + net sınır + olay güdümlü entegrasyon planı",
        "Tüm iş kurallarını tek stored procedure içinde",
        "Veri modelini sürekli breaking change",
        "Observability'yi sona bırakmak",
      ],
      "B",
    ),
    qBlock(
      "Mimari · İki takım aynı aggregate üzerinde sık çakışıyor. DDD açısından?",
      [
        "Aggregate kökünü bölüp bounded context ve entegrasyon modelini netleştirmek",
        "Tek veritabanı şemasını kilitlemek",
        "Çakışmayı görmezden gelmek",
        "Her takıma kopya tablo",
        "Event sourcing zorunluluğu olmadan tüm geçmişi silmek",
      ],
      "A",
    ),
    qBlock(
      "Mimari · SLA ve hata bütçesi: çok kiracılı SaaS. Öncelik?",
      [
        "Tüm kiracılara aynı noisy neighbor riski",
        "Kiracı başına kotalar, şişme koruması ve bağımsız ölçek birimleri",
        "Yalnızca tek sunucu",
        "Ölçüm olmadan autoscale",
        "Veritabanını paylaşmamak için tek tablo",
      ],
      "B",
    ),
    qBlock(
      "Mimari · Teknik borç portföyünü yönetmek için?",
      [
        "Görünmez tutmak",
        "Ölçülebilir senaryolar, servis seviyesi etki ve kademeli geri ödeme (strangler)",
        "Hepsini rewrite",
        "Sadece lint sayısını izlemek",
        "Refaktör için süre ayırmamak",
      ],
      "B",
    ),
    qBlock(
      "Mimari · Veri yerelliği ve GDPR odaklı tasarım?",
      [
        "Tüm veriyi tek bölgede saklayıp hukuku görmezden gelmek",
        "Bölgesel depolama, minimizasyon, silme/anonimleştirme akışları ve erişim denetimi",
        "Şifreleme olmadan yedeklemek",
        "Kişisel veriyi loglarda serbest bırakmak",
        "Silme taleplerini manuel e-posta ile sınırlamak",
      ],
      "B",
    ),
  ],
};

/** SD dışı alanlar için ortak uzmanlık seti (5 soru) */
const SHARED = {
  "DS-AI": [
    qBlock(
      "Eğitim-üretim sapması için hangi önlem bir bütün olarak en önemlidir?",
      ["Sadece eğitim doğruluğu", "Zaman penceresi, dağılım kayması izleme ve yeniden eğitim tetikleri", "Daha büyük ekran", "Daha fazla hiperparametre", "Veriyi çoğaltmadan artırmak"],
      "B",
    ),
    qBlock(
      "A/B testinde seçim yanlılığını azaltmak için?",
      ["Durdurma kuralı olmadan erken bakmak", "Önceden güç analizi, sabit horizon ve çoklu test düzeltmesi", "Yalnızca dönüşüm oranı", "Tek varyant", "Rastgele örnekleme yapmamak"],
      "B",
    ),
    qBlock(
      "Özellik deposu için veri kalitesini sürdürmek en çok neye dayanır?",
      ["Yalnızca batch ETL", "Şema sözleşmesi, doğrulama, gözlemlenebilirlik ve geri alınabilir iş hatları", "CSV manuel birleştirme", "Tekilleştirmeyi raporda yapmak", "Ham veriyi silmemek"],
      "B",
    ),
    qBlock(
      "MLOps'ta model kaydı ve yeniden üretilebilirlik için kritik olan?",
      ["Kodu e-posta ile göndermek", "Deney izi, artifact hash, bağımlılık kilidi ve değerlendirme metrikleri", "Notebook'u paylaşmak", "GPU markası", "Manuel deploy"],
      "B",
    ),
    qBlock(
      "BI panosunda metrik tanımı çatışması yaşanıyor. İlk adım?",
      ["Her ekibe ayrı pano", "Tek metrik sözlüğü ve veri ürünü sahipliği", "SQL'i gizlemek", "Veriyi çoğaltmak", "ETL'i kapatmak"],
      "B",
    ),
  ],
  "CS-NET": [
    qBlock(
      "Kurumsal VPN sonrası iç ağ keşfi şüphesi için ilk adım?",
      ["Tüm şifreleri anında sıfırlamak", "Etki kapsamını izole etmek, kanıtları korumak ve olay müdahalesi başlatmak", "Sadece antivirüs güncellemesi", "Logları silmek", "IDS kapatmak"],
      "B",
    ),
    qBlock(
      "TLS ile birlikte kimlik doğrulama zayıflığı riski için?",
      ["Sadece TLS", "MFA, cihaz durumu ve oturum uygunluk kontrolleri", "Parola karmaşıklığı yeter", "JWT süresiz", "Public S3"],
      "B",
    ),
    qBlock(
      "AES-GCM kullanımında nonce tekrarı riski nedir?",
      ["Performans kaybı", "Şifre bütünlüğü ve gizliliği ihlali; nonce benzersizliği şart", "Hiçbir şey", "Sadece daha uzun anahtar", "Padding oracle"],
      "B",
    ),
    qBlock(
      "AppSec'de bağımlılık güvenliği için sürekli süreç?",
      ["Yılda bir tarama", "SBOM, otomatik tarama ve yükseltme politikası", "npm trust", "Kodu gözden geçirmemek", "Prod'da debug açık tutmak"],
      "B",
    ),
    qBlock(
      "Zero trust yaklaşımının özü hangisine en yakındır?",
      ["Kurum ağına güven", "Her erişimde kimlik ve bağlam doğrulaması; ağ konumu tek başına yetmez", "Yalnızca firewall", "Şifresiz SSH", "Tek faktör her yerde"],
      "B",
    ),
  ],
  "IS-MT": [
    qBlock(
      "ERP sürecinde paydaş ihtilaflarında hangi çıktı en çok değer katar?",
      ["Bir ekibin talebini doğrudan kodlamak", "Ortak süreç modeli, RACI ve onay noktaları", "Gereksinimsiz geliştirme", "Süresiz pilot", "Test yok"],
      "B",
    ),
    qBlock(
      "ITIL olay yönetiminde öncelik belirleme için?",
      ["İlk gelen", "Etki ve aciliyet matrisi", "Yalnızca kullanıcı sesi", "Rastgele", "Kapalı çağrı"],
      "B",
    ),
    qBlock(
      "Proje üçgeni (kapsam-zaman-maliyet) değişim talebi geldiğinde?",
      ["Gizlice eklemek", "Resmi değişiklik kontrolü ve etki analizi", "Kapsamı sabit sanmak", "Testi atlamak", "İletişimi kesmek"],
      "B",
    ),
    qBlock(
      "Kurumsal mimaride teknoloji standardizasyonu ile inovasyon dengesi?",
      ["Tam serbestlik veya tam kilitleme", "Platform taksonomisi ve deney alanları", "Sadece PowerPoint", "Her proje farklı veritabanı", "Dokümantasyon yok"],
      "B",
    ),
    qBlock(
      "CRM veri kalitesi düşük; satış raporları çelişiyor. Kalıcı çözüm?",
      ["Raporu manuel düzeltmek", "Master data, doğrulama kuralları ve sahiplik", "Tüm alanları zorunlu yapmak", "Çift kayıtları birleştirmemek", "Entegrasyonu kapatmak"],
      "B",
    ),
  ],
  "CL-DN": [
    qBlock(
      "Çok kiracılı bulutta ağ izolasyonu için yaygın temel?",
      ["Tek flat VPC", "Hesap/VPC ayrımı, güvenlik grupları ve özel uç noktalar", "Public subnet her şey", "SSH açık", "Şifresiz API"],
      "B",
    ),
    qBlock(
      "Kubernetes'te Pod kaynak limiti olmadan üretimde risk?",
      ["Yok", "Noisy neighbor, OOM ve planlama belirsizliği", "Sadece log boyutu", "Daha hızlı deploy", "Daha iyi dengeleme"],
      "B",
    ),
    qBlock(
      "Blockchain seçiminde izinli zincir ile kamu zinciri farkı açısından ana mesele?",
      ["Renk", "Güven modeli ve konsensüs maliyeti / gecikmesi", "Dil", "DNS", "CDN"],
      "B",
    ),
    qBlock(
      "Web3 cüzdan imzalama isteği için kullanıcı koruması?",
      ["Sınırsız approve", "İzin kapsamı, simülasyon ve okunabilir işlem özeti", "Seed'i uygulamaya yapıştırmak", "Her bağlantıya tam güven", "Phishing yok saymak"],
      "B",
    ),
    qBlock(
      "Edge dağıtımında tutarlı yapılandırma ve güncelleme için?",
      ["USB ile elle", "OAS/IaC, imzalı artefact ve geri alma", "Rastgele portlar", "Tek sunucu", "Log yok"],
      "B",
    ),
  ],
};

/**
 * @returns {{ title: string, questions: { id:number, text:string, options:string[] }[], dogruCevaplar: Record<string,string> }}
 */
export function getExpertiseQuestionSet(domainCode, expertiseId, specialtyLabel) {
  if (domainCode === "SD") {
    const blocks = SD_BANK[expertiseId];
    if (!blocks) return null;
    const title = specialtyLabel || expertiseId;
    const questions = blocks.map((b, i) => ({
      id: i + 1,
      text: b.text,
      options: b.options,
    }));
    const dogruCevaplar = {};
    blocks.forEach((b, i) => {
      dogruCevaplar[`Q${i + 1}`] = b.correctLetter;
    });
    return { title, questions, dogruCevaplar };
  }
  const shared = SHARED[domainCode];
  if (!shared) return null;
  const title = specialtyLabel || domainCode;
  const questions = shared.map((b, i) => ({
    id: i + 1,
    text: b.text,
    options: b.options,
  }));
  const dogruCevaplar = {};
  shared.forEach((b, i) => {
    dogruCevaplar[`Q${i + 1}`] = b.correctLetter;
  });
  return { title, questions, dogruCevaplar };
}


// --- NEW 30-QUESTION SETS --- 

export const SD_QUESTIONS = [
  {
    id: 2,
    text: "Bir ödeme servisinde istemci bağlantısı koptuğunda kullanıcı aynı ödeme isteğini tekrar gönderebiliyor. Sistem aynı karttan bazen iki kez tahsilat yapıyor, bazen de “ödeme başarısız” görünmesine rağmen banka tarafında tahsilat gerçekleşiyor. Bu sorunu kalıcı çözmek için en kritik tasarım ne olmalıdır?",
    options: [
      "Frontend tarafında ödeme butonunu 10 saniye pasif yapmak",
      "Ödeme isteğini idempotency key, işlem durumu ve dış sağlayıcı mutabakatı ile yönetmek",
      "Kullanıcıya ödeme sonrası sayfayı yenilememesi gerektiğini söylemek",
      "Başarısız dönen tüm ödemeleri otomatik iptal varsaymak"
    ],
    correctLetter: "B",
    measured: "Idempotency, distributed transaction, ödeme mutabakatı."
  },
  {
    id: 3,
    text: "Bir ekip REST API’de GET /orders/cancel?id=123 endpoint’i ile sipariş iptali yapmaktadır. Bir arama motoru botu veya link ön izleme aracı bu URL’leri ziyaret ettiğinde bazı siparişler iptal olmuştur. Bu tasarımda en temel hata nedir?",
    options: [
      "Endpoint’in kısa isimlendirilmesi",
      "GET metodunun yan etkili işlem için kullanılması ve işlem niyetinin güvenli doğrulanmaması",
      "Sipariş ID’sinin query string ile gönderilmesi",
      "API’nin JSON yerine HTML cevap dönmesi"
    ],
    correctLetter: "B",
    measured: "HTTP semantics, güvenli API tasarımı, yan etkili işlem kontrolü."
  },
  {
    id: 4,
    text: "Bir mikroservis mimarisinde sipariş oluşturma işlemi ödeme, stok, kargo ve fatura servislerini sırayla çağırmaktadır. Ödeme başarılı olduktan sonra stok servisi hata verdiğinde sistem bazen yarım kalmış siparişler üretmektedir. Tek bir global transaction kullanmak teknik olarak zor ve maliyetlidir. Bu durumda daha uygun yaklaşım hangisidir?",
    options: [
      "Tüm servisleri aynı veritabanına bağlamak",
      "Saga benzeri telafi edici işlem akışı ve tutarlı durum yönetimi tasarlamak",
      "Stok servisi hata verdiğinde kullanıcıya yine başarı mesajı göstermek",
      "Servisler arası iletişimi tamamen frontend’e taşımak"
    ],
    correctLetter: "B",
    measured: "Saga pattern, eventual consistency, telafi edici işlem."
  },
  {
    id: 5,
    text: "Bir yazılım ekibi aynı iş kuralını hem frontend’de, hem backend’de, hem de farklı mikroservislerde ayrı ayrı uygulamaktadır. Zamanla bazı servislerde kural güncellenmiş, bazılarında eski kalmıştır. Kullanıcılar aynı işlem için farklı sonuçlar almaktadır. Burada en doğru mimari değerlendirme hangisidir?",
    options: [
      "İş kuralı çok kullanıldığı için mümkün olduğunca her yere kopyalanmalıdır",
      "Kritik domain kuralları tutarlı şekilde yönetilmeli, kopya mantıklar sınırlandırılmalı ve sahiplik netleştirilmelidir",
      "Frontend’de doğru çalışıyorsa backend’de farklı davranması önemli değildir",
      "Mikroservis mimarisinde tutarlılık hiçbir zaman hedeflenmez"
    ],
    correctLetter: "B",
    measured: "Domain logic ownership, consistency, maintainability."
  },
  {
    id: 6,
    text: "Bir API endpoint’i kullanıcı profilini döndürürken frontend’in kullanmadığı dahili alanları da göndermektedir. Bu alanlar arasında hesap riski, müşteri segmenti, dahili not ve bazı kişisel bilgiler vardır. Frontend bu alanları ekranda göstermemektedir. Bu durum neden yine de sorunludur?",
    options: [
      "Ekranda görünmeyen veri kullanıcıya hiç gönderilmiş sayılmaz",
      "Fazla veri gönderimi hem performans hem veri minimizasyonu hem de yetkisiz bilgi sızıntısı riski doğurur",
      "JSON alan sayısı arttıkça güvenlik otomatik artar",
      "Frontend bu veriyi kullanmıyorsa backend açısından hiçbir risk yoktur"
    ],
    correctLetter: "B",
    measured: "Data minimization, API response design, privacy by design."
  },
  {
    id: 7,
    text: "Bir ekip hataları çözmek için production veritabanında doğrudan manuel SQL çalıştırmaktadır. Kısa vadede sorunlar çözülse de hangi değişikliğin ne zaman, kim tarafından ve hangi gerekçeyle yapıldığı izlenememektedir. Bu süreçte en önemli eksiklik nedir?",
    options: [
      "SQL kullanılmamalıdır",
      "Production değişiklikleri onaylı, kayıtlı, geri alınabilir ve denetlenebilir bir değişiklik süreciyle yapılmalıdır",
      "Veritabanı değişiklikleri sadece gece yapılırsa güvenlidir",
      "Manuel değişiklikler hızlı olduğu için kurumsal süreç gerektirmez"
    ],
    correctLetter: "B",
    measured: "Change control, auditability, production güvenliği."
  },
  {
    id: 8,
    text: "Bir uygulamada cache eklenince performans ciddi şekilde iyileşmiştir. Ancak fiyat bilgisi güncellendiğinde bazı kullanıcılara eski fiyat gösterilmekte ve hukuki sorun oluşmaktadır. Bu durumda asıl tasarım problemi nedir?",
    options: [
      "Cache kullanmak her zaman yanlıştır",
      "Cache invalidation, TTL ve tutarlılık ihtiyacı iş kuralına göre tasarlanmamıştır",
      "Veritabanı cache varsa gereksizdir",
      "Kullanıcılar sayfayı yenilerse problem her zaman çözülür"
    ],
    correctLetter: "B",
    measured: "Cache consistency, TTL, iş kuralı etkisi."
  },
  {
    id: 9,
    text: "Bir sistemde e-posta benzersiz olmalıdır. Backend önce “bu e-posta var mı?” diye sorgulayıp sonra kayıt eklemektedir. Yoğun kayıt anında aynı e-postayla iki hesap oluşmuştur. Bu problemi en doğru çözen yaklaşım hangisidir?",
    options: [
      "Backend kontrolünden önce frontend kontrolü eklemek",
      "Veritabanında unique constraint tanımlamak ve duplicate durumunu uygulama seviyesinde doğru yönetmek",
      "Kullanıcıya farklı e-posta kullanmasını söylemek",
      "Kayıt işlemini sadece mesai saatlerinde açmak"
    ],
    correctLetter: "B",
    measured: "Constraint, concurrency, defensive data design."
  },
  {
    id: 10,
    text: "Bir QA sürecinde testler sadece beklenen başarılı kullanıcı akışlarını kapsamaktadır. Production’da sorunların çoğu çift tıklama, geri tuşu, bağlantı kopması, eksik veri, süresi dolmuş oturum ve yetkisiz erişim durumlarında çıkmaktadır. Bu test stratejisinin asıl zayıflığı nedir?",
    options: [
      "Testler kullanıcı davranışındaki belirsizlikleri, hata durumlarını ve sınır koşullarını kapsamamaktadır",
      "Başarılı senaryolar test edilmemelidir",
      "QA yalnızca otomasyon yazarsa manuel test gereksiz olur",
      "Testlerin az olması her zaman daha hızlı teslimat sağlar"
    ],
    correctLetter: "A",
    measured: "Negative testing, edge cases, risk-based testing."
  },
  {
    id: 11,
    text: "Bir uygulamada kullanıcı parolasını değiştirdiğinde eski access token’lar geçerli kalmaya devam etmektedir. Ayrıca refresh token süresi çok uzundur ve cihaz bazlı oturum yönetimi yoktur. Bu durumda en önemli güvenlik riski nedir?",
    options: [
      "Kullanıcı daha az giriş yapar",
      "Ele geçirilmiş token veya cihaz üzerinden yetkisiz erişim uzun süre devam edebilir",
      "Token kullanmak her zaman güvensizdir",
      "Parola değişikliği sadece frontend’i ilgilendirir"
    ],
    correctLetter: "B",
    measured: "Token lifecycle, session invalidation, account security."
  },
  {
    id: 12,
    text: "Bir backend servisi dış kargo API’sine istek atmaktadır. Kargo API’si yavaşladığında servis thread’leri dolmakta ve tüm sipariş sistemi yavaşlamaktadır. Geliştirici sadece retry sayısını artırmayı önermektedir. Bu önerinin riski nedir?",
    options: [
      "Retry sayısını artırmak her zaman sistemi rahatlatır",
      "Kontrolsüz retry yükü artırabilir; timeout, backoff, circuit breaker ve kuyruklama birlikte düşünülmelidir",
      "Dış servisler hiçbir zaman sistem performansını etkilemez",
      "Timeout kullanmak tüm hataları gizler"
    ],
    correctLetter: "B",
    measured: "Resilience, circuit breaker, external dependency management."
  },
  {
    id: 13,
    text: "Bir uygulamada büyük dosya yükleme işlemi tek istekle yapılmaktadır. Kullanıcının bağlantısı koparsa tüm işlem baştan başlamaktadır. Ayrıca aynı dosya iki kez yüklenirse iki farklı kayıt oluşmaktadır. Daha profesyonel tasarım hangisidir?",
    options: [
      "Dosya boyutunu düşürmeyi kullanıcıya bırakmak",
      "Parçalı yükleme, resume desteği, checksum ve işlem kimliği ile tekrar güvenliğini sağlamak",
      "Dosyaları frontend belleğinde kalıcı tutmak",
      "Upload başarısız olursa kullanıcıya sadece hata göstermek"
    ],
    correctLetter: "B",
    measured: "Resumable upload, checksum, idempotent file processing."
  },
  {
    id: 14,
    text: "Bir mobil uygulama eski API sürümlerini kullanan çok sayıda kullanıcıya sahiptir. Backend ekibi eski endpoint’leri kaldırmak istemektedir. Bu kararın teknik olarak en büyük riski nedir?",
    options: [
      "Mobil uygulamaların her kullanıcıda aynı anda güncellenmemesi nedeniyle geriye dönük uyumluluk bozulabilir",
      "API endpoint sayısının azalması her zaman sistem kalitesini artırır",
      "Eski sürümleri kullanan kullanıcılar teknik olarak yok sayılabilir",
      "API versiyonlama yalnızca dokümantasyon konusudur"
    ],
    correctLetter: "A",
    measured: "API versioning, backward compatibility, release planning."
  },
  {
    id: 15,
    text: "Bir oyun geliştirme projesinde karakter hareketi bazı cihazlarda daha hızlıdır. Geliştirici hareketi her frame’de sabit piksel artırarak hesaplamıştır. Bu sorunun en doğru açıklaması nedir?",
    options: [
      "Hareket frame rate’e bağlıdır; delta time veya sabit zaman adımı yaklaşımı gereklidir",
      "Cihazların ekran boyutu aynı olmalıdır",
      "Oyunlarda fizik hesaplaması yapılmaz",
      "Karakter animasyonu kapatılırsa hız eşitlenir"
    ],
    correctLetter: "A",
    measured: "Game loop, frame bağımsız hareket, simulation timing."
  },
  {
    id: 16,
    text: "Bir uygulamada hata mesajları kullanıcıya çok teknik şekilde dönmektedir. Örneğin SQL tablo adı, stack trace ve sunucu yolu görünmektedir. Geliştirici “hata ayıklamayı kolaylaştırıyor” diyor. Bu yaklaşımın asıl riski nedir?",
    options: [
      "Kullanıcı daha fazla teknik bilgi öğrenir",
      "Saldırgana sistem mimarisi ve zafiyet araştırması için bilgi sızdırabilir",
      "Hata mesajları güvenlikle ilgili değildir",
      "Stack trace yalnızca frontend performansını etkiler"
    ],
    correctLetter: "B",
    measured: "Information disclosure, secure error handling."
  },
  {
    id: 17,
    text: "Bir uygulama kullanıcıdan gelen dosya adını doğrudan sunucu dosya yoluna eklemektedir. Saldırgan ../../ benzeri ifadelerle farklı dizinlere erişmeye çalışmaktadır. Bu durumda hangi güvenlik problemi öne çıkar?",
    options: [
      "Path traversal",
      "DNS poisoning",
      "Cache miss",
      "Memory fragmentation"
    ],
    correctLetter: "A",
    measured: "Input validation, file system security."
  },
  {
    id: 18,
    text: "Bir yazılım ekibi test ortamı ile production ortamını aynı veritabanına bağlamıştır. Test sırasında bazı gerçek kullanıcı verileri değişmiştir. Bu hata neyin eksikliğini gösterir?",
    options: [
      "Ortam izolasyonu ve güvenli test verisi yönetimi eksiktir",
      "Test ortamı gereksizdir",
      "Production verisi test için en doğru veridir",
      "Veritabanı kullanmak testleri bozar"
    ],
    correctLetter: "A",
    measured: "Environment isolation, test data management."
  },
  {
    id: 19,
    text: "Bir ekipte herkes kendi bilgisayarında farklı Node/Python/Java sürümü ve farklı environment ayarlarıyla çalışmaktadır. Bir geliştiricide çalışan kod diğerinde çalışmamaktadır. Kalıcı çözüm ne olmalıdır?",
    options: [
      "Hata alan geliştiricinin bilgisayarını değiştirmek",
      "Geliştirme ortamını dokümante etmek, container veya version manager kullanmak ve environment standardizasyonu sağlamak",
      "Her geliştiricinin farklı bağımlılık versiyonu kullanmasını teşvik etmek",
      "Test ortamını kaldırmak"
    ],
    correctLetter: "B",
    measured: "Environment reproducibility, dependency management."
  },
  {
    id: 20,
    text: "Bir monolit uygulamada her küçük değişiklik tüm sistemi yeniden deploy etmeyi gerektirmektedir. Ancak ekip mikroservise geçmeyi sadece “daha modern” olduğu için önermektedir. En doğru mimari yaklaşım hangisidir?",
    options: [
      "Mikroservis her durumda monolitten üstündür",
      "Önce mevcut problemin modülerlik, takım yapısı, deployment bağımsızlığı ve operasyon maliyeti açısından analiz edilmesi gerekir",
      "Monolit uygulamalar hiçbir zaman ölçeklenemez",
      "Mikroservise geçilince veri tutarlılığı ve operasyon sorunları otomatik çözülür"
    ],
    correctLetter: "B",
    measured: "Architecture trade-off, monolith vs microservices."
  },
  {
    id: 21,
    text: "Bir uygulamada SQL sorguları yavaştır. Geliştirici hemen sunucu kapasitesini artırmak istemektedir. Ancak yavaş sorguların çoğu filtre alanlarında index olmadan çalışmaktadır. İlk profesyonel yaklaşım ne olmalıdır?",
    options: [
      "Önce sorgu planı, index kullanımı ve veri erişim paterni analiz edilmelidir",
      "Her performans sorunu yalnızca sunucu büyüterek çözülür",
      "Veritabanı optimizasyonu sadece DBA’nın sorumluluğudur",
      "Yavaş sorgular kullanıcıya gösterilmemelidir"
    ],
    correctLetter: "A",
    measured: "Query optimization, indexing, performance diagnosis."
  },
  {
    id: 22,
    text: "Bir uygulama kullanıcı girdisini HTML içinde escape etmeden göstermektedir. Saldırgan yorum alanına script eklediğinde diğer kullanıcıların tarayıcısında çalışmaktadır. Bu durumda yalnızca backend doğrulaması neden yeterli olmayabilir?",
    options: [
      "Çıktı bağlamına uygun encoding ve sanitization da gerekir",
      "XSS yalnızca veritabanı hatasıdır",
      "Frontend güvenliği hiçbir zaman önemli değildir",
      "Script çalışması normal kullanıcı davranışıdır"
    ],
    correctLetter: "A",
    measured: "XSS prevention, output encoding, input/output security."
  },
  {
    id: 23,
    text: "Bir ekip release sonrası hangi commit’in hangi hataya neden olduğunu bulamamaktadır. Commit mesajları anlamsız, issue bağlantıları yok, release notları tutulmamaktadır. Buradaki temel mühendislik eksikliği nedir?",
    options: [
      "İzlenebilir geliştirme, anlamlı commit, issue ilişkisi ve sürüm yönetimi disiplini eksiktir",
      "Commit sayısı azsa kalite yüksektir",
      "Sürüm notları sadece pazarlama içindir",
      "Hata çıktığında geçmişe bakmak gereksizdir"
    ],
    correctLetter: "A",
    measured: "Traceability, release management, engineering process."
  },
  {
    id: 24,
    text: "Bir web uygulamasında yetki kontrolü middleware ile yapılmaktadır. Ancak bazı yeni endpoint’ler bu middleware zincirinin dışında kalmıştır. Kod review’da neye özellikle bakılmalıdır?",
    options: [
      "Endpoint isimlerinin kısa olup olmadığına",
      "Güvenlik kontrollerinin varsayılan olarak uygulanıp uygulanmadığına ve istisnaların açıkça yönetildiğine",
      "Controller dosyalarının alfabetik sırasına",
      "Frontend’de menülerin gizlenip gizlenmediğine"
    ],
    correctLetter: "B",
    measured: "Secure defaults, authorization coverage, code review."
  },
  {
    id: 25,
    text: "Bir uygulama arka planda e-posta gönderme, rapor üretme ve görsel işleme gibi uzun işlemleri HTTP request içinde senkron yapmaktadır. Kullanıcılar timeout almaktadır. Daha uygun çözüm nedir?",
    options: [
      "Uzun işleri kuyruk/worker yapısına almak ve kullanıcıya işlem durumunu göstermek",
      "HTTP timeout süresini sonsuza çıkarmak",
      "Kullanıcıya beklemesini söylemek",
      "Tüm işlemleri frontend’de yapmak"
    ],
    correctLetter: "A",
    measured: "Async processing, job queue, user experience."
  },
  {
    id: 26,
    text: "Bir ekip feature flag kullanmadan yeni özelliği doğrudan tüm kullanıcılara açmaktadır. Hata çıkınca geri almak için tüm uygulamayı eski sürüme döndürmek zorunda kalmaktadır. Feature flag’in burada temel faydası nedir?",
    options: [
      "Kod yazmayı ortadan kaldırır",
      "Özellikleri kontrollü açma, hızlı kapatma ve kademeli yayına alma imkanı sağlar",
      "Veritabanı ihtiyacını kaldırır",
      "Test gereksinimini tamamen yok eder"
    ],
    correctLetter: "B",
    measured: "Release strategy, feature toggles, controlled rollout."
  },
  {
    id: 27,
    text: "Bir uygulamada kullanıcı oturumu localStorage’da saklanan uzun ömürlü token ile yönetilmektedir. XSS açığı oluştuğunda token’lar ele geçirilebilmektedir. Bu tasarımda hangi konu birlikte düşünülmelidir?",
    options: [
      "Token saklama yöntemi, XSS önleme, token süresi ve refresh mekanizması",
      "Token’ın adı daha uzun olmalıdır",
      "localStorage kullanılırsa XSS etkisizdir",
      "Kullanıcı logout yaparsa tüm risk kalıcı olarak biter"
    ],
    correctLetter: "A",
    measured: "Session security, token storage, XSS impact."
  },
  {
    id: 28,
    text: "Bir backend servisi birden fazla üçüncü taraf API’ye bağlıdır. Bu sağlayıcılardan biri yavaşladığında uygulama kullanıcıya hiçbir açıklama yapmadan bekletmektedir. Daha iyi tasarım hangisidir?",
    options: [
      "Bağımlılık durumunu izlemek, timeout belirlemek, uygun fallback ve kullanıcıya anlamlı durum göstermek",
      "Tüm sağlayıcıları aynı anda daha çok çağırmak",
      "Kullanıcıyı sonsuza kadar bekletmek",
      "Üçüncü taraf hatalarını loglamamak"
    ],
    correctLetter: "A",
    measured: "Dependency resilience, fallback design, UX reliability."
  },
  {
    id: 29,
    text: "Bir sistemde audit log sadece “işlem yapıldı” bilgisini tutmaktadır. Ancak kimin, hangi eski değeri hangi yeni değere çevirdiği ve hangi IP’den yaptığı tutulmamaktadır. Bu neden yetersizdir?",
    options: [
      "Denetim, hata analizi ve güvenlik incelemesi için olay bağlamı eksik kalır",
      "Audit loglarda detay tutmak her zaman yasaktır",
      "Sadece işlem zamanı yeterlidir",
      "Audit log sadece performans ölçümü içindir"
    ],
    correctLetter: "A",
    measured: "Audit logging, accountability, forensic readiness."
  },
  {
    id: 30,
    text: "Bir sistemde kritik bir bug düzeltilirken geliştirici doğrudan main branch’e commit atıp production’a deploy etmektedir. Test ve review atlanmıştır. Hata acil olsa bile daha dengeli süreç ne olmalıdır?",
    options: [
      "Acil durumlar için hızlı ama izlenebilir hotfix akışı, minimum test, review ve rollback planı uygulanmalıdır",
      "Acil hatalarda hiçbir süreç gerekmez",
      "Review sadece büyük projelerde yapılır",
      "Testler hotfix’lerde her zaman gereksizdir"
    ],
    correctLetter: "A",
    measured: "Hotfix process, release safety, operational discipline. 2. Veri Bilimi ve Yapay Zeka — 30 Soru"
  },
];

export const DS_AI_QUESTIONS = [
  {
    id: 2,
    text: "Bir müşteri kaybı modeli çok yüksek başarı göstermektedir. İncelemede eğitimde kullanılan bazı özelliklerin, müşterinin ayrılmasından sonra oluşan destek kayıtları ve kapanış nedenleri olduğu fark edilir. Model canlıda başarısız olacaktır. Neden?",
    options: [
      "Modelin algoritması yanlış seçilmiştir",
      "Tahmin anında bilinmeyen gelecek bilgisi eğitim verisine sızmıştır",
      "Destek kayıtları kategorik olduğu için kullanılamaz",
      "Müşteri kaybı tahmininde zaman bilgisi önemsizdir"
    ],
    correctLetter: "B",
    measured: "Data leakage, temporal validity, feature availability."
  },
  {
    id: 3,
    text: "Bir zaman serisi modelinde veri rastgele train-test ayrılmıştır. Test başarısı yüksek, gerçek gelecek tahmini zayıftır. Ayrıca aynı kampanya dönemine ait veriler hem train hem testte yer almaktadır. Bu deney tasarımında temel hata nedir?",
    options: [
      "Model geçmiş veriyi kullanmıştır",
      "Zaman bağımlılığı ve gelecek bilgisi sızıntısı dikkate alınmadan validasyon yapılmıştır",
      "Test seti çok büyüktür",
      "Zaman serilerinde validasyon gereksizdir"
    ],
    correctLetter: "B",
    measured: "Time series split, temporal leakage, validation design."
  },
  {
    id: 4,
    text: "Bir görüntü sınıflandırma modelinde eğitim başarısı çok yüksek, validasyon başarısı düşüktür. Veri bilimci dropout ve data augmentation yerine epoch sayısını artırmayı önermektedir. Bu öneri neden problemli olabilir?",
    options: [
      "Daha fazla epoch overfitting’i artırabilir ve genelleme sorununu büyütebilir",
      "Epoch sayısı hiçbir zaman model davranışını değiştirmez",
      "Validasyon başarısı düşükse test seti silinmelidir",
      "Eğitim başarısı yüksekse her model canlıda başarılı olur"
    ],
    correctLetter: "A",
    measured: "Overfitting diagnosis, regularization, generalization."
  },
  {
    id: 5,
    text: "Bir hastalık tarama modelinde yanlış negatifler hayati risk yaratmaktadır. Modelin precision değeri yüksek, recall değeri düşüktür. Bu durumda model hakkında en doğru yorum hangisidir?",
    options: [
      "Model pozitif dediğinde genellikle doğru olabilir fakat birçok gerçek hastayı kaçırıyor olabilir",
      "Precision yüksekse recall her zaman önemsizdir",
      "Accuracy bilinmeden model hakkında hiçbir yorum yapılamaz",
      "Yanlış negatifler sağlık alanında maliyetsizdir"
    ],
    correctLetter: "A",
    measured: "Precision-recall trade-off, domain cost, medical AI evaluation."
  },
  {
    id: 6,
    text: "Bir NLP duygu analizi modeli eğitim verisinde “harika”, “berbat” gibi kelimelere aşırı bağımlı hale gelmiştir. İroni içeren veya bağlamı farklı olan yorumlarda başarısızdır. Bu durumda hangi analiz daha anlamlıdır?",
    options: [
      "Modelin sadece kelime frekansını mı yoksa bağlamsal anlamı mı öğrendiğini hata örnekleriyle incelemek",
      "Tüm kısa yorumları silip modeli yeniden eğitmek",
      "Sadece accuracy değerini raporlamak",
      "Modelin çıktısını her zaman pozitif yapmak"
    ],
    correctLetter: "A",
    measured: "NLP error analysis, contextual semantics, robustness."
  },
  {
    id: 7,
    text: "Bir fraud modeli canlıya alındıktan sonra birkaç ay iyi çalışmış, daha sonra performansı düşmüştür. Dolandırıcı davranışları değişmiş, işlem kanalları farklılaşmıştır. MLOps sürecinde en kritik eksiklik nedir?",
    options: [
      "Model dosya ismi versiyonlanmamıştır",
      "Data drift, concept drift ve performans izleme mekanizması kurulmamıştır",
      "Model ilk testte başarılı olduğu için tekrar izlenmemelidir",
      "Fraud modelleri canlıda değişim göstermez"
    ],
    correctLetter: "B",
    measured: "Drift monitoring, concept drift, production ML lifecycle."
  },
  {
    id: 8,
    text: "Bir modelin AUC değeri yüksektir. Ancak iş birimi, yanlış pozitiflerin operasyon maliyetini artırdığını, yanlış negatiflerin ise kayıp müşteriye yol açtığını belirtmektedir. Model karar sistemine dönüştürülürken ne yapılmalıdır?",
    options: [
      "AUC yüksek olduğu için tek eşik değeriyle canlıya almak",
      "Karar eşiğini maliyet matrisi, kapasite ve iş hedefleriyle birlikte optimize etmek",
      "Tüm müşterilere pozitif tahmin vermek",
      "İş maliyetlerini model değerlendirmesinden ayrı tutmak"
    ],
    correctLetter: "B",
    measured: "Threshold optimization, business-aware ML, decision design."
  },
  {
    id: 9,
    text: "Bir veri pipeline’ı her gece başarılı görünüyor. Ancak bazı günlerde kaynak sistemden eksik dosya geldiği halde rapor tabloları üretiliyor. Yönetim yanlış veriye göre karar alıyor. Pipeline başarısı nasıl tanımlanmalıdır?",
    options: [
      "Job teknik olarak bittiğinde başarılı sayılmalıdır",
      "Veri tazeliği, beklenen hacim, şema, kalite ve anomali kontrolleri de başarı kriteri olmalıdır",
      "Eksik veri raporlama ekibinin sorunudur",
      "Pipeline’ın sessiz çalışması yeterlidir"
    ],
    correctLetter: "B",
    measured: "Data quality, pipeline observability, freshness validation."
  },
  {
    id: 10,
    text: "Bir BI raporunda toplam ciro doğru görünmektedir ancak ürün kategorisi bazında kırılımlar çarpıktır. İncelemede fact tablosu ile kategori boyutu arasında çoktan çoğa ilişki ve granularity uyumsuzluğu olduğu görülür. En doğru değerlendirme hangisidir?",
    options: [
      "Toplam değer doğruysa kırılımlar kabul edilebilir",
      "Veri modeli ilişkileri, granularity ve measure hesaplama mantığı yeniden tasarlanmalıdır",
      "Görsel tipi değiştirilirse veri modeli hatası çözülür",
      "Kategori alanları metne çevrilirse problem ortadan kalkar"
    ],
    correctLetter: "B",
    measured: "Dimensional modeling, granularity, BI measure logic."
  },
  {
    id: 11,
    text: "Bir sağlık yapay zeka modeli genel test setinde yüksek başarı göstermektedir. Ancak belirli yaş grubunda hata oranı belirgin şekilde yüksektir. Bu durum canlı kullanım öncesi neden kritik değerlendirilmelidir?",
    options: [
      "Genel skor yüksekse alt grup performansı önemsizdir",
      "Modelin belirli gruplarda sistematik hata yapması güvenilirlik ve adalet riski oluşturur",
      "Yaş bilgisi her zaman modelden çıkarılmalıdır",
      "Alt grup analizi yalnızca pazarlama modellerinde yapılır"
    ],
    correctLetter: "B",
    measured: "Fairness, subgroup performance, responsible AI."
  },
  {
    id: 12,
    text: "Bir veri bilimci normalizasyon parametrelerini tüm veri seti üzerinden hesaplayıp sonra train-test ayrımı yapmıştır. Test skoru beklenenden yüksek çıkmıştır. Buradaki problem nedir?",
    options: [
      "Test setinden bilgi preprocessing aşamasında eğitime sızmış olabilir",
      "Normalizasyon tüm modellerde yasaktır",
      "Train-test ayrımı yapıldığı için leakage imkansızdır",
      "Test seti sadece görsel modellerde kullanılır"
    ],
    correctLetter: "A",
    measured: "Preprocessing leakage, pipeline discipline."
  },
  {
    id: 13,
    text: "Bir fraud detection probleminde fraud oranı %0.5’tir. Model fraud tahmini neredeyse yapmamakta fakat accuracy değeri çok yüksek görünmektedir. Bu durumda hangi metrik ve analizler daha anlamlıdır?",
    options: [
      "Precision, recall, PR-AUC, confusion matrix ve iş maliyeti analizi",
      "Sadece accuracy",
      "Sadece eğitim süresi",
      "Sadece model parametre sayısı"
    ],
    correctLetter: "A",
    measured: "Rare event modeling, PR metrics, fraud analytics."
  },
  {
    id: 14,
    text: "Bir veri setindeki eksik değerler rastgele değildir. Özellikle düşük gelirli kullanıcıların bazı alanları eksiktir. Veri bilimci tüm eksikleri ortalama ile doldurmayı önermektedir. Bu karar neden risklidir?",
    options: [
      "Eksiklik örüntüsü grup bazlı bilgi taşıyor olabilir ve ortalama imputasyon yanlılık yaratabilir",
      "Ortalama imputasyon her durumda en doğru yöntemdir",
      "Eksik değerler model davranışını etkilemez",
      "Eksik değerleri doldurmak etik risk oluşturmaz"
    ],
    correctLetter: "A",
    measured: "Missingness mechanism, bias, data ethics."
  },
  {
    id: 15,
    text: "Bir öneri sistemi sadece popüler ürünleri önermektedir. Kısa vadede tıklama artmış ancak uzun vadede kullanıcıların keşif ve kişiselleştirme memnuniyeti düşmüştür. Burada hangi denge kurulmalıdır?",
    options: [
      "Popülerlik, kişiselleştirme, çeşitlilik ve keşif dengesi birlikte değerlendirilmelidir",
      "En çok satan ürünü herkese önermek her zaman en iyi stratejidir",
      "Kişiselleştirme öneri sistemlerinde gereksizdir",
      "Tıklama artarsa uzun vadeli memnuniyet mutlaka artar"
    ],
    correctLetter: "A",
    measured: "Recommendation systems, exploration-diversity trade-off."
  },
  {
    id: 16,
    text: "Bir kredi kararı modelinin çıktısı kullanıcıya “reddedildi” şeklinde gösterilmektedir. İş birimi kararın nedenini açıklamak zorunda olduğunu belirtmektedir. Model karmaşık olduğu için ekip açıklama üretememektedir. Bu durumda ne önem kazanır?",
    options: [
      "Açıklanabilirlik, karar gerekçesi ve model yönetişimi",
      "Modelin sadece hızlı çalışması",
      "Kararların hiçbir zaman açıklanmaması",
      "Tüm değişkenlerin gizlenmesi"
    ],
    correctLetter: "A",
    measured: "Explainable AI, model governance, regulated ML."
  },
  {
    id: 17,
    text: "Bir işlem sınıflandırma probleminde aynı müşteriye ait kayıtlar hem eğitim hem test setine düşmüştür. Model testte çok iyi görünmektedir. Canlıda yeni müşterilerde performans düşmektedir. Neden?",
    options: [
      "Müşteri bazlı örüntüler ezberlenmiş ve gerçek genelleme olduğundan yüksek ölçülmüştür",
      "Test setinde aynı müşteri bulunması her zaman daha adildir",
      "Yeni müşteri tahmini eğitim gerektirmez",
      "Model müşteri bilgisini asla kullanmaz"
    ],
    correctLetter: "A",
    measured: "Group leakage, split strategy, generalization testing."
  },
  {
    id: 18,
    text: "Bir modelin hem eğitim hatası hem validasyon hatası yüksektir. Model çok basit olabilir veya özellikler hedefi açıklamakta yetersiz olabilir. Bu durumda ilk yorum ne olmalıdır?",
    options: [
      "Underfitting veya veri/özellik temsil problemi olabilir",
      "Model kesin overfit olmuştur",
      "Validasyon hatası önemsizdir",
      "Daha fazla epoch her zaman çözer"
    ],
    correctLetter: "A",
    measured: "Bias-variance diagnosis, feature representation."
  },
  {
    id: 19,
    text: "Bir derin öğrenme modelinde learning rate çok yüksek seçilmiştir. Loss bazen düşmekte, bazen ani yükselmektedir ve yakınsama kararsızdır. En doğru yorum hangisidir?",
    options: [
      "Adımlar optimum bölgeyi aşabilir; öğrenme oranı ve scheduler yeniden değerlendirilmelidir",
      "Learning rate yükseldikçe model her zaman daha iyi öğrenir",
      "Loss dalgalanması modelin kesin başarılı olduğunu gösterir",
      "Etiket hataları otomatik düzelir"
    ],
    correctLetter: "A",
    measured: "Optimization dynamics, learning rate tuning."
  },
  {
    id: 20,
    text: "Bir veri görselleştirmesinde y ekseni daraltılarak küçük bir artış çok büyük bir değişim gibi sunulmuştur. Teknik olarak grafik doğru sayı içerse de neden problemli olabilir?",
    options: [
      "Görsel temsil karar vericiyi yanıltabilir; ölçek, bağlam ve dürüst sunum önemlidir",
      "Sayılar doğruysa grafik asla yanıltıcı olamaz",
      "Görselleştirme sadece estetik konudur",
      "Eksen ölçeği iş kararını etkilemez"
    ],
    correctLetter: "A",
    measured: "Data visualization ethics, analytical communication."
  },
  {
    id: 21,
    text: "Bir modelin karar eşiği varsayılan 0.5 bırakılmıştır. Ancak operasyon ekibi günde en fazla 500 vakayı inceleyebilmektedir. Bu durumda karar eşiği nasıl ele alınmalıdır?",
    options: [
      "Varsayılan 0.5 her durumda korunmalıdır",
      "Eşik, operasyon kapasitesi, risk skoru dağılımı ve beklenen iş değeriyle birlikte ayarlanmalıdır",
      "Tüm vakalar pozitif yapılmalıdır",
      "Eşik kullanmak sınıflandırmada hatalıdır"
    ],
    correctLetter: "B",
    measured: "Operational thresholding, capacity-aware ML."
  },
  {
    id: 22,
    text: "Bir veri ambarında aynı müşteri CRM, satış ve destek sistemlerinde farklı ID’lerle tutulmaktadır. Kampanya analizi aynı kişiyi üç ayrı müşteri gibi saymaktadır. Hangi problem öne çıkar?",
    options: [
      "Entity resolution ve master data yönetimi problemi",
      "GPU bellek problemi",
      "Tokenization problemi",
      "CSS layout problemi"
    ],
    correctLetter: "A",
    measured: "Entity matching, data integration, MDM."
  },
  {
    id: 23,
    text: "Bir ML modeli üretime alınmıştır fakat tahmin sırasında model versiyonu, özellik değerleri, çıktı skoru ve karar eşiği kaydedilmemektedir. Sonradan hatalı kararlar incelenememektedir. Eksik olan nedir?",
    options: [
      "Model izlenebilirliği, audit logging ve model governance",
      "Daha büyük model seçimi",
      "Frontend performansı",
      "DNS ayarı"
    ],
    correctLetter: "A",
    measured: "ML observability, auditability, governance."
  },
  {
    id: 24,
    text: "Bir chatbot dil bilgisi açısından düzgün cevaplar üretmektedir fakat kullanıcının gerçek niyetini kaçırmakta ve bağlamdan kopmaktadır. Değerlendirme sadece cümle akıcılığına göre yapılmıştır. Eksik olan nedir?",
    options: [
      "Intent doğruluğu, bağlam takibi, hallucination ve görev başarısı ölçümü",
      "Daha uzun cevap üretmek",
      "Sadece imla kontrolü",
      "Tüm cevapları olumlu yapmak"
    ],
    correctLetter: "A",
    measured: "NLP evaluation, conversational AI quality."
  },
  {
    id: 25,
    text: "Bir A/B testinde örneklem sayısı düşüktür. İlk iki saatte B varyantı biraz daha iyi görünmektedir. Ürün ekibi hemen tüm kullanıcılara açmak istemektedir. Analitik açıdan risk nedir?",
    options: [
      "Sonuç rastlantısal olabilir; örneklem büyüklüğü, güven aralığı ve test süresi değerlendirilmelidir",
      "İlk sonuç her zaman nihai karardır",
      "A/B testinde istatistik gerekmez",
      "Küçük farklar her zaman anlamlıdır"
    ],
    correctLetter: "A",
    measured: "Experiment design, statistical significance, decision risk."
  },
  {
    id: 26,
    text: "Bir ekip model denemelerinde hangi veri versiyonu, parametreler ve kod sürümüyle hangi sonucun alındığını kaydetmemektedir. En iyi skor tekrar üretilememektedir. Eksik olan süreç nedir?",
    options: [
      "Experiment tracking, dataset versioning ve reproducibility",
      "Daha fazla epoch",
      "Model dosyasını manuel kopyalama",
      "Sonucu sadece sunumda saklama"
    ],
    correctLetter: "A",
    measured: "Reproducible ML, experiment management."
  },
  {
    id: 27,
    text: "Bir sınıflandırma probleminde azınlık sınıf etiketlerinde daha fazla hata vardır. Modelin bu sınıftaki başarısı düşük ve raporlama yanıltıcıdır. Bu durumda ne yapılmalıdır?",
    options: [
      "Label kalitesi analiz edilmeli, özellikle azınlık sınıf örnekleri doğrulanmalı ve metrikler sınıf bazında incelenmelidir",
      "Azınlık sınıf tamamen silinmelidir",
      "Label hataları modeli her zaman iyileştirir",
      "Sadece genel accuracy yeterlidir"
    ],
    correctLetter: "A",
    measured: "Label noise, class-wise evaluation, supervised data quality."
  },
  {
    id: 28,
    text: "Bir veri bilimci yüksek korelasyon gördüğü için “X, Y’ye neden oluyor” sonucunu çıkarmaktadır. Bu yorum neden hatalıdır?",
    options: [
      "Korelasyon tek başına nedensellik kanıtı değildir; confounder ve deney tasarımı değerlendirilmelidir",
      "Korelasyon her zaman nedenselliktir",
      "Nedensellik için veri gerekmez",
      "Korelasyon sadece görsel analizde kullanılır"
    ],
    correctLetter: "A",
    measured: "Causal reasoning, confounding, statistical interpretation."
  },
  {
    id: 29,
    text: "Bir ürün öneri modeli yalnızca geçmiş satın alımlara bakmaktadır. Yeni kullanıcılar ve yeni ürünler için öneri üretememektedir. Bu hangi problemle ilgilidir?",
    options: [
      "Cold start problemi",
      "Over-indexing",
      "DNS propagation",
      "Cache invalidation"
    ],
    correctLetter: "A",
    measured: "Recommender systems, cold start."
  },
  {
    id: 30,
    text: "Bir yapay zeka projesi yüksek offline skor üretmiştir fakat iş akışına entegre edilmediği için kullanıcılar modeli kullanmamaktadır. Bu projenin eksik tarafı nedir?",
    options: [
      "Modelin karar noktasına, kullanıcı deneyimine, operasyon sürecine ve geri bildirim döngüsüne entegre edilmemesi",
      "Model skorunun düşük yazılması",
      "Daha karmaşık algoritma kullanılmaması",
      "Eğitim verisinin gizlenmemesi"
    ],
    correctLetter: "A",
    measured: "AI productization, human-in-the-loop, operational integration. 3. Siber Güvenlik ve Ağ — 30 Soru"
  },
];

export const CS_NET_QUESTIONS = [
  {
    id: 2,
    text: "Bir müşteri portalında kullanıcı kendi faturalarını görmelidir. Ancak URL’deki fatura ID’sini değiştirerek başka müşterinin faturasına erişebilmektedir. Geliştirici “ID’leri UUID yaparsak sorun çözülür” diyor. Bu neden eksik bir çözümdür?",
    options: [
      "UUID kullanımı tüm güvenlik açıklarını çözer",
      "Sorun tahmin edilebilir ID’den çok nesne bazlı yetkilendirme kontrolünün eksikliğidir",
      "Faturalar PDF olduğu için yetkilendirme gerekmez",
      "URL’de ID kullanmak her zaman yasaktır"
    ],
    correctLetter: "B",
    measured: "IDOR, object-level authorization, access control."
  },
  {
    id: 3,
    text: "Bir pentest ekibi kapsam dışı bir canlı veritabanında zafiyet olabileceğini fark ediyor. Bir ekip üyesi zafiyeti doğrulamak için küçük miktarda gerçek müşteri verisi çekmeyi öneriyor. En doğru yaklaşım hangisidir?",
    options: [
      "Kritik açık şüphesi varsa kapsam dışı veri çekilebilir",
      "Kapsam dışına çıkmadan bulgu şüphesini yetkili kişilere bildirmek ve yazılı izin/güvenli doğrulama yöntemi istemek",
      "Veriyi çekip sonra silmek yeterlidir",
      "Müşteri verisi azsa hukuki risk oluşmaz"
    ],
    correctLetter: "B",
    measured: "Pentest ethics, scope control, data protection."
  },
  {
    id: 4,
    text: "Bir firewall üzerinde yıllardır eklenmiş kurallar vardır. Bazı kurallar geniş IP aralıklarına ve tüm portlara izin vermektedir. Ancak iş birimleri kesinti olmasından korktuğu için kimse kurallara dokunmak istememektedir. Güvenlik uzmanının en dengeli yaklaşımı nedir?",
    options: [
      "Tüm kuralları bir anda silmek",
      "Kural envanteri, trafik analizi, iş sahipliği doğrulaması ve kademeli sadeleştirme yapmak",
      "Geniş kuralları olduğu gibi bırakmak",
      "Firewall’u sadece log toplama cihazı gibi kullanmak"
    ],
    correctLetter: "B",
    measured: "Firewall governance, least privilege, operational risk management."
  },
  {
    id: 5,
    text: "Bir uygulamada dosya yükleme özelliği vardır. Sistem yalnızca uzantı kontrolü yapmaktadır. Saldırgan .jpg uzantılı fakat çalıştırılabilir zararlı içerik yükleyebilmektedir. Güvenli tasarım için hangi yaklaşım daha uygundur?",
    options: [
      "Sadece dosya adını daha uzun yapmak",
      "İçerik/MIME doğrulama, dosya boyutu sınırı, güvenli depolama, çalıştırma iznini engelleme ve malware taraması uygulamak",
      "Uzantı kontrolünü tamamen kaldırmak",
      "Yüklenen dosyaları doğrudan public dizinde çalıştırılabilir tutmak"
    ],
    correctLetter: "B",
    measured: "File upload security, defense in depth."
  },
  {
    id: 6,
    text: "Bir kurumda kullanıcı bilgisayarları, uygulama sunucuları ve veritabanları aynı ağ segmentindedir. Bir kullanıcının cihazına bulaşan zararlı yazılım kısa sürede sunuculara yatay hareket yapmıştır. Mimari eksiklik nedir?",
    options: [
      "Ağ segmentasyonu, erişim kontrolü ve lateral movement sınırlandırması eksiktir",
      "Sunucu isimleri karmaşıktır",
      "DNS kullanımı saldırının ana nedenidir",
      "Kullanıcı cihazları hiçbir ağa bağlanmamalıdır"
    ],
    correctLetter: "A",
    measured: "Network segmentation, zero trust, lateral movement."
  },
  {
    id: 7,
    text: "Bir olay müdahale sürecinde ekip saldırı görülen sunucuyu hemen formatlamıştır. Daha sonra saldırının giriş noktası, etkilenen hesaplar ve veri sızıntısı kapsamı belirlenememiştir. Buradaki kritik hata nedir?",
    options: [
      "Kanıt bütünlüğü korunmadan ve forensic analiz yapılmadan sistemi sıfırlamak",
      "Sunucuyu kapatmak yerine açık bırakmak",
      "Kullanıcıya haber vermek",
      "Yedekleri kontrol etmek"
    ],
    correctLetter: "A",
    measured: "Incident response, forensic preservation, evidence handling."
  },
  {
    id: 8,
    text: "Bir SIEM günde binlerce uyarı üretmektedir. Analistler düşük kaliteli alarmlar nedeniyle gerçek tehditleri kaçırmaktadır. En doğru iyileştirme yaklaşımı hangisidir?",
    options: [
      "Tüm uyarıları kapatmak",
      "Korelasyon kurallarını, risk skorlamasını, false positive azaltmayı ve olay önceliklendirmeyi iyileştirmek",
      "Sadece dashboard rengini değiştirmek",
      "Analistlerin tüm uyarılara aynı öncelikle bakmasını istemek"
    ],
    correctLetter: "B",
    measured: "SIEM tuning, alert fatigue, detection engineering."
  },
  {
    id: 9,
    text: "Kurumda VPN’e giren kullanıcılar tüm iç ağ kaynaklarına erişebilmektedir. “VPN zaten kimlik doğrulama yapıyor” denmektedir. Bu yaklaşımın zayıf tarafı nedir?",
    options: [
      "VPN sonrası yetkilendirme, segmentasyon, cihaz durumu ve en az ayrıcalık kontrolleri yine gereklidir",
      "VPN tüm güvenlik kontrollerinin yerine geçer",
      "VPN kullanan herkes tüm kaynaklara erişmelidir",
      "VPN sadece bağlantı hızını artırır"
    ],
    correctLetter: "A",
    measured: "Zero trust, VPN security, least privilege."
  },
  {
    id: 10,
    text: "Bir uygulama kullanıcı parolalarını hızlı hash algoritması ile tuzsuz saklamaktadır. Geliştirici “hash geri çevrilemez” diyerek bunu yeterli görüyor. Bu yaklaşım neden zayıftır?",
    options: [
      "Parola saklamada salt ve yavaşlatılmış özel parola hash algoritmaları gerekir",
      "Hash fonksiyonları hiçbir zaman kullanılmaz",
      "Parolalar düz metin saklanmalıdır",
      "Hash kısa olursa daha güvenlidir"
    ],
    correctLetter: "A",
    measured: "Password storage, salt, adaptive hashing."
  },
  {
    id: 11,
    text: "Bir web uygulamasında kullanıcı girdisi SQL sorgusuna string birleştirme ile eklenmektedir. Geliştirici sadece frontend validasyonu eklemiştir. Bu neden yeterli değildir?",
    options: [
      "Frontend kontrolleri atlatılabilir; parametreli sorgu ve backend doğrulama gerekir",
      "SQL injection sadece admin panellerinde olur",
      "Frontend validasyonu varsa backend güvenliği gereksizdir",
      "SQL sorguları kullanıcı girdisiyle hiç çalışmaz"
    ],
    correctLetter: "A",
    measured: "SQL injection prevention, parameterized queries."
  },
  {
    id: 12,
    text: "Bir kurumda kullanıcılar günlük işlemlerini admin hesaplarıyla yapmaktadır. Zararlı yazılım bir kullanıcı cihazına bulaştığında yüksek yetkilerle işlem yapabilmektedir. Hangi prensip ihlal edilmiştir?",
    options: [
      "Least privilege",
      "Load balancing",
      "Data normalization",
      "Cache invalidation"
    ],
    correctLetter: "A",
    measured: "Privilege management, endpoint risk."
  },
  {
    id: 13,
    text: "Bir şirketin çalışan parolaları güçlüdür fakat MFA yoktur. Çalışanlardan biri sahte giriş sayfasına parolasını girmiştir. Saldırgan doğrudan sisteme erişebilmiştir. Hangi kontrol bu riski azaltırdı?",
    options: [
      "Çok faktörlü kimlik doğrulama ve anormal giriş tespiti",
      "Daha uzun kullanıcı adı",
      "HTTP kullanımı",
      "Logo doğrulaması"
    ],
    correctLetter: "A",
    measured: "MFA, identity protection, phishing resilience."
  },
  {
    id: 14,
    text: "Bir uygulama hassas verileri HTTP üzerinden taşımaktadır. Kurum içi ağ güvenli olduğu için bunun sorun olmayacağı söylenmektedir. Bu yorum neden eksiktir?",
    options: [
      "İç ağda da dinleme, araya girme veya yanlış yönlendirme riski olabilir; TLS gerekir",
      "HTTP her zaman HTTPS’ten güvenlidir",
      "Hassas veri sadece internette korunmalıdır",
      "TLS sadece görsel sertifika göstermek içindir"
    ],
    correctLetter: "A",
    measured: "Transport security, internal threat model."
  },
  {
    id: 15,
    text: "Bir uygulamada CSRF koruması yoktur. Kullanıcı oturumu açıkken saldırgan kullanıcının tarayıcısına yetkili işlem yaptırabilmektedir. Bu açık hangi durumda özellikle tehlikelidir?",
    options: [
      "Durum değiştiren işlemler cookie tabanlı oturumla korunuyorsa",
      "Kullanıcı hiç giriş yapmamışsa",
      "Uygulama yalnızca statik görsel sunuyorsa",
      "Sunucu hiç form kabul etmiyorsa"
    ],
    correctLetter: "A",
    measured: "CSRF, session-based web security."
  },
  {
    id: 16,
    text: "Bir kurumda ağ cihazı varsayılan kullanıcı adı ve parola ile internete açık bırakılmıştır. Güvenlik açısından asıl hata hangisidir?",
    options: [
      "Default credential değiştirilmemiş, yönetim arayüzü internete maruz bırakılmış ve erişim sınırlandırılmamıştır",
      "Cihazın IP adresi vardır",
      "Ağ cihazlarında parola bulunması hatadır",
      "Cihazın elektrikle çalışması risktir"
    ],
    correctLetter: "A",
    measured: "Hardening, exposure management, default credentials."
  },
  {
    id: 17,
    text: "Bir fidye yazılımı saldırısında hem ana veriler hem de aynı ağdaki yedekler şifrelenmiştir. Yedekleme politikası var görünmektedir ama geri dönüş yapılamamaktadır. Eksik olan nedir?",
    options: [
      "İzole, immutable veya offline yedek, düzenli restore testi ve erişim ayrımı",
      "Daha sık ekran görüntüsü almak",
      "Yedekleri aynı sunucuda tutmak",
      "Yedeklere herkesin yazma izni olması"
    ],
    correctLetter: "A",
    measured: "Ransomware resilience, backup architecture, restore testing."
  },
  {
    id: 18,
    text: "Bir saldırgan yerel ağda ARP tablolarını kandırarak trafiği kendi üzerinden geçirmeye çalışmaktadır. Bu saldırıya karşı hangi yaklaşım yardımcı olabilir?",
    options: [
      "Ağ segmentasyonu, switch güvenlik özellikleri ve şifreli protokoller kullanmak",
      "HTTP kullanmak",
      "Tüm cihazları aynı VLAN’da tutmak",
      "Varsayılan parolaları korumak"
    ],
    correctLetter: "A",
    measured: "Layer 2 security, ARP spoofing mitigation."
  },
  {
    id: 19,
    text: "Bir güvenlik raporunda “kritik açık var” yazmaktadır ancak etki, kanıt, tekrar üretim adımları, kapsam ve çözüm önerisi bulunmamaktadır. Bu rapor neden yetersizdir?",
    options: [
      "Teknik bulguyu aksiyona dönüştürecek bağlam ve doğrulanabilirlik eksiktir",
      "Kısa rapor her zaman daha iyidir",
      "Kanıt paylaşmak her durumda gereksizdir",
      "Çözüm önerisi güvenlik raporunda olmamalıdır"
    ],
    correctLetter: "A",
    measured: "Pentest reporting, remediation communication."
  },
  {
    id: 20,
    text: "Bir uygulamada oturum çerezleri HttpOnly , Secure ve uygun SameSite ayarları olmadan kullanılmaktadır. Bu durum hangi riskleri artırır?",
    options: [
      "XSS etkisiyle çerez okunması, güvensiz bağlantıda taşınması ve CSRF riskleri",
      "Çerezlerin daha hızlı çalışması",
      "Oturum güvenliğinin otomatik artması",
      "Çerezlerin sadece tasarım amacı taşıması"
    ],
    correctLetter: "A",
    measured: "Cookie security, session hardening."
  },
  {
    id: 21,
    text: "Bir kurumda loglar yalnızca saldırıya uğrayan sunucunun lokal diskinde tutulmaktadır. Saldırgan logları silmiştir. Olay analizi yapılamamaktadır. Ne eksiktir?",
    options: [
      "Merkezi, bütünlüğü korunan, erişim kontrollü ve zaman senkronizasyonlu loglama",
      "Log üretmemek",
      "Logları sadece ekranda göstermek",
      "Logları manuel e-posta ile göndermek"
    ],
    correctLetter: "A",
    measured: "Security logging, forensic readiness, log integrity."
  },
  {
    id: 22,
    text: "Bir API’de rate limit yoktur. Saldırgan çok sayıda deneme yaparak hem servisi yavaşlatmakta hem de token tahmin etmeye çalışmaktadır. Hangi kontrol daha uygundur?",
    options: [
      "Rate limiting, anomaly detection, account lockout ve abuse monitoring",
      "Sadece frontend uyarısı",
      "API endpoint adını değiştirmek",
      "JSON yerine XML kullanmak"
    ],
    correctLetter: "A",
    measured: "API abuse prevention, brute force protection."
  },
  {
    id: 23,
    text: "Bir güvenlik yaması aylarca uygulanmamaktadır. Ekip “sistem çalışıyor, bozmayalım” demektedir. Güvenlik yöneticisinin dengeli yaklaşımı ne olmalıdır?",
    options: [
      "Risk bazlı patch yönetimi, test ortamında doğrulama ve planlı yaygınlaştırma yapmak",
      "Yamaları hiçbir zaman uygulamamak",
      "Tüm yamaları test etmeden aynı anda production’a geçirmek",
      "Yama sürecini sadece kullanıcıya bırakmak"
    ],
    correctLetter: "A",
    measured: "Patch management, risk-based operations."
  },
  {
    id: 24,
    text: "Bir uygulama kullanıcıdan aldığı URL’ye sunucu tarafından istek atmaktadır. Kontrol yoktur. Saldırgan iç ağdaki metadata veya yönetim servislerine istek yaptırabilmektedir. Bu hangi zafiyettir?",
    options: [
      "SSRF",
      "XSS",
      "CSRF",
      "ARP spoofing"
    ],
    correctLetter: "A",
    measured: "SSRF, server-side request control."
  },
  {
    id: 25,
    text: "Bir kurum dış servis sızıntılarından gelen parola listeleriyle yapılan giriş denemelerinde birçok başarılı oturum görmektedir. Kullanıcılar aynı parolayı farklı yerlerde kullanmıştır. Bu hangi saldırıdır?",
    options: [
      "Credential stuffing",
      "DNSSEC bypass",
      "Load balancing",
      "Packet switching"
    ],
    correctLetter: "A",
    measured: "Account takeover, credential reuse risk."
  },
  {
    id: 26,
    text: "Bir IDS uyarısı tek başına düşük öncelikli görünmektedir. Ancak aynı kaynak IP’nin önce port taraması, sonra başarısız giriş denemeleri, sonra başarılı giriş yaptığı görülmektedir. Bu durumda ne önemlidir?",
    options: [
      "Olayların zaman içinde korelasyonu ve saldırı zinciri analizi",
      "Her uyarıyı tek başına önemsiz saymak",
      "Sadece son loga bakmak",
      "Kaynak IP’yi her zaman güvenli kabul etmek"
    ],
    correctLetter: "A",
    measured: "Threat hunting, event correlation, kill chain analysis."
  },
  {
    id: 27,
    text: "Bir kurum zafiyetleri sadece CVSS skoruna göre sıralamaktadır. Ancak internete açık, aktif exploit’i olan orta seviye bir açık beklerken iç ağda erişimi zor bir yüksek skorlu açık öne alınmıştır. Ne eksiktir?",
    options: [
      "Varlık kritikliği, maruziyet, exploit durumu ve iş etkisini içeren risk bazlı önceliklendirme",
      "CVSS dışında hiçbir şey değerlendirilmemelidir",
      "Orta seviye açıklar asla önemli değildir",
      "Zafiyet yönetimi sadece tarama çalıştırmaktır"
    ],
    correctLetter: "A",
    measured: "Vulnerability prioritization, exposure-based risk."
  },
  {
    id: 28,
    text: "Bir şirket güvenliği yalnızca son aşama pentest olarak ele almaktadır. Geliştirme sürecinde tehdit modelleme, güvenli kod kontrolü ve bağımlılık taraması yoktur. Hangi yaklaşım eksiktir?",
    options: [
      "Secure SDLC ve shift-left security",
      "Sadece canlı ortam testi",
      "Güvenliği production sonrası düşünmek",
      "Tüm güvenlik testlerini kaldırmak"
    ],
    correctLetter: "A",
    measured: "Secure development lifecycle, proactive security."
  },
  {
    id: 29,
    text: "Bir kurumda üçüncü taraf tedarikçiye geniş VPN erişimi verilmiştir. Hangi sistemlere eriştiği, hangi hesapları kullandığı ve olay bildirimi şartları net değildir. Bu hangi risk alanıdır?",
    options: [
      "Third-party/vendor risk management",
      "CDN performansı",
      "CSS güvenliği",
      "Veri normalizasyonu"
    ],
    correctLetter: "A",
    measured: "Vendor security, privileged third-party access."
  },
  {
    id: 30,
    text: "Bir saldırı sonrası ekip sadece etkilenen sunucuyu temizleyip tekrar açmıştır. Ancak giriş vektörü, kalıcılık mekanizması ve çalınan kimlik bilgileri araştırılmamıştır. Bu neden risklidir?",
    options: [
      "Saldırgan aynı yöntemle tekrar girebilir veya içeride kalıcılık sürüyor olabilir",
      "Sunucu açıldıysa olay bitmiştir",
      "Kök neden analizi gereksizdir",
      "Kimlik bilgileri saldırı sonrası değiştirilmese de olur"
    ],
    correctLetter: "A",
    measured: "Root cause analysis, eradication, post-incident recovery. 4. Bilişim Sistemleri ve BT Yönetimi — 30 Zorlayıcı Soru"
  },
];

export const IS_MT_QUESTIONS = [
  {
    id: 2,
    text: "Bir şirkette satış siparişi girildiğinde stok düşmekte ancak muhasebe kaydı manuel yapılmaktadır. Ay sonunda stok, satış ve finans raporları tutmamaktadır. En kritik sistem ihtiyacı nedir?",
    options: [
      "Modüller arası uçtan uca entegrasyon, veri tutarlılığı ve işlem izlenebilirliği",
      "Daha fazla Excel kontrol listesi",
      "Muhasebe işlemlerini ay sonunda topluca tahmin etmek",
      "Satış ekibinin stok görmesini engellemek"
    ],
    correctLetter: "A",
    measured: "ERP integration, transaction consistency."
  },
  {
    id: 3,
    text: "Bir hizmet masasında talepler “kim daha çok ısrar ederse” ona göre öne alınmaktadır. Kritik üretim sistemi kesintisi beklerken düşük etkili bir kullanıcı isteği çözülmektedir. ITIL açısından doğru yaklaşım nedir?",
    options: [
      "Talepleri talep sahibinin unvanına göre sıralamak",
      "Etki ve aciliyet matrisine göre önceliklendirmek",
      "En kısa sürecek işi her zaman önce yapmak",
      "İlk gelen talebi her zaman önce çözmek"
    ],
    correctLetter: "B",
    measured: "ITIL prioritization, service impact thinking."
  },
  {
    id: 4,
    text: "Bir CRM sistemi teknik olarak kurulmuştur ancak satış ekibi görüşmeleri sisteme işlememektedir. Yönetim raporları eksik, müşteri geçmişi parçalı ve kampanyalar başarısızdır. Bu durumda temel problem nedir?",
    options: [
      "CRM teknolojisi yanında süreç sahipliği, veri disiplini ve kullanıcı benimsemesi kurulmamıştır",
      "CRM sistemlerinde kullanıcı girişi gerekmez",
      "Satış ekipleri CRM kullanmamalıdır",
      "Raporlama modülü kapatılırsa sorun çözülür"
    ],
    correctLetter: "A",
    measured: "CRM adoption, change management, data discipline."
  },
  {
    id: 5,
    text: "Bir projede iş birimi sürekli yeni istek eklemekte, proje yöneticisi bunları kayıt altına almadan ekibe iletmektedir. Teslim tarihi değişmemekte, kalite düşmektedir. Burada hangi yönetim disiplini eksiktir?",
    options: [
      "Kapsam değişiklik kontrolü, etki analizi ve paydaş beklenti yönetimi",
      "Her isteği sorgusuz kabul etme kültürü",
      "Proje planının sadece başlangıçta yapılması",
      "Teknik ekibin tüm ek işleri ücretsiz yapması"
    ],
    correctLetter: "A",
    measured: "Scope management, project governance."
  },
  {
    id: 6,
    text: "Aynı müşteri farklı sistemlerde farklı isim, telefon ve segment bilgisiyle kayıtlıdır. Pazarlama farklı, finans farklı müşteri sayısı raporlamaktadır. Yönetim hangi sayıya güveneceğini bilememektedir. Hangi yaklaşım gereklidir?",
    options: [
      "Master data management, veri sahipliği, veri kalitesi kuralları ve tekil doğruluk kaynağı",
      "Her departmanın kendi verisini doğru kabul etmesi",
      "Raporlardaki farkların manuel gizlenmesi",
      "Müşteri verisinin sistemlerden silinmesi"
    ],
    correctLetter: "A",
    measured: "MDM, data governance, single source of truth."
  },
  {
    id: 7,
    text: "Bir kurum yazılım satın alırken yalnızca lisans bedeline bakmaktadır. Entegrasyon, veri taşıma, eğitim, bakım, süreç değişimi ve kullanıcı direnci hesaba katılmamıştır. Kararın zayıf yönü nedir?",
    options: [
      "Toplam sahip olma maliyeti ve kurumsal etki analizi yapılmamıştır",
      "Yazılım maliyeti sadece lisans bedelidir",
      "Eğitim hiçbir zaman maliyet değildir",
      "En ucuz çözüm her zaman en düşük risklidir"
    ],
    correctLetter: "A",
    measured: "TCO, enterprise IT investment."
  },
  {
    id: 8,
    text: "Bir sistem canlıya alınmadan önce kullanıcı kabul testi yalnızca örnek birkaç ekran üzerinden yapılmıştır. Canlıda kullanıcılar “sistem çalışıyor ama gerçek sürecimize uymuyor” demektedir. En başta ne eksik yapılmıştır?",
    options: [
      "Gerçek iş senaryolarına dayalı kabul kriterleri ve UAT süreci tanımlanmamıştır",
      "Sunucu kapasitesi artırılmamıştır",
      "Kullanıcı kabul testi sadece teknik ekip tarafından yapılmalıdır",
      "İş birimi canlıya geçişten sonra dahil edilmelidir"
    ],
    correctLetter: "A",
    measured: "UAT, requirement validation, business fit."
  },
  {
    id: 9,
    text: "Kritik sistemlerin sahibi belli değildir. Arıza çıktığında kimin karar vereceği, kimin onay vereceği ve kimin iletişim yapacağı belirsizdir. Bu durum hangi eksikliğe işaret eder?",
    options: [
      "Sistem sahipliği, RACI benzeri sorumluluk matrisi ve yönetişim yapısı eksiktir",
      "Teknik ekip fazla sorumluluk almıştır",
      "Sistem sahipliği sadece yazılımcıya aittir",
      "Arızalarda karar mekanizmasına gerek yoktur"
    ],
    correctLetter: "A",
    measured: "IT governance, accountability, operational ownership."
  },
  {
    id: 10,
    text: "Bir iş sürekliliği planında yönetim “hangi sistem ne kadar sürede ayağa kalkmalı ve en fazla ne kadar veri kaybı kabul edilebilir?” sorularına cevap arıyor. Bu kararlar hangi kavramlarla ilgilidir?",
    options: [
      "RTO ve RPO",
      "RGB ve HEX",
      "DNS ve CSS",
      "SLA ve logo boyutu"
    ],
    correctLetter: "A",
    measured: "Business continuity, disaster recovery planning."
  },
  {
    id: 11,
    text: "Aynı KPI farklı raporlarda farklı değer üretmektedir. Bir rapor sipariş tarihini, diğeri fatura tarihini baz almaktadır. Teknik olarak ikisi de doğru hesaplanmıştır. Yönetim açısından asıl ihtiyaç nedir?",
    options: [
      "KPI tanımlarının iş bağlamıyla standartlaştırılması ve veri sözlüğü oluşturulması",
      "Raporların renklerinin aynı yapılması",
      "Farklı sonuç veren raporlardan birinin rastgele silinmesi",
      "KPI’ların teknik ekip tarafından gizlenmesi"
    ],
    correctLetter: "A",
    measured: "KPI governance, semantic consistency, data dictionary."
  },
  {
    id: 12,
    text: "Bir BT değişikliği canlıya etki analizi yapılmadan alınmıştır. Değişiklik küçük görünmesine rağmen bağlı sistemlerden biri çalışmamıştır. Eksik olan süreç nedir?",
    options: [
      "Change management, etki analizi ve geri dönüş planı",
      "Logo yönetimi",
      "Sosyal medya onayı",
      "Dosya sıkıştırma"
    ],
    correctLetter: "A",
    measured: "ITIL change enablement, dependency impact."
  },
  {
    id: 13,
    text: "Bir hizmet kesintisinde teknik ekip, iletişim ekibi ve iş birimi ayrı ayrı bilgi vermektedir. Kullanıcılara çelişkili açıklamalar gitmektedir. Bu olay yönetiminde ne eksiktir?",
    options: [
      "Olay komuta yapısı, iletişim planı ve tekil durum bilgisi yönetimi",
      "Daha fazla e-posta göndermek",
      "Tüm ekiplerin ayrı açıklama yapması",
      "Kesintiyi hiç duyurmamak"
    ],
    correctLetter: "A",
    measured: "Incident communication, crisis coordination."
  },
  {
    id: 14,
    text: "ERP geçişinde eski sistemdeki ürün kartları yeni sisteme taşınacaktır. Ancak ürün kodları tekrar eden, ölçü birimleri tutarsız ve bazı kayıtlar eksiktir. Veri taşıma öncesi ne yapılmalıdır?",
    options: [
      "Veri temizliği, eşleme kuralları, doğrulama ve test migration yapılmalıdır",
      "Tüm veriler olduğu gibi aktarılmalıdır",
      "Hatalı kayıtlar yeni sistemde kendiliğinden düzelir",
      "Veri taşıma sadece teknik kopyalama işlemidir"
    ],
    correctLetter: "A",
    measured: "Data migration, data cleansing, ERP readiness."
  },
  {
    id: 15,
    text: "Bir proje teslim edilmiş ancak iş birimi “başarılı sayılır mı?” konusunda kararsızdır. Başta ölçülebilir hedef ve kabul kriterleri belirlenmemiştir. Bu eksiklik neye yol açar?",
    options: [
      "Başarı algısı kişisel yoruma kalır ve teslimat tartışmalı hale gelir",
      "Proje her durumda başarılı sayılır",
      "Kabul kriterleri sadece teknik projelerde gerekir",
      "Kullanıcı memnuniyeti ölçülmezse daha iyi olur"
    ],
    correctLetter: "A",
    measured: "Success criteria, acceptance management."
  },
  {
    id: 16,
    text: "Her departman kendi ihtiyacı için farklı SaaS araçları satın almaktadır. Araçlar entegre değildir, veri parçalanmakta ve güvenlik görünürlüğü azalmaktadır. Kurumsal mimari açısından sorun nedir?",
    options: [
      "İş-IT uyumu, uygulama portföy yönetimi ve entegrasyon yönetişimi eksiktir",
      "Departmanların bağımsız yazılım alması her zaman en iyi çözümdür",
      "Entegrasyon kurumsal sistemlerde gereksizdir",
      "BT ekibi tüm iş ihtiyaçlarından uzak durmalıdır"
    ],
    correctLetter: "A",
    measured: "Enterprise architecture, application portfolio management."
  },
  {
    id: 17,
    text: "Bir SLA sözleşmesinde “sistem hızlı çalışmalıdır” yazmaktadır. Ancak yanıt süresi, uptime, ölçüm yöntemi ve raporlama periyodu tanımlanmamıştır. Bu SLA neden zayıftır?",
    options: [
      "Ölçülebilir, denetlenebilir ve karşılıklı anlaşılabilir hizmet seviyesi tanımı yoktur",
      "SLA her zaman belirsiz olmalıdır",
      "SLA sadece fiyat bilgisi içerir",
      "Performans ölçümü hizmet yönetiminde gereksizdir"
    ],
    correctLetter: "A",
    measured: "SLA definition, measurable service management."
  },
  {
    id: 18,
    text: "Yeni sistem teknik olarak doğru kurulmuştur ancak kullanıcı eğitimi yapılmamış, süreç dokümanı verilmemiş ve destek kanalı açıklanmamıştır. Canlı geçiş sonrası talep patlaması olmuştur. Eksik olan nedir?",
    options: [
      "Değişim yönetimi, eğitim ve canlı geçiş destek planı",
      "Daha karmaşık ekran tasarımı",
      "Daha uzun parola politikası",
      "Sunucu adını değiştirmek"
    ],
    correctLetter: "A",
    measured: "Change adoption, training, go-live support."
  },
  {
    id: 19,
    text: "Bir CRM kampanya otomasyonu müşteri segmentasyonu yapılmadan kurulmuştur. Her müşteriye aynı teklif gönderilmektedir. Dönüşüm düşük ve bazı müşteriler rahatsızdır. Temel eksiklik nedir?",
    options: [
      "Segmentasyon, hedefleme ve müşteri tercih yönetimi yoktur",
      "CRM’de kampanya yapılmaz",
      "Her müşteriye aynı mesaj göndermek her zaman daha iyidir",
      "Kampanyalar veri gerektirmez"
    ],
    correctLetter: "A",
    measured: "CRM strategy, segmentation, customer experience."
  },
  {
    id: 20,
    text: "Bir kurumda onay süreçleri e-posta ile yürümektedir. Hangi belgenin kim tarafından ne zaman onaylandığı ve hangi versiyona onay verildiği belirsizdir. Ne eksiktir?",
    options: [
      "İş akışı yönetimi, versiyon kontrolü ve denetlenebilir onay kayıtları",
      "Daha kısa e-posta başlıkları",
      "Sadece sözlü onay",
      "Onay kayıtlarını silmek"
    ],
    correctLetter: "A",
    measured: "Workflow governance, auditability."
  },
  {
    id: 21,
    text: "Bir proje risk kaydı tutulmamaktadır. Tedarikçi gecikmesi, veri kalitesi sorunu ve kullanıcı direnci ancak gerçekleşince fark edilmektedir. Risk yönetiminin temel amacı nedir?",
    options: [
      "Belirsizlikleri önceden görünür kılmak ve azaltıcı aksiyon planlamak",
      "Riskleri proje sonunda yazmak",
      "Riskleri teknik ekipten saklamak",
      "Belirsizlik yokmuş gibi ilerlemek"
    ],
    correctLetter: "A",
    measured: "Project risk management, proactive planning."
  },
  {
    id: 22,
    text: "Kurumsal mimari ekibi mevcut sistem envanterini çıkarmadan hedef mimari önermektedir. Bazı eski sistemlerin kritik entegrasyon sağladığı sonradan anlaşılmıştır. Eksik olan nedir?",
    options: [
      "As-is analizi, bağımlılık haritası ve geçiş planı",
      "Mevcut sistemler her zaman önemsizdir",
      "Envanter yalnızca muhasebe içindir",
      "Tüm sistemler aynı risk seviyesindedir"
    ],
    correctLetter: "A",
    measured: "Enterprise architecture assessment, dependency mapping."
  },
  {
    id: 23,
    text: "Bir hizmet masasında tüm talepler aynı kategoriye alınmaktadır. Kritik kesintiler, erişim talepleri ve bilgi istekleri aynı havuza düşmektedir. Bu durumun sonucu ne olur?",
    options: [
      "Önceliklendirme, SLA takibi ve kaynak planlaması bozulur",
      "Her talep aynı olduğundan sorun yoktur",
      "Hizmet kalitesi otomatik artar",
      "Talep sınıflandırması gereksizdir"
    ],
    correctLetter: "A",
    measured: "Service request categorization, SLA operations."
  },
  {
    id: 24,
    text: "Bir kurum müşteri verilerini farklı sistemlere kopyalamaktadır. Hangi sistemde hangi verinin bulunduğu, kimlerin eriştiği ve saklama süresi bilinmemektedir. Bu hangi yönetim riskini doğurur?",
    options: [
      "Veri koruma, uyum ve erişim yönetişimi riski",
      "Veri çoğaldıkça risk azalır",
      "Müşteri verisi sınırsız paylaşılabilir",
      "Uyumluluk sadece hukuk ekibinin konusudur"
    ],
    correctLetter: "A",
    measured: "Compliance, privacy governance, data lifecycle."
  },
  {
    id: 25,
    text: "Bir yazılım seçiminde teknik özellik listesi çok güçlü görünen bir ürün seçilmiştir. Ancak iş akışına uymadığı ve kullanıcılar tarafından benimsenmediği için proje başarısız olmuştur. Seçim sürecinde ne eksik kalmıştır?",
    options: [
      "İş süreci uyumu, kullanıcı deneyimi, değişim etkisi ve gerçek kullanım senaryosu değerlendirmesi",
      "Özellik sayısı yeterliyse başka değerlendirme gerekmez",
      "Kullanıcı benimsemesi teknik projelerde önemsizdir",
      "İş süreci yazılım seçiminden bağımsızdır"
    ],
    correctLetter: "A",
    measured: "Business fit, user adoption, software selection."
  },
  {
    id: 26,
    text: "Bir ERP projesinde özelleştirme talepleri hızla artmaktadır. Standart ürün yapısı bozulmakta, bakım ve sürüm yükseltme maliyeti yükselmektedir. En doğru yönetim yaklaşımı nedir?",
    options: [
      "Her özelleştirme iş değeri, süreç standardizasyonu, bakım maliyeti ve alternatif çözüm açısından değerlendirilmelidir",
      "Her kullanıcı isteği doğrudan geliştirilmelidir",
      "Güncelleme maliyeti proje konusu değildir",
      "ERP özelleştirilmezse kullanılamaz"
    ],
    correctLetter: "A",
    measured: "ERP customization governance, lifecycle cost."
  },
  {
    id: 27,
    text: "Bir raporlama ekibi çok sayıda dashboard üretmektedir fakat karar süreçlerinde kullanılmamaktadır. Yönetim hâlâ eski Excel dosyalarıyla karar almaktadır. BI açısından eksik olan nedir?",
    options: [
      "Dashboard’ların KPI, karar noktası, aksiyon sahibi ve iş süreciyle ilişkilendirilmesi",
      "Daha fazla grafik eklemek",
      "Dashboard sayısını sınırsız artırmak",
      "Raporları sadece PDF yapmak"
    ],
    correctLetter: "A",
    measured: "BI adoption, KPI alignment, decision intelligence."
  },
  {
    id: 28,
    text: "Bir tedarikçi kritik sistemi yönetmektedir. Sözleşmede erişim sınırları, güvenlik yükümlülükleri, log paylaşımı ve olay bildirimi şartları yoktur. Bu hangi alanın eksikliğidir?",
    options: [
      "Vendor risk management ve üçüncü taraf güvenlik yönetişimi",
      "Grafik tasarım yönetimi",
      "Stok sayımı",
      "Donanım amortismanı"
    ],
    correctLetter: "A",
    measured: "Third-party risk, supplier governance."
  },
  {
    id: 29,
    text: "İş birimi “bize hızlı bir sistem lazım” diyerek talep açmaktadır. Teknik ekip doğrudan geliştirmeye başlamıştır. Sonradan asıl ihtiyacın raporlama değil süreç onayı olduğu anlaşılmıştır. İlk yapılması gereken neydi?",
    options: [
      "İş problemi, kullanıcı rolleri, süreç akışı, karar noktaları ve kabul kriterlerini netleştirmek",
      "Hemen kod yazmak",
      "Sunucu satın almak",
      "Kullanıcıdan detay istememek"
    ],
    correctLetter: "A",
    measured: "Business analysis, requirement elicitation."
  },
  {
    id: 30,
    text: "Bir BT stratejisi hazırlanırken şirketin büyüme hedefleri, regülasyon yükümlülükleri, insan kaynağı kapasitesi ve operasyonel riskleri dikkate alınmamıştır. Bu strateji neden zayıftır?",
    options: [
      "Teknoloji yol haritası iş gerçeklerinden ve kurumsal kapasiteden kopabilir",
      "BT stratejisi iş stratejisinden tamamen bağımsız olmalıdır",
      "İnsan kaynağı teknoloji kararlarını etkilemez",
      "Risk analizi strateji çalışmasına dahil edilmez"
    ],
    correctLetter: "A",
    measured: "IT strategy, business alignment, capability planning. 5. Bulut, Altyapı ve DevOps — 30 Soru"
  },
];

export const CL_DN_QUESTIONS = [
  {
    id: 2,
    text: "Deployment işlemleri elle yapılmaktadır. Bazen yanlış branch, bazen eksik environment variable, bazen de eski build production’a çıkmaktadır. DevOps açısından kalıcı çözüm nedir?",
    options: [
      "Deployment’ı yalnızca gece yapmak",
      "Otomatik, testli, onaylı, rollback destekli ve izlenebilir CI/CD pipeline kurmak",
      "Her geliştiricinin kendi deployment yöntemini kullanması",
      "Hata olursa sunucuyu yeniden başlatmak"
    ],
    correctLetter: "B",
    measured: "CI/CD maturity, release automation, deployment safety."
  },
  {
    id: 3,
    text: "Kubernetes cluster’ında bazı podlar yoğun trafikte aşırı bellek tüketerek aynı node üzerindeki diğer servisleri etkilemektedir. Deployment dosyalarında resource request/limit yoktur. En doğru yaklaşım hangisidir?",
    options: [
      "Resource requests/limits, HPA/VPA ve kapasite planlamasını birlikte ele almak",
      "Pod adlarını uzatmak",
      "Kubernetes kaynak yönetimi yapamaz",
      "Tüm podları tek node’a sabitlemek"
    ],
    correctLetter: "A",
    measured: "Kubernetes resource management, autoscaling, capacity planning."
  },
  {
    id: 4,
    text: "Bir bulut veritabanı public IP ile internete açıktır. Parola güçlüdür fakat security group 0.0.0.0/0 erişimine izin vermektedir. Bu tasarım neden risklidir?",
    options: [
      "Güçlü parola tek başına yeterli değildir; ağ erişimi, kimlik, şifreleme ve izleme birlikte düşünülmelidir",
      "Public IP veritabanını otomatik güvenli yapar",
      "Security group maliyet ayarıdır",
      "Veritabanı internete açıksa backup gerekmez"
    ],
    correctLetter: "A",
    measured: "Cloud security, network exposure, defense in depth."
  },
  {
    id: 5,
    text: "CDN arkasındaki uygulamada statik dosyalar hızlı yüklenmektedir. Ancak yeni sürüm sonrası bazı kullanıcılar eski JavaScript dosyasını aldığı için uygulama hatalı çalışmaktadır. Hangi strateji gerekir?",
    options: [
      "Cache invalidation, dosya versiyonlama/hashleme ve TTL yönetimi",
      "Kullanıcıya tarayıcı önbelleğini manuel temizletmek tek çözümdür",
      "CDN kullanmak her zaman hatadır",
      "Statik dosyalar asla cache’lenmemelidir"
    ],
    correctLetter: "A",
    measured: "CDN cache strategy, asset versioning, release reliability."
  },
  {
    id: 6,
    text: "Mikroservis sisteminde kullanıcı şikayeti geldiğinde isteğin hangi servislerde yavaşladığı bilinmemektedir. Loglar dağınık, trace ID yok, metrikler servis bazında ilişkilendirilememektedir. Ne eksiktir?",
    options: [
      "Observability, merkezi loglama, distributed tracing ve korele metrikler",
      "Daha büyük sunucu",
      "Arayüz temasını değiştirmek",
      "Log üretimini tamamen kapatmak"
    ],
    correctLetter: "A",
    measured: "Observability, tracing, distributed system debugging."
  },
  {
    id: 7,
    text: "Altyapı kaynakları bulut panelinden manuel oluşturulmaktadır. Test, staging ve production ortamları arasında farklar oluşmakta, aynı ortam tekrar üretilememektedir. Sürdürülebilir çözüm nedir?",
    options: [
      "Infrastructure as Code, versiyonlama ve kod inceleme süreçleriyle altyapı yönetmek",
      "Panel ekran görüntüsü saklamak",
      "Kurulumu sadece bir kişinin bilmesi",
      "Ortam farklarını doğal kabul etmek"
    ],
    correctLetter: "A",
    measured: "IaC, environment reproducibility, infra governance."
  },
  {
    id: 8,
    text: "Autoscaling yalnızca CPU kullanımına göre yapılmaktadır. Ancak uygulama asıl olarak kuyruk uzunluğu arttığında yavaşlamaktadır. CPU düşük görünürken kullanıcılar beklemektedir. Ne yapılmalıdır?",
    options: [
      "Ölçekleme metriği workload davranışına göre seçilmeli; queue length gibi iş metrikleri kullanılmalıdır",
      "CPU metriği her problem için yeterlidir",
      "Kuyruk uzunluğu altyapı kararıyla ilgili değildir",
      "Autoscaling manuel yapılmalıdır"
    ],
    correctLetter: "A",
    measured: "Autoscaling strategy, workload-specific metrics."
  },
  {
    id: 9,
    text: "Şirket multi-region mimari kurmak istemektedir. Ancak veri replikasyonu, tutarlılık, latency, maliyet ve failover testi analiz edilmeden servisler ikinci bölgeye kopyalanacaktır. Bulut mimarı hangi riski vurgulamalıdır?",
    options: [
      "Multi-region sadece kopyalama değildir; veri tutarlılığı, trafik yönlendirme, failover ve operasyon maliyeti tasarlanmalıdır",
      "Multi-region her zaman daha ucuzdur",
      "İki region kullanılırsa monitoring gerekmez",
      "Failover testi olmadan mimari güvenilir sayılır"
    ],
    correctLetter: "A",
    measured: "Multi-region architecture, DR, consistency trade-off."
  },
  {
    id: 10,
    text: "Ekip “DevOps yaptık” diyerek sadece bir CI aracı kurmuştur. Ancak geliştirme, operasyon ve güvenlik ekipleri hâlâ ayrı hedeflerle çalışmakta, sorunlar birbirine atılmaktadır. Eksik olan nedir?",
    options: [
      "DevOps kültürü, ortak sorumluluk, geri bildirim döngüsü ve sürekli iyileştirme",
      "Daha fazla araç satın almak",
      "Operasyon ekibini süreçten dışlamak",
      "Testleri tamamen manuel bırakmak"
    ],
    correctLetter: "A",
    measured: "DevOps culture, collaboration, operating model."
  },
  {
    id: 11,
    text: "Bir sistem tek availability zone üzerinde çalışmaktadır. Veritabanı da aynı AZ’dedir. AZ kesintisinde tüm hizmet durmaktadır. En doğru mimari iyileştirme nedir?",
    options: [
      "Multi-AZ tasarım, otomatik failover ve yedeklilik stratejisi",
      "Sunucu adını değiştirmek",
      "Backup almamak",
      "Tek disk performansını artırmak"
    ],
    correctLetter: "A",
    measured: "High availability, fault domain, cloud resilience."
  },
  {
    id: 12,
    text: "Container image içinde build araçları, debug paketleri, eski bağımlılıklar ve gereksiz dosyalar bulunmaktadır. Bu durum neden sorunludur?",
    options: [
      "Image boyutu ve saldırı yüzeyi artar; güvenlik ve deployment süresi etkilenir",
      "Büyük image her zaman daha güvenlidir",
      "Debug araçları production’da zorunludur",
      "Eski bağımlılıklar performansı garanti eder"
    ],
    correctLetter: "A",
    measured: "Container hardening, image optimization, supply chain security."
  },
  {
    id: 13,
    text: "Kubernetes ortamında dış dünyadan pod IP’lerine doğrudan erişilmeye çalışılmaktadır. Pod yeniden başladığında IP değişmekte ve bağlantılar bozulmaktadır. Doğru yaklaşım nedir?",
    options: [
      "Service ve gerekirse Ingress/Gateway ile kararlı erişim soyutlaması kullanmak",
      "Pod IP’lerini manuel ezberlemek",
      "Kubernetes’te ağ soyutlaması kullanmamak",
      "Her pod’a public IP vermek"
    ],
    correctLetter: "A",
    measured: "Kubernetes networking, service abstraction."
  },
  {
    id: 14,
    text: "CI pipeline’da test adımı atlanmaktadır. Kod derlense bile integration hataları production’da ortaya çıkmaktadır. CI’nin asıl görevi nedir?",
    options: [
      "Kod değişikliklerini otomatik test ederek entegrasyon sorunlarını erken yakalamak",
      "Kod yazmayı gereksiz hale getirmek",
      "Deployment’ı manuel yapmak",
      "Sadece paket dosyası üretmek"
    ],
    correctLetter: "A",
    measured: "Continuous integration, automated quality gates."
  },
  {
    id: 15,
    text: "Loglar yalnızca lokal diskte tutulmaktadır. Pod yeniden başladığında veya sunucu silindiğinde loglar kaybolmaktadır. Incident analizi zorlaşmaktadır. Doğru yaklaşım nedir?",
    options: [
      "Merkezi, kalıcı, aranabilir ve erişim kontrollü log toplama mimarisi kurmak",
      "Log üretmemek",
      "Logları sadece terminalde göstermek",
      "Hataları kullanıcıya sormak"
    ],
    correctLetter: "A",
    measured: "Logging architecture, incident observability."
  },
  {
    id: 16,
    text: "Health check sadece sunucunun açık olup olmadığını kontrol etmektedir. Uygulama ayakta görünmekte ama veritabanına bağlanamamaktadır. Daha doğru sağlık kontrolü nasıl olmalıdır?",
    options: [
      "Uygulamanın kritik bağımlılıklarını ve hazır olma durumunu kontrol eden liveness/readiness ayrımı yapılmalıdır",
      "Ping yeterlidir",
      "Health check gereksizdir",
      "Kullanıcı hatayı fark edince kontrol yapılır"
    ],
    correctLetter: "A",
    measured: "Health checks, readiness/liveness, dependency monitoring."
  },
  {
    id: 17,
    text: "Bulut maliyetleri hızla artmaktadır. Kullanılmayan diskler, kapanmamış test sunucuları ve aşırı ayrılmış kaynaklar vardır. Hangi yaklaşım gerekir?",
    options: [
      "FinOps, kaynak etiketleme, kullanım analizi ve kapasite optimizasyonu",
      "Maliyet raporlarını kapatmak",
      "Tüm region’larda kaynak açmak",
      "Kullanılmayan kaynakları izlememek"
    ],
    correctLetter: "A",
    measured: "Cloud cost management, FinOps."
  },
  {
    id: 18,
    text: "Gizli anahtarlar Git reposuna yazılmıştır. Daha sonra repo private olsa bile geçmiş commit’lerde anahtarlar kalmıştır. Ne yapılmalıdır?",
    options: [
      "Anahtarlar rotate edilmeli, secret manager kullanılmalı ve repo geçmişi/erişimleri incelenmelidir",
      "Repo private ise hiçbir risk yoktur",
      "Anahtarların adını değiştirmek yeterlidir",
      "Secrets koda yazılmalıdır"
    ],
    correctLetter: "A",
    measured: "Secret management, credential rotation, source control hygiene."
  },
  {
    id: 19,
    text: "Deployment sırasında eski sürüm tamamen kapatılıp yeni sürüm açılmaktadır. Hata çıkarsa geri dönüş uzun sürmekte ve kullanıcılar kesinti yaşamaktadır. Hangi stratejiler daha uygundur?",
    options: [
      "Rolling, blue-green veya canary deployment ile kontrollü geçiş ve hızlı rollback",
      "Her deployment’da tüm sistemi kapatmak",
      "Rollback planı yapmamak",
      "Eski sürümü doğrudan silmek"
    ],
    correctLetter: "A",
    measured: "Deployment strategy, rollback, release risk reduction."
  },
  {
    id: 20,
    text: "Bir sistemde CPU düşük, ağ normal, ancak disk I/O sürekli tıkanmaktadır. Ekip sadece CPU artırmayı önermektedir. Bu yaklaşım neden zayıftır?",
    options: [
      "Darboğaz doğru tespit edilmeden kaynak artırmak maliyetli ve etkisiz olabilir",
      "CPU her darboğazı çözer",
      "Disk I/O performansı sistemle ilgisizdir",
      "Ağ normalse sistemde sorun olamaz"
    ],
    correctLetter: "A",
    measured: "Bottleneck analysis, capacity troubleshooting."
  },
  {
    id: 21,
    text: "Bir edge computing senaryosunda fabrika sensör verilerinin merkezi buluta gitmeden yerelde işlenmesi istenmektedir. Temel teknik gerekçe nedir?",
    options: [
      "Düşük gecikme, bağlantı kesintisine dayanıklılık ve yerel karar ihtiyacı",
      "Bulut hiçbir zaman kullanılmaz",
      "Edge her zaman daha ucuzdur",
      "Veritabanı ihtiyacı tamamen ortadan kalkar"
    ],
    correctLetter: "A",
    measured: "Edge computing, latency, local resilience."
  },
  {
    id: 22,
    text: "Bir blockchain tabanlı sistemde işlemler yazıldıktan sonra geri dönüş çok zordur. Geliştirici “hatalı işlem olursa veritabanından düzeltiriz” demektedir. Bu yorum neden yanlıştır?",
    options: [
      "Blockchain’de değiştirilemezlik ve akıllı sözleşme tasarımı hataları geri almayı zorlaştırır",
      "Blockchain klasik veritabanıyla tamamen aynıdır",
      "Hatalı işlem hiçbir zaman olmaz",
      "İmmutability güvenlikle ilgisizdir"
    ],
    correctLetter: "A",
    measured: "Blockchain immutability, smart contract risk."
  },
  {
    id: 23,
    text: "API Gateway kullanılmadan tüm mikroservisler doğrudan internete açılmıştır. Auth, rate limit ve logging her serviste farklı uygulanmaktadır. Gateway’in sağlayabileceği temel fayda nedir?",
    options: [
      "Ortak güvenlik, yönlendirme, rate limit ve gözlemlenebilirlik katmanlarını merkezi yönetmek",
      "Veritabanını kaldırmak",
      "Frontend tasarımını yapmak",
      "Tüm servisleri tek tabloya yazmak"
    ],
    correctLetter: "A",
    measured: "API gateway, cross-cutting concerns."
  },
  {
    id: 24,
    text: "Kubernetes deployment’ında readiness probe yoktur. Pod başlar başlamaz servis trafiği almaktadır fakat uygulama config yüklemesini ve bağlantılarını tamamlamamıştır. Risk nedir?",
    options: [
      "Hazır olmayan podlara trafik giderek hata oranı artabilir",
      "Readiness probe sadece görsel ayardır",
      "Kubernetes trafik yönlendirmez",
      "Pod hazır olmasa da kullanıcı etkilenmez"
    ],
    correctLetter: "A",
    measured: "Kubernetes probes, readiness, service reliability."
  },
  {
    id: 25,
    text: "Monitoring yalnızca CPU ve RAM’e bakmaktadır. Kullanıcılar hata alırken sunucu metrikleri normal görünmektedir. Eksik olan nedir?",
    options: [
      "Uygulama seviyesinde error rate, latency, throughput ve kullanıcı etkisini gösteren SLI/SLO metrikleri",
      "CPU yeterlidir",
      "Hata oranı izlenmemelidir",
      "Monitoring sadece donanım içindir"
    ],
    correctLetter: "A",
    measured: "SRE metrics, SLI/SLO, service reliability."
  },
  {
    id: 26,
    text: "Production ve staging aynı veritabanını kullanmaktadır. Staging testinde gerçek müşteri kayıtları değişmiştir. Bu hangi temel hatadır?",
    options: [
      "Ortam izolasyonu ve güvenli test verisi yönetimi eksiktir",
      "Staging gereksizdir",
      "Production verisi testte değiştirilebilir",
      "Veritabanı kullanımı hatadır"
    ],
    correctLetter: "A",
    measured: "Environment isolation, data safety."
  },
  {
    id: 27,
    text: "Yedekleme sistemi vardır fakat hiç restore testi yapılmamıştır. Felaket anında yedeklerin bozuk olduğu anlaşılmıştır. Eksik olan nedir?",
    options: [
      "Düzenli geri yükleme testi, RTO/RPO doğrulaması ve yedek bütünlüğü kontrolü",
      "Backup varsa test gerekmez",
      "Restore süresi önemsizdir",
      "Yedekler her zaman çalışır"
    ],
    correctLetter: "A",
    measured: "Backup validation, disaster recovery readiness."
  },
  {
    id: 28,
    text: "Bir servis dış bağımlılığa istek atarken sınırsız retry yapmaktadır. Dış servis yavaşladığında retry trafiği daha da artmakta ve sistem genelinde çöküş başlamaktadır. Bu hangi risktir?",
    options: [
      "Retry storm; retry politikası backoff, jitter, limit ve circuit breaker ile tasarlanmalıdır",
      "Retry sayısı arttıkça sistem her zaman iyileşir",
      "Dış servis bozulunca daha çok istek atmak en iyi çözümdür",
      "Retry güvenilirliği her zaman artırır"
    ],
    correctLetter: "A",
    measured: "Resilience engineering, retry strategy."
  },
  {
    id: 29,
    text: "Bulut güvenlik gruplarında yönetim portları 0.0.0.0/0 ile internete açıktır. Ekip “parola güçlü” diyerek bunu kabul etmektedir. En doğru yaklaşım nedir?",
    options: [
      "Yönetim erişimini kısıtlamak, bastion/VPN kullanmak, MFA ve least privilege uygulamak",
      "Parola güçlü olduğu için tüm IP’lere açık bırakmak",
      "Yönetim portlarını daha görünür yapmak",
      "Güvenlik grubu sadece maliyet ayarıdır"
    ],
    correctLetter: "A",
    measured: "Cloud network security, privileged access hardening."
  },
  {
    id: 30,
    text: "Bir container image içinde ortam konfigürasyonları ve parolalar sabit olarak gömülmüştür. Farklı ortam için yeniden image build edilmektedir. Daha doğru yaklaşım nedir?",
    options: [
      "Config ve secret değerlerini image’dan ayırmak, environment variable/config map/secret manager kullanmak",
      "Her ortam için ayrı kaynak kod yazmak",
      "Parolaları Dockerfile içine yazmak",
      "Config değerlerini tamamen kaldırmak"
    ],
    correctLetter: "A",
    measured: "Twelve-factor app, config management, secret handling."
  },
];


export const SD_MATRIX = {
  "Q1": {  SD: 0.95, fullstack: 0.95, architect: 0.70, qa: 0.15, game: 0.05, mobile: 0.05  },
  "Q2": {  SD: 0.90, fullstack: 0.85, architect: 0.80, qa: 0.10, game: 0.05, mobile: 0.10  },
  "Q3": {  SD: 0.85, architect: 0.95, fullstack: 0.70, qa: 0.05, game: 0.00, mobile: 0.05  },
  "Q4": {  SD: 0.90, fullstack: 0.80, architect: 0.80, qa: 0.10, game: 0.10, mobile: 0.10  },
  "Q5": {  SD: 0.85, fullstack: 0.80, architect: 0.70, qa: 0.15, game: 0.05, mobile: 0.10  },
  "Q6": {  SD: 0.80, fullstack: 0.80, architect: 0.70, qa: 0.10, game: 0.00, mobile: 0.00  },
  "Q7": {  SD: 0.80, architect: 0.80, fullstack: 0.70, qa: 0.15, game: 0.00, mobile: 0.00  },
  "Q8": {  SD: 0.85, fullstack: 0.85, architect: 0.60, qa: 0.15, game: 0.00, mobile: 0.10  },
  "Q9": {  SD: 0.80, fullstack: 0.80, architect: 0.70, qa: 0.25, game: 0.05, mobile: 0.05  },
  "Q10": {  SD: 0.80, qa: 0.95, fullstack: 0.40, architect: 0.30, game: 0.10, mobile: 0.10  },
  "Q11": {  SD: 0.80, game: 0.95, fullstack: 0.30, architect: 0.20, qa: 0.05, mobile: 0.05  },
  "Q12": {  SD: 0.75, game: 0.90, fullstack: 0.35, architect: 0.25, qa: 0.10, mobile: 0.05  },
  "Q13": {  SD: 0.80, game: 0.85, fullstack: 0.40, architect: 0.30, qa: 0.15, mobile: 0.00  },
  "Q14": {  SD: 0.75, game: 0.80, fullstack: 0.35, architect: 0.25, qa: 0.10, mobile: 0.05  },
  "Q15": {  SD: 0.80, game: 0.85, fullstack: 0.35, architect: 0.20, qa: 0.10, mobile: 0.05  },
  "Q16": {  SD: 0.85, mobile: 0.90, fullstack: 0.60, qa: 0.15, architect: 0.10, game: 0.05  },
  "Q17": {  SD: 0.80, mobile: 0.85, fullstack: 0.50, qa: 0.20, architect: 0.10, game: 0.00  },
  "Q18": {  SD: 0.75, mobile: 0.90, fullstack: 0.45, qa: 0.15, architect: 0.10, game: 0.05  },
  "Q19": {  SD: 0.80, mobile: 0.85, fullstack: 0.55, qa: 0.15, architect: 0.05, game: 0.00  },
  "Q20": {  SD: 0.75, mobile: 0.85, fullstack: 0.50, qa: 0.15, architect: 0.10, game: 0.00  },
  "Q21": {  SD: 0.70, mobile: 0.80, fullstack: 0.45, qa: 0.15, architect: 0.05, game: 0.05  },
  "Q22": {  SD: 0.85, qa: 0.95, fullstack: 0.25, architect: 0.15, game: 0.10, mobile: 0.10  },
  "Q23": {  SD: 0.80, qa: 0.90, fullstack: 0.30, architect: 0.15, game: 0.05, mobile: 0.10  },
  "Q24": {  SD: 0.75, qa: 0.90, fullstack: 0.35, architect: 0.15, game: 0.05, mobile: 0.05  },
  "Q25": {  SD: 0.75, qa: 0.85, fullstack: 0.40, architect: 0.10, game: 0.05, mobile: 0.00  },
  "Q26": {  SD: 0.80, qa: 0.85, fullstack: 0.40, architect: 0.10, game: 0.10, mobile: 0.10  },
  "Q27": {  SD: 0.85, architect: 0.95, fullstack: 0.65, qa: 0.15, game: 0.05, mobile: 0.05  },
  "Q28": {  SD: 0.80, architect: 0.90, fullstack: 0.60, qa: 0.10, game: 0.05, mobile: 0.10  },
  "Q29": {  SD: 0.80, architect: 0.85, fullstack: 0.70, qa: 0.15, game: 0.00, mobile: 0.05  },
  "Q30": {  SD: 0.80, architect: 0.80, fullstack: 0.70, qa: 0.25, game: 0.00, mobile: 0.00  },
};

export const DS_AI_MATRIX = {
  "Q1": {  "DS-AI": 0.95, ml: 0.95, mlops: 0.40, stats: 0.70, bi: 0.15, de: 0.10, nlp: 0.05  },
  "Q2": {  "DS-AI": 0.92, ml: 0.90, mlops: 0.35, stats: 0.80, bi: 0.20, de: 0.15, nlp: 0.05  },
  "Q3": {  "DS-AI": 0.90, ml: 0.85, mlops: 0.50, stats: 0.80, bi: 0.15, de: 0.10, nlp: 0.05  },
  "Q4": {  "DS-AI": 0.88, ml: 0.85, mlops: 0.40, stats: 0.75, bi: 0.10, de: 0.05, nlp: 0.05  },
  "Q5": {  "DS-AI": 0.90, ml: 0.90, mlops: 0.35, stats: 0.70, bi: 0.10, de: 0.10, nlp: 0.05  },
  "Q6": {  "DS-AI": 0.92, ml: 0.85, mlops: 0.90, stats: 0.40, bi: 0.20, de: 0.15, nlp: 0.05  },
  "Q7": {  "DS-AI": 0.95, nlp: 0.95, ml: 0.70, stats: 0.30, bi: 0.10, de: 0.05, mlops: 0.05  },
  "Q8": {  "DS-AI": 0.92, nlp: 0.85, ml: 0.75, stats: 0.25, bi: 0.10, de: 0.05, mlops: 0.05  },
  "Q9": {  "DS-AI": 0.90, nlp: 0.90, ml: 0.70, stats: 0.20, bi: 0.10, de: 0.05, mlops: 0.05  },
  "Q10": {  "DS-AI": 0.88, nlp: 0.85, ml: 0.65, stats: 0.25, bi: 0.10, de: 0.10, mlops: 0.05  },
  "Q11": {  "DS-AI": 0.90, nlp: 0.80, ml: 0.70, stats: 0.20, bi: 0.15, de: 0.05, mlops: 0.05  },
  "Q12": {  "DS-AI": 0.95, de: 0.95, ml: 0.30, stats: 0.40, bi: 0.20, nlp: 0.05, mlops: 0.35  },
  "Q13": {  "DS-AI": 0.92, de: 0.90, ml: 0.30, stats: 0.35, bi: 0.25, nlp: 0.05, mlops: 0.45  },
  "Q14": {  "DS-AI": 0.90, de: 0.85, ml: 0.35, stats: 0.30, bi: 0.20, nlp: 0.05, mlops: 0.40  },
  "Q15": {  "DS-AI": 0.88, de: 0.85, ml: 0.30, stats: 0.25, bi: 0.15, nlp: 0.05, mlops: 0.25  },
  "Q16": {  "DS-AI": 0.90, de: 0.80, ml: 0.35, stats: 0.30, bi: 0.35, nlp: 0.05, mlops: 0.15  },
  "Q17": {  "DS-AI": 0.95, bi: 0.95, de: 0.30, ml: 0.20, stats: 0.20, nlp: 0.05, mlops: 0.10  },
  "Q18": {  "DS-AI": 0.92, bi: 0.90, de: 0.35, ml: 0.25, stats: 0.25, nlp: 0.05, mlops: 0.10  },
  "Q19": {  "DS-AI": 0.90, bi: 0.85, de: 0.30, ml: 0.25, stats: 0.20, nlp: 0.05, mlops: 0.10  },
  "Q20": {  "DS-AI": 0.88, bi: 0.85, de: 0.35, ml: 0.20, stats: 0.25, nlp: 0.05, mlops: 0.15  },
  "Q21": {  "DS-AI": 0.95, stats: 0.95, ml: 0.60, bi: 0.20, de: 0.10, nlp: 0.05, mlops: 0.10  },
  "Q22": {  "DS-AI": 0.92, stats: 0.90, ml: 0.55, bi: 0.25, de: 0.15, nlp: 0.05, mlops: 0.10  },
  "Q23": {  "DS-AI": 0.95, mlops: 0.95, ml: 0.70, de: 0.45, stats: 0.25, bi: 0.10, nlp: 0.05  },
  "Q24": {  "DS-AI": 0.92, mlops: 0.90, ml: 0.65, de: 0.50, stats: 0.20, bi: 0.15, nlp: 0.05  },
  "Q25": { "DS-AI": 0.95, "ml": 0.12, "nlp": 0.95, "de": 0.37, "bi": 0.47, "stats": 0.35, "mlops": 0.22 },
  "Q26": { "DS-AI": 0.9, "ml": 0.37, "nlp": 0.35, "de": 0.85, "bi": 0.12, "stats": 0.26, "mlops": 0.48 },
  "Q27": { "DS-AI": 0.85, "ml": 0.50, "nlp": 0.16, "de": 0.25, "bi": 0.9, "stats": 0.28, "mlops": 0.51 },
  "Q28": { "DS-AI": 0.85, "ml": 0.57, "nlp": 0.46, "de": 0.48, "bi": 0.26, "stats": 0.85, "mlops": 0.11 },
  "Q29": { "DS-AI": 0.95, "ml": 0.48, "nlp": 0.41, "de": 0.54, "bi": 0.40, "stats": 0.42, "mlops": 0.95 },
  "Q30": { "DS-AI": 0.9, "ml": 0.85, "nlp": 0.51, "de": 0.26, "bi": 0.54, "stats": 0.40, "mlops": 0.47 },
};

export const CS_NET_MATRIX = {
  "Q1": { "CS-NET": 0.85, "pentest": 0.11, "soc": 0.9, "crypto": 0.28, "net": 0.11, "forensics": 0.41, "appsec": 0.13 },
  "Q2": { "CS-NET": 0.85, "pentest": 0.58, "soc": 0.39, "crypto": 0.95, "net": 0.51, "forensics": 0.18, "appsec": 0.41 },
  "Q3": { "CS-NET": 0.9, "pentest": 0.37, "soc": 0.33, "crypto": 0.46, "net": 0.9, "forensics": 0.19, "appsec": 0.23 },
  "Q4": { "CS-NET": 0.9, "pentest": 0.16, "soc": 0.46, "crypto": 0.38, "net": 0.43, "forensics": 0.85, "appsec": 0.34 },
  "Q5": { "CS-NET": 0.85, "pentest": 0.16, "soc": 0.59, "crypto": 0.54, "net": 0.59, "forensics": 0.39, "appsec": 0.85 },
  "Q6": { "CS-NET": 0.85, "pentest": 0.85, "soc": 0.44, "crypto": 0.30, "net": 0.17, "forensics": 0.52, "appsec": 0.25 },
  "Q7": { "CS-NET": 0.95, "pentest": 0.56, "soc": 0.95, "crypto": 0.54, "net": 0.21, "forensics": 0.30, "appsec": 0.26 },
  "Q8": { "CS-NET": 0.85, "pentest": 0.16, "soc": 0.56, "crypto": 0.9, "net": 0.53, "forensics": 0.54, "appsec": 0.29 },
  "Q9": { "CS-NET": 0.9, "pentest": 0.35, "soc": 0.43, "crypto": 0.59, "net": 0.9, "forensics": 0.32, "appsec": 0.51 },
  "Q10": { "CS-NET": 0.95, "pentest": 0.32, "soc": 0.17, "crypto": 0.31, "net": 0.29, "forensics": 0.85, "appsec": 0.29 },
  "Q11": { "CS-NET": 0.95, "pentest": 0.28, "soc": 0.53, "crypto": 0.39, "net": 0.34, "forensics": 0.54, "appsec": 0.85 },
  "Q12": { "CS-NET": 0.85, "pentest": 0.85, "soc": 0.50, "crypto": 0.11, "net": 0.28, "forensics": 0.23, "appsec": 0.55 },
  "Q13": { "CS-NET": 0.9, "pentest": 0.36, "soc": 0.85, "crypto": 0.10, "net": 0.32, "forensics": 0.55, "appsec": 0.51 },
  "Q14": { "CS-NET": 0.9, "pentest": 0.22, "soc": 0.33, "crypto": 0.9, "net": 0.29, "forensics": 0.59, "appsec": 0.53 },
  "Q15": { "CS-NET": 0.95, "pentest": 0.25, "soc": 0.16, "crypto": 0.51, "net": 0.95, "forensics": 0.50, "appsec": 0.34 },
  "Q16": { "CS-NET": 0.85, "pentest": 0.54, "soc": 0.58, "crypto": 0.28, "net": 0.49, "forensics": 0.95, "appsec": 0.33 },
  "Q17": { "CS-NET": 0.85, "pentest": 0.30, "soc": 0.23, "crypto": 0.49, "net": 0.13, "forensics": 0.28, "appsec": 0.9 },
  "Q18": { "CS-NET": 0.95, "pentest": 0.85, "soc": 0.34, "crypto": 0.19, "net": 0.14, "forensics": 0.59, "appsec": 0.43 },
  "Q19": { "CS-NET": 0.85, "pentest": 0.44, "soc": 0.95, "crypto": 0.31, "net": 0.11, "forensics": 0.43, "appsec": 0.19 },
  "Q20": { "CS-NET": 0.95, "pentest": 0.41, "soc": 0.38, "crypto": 0.9, "net": 0.37, "forensics": 0.31, "appsec": 0.32 },
  "Q21": { "CS-NET": 0.9, "pentest": 0.44, "soc": 0.11, "crypto": 0.44, "net": 0.95, "forensics": 0.31, "appsec": 0.10 },
  "Q22": { "CS-NET": 0.9, "pentest": 0.31, "soc": 0.18, "crypto": 0.57, "net": 0.43, "forensics": 0.85, "appsec": 0.41 },
  "Q23": { "CS-NET": 0.95, "pentest": 0.55, "soc": 0.44, "crypto": 0.15, "net": 0.38, "forensics": 0.50, "appsec": 0.85 },
  "Q24": { "CS-NET": 0.85, "pentest": 0.85, "soc": 0.21, "crypto": 0.26, "net": 0.25, "forensics": 0.18, "appsec": 0.34 },
  "Q25": { "CS-NET": 0.95, "pentest": 0.52, "soc": 0.95, "crypto": 0.37, "net": 0.33, "forensics": 0.35, "appsec": 0.48 },
  "Q26": { "CS-NET": 0.95, "pentest": 0.28, "soc": 0.30, "crypto": 0.95, "net": 0.51, "forensics": 0.46, "appsec": 0.54 },
  "Q27": { "CS-NET": 0.9, "pentest": 0.58, "soc": 0.13, "crypto": 0.22, "net": 0.95, "forensics": 0.29, "appsec": 0.24 },
  "Q28": { "CS-NET": 0.95, "pentest": 0.43, "soc": 0.29, "crypto": 0.54, "net": 0.55, "forensics": 0.95, "appsec": 0.53 },
  "Q29": { "CS-NET": 0.9, "pentest": 0.14, "soc": 0.46, "crypto": 0.32, "net": 0.47, "forensics": 0.57, "appsec": 0.85 },
  "Q30": { "CS-NET": 0.95, "pentest": 0.9, "soc": 0.53, "crypto": 0.46, "net": 0.42, "forensics": 0.11, "appsec": 0.20 },
};

export const IS_MT_MATRIX = {
  "Q1": { "IS-MT": 0.9, "erp": 0.34, "itil": 0.95, "pm": 0.42, "ea": 0.45, "crm": 0.41 },
  "Q2": { "IS-MT": 0.85, "erp": 0.29, "itil": 0.17, "pm": 0.95, "ea": 0.36, "crm": 0.51 },
  "Q3": { "IS-MT": 0.95, "erp": 0.36, "itil": 0.57, "pm": 0.28, "ea": 0.9, "crm": 0.46 },
  "Q4": { "IS-MT": 0.85, "erp": 0.27, "itil": 0.14, "pm": 0.34, "ea": 0.17, "crm": 0.95 },
  "Q5": { "IS-MT": 0.9, "erp": 0.95, "itil": 0.42, "pm": 0.42, "ea": 0.38, "crm": 0.36 },
  "Q6": { "IS-MT": 0.95, "erp": 0.30, "itil": 0.85, "pm": 0.59, "ea": 0.59, "crm": 0.36 },
  "Q7": { "IS-MT": 0.95, "erp": 0.33, "itil": 0.30, "pm": 0.9, "ea": 0.53, "crm": 0.35 },
  "Q8": { "IS-MT": 0.95, "erp": 0.34, "itil": 0.50, "pm": 0.59, "ea": 0.9, "crm": 0.23 },
  "Q9": { "IS-MT": 0.95, "erp": 0.20, "itil": 0.29, "pm": 0.23, "ea": 0.26, "crm": 0.85 },
  "Q10": { "IS-MT": 0.85, "erp": 0.9, "itil": 0.25, "pm": 0.47, "ea": 0.38, "crm": 0.21 },
  "Q11": { "IS-MT": 0.85, "erp": 0.13, "itil": 0.9, "pm": 0.11, "ea": 0.19, "crm": 0.45 },
  "Q12": { "IS-MT": 0.9, "erp": 0.23, "itil": 0.60, "pm": 0.9, "ea": 0.11, "crm": 0.44 },
  "Q13": { "IS-MT": 0.9, "erp": 0.35, "itil": 0.58, "pm": 0.29, "ea": 0.9, "crm": 0.36 },
  "Q14": { "IS-MT": 0.9, "erp": 0.54, "itil": 0.47, "pm": 0.47, "ea": 0.23, "crm": 0.85 },
  "Q15": { "IS-MT": 0.85, "erp": 0.85, "itil": 0.21, "pm": 0.53, "ea": 0.35, "crm": 0.44 },
  "Q16": { "IS-MT": 0.95, "erp": 0.53, "itil": 0.85, "pm": 0.55, "ea": 0.26, "crm": 0.47 },
  "Q17": { "IS-MT": 0.85, "erp": 0.31, "itil": 0.47, "pm": 0.95, "ea": 0.59, "crm": 0.52 },
  "Q18": { "IS-MT": 0.85, "erp": 0.25, "itil": 0.50, "pm": 0.46, "ea": 0.9, "crm": 0.27 },
  "Q19": { "IS-MT": 0.85, "erp": 0.12, "itil": 0.37, "pm": 0.21, "ea": 0.35, "crm": 0.85 },
  "Q20": { "IS-MT": 0.9, "erp": 0.9, "itil": 0.18, "pm": 0.42, "ea": 0.16, "crm": 0.41 },
  "Q21": { "IS-MT": 0.9, "erp": 0.59, "itil": 0.85, "pm": 0.11, "ea": 0.17, "crm": 0.16 },
  "Q22": { "IS-MT": 0.9, "erp": 0.55, "itil": 0.47, "pm": 0.95, "ea": 0.27, "crm": 0.26 },
  "Q23": { "IS-MT": 0.9, "erp": 0.58, "itil": 0.37, "pm": 0.16, "ea": 0.9, "crm": 0.11 },
  "Q24": { "IS-MT": 0.9, "erp": 0.49, "itil": 0.47, "pm": 0.17, "ea": 0.57, "crm": 0.85 },
  "Q25": { "IS-MT": 0.95, "erp": 0.9, "itil": 0.54, "pm": 0.40, "ea": 0.35, "crm": 0.11 },
  "Q26": { "IS-MT": 0.85, "erp": 0.51, "itil": 0.95, "pm": 0.59, "ea": 0.23, "crm": 0.12 },
  "Q27": { "IS-MT": 0.9, "erp": 0.20, "itil": 0.25, "pm": 0.9, "ea": 0.21, "crm": 0.22 },
  "Q28": { "IS-MT": 0.85, "erp": 0.56, "itil": 0.54, "pm": 0.42, "ea": 0.9, "crm": 0.41 },
  "Q29": { "IS-MT": 0.9, "erp": 0.18, "itil": 0.41, "pm": 0.58, "ea": 0.29, "crm": 0.85 },
  "Q30": { "IS-MT": 0.95, "erp": 0.9, "itil": 0.24, "pm": 0.38, "ea": 0.19, "crm": 0.29 },
};

export const CL_DN_MATRIX = {
  "Q1": { "CL-DN": 0.95, "cloud": 0.14, "k8s": 0.95, "blockchain": 0.38, "edge": 0.34, "cdn": 0.37 },
  "Q2": { "CL-DN": 0.9, "cloud": 0.53, "k8s": 0.51, "blockchain": 0.95, "edge": 0.41, "cdn": 0.17 },
  "Q3": { "CL-DN": 0.85, "cloud": 0.25, "k8s": 0.56, "blockchain": 0.17, "edge": 0.95, "cdn": 0.60 },
  "Q4": { "CL-DN": 0.95, "cloud": 0.12, "k8s": 0.15, "blockchain": 0.58, "edge": 0.30, "cdn": 0.85 },
  "Q5": { "CL-DN": 0.85, "cloud": 0.95, "k8s": 0.14, "blockchain": 0.52, "edge": 0.33, "cdn": 0.29 },
  "Q6": { "CL-DN": 0.9, "cloud": 0.48, "k8s": 0.95, "blockchain": 0.38, "edge": 0.55, "cdn": 0.13 },
  "Q7": { "CL-DN": 0.85, "cloud": 0.22, "k8s": 0.58, "blockchain": 0.95, "edge": 0.52, "cdn": 0.26 },
  "Q8": { "CL-DN": 0.95, "cloud": 0.36, "k8s": 0.49, "blockchain": 0.19, "edge": 0.9, "cdn": 0.24 },
  "Q9": { "CL-DN": 0.85, "cloud": 0.41, "k8s": 0.58, "blockchain": 0.45, "edge": 0.60, "cdn": 0.95 },
  "Q10": { "CL-DN": 0.95, "cloud": 0.9, "k8s": 0.17, "blockchain": 0.39, "edge": 0.56, "cdn": 0.18 },
  "Q11": { "CL-DN": 0.95, "cloud": 0.39, "k8s": 0.9, "blockchain": 0.19, "edge": 0.37, "cdn": 0.59 },
  "Q12": { "CL-DN": 0.9, "cloud": 0.29, "k8s": 0.51, "blockchain": 0.85, "edge": 0.31, "cdn": 0.45 },
  "Q13": { "CL-DN": 0.85, "cloud": 0.10, "k8s": 0.49, "blockchain": 0.60, "edge": 0.95, "cdn": 0.19 },
  "Q14": { "CL-DN": 0.95, "cloud": 0.53, "k8s": 0.22, "blockchain": 0.11, "edge": 0.20, "cdn": 0.9 },
  "Q15": { "CL-DN": 0.95, "cloud": 0.9, "k8s": 0.11, "blockchain": 0.38, "edge": 0.50, "cdn": 0.52 },
  "Q16": { "CL-DN": 0.95, "cloud": 0.27, "k8s": 0.85, "blockchain": 0.56, "edge": 0.23, "cdn": 0.52 },
  "Q17": { "CL-DN": 0.85, "cloud": 0.33, "k8s": 0.53, "blockchain": 0.85, "edge": 0.54, "cdn": 0.46 },
  "Q18": { "CL-DN": 0.85, "cloud": 0.56, "k8s": 0.36, "blockchain": 0.16, "edge": 0.85, "cdn": 0.13 },
  "Q19": { "CL-DN": 0.95, "cloud": 0.44, "k8s": 0.44, "blockchain": 0.42, "edge": 0.47, "cdn": 0.85 },
  "Q20": { "CL-DN": 0.85, "cloud": 0.9, "k8s": 0.33, "blockchain": 0.21, "edge": 0.23, "cdn": 0.10 },
  "Q21": { "CL-DN": 0.9, "cloud": 0.38, "k8s": 0.85, "blockchain": 0.37, "edge": 0.22, "cdn": 0.56 },
  "Q22": { "CL-DN": 0.85, "cloud": 0.16, "k8s": 0.30, "blockchain": 0.95, "edge": 0.14, "cdn": 0.16 },
  "Q23": { "CL-DN": 0.9, "cloud": 0.59, "k8s": 0.43, "blockchain": 0.41, "edge": 0.95, "cdn": 0.45 },
  "Q24": { "CL-DN": 0.95, "cloud": 0.46, "k8s": 0.39, "blockchain": 0.12, "edge": 0.11, "cdn": 0.85 },
  "Q25": { "CL-DN": 0.95, "cloud": 0.85, "k8s": 0.25, "blockchain": 0.29, "edge": 0.56, "cdn": 0.17 },
  "Q26": { "CL-DN": 0.85, "cloud": 0.24, "k8s": 0.85, "blockchain": 0.37, "edge": 0.49, "cdn": 0.36 },
  "Q27": { "CL-DN": 0.95, "cloud": 0.58, "k8s": 0.12, "blockchain": 0.85, "edge": 0.49, "cdn": 0.34 },
  "Q28": { "CL-DN": 0.85, "cloud": 0.29, "k8s": 0.35, "blockchain": 0.52, "edge": 0.9, "cdn": 0.49 },
  "Q29": { "CL-DN": 0.85, "cloud": 0.49, "k8s": 0.11, "blockchain": 0.31, "edge": 0.25, "cdn": 0.85 },
  "Q30": { "CL-DN": 0.95, "cloud": 0.95, "k8s": 0.30, "blockchain": 0.59, "edge": 0.49, "cdn": 0.16 },
};


export function getDomainCareerSet(domainCode) {
  let questionsArr = [];
  let matrix = {};
  let title = "";

  if (domainCode === "SD") {
    questionsArr = SD_QUESTIONS;
    matrix = SD_MATRIX;
    title = "Yazılım Geliştirme Kariyer Testi";
  } else if (domainCode === "DS-AI") {
    questionsArr = DS_AI_QUESTIONS;
    matrix = DS_AI_MATRIX;
    title = "Veri Bilimi ve Yapay Zeka Kariyer Testi";
  } else if (domainCode === "CS-NET") {
    questionsArr = CS_NET_QUESTIONS;
    matrix = CS_NET_MATRIX;
    title = "Siber Güvenlik ve Ağ Kariyer Testi";
  } else if (domainCode === "IS-MT") {
    questionsArr = IS_MT_QUESTIONS;
    matrix = IS_MT_MATRIX;
    title = "Bilişim Sistemleri ve BT Yönetimi Kariyer Testi";
  } else if (domainCode === "CL-DN") {
    questionsArr = CL_DN_QUESTIONS;
    matrix = CL_DN_MATRIX;
    title = "Bulut, Altyapı ve DevOps Kariyer Testi";
  } else {
    return null;
  }

  const dogruCevaplar = {};
  questionsArr.forEach(q => {
    dogruCevaplar[`Q${q.id}`] = q.correctLetter;
  });

  return { title, questions: questionsArr, dogruCevaplar, matrix };
}
