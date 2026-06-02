export type LangCode = 'id' | 'en' | 'ko' | 'zh' | 'ja';

// twemoji: codepoint pair for https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/{twemoji}.png
// disabled: true 는 선택지에서 숨김 (번역 데이터는 유지 — 나중에 활성화 가능)
export const LANGUAGES: { code: LangCode; label: string; countryCode: string; color: string; nativeLabel: string; flag: string; flagCdn: string; twemoji: string; disabled?: boolean }[] = [
  { code: 'id', label: 'Indonesian', countryCode: 'ID', color: '#CC0001', nativeLabel: 'Bahasa Indonesia', flag: '🇮🇩', flagCdn: 'id', twemoji: '1f1ee-1f1e9' },
  { code: 'en', label: 'English',    countryCode: 'EN', color: '#3C3B6E', nativeLabel: 'English',          flag: '🇺🇸', flagCdn: 'us', twemoji: '1f1fa-1f1f8' },
  { code: 'ko', label: 'Korean',     countryCode: 'KO', color: '#003478', nativeLabel: '한국어',            flag: '🇰🇷', flagCdn: 'kr', twemoji: '1f1f0-1f1f7' },
  { code: 'zh', label: 'Chinese',    countryCode: 'ZH', color: '#DE2910', nativeLabel: '中文',              flag: '🇨🇳', flagCdn: 'cn', twemoji: '1f1e8-1f1f3', disabled: true },
  { code: 'ja', label: 'Japanese',   countryCode: 'JP', color: '#BC002D', nativeLabel: '日本語',            flag: '🇯🇵', flagCdn: 'jp', twemoji: '1f1ef-1f1f5' },
];

export interface Translations {
  // App
  appName: string;
  tagline: string;

  // Onboarding
  onboarding: {
    slide1Title: string;
    slide1Sub: string;
    slide2Title: string;
    slide2Sub: string;
    slide3Title: string;
    slide3Sub: string;
    next: string;
    getStarted: string;
    skip: string;
  };

  // Auth
  auth: {
    welcome: string;
    signIn: string;
    createAccount: string;
    phone: string;
    phonePlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    login: string;
    register: string;
    noAccount: string;
    hasAccount: string;
    demoLogin: string;
    quickLogin: string;
    customer: string;
    customerDesc: string;
    driver: string;
    driverDesc: string;
    helper: string;
    helperDesc: string;
    iWantTo: string;
    findWorker: string;
    becomeDriver: string;
    becomeHelper: string;
    fullName: string;
    fullNamePlaceholder: string;
    minPassword: string;
    registerNow: string;
    joinNow: string;
  };

  // Home
  home: {
    hello: string;
    needHelp: string;
    searchPlaceholder: string;
    promo: string;
    promoTitle: string;
    promoSub: string;
    activeDrivers: string;
    activeHelpers: string;
    customers: string;
    category: string;
    all: string;
    allWorkers: string;
    availableDrivers: string;
    availableHelpers: string;
    available: string;
    perHour: string;
    perDay: string;
    jobs: string;
    noResults: string;
    verified: string;
    ctaDriver: string;
    ctaDriverSub: string;
    ctaHelper: string;
    ctaHelperSub: string;
  };

  // Orders
  orders: {
    myOrders: string;
    active: string;
    history: string;
    noOrders: string;
    noOrdersDesc: string;
    confirmed: string;
    pending: string;
    ongoing: string;
    completed: string;
    cancelled: string;
    waiting: string;
    total: string;
    review: string;
    reorder: string;
    art: string;
    hours: string;
    depositPaid: string;
    remainingEscrow: string;
    confirmBannerText: string;
    confirmTitle: string;
    confirmMsg: string;
    notYet: string;
    yesConfirm: string;
    confirmWork: string;
    refundNote: string;
    awaitingConfirm: string;
  };

  // Profile
  profile: {
    title: string;
    totalOrders: string;
    ratingGiven: string;
    favorites: string;
    editProfile: string;
    savedAddress: string;
    payment: string;
    notifications: string;
    security: string;
    helpFaq: string;
    terms: string;
    logout: string;
    logoutConfirm: string;
    logoutMsg: string;
    cancel: string;
    version: string;
    language: string;
  };

  // Worker Home
  workerHome: {
    ready: string;
    readyDriver: string;
    readyHelper: string;
    online: string;
    offline: string;
    onlineDesc: string;
    offlineDesc: string;
    todayEarnings: string;
    todayJobs: string;
    rating: string;
    incomingRequests: string;
    accept: string;
    reject: string;
    goOnline: string;
    hours: string;
    depositHeld: string;
    scheduleTitle: string;
    servicesTitle: string;
    servicesHint: string;
  };

  // Worker Orders
  workerOrders: {
    title: string;
    upcoming: string;
    completed: string;
    earnings: string;
    startJob: string;
    noData: string;
    depositReceived: string;
    remainingWaiting: string;
    awaitingCustomer: string;
    upcomingLabel: string;
    markDone: string;
    markDoneTitle: string;
    markDoneMsg: string;
    markDoneConfirm: string;
    autoRelease: string;
  };

  // Worker Profile
  workerProfile: {
    myRate: string;
    perHour: string;
    perDay: string;
    change: string;
    editProfile: string;
    vehicleInfo: string;
    skillsServices: string;
    documents: string;
    bankAccount: string;
    reviews: string;
    help: string;
    experience: string;
    totalJobs: string;
    verified: string;
    years: string;
  };

  // Language
  lang: {
    selectLanguage: string;
    changeLanguage: string;
  };

  // Bottom nav labels
  nav: {
    home: string;
    orders: string;
    map: string;
    chat: string;
    profile: string;
    dashboard: string;
    jobs: string;
  };

  // Common
  common: {
    close: string;
    save: string;
    confirm: string;
    loading: string;
    error: string;
    retry: string;
  };

  // Chat
  chat: {
    title: string;
    noMessages: string;
    noMessagesDescCustomer: string;
    noMessagesDescWorker: string;
    relatedOrder: string;
    typeMessage: string;
    online: string;
    chatBtn: string;
  };

  // Service type labels
  services: {
    art: string;
    artFull: string;
    tutor: string;
    tutorFull: string;
    insurance: string;
    lesTutor: string;
  };

  // New Home screen
  homeNew: {
    serviceRegular: string;
    serviceSpecial: string;
    countBarText: string;
    adTitle: string;
    adSub: string;
    adCta: string;
    popularPosts: string;
    seeAll: string;
    filterAll: string;
    filterHelper: string;
    filterTutor: string;
    allMitra: string;
    activeCount: string;
    inlineAd: string;
    locationDefault: string;
    catArt: string;
    catCooking: string;
    catCleaning: string;
    catCustom: string;
    catTutor: string;
    catVisit: string;
    catEnglish: string;
    catMore: string;
    catChildcare: string;
    catErrand: string;
    catDriverDesignated: string;
    catDriverDaily: string;
    catDriverHourly: string;
    catDriverAirport: string;
  };

  // Community screen
  community: {
    title: string;
    writeBtn: string;
    searchPlaceholder: string;
    emptyText: string;
    filterAll: string;
    catPopular: string;
    catChat: string;
    catTips: string;
    catAsk: string;
    catAnnounce: string;
  };

  // Map screen
  mapScreen: {
    searchPlaceholder: string;
    filterAll: string;
    filterHelper: string;
    filterTutor: string;
    helperLabel: string;
    tutorLabel: string;
    locationDefault: string;
    availableNow: string;
    busyNow: string;
    bookBtn: string;
    notAvailableBtn: string;
    perHour: string;
    ratingLabel: string;
    jobsLabel: string;
  };

  // Worker Detail
  workerDetail: {
    about: string;
    vehicle: string;
    skills: string;
    calcTitle: string;
    duration: string;
    ratePerHour: string;
    escrowSystem: string;
    depositNow: string;
    remainingAfter: string;
    escrowNote: string;
    reviews: string;
    jobsDone: string;
    expYears: string;
    available: string;
    busy: string;
    bookNow: string;
    notAvailable: string;
    confirmTitle: string;
    confirmMsg: string;
    confirmBook: string;
    bookSuccess: string;
    bookSuccessMsg: string;
  };

  // Register wizard
  register: {
    pageTitle: string;
    titleRole: string; titleService: string; titleCondition: string; titleProfile: string; titleAccount: string;
    stepService: string; stepCondition: string; stepProfile: string; stepAccount: string;
    roleQuestion: string; roleSubtitle: string;
    roleCustomerLabel: string; roleCustomerSub: string;
    roleHelperLabel: string; roleHelperSub: string;
    roleTutorLabel: string; roleTutorSub: string;
    serviceQuestion: string; serviceTip: string;
    rateTitle: string; rateChangeNote: string; rateUnit: string; rateAverage: string;
    areaTitle: string; areaSub: string;
    workTypeTitle: string; scheduleTitle: string;
    introTitle: string; introSub: string;
    photoCount: string; photoHint: string; photoTip: string;
    bioTitle: string; templateHint: string;
    tabExperience: string; tabPersonality: string; tabSkill: string;
    templateSelect: string;
    accountTitleHelper: string; accountTitleCustomer: string;
    accountSubHelper: string; accountSubCustomer: string;
    labelName: string; labelPhone: string; labelPassword: string;
    namePlaceholder: string; phonePlaceholder: string; passwordPlaceholder: string;
    next: string; finish: string; skip: string;
    // service chip labels
    artCooking: string; artCleaning: string; artLaundry: string;
    artOrganizing: string; artChildcare: string; artShopping: string;
    artSpecialCooking: string; artGardening: string;
    tutorMath: string; tutorScience: string; tutorEnglish: string;
    tutorMandarin: string; tutorCivics: string; tutorArts: string;
    tutorCoding: string; tutorSports: string;
    // work type & schedule
    wtRegularLabel: string; wtRegularSub: string;
    wtOnceLabel: string; wtOnceSub: string;
    wtLiveinLabel: string; wtLiveinSub: string;
    scMorningLabel: string; scMorningSub: string;
    scAfternoonLabel: string; scAfternoonSub: string;
    scEveningLabel: string; scEveningSub: string;
    scFlexLabel: string; scFlexSub: string;
    // bio
    bioPlaceholder: string;
    bioTpl0: string; bioTpl1: string; bioTpl2: string; bioTpl3: string;
    bioTpl4: string; bioTpl5: string; bioTpl6: string; bioTpl7: string;
    bioTpl8: string; bioTpl9: string; bioTpl10: string; bioTpl11: string;
    // account bottom
    hasAccount: string; loginLink: string;
    termsNote: string; termsAnd: string; termsTerms: string; termsPrivacy: string;
    // new titles / steps
    titleTerms: string;
    stepTerms: string;
    stepCustService: string;
    stepCustArea: string;
    // customer phase 1 — service wants
    custServiceQuestion: string;
    custServiceTip: string;
    custArt: string;
    custTutor: string;
    // customer phase 2 — area (reuses areaTitle/areaSub)
    // terms phase inline
    termsOverview: string;
    termsAgreeAll: string;
    termsItem1: string;
    termsItem2: string;
    termsItem3: string;
    termsItem4: string;
    termsViewLabel: string;
    // Driver role
    roleDriverLabel: string; roleDriverSub: string;
    // Driver registration
    driverSkillTitle: string; driverSkillSub: string;
    driverLicenseTitle: string; driverLicenseSub: string;
    driverServiceTitle: string; driverServiceSub: string;
    driverAreaTitle: string; driverAreaSub: string;
    // drivable vehicle types (what drivers can operate)
    vehSedan: string; vehSuv: string; vehMpv: string; vehVan: string; vehManualStick: string;
    drivableTypesLabel: string; drivableTypesSub: string;
    // transmission
    transmissionLabel: string;
    transAuto: string; transManual: string; transBoth: string;
    // driver service kinds (designated-driver model)
    dsvDesignated: string; dsvDesignatedSub: string;
    dsvDaily: string; dsvDailySub: string;
    dsvHourly: string; dsvHourlySub: string;
    dsvCommute: string; dsvCommuteSub: string;
    dsvAirport: string; dsvAirportSub: string;
    dsvIntercity: string; dsvIntercitySub: string;
    dsvEvent: string; dsvEventSub: string;
    // driver fields
    driverExperience: string;
    driverLicenseClass: string;
    // step labels
    stepDriverSkill: string; stepDriverLicense: string;
    stepDriverService: string; stepDriverArea: string;
  };

  // Linka 온도 리뷰 시스템
  linkaTemp: {
    title: string;              // "Linka 온도"
    tagline: string;            // "친절함의 따뜻함을 측정해요"
    currentTemp: string;        // "현재 온도"
    averageTemp: string;        // "평균"
    basedOn: string;            // "N명의 리뷰 기준"
    giveTemp: string;           // "온도 주기"
    // review tags (positive)
    tagFriendly: string; tagOnTime: string; tagClean: string;
    tagSkilled: string; tagCareful: string; tagPatient: string;
    tagWarmVibes: string; tagCommunicative: string;
    // review tags (negative)
    tagLate: string; tagRushed: string; tagCold: string;
    tagUnclean: string; tagNotSkilled: string;
    // result messages
    tempUp: string;             // "+0.8°C"
    tempDown: string;           // "-0.5°C"
    freeTextTitle: string;      // "한마디 남기기 (선택)"
    freeTextPlaceholder: string;
    submitReview: string;
    thanksTitle: string;        // "리뷰 감사합니다!"
    thanksSub: string;
  };

  // 이 달의 헬퍼/드라이버
  monthlyAward: {
    title: string;              // "이 달의"
    helperOfMonth: string;      // "이 달의 헬퍼"
    driverOfMonth: string;      // "이 달의 드라이버"
    winnerBadge: string;        // "MVP"
    period: string;             // "2026년 4월"
    reasonPrefix: string;       // "이유:"
    seeAll: string;
  };
}

const id: Translations = {
  appName: 'Linka',
  tagline: 'Solusi Tenaga Kerja Indonesia',
  onboarding: {
    slide1Title: 'Driver Profesional',
    slide1Sub: 'Temukan driver terpercaya\nsiap antar jemput kapan saja',
    slide2Title: 'Asisten Rumah Tangga',
    slide2Sub: 'Dapatkan ART berpengalaman\nuntuk kebersihan & masak',
    slide3Title: 'Aman & Terverifikasi',
    slide3Sub: 'Semua mitra sudah KTP & latar\nbelakang terverifikasi',
    next: 'Lanjut',
    getStarted: 'Mulai Sekarang',
    skip: 'Lewati',
  },
  auth: {
    welcome: 'Selamat Datang!',
    signIn: 'Masuk ke akun Anda',
    createAccount: 'Buat Akun',
    phone: 'Nomor HP',
    phonePlaceholder: '08xxxxxxxxxx',
    password: 'Password',
    passwordPlaceholder: 'Masukkan password',
    forgotPassword: 'Lupa password?',
    login: 'Masuk',
    register: 'Daftar',
    noAccount: 'Belum punya akun? ',
    hasAccount: 'Sudah punya akun? ',
    demoLogin: 'Login cepat (demo)',
    quickLogin: 'Login cepat (demo)',
    customer: 'Pelanggan',
    driverDesc: 'Terima order antar',
    customerDesc: 'Cari & pesan ART',
    driver: 'Driver',
    helper: 'ART',
    helperDesc: 'Terima order kerja',
    iWantTo: 'Saya ingin...',
    findWorker: 'Cari driver/ART',
    becomeDriver: 'Jadi driver',
    becomeHelper: 'Jadi ART',
    fullName: 'Nama Lengkap',
    fullNamePlaceholder: 'Nama lengkap Anda',
    minPassword: 'Minimal 6 karakter',
    registerNow: 'Daftar Sekarang',
    joinNow: 'Bergabung dengan Linka sekarang',
  },
  home: {
    hello: 'Halo',
    needHelp: 'Butuh bantuan hari ini?',
    searchPlaceholder: 'Cari driver atau ART...',
    promo: 'PROMO',
    promoTitle: 'Diskon 20%\nUntuk ART Baru',
    promoSub: 'Hanya hari ini!',
    activeDrivers: 'Driver Aktif',
    activeHelpers: 'ART Aktif',
    customers: 'Pelanggan',
    category: 'Kategori',
    all: 'Semua',
    allWorkers: 'Semua Mitra',
    availableDrivers: 'Driver Tersedia',
    availableHelpers: 'ART Tersedia',
    available: 'tersedia',
    perHour: '/jam',
    perDay: '/hari',
    jobs: 'pekerjaan',
    noResults: 'Tidak ditemukan',
    verified: 'Terverifikasi',
    ctaDriver: 'Panggil Driver',
    ctaDriverSub: 'Antar jemput & perjalanan',
    ctaHelper: 'Pesan ART',
    ctaHelperSub: 'Kebersihan & memasak',
  },

  orders: {
    myOrders: 'Pesanan Saya',
    active: 'Aktif',
    history: 'Riwayat',
    noOrders: 'Belum ada pesanan',
    noOrdersDesc: 'Yuk pesan driver atau ART sekarang!',
    confirmed: 'Dikonfirmasi',
    pending: 'Menunggu',
    ongoing: 'Berlangsung',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    waiting: 'Menunggu',
    total: 'Total',
    review: 'Beri Ulasan',
    reorder: 'Pesan Lagi',
    art: 'Asisten Rumah Tangga',
    hours: 'jam',
    depositPaid: 'Deposit dibayar',
    remainingEscrow: 'Sisa (ditahan escrow)',
    confirmBannerText: 'Pekerjaan selesai — konfirmasi untuk melepas sisa pembayaran',
    confirmTitle: 'Konfirmasi Selesai',
    confirmMsg: 'Apakah pekerjaan sudah selesai dengan baik? Sisa pembayaran akan segera dikirim ke mitra.',
    notYet: 'Belum',
    yesConfirm: 'Ya, Konfirmasi',
    confirmWork: 'Konfirmasi Pekerjaan Selesai',
    refundNote: 'Deposit dikembalikan dalam 1-3 hari kerja',
    awaitingConfirm: 'Selesai — Konfirmasi Anda',
  },
  profile: {
    title: 'Profil',
    totalOrders: 'Total Pesanan',
    ratingGiven: 'Rating Diberikan',
    favorites: 'Favorit',
    editProfile: 'Edit Profil',
    savedAddress: 'Alamat Tersimpan',
    payment: 'Metode Pembayaran',
    notifications: 'Notifikasi',
    security: 'Keamanan Akun',
    helpFaq: 'Bantuan & FAQ',
    terms: 'Syarat & Ketentuan',
    logout: 'Keluar',
    logoutConfirm: 'Keluar',
    logoutMsg: 'Yakin ingin keluar dari akun ini?',
    cancel: 'Batal',
    version: 'Linka v1.0.0',
    language: 'Bahasa',
  },
  workerHome: {
    ready: 'Halo',
    readyDriver: 'Siap mengantar hari ini?',
    readyHelper: 'Siap membantu hari ini?',
    online: 'Sedang Online',
    offline: 'Sedang Offline',
    onlineDesc: 'Anda bisa menerima pesanan',
    offlineDesc: 'Aktifkan untuk menerima pesanan',
    todayEarnings: 'Pendapatan Hari Ini',
    todayJobs: 'Pesanan Hari Ini',
    rating: 'Rating',
    incomingRequests: 'Permintaan Masuk',
    accept: 'Terima',
    reject: 'Tolak',
    goOnline: 'Aktifkan status online\nuntuk menerima pesanan',
    hours: 'jam',
    depositHeld: 'Deposit escrow sudah ditahan',
    scheduleTitle: 'Jadwal Hari Ini',
    servicesTitle: 'Layanan Saya',
    servicesHint: 'Tap untuk aktif/nonaktif',
  },
  workerOrders: {
    title: 'Riwayat Pekerjaan',
    upcoming: 'Mendatang',
    completed: 'Selesai',
    earnings: 'Pendapatan',
    startJob: 'Mulai Pekerjaan',
    noData: 'Belum ada data',
    depositReceived: 'Deposit diterima',
    remainingWaiting: 'Sisa (menunggu konfirmasi)',
    awaitingCustomer: 'Menunggu Konfirmasi',
    upcomingLabel: 'Akan Datang',
    markDone: 'Tandai Selesai',
    markDoneTitle: 'Tandai Selesai',
    markDoneMsg: 'Tandai pekerjaan ini sebagai selesai? Pelanggan akan konfirmasi sebelum sisa pembayaran dilepas.',
    markDoneConfirm: 'Tandai Selesai',
    autoRelease: 'Sisa pembayaran otomatis dilepas dalam 48 jam jika pelanggan tidak merespon',
  },
  workerProfile: {
    myRate: 'Tarif Saya',
    perHour: 'Per Jam',
    perDay: 'Per Hari',
    change: 'Ubah',
    editProfile: 'Edit Profil & Data Diri',
    vehicleInfo: 'Info Kendaraan',
    skillsServices: 'Keahlian & Layanan',
    documents: 'Dokumen & Verifikasi',
    bankAccount: 'Rekening Bank',
    reviews: 'Ulasan Pelanggan',
    help: 'Bantuan',
    experience: 'Pengalaman',
    totalJobs: 'Total Pekerjaan',
    verified: 'Terverifikasi',
    years: 'thn',
  },
  lang: {
    selectLanguage: 'Pilih Bahasa',
    changeLanguage: 'Ganti Bahasa',
  },
  common: {
    close: 'Tutup',
    save: 'Simpan',
    confirm: 'Konfirmasi',
    loading: 'Memuat...',
    error: 'Terjadi kesalahan',
    retry: 'Coba lagi',
  },
  nav: {
    home:      'Beranda',
    orders:    'Pesanan',
    map:       'Peta',
    chat:      'Pesan',
    profile:   'Profil',
    dashboard: 'Dashboard',
    jobs:      'Pekerjaan',
  },
  chat: {
    title: 'Pesan',
    noMessages: 'Belum ada pesan',
    noMessagesDescCustomer: 'Mulai chat dengan mitra Anda',
    noMessagesDescWorker: 'Mulai chat dengan pelanggan Anda',
    relatedOrder: 'Terkait pesanan',
    typeMessage: 'Ketik pesan...',
    online: 'Online',
    chatBtn: 'Chat',
  },
  services: {
    art: 'ART',
    artFull: 'Asisten Rumah Tangga',
    tutor: 'Les',
    tutorFull: 'Guru Les Privat',
    insurance: 'Asuransi',
    lesTutor: 'Mata Pelajaran',
  },
  homeNew: {
    serviceRegular: 'Layanan Rutin',
    serviceSpecial: 'Sekali/Khusus',
    countBarText: '2.156 mitra siap di Jakarta Selatan',
    adTitle: 'Voucher Diskon 20% 🎁',
    adSub: 'Daftar sekarang, langsung dapat diskon!',
    adCta: 'Ambil Voucher',
    popularPosts: 'Postingan Populer',
    seeAll: 'Lihat Semua',
    filterAll: 'Semua',
    filterHelper: 'ART',
    filterTutor: 'Les Privat',
    allMitra: 'Semua Mitra',
    activeCount: 'aktif',
    inlineAd: 'Sudah cek asuransi mitra? Semua mitra Linka sudah terdaftar asuransi.',
    locationDefault: 'Jakarta Selatan, Kebayoran',
    catArt: 'ART',
    catCooking: 'Masak/Catering',
    catCleaning: 'Bersih-bersih',
    catCustom: 'Custom',
    catTutor: 'Les Privat',
    catVisit: 'Kunjungan',
    catEnglish: 'Les Inggris',
    catMore: 'Lainnya',
    catChildcare: 'Pengasuh Anak',
    catErrand: 'Titip/Jasa',
    catDriverDesignated: 'Sopir Pengganti',
    catDriverDaily: 'Sopir Harian',
    catDriverHourly: 'Sopir Per Jam',
    catDriverAirport: 'Sopir Bandara',
  },
  community: {
    title: 'Komunitas',
    writeBtn: 'Tulis',
    searchPlaceholder: 'Cari di komunitas...',
    emptyText: 'Belum ada postingan',
    filterAll: 'Semua',
    catPopular: 'Populer',
    catChat: 'Curhat',
    catTips: 'Tips Rumah',
    catAsk: 'Tanya-Tanya',
    catAnnounce: 'Pengumuman',
  },
  mapScreen: {
    searchPlaceholder: 'Cari ART atau guru les privat...',
    filterAll: 'Semua',
    filterHelper: 'ART',
    filterTutor: 'Guru Les',
    helperLabel: 'ART',
    tutorLabel: 'Guru Les',
    locationDefault: 'Kemang',
    availableNow: '{name} siap bekerja sekarang',
    busyNow: '{name} sedang sibuk saat ini',
    bookBtn: 'Pesan Sekarang',
    notAvailableBtn: 'Tidak Tersedia',
    perHour: '/ jam',
    ratingLabel: 'Rating',
    jobsLabel: 'Selesai',
  },
  workerDetail: {
    about: 'Tentang',
    vehicle: 'Kendaraan',
    skills: 'Keahlian',
    calcTitle: 'Hitung Biaya',
    duration: 'Durasi (jam)',
    ratePerHour: 'Tarif per jam',
    escrowSystem: 'Sistem Escrow Linka',
    depositNow: 'Deposit sekarang (30%)',
    remainingAfter: 'Sisa setelah konfirmasi',
    escrowNote: 'Sisa pembayaran hanya dilepas ke mitra setelah Anda mengkonfirmasi pekerjaan selesai.',
    reviews: 'Ulasan',
    jobsDone: 'Pekerjaan',
    expYears: 'Tahun Exp',
    available: 'Tersedia',
    busy: 'Sibuk',
    bookNow: 'Pesan',
    notAvailable: 'Sedang Tidak Tersedia',
    confirmTitle: 'Konfirmasi Pemesanan',
    confirmMsg: 'Anda akan membayar deposit terlebih dahulu.\n\nSisa dibayar setelah pekerjaan selesai dan Anda konfirmasi.',
    confirmBook: 'Pesan Sekarang',
    bookSuccess: 'Berhasil!',
    bookSuccessMsg: 'Pesanan Anda telah dibuat. Mitra akan segera merespon.',
  },
  register: {
    pageTitle: 'Daftar Akun',
    titleRole: 'Daftar Akun', titleService: 'Pilih Layanan', titleCondition: 'Kondisi Kerja', titleProfile: 'Info Profil', titleAccount: 'Buat Akun',
    stepService: 'Layanan', stepCondition: 'Kondisi', stepProfile: 'Profil', stepAccount: 'Akun',
    roleQuestion: 'Saya ingin…', roleSubtitle: 'Pilih peran kamu di Linka',
    roleCustomerLabel: 'Mencari Asisten', roleCustomerSub: 'Temukan ART, guru les, atau asisten rumah tangga terpercaya di sekitar kamu',
    roleHelperLabel: 'Jadi ART / Asisten Rumah', roleHelperSub: 'Masak, bersih-bersih, jaga anak — cari pelanggan di dekat rumahmu',
    roleTutorLabel: 'Jadi Guru Les', roleTutorSub: 'Ajar berbagai mata pelajaran dan mulai menghasilkan dari rumah',
    serviceQuestion: 'Layanan apa yang bisa kamu lakukan?', serviceTip: 'Semakin banyak layanan, semakin besar peluang mendapat orderan!',
    rateTitle: 'Tarif per jam yang kamu inginkan', rateChangeNote: 'Bisa diubah kapan saja di profil', rateUnit: '/ jam', rateAverage: 'Rata-rata ART di Jakarta: Rp 25.000–40.000/jam',
    areaTitle: 'Wilayah kerja (maks. 3 pilihan)', areaSub: 'Pilih area yang bisa kamu jangkau',
    workTypeTitle: 'Tipe kerja yang diinginkan', scheduleTitle: 'Waktu yang bisa kamu bekerja',
    introTitle: 'Perkenalkan diri kamu', introSub: 'Bisa diubah kapan saja di profil',
    photoCount: 'foto', photoHint: 'Tambah foto kerja atau wajah', photoTip: 'Profil dengan foto mendapat 3× lebih banyak orderan!',
    bioTitle: 'Tentang kamu', templateHint: 'Ketuk kalimat di bawah untuk ditambahkan otomatis',
    tabExperience: 'Pengalaman', tabPersonality: 'Sifat & Sikap', tabSkill: 'Kemampuan',
    templateSelect: 'Pilih',
    accountTitleHelper: 'Hampir selesai!', accountTitleCustomer: 'Buat akun kamu',
    accountSubHelper: 'Isi data akun untuk mulai menerima orderan', accountSubCustomer: 'Daftar dan mulai cari asisten terbaik',
    labelName: 'Nama lengkap', labelPhone: 'Nomor HP / WhatsApp', labelPassword: 'Buat password',
    namePlaceholder: 'Masukkan nama lengkap', phonePlaceholder: '08xx-xxxx-xxxx', passwordPlaceholder: 'Min. 6 karakter',
    next: 'Lanjutkan', finish: 'Daftar Sekarang', skip: 'Lewati',
    artCooking: 'Masak', artCleaning: 'Bersih-bersih', artLaundry: 'Cuci & Setrika',
    artOrganizing: 'Beberes', artChildcare: 'Jaga Anak', artShopping: 'Belanja',
    artSpecialCooking: 'Masak Spesial', artGardening: 'Berkebun',
    tutorMath: 'Matematika', tutorScience: 'IPA / Sains', tutorEnglish: 'Bahasa Inggris',
    tutorMandarin: 'Mandarin', tutorCivics: 'PKN', tutorArts: 'Seni / Musik',
    tutorCoding: 'Coding', tutorSports: 'Olahraga',
    wtRegularLabel: 'Reguler', wtRegularSub: 'Jadwal tetap setiap minggu',
    wtOnceLabel: 'Sekali / Singkat', wtOnceSub: 'Satu hari atau beberapa hari',
    wtLiveinLabel: 'Tinggal', wtLiveinSub: 'Tinggal di rumah majikan',
    scMorningLabel: 'Pagi', scMorningSub: '07:00 – 12:00',
    scAfternoonLabel: 'Siang', scAfternoonSub: '12:00 – 17:00',
    scEveningLabel: 'Sore', scEveningSub: '17:00 – 21:00',
    scFlexLabel: 'Fleksibel', scFlexSub: 'Sesuai kesepakatan',
    bioPlaceholder: 'Contoh: Halo! Saya ART berpengalaman 3 tahun.\nSuka masak masakan Indonesia dan rajin bersih-bersih.',
    bioTpl0: 'Berpengalaman 3+ tahun sebagai ART di Jakarta.', bioTpl1: 'Pernah bekerja di 5+ keluarga yang berbeda.',
    bioTpl2: 'Berpengalaman menjaga anak balita dan memasak.', bioTpl3: 'Lulusan pelatihan ART profesional.',
    bioTpl4: 'Jujur, teliti, dan bertanggung jawab.', bioTpl5: 'Tepat waktu dan dapat diandalkan.',
    bioTpl6: 'Ramah, sabar, dan mudah bergaul.', bioTpl7: 'Menjaga kebersihan dan kerapihan rumah.',
    bioTpl8: 'Bisa masak masakan Indonesia berbagai daerah.', bioTpl9: 'Mahir menggunakan mesin cuci dan setrika.',
    bioTpl10: 'Bisa membuat minuman dan kue sederhana.', bioTpl11: 'Terampil membersihkan semua sudut rumah.',
    hasAccount: 'Sudah punya akun?', loginLink: 'Masuk',
    termsNote: 'Dengan mendaftar, kamu menyetujui', termsAnd: 'dan',
    termsTerms: 'Syarat & Ketentuan', termsPrivacy: 'Kebijakan Privasi',
    titleTerms: 'Syarat & Ketentuan',
    stepTerms: 'Syarat', stepCustService: 'Kebutuhan', stepCustArea: 'Lokasi',
    custServiceQuestion: 'Layanan apa yang kamu butuhkan?',
    custServiceTip: 'Pilih semua yang kamu butuhkan. Bisa diubah kapan saja.',
    custArt: 'ART / Asisten Rumah', custTutor: 'Guru Les / Tutor',
    termsOverview: 'Linka adalah platform penghubung antara pelanggan dan mitra independen. PT Linka Indonesia tidak bertanggung jawab atas hasil, kualitas, atau perselisihan antara pengguna dan mitra.',
    termsAgreeAll: 'Setujui semua syarat & ketentuan',
    termsItem1: '(Wajib) Syarat & Ketentuan Penggunaan',
    termsItem2: '(Wajib) Kebijakan Privasi & Penggunaan Data',
    termsItem3: '(Wajib) Persetujuan Berbagi Data ke Pihak Ketiga',
    termsItem4: '(Opsional) Terima notifikasi promo & komunitas',
    termsViewLabel: 'Lihat',
    roleDriverLabel: 'Saya Sopir', roleDriverSub: 'Mengemudikan mobil pelanggan',
    driverSkillTitle: 'Kemampuan Mengemudi', driverSkillSub: 'Beri tahu mobil apa yang bisa Anda kemudikan',
    driverLicenseTitle: 'Verifikasi SIM', driverLicenseSub: 'Upload foto SIM untuk verifikasi keamanan',
    driverServiceTitle: 'Jenis Layanan', driverServiceSub: 'Pilih jenis layanan mengemudi yang Anda tawarkan',
    driverAreaTitle: 'Area Operasional', driverAreaSub: 'Pilih area Anda siap beroperasi',
    vehSedan: 'Sedan', vehSuv: 'SUV', vehMpv: 'MPV', vehVan: 'Van', vehManualStick: 'Manual (Kopling)',
    drivableTypesLabel: 'Tipe Kendaraan yang Bisa Dikemudikan',
    drivableTypesSub: 'Pilih semua tipe mobil yang Anda kuasai',
    transmissionLabel: 'Transmisi',
    transAuto: 'Matic', transManual: 'Manual', transBoth: 'Keduanya',
    dsvDesignated: 'Sopir Pengganti', dsvDesignatedSub: 'Antar pulang setelah acara/minum',
    dsvDaily: 'Sopir Harian', dsvDailySub: 'Mengemudi mobil customer sehari penuh',
    dsvHourly: 'Sopir Per Jam', dsvHourlySub: 'Mengemudi sesuai jam yang dibutuhkan',
    dsvCommute: 'Sopir Rutin', dsvCommuteSub: 'Antar-jemput kantor/sekolah rutin',
    dsvAirport: 'Antar Jemput Bandara', dsvAirportSub: 'Mengemudi mobil customer ke/dari bandara',
    dsvIntercity: 'Antar Kota', dsvIntercitySub: 'Perjalanan jauh antar kota',
    dsvEvent: 'Sopir Acara', dsvEventSub: 'Pernikahan, acara keluarga, dll',
    driverExperience: 'Pengalaman Mengemudi (tahun)',
    driverLicenseClass: 'Kelas SIM',
    stepDriverSkill: 'Kemampuan', stepDriverLicense: 'SIM',
    stepDriverService: 'Layanan', stepDriverArea: 'Area',
  },
  linkaTemp: {
    title: 'Suhu Linka',
    tagline: 'Ukur kehangatan pelayanan',
    currentTemp: 'Suhu Sekarang',
    averageTemp: 'Rata-rata',
    basedOn: 'Dari {n} review',
    giveTemp: 'Beri Suhu',
    tagFriendly: 'Ramah', tagOnTime: 'Tepat waktu', tagClean: 'Bersih',
    tagSkilled: 'Terampil', tagCareful: 'Hati-hati', tagPatient: 'Sabar',
    tagWarmVibes: 'Hangat', tagCommunicative: 'Komunikatif',
    tagLate: 'Terlambat', tagRushed: 'Terburu-buru', tagCold: 'Dingin',
    tagUnclean: 'Kurang bersih', tagNotSkilled: 'Kurang terampil',
    tempUp: '+{n}°C', tempDown: '-{n}°C',
    freeTextTitle: 'Tulis pesan (opsional)',
    freeTextPlaceholder: 'Bagikan pengalamanmu...',
    submitReview: 'Kirim Review',
    thanksTitle: 'Terima kasih reviewnya!',
    thanksSub: 'Review kamu membantu komunitas Linka',
  },
  monthlyAward: {
    title: 'Terbaik bulan ini',
    helperOfMonth: 'Helper Bulan Ini',
    driverOfMonth: 'Driver Bulan Ini',
    winnerBadge: 'MVP',
    period: 'April 2026',
    reasonPrefix: 'Alasan:',
    seeAll: 'Lihat semua',
  },
};

const en: Translations = {
  appName: 'Linka',
  tagline: 'Indonesian Workforce Solution',
  onboarding: {
    slide1Title: 'Professional Driver',
    slide1Sub: 'Find trusted drivers ready\nto pick you up anytime',
    slide2Title: 'Home Assistant',
    slide2Sub: 'Get experienced helpers\nfor cleaning & cooking',
    slide3Title: 'Safe & Verified',
    slide3Sub: 'All partners are ID-verified\nwith background checks',
    next: 'Next',
    getStarted: 'Get Started',
    skip: 'Skip',
  },
  auth: {
    welcome: 'Welcome!',
    signIn: 'Sign in to your account',
    createAccount: 'Create Account',
    phone: 'Phone Number',
    phonePlaceholder: '08xxxxxxxxxx',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    forgotPassword: 'Forgot password?',
    login: 'Login',
    register: 'Register',
    noAccount: "Don't have an account? ",
    hasAccount: 'Already have an account? ',
    demoLogin: 'Quick login (demo)',
    quickLogin: 'Quick login (demo)',
    customer: 'Customer',
    driverDesc: 'Accept ride orders',
    customerDesc: 'Find & book a housekeeper',
    driver: 'Driver',
    helper: 'Housekeeper',
    helperDesc: 'Receive work orders',
    iWantTo: 'I want to...',
    findWorker: 'Find driver/helper',
    becomeDriver: 'Be a driver',
    becomeHelper: 'Be a housekeeper',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Your full name',
    minPassword: 'At least 6 characters',
    registerNow: 'Register Now',
    joinNow: 'Join Linka today',
  },
  home: {
    hello: 'Hello',
    needHelp: 'Need help today?',
    searchPlaceholder: 'Search driver or helper...',
    promo: 'PROMO',
    promoTitle: '20% Off\nFor New Helpers',
    promoSub: 'Today only!',
    activeDrivers: 'Active Drivers',
    activeHelpers: 'Active Helpers',
    customers: 'Customers',
    category: 'Category',
    all: 'All',
    allWorkers: 'All Workers',
    availableDrivers: 'Available Drivers',
    availableHelpers: 'Available Helpers',
    available: 'available',
    perHour: '/hour',
    perDay: '/day',
    jobs: 'jobs',
    noResults: 'No results found',
    verified: 'Verified',
    ctaDriver: 'Call a Driver',
    ctaDriverSub: 'Pickup & travel',
    ctaHelper: 'Book a Helper',
    ctaHelperSub: 'Cleaning & cooking',
  },
  orders: {
    myOrders: 'My Orders',
    active: 'Active',
    history: 'History',
    noOrders: 'No orders yet',
    noOrdersDesc: 'Book a driver or helper now!',
    confirmed: 'Confirmed',
    pending: 'Pending',
    ongoing: 'Ongoing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    waiting: 'Waiting',
    total: 'Total',
    review: 'Leave Review',
    reorder: 'Book Again',
    art: 'Home Assistant',
    hours: 'hrs',
    depositPaid: 'Deposit paid',
    remainingEscrow: 'Remaining (in escrow)',
    confirmBannerText: 'Job complete — confirm to release remaining payment',
    confirmTitle: 'Confirm Completion',
    confirmMsg: 'Has the job been completed well? Remaining payment will be sent to the partner.',
    notYet: 'Not Yet',
    yesConfirm: 'Yes, Confirm',
    confirmWork: 'Confirm Job Complete',
    refundNote: 'Deposit refunded within 1-3 business days',
    awaitingConfirm: 'Complete — Confirm Now',
  },
  profile: {
    title: 'Profile',
    totalOrders: 'Total Orders',
    ratingGiven: 'Rating Given',
    favorites: 'Favorites',
    editProfile: 'Edit Profile',
    savedAddress: 'Saved Addresses',
    payment: 'Payment Methods',
    notifications: 'Notifications',
    security: 'Account Security',
    helpFaq: 'Help & FAQ',
    terms: 'Terms & Conditions',
    logout: 'Logout',
    logoutConfirm: 'Logout',
    logoutMsg: 'Are you sure you want to logout?',
    cancel: 'Cancel',
    version: 'Linka v1.0.0',
    language: 'Language',
  },
  workerHome: {
    ready: 'Hello',
    readyDriver: 'Ready to drive today?',
    readyHelper: 'Ready to help today?',
    online: 'Online',
    offline: 'Offline',
    onlineDesc: 'You can receive orders',
    offlineDesc: 'Go online to receive orders',
    todayEarnings: "Today's Earnings",
    todayJobs: "Today's Jobs",
    rating: 'Rating',
    incomingRequests: 'Incoming Requests',
    accept: 'Accept',
    reject: 'Reject',
    goOnline: 'Go online to\nreceive orders',
    hours: 'hrs',
    depositHeld: 'Escrow deposit held',
    scheduleTitle: "Today's Schedule",
    servicesTitle: 'My Services',
    servicesHint: 'Tap to enable/disable',
  },
  workerOrders: {
    title: 'Work History',
    upcoming: 'Upcoming',
    completed: 'Completed',
    earnings: 'Earnings',
    startJob: 'Start Job',
    noData: 'No data yet',
    depositReceived: 'Deposit received',
    remainingWaiting: 'Remaining (pending confirmation)',
    awaitingCustomer: 'Awaiting Confirmation',
    upcomingLabel: 'Upcoming',
    markDone: 'Mark Complete',
    markDoneTitle: 'Mark Complete',
    markDoneMsg: 'Mark this job as complete? Customer will confirm before remaining payment is released.',
    markDoneConfirm: 'Mark Complete',
    autoRelease: 'Remaining payment is automatically released within 48 hours if customer does not respond',
  },
  workerProfile: {
    myRate: 'My Rate',
    perHour: 'Per Hour',
    perDay: 'Per Day',
    change: 'Change',
    editProfile: 'Edit Profile & Info',
    vehicleInfo: 'Vehicle Info',
    skillsServices: 'Skills & Services',
    documents: 'Documents & Verification',
    bankAccount: 'Bank Account',
    reviews: 'Customer Reviews',
    help: 'Help',
    experience: 'Experience',
    totalJobs: 'Total Jobs',
    verified: 'Verified',
    years: 'yrs',
  },
  lang: {
    selectLanguage: 'Select Language',
    changeLanguage: 'Change Language',
  },
  common: {
    close: 'Close',
    save: 'Save',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
  },
  nav: {
    home:      'Home',
    orders:    'Orders',
    map:       'Map',
    chat:      'Messages',
    profile:   'Profile',
    dashboard: 'Dashboard',
    jobs:      'Jobs',
  },
  chat: {
    title: 'Messages',
    noMessages: 'No messages yet',
    noMessagesDescCustomer: 'Start chatting with a partner',
    noMessagesDescWorker: 'Start chatting with customers',
    relatedOrder: 'Related to order',
    typeMessage: 'Type a message...',
    online: 'Online',
    chatBtn: 'Chat',
  },
  workerDetail: {
    about: 'About',
    vehicle: 'Vehicle',
    skills: 'Skills',
    calcTitle: 'Cost Calculator',
    duration: 'Duration (hrs)',
    ratePerHour: 'Rate per hour',
    escrowSystem: 'Linka Escrow System',
    depositNow: 'Pay deposit now (30%)',
    remainingAfter: 'Remaining after confirmation',
    escrowNote: 'Remaining payment is released to the partner only after you confirm the job is complete.',
    reviews: 'Reviews',
    jobsDone: 'Jobs',
    expYears: 'Yrs Exp',
    available: 'Available',
    busy: 'Busy',
    bookNow: 'Book',
    notAvailable: 'Currently Unavailable',
    confirmTitle: 'Booking Confirmation',
    confirmMsg: 'You will pay a deposit first.\n\nThe remaining is paid after the job is done and you confirm.',
    confirmBook: 'Book Now',
    bookSuccess: 'Success!',
    bookSuccessMsg: 'Your booking is created. The partner will respond shortly.',
  },
  services: {
    art: 'Housekeeper',
    artFull: 'Home Assistant',
    tutor: 'Tutor',
    tutorFull: 'Private Tutor',
    insurance: 'Insurance',
    lesTutor: 'Subjects',
  },
  homeNew: {
    serviceRegular: 'Regular',
    serviceSpecial: 'One-time',
    countBarText: '2,156 partners ready in Jakarta South',
    adTitle: '20% Discount Voucher 🎁',
    adSub: 'Sign up now for an instant discount!',
    adCta: 'Get Voucher',
    popularPosts: 'Popular Posts',
    seeAll: 'See All',
    filterAll: 'All',
    filterHelper: 'Housekeeper',
    filterTutor: 'Private Tutor',
    allMitra: 'All Partners',
    activeCount: 'active',
    inlineAd: 'All Linka partners are fully insured for your peace of mind.',
    locationDefault: 'South Jakarta, Kebayoran',
    catArt: 'Housekeeper',
    catCooking: 'Cooking',
    catCleaning: 'Cleaning',
    catCustom: 'Custom',
    catTutor: 'Tutoring',
    catVisit: 'Home Visit',
    catEnglish: 'English Tutor',
    catMore: 'More',
    catChildcare: 'Childcare',
    catErrand: 'Errands',
    catDriverDesignated: 'Designated',
    catDriverDaily: 'Daily Chauffeur',
    catDriverHourly: 'Hourly',
    catDriverAirport: 'Airport',
  },
  community: {
    title: 'Community',
    writeBtn: 'Write',
    searchPlaceholder: 'Search community...',
    emptyText: 'No posts yet',
    filterAll: 'All',
    catPopular: 'Popular',
    catChat: 'Chat',
    catTips: 'Home Tips',
    catAsk: 'Q&A',
    catAnnounce: 'Notice',
  },
  mapScreen: {
    searchPlaceholder: 'Search housekeeper or private tutor...',
    filterAll: 'All',
    filterHelper: 'Housekeeper',
    filterTutor: 'Tutor',
    helperLabel: 'Housekeeper',
    tutorLabel: 'Tutor',
    locationDefault: 'Kemang',
    availableNow: '{name} is available now',
    busyNow: '{name} is currently busy',
    bookBtn: 'Book Now',
    notAvailableBtn: 'Not Available',
    perHour: '/ hr',
    ratingLabel: 'Rating',
    jobsLabel: 'Done',
  },
  register: {
    pageTitle: 'Create Account',
    titleRole: 'Create Account', titleService: 'Choose Services', titleCondition: 'Work Conditions', titleProfile: 'Profile Info', titleAccount: 'Create Account',
    stepService: 'Services', stepCondition: 'Conditions', stepProfile: 'Profile', stepAccount: 'Account',
    roleQuestion: 'I want to…', roleSubtitle: 'Choose your role in Linka',
    roleCustomerLabel: 'Find an Assistant', roleCustomerSub: 'Find trusted housekeepers, tutors, or home assistants near you',
    roleHelperLabel: 'Become a Housekeeper', roleHelperSub: 'Cook, clean, babysit — find clients near your home',
    roleTutorLabel: 'Become a Tutor', roleTutorSub: 'Teach various subjects and start earning from home',
    serviceQuestion: 'What services can you offer?', serviceTip: 'More services = more chances to get orders!',
    rateTitle: 'Your desired hourly rate', rateChangeNote: 'Can be changed anytime in your profile', rateUnit: '/ hr', rateAverage: 'Average helpers in Jakarta: Rp 25,000–40,000/hr',
    areaTitle: 'Work area (max. 3 choices)', areaSub: 'Select areas you can reach',
    workTypeTitle: 'Preferred work type', scheduleTitle: 'Hours you can work',
    introTitle: 'Introduce yourself', introSub: 'Can be changed anytime in your profile',
    photoCount: 'photos', photoHint: 'Add work or face photos', photoTip: 'Profiles with photos get 3× more orders!',
    bioTitle: 'About you', templateHint: 'Tap a sentence below to add it automatically',
    tabExperience: 'Experience', tabPersonality: 'Personality', tabSkill: 'Skills',
    templateSelect: 'Select',
    accountTitleHelper: 'Almost done!', accountTitleCustomer: 'Create your account',
    accountSubHelper: 'Fill in account details to start receiving orders', accountSubCustomer: 'Register and start finding the best assistant',
    labelName: 'Full name', labelPhone: 'Phone / WhatsApp', labelPassword: 'Create password',
    namePlaceholder: 'Enter your full name', phonePlaceholder: '08xx-xxxx-xxxx', passwordPlaceholder: 'Min. 6 characters',
    next: 'Continue', finish: 'Register Now', skip: 'Skip',
    artCooking: 'Cooking', artCleaning: 'Cleaning', artLaundry: 'Laundry & Ironing',
    artOrganizing: 'Tidying Up', artChildcare: 'Childcare', artShopping: 'Grocery Shopping',
    artSpecialCooking: 'Special Cooking', artGardening: 'Gardening',
    tutorMath: 'Mathematics', tutorScience: 'Science', tutorEnglish: 'English',
    tutorMandarin: 'Mandarin', tutorCivics: 'Civics', tutorArts: 'Arts & Music',
    tutorCoding: 'Coding', tutorSports: 'Sports',
    wtRegularLabel: 'Regular', wtRegularSub: 'Fixed weekly schedule',
    wtOnceLabel: 'One-time / Short', wtOnceSub: 'One day or a few days',
    wtLiveinLabel: 'Live-in', wtLiveinSub: "Live at the employer's home",
    scMorningLabel: 'Morning', scMorningSub: '07:00 – 12:00',
    scAfternoonLabel: 'Afternoon', scAfternoonSub: '12:00 – 17:00',
    scEveningLabel: 'Evening', scEveningSub: '17:00 – 21:00',
    scFlexLabel: 'Flexible', scFlexSub: 'By agreement',
    bioPlaceholder: 'Example: Hi! I am a housekeeper with 3 years of experience.\nI enjoy cooking and keeping homes clean.',
    bioTpl0: 'Over 3 years of experience as a housekeeper in Jakarta.', bioTpl1: 'Worked with 5+ different families.',
    bioTpl2: 'Experienced in childcare and cooking.', bioTpl3: 'Graduate of a professional housekeeper training program.',
    bioTpl4: 'Honest, thorough, and responsible.', bioTpl5: 'Punctual and reliable.',
    bioTpl6: 'Friendly, patient, and easy-going.', bioTpl7: 'Committed to keeping the home clean and tidy.',
    bioTpl8: 'Can cook various regional Indonesian dishes.', bioTpl9: 'Skilled with washing machines and ironing.',
    bioTpl10: 'Can make simple drinks and pastries.', bioTpl11: 'Skilled at cleaning every corner of the house.',
    hasAccount: 'Already have an account?', loginLink: 'Log in',
    termsNote: 'By registering, you agree to our', termsAnd: 'and',
    termsTerms: 'Terms & Conditions', termsPrivacy: 'Privacy Policy',
    titleTerms: 'Terms & Conditions',
    stepTerms: 'Terms', stepCustService: 'Needs', stepCustArea: 'Location',
    custServiceQuestion: 'What services do you need?',
    custServiceTip: 'Select all that apply. You can change this later.',
    custArt: 'Home Assistant / ART', custTutor: 'Private Tutor',
    termsOverview: 'Linka connects customers with independent partners. PT Linka Indonesia is not responsible for outcomes, quality, or disputes between users and partners.',
    termsAgreeAll: 'Agree to all terms & conditions',
    termsItem1: '(Required) Terms of Service',
    termsItem2: '(Required) Privacy Policy & Data Use',
    termsItem3: '(Required) Consent to Share Data with Third Parties',
    termsItem4: '(Optional) Receive promo & community notifications',
    termsViewLabel: 'View',
    roleDriverLabel: "I'm a Driver", roleDriverSub: "Drive customers' cars for them",
    driverSkillTitle: 'Driving Skills', driverSkillSub: "Tell us what vehicles you can drive",
    driverLicenseTitle: 'License Verification', driverLicenseSub: 'Upload your driving license for verification',
    driverServiceTitle: 'Service Types', driverServiceSub: 'Pick driving services you want to offer',
    driverAreaTitle: 'Operating Area', driverAreaSub: 'Where are you available to drive?',
    vehSedan: 'Sedan', vehSuv: 'SUV', vehMpv: 'MPV', vehVan: 'Van', vehManualStick: 'Manual (stick)',
    drivableTypesLabel: 'Vehicle Types You Can Drive',
    drivableTypesSub: 'Pick all types you can handle',
    transmissionLabel: 'Transmission',
    transAuto: 'Automatic', transManual: 'Manual', transBoth: 'Both',
    dsvDesignated: 'Designated Driver', dsvDesignatedSub: 'Drive customer home after events/drinks',
    dsvDaily: 'Daily Chauffeur', dsvDailySub: "Drive customer's car for a full day",
    dsvHourly: 'Hourly Chauffeur', dsvHourlySub: 'Drive by the hour as needed',
    dsvCommute: 'Commute Driver', dsvCommuteSub: 'Regular office/school drop-offs',
    dsvAirport: 'Airport Transfer', dsvAirportSub: "Drive customer's car to/from airport",
    dsvIntercity: 'Intercity', dsvIntercitySub: 'Long-distance trips between cities',
    dsvEvent: 'Event Driver', dsvEventSub: 'Weddings, family events, etc',
    driverExperience: 'Driving Experience (years)',
    driverLicenseClass: 'License Class',
    stepDriverSkill: 'Skills', stepDriverLicense: 'License',
    stepDriverService: 'Services', stepDriverArea: 'Area',
  },
  linkaTemp: {
    title: 'Linka Temperature',
    tagline: 'Measures the warmth of care',
    currentTemp: 'Current Temp',
    averageTemp: 'Average',
    basedOn: 'Based on {n} reviews',
    giveTemp: 'Give Temperature',
    tagFriendly: 'Friendly', tagOnTime: 'On time', tagClean: 'Clean',
    tagSkilled: 'Skilled', tagCareful: 'Careful', tagPatient: 'Patient',
    tagWarmVibes: 'Warm vibes', tagCommunicative: 'Communicative',
    tagLate: 'Late', tagRushed: 'Rushed', tagCold: 'Cold',
    tagUnclean: 'Not clean', tagNotSkilled: 'Not skilled',
    tempUp: '+{n}°C', tempDown: '-{n}°C',
    freeTextTitle: 'Leave a note (optional)',
    freeTextPlaceholder: 'Share your experience...',
    submitReview: 'Submit Review',
    thanksTitle: 'Thanks for your review!',
    thanksSub: 'Your feedback helps the Linka community',
  },
  monthlyAward: {
    title: 'Top of the Month',
    helperOfMonth: 'Helper of the Month',
    driverOfMonth: 'Driver of the Month',
    winnerBadge: 'MVP',
    period: 'April 2026',
    reasonPrefix: 'Why:',
    seeAll: 'See all',
  },
};

const ko: Translations = {
  appName: 'Linka',
  tagline: '인도네시아 인력 솔루션',
  onboarding: {
    slide1Title: '전문 드라이버',
    slide1Sub: '언제든지 이용 가능한\n믿을 수 있는 드라이버를 찾아보세요',
    slide2Title: '가사 도우미',
    slide2Sub: '청소 및 요리를 위한\n경험 많은 가사도우미를 만나보세요',
    slide3Title: '안전하고 인증된',
    slide3Sub: '모든 파트너는 신분증 확인 및\n백그라운드 체크를 완료했습니다',
    next: '다음',
    getStarted: '시작하기',
    skip: '건너뛰기',
  },
  auth: {
    welcome: '환영합니다!',
    signIn: '계정에 로그인하세요',
    createAccount: '계정 만들기',
    phone: '휴대폰 번호',
    phonePlaceholder: '08xxxxxxxxxx',
    password: '비밀번호',
    passwordPlaceholder: '비밀번호를 입력하세요',
    forgotPassword: '비밀번호를 잊으셨나요?',
    login: '로그인',
    register: '회원가입',
    noAccount: '계정이 없으신가요? ',
    hasAccount: '이미 계정이 있으신가요? ',
    demoLogin: '빠른 로그인 (데모)',
    quickLogin: '빠른 로그인 (데모)',
    customer: '고객',
    driverDesc: '배차 받기',
    customerDesc: 'ART 찾기 & 예약',
    driver: '드라이버',
    helper: '가사도우미',
    helperDesc: '일감 받기',
    iWantTo: '나는...',
    findWorker: '드라이버/도우미 찾기',
    becomeDriver: '드라이버가 되기',
    becomeHelper: '가사도우미가 되기',
    fullName: '이름',
    fullNamePlaceholder: '성함을 입력하세요',
    minPassword: '최소 6자 이상',
    registerNow: '지금 가입하기',
    joinNow: '지금 Linka에 가입하세요',
  },
  home: {
    hello: '안녕하세요',
    needHelp: '오늘 도움이 필요하신가요?',
    searchPlaceholder: '드라이버 또는 도우미 검색...',
    promo: '프로모',
    promoTitle: '신규 도우미\n20% 할인',
    promoSub: '오늘만!',
    activeDrivers: '활성 드라이버',
    activeHelpers: '활성 도우미',
    customers: '고객',
    category: '카테고리',
    all: '전체',
    allWorkers: '전체 파트너',
    availableDrivers: '이용 가능한 드라이버',
    availableHelpers: '이용 가능한 도우미',
    available: '이용 가능',
    perHour: '/시간',
    perDay: '/일',
    jobs: '건',
    noResults: '결과를 찾을 수 없습니다',
    verified: '인증됨',
    ctaDriver: '드라이버 호출',
    ctaDriverSub: '픽업 & 이동',
    ctaHelper: '가사도우미 예약',
    ctaHelperSub: '청소 & 요리',
  },
  orders: {
    myOrders: '내 주문',
    active: '진행 중',
    history: '내역',
    noOrders: '주문 내역이 없습니다',
    noOrdersDesc: '지금 드라이버나 도우미를 예약해보세요!',
    confirmed: '확정됨',
    pending: '대기 중',
    ongoing: '진행 중',
    completed: '완료됨',
    cancelled: '취소됨',
    waiting: '대기 중',
    total: '합계',
    review: '리뷰 남기기',
    reorder: '다시 예약',
    art: '가사 도우미',
    hours: '시간',
    depositPaid: '보증금 납부',
    remainingEscrow: '잔금 (에스크로 보류)',
    confirmBannerText: '작업 완료 — 잔금 지급을 확인하세요',
    confirmTitle: '완료 확인',
    confirmMsg: '작업이 잘 완료되었나요? 잔금이 파트너에게 전송됩니다.',
    notYet: '아직',
    yesConfirm: '예, 확인',
    confirmWork: '작업 완료 확인',
    refundNote: '보증금은 1-3 영업일 내 환불',
    awaitingConfirm: '완료 — 확인 필요',
  },
  profile: {
    title: '프로필',
    totalOrders: '총 주문',
    ratingGiven: '제공한 평점',
    favorites: '즐겨찾기',
    editProfile: '프로필 편집',
    savedAddress: '저장된 주소',
    payment: '결제 수단',
    notifications: '알림',
    security: '계정 보안',
    helpFaq: '도움말 & FAQ',
    terms: '이용약관',
    logout: '로그아웃',
    logoutConfirm: '로그아웃',
    logoutMsg: '정말 로그아웃 하시겠습니까?',
    cancel: '취소',
    version: 'Linka v1.0.0',
    language: '언어',
  },
  workerHome: {
    ready: '안녕하세요',
    readyDriver: '오늘 운전 준비되셨나요?',
    readyHelper: '오늘 도움 준비되셨나요?',
    online: '온라인',
    offline: '오프라인',
    onlineDesc: '주문을 받을 수 있습니다',
    offlineDesc: '주문을 받으려면 온라인으로 전환하세요',
    todayEarnings: '오늘 수입',
    todayJobs: '오늘 주문',
    rating: '평점',
    incomingRequests: '들어온 요청',
    accept: '수락',
    reject: '거절',
    goOnline: '주문을 받으려면\n온라인으로 전환하세요',
    hours: '시간',
    depositHeld: '에스크로 보증금 보유',
    scheduleTitle: '오늘 일정',
    servicesTitle: '내 서비스',
    servicesHint: '탭하여 활성화/비활성화',
  },
  workerOrders: {
    title: '작업 내역',
    upcoming: '예정',
    completed: '완료',
    earnings: '수입',
    startJob: '작업 시작',
    noData: '데이터 없음',
    depositReceived: '보증금 수령',
    remainingWaiting: '잔금 (확인 대기)',
    awaitingCustomer: '확인 대기',
    upcomingLabel: '예정',
    markDone: '완료 표시',
    markDoneTitle: '완료 표시',
    markDoneMsg: '이 작업을 완료로 표시할까요? 잔금 지급 전 고객 확인이 필요합니다.',
    markDoneConfirm: '완료 표시',
    autoRelease: '고객 미응답 시 48시간 후 잔금이 자동 지급됩니다',
  },
  workerProfile: {
    myRate: '내 요금',
    perHour: '시간당',
    perDay: '일당',
    change: '변경',
    editProfile: '프로필 & 정보 편집',
    vehicleInfo: '차량 정보',
    skillsServices: '기술 & 서비스',
    documents: '서류 & 인증',
    bankAccount: '은행 계좌',
    reviews: '고객 리뷰',
    help: '도움말',
    experience: '경력',
    totalJobs: '총 작업',
    verified: '인증됨',
    years: '년',
  },
  lang: {
    selectLanguage: '언어 선택',
    changeLanguage: '언어 변경',
  },
  common: {
    close: '닫기',
    save: '저장',
    confirm: '확인',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    retry: '다시 시도',
  },
  nav: {
    home:      '홈',
    orders:    '주문',
    map:       '지도',
    chat:      '메시지',
    profile:   '프로필',
    dashboard: '대시보드',
    jobs:      '업무',
  },
  chat: {
    title: '메시지',
    noMessages: '메시지가 없습니다',
    noMessagesDescCustomer: '파트너와 대화를 시작하세요',
    noMessagesDescWorker: '고객과 대화를 시작하세요',
    relatedOrder: '관련 주문',
    typeMessage: '메시지를 입력하세요...',
    online: '온라인',
    chatBtn: '채팅',
  },
  workerDetail: {
    about: '소개',
    vehicle: '차량',
    skills: '기술',
    calcTitle: '비용 계산기',
    duration: '시간 (hrs)',
    ratePerHour: '시간당 요금',
    escrowSystem: 'Linka 에스크로 시스템',
    depositNow: '지금 보증금 납부 (30%)',
    remainingAfter: '확인 후 잔금',
    escrowNote: '작업 완료 확인 후 잔금이 파트너에게 지급됩니다.',
    reviews: '리뷰',
    jobsDone: '건',
    expYears: '경력(년)',
    available: '이용 가능',
    busy: '바쁨',
    bookNow: '예약',
    notAvailable: '현재 이용 불가',
    confirmTitle: '예약 확인',
    confirmMsg: '먼저 보증금을 납부하셔야 합니다.\n\n잔금은 작업 완료 후 확인하시면 지급됩니다.',
    confirmBook: '지금 예약',
    bookSuccess: '성공!',
    bookSuccessMsg: '예약이 완료되었습니다. 파트너가 곧 응답할 것입니다.',
  },
  services: {
    art: '가사도우미',
    artFull: '가사 도우미',
    tutor: '과외',
    tutorFull: '과외 선생님',
    insurance: '안전보험',
    lesTutor: '담당 과목',
  },
  homeNew: {
    serviceRegular: '정기 서비스',
    serviceSpecial: '단기/특별',
    countBarText: '지금 강남구에 2,156명의 도우미가 있어요',
    adTitle: '첫 예약 20% 할인 쿠폰 🎁',
    adSub: '지금 가입하면 첫 서비스 즉시 할인',
    adCta: '쿠폰 받기',
    popularPosts: '실시간 인기글',
    seeAll: '전체보기',
    filterAll: '전체',
    filterHelper: '가사도우미',
    filterTutor: '과외/학습',
    allMitra: '전체 도우미',
    activeCount: '명 활동 중',
    inlineAd: '안전보험 가입 여부 확인하셨나요? Linka 파트너는 모두 보험 가입 완료',
    locationDefault: '서울 강남구 삼성동',
    catArt: '가사도우미',
    catCooking: '요리/케이터링',
    catCleaning: '청소',
    catCustom: '맞춤',
    catTutor: '과외',
    catVisit: '방문 서비스',
    catEnglish: '영어 과외',
    catMore: '더보기',
    catChildcare: '육아도우미',
    catErrand: '심부름',
    catDriverDesignated: '대리운전',
    catDriverDaily: '일일 기사',
    catDriverHourly: '시간제 기사',
    catDriverAirport: '공항 기사',
  },
  community: {
    title: '커뮤니티',
    writeBtn: '글쓰기',
    searchPlaceholder: '커뮤니티 검색...',
    emptyText: '아직 게시글이 없어요',
    filterAll: '전체',
    catPopular: '인기글',
    catChat: '자유수다',
    catTips: '육아꿀팁',
    catAsk: '궁금해요',
    catAnnounce: '공지',
  },
  mapScreen: {
    searchPlaceholder: '가사도우미 또는 과외 선생님 검색...',
    filterAll: '전체',
    filterHelper: '가사도우미',
    filterTutor: '과외 선생님',
    helperLabel: '가사도우미',
    tutorLabel: '과외 선생님',
    locationDefault: '강남구',
    availableNow: '{name}님은 지금 바로 이용 가능합니다',
    busyNow: '{name}님은 현재 다른 작업 중입니다',
    bookBtn: '예약하기',
    notAvailableBtn: '현재 이용 불가',
    perHour: '/ 시간',
    ratingLabel: '평점',
    jobsLabel: '완료',
  },
  register: {
    pageTitle: '계정 만들기',
    titleRole: '계정 만들기', titleService: '서비스 선택', titleCondition: '근무 조건', titleProfile: '프로필 정보', titleAccount: '계정 만들기',
    stepService: '서비스', stepCondition: '조건', stepProfile: '프로필', stepAccount: '계정',
    roleQuestion: '저는…', roleSubtitle: 'Linka에서 역할을 선택하세요',
    roleCustomerLabel: '도우미 찾기', roleCustomerSub: '주변의 믿을 수 있는 가사도우미, 과외선생님, 어시스턴트를 찾으세요',
    roleHelperLabel: '가사도우미 되기', roleHelperSub: '요리, 청소, 육아 — 근처에서 고객을 찾아보세요',
    roleTutorLabel: '과외 선생님 되기', roleTutorSub: '다양한 과목을 가르치고 집에서 수입을 시작하세요',
    serviceQuestion: '어떤 서비스를 제공할 수 있나요?', serviceTip: '서비스가 많을수록 주문 받을 기회가 늘어납니다!',
    rateTitle: '원하는 시간당 요금', rateChangeNote: '프로필에서 언제든지 변경 가능', rateUnit: '/ 시간', rateAverage: '자카르타 평균: Rp 25,000–40,000/시간',
    areaTitle: '근무 지역 (최대 3개)', areaSub: '이동 가능한 지역을 선택하세요',
    workTypeTitle: '원하는 근무 유형', scheduleTitle: '일할 수 있는 시간대',
    introTitle: '자기소개', introSub: '프로필에서 언제든지 변경 가능',
    photoCount: '장', photoHint: '작업 사진이나 얼굴 사진 추가', photoTip: '사진이 있는 프로필은 주문을 3배 더 받습니다!',
    bioTitle: '나에 대해', templateHint: '아래 문장을 탭하면 자동으로 추가됩니다',
    tabExperience: '경력', tabPersonality: '성격', tabSkill: '능력',
    templateSelect: '선택',
    accountTitleHelper: '거의 다 됐어요!', accountTitleCustomer: '계정을 만드세요',
    accountSubHelper: '주문을 받기 위해 계정 정보를 입력하세요', accountSubCustomer: '가입하고 최고의 도우미를 찾아보세요',
    labelName: '이름', labelPhone: '전화번호 / 카카오', labelPassword: '비밀번호 만들기',
    namePlaceholder: '이름을 입력하세요', phonePlaceholder: '010-xxxx-xxxx', passwordPlaceholder: '최소 6자리',
    next: '다음', finish: '지금 가입하기', skip: '건너뛰기',
    artCooking: '요리', artCleaning: '청소', artLaundry: '세탁·다림질',
    artOrganizing: '정리정돈', artChildcare: '육아', artShopping: '장보기',
    artSpecialCooking: '특식 조리', artGardening: '원예',
    tutorMath: '수학', tutorScience: '과학', tutorEnglish: '영어',
    tutorMandarin: '중국어', tutorCivics: '시민교육', tutorArts: '예술·음악',
    tutorCoding: '코딩', tutorSports: '체육',
    wtRegularLabel: '정기 근무', wtRegularSub: '매주 고정 스케줄',
    wtOnceLabel: '단기·일회성', wtOnceSub: '하루 또는 며칠',
    wtLiveinLabel: '입주', wtLiveinSub: '고용주 집 거주',
    scMorningLabel: '오전', scMorningSub: '07:00 – 12:00',
    scAfternoonLabel: '오후', scAfternoonSub: '12:00 – 17:00',
    scEveningLabel: '저녁', scEveningSub: '17:00 – 21:00',
    scFlexLabel: '유연 근무', scFlexSub: '협의 후 결정',
    bioPlaceholder: '예: 안녕하세요! 3년 경력의 가정도우미입니다.\n인도네시아 요리와 청소를 좋아합니다.',
    bioTpl0: '자카르타에서 3년 이상 가정도우미 경력.', bioTpl1: '5개 이상의 가정에서 근무한 경험.',
    bioTpl2: '영·유아 돌봄 및 요리 경험 풍부.', bioTpl3: '전문 가정도우미 교육 과정 수료.',
    bioTpl4: '정직하고 꼼꼼하며 책임감 강함.', bioTpl5: '시간을 잘 지키고 믿을 수 있음.',
    bioTpl6: '친절하고 인내심 있으며 사교적.', bioTpl7: '집을 항상 깨끗하고 정돈된 상태로 유지.',
    bioTpl8: '인도네시아 각 지역 음식 요리 가능.', bioTpl9: '세탁기 사용 및 다림질 숙련.',
    bioTpl10: '간단한 음료·간식 제조 가능.', bioTpl11: '집안 구석구석 청소 능숙.',
    hasAccount: '이미 계정이 있으신가요?', loginLink: '로그인',
    termsNote: '가입하면 다음에 동의하는 것입니다', termsAnd: '및',
    termsTerms: '이용약관', termsPrivacy: '개인정보처리방침',
    titleTerms: '이용약관 동의',
    stepTerms: '약관', stepCustService: '서비스', stepCustArea: '위치',
    custServiceQuestion: '어떤 서비스가 필요하신가요?',
    custServiceTip: '필요한 서비스를 모두 선택하세요. 나중에 변경할 수 있습니다.',
    custArt: '가사도우미 (ART)', custTutor: '과외·튜터',
    termsOverview: 'Linka는 고객과 독립 파트너를 연결하는 플랫폼입니다. PT Linka Indonesia는 사용자와 파트너 간의 결과, 품질 또는 분쟁에 대해 책임을 지지 않습니다.',
    termsAgreeAll: '약관 전체 동의',
    termsItem1: '(필수) 서비스 이용약관',
    termsItem2: '(필수) 개인정보 처리방침 및 수집·이용 동의',
    termsItem3: '(필수) 개인정보 제3자 제공 동의',
    termsItem4: '(선택) 이벤트·혜택 및 알림 수신',
    termsViewLabel: '보기',
    roleDriverLabel: '드라이버예요', roleDriverSub: '고객 차량을 대신 운전해드릴게요',
    driverSkillTitle: '운전 능력', driverSkillSub: '운전 가능한 차종과 변속기를 알려주세요',
    driverLicenseTitle: '면허증 인증', driverLicenseSub: '안전한 운행을 위해 면허증을 인증해주세요',
    driverServiceTitle: '서비스 유형', driverServiceSub: '제공할 운전 서비스를 선택해주세요',
    driverAreaTitle: '운행 지역', driverAreaSub: '운행 가능한 지역을 선택해주세요',
    vehSedan: '세단', vehSuv: 'SUV', vehMpv: 'MPV', vehVan: '밴', vehManualStick: '수동 (스틱)',
    drivableTypesLabel: '운전 가능한 차종',
    drivableTypesSub: '운전해본 경험이 있는 차종을 모두 선택해주세요',
    transmissionLabel: '변속기',
    transAuto: '오토', transManual: '수동', transBoth: '둘 다',
    dsvDesignated: '대리운전', dsvDesignatedSub: '행사·회식 후 안전 귀가',
    dsvDaily: '일일 기사', dsvDailySub: '고객 차량으로 하루 종일 운전',
    dsvHourly: '시간제 기사', dsvHourlySub: '필요한 시간만큼 운전',
    dsvCommute: '출퇴근 기사', dsvCommuteSub: '정기적인 출퇴근·등하교 운전',
    dsvAirport: '공항 픽업/샌딩', dsvAirportSub: '고객 차량으로 공항 이동',
    dsvIntercity: '도시간 이동', dsvIntercitySub: '장거리 도시간 운전',
    dsvEvent: '행사 기사', dsvEventSub: '결혼식·가족 행사 기사',
    driverExperience: '운전 경력 (년)',
    driverLicenseClass: '면허 종류',
    stepDriverSkill: '능력', stepDriverLicense: '면허',
    stepDriverService: '서비스', stepDriverArea: '지역',
  },
  linkaTemp: {
    title: 'Linka 온도',
    tagline: '친절함의 따뜻함을 측정해요',
    currentTemp: '현재 온도',
    averageTemp: '평균',
    basedOn: '리뷰 {n}건 기준',
    giveTemp: '온도 주기',
    tagFriendly: '친절해요', tagOnTime: '시간 엄수', tagClean: '깔끔해요',
    tagSkilled: '실력 있어요', tagCareful: '세심해요', tagPatient: '인내심',
    tagWarmVibes: '따뜻해요', tagCommunicative: '소통 잘해요',
    tagLate: '늦었어요', tagRushed: '서둘러요', tagCold: '차가워요',
    tagUnclean: '덜 깔끔해요', tagNotSkilled: '실력 아쉬워요',
    tempUp: '+{n}°C', tempDown: '-{n}°C',
    freeTextTitle: '한마디 남기기 (선택)',
    freeTextPlaceholder: '경험을 공유해주세요...',
    submitReview: '리뷰 보내기',
    thanksTitle: '리뷰 감사합니다!',
    thanksSub: '여러분의 리뷰는 Linka 커뮤니티에 큰 도움이 됩니다',
  },
  monthlyAward: {
    title: '이 달의',
    helperOfMonth: '이 달의 헬퍼',
    driverOfMonth: '이 달의 드라이버',
    winnerBadge: 'MVP',
    period: '2026년 4월',
    reasonPrefix: '이유:',
    seeAll: '전체 보기',
  },
};

const zh: Translations = {
  appName: 'Linka',
  tagline: '印尼劳动力解决方案',
  onboarding: {
    slide1Title: '专业司机',
    slide1Sub: '随时找到可信赖的司机\n为您提供接送服务',
    slide2Title: '家政助手',
    slide2Sub: '聘请经验丰富的家政人员\n负责清洁与烹饪',
    slide3Title: '安全认证',
    slide3Sub: '所有合作伙伴已完成\n身份证和背景审查',
    next: '下一步',
    getStarted: '立即开始',
    skip: '跳过',
  },
  auth: {
    welcome: '欢迎回来！',
    signIn: '登录您的账户',
    createAccount: '创建账户',
    phone: '手机号码',
    phonePlaceholder: '08xxxxxxxxxx',
    password: '密码',
    passwordPlaceholder: '请输入密码',
    forgotPassword: '忘记密码？',
    login: '登录',
    register: '注册',
    noAccount: '还没有账户？',
    hasAccount: '已有账户？',
    demoLogin: '快速登录（演示）',
    quickLogin: '快速登录（演示）',
    customer: '客户',
    driverDesc: '接受订单',
    customerDesc: '查找并预约家政',
    driver: '司机',
    helper: '家政',
    helperDesc: '接收工作订单',
    iWantTo: '我想要...',
    findWorker: '找司机/家政',
    becomeDriver: '成为司机',
    becomeHelper: '成为家政',
    fullName: '全名',
    fullNamePlaceholder: '请输入您的全名',
    minPassword: '至少6个字符',
    registerNow: '立即注册',
    joinNow: '立即加入Linka',
  },
  home: {
    hello: '你好',
    needHelp: '今天需要帮助吗？',
    searchPlaceholder: '搜索司机或家政...',
    promo: '促销',
    promoTitle: '新家政\n八折优惠',
    promoSub: '仅限今天！',
    activeDrivers: '在线司机',
    activeHelpers: '在线家政',
    customers: '客户',
    category: '分类',
    all: '全部',
    allWorkers: '所有合作伙伴',
    availableDrivers: '可用司机',
    availableHelpers: '可用家政',
    available: '可用',
    perHour: '/小时',
    perDay: '/天',
    jobs: '单',
    noResults: '未找到结果',
    verified: '已认证',
    ctaDriver: '叫司机',
    ctaDriverSub: '接送与出行',
    ctaHelper: '预约家政',
    ctaHelperSub: '清洁与烹饪',
  },
  orders: {
    myOrders: '我的订单',
    active: '进行中',
    history: '历史',
    noOrders: '暂无订单',
    noOrdersDesc: '立即预订司机或家政！',
    confirmed: '已确认',
    pending: '待确认',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    waiting: '等待中',
    total: '合计',
    review: '写评价',
    reorder: '再次预订',
    art: '家政助手',
    hours: '小时',
    depositPaid: '已付保证金',
    remainingEscrow: '余款（托管中）',
    confirmBannerText: '工作已完成 — 请确认以释放余款',
    confirmTitle: '确认完成',
    confirmMsg: '工作是否已顺利完成？余款将发送给合作伙伴。',
    notYet: '还没',
    yesConfirm: '是的，确认',
    confirmWork: '确认工作完成',
    refundNote: '保证金将在1-3个工作日内退回',
    awaitingConfirm: '已完成 — 待确认',
  },
  profile: {
    title: '个人资料',
    totalOrders: '总订单',
    ratingGiven: '评分记录',
    favorites: '收藏',
    editProfile: '编辑资料',
    savedAddress: '保存地址',
    payment: '支付方式',
    notifications: '通知',
    security: '账户安全',
    helpFaq: '帮助与FAQ',
    terms: '条款与条件',
    logout: '退出登录',
    logoutConfirm: '退出登录',
    logoutMsg: '确定要退出登录吗？',
    cancel: '取消',
    version: 'Linka v1.0.0',
    language: '语言',
  },
  workerHome: {
    ready: '你好',
    readyDriver: '今天准备好出车了吗？',
    readyHelper: '今天准备好服务了吗？',
    online: '在线',
    offline: '离线',
    onlineDesc: '您可以接受订单',
    offlineDesc: '上线以接受订单',
    todayEarnings: '今日收入',
    todayJobs: '今日订单',
    rating: '评分',
    incomingRequests: '新订单请求',
    accept: '接受',
    reject: '拒绝',
    goOnline: '上线以\n接受订单',
    hours: '小时',
    depositHeld: '托管保证金已保留',
    scheduleTitle: '今日日程',
    servicesTitle: '我的服务',
    servicesHint: '点击启用/禁用',
  },
  workerOrders: {
    title: '工作记录',
    upcoming: '即将进行',
    completed: '已完成',
    earnings: '收入',
    startJob: '开始工作',
    noData: '暂无数据',
    depositReceived: '已收到保证金',
    remainingWaiting: '余款（待确认）',
    awaitingCustomer: '等待确认',
    upcomingLabel: '即将进行',
    markDone: '标记完成',
    markDoneTitle: '标记完成',
    markDoneMsg: '将此工作标记为完成？余款在客户确认前将暂时保留。',
    markDoneConfirm: '标记完成',
    autoRelease: '如客户未响应，余款将在48小时后自动释放',
  },
  workerProfile: {
    myRate: '我的价格',
    perHour: '每小时',
    perDay: '每天',
    change: '修改',
    editProfile: '编辑资料',
    vehicleInfo: '车辆信息',
    skillsServices: '技能与服务',
    documents: '证件与认证',
    bankAccount: '银行账户',
    reviews: '客户评价',
    help: '帮助',
    experience: '经验',
    totalJobs: '总工作量',
    verified: '已认证',
    years: '年',
  },
  lang: {
    selectLanguage: '选择语言',
    changeLanguage: '更改语言',
  },
  common: {
    close: '关闭',
    save: '保存',
    confirm: '确认',
    loading: '加载中...',
    error: '出现错误',
    retry: '重试',
  },
  nav: {
    home:      '首页',
    orders:    '订单',
    map:       '地图',
    chat:      '消息',
    profile:   '我的',
    dashboard: '主页',
    jobs:      '工作',
  },
  chat: {
    title: '消息',
    noMessages: '暂无消息',
    noMessagesDescCustomer: '开始与合作伙伴聊天',
    noMessagesDescWorker: '开始与客户聊天',
    relatedOrder: '相关订单',
    typeMessage: '输入消息...',
    online: '在线',
    chatBtn: '聊天',
  },
  workerDetail: {
    about: '简介',
    vehicle: '车辆',
    skills: '技能',
    calcTitle: '费用计算器',
    duration: '时长（小时）',
    ratePerHour: '每小时费率',
    escrowSystem: 'Linka 托管系统',
    depositNow: '现在支付保证金（30%）',
    remainingAfter: '确认后支付余款',
    escrowNote: '余款仅在您确认工作完成后才会释放给合作伙伴。',
    reviews: '评价',
    jobsDone: '单',
    expYears: '年经验',
    available: '可用',
    busy: '忙碌',
    bookNow: '预约',
    notAvailable: '当前不可用',
    confirmTitle: '预约确认',
    confirmMsg: '您需要先支付保证金。\n\n余款在工作完成并确认后支付。',
    confirmBook: '立即预约',
    bookSuccess: '成功！',
    bookSuccessMsg: '预约已创建。合作伙伴将很快回复。',
  },
  services: {
    art: '家政',
    artFull: '家政服务',
    tutor: '辅导',
    tutorFull: '私人辅导老师',
    insurance: '保险',
    lesTutor: '辅导科目',
  },
  homeNew: {
    serviceRegular: '定期服务',
    serviceSpecial: '单次/特别',
    countBarText: '雅加达南区现有2,156位合作伙伴',
    adTitle: '首次预约八折优惠 🎁',
    adSub: '立即注册，马上享受优惠！',
    adCta: '领取优惠券',
    popularPosts: '热门帖子',
    seeAll: '查看全部',
    filterAll: '全部',
    filterHelper: '家政',
    filterTutor: '私人辅导',
    allMitra: '所有合作伙伴',
    activeCount: '位在线',
    inlineAd: '所有Linka合作伙伴均已投保，让您安心无忧。',
    locationDefault: '雅加达南区',
    catArt: '家政',
    catCooking: '烹饪/外卖',
    catCleaning: '清洁',
    catCustom: '定制',
    catTutor: '私教',
    catVisit: '上门服务',
    catEnglish: '英语辅导',
    catMore: '更多',
    catChildcare: '育儿助手',
    catErrand: '跑腿服务',
    catDriverDesignated: '代驾',
    catDriverDaily: '日间司机',
    catDriverHourly: '小时司机',
    catDriverAirport: '机场司机',
  },
  community: {
    title: '社区',
    writeBtn: '发帖',
    searchPlaceholder: '搜索社区...',
    emptyText: '暂无帖子',
    filterAll: '全部',
    catPopular: '热门',
    catChat: '聊天',
    catTips: '家居技巧',
    catAsk: '问答',
    catAnnounce: '公告',
  },
  mapScreen: {
    searchPlaceholder: '搜索家政或私人辅导...',
    filterAll: '全部',
    filterHelper: '家政',
    filterTutor: '辅导老师',
    helperLabel: '家政',
    tutorLabel: '辅导老师',
    locationDefault: '克曼',
    availableNow: '{name}现在可以工作',
    busyNow: '{name}目前正忙',
    bookBtn: '立即预约',
    notAvailableBtn: '暂不可用',
    perHour: '/ 小时',
    ratingLabel: '评分',
    jobsLabel: '完成',
  },
  register: {
    pageTitle: '创建账户',
    titleRole: '创建账户', titleService: '选择服务', titleCondition: '工作条件', titleProfile: '个人信息', titleAccount: '创建账户',
    stepService: '服务', stepCondition: '条件', stepProfile: '资料', stepAccount: '账户',
    roleQuestion: '我想…', roleSubtitle: '在 Linka 选择你的角色',
    roleCustomerLabel: '寻找助手', roleCustomerSub: '在附近找到可靠的家政、家教或家庭助理',
    roleHelperLabel: '成为家政人员', roleHelperSub: '做饭、打扫、照顾孩子 — 在附近找客户',
    roleTutorLabel: '成为家教', roleTutorSub: '教授各种科目，开始在家赚钱',
    serviceQuestion: '你能提供哪些服务？', serviceTip: '服务越多，获得订单的机会越大！',
    rateTitle: '你期望的时薪', rateChangeNote: '可随时在个人资料中更改', rateUnit: '/ 小时', rateAverage: '雅加达平均: Rp 25,000–40,000/小时',
    areaTitle: '工作区域（最多3个）', areaSub: '选择你能到达的区域',
    workTypeTitle: '偏好的工作类型', scheduleTitle: '可工作的时间段',
    introTitle: '介绍你自己', introSub: '可随时在个人资料中更改',
    photoCount: '张照片', photoHint: '添加工作照或正面照', photoTip: '有照片的资料订单量多3倍！',
    bioTitle: '关于我', templateHint: '点击下方句子自动添加',
    tabExperience: '经验', tabPersonality: '性格', tabSkill: '技能',
    templateSelect: '选择',
    accountTitleHelper: '快完成了！', accountTitleCustomer: '创建你的账户',
    accountSubHelper: '填写账户信息以开始接单', accountSubCustomer: '注册并开始寻找最佳助手',
    labelName: '全名', labelPhone: '手机号 / WhatsApp', labelPassword: '创建密码',
    namePlaceholder: '输入你的全名', phonePlaceholder: '08xx-xxxx-xxxx', passwordPlaceholder: '最少6个字符',
    next: '继续', finish: '立即注册', skip: '跳过',
    artCooking: '烹饪', artCleaning: '清洁', artLaundry: '洗衣熨烫',
    artOrganizing: '整理收纳', artChildcare: '照顾孩子', artShopping: '购物',
    artSpecialCooking: '特色烹饪', artGardening: '园艺',
    tutorMath: '数学', tutorScience: '理科', tutorEnglish: '英语',
    tutorMandarin: '普通话', tutorCivics: '公民教育', tutorArts: '艺术/音乐',
    tutorCoding: '编程', tutorSports: '体育',
    wtRegularLabel: '定期工作', wtRegularSub: '每周固定排班',
    wtOnceLabel: '一次性/短期', wtOnceSub: '一天或几天',
    wtLiveinLabel: '住家', wtLiveinSub: '住在雇主家中',
    scMorningLabel: '早上', scMorningSub: '07:00 – 12:00',
    scAfternoonLabel: '下午', scAfternoonSub: '12:00 – 17:00',
    scEveningLabel: '傍晚', scEveningSub: '17:00 – 21:00',
    scFlexLabel: '灵活', scFlexSub: '按协议',
    bioPlaceholder: '示例：您好！我是有3年经验的家政员。\n擅长烹饪和家居清洁。',
    bioTpl0: '在雅加达担任家政超过3年。', bioTpl1: '曾在5个以上家庭工作。',
    bioTpl2: '有育儿和烹饪经验。', bioTpl3: '毕业于专业家政培训课程。',
    bioTpl4: '诚实、细心、负责任。', bioTpl5: '守时可靠。',
    bioTpl6: '友好、耐心、容易相处。', bioTpl7: '保持家居整洁干净。',
    bioTpl8: '会做各地印尼菜肴。', bioTpl9: '擅长使用洗衣机和熨烫。',
    bioTpl10: '会制作简单饮料和糕点。', bioTpl11: '擅长清洁家中每个角落。',
    hasAccount: '已有账号？', loginLink: '登录',
    termsNote: '注册即表示您同意', termsAnd: '和',
    termsTerms: '服务条款', termsPrivacy: '隐私政策',
    titleTerms: '服务条款同意',
    stepTerms: '条款', stepCustService: '需求', stepCustArea: '位置',
    custServiceQuestion: '您需要什么服务？',
    custServiceTip: '选择所有适用项，之后可以更改。',
    custArt: '家政员（ART）', custTutor: '家教/辅导',
    termsOverview: 'Linka连接客户与独立合作伙伴。PT Linka Indonesia不对用户与合作伙伴之间的结果、质量或纠纷承担责任。',
    termsAgreeAll: '同意全部条款',
    termsItem1: '（必填）服务使用条款',
    termsItem2: '（必填）隐私政策及数据使用',
    termsItem3: '（必填）同意向第三方共享数据',
    termsItem4: '（可选）接收促销和社区通知',
    termsViewLabel: '查看',
    roleDriverLabel: '我是司机', roleDriverSub: '代替客户驾驶其车辆',
    driverSkillTitle: '驾驶能力', driverSkillSub: '告诉我们你能驾驶的车型',
    driverLicenseTitle: '驾照验证', driverLicenseSub: '为确保安全，请上传驾照照片',
    driverServiceTitle: '服务类型', driverServiceSub: '选择你愿意提供的驾驶服务',
    driverAreaTitle: '运营区域', driverAreaSub: '选择可运营的区域',
    vehSedan: '轿车', vehSuv: 'SUV', vehMpv: 'MPV', vehVan: '面包车', vehManualStick: '手动挡',
    drivableTypesLabel: '可驾驶车型',
    drivableTypesSub: '选择你擅长驾驶的所有车型',
    transmissionLabel: '变速器',
    transAuto: '自动挡', transManual: '手动挡', transBoth: '都可以',
    dsvDesignated: '代驾', dsvDesignatedSub: '聚会后安全送客回家',
    dsvDaily: '日间司机', dsvDailySub: '全天驾驶客户车辆',
    dsvHourly: '小时司机', dsvHourlySub: '按小时提供驾驶',
    dsvCommute: '通勤司机', dsvCommuteSub: '定期上下班/上下学接送',
    dsvAirport: '机场接送', dsvAirportSub: '驾驶客户车辆往返机场',
    dsvIntercity: '跨城出行', dsvIntercitySub: '长距离跨城驾驶',
    dsvEvent: '活动司机', dsvEventSub: '婚礼、家庭活动等',
    driverExperience: '驾驶经验（年）',
    driverLicenseClass: '驾照类别',
    stepDriverSkill: '能力', stepDriverLicense: '驾照',
    stepDriverService: '服务', stepDriverArea: '区域',
  },
  linkaTemp: {
    title: 'Linka温度',
    tagline: '测量服务的温暖度',
    currentTemp: '当前温度',
    averageTemp: '平均',
    basedOn: '基于 {n} 条评价',
    giveTemp: '给予温度',
    tagFriendly: '友善', tagOnTime: '准时', tagClean: '整洁',
    tagSkilled: '娴熟', tagCareful: '细心', tagPatient: '耐心',
    tagWarmVibes: '温暖', tagCommunicative: '沟通好',
    tagLate: '迟到', tagRushed: '匆忙', tagCold: '冷淡',
    tagUnclean: '不够干净', tagNotSkilled: '不够熟练',
    tempUp: '+{n}°C', tempDown: '-{n}°C',
    freeTextTitle: '留言（可选）',
    freeTextPlaceholder: '分享你的体验...',
    submitReview: '提交评价',
    thanksTitle: '感谢你的评价！',
    thanksSub: '你的反馈帮助了 Linka 社区',
  },
  monthlyAward: {
    title: '本月之最',
    helperOfMonth: '本月助手',
    driverOfMonth: '本月司机',
    winnerBadge: 'MVP',
    period: '2026年4月',
    reasonPrefix: '理由:',
    seeAll: '查看全部',
  },
};

const ja: Translations = {
  appName: 'Linka',
  tagline: 'インドネシア人材ソリューション',
  onboarding: {
    slide1Title: 'プロのドライバー',
    slide1Sub: 'いつでも信頼できるドライバーを\n見つけましょう',
    slide2Title: '家事ヘルパー',
    slide2Sub: '掃除・料理ができる\n経験豊富なヘルパーを探しましょう',
    slide3Title: '安全・認証済み',
    slide3Sub: '全パートナーはID確認と\n身元調査を完了しています',
    next: '次へ',
    getStarted: 'はじめる',
    skip: 'スキップ',
  },
  auth: {
    welcome: 'ようこそ！',
    signIn: 'アカウントにサインイン',
    createAccount: 'アカウント作成',
    phone: '電話番号',
    phonePlaceholder: '08xxxxxxxxxx',
    password: 'パスワード',
    passwordPlaceholder: 'パスワードを入力',
    forgotPassword: 'パスワードを忘れた方',
    login: 'ログイン',
    register: '登録',
    noAccount: 'アカウントをお持ちでないですか？ ',
    hasAccount: 'すでにアカウントをお持ちですか？ ',
    demoLogin: 'クイックログイン（デモ）',
    quickLogin: 'クイックログイン（デモ）',
    customer: 'お客様',
    driverDesc: '依頼を受ける',
    customerDesc: 'ヘルパーを探して予約',
    driver: 'ドライバー',
    helper: '家事ヘルパー',
    helperDesc: '仕事依頼を受け取る',
    iWantTo: '私は...',
    findWorker: 'ドライバー/ヘルパーを探す',
    becomeDriver: 'ドライバーになる',
    becomeHelper: 'ヘルパーになる',
    fullName: '氏名',
    fullNamePlaceholder: 'お名前を入力してください',
    minPassword: '6文字以上',
    registerNow: '今すぐ登録',
    joinNow: 'Linkaに参加しましょう',
  },
  home: {
    hello: 'こんにちは',
    needHelp: '今日はお手伝いが必要ですか？',
    searchPlaceholder: 'ドライバーまたはヘルパーを検索...',
    promo: 'キャンペーン',
    promoTitle: '新規ヘルパー\n20%オフ',
    promoSub: '本日限り！',
    activeDrivers: '稼働中ドライバー',
    activeHelpers: '稼働中ヘルパー',
    customers: 'お客様',
    category: 'カテゴリ',
    all: 'すべて',
    allWorkers: '全パートナー',
    availableDrivers: '利用可能なドライバー',
    availableHelpers: '利用可能なヘルパー',
    available: '利用可能',
    perHour: '/時間',
    perDay: '/日',
    jobs: '件',
    noResults: '結果が見つかりません',
    verified: '認証済み',
    ctaDriver: 'ドライバーを呼ぶ',
    ctaDriverSub: '送迎・移動',
    ctaHelper: 'ヘルパーを予約',
    ctaHelperSub: '清掃・料理',
  },
  orders: {
    myOrders: '注文履歴',
    active: '進行中',
    history: '履歴',
    noOrders: '注文がありません',
    noOrdersDesc: 'ドライバーやヘルパーを予約しましょう！',
    confirmed: '確定済み',
    pending: '保留中',
    ongoing: '進行中',
    completed: '完了',
    cancelled: 'キャンセル',
    waiting: '待機中',
    total: '合計',
    review: 'レビューを書く',
    reorder: '再予約',
    art: '家事ヘルパー',
    hours: '時間',
    depositPaid: '支払済み保証金',
    remainingEscrow: '残金（エスクロー保留中）',
    confirmBannerText: '作業完了 — 残金の支払いを確認してください',
    confirmTitle: '完了確認',
    confirmMsg: '作業は無事に完了しましたか？残金がパートナーに送金されます。',
    notYet: 'まだ',
    yesConfirm: 'はい、確認',
    confirmWork: '作業完了を確認',
    refundNote: '保証金は1〜3営業日以内に返金されます',
    awaitingConfirm: '完了 — 確認待ち',
  },
  profile: {
    title: 'プロフィール',
    totalOrders: '総注文数',
    ratingGiven: '評価数',
    favorites: 'お気に入り',
    editProfile: 'プロフィール編集',
    savedAddress: '保存済み住所',
    payment: '支払い方法',
    notifications: '通知',
    security: 'アカウントセキュリティ',
    helpFaq: 'ヘルプ & FAQ',
    terms: '利用規約',
    logout: 'ログアウト',
    logoutConfirm: 'ログアウト',
    logoutMsg: 'ログアウトしてもよろしいですか？',
    cancel: 'キャンセル',
    version: 'Linka v1.0.0',
    language: '言語',
  },
  workerHome: {
    ready: 'こんにちは',
    readyDriver: '今日の運転準備はできていますか？',
    readyHelper: '今日のお手伝い準備はできていますか？',
    online: 'オンライン',
    offline: 'オフライン',
    onlineDesc: '注文を受け付けることができます',
    offlineDesc: 'オンラインにして注文を受け付けましょう',
    todayEarnings: '本日の収入',
    todayJobs: '本日の注文',
    rating: '評価',
    incomingRequests: '新着リクエスト',
    accept: '承諾',
    reject: '拒否',
    goOnline: 'オンラインにして\n注文を受け付けましょう',
    hours: '時間',
    depositHeld: 'エスクロー保証金を保留中',
    scheduleTitle: '本日のスケジュール',
    servicesTitle: '私のサービス',
    servicesHint: 'タップで有効/無効',
  },
  workerOrders: {
    title: '作業履歴',
    upcoming: '予定',
    completed: '完了',
    earnings: '収入',
    startJob: '作業開始',
    noData: 'データなし',
    depositReceived: '保証金受領',
    remainingWaiting: '残金（確認待ち）',
    awaitingCustomer: '確認待ち',
    upcomingLabel: '予定',
    markDone: '完了にする',
    markDoneTitle: '完了にする',
    markDoneMsg: 'この作業を完了としてマークしますか？残金はお客様の確認後に支払われます。',
    markDoneConfirm: '完了にする',
    autoRelease: 'お客様が応答しない場合、48時間後に残金が自動的に支払われます',
  },
  workerProfile: {
    myRate: '料金設定',
    perHour: '時間単価',
    perDay: '日単価',
    change: '変更',
    editProfile: 'プロフィール編集',
    vehicleInfo: '車両情報',
    skillsServices: 'スキルとサービス',
    documents: '書類と認証',
    bankAccount: '銀行口座',
    reviews: 'お客様レビュー',
    help: 'ヘルプ',
    experience: '経験',
    totalJobs: '総作業数',
    verified: '認証済み',
    years: '年',
  },
  lang: {
    selectLanguage: '言語を選択',
    changeLanguage: '言語を変更',
  },
  common: {
    close: '閉じる',
    save: '保存',
    confirm: '確認',
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    retry: '再試行',
  },
  nav: {
    home:      'ホーム',
    orders:    '注文',
    map:       '地図',
    chat:      'メッセージ',
    profile:   'プロフィール',
    dashboard: 'ダッシュ',
    jobs:      '仕事',
  },
  chat: {
    title: 'メッセージ',
    noMessages: 'メッセージはありません',
    noMessagesDescCustomer: 'パートナーとチャットを始めましょう',
    noMessagesDescWorker: 'お客様とチャットを始めましょう',
    relatedOrder: '関連注文',
    typeMessage: 'メッセージを入力...',
    online: 'オンライン',
    chatBtn: 'チャット',
  },
  workerDetail: {
    about: '紹介',
    vehicle: '車両',
    skills: 'スキル',
    calcTitle: '料金計算',
    duration: '時間（hrs）',
    ratePerHour: '時間単価',
    escrowSystem: 'Linkaエスクローシステム',
    depositNow: '今すぐ保証金を支払う（30%）',
    remainingAfter: '確認後の残金',
    escrowNote: '残金はお客様が作業完了を確認した後にパートナーへ支払われます。',
    reviews: 'レビュー',
    jobsDone: '件',
    expYears: '年経験',
    available: '利用可能',
    busy: '対応中',
    bookNow: '予約',
    notAvailable: '現在利用不可',
    confirmTitle: '予約確認',
    confirmMsg: '最初に保証金をお支払いいただきます。\n\n残金は作業完了後にご確認いただけます。',
    confirmBook: '今すぐ予約',
    bookSuccess: '成功！',
    bookSuccessMsg: '予約が完了しました。パートナーがまもなく応答します。',
  },
  services: {
    art: 'ヘルパー',
    artFull: '家事ヘルパー',
    tutor: '家庭教師',
    tutorFull: 'プライベート家庭教師',
    insurance: '保険',
    lesTutor: '担当科目',
  },
  homeNew: {
    serviceRegular: '定期サービス',
    serviceSpecial: '単発/特別',
    countBarText: 'ジャカルタ南部に2,156人のパートナーがいます',
    adTitle: '初回予約20%オフクーポン 🎁',
    adSub: '今すぐ登録してすぐに割引！',
    adCta: 'クーポンをもらう',
    popularPosts: '人気投稿',
    seeAll: '全て見る',
    filterAll: 'すべて',
    filterHelper: 'ヘルパー',
    filterTutor: '家庭教師',
    allMitra: '全パートナー',
    activeCount: '人稼働中',
    inlineAd: '全Linkaパートナーは保険加入済みです。安心してご利用ください。',
    locationDefault: 'ジャカルタ南部',
    catArt: '家事代行',
    catCooking: '料理/ケータリング',
    catCleaning: '清掃',
    catCustom: 'カスタム',
    catTutor: '家庭教師',
    catVisit: '訪問サービス',
    catEnglish: '英語レッスン',
    catMore: 'その他',
    catChildcare: '育児サポート',
    catErrand: 'お使い代行',
    catDriverDesignated: '代行運転',
    catDriverDaily: '日給ドライバー',
    catDriverHourly: '時間制ドライバー',
    catDriverAirport: '空港送迎',
  },
  community: {
    title: 'コミュニティ',
    writeBtn: '投稿',
    searchPlaceholder: 'コミュニティを検索...',
    emptyText: '投稿がまだありません',
    filterAll: 'すべて',
    catPopular: '人気',
    catChat: 'おしゃべり',
    catTips: '家事コツ',
    catAsk: '質問',
    catAnnounce: 'お知らせ',
  },
  mapScreen: {
    searchPlaceholder: 'ヘルパーまたは家庭教師を検索...',
    filterAll: 'すべて',
    filterHelper: 'ヘルパー',
    filterTutor: '家庭教師',
    helperLabel: 'ヘルパー',
    tutorLabel: '家庭教師',
    locationDefault: 'クマン',
    availableNow: '{name}さんはただいま利用可能です',
    busyNow: '{name}さんはただいま対応中です',
    bookBtn: '予約する',
    notAvailableBtn: '利用不可',
    perHour: '/ 時間',
    ratingLabel: '評価',
    jobsLabel: '完了',
  },
  register: {
    pageTitle: 'アカウント作成',
    titleRole: 'アカウント作成', titleService: 'サービス選択', titleCondition: '勤務条件', titleProfile: 'プロフィール情報', titleAccount: 'アカウント作成',
    stepService: 'サービス', stepCondition: '条件', stepProfile: 'プロフィール', stepAccount: 'アカウント',
    roleQuestion: '私は…', roleSubtitle: 'Linkaでの役割を選んでください',
    roleCustomerLabel: 'アシスタントを探す', roleCustomerSub: '近くの信頼できる家政婦、家庭教師、家庭アシスタントを見つけましょう',
    roleHelperLabel: '家政婦になる', roleHelperSub: '料理・掃除・育児 — 自宅近くでお客様を探しましょう',
    roleTutorLabel: '家庭教師になる', roleTutorSub: '様々な科目を教えて、自宅から収入を得ましょう',
    serviceQuestion: '提供できるサービスは何ですか？', serviceTip: 'サービスが多いほど注文が来やすくなります！',
    rateTitle: '希望の時給', rateChangeNote: 'プロフィールでいつでも変更できます', rateUnit: '/ 時間', rateAverage: 'ジャカルタ平均: Rp 25,000–40,000/時間',
    areaTitle: '勤務エリア（最大3つ）', areaSub: '対応できるエリアを選択してください',
    workTypeTitle: '希望の勤務形態', scheduleTitle: '働ける時間帯',
    introTitle: '自己紹介', introSub: 'プロフィールでいつでも変更できます',
    photoCount: '枚の写真', photoHint: '仕事や顔写真を追加する', photoTip: '写真ありのプロフィールは注文が3倍多くなります！',
    bioTitle: '自己PR', templateHint: '下の文章をタップすると自動追加されます',
    tabExperience: '経験', tabPersonality: '性格', tabSkill: 'スキル',
    templateSelect: '選択',
    accountTitleHelper: 'もう少しで完了！', accountTitleCustomer: 'アカウントを作成する',
    accountSubHelper: '注文を受けるためにアカウント情報を入力してください', accountSubCustomer: '登録して最高のアシスタントを探しましょう',
    labelName: '氏名', labelPhone: '電話番号 / WhatsApp', labelPassword: 'パスワードを作成',
    namePlaceholder: '氏名を入力してください', phonePlaceholder: '08xx-xxxx-xxxx', passwordPlaceholder: '最低6文字',
    next: '次へ', finish: '今すぐ登録', skip: 'スキップ',
    artCooking: '料理', artCleaning: '清掃', artLaundry: '洗濯・アイロン',
    artOrganizing: '片付け', artChildcare: '育児', artShopping: '買い物',
    artSpecialCooking: '特別料理', artGardening: 'ガーデニング',
    tutorMath: '数学', tutorScience: '理科', tutorEnglish: '英語',
    tutorMandarin: '中国語', tutorCivics: '公民', tutorArts: '芸術・音楽',
    tutorCoding: 'プログラミング', tutorSports: '体育',
    wtRegularLabel: '定期勤務', wtRegularSub: '毎週固定スケジュール',
    wtOnceLabel: '単発・短期', wtOnceSub: '1日または数日',
    wtLiveinLabel: '住み込み', wtLiveinSub: '雇用主宅に居住',
    scMorningLabel: '午前', scMorningSub: '07:00 – 12:00',
    scAfternoonLabel: '午後', scAfternoonSub: '12:00 – 17:00',
    scEveningLabel: '夕方', scEveningSub: '17:00 – 21:00',
    scFlexLabel: 'フレックス', scFlexSub: '要相談',
    bioPlaceholder: '例：こんにちは！3年の経験を持つ家政婦です。\n料理と掃除が得意です。',
    bioTpl0: 'ジャカルタで家政婦として3年以上の経験。', bioTpl1: '5軒以上の家庭で勤務した経験。',
    bioTpl2: '育児・料理の経験が豊富。', bioTpl3: '専門的な家政婦研修を修了。',
    bioTpl4: '誠実で丁寧、責任感が強い。', bioTpl5: '時間を守り、信頼できる。',
    bioTpl6: '親切で忍耐力があり、コミュニケーション上手。', bioTpl7: '家の清潔と整頓を心がける。',
    bioTpl8: 'インドネシア各地の料理ができる。', bioTpl9: '洗濯機の使用とアイロンが得意。',
    bioTpl10: '簡単な飲み物やお菓子を作れる。', bioTpl11: '家の隅々まで掃除が得意。',
    hasAccount: 'すでにアカウントをお持ちですか？', loginLink: 'ログイン',
    termsNote: '登録することで以下に同意します', termsAnd: 'と',
    termsTerms: '利用規約', termsPrivacy: 'プライバシーポリシー',
    titleTerms: '利用規約の同意',
    stepTerms: '規約', stepCustService: 'サービス', stepCustArea: 'エリア',
    custServiceQuestion: 'どんなサービスが必要ですか？',
    custServiceTip: '必要なサービスを全て選択してください。後で変更できます。',
    custArt: '家事ヘルパー（ART）', custTutor: '家庭教師',
    termsOverview: 'Linkaはお客様と独立したパートナーを繋ぐプラットフォームです。PT Linka Indonesiaはユーザーとパートナー間の結果、品質、紛争については責任を負いません。',
    termsAgreeAll: '全ての利用規約に同意',
    termsItem1: '（必須）サービス利用規約',
    termsItem2: '（必須）プライバシーポリシー・個人情報利用',
    termsItem3: '（必須）第三者への個人情報提供に同意',
    termsItem4: '（任意）イベント・特典・通知受信',
    termsViewLabel: '見る',
    roleDriverLabel: 'ドライバーです', roleDriverSub: 'お客様の車を代わりに運転します',
    driverSkillTitle: '運転スキル', driverSkillSub: '運転可能な車種を教えてください',
    driverLicenseTitle: '免許証認証', driverLicenseSub: '安全運行のため免許証をアップロードしてください',
    driverServiceTitle: 'サービス種別', driverServiceSub: '提供する運転サービスを選択してください',
    driverAreaTitle: '運行エリア', driverAreaSub: '運行可能なエリアを選択してください',
    vehSedan: 'セダン', vehSuv: 'SUV', vehMpv: 'MPV', vehVan: 'バン', vehManualStick: 'マニュアル（MT）',
    drivableTypesLabel: '運転可能な車種',
    drivableTypesSub: '運転できる車種をすべて選択してください',
    transmissionLabel: 'トランスミッション',
    transAuto: 'オートマ', transManual: 'マニュアル', transBoth: '両方',
    dsvDesignated: '代行運転', dsvDesignatedSub: '会食後など安全に帰宅',
    dsvDaily: '日給ドライバー', dsvDailySub: 'お客様の車で1日中運転',
    dsvHourly: '時間制ドライバー', dsvHourlySub: '必要な時間だけ運転',
    dsvCommute: '通勤ドライバー', dsvCommuteSub: '定期的な送迎',
    dsvAirport: '空港送迎', dsvAirportSub: 'お客様の車で空港まで運転',
    dsvIntercity: '都市間移動', dsvIntercitySub: '長距離都市間運転',
    dsvEvent: 'イベントドライバー', dsvEventSub: '結婚式・家族行事など',
    driverExperience: '運転経験（年）',
    driverLicenseClass: '免許の種類',
    stepDriverSkill: 'スキル', stepDriverLicense: '免許',
    stepDriverService: 'サービス', stepDriverArea: 'エリア',
  },
  linkaTemp: {
    title: 'Linka温度',
    tagline: 'サービスの温かさを計測',
    currentTemp: '現在の温度',
    averageTemp: '平均',
    basedOn: '{n}件のレビュー基準',
    giveTemp: '温度を付ける',
    tagFriendly: '親切', tagOnTime: '時間厳守', tagClean: 'きれい',
    tagSkilled: '熟練', tagCareful: '丁寧', tagPatient: '忍耐',
    tagWarmVibes: '温かい', tagCommunicative: 'コミュ上手',
    tagLate: '遅刻', tagRushed: '慌ただしい', tagCold: '冷たい',
    tagUnclean: 'やや不潔', tagNotSkilled: 'スキル不足',
    tempUp: '+{n}°C', tempDown: '-{n}°C',
    freeTextTitle: 'ひとこと（任意）',
    freeTextPlaceholder: '体験をシェアしてください...',
    submitReview: 'レビューを送信',
    thanksTitle: 'レビューありがとうございます！',
    thanksSub: 'あなたのレビューは Linka コミュニティに役立ちます',
  },
  monthlyAward: {
    title: '今月のベスト',
    helperOfMonth: '今月のヘルパー',
    driverOfMonth: '今月のドライバー',
    winnerBadge: 'MVP',
    period: '2026年4月',
    reasonPrefix: '理由:',
    seeAll: 'すべて見る',
  },
};

export const translations: Record<LangCode, Translations> = { id, en, ko, zh, ja };
