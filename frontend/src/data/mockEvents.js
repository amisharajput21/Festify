export const POPULAR_CITIES = [
  'Delhi',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Jaipur',
  'Agra',
  'Kolkata',
];

export const CATEGORIES = [
  { id: 'Music', label: 'Music', icon: 'Music' },
  { id: 'Concerts', label: 'Concerts', icon: 'Mic2' },
  { id: 'Festivals', label: 'Festivals', icon: 'Sparkles' },
  { id: 'Comedy', label: 'Comedy', icon: 'Smile' },
  { id: 'Sports', label: 'Sports', icon: 'Trophy' },
  { id: 'Workshops', label: 'Workshops', icon: 'BookOpen' },
  { id: 'Nightlife', label: 'Nightlife', icon: 'Moon' },
];

export const MOCK_EVENTS = [
  {
    id: 'ev-01',
    title: 'Acoustic & Arena: India Stadium Tour 2026',
    slug: 'acoustic-arena-india-stadium-tour-2026',
    category: 'Concerts',
    city: 'Mumbai',
    date: '2026-11-28',
    displayDate: 'Sat, 28 Nov 2026',
    time: '06:00 PM IST',
    venue: 'DY Patil Stadium, Nerul',
    address: 'Sector 7, Nerul, Navi Mumbai, Maharashtra 400706',
    startingPrice: 1499,
    image: '/src/assets/images/hero_festify_concert_1793963300033.jpg',
    featured: true,
    trending: true,
    description:
      'Experience the grandest live music spectacle of the season as global and Indian chart-topping rock & pop icons take the stage at DY Patil Stadium. Featuring massive multi-tiered stage designs, state-of-the-art laser projection mapping, and an unforgettable 3-hour stadium setlist.',
    highlights: [
      'Live 3-hour stadium concert with 40,000+ fans',
      'High-definition immersive surround sound & visual FX',
      'Exclusive food & beverage village with Mumbai top eateries',
      'Dedicated metro shuttle bus connectivity from Nerul station'
    ],
    artistOrHost: 'Arijit Singh & The International Symphony',
    organizer: 'Live Nation India & Festify Experiences',
    ageRestriction: '6+ Years',
    duration: '3 Hours 30 Mins',
    language: 'Hindi & English',
    ticketCategories: [
      {
        id: 'tc-01-silver',
        name: 'Silver Phase 1 (General Stand)',
        description: 'Level 2 Tier seating with full panoramic stadium stage view.',
        price: 1499,
        originalPrice: 1999,
        available: 240,
        perks: ['Standard stadium seating', 'Access to food and beverage courts']
      },
      {
        id: 'tc-01-gold',
        name: 'Gold Ground Standing Zone',
        description: 'Direct ground floor pitch access right in front of the audio mixing tower.',
        price: 2999,
        originalPrice: 3499,
        available: 110,
        perks: ['Ground level access', 'Closer stage proximity', 'Express lane beverage counters']
      },
      {
        id: 'tc-01-fanpit',
        name: 'VIP Front Stage Fan Pit',
        description: 'Intimate front-row barricade access with red carpet arrival.',
        price: 5999,
        originalPrice: 6999,
        available: 35,
        perks: [
          'Unobstructed front-row barrier view',
          'Dedicated VIP air-conditioned entry gate',
          'Complimentary tour commemorative laminate badge',
          '2 Complimentary craft drinks & gourmet snack box'
        ]
      }
    ]
  },
  {
    id: 'ev-02',
    title: 'Illuminate Sunwave Electronic Music Festival',
    slug: 'illuminate-sunwave-electronic-music-festival',
    category: 'Festivals',
    city: 'Delhi',
    date: '2026-12-05',
    displayDate: 'Sat, 05 Dec 2026',
    time: '04:00 PM IST',
    venue: 'JLN Stadium Grounds, Gate 2',
    address: 'Pragati Vihar, Bhisham Pitamah Marg, New Delhi 110003',
    startingPrice: 1299,
    image: '/src/assets/images/fest_edm_carnival_1793963302353.jpg',
    featured: true,
    trending: true,
    description:
      'North India’s premiere open-air electronic music festival returns with 3 curated stages: The Main Stage (EDM & Big Room), The Underground Bunker (Techno & Deep House), and The Zen Garden (Ambient & Melodic). Featuring international headliners, pyrotechnic cascades, and vibrant experiential art installations.',
    highlights: [
      '3 distinct sonic stages and over 18 world-class DJ sets',
      'Giant 360-degree holographic LED stage installation',
      'Art bazaar, flea market, face painting & glitter lounge',
      'Safe transport and chilled recovery zone'
    ],
    artistOrHost: 'Lost Frequencies, Nucleya & Boris Brejcha',
    organizer: 'Sunwave Entertainment Ltd.',
    ageRestriction: '18+ Years',
    duration: '8 Hours',
    language: 'Instrumental & Electronic',
    ticketCategories: [
      {
        id: 'tc-02-early',
        name: 'Early Bird Day Pass',
        description: 'Full festival grounds entry to all 3 musical stages.',
        price: 1299,
        originalPrice: 1699,
        available: 85,
        perks: ['Access to all 3 stages', 'Free festival wristband']
      },
      {
        id: 'tc-02-vip',
        name: 'VIP Deck & Raised Platform',
        description: 'Elevated platform view with private bar and luxury washrooms.',
        price: 3499,
        originalPrice: 4200,
        available: 40,
        perks: [
          'Elevated VIP deck view',
          'Fast-track wristband collection',
          'Private air-conditioned restrooms',
          'Exclusive festival merchandise pack'
        ]
      }
    ]
  },
  {
    id: 'ev-03',
    title: 'Unfiltered & Candid: Standup Comedy Special',
    slug: 'unfiltered-and-candid-standup-special',
    category: 'Comedy',
    city: 'Bengaluru',
    date: '2026-11-21',
    displayDate: 'Sat, 21 Nov 2026',
    time: '07:30 PM IST',
    venue: 'Good Shepherd Auditorium',
    address: 'Residency Road, Shanthala Nagar, Richmond Town, Bengaluru 560025',
    startingPrice: 699,
    image: '/src/assets/images/fest_standup_comedy_1793963301971.jpg',
    featured: true,
    trending: false,
    description:
      'Get ready for an evening of side-splitting laughter and razor-sharp wit as India’s favourite storytelling comedian delivers an all-new 90-minute trial solo special. Covering modern relationships, tech startup absurdity, Bangalore traffic chronicles, and nostalgic family anecdotes.',
    highlights: [
      'Brand new, unreleased 90-minute comedy material',
      'Intimate acoustic theater with pristine vocal clarity',
      'Opening acts by emerging comedic talents',
      'Photo opportunities and meet & greet after the show'
    ],
    artistOrHost: 'Anubhav Singh Bassi & Friends',
    organizer: 'Curtain Call Laughs',
    ageRestriction: '16+ Years',
    duration: '1 Hour 45 Mins',
    language: 'Hindi & Hinglish',
    ticketCategories: [
      {
        id: 'tc-03-balcony',
        name: 'Balcony Seating',
        description: 'Elevated theater seating with clear acoustic view.',
        price: 699,
        originalPrice: 899,
        available: 90,
        perks: ['Reserved comfortable cushioned seating']
      },
      {
        id: 'tc-03-prime',
        name: 'Prime Stalls',
        description: 'Lower ground floor center stalls close to the stage.',
        price: 1199,
        originalPrice: 1499,
        available: 45,
        perks: ['Prime central acoustic seating', 'Early theater entry']
      },
      {
        id: 'tc-03-front',
        name: 'Front Row Meet & Greet',
        description: 'First 3 rows + exclusive post-show photo session with the comedian.',
        price: 2499,
        available: 12,
        perks: ['Front 3 rows seating', 'Exclusive backstage photo op', 'Signed poster']
      }
    ]
  },
  {
    id: 'ev-04',
    title: 'Royal Flavors & Heritage Folk Night',
    slug: 'royal-flavors-and-heritage-folk-night',
    category: 'Festivals',
    city: 'Jaipur',
    date: '2026-12-12',
    displayDate: 'Sat, 12 Dec 2026',
    time: '05:30 PM IST',
    venue: 'Diggi Palace Courtyards',
    address: 'Shivaji Marg, C-Scheme, Jaipur, Rajasthan 302004',
    startingPrice: 899,
    image: '/src/assets/images/fest_cultural_carnival_1793963303886.jpg',
    featured: true,
    trending: false,
    description:
      'Immerse your senses in the magical ambiance of Jaipur’s royal heritage. An open-air cultural fiesta combining traditional Manganiyar & Langa folk melodies, Kalbelia fire dances, authentic Rajasthani royal culinary tasting stalls, block printing masterclasses, and lantern lightings under starry desert skies.',
    highlights: [
      'Curated authentic royal thali and street delicacy counters',
      'Live Manganiyar symphony and Rajasthani puppet storytelling',
      'Artisan craft exhibits with direct master weaver interactions',
      'Heritage illumination and traditional welcome tilak'
    ],
    artistOrHost: 'Rajasthan Roots Collective & Master Chefs of Mewar',
    organizer: 'Jaipur Heritage & Tourism Guild',
    ageRestriction: 'All Ages Welcome',
    duration: '5 Hours',
    language: 'Hindi & Rajasthani Folk',
    ticketCategories: [
      {
        id: 'tc-04-fest',
        name: 'Cultural Festival Pass',
        description: 'Access to heritage courtyard, folk performances and craft market.',
        price: 899,
        available: 150,
        perks: ['Courtyard access', 'Welcome spiced buttermilk', 'Folk stage access']
      },
      {
        id: 'tc-04-feast',
        name: 'Royal Feast & Performance Pass',
        description: 'Includes full multi-course traditional Rajasthani royal dining experience.',
        price: 1999,
        originalPrice: 2399,
        available: 60,
        perks: [
          'Complete unlimited Royal Thali banquet',
          'Front seating at the folk dance circle',
          'Handmade artisan souvenir gift pack'
        ]
      }
    ]
  },
  {
    id: 'ev-05',
    title: 'Neon Horizon: Skyline Boiler Room Sessions',
    slug: 'neon-horizon-skyline-boiler-room-sessions',
    category: 'Nightlife',
    city: 'Bengaluru',
    date: '2026-11-27',
    displayDate: 'Fri, 27 Nov 2026',
    time: '08:00 PM IST',
    venue: 'High Lounge Rooftop, UB City',
    address: 'Level 16, UB City, Vittal Mallya Road, Bengaluru 560001',
    startingPrice: 1199,
    image: '/src/assets/images/fest_nightlife_dj_1793963303736.jpg',
    featured: true,
    trending: true,
    description:
      'Perched 16 floors above the Silicon Valley skyline, Neon Horizon brings an underground boiler room format with the DJ booth placed right at the center of the dance floor. Top techno, melodic house, and progressive beats spun by international selector talents.',
    highlights: [
      '360-degree panoramic glass-edge views over Bengaluru city',
      'Boiler room format with intimacy around the vinyl & deck console',
      'Signature mixologist craft cocktail tasting menu',
      'Strict dress code: Dark chic and neon accents'
    ],
    artistOrHost: 'DJ Anyasa, Kohra & Special Guest',
    organizer: 'NightWave Bengaluru Collective',
    ageRestriction: '21+ Years (Govt ID Mandatory)',
    duration: '5 Hours 30 Mins',
    language: 'English',
    ticketCategories: [
      {
        id: 'tc-05-single',
        name: 'Stag / Single Entry (Includes 500 Cover)',
        description: 'Single guest entry with ₹500 redeemable at the bar.',
        price: 1199,
        available: 55,
        perks: ['Entry to rooftop club', '₹500 redeemable beverage voucher']
      },
      {
        id: 'tc-05-couple',
        name: 'Couple Entry (Includes 1000 Cover)',
        description: 'Entry for 1 couple with ₹1,000 redeemable on cocktails.',
        price: 1999,
        originalPrice: 2499,
        available: 30,
        perks: ['Entry for 2 guests', '₹1,000 beverage voucher', 'Express entry']
      },
      {
        id: 'tc-05-table',
        name: 'VIP Skyline Table (4 Guests)',
        description: 'Private high table near the DJ booth with premium bottle service.',
        price: 8999,
        available: 5,
        perks: [
          'Reserved table for 4',
          '1 Premium spirits bottle + mixers included',
          'Dedicated table butler',
          'VIP valet parking'
        ]
      }
    ]
  },
  {
    id: 'ev-06',
    title: 'Hyderabad Tech & AI Creators Workshop 2026',
    slug: 'hyderabad-tech-ai-creators-workshop-2026',
    category: 'Workshops',
    city: 'Hyderabad',
    date: '2026-12-13',
    displayDate: 'Sun, 13 Dec 2026',
    time: '10:00 AM IST',
    venue: 'T-Hub 2.0 Convention Hall',
    address: 'Raidurg, Knowledge City, Gachibowli, Hyderabad, Telangana 500081',
    startingPrice: 799,
    image: '/src/assets/images/fest_cultural_carnival_1793963303886.jpg',
    featured: false,
    trending: false,
    description:
      'A hands-on, intensive weekend masterclass for software developers, product managers, and builders. Learn full-stack microservices architecture, modern GenAI integrations, Java Spring Boot 21 optimizations, and production cloud deployment patterns directly from staff engineers.',
    highlights: [
      'Full day of code-along modules and architectural deep dives',
      'Networking lunch and mentor review roundtables',
      'Certificate of mastery accredited by Festify Developer Labs',
      'Free 1-year access to code repository templates and slides'
    ],
    artistOrHost: 'Top Tech Leads from Google, Microsoft & Swiggy',
    organizer: 'Hyderabad Tech Guild & Festify Academy',
    ageRestriction: 'Open to All Developers',
    duration: '6 Hours',
    language: 'English',
    ticketCategories: [
      {
        id: 'tc-06-student',
        name: 'Student Developer Pass',
        description: 'Subsidized pass for active college university students (valid ID required).',
        price: 799,
        originalPrice: 1299,
        available: 40,
        perks: ['Full workshop access', 'Lunch and refreshments', 'Digital certificate']
      },
      {
        id: 'tc-06-pro',
        name: 'Professional Builder Pass',
        description: 'Full pass including 1-on-1 portfolio and architecture teardown session.',
        price: 1599,
        available: 75,
        perks: [
          'Full workshop access',
          'Lunch + private networking lounge',
          '1-on-1 project architecture teardown',
          'Accredited Certificate'
        ]
      }
    ]
  },
  {
    id: 'ev-07',
    title: 'Pro Cricket Derby: Delhi vs Mumbai Showdown',
    slug: 'pro-cricket-derby-delhi-vs-mumbai',
    category: 'Sports',
    city: 'Delhi',
    date: '2026-11-29',
    displayDate: 'Sun, 29 Nov 2026',
    time: '07:00 PM IST',
    venue: 'Arun Jaitley Stadium, Feroz Shah Kotla',
    address: 'Bahadur Shah Zafar Marg, New Delhi 110002',
    startingPrice: 999,
    image: '/src/assets/images/hero_festify_concert_1793963300033.jpg',
    featured: true,
    trending: true,
    description:
      'The fierce rivalry resumes under floodlights! Witness nail-biting T20 cricket action featuring explosive power hitters, fiery pace bowling, and passionate fans cheering for every single boundary.',
    highlights: [
      'High-voltage T20 encounter between historic championship rivals',
      'Cheer stations with team flags, banners & face painters',
      'Giant replay screens and live pitch-side commentary',
      'Easy metro accessibility via Delhi Gate station'
    ],
    artistOrHost: 'Indian National Cricket Stars & Overseas Champions',
    organizer: 'Board of Cricket Leagues India',
    ageRestriction: 'All Ages',
    duration: '4 Hours',
    language: 'English & Hindi',
    ticketCategories: [
      {
        id: 'tc-07-east',
        name: 'East Stand Tier 2',
        description: 'High angle view of the cricket pitch and boundary lines.',
        price: 999,
        available: 300,
        perks: ['Covered tier seating', 'Boundary view']
      },
      {
        id: 'tc-07-club',
        name: 'Pavilion Club Tier 1',
        description: 'Mid-level straight view behind the bowler’s arm.',
        price: 2499,
        originalPrice: 2999,
        available: 80,
        perks: ['Direct straight view', 'Cushioned seat', 'Match program booklet']
      },
      {
        id: 'tc-07-corp',
        name: 'Corporate Hospitality Box',
        description: 'Air-conditioned luxury lounge with unlimited dinner and beverages.',
        price: 6999,
        available: 15,
        perks: [
          'AC glass hospitality lounge',
          'Unlimited gourmet dinner buffet',
          'Free official match jersey',
          'VIP car park pass'
        ]
      }
    ]
  },
  {
    id: 'ev-08',
    title: 'Taj Heritage Classical Music & Sufi Gala',
    slug: 'taj-heritage-classical-sufi-gala',
    category: 'Music',
    city: 'Agra',
    date: '2026-12-19',
    displayDate: 'Sat, 19 Dec 2026',
    time: '06:00 PM IST',
    venue: 'Kalakriti Cultural & Convention Center',
    address: 'Fatehabad Road, Near Taj Mahal East Gate, Agra, UP 282001',
    startingPrice: 650,
    image: '/src/assets/images/fest_cultural_carnival_1793963303886.jpg',
    featured: false,
    trending: true,
    description:
      'In the historic shadow of the monument of eternal love, immerse in soul-stirring Hindustani classical ragas and sublime Sufi qawwali. Featuring renowned sitar maestros, sarod virtuosos, and soulful qawwals from the Nizamuddin lineage.',
    highlights: [
      'Mesmerizing sitar & tabla jugalbandi',
      'Live Sufi qawwali ensemble under moonlit heritage gardens',
      'Traditional Mughal refreshments including authentic Agra Petha tastings',
      'Intimate baithak-style cushioned seating arrangement'
    ],
    artistOrHost: 'Ustad Shujaat Khan & Nizami Bandhu',
    organizer: 'Agra Heritage Cultural Foundation',
    ageRestriction: '6+ Years',
    duration: '3 Hours',
    language: 'Urdu & Hindi',
    ticketCategories: [
      {
        id: 'tc-08-general',
        name: 'Baithak General Seating',
        description: 'Traditional carpet and bolster seating with great acoustics.',
        price: 650,
        available: 120,
        perks: ['Carpet cushion seating', 'Mughal welcome tea']
      },
      {
        id: 'tc-08-sofa',
        name: 'Royal Divan First Rows',
        description: 'First two rows with plush royal divans and tea service.',
        price: 1450,
        originalPrice: 1800,
        available: 25,
        perks: [
          'Front row royal divan',
          'Artisan petha gift box',
          'Artist meet & greet access'
        ]
      }
    ]
  },
  {
    id: 'ev-09',
    title: 'Kolkata Sunset Indie Acoustic Fest',
    slug: 'kolkata-sunset-indie-acoustic-fest',
    category: 'Music',
    city: 'Kolkata',
    date: '2026-11-22',
    displayDate: 'Sun, 22 Nov 2026',
    time: '04:30 PM IST',
    venue: 'Mohor Kunja Amphitheatre',
    address: 'Opposite Nandan, Cathedral Road, Kolkata, West Bengal 700071',
    startingPrice: 499,
    image: '/src/assets/images/fest_edm_carnival_1793963302353.jpg',
    featured: false,
    trending: false,
    description:
      'Celebrate Kolkata’s evergreen romance with poetry, acoustic strings, and heartfelt indie songwriting. As the winter sun sets over Victoria Memorial, enjoy unplugged sets by India’s top indie singer-songwriters along with book kiosks and artisanal coffee carts.',
    highlights: [
      'Unplugged acoustic sets in an open-air verdant amphitheatre',
      'Special Bengali folk-rock crossover tribute',
      'Kolkata street food carts: artisanal puchkas, kathi rolls & specialty pour-overs',
      'Cozy beanbags and open-lawn seating'
    ],
    artistOrHost: 'Prateek Kuhad, Anupam Roy & When Chai Met Toast',
    organizer: 'The City of Joy Arts Society',
    ageRestriction: 'Open to All',
    duration: '4 Hours 30 Mins',
    language: 'Bengali, Hindi & English',
    ticketCategories: [
      {
        id: 'tc-09-lawn',
        name: 'Open Lawn Pass',
        description: 'Sit anywhere on the lush amphitheatre lawn.',
        price: 499,
        available: 200,
        perks: ['Amphitheatre lawn seating', 'Access to book and vinyl stalls']
      },
      {
        id: 'tc-09-prime',
        name: 'Reserved Amphitheatre Tier',
        description: 'Reserved front tier seating with unobstructed stage view.',
        price: 999,
        originalPrice: 1299,
        available: 65,
        perks: ['Reserved seating', 'Complimentary artisanal filter coffee voucher']
      }
    ]
  },
  {
    id: 'ev-10',
    title: 'Pune Craft Beer, BBQ & Rhythm Carnival',
    slug: 'pune-craft-beer-bbq-rhythm-carnival',
    category: 'Nightlife',
    city: 'Pune',
    date: '2026-12-06',
    displayDate: 'Sun, 06 Dec 2026',
    time: '03:00 PM IST',
    venue: 'The Westin Lawns, Koregaon Park',
    address: '36/3-B, Mundhwa Road, Koregaon Park Annexe, Pune 411001',
    startingPrice: 799,
    image: '/src/assets/images/fest_nightlife_dj_1793963303736.jpg',
    featured: false,
    trending: true,
    description:
      'Pune’s favorite culinary and microbrewery carnival! Over 12 homegrown craft breweries pouring their freshest IPAs, wheat beers, and stouts alongside slow-smoked barbecue pits, retro vinyl DJs, and giant lawn board games.',
    highlights: [
      '12 craft microbreweries with 30+ signature seasonal brews',
      'Live live-fire barbecue and smoked meat & vegan tasting grills',
      'Sunset funk, jazz, and disco vinyl sets',
      'Dog-friendly afternoon session'
    ],
    artistOrHost: 'Curated by Pune Breweries Guild',
    organizer: 'Festify Nightlife Experiences',
    ageRestriction: '21+ for Alcohol Consumption',
    duration: '7 Hours',
    language: 'English & Hindi',
    ticketCategories: [
      {
        id: 'tc-10-entry',
        name: 'Carnival Entry + Tasting Glass',
        description: 'Access to the festival grounds with a commemorative glass and 2 tasting tokens.',
        price: 799,
        available: 180,
        perks: ['Festival entry', 'Souvenir tasting glass', '2 Craft beer taster tokens']
      },
      {
        id: 'tc-10-unlimited',
        name: 'Brewer’s Pass (Includes BBQ Platter)',
        description: 'Includes 5 beer tokens, full gourmet barbecue platter, and fast track entry.',
        price: 1899,
        originalPrice: 2200,
        available: 50,
        perks: [
          '5 full craft beer pours',
          'Chef special gourmet BBQ platter',
          'Fast-track entry wristband'
        ]
      }
    ]
  }
];
