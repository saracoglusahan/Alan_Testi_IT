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
      { id: "ml", label: "Makine Öğrenmesi (ML)" },
      { id: "dl", label: "Derin Öğrenme (DL)" },
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
      { id: "blockchain", label: "Blockchain" },
      { id: "web3", label: "Web3" },
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
