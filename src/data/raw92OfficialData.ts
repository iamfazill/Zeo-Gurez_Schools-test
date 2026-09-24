import fs from 'fs';

// 92 Official Schools transcribed directly from ZEO Gurez Class Wise Enrollment sheet
const RAW_92_SCHOOLS = [
  // Cluster: HSS Baduab Tulail (1-11)
  {
    sNo: 1,
    cluster: 'HSS Baduab Tulail',
    name: 'HSS Baduab Tulail',
    category: 'HSS',
    udise: '01160800304',
    total: 29,
    classes: {
      kg: [0, 0], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [6, 9], g10: [8, 6]
    }
  },
  {
    sNo: 2,
    cluster: 'HSS Baduab Tulail',
    name: 'GHS Malangam',
    category: 'HS',
    udise: '01160800401',
    total: 128,
    classes: {
      kg: [12, 10], g1: [4, 8], g2: [3, 7], g3: [0, 4], g4: [4, 6], g5: [7, 9],
      g6: [4, 2], g7: [5, 5], g8: [4, 4], g9: [8, 6], g10: [9, 7]
    }
  },
  {
    sNo: 3,
    cluster: 'HSS Baduab Tulail',
    name: 'GHS Gujran',
    category: 'HS',
    udise: '01160800102',
    total: 185,
    classes: {
      kg: [15, 8], g1: [9, 7], g2: [8, 5], g3: [10, 5], g4: [6, 5], g5: [9, 8],
      g6: [6, 7], g7: [5, 14], g8: [4, 3], g9: [14, 12], g10: [11, 14]
    }
  },
  {
    sNo: 4,
    cluster: 'HSS Baduab Tulail',
    name: 'GMS Gujran',
    category: 'MS',
    udise: '01160800101',
    total: 76,
    classes: {
      kg: [6, 8], g1: [1, 2], g2: [1, 2], g3: [1, 2], g4: [3, 5], g5: [1, 5],
      g6: [7, 7], g7: [3, 7], g8: [3, 12], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 5,
    cluster: 'HSS Baduab Tulail',
    name: 'GPS Gujran',
    category: 'PS',
    udise: '01160800103',
    total: 29,
    classes: {
      kg: [3, 6], g1: [0, 2], g2: [0, 2], g3: [4, 5], g4: [2, 3], g5: [1, 1],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 6,
    cluster: 'HSS Baduab Tulail',
    name: 'GMS Abdullian',
    category: 'MS',
    udise: '01160800201',
    total: 113,
    classes: {
      kg: [11, 7], g1: [10, 0], g2: [6, 1], g3: [10, 11], g4: [8, 10], g5: [4, 6],
      g6: [8, 2], g7: [5, 3], g8: [3, 8], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 7,
    cluster: 'HSS Baduab Tulail',
    name: 'GMS Chek-I- Bahar',
    category: 'MS',
    udise: '01160800202',
    total: 71,
    classes: {
      kg: [10, 8], g1: [3, 2], g2: [2, 2], g3: [3, 5], g4: [5, 3], g5: [2, 1],
      g6: [3, 6], g7: [2, 3], g8: [5, 6], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 8,
    cluster: 'HSS Baduab Tulail',
    name: 'GMS Budoabb-I',
    category: 'MS',
    udise: '01160800302',
    total: 72,
    classes: {
      kg: [12, 11], g1: [6, 3], g2: [3, 5], g3: [2, 3], g4: [1, 1], g5: [3, 6],
      g6: [2, 2], g7: [3, 4], g8: [2, 3], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 9,
    cluster: 'HSS Baduab Tulail',
    name: 'GMS Budoabb',
    category: 'MS',
    udise: '01160800304',
    total: 25,
    classes: {
      kg: [3, 3], g1: [2, 0], g2: [0, 3], g3: [1, 3], g4: [0, 3], g5: [1, 2],
      g6: [0, 0], g7: [1, 1], g8: [1, 1], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 10,
    cluster: 'HSS Baduab Tulail',
    name: 'GMS Hussangam',
    category: 'MS',
    udise: '01160800402',
    total: 115,
    classes: {
      kg: [18, 13], g1: [6, 11], g2: [8, 2], g3: [4, 5], g4: [4, 3], g5: [4, 8],
      g6: [10, 1], g7: [2, 11], g8: [4, 1], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 11,
    cluster: 'HSS Baduab Tulail',
    name: 'GMS Angakote',
    category: 'MS',
    udise: '01160800301',
    total: 55,
    classes: {
      kg: [6, 5], g1: [2, 2], g2: [2, 2], g3: [3, 1], g4: [4, 3], g5: [2, 5],
      g6: [5, 3], g7: [3, 4], g8: [1, 2], g9: [0, 0], g10: [0, 0]
    }
  },

  // Cluster: HSS Kilshay (12-21)
  {
    sNo: 12,
    cluster: 'HSS Kilshay',
    name: 'HSS Kilshay',
    category: 'HSS',
    udise: '01160801801',
    total: 65,
    classes: {
      kg: [4, 3], g1: [2, 1], g2: [2, 2], g3: [3, 1], g4: [5, 0], g5: [3, 3],
      g6: [3, 5], g7: [1, 7], g8: [5, 4], g9: [6, 4], g10: [1, 0]
    }
  },
  {
    sNo: 13,
    cluster: 'HSS Kilshay',
    name: 'PS Bada Mohalla',
    category: 'PS',
    udise: '01160801809',
    total: 31,
    classes: {
      kg: [6, 7], g1: [2, 3], g2: [4, 1], g3: [4, 1], g4: [2, 1], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 14,
    cluster: 'HSS Kilshay',
    name: 'PS Chack Bayant',
    category: 'PS',
    udise: '01160801806',
    total: 14,
    classes: {
      kg: [2, 2], g1: [0, 0], g2: [2, 2], g3: [2, 1], g4: [3, 0], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 15,
    cluster: 'HSS Kilshay',
    name: 'MS SydiKilshay',
    category: 'MS',
    udise: '01160801805',
    total: 46,
    classes: {
      kg: [7, 8], g1: [1, 1], g2: [4, 5], g3: [4, 1], g4: [0, 0], g5: [1, 3],
      g6: [4, 1], g7: [0, 0], g8: [1, 5], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 16,
    cluster: 'HSS Kilshay',
    name: 'PS Boloniril',
    category: 'PS',
    udise: '01160801705',
    total: 13,
    classes: {
      kg: [1, 3], g1: [1, 0], g2: [0, 0], g3: [2, 1], g4: [1, 1], g5: [1, 2],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 17,
    cluster: 'HSS Kilshay',
    name: 'MS Bosgay',
    category: 'MS',
    udise: '01160801804',
    total: 50,
    classes: {
      kg: [8, 3], g1: [5, 3], g2: [0, 1], g3: [8, 1], g4: [2, 2], g5: [2, 1],
      g6: [1, 1], g7: [4, 1], g8: [5, 2], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 18,
    cluster: 'HSS Kilshay',
    name: 'MS Refugee-II',
    category: 'MS',
    udise: '01160801803',
    total: 23,
    classes: {
      kg: [6, 1], g1: [0, 4], g2: [0, 0], g3: [3, 4], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [4, 1], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 19,
    cluster: 'HSS Kilshay',
    name: 'M/S Refugee Ist',
    category: 'MS',
    udise: '01160801802',
    total: 13,
    classes: {
      kg: [2, 2], g1: [0, 2], g2: [0, 1], g3: [0, 1], g4: [3, 1], g5: [0, 0],
      g6: [1, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 20,
    cluster: 'HSS Kilshay',
    name: 'PS Jarjoli',
    category: 'PS',
    udise: '01160803401',
    total: 0,
    classes: {
      kg: [0, 0], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 21,
    cluster: 'HSS Izmarg',
    name: 'HSS Izmarg',
    category: 'HSS',
    udise: '01160803501',
    total: 37,
    classes: {
      kg: [0, 0], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [7, 8], g10: [13, 9]
    }
  },

  // Cluster: HSS Izmarg (22-31)
  {
    sNo: 22,
    cluster: 'HSS Izmarg',
    name: 'HS Tarbal',
    category: 'HS',
    udise: '01160802809',
    total: 30,
    classes: {
      kg: [0, 0], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [4, 9], g10: [11, 6]
    }
  },
  {
    sNo: 23,
    cluster: 'HSS Izmarg',
    name: 'MS Mir Mohalla Tarbal',
    category: 'MS',
    udise: '01160802813',
    total: 41,
    classes: {
      kg: [5, 4], g1: [4, 3], g2: [0, 1], g3: [1, 4], g4: [4, 3], g5: [0, 1],
      g6: [1, 3], g7: [2, 1], g8: [1, 3], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 24,
    cluster: 'HSS Izmarg',
    name: 'MS Tarbal',
    category: 'MS',
    udise: '01160802812',
    total: 29,
    classes: {
      kg: [8, 3], g1: [0, 0], g2: [1, 2], g3: [3, 1], g4: [1, 1], g5: [0, 0],
      g6: [1, 0], g7: [1, 0], g8: [1, 5], g9: [2, 0], g10: [0, 0]
    }
  },
  {
    sNo: 25,
    cluster: 'HSS Izmarg',
    name: 'MS Banjran',
    category: 'MS',
    udise: '01160802806',
    total: 33,
    classes: {
      kg: [4, 6], g1: [1, 1], g2: [1, 4], g3: [1, 3], g4: [0, 0], g5: [3, 1],
      g6: [2, 1], g7: [1, 4], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 26,
    cluster: 'HSS Izmarg',
    name: 'BMS Bagtore',
    category: 'MS',
    udise: '01160802803',
    total: 54,
    classes: {
      kg: [7, 14], g1: [2, 0], g2: [0, 4], g3: [3, 0], g4: [1, 6], g5: [2, 3],
      g6: [0, 3], g7: [5, 2], g8: [1, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 27,
    cluster: 'HSS Izmarg',
    name: 'Girls MS Bagtore',
    category: 'MS',
    udise: '01160802804',
    total: 68,
    classes: {
      kg: [7, 12], g1: [3, 1], g2: [5, 4], g3: [3, 5], g4: [4, 4], g5: [0, 0],
      g6: [2, 5], g7: [4, 3], g8: [3, 3], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 28,
    cluster: 'HSS Izmarg',
    name: 'MS Dangan',
    category: 'MS',
    udise: '01160802805',
    total: 28,
    classes: {
      kg: [5, 0], g1: [1, 1], g2: [0, 2], g3: [1, 2], g4: [0, 1], g5: [1, 0],
      g6: [7, 3], g7: [0, 0], g8: [3, 1], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 29,
    cluster: 'HSS Izmarg',
    name: 'MS Izmarg',
    category: 'MS',
    udise: '01160802802',
    total: 34,
    classes: {
      kg: [8, 4], g1: [2, 3], g2: [0, 2], g3: [0, 3], g4: [0, 1], g5: [0, 1],
      g6: [3, 2], g7: [2, 1], g8: [1, 1], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 30,
    cluster: 'HSS Izmarg',
    name: 'PS Kharmohalla',
    category: 'PS',
    udise: '01160802507',
    total: 18,
    classes: {
      kg: [4, 3], g1: [0, 1], g2: [3, 1], g3: [2, 1], g4: [0, 3], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 31,
    cluster: 'HSS Izmarg',
    name: 'PS Refugee',
    category: 'PS',
    udise: '01160802012',
    total: 2,
    classes: {
      kg: [1, 1], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },

  // Cluster: GHSS Dawar (32-38)
  {
    sNo: 32,
    cluster: 'GHSS Dawar',
    name: 'GHSS DAWAR',
    category: 'HSS',
    udise: '01160802013',
    total: 22,
    classes: {
      kg: [0, 0], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 12], g10: [0, 10]
    }
  },
  {
    sNo: 33,
    cluster: 'GHSS Dawar',
    name: 'MS MASTAN',
    category: 'MS',
    udise: '01160802009',
    total: 17,
    classes: {
      kg: [2, 2], g1: [0, 1], g2: [1, 1], g3: [1, 2], g4: [0, 1], g5: [1, 1],
      g6: [2, 1], g7: [0, 0], g8: [1, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 34,
    cluster: 'GHSS Dawar',
    name: 'GMS MARKOOT',
    category: 'MS',
    udise: '01160802102',
    total: 92,
    classes: {
      kg: [10, 13], g1: [2, 5], g2: [3, 0], g3: [7, 10], g4: [5, 5], g5: [3, 4],
      g6: [2, 3], g7: [3, 11], g8: [1, 5], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 35,
    cluster: 'GHSS Dawar',
    name: 'MS NAI BASTI CHORWAN GUREZ',
    category: 'MS',
    udise: '01160803101',
    total: 134,
    classes: {
      kg: [14, 14], g1: [8, 11], g2: [14, 12], g3: [1, 2], g4: [9, 10], g5: [4, 5],
      g6: [5, 5], g7: [6, 6], g8: [7, 1], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 36,
    cluster: 'GHSS Dawar',
    name: 'HS CHORWAN',
    category: 'HS',
    udise: '01160803103',
    total: 115,
    classes: {
      kg: [9, 10], g1: [5, 5], g2: [5, 3], g3: [1, 1], g4: [2, 6], g5: [5, 1],
      g6: [8, 3], g7: [5, 1], g8: [4, 2], g9: [4, 13], g10: [12, 11]
    }
  },
  {
    sNo: 37,
    cluster: 'GHSS Dawar',
    name: 'BMS MARKOOT',
    category: 'MS',
    udise: '01160802101',
    total: 46,
    classes: {
      kg: [4, 3], g1: [0, 2], g2: [1, 3], g3: [0, 4], g4: [6, 3], g5: [1, 2],
      g6: [5, 0], g7: [3, 0], g8: [8, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 38,
    cluster: 'GHSS Dawar',
    name: 'KGBV',
    category: 'MS',
    udise: '01160802019',
    total: 25,
    classes: {
      kg: [0, 0], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [0, 2], g8: [0, 11], g9: [0, 12], g10: [0, 0]
    }
  },

  // Cluster: BHSS DAWAR (39-51)
  {
    sNo: 39,
    cluster: 'BHSS DAWAR',
    name: 'BHSS Dawar',
    category: 'HSS',
    udise: '01160802015',
    total: 44,
    classes: {
      kg: [0, 0], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [25, 0], g10: [19, 0]
    }
  },
  {
    sNo: 40,
    cluster: 'BHSS DAWAR',
    name: 'HS Achoora',
    category: 'HS',
    udise: '01160803201',
    total: 99,
    classes: {
      kg: [8, 10], g1: [3, 2], g2: [5, 2], g3: [3, 4], g4: [6, 9], g5: [3, 3],
      g6: [5, 5], g7: [3, 5], g8: [4, 6], g9: [3, 2], g10: [2, 6]
    }
  },
  {
    sNo: 41,
    cluster: 'BHSS DAWAR',
    name: 'HS Wanpora',
    category: 'HS',
    udise: '01160802506',
    total: 49,
    classes: {
      kg: [0, 0], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [14, 11], g10: [15, 9]
    }
  },
  {
    sNo: 42,
    cluster: 'BHSS DAWAR',
    name: 'BMS Dawar',
    category: 'MS',
    udise: '01160802001',
    total: 29,
    classes: {
      kg: [6, 2], g1: [2, 1], g2: [1, 2], g3: [3, 2], g4: [2, 0], g5: [1, 0],
      g6: [4, 0], g7: [1, 0], g8: [2, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 43,
    cluster: 'BHSS DAWAR',
    name: 'GMS Dawar',
    category: 'MS',
    udise: '01160802005',
    total: 29,
    classes: {
      kg: [0, 3], g1: [0, 2], g2: [0, 5], g3: [0, 2], g4: [0, 4], g5: [0, 5],
      g6: [0, 5], g7: [0, 3], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 44,
    cluster: 'BHSS DAWAR',
    name: 'MS Dar Mohalla',
    category: 'MS',
    udise: '01160802003',
    total: 21,
    classes: {
      kg: [7, 2], g1: [2, 1], g2: [3, 0], g3: [2, 1], g4: [0, 1], g5: [1, 1],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 45,
    cluster: 'BHSS DAWAR',
    name: 'MS Faqirpora',
    category: 'MS',
    udise: '01160802603',
    total: 37,
    classes: {
      kg: [7, 3], g1: [0, 2], g2: [2, 1], g3: [2, 2], g4: [2, 3], g5: [1, 0],
      g6: [0, 2], g7: [5, 1], g8: [1, 3], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 46,
    cluster: 'BHSS DAWAR',
    name: 'GMS Khandiyal',
    category: 'MS',
    udise: '01160802601',
    total: 29,
    classes: {
      kg: [4, 5], g1: [0, 0], g2: [0, 2], g3: [2, 3], g4: [0, 6], g5: [1, 0],
      g6: [1, 2], g7: [1, 1], g8: [1, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 47,
    cluster: 'BHSS DAWAR',
    name: 'BMS Khandiyal',
    category: 'MS',
    udise: '01160802602',
    total: 37,
    classes: {
      kg: [4, 4], g1: [3, 7], g2: [1, 2], g3: [0, 4], g4: [1, 1], g5: [2, 1],
      g6: [0, 1], g7: [2, 2], g8: [2, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 48,
    cluster: 'BHSS DAWAR',
    name: 'GMS Wanpora',
    category: 'MS',
    udise: '01160802501',
    total: 88,
    classes: {
      kg: [8, 14], g1: [3, 5], g2: [4, 6], g3: [7, 4], g4: [10, 4], g5: [2, 3],
      g6: [3, 5], g7: [3, 3], g8: [2, 2], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 49,
    cluster: 'BHSS DAWAR',
    name: 'BMS Wanpora',
    category: 'MS',
    udise: '01160802502',
    total: 65,
    classes: {
      kg: [1, 13], g1: [2, 5], g2: [3, 1], g3: [4, 4], g4: [3, 1], g5: [5, 2],
      g6: [1, 1], g7: [3, 1], g8: [4, 2], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 50,
    cluster: 'BHSS DAWAR',
    name: 'MS Badwan',
    category: 'MS',
    udise: '01160802505',
    total: 44,
    classes: {
      kg: [4, 4], g1: [2, 5], g2: [2, 1], g3: [3, 4], g4: [1, 0], g5: [3, 5],
      g6: [2, 3], g7: [0, 1], g8: [2, 2], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 51,
    cluster: 'BHSS DAWAR',
    name: 'MS Khopri',
    category: 'MS',
    udise: '01160802202',
    total: 8,
    classes: {
      kg: [5, 0], g1: [1, 1], g2: [1, 0], g3: [0, 0], g4: [1, 0], g5: [0, 0],
      g6: [0, 0], g7: [1, 0], g8: [0, 1], g9: [0, 0], g10: [0, 0]
    }
  },

  // Cluster: HS Kanzalwan (52-58)
  {
    sNo: 52,
    cluster: 'HS Kanzalwan',
    name: 'High School Kanzalwan',
    category: 'HS',
    udise: '01160802701',
    total: 56,
    classes: {
      kg: [0, 0], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [3, 8], g7: [1, 5], g8: [7, 6], g9: [6, 7], g10: [6, 7]
    }
  },
  {
    sNo: 53,
    cluster: 'HS Kanzalwan',
    name: 'HS Kuragbal',
    category: 'HS',
    udise: '01160802901',
    total: 31,
    classes: {
      kg: [6, 5], g1: [1, 1], g2: [1, 2], g3: [1, 2], g4: [0, 2], g5: [0, 0],
      g6: [2, 2], g7: [1, 0], g8: [0, 1], g9: [0, 1], g10: [0, 2]
    }
  },
  {
    sNo: 54,
    cluster: 'HS Kanzalwan',
    name: 'MS Naibasti Kanzalwan',
    category: 'MS',
    udise: '01160802702',
    total: 25,
    classes: {
      kg: [4, 4], g1: [2, 0], g2: [3, 2], g3: [1, 2], g4: [1, 0], g5: [0, 1],
      g6: [0, 1], g7: [2, 1], g8: [0, 1], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 55,
    cluster: 'HS Kanzalwan',
    name: 'GOVT MIDDLE SCHOOL NAYAL GUREZ',
    category: 'MS',
    udise: '01160802704',
    total: 28,
    classes: {
      kg: [5, 2], g1: [1, 0], g2: [2, 1], g3: [1, 0], g4: [3, 1], g5: [1, 2],
      g6: [0, 3], g7: [2, 4], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 56,
    cluster: 'HS Kanzalwan',
    name: 'GOVT MIDDLE SCHOOL Chuntiwari',
    category: 'MS',
    udise: '01160802801',
    total: 18,
    classes: {
      kg: [2, 3], g1: [2, 0], g2: [0, 1], g3: [3, 0], g4: [0, 1], g5: [0, 0],
      g6: [2, 2], g7: [0, 1], g8: [1, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 57,
    cluster: 'HS Kanzalwan',
    name: 'PS Lone Mohalla Kanzalwan',
    category: 'PS',
    udise: '01160802703',
    total: 55,
    classes: {
      kg: [14, 6], g1: [2, 0], g2: [8, 7], g3: [1, 2], g4: [6, 2], g5: [3, 4],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 58,
    cluster: 'HS Kanzalwan',
    name: 'MS Jalindora',
    category: 'MS',
    udise: '01160802705',
    total: 20,
    classes: {
      kg: [3, 5], g1: [0, 0], g2: [1, 2], g3: [0, 2], g4: [1, 0], g5: [0, 0],
      g6: [1, 3], g7: [0, 2], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },

  // Cluster: HSS Badugam (59-73)
  {
    sNo: 59,
    cluster: 'HSS Badugam',
    name: 'HSS Badugam',
    category: 'HSS',
    udise: '01160800607',
    total: 230,
    classes: {
      kg: [0, 0], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [40, 15], g10: [30, 16]
    }
  },
  {
    sNo: 60,
    cluster: 'HSS Badugam',
    name: 'HS Buglinder',
    category: 'HS',
    udise: '01160800803',
    total: 102,
    classes: {
      kg: [9, 10], g1: [5, 4], g2: [6, 5], g3: [2, 3], g4: [6, 3], g5: [2, 6],
      g6: [3, 5], g7: [2, 1], g8: [3, 5], g9: [8, 5], g10: [6, 3]
    }
  },
  {
    sNo: 61,
    cluster: 'HSS Badugam',
    name: 'MS Neeru Shot',
    category: 'MS',
    udise: '01160801605',
    total: 48,
    classes: {
      kg: [7, 2], g1: [2, 5], g2: [4, 3], g3: [3, 5], g4: [2, 2], g5: [0, 2],
      g6: [1, 4], g7: [1, 1], g8: [2, 2], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 62,
    cluster: 'HSS Badugam',
    name: 'MS Neeru',
    category: 'MS',
    udise: '01160801601',
    total: 136,
    classes: {
      kg: [10, 13], g1: [7, 8], g2: [15, 7], g3: [3, 9], g4: [7, 10], g5: [5, 5],
      g6: [11, 4], g7: [3, 10], g8: [4, 3], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 63,
    cluster: 'HSS Badugam',
    name: 'MS Badugam Shot',
    category: 'MS',
    udise: '01160800603',
    total: 41,
    classes: {
      kg: [9, 6], g1: [2, 1], g2: [1, 1], g3: [2, 2], g4: [1, 4], g5: [2, 3],
      g6: [2, 1], g7: [2, 2], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 64,
    cluster: 'HSS Badugam',
    name: 'MS Badugam',
    category: 'MS',
    udise: '01160800601',
    total: 191,
    classes: {
      kg: [34, 21], g1: [6, 12], g2: [12, 10], g3: [12, 10], g4: [16, 7], g5: [7, 5],
      g6: [10, 7], g7: [9, 3], g8: [10, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 65,
    cluster: 'HSS Badugam',
    name: 'MS Wazrithal',
    category: 'MS',
    udise: '01160800901',
    total: 41,
    classes: {
      kg: [8, 5], g1: [2, 4], g2: [2, 0], g3: [2, 1], g4: [1, 3], g5: [0, 0],
      g6: [2, 5], g7: [2, 2], g8: [1, 1], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 66,
    cluster: 'HSS Badugam',
    name: 'MS Neeru Nallah',
    category: 'MS',
    udise: '01160801602',
    total: 26,
    classes: {
      kg: [1, 1], g1: [2, 0], g2: [2, 2], g3: [2, 1], g4: [1, 1], g5: [2, 3],
      g6: [1, 3], g7: [0, 0], g8: [0, 4], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 67,
    cluster: 'HSS Badugam',
    name: 'MS Skinderpora',
    category: 'MS',
    udise: '01160801603',
    total: 32,
    classes: {
      kg: [4, 2], g1: [0, 0], g2: [1, 2], g3: [0, 3], g4: [2, 3], g5: [1, 4],
      g6: [3, 2], g7: [1, 4], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 68,
    cluster: 'HSS Badugam',
    name: 'MS Naie Basti Sardab',
    category: 'MS',
    udise: '01160800704',
    total: 13,
    classes: {
      kg: [1, 0], g1: [1, 1], g2: [0, 0], g3: [1, 1], g4: [1, 1], g5: [0, 1],
      g6: [0, 0], g7: [2, 1], g8: [0, 1], g9: [2, 0], g10: [0, 0]
    }
  },
  {
    sNo: 69,
    cluster: 'HSS Badugam',
    name: 'MS Sardab',
    category: 'MS',
    udise: '01160800701',
    total: 137,
    classes: {
      kg: [19, 12], g1: [7, 7], g2: [8, 4], g3: [6, 8], g4: [5, 4], g5: [6, 6],
      g6: [9, 4], g7: [8, 9], g8: [5, 10], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 70,
    cluster: 'HSS Badugam',
    name: 'MS Khutran',
    category: 'MS',
    udise: '01160800118',
    total: 39,
    classes: {
      kg: [7, 5], g1: [2, 1], g2: [1, 2], g3: [1, 1], g4: [3, 3], g5: [2, 1],
      g6: [4, 2], g7: [3, 1], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 71,
    cluster: 'HSS Badugam',
    name: 'MS Gundgul Sheikh',
    category: 'MS',
    udise: '01160800804',
    total: 52,
    classes: {
      kg: [9, 7], g1: [4, 2], g2: [4, 3], g3: [6, 4], g4: [3, 2], g5: [4, 0],
      g6: [0, 0], g7: [0, 0], g8: [2, 0], g9: [1, 0], g10: [0, 0]
    }
  },
  {
    sNo: 72,
    cluster: 'HSS Badugam',
    name: 'MS Tatran',
    category: 'MS',
    udise: '01160800702',
    total: 34,
    classes: {
      kg: [5, 4], g1: [0, 0], g2: [3, 2], g3: [0, 1], g4: [2, 2], g5: [0, 0],
      g6: [4, 4], g7: [1, 1], g8: [0, 5], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 73,
    cluster: 'HSS Badugam',
    name: 'MS Grant Nallah',
    category: 'MS',
    udise: '01160800602',
    total: 37,
    classes: {
      kg: [7, 4], g1: [2, 1], g2: [1, 1], g3: [3, 1], g4: [2, 3], g5: [1, 1],
      g6: [0, 3], g7: [1, 1], g8: [1, 4], g9: [0, 0], g10: [0, 0]
    }
  },

  // Cluster: HSS PTL (74-92)
  {
    sNo: 74,
    cluster: 'HSS PTL',
    name: 'HSS PTL',
    category: 'HSS',
    udise: '01160801402',
    total: 37,
    classes: {
      kg: [0, 0], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [10, 5], g10: [15, 7]
    }
  },
  {
    sNo: 75,
    cluster: 'HSS PTL',
    name: 'HS Barnayee',
    category: 'HS',
    udise: '01160801701',
    total: 41,
    classes: {
      kg: [0, 0], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [0, 0],
      g6: [0, 0], g7: [4, 7], g8: [0, 0], g9: [7, 5], g10: [7, 5]
    }
  },
  {
    sNo: 76,
    cluster: 'HSS PTL',
    name: 'HS Jurniyal',
    category: 'HS',
    udise: '01160801501',
    total: 63,
    classes: {
      kg: [1, 3], g1: [3, 0], g2: [0, 1], g3: [2, 2], g4: [1, 2], g5: [3, 2],
      g6: [2, 2], g7: [1, 0], g8: [4, 1], g9: [6, 8], g10: [7, 12]
    }
  },
  {
    sNo: 77,
    cluster: 'HSS PTL',
    name: 'MS Check Jurniyal',
    category: 'MS',
    udise: '01160801502',
    total: 32,
    classes: {
      kg: [5, 3], g1: [5, 6], g2: [0, 0], g3: [0, 2], g4: [0, 2], g5: [1, 1],
      g6: [0, 2], g7: [1, 1], g8: [2, 1], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 78,
    cluster: 'HSS PTL',
    name: 'MS Dangithal',
    category: 'MS',
    udise: '01160801201',
    total: 60,
    classes: {
      kg: [8, 6], g1: [3, 2], g2: [4, 5], g3: [4, 4], g4: [3, 4], g5: [4, 1],
      g6: [5, 1], g7: [1, 1], g8: [4, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 79,
    cluster: 'HSS PTL',
    name: 'MS GOBAZ',
    category: 'MS',
    udise: '01160801503',
    total: 26,
    classes: {
      kg: [3, 1], g1: [1, 2], g2: [1, 2], g3: [1, 2], g4: [4, 0], g5: [0, 0],
      g6: [0, 0], g7: [3, 2], g8: [3, 2], g9: [1, 0], g10: [0, 0]
    }
  },
  {
    sNo: 80,
    cluster: 'HSS PTL',
    name: 'MS Kashpot',
    category: 'MS',
    udise: '01160801702',
    total: 33,
    classes: {
      kg: [4, 3], g1: [4, 0], g2: [0, 0], g3: [3, 10], g4: [0, 0], g5: [0, 1],
      g6: [1, 0], g7: [2, 1], g8: [1, 1], g9: [2, 0], g10: [0, 0]
    }
  },
  {
    sNo: 81,
    cluster: 'HSS PTL',
    name: 'MS Khan Mohalla Burnayee',
    category: 'MS',
    udise: '01160801706',
    total: 77,
    classes: {
      kg: [14, 10], g1: [5, 3], g2: [9, 8], g3: [2, 1], g4: [7, 5], g5: [3, 6],
      g6: [1, 0], g7: [2, 1], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 82,
    cluster: 'HSS PTL',
    name: 'MS Munzgund',
    category: 'MS',
    udise: '01160801504',
    total: 49,
    classes: {
      kg: [4, 9], g1: [7, 4], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [2, 4],
      g6: [3, 3], g7: [2, 3], g8: [4, 2], g9: [2, 0], g10: [0, 0]
    }
  },
  {
    sNo: 83,
    cluster: 'HSS PTL',
    name: 'MS Purana Tulail',
    category: 'MS',
    udise: '01160801403',
    total: 43,
    classes: {
      kg: [4, 6], g1: [2, 0], g2: [0, 0], g3: [0, 0], g4: [0, 1], g5: [2, 1],
      g6: [0, 1], g7: [7, 4], g8: [3, 3], g9: [5, 3], g10: [0, 0]
    }
  },
  {
    sNo: 84,
    cluster: 'HSS PTL',
    name: 'MS Satni Nala',
    category: 'MS',
    udise: '01160801401',
    total: 32,
    classes: {
      kg: [5, 3], g1: [2, 0], g2: [1, 2], g3: [2, 2], g4: [0, 4], g5: [1, 0],
      g6: [2, 0], g7: [1, 1], g8: [4, 2], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 85,
    cluster: 'HSS PTL',
    name: 'MS Shiekhpora',
    category: 'MS',
    udise: '01160802401',
    total: 21,
    classes: {
      kg: [3, 3], g1: [0, 0], g2: [2, 1], g3: [0, 0], g4: [0, 3], g5: [1, 1],
      g6: [0, 1], g7: [0, 1], g8: [1, 2], g9: [2, 0], g10: [0, 0]
    }
  },
  {
    sNo: 86,
    cluster: 'HSS PTL',
    name: 'MS Zedigay Tulail',
    category: 'MS',
    udise: '01160801901',
    total: 54,
    classes: {
      kg: [5, 10], g1: [2, 2], g2: [3, 3], g3: [0, 0], g4: [0, 4], g5: [4, 0],
      g6: [3, 3], g7: [2, 5], g8: [4, 3], g9: [1, 0], g10: [0, 0]
    }
  },
  {
    sNo: 87,
    cluster: 'HSS PTL',
    name: 'PS Korashpora Tulail',
    category: 'PS',
    udise: '01160801302',
    total: 5,
    classes: {
      kg: [2, 1], g1: [0, 0], g2: [0, 0], g3: [0, 0], g4: [0, 0], g5: [1, 1],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 88,
    cluster: 'HSS PTL',
    name: 'PS Manzgund Bala',
    category: 'PS',
    udise: '01160801303',
    total: 14,
    classes: {
      kg: [1, 2], g1: [0, 1], g2: [1, 2], g3: [0, 0], g4: [3, 4], g5: [0, 0],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 89,
    cluster: 'HSS PTL',
    name: 'PS PTL East',
    category: 'PS',
    udise: '01160801404',
    total: 40,
    classes: {
      kg: [13, 10], g1: [3, 1], g2: [1, 3], g3: [3, 1], g4: [1, 2], g5: [1, 2],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 90,
    cluster: 'HSS PTL',
    name: 'PS Purana Tulail West',
    category: 'PS',
    udise: '01160801405',
    total: 32,
    classes: {
      kg: [6, 7], g1: [1, 1], g2: [2, 1], g3: [2, 2], g4: [2, 3], g5: [2, 3],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 91,
    cluster: 'HSS PTL',
    name: 'PS Sultan Mohalla Jumiyal',
    category: 'PS',
    udise: '01160801508',
    total: 12,
    classes: {
      kg: [2, 1], g1: [0, 0], g2: [1, 2], g3: [0, 0], g4: [4, 1], g5: [0, 1],
      g6: [0, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  },
  {
    sNo: 92,
    cluster: 'HSS PTL',
    name: 'PS Wani Mohalla Jumiyal',
    category: 'PS',
    udise: '01160801506',
    total: 11,
    classes: {
      kg: [2, 1], g1: [1, 1], g2: [0, 2], g3: [0, 0], g4: [2, 0], g5: [0, 1],
      g6: [1, 0], g7: [0, 0], g8: [0, 0], g9: [0, 0], g10: [0, 0]
    }
  }
];

export { RAW_92_SCHOOLS };
