/**
 * Q-ROUTE: Comprehensive Indian States & Places Dataset
 * Covers all 28 States and 8 Union Territories of India, including:
 * - State Capitals & Smart Cities
 * - District Headquarters
 * - Major National Highway Corridors
 * - Commercial & Industrial Hubs
 * - Airports & Landmark Tourist Destinations
 */

export const INDIAN_STATES_AND_UTS = [
  // 28 States
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // 8 Union Territories
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi-NCR', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const INDIAN_PLACES = [
  // =================== DELHI-NCR ===================
  { id: 'delhi-cp', name: 'Connaught Place, New Delhi', state: 'Delhi-NCR', lat: 28.6315, lng: 77.2167, category: 'Commercial Hub' },
  { id: 'delhi-igi', name: 'Indira Gandhi International Airport (IGI T3)', state: 'Delhi-NCR', lat: 28.5562, lng: 77.1000, category: 'Airport' },
  { id: 'delhi-india-gate', name: 'India Gate / Kartavya Path', state: 'Delhi-NCR', lat: 28.6129, lng: 77.2295, category: 'Landmark' },
  { id: 'delhi-cybercity', name: 'DLF Cyber City, Gurugram', state: 'Delhi-NCR', lat: 28.4950, lng: 77.0895, category: 'Tech Park' },
  { id: 'delhi-noida-sec62', name: 'Noida Sector 62 / Electronic City', state: 'Delhi-NCR', lat: 28.6280, lng: 77.3649, category: 'Tech Park' },
  { id: 'delhi-aerocity', name: 'Aerocity Hospitality District', state: 'Delhi-NCR', lat: 28.5492, lng: 77.1213, category: 'Commercial Hub' },
  { id: 'delhi-dwarka', name: 'Dwarka Sector 21', state: 'Delhi-NCR', lat: 28.5523, lng: 77.0583, category: 'Transit Hub' },
  { id: 'delhi-chandni-chowk', name: 'Chandni Chowk / Old Delhi Railway Stn', state: 'Delhi-NCR', lat: 28.6562, lng: 77.2300, category: 'Heritage' },

  // =================== RAJASTHAN ===================
  { id: 'raj-jaipur-mi', name: 'Jaipur (MI Road & Pink City)', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, category: 'Capital / City' },
  { id: 'raj-jaipur-sitapura', name: 'Jaipur Sitapura Industrial Area', state: 'Rajasthan', lat: 26.7758, lng: 75.8458, category: 'Industrial Hub' },
  { id: 'raj-ajmer', name: 'Ajmer (Dargah Sharif / Station)', state: 'Rajasthan', lat: 26.4499, lng: 74.6399, category: 'Heritage / City' },
  { id: 'raj-pushkar', name: 'Pushkar Lake & Brahma Temple', state: 'Rajasthan', lat: 26.4897, lng: 74.5511, category: 'Tourism' },
  { id: 'raj-jodhpur', name: 'Jodhpur (Mehrangarh & Circuit House)', state: 'Rajasthan', lat: 26.2968, lng: 73.0351, category: 'Major City' },
  { id: 'raj-udaipur', name: 'Udaipur (City Palace & Lake Pichola)', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, category: 'Tourism / City' },
  { id: 'raj-kota', name: 'Kota (Aerodrome Circle / Coaching Hub)', state: 'Rajasthan', lat: 25.1825, lng: 75.8398, category: 'Education Hub' },
  { id: 'raj-bikaner', name: 'Bikaner (Junagarh Fort)', state: 'Rajasthan', lat: 28.0229, lng: 73.3119, category: 'Major City' },
  { id: 'raj-jaisalmer', name: 'Jaisalmer (Golden Fort & Sam Dunes)', state: 'Rajasthan', lat: 26.9157, lng: 70.9083, category: 'Tourism' },
  { id: 'raj-alwar', name: 'Alwar (Neemrana Industrial Zone)', state: 'Rajasthan', lat: 27.5530, lng: 76.6346, category: 'Industrial Hub' },
  { id: 'raj-mount-abu', name: 'Mount Abu (Dilwara Temples & Nakki Lake)', state: 'Rajasthan', lat: 24.5926, lng: 72.7156, category: 'Hill Station' },
  { id: 'raj-kishangarh', name: 'Kishangarh Marble Market & Airport', state: 'Rajasthan', lat: 26.5746, lng: 74.8653, category: 'Industrial Hub' },

  // =================== MAHARASHTRA ===================
  { id: 'mh-mumbai-nariman', name: 'Nariman Point, South Mumbai', state: 'Maharashtra', lat: 18.9256, lng: 72.8242, category: 'Financial District' },
  { id: 'mh-mumbai-bandra', name: 'Bandra West & BKC, Mumbai', state: 'Maharashtra', lat: 19.0596, lng: 72.8295, category: 'Financial District' },
  { id: 'mh-mumbai-cst', name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', state: 'Maharashtra', lat: 18.9401, lng: 72.8354, category: 'Transit Hub' },
  { id: 'mh-mumbai-airport', name: 'Mumbai Chhatrapati Shivaji Airport (BOM T2)', state: 'Maharashtra', lat: 19.0896, lng: 72.8656, category: 'Airport' },
  { id: 'mh-navi-mumbai', name: 'Navi Mumbai (Vashi & New Airport Site)', state: 'Maharashtra', lat: 19.0330, lng: 73.0297, category: 'Smart City' },
  { id: 'mh-thane', name: 'Thane (Ghubunder Road Corridor)', state: 'Maharashtra', lat: 19.2183, lng: 72.9781, category: 'Major City' },
  { id: 'mh-pune-shivaji', name: 'Pune (Shivajinagar / FC Road)', state: 'Maharashtra', lat: 18.5308, lng: 73.8475, category: 'Major City' },
  { id: 'mh-pune-hinjawadi', name: 'Pune Hinjawadi Rajiv Gandhi Infotech Park', state: 'Maharashtra', lat: 18.5913, lng: 73.7389, category: 'Tech Park' },
  { id: 'mh-nagpur', name: 'Nagpur (Zero Mile / MIHAN SEZ)', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, category: 'Major City' },
  { id: 'mh-nashik', name: 'Nashik (Panchavati & Trimbak Road)', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, category: 'Industrial / Pilgrimage' },
  { id: 'mh-aurangabad', name: 'Chhatrapati Sambhajinagar (Aurangabad / Ajanta Ellora)', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, category: 'Heritage / City' },
  { id: 'mh-shirdi', name: 'Shirdi (Sai Baba Sansthan)', state: 'Maharashtra', lat: 19.7645, lng: 74.4762, category: 'Pilgrimage' },
  { id: 'mh-kolhapur', name: 'Kolhapur (Mahalakshmi Temple)', state: 'Maharashtra', lat: 16.7050, lng: 74.2433, category: 'Major City' },
  { id: 'mh-lonavala', name: 'Lonavala & Khandala Expressway Corridor', state: 'Maharashtra', lat: 18.7546, lng: 73.4062, category: 'Hill Station' },

  // =================== KARNATAKA ===================
  { id: 'ka-blr-mgroad', name: 'Bengaluru (MG Road / Vidhana Soudha)', state: 'Karnataka', lat: 12.9756, lng: 77.6066, category: 'Capital / City' },
  { id: 'ka-blr-ecity', name: 'Electronic City Phase 1 & 2, Bengaluru', state: 'Karnataka', lat: 12.8452, lng: 77.6602, category: 'Tech Park' },
  { id: 'ka-blr-whitefield', name: 'Whitefield ITPL Corridor, Bengaluru', state: 'Karnataka', lat: 12.9863, lng: 77.7337, category: 'Tech Park' },
  { id: 'ka-blr-airport', name: 'Kempegowda International Airport (BLR)', state: 'Karnataka', lat: 13.1986, lng: 77.7066, category: 'Airport' },
  { id: 'ka-mysuru', name: 'Mysuru (Mysore Palace & Ring Road)', state: 'Karnataka', lat: 12.2958, lng: 76.6394, category: 'Heritage / City' },
  { id: 'ka-hubballi', name: 'Hubballi - Dharwad Tech Cluster', state: 'Karnataka', lat: 15.3647, lng: 75.1240, category: 'Major City' },
  { id: 'ka-mangaluru', name: 'Mangaluru (New Mangalore Port & Airport)', state: 'Karnataka', lat: 12.9141, lng: 74.8560, category: 'Port / City' },
  { id: 'ka-belagavi', name: 'Belagavi (Belgaum Fort & Industrial Hub)', state: 'Karnataka', lat: 15.8497, lng: 74.4977, category: 'Major City' },
  { id: 'ka-hampi', name: 'Hampi (UNESCO Vijayanagara Ruins)', state: 'Karnataka', lat: 15.3350, lng: 76.4600, category: 'Heritage' },

  // =================== TAMIL NADU ===================
  { id: 'tn-chennai-central', name: 'Chennai Central / Marina Beach', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, category: 'Capital / Port' },
  { id: 'tn-chennai-omr', name: 'Chennai OMR / IT Expressway (Sholinganallur)', state: 'Tamil Nadu', lat: 12.9010, lng: 80.2279, category: 'Tech Park' },
  { id: 'tn-chennai-airport', name: 'Chennai International Airport (MAA)', state: 'Tamil Nadu', lat: 12.9941, lng: 80.1709, category: 'Airport' },
  { id: 'tn-coimbatore', name: 'Coimbatore (Avinashi Road & Textile City)', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, category: 'Major City' },
  { id: 'tn-madurai', name: 'Madurai (Meenakshi Amman Temple)', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, category: 'Heritage / City' },
  { id: 'tn-tiruchirappalli', name: 'Tiruchirappalli (Trichy Rockfort & NIT)', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, category: 'Major City' },
  { id: 'tn-salem', name: 'Salem (Steel Plant & Bypass)', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460, category: 'Industrial Hub' },
  { id: 'tn-ooty', name: 'Ooty (Udhagamandalam Nilgiri Hills)', state: 'Tamil Nadu', lat: 11.4102, lng: 76.6950, category: 'Hill Station' },
  { id: 'tn-kanyakumari', name: 'Kanyakumari (Vivekananda Rock Memorial)', state: 'Tamil Nadu', lat: 8.0883, lng: 77.5385, category: 'Landmark' },

  // =================== UTTAR PRADESH ===================
  { id: 'up-lucknow-hazratganj', name: 'Lucknow (Hazratganj / Charbagh)', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, category: 'Capital / City' },
  { id: 'up-kanpur', name: 'Kanpur (Mall Road & IIT Kanpur)', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, category: 'Industrial City' },
  { id: 'up-varanasi', name: 'Varanasi (Kashi Vishwanath & Dashashwamedh Ghat)', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, category: 'Pilgrimage / Heritage' },
  { id: 'up-agra', name: 'Agra (Taj Mahal & Yamuna Expressway)', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, category: 'Tourism / Heritage' },
  { id: 'up-prayagraj', name: 'Prayagraj (Triveni Sangam & High Court)', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, category: 'Pilgrimage / City' },
  { id: 'up-ayodhya', name: 'Ayodhya (Ram Mandir & Saryu Ghat)', state: 'Uttar Pradesh', lat: 26.7922, lng: 82.1998, category: 'Pilgrimage' },
  { id: 'up-mathura', name: 'Mathura & Vrindavan Corridor', state: 'Uttar Pradesh', lat: 27.4924, lng: 77.6737, category: 'Pilgrimage' },
  { id: 'up-noida', name: 'Noida (Greater Noida Expressway)', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, category: 'Smart City' },
  { id: 'up-meerut', name: 'Meerut (Delhi-Meerut RRTS Corridor)', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, category: 'Major City' },
  { id: 'up-gorakhpur', name: 'Gorakhpur (Gorakhnath Math & AIIMS)', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732, category: 'Major City' },

  // =================== GUJARAT ===================
  { id: 'gj-ahmedabad-sg', name: 'Ahmedabad (SG Highway & Sabarmati Ashram)', state: 'Gujarat', lat: 23.0225, lng: 72.5714, category: 'Commercial City' },
  { id: 'gj-gandhinagar', name: 'Gandhinagar (GIFT City & Akshardham)', state: 'Gujarat', lat: 23.2156, lng: 72.6369, category: 'Capital / Financial SEZ' },
  { id: 'gj-surat', name: 'Surat (Diamond Bourse & Ring Road)', state: 'Gujarat', lat: 21.1702, lng: 72.8311, category: 'Diamond / Textile Hub' },
  { id: 'gj-vadodara', name: 'Vadodara (Laxmi Vilas Palace & Alkapuri)', state: 'Gujarat', lat: 22.3072, lng: 73.1812, category: 'Major City' },
  { id: 'gj-rajkot', name: 'Rajkot (Kalawad Road & Engineering Hub)', state: 'Gujarat', lat: 22.3039, lng: 70.8022, category: 'Industrial Hub' },
  { id: 'gj-statue-of-unity', name: 'Statue of Unity, Kevadia (Ekta Nagar)', state: 'Gujarat', lat: 21.8380, lng: 73.7191, category: 'Tourism Landmark' },
  { id: 'gj-somnath', name: 'Somnath Temple & Veraval Coastal Road', state: 'Gujarat', lat: 20.8880, lng: 70.4012, category: 'Pilgrimage' },
  { id: 'gj-dwarka', name: 'Dwarka (Dwarkadhish Temple)', state: 'Gujarat', lat: 22.2442, lng: 68.9685, category: 'Pilgrimage' },

  // =================== TELANGANA ===================
  { id: 'ts-hyd-hitech', name: 'Hyderabad HITEC City & Gachibowli', state: 'Telangana', lat: 17.4474, lng: 78.3762, category: 'Tech Park' },
  { id: 'ts-hyd-charminar', name: 'Hyderabad (Charminar & Old City)', state: 'Telangana', lat: 17.3616, lng: 78.4747, category: 'Heritage' },
  { id: 'ts-hyd-airport', name: 'Rajiv Gandhi International Airport (HYD / Shamshabad)', state: 'Telangana', lat: 17.2403, lng: 78.4294, category: 'Airport' },
  { id: 'ts-warangal', name: 'Warangal (Thousand Pillar Temple & NIT)', state: 'Telangana', lat: 17.9689, lng: 79.5941, category: 'Major City' },
  { id: 'ts-nizamabad', name: 'Nizamabad (Collectorate Road)', state: 'Telangana', lat: 18.6725, lng: 78.0941, category: 'Major City' },

  // =================== ANDHRA PRADESH ===================
  { id: 'ap-amaravati', name: 'Amaravati Capital City Complex', state: 'Andhra Pradesh', lat: 16.5417, lng: 80.5158, category: 'Capital' },
  { id: 'ap-visakhapatnam', name: 'Visakhapatnam (Vizag RK Beach & Port)', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, category: 'Port / City' },
  { id: 'ap-vijayawada', name: 'Vijayawada (Kanaka Durga Temple & Station)', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, category: 'Commercial Hub' },
  { id: 'ap-tirupati', name: 'Tirupati (Tirumala Balaji & Alipiri)', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192, category: 'Pilgrimage' },
  { id: 'ap-guntur', name: 'Guntur (Mirchi Yard & Auto Nagar)', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365, category: 'Agricultural Hub' },

  // =================== WEST BENGAL ===================
  { id: 'wb-kolkata-parkst', name: 'Kolkata (Park Street & Victoria Memorial)', state: 'West Bengal', lat: 22.5535, lng: 88.3512, category: 'Capital / Heritage' },
  { id: 'wb-kolkata-saltlake', name: 'Kolkata Sector V / Salt Lake IT Hub', state: 'West Bengal', lat: 22.5786, lng: 88.4328, category: 'Tech Park' },
  { id: 'wb-howrah', name: 'Howrah Junction Railway Station & Bridge', state: 'West Bengal', lat: 22.5857, lng: 88.3426, category: 'Transit Hub' },
  { id: 'wb-siliguri', name: 'Siliguri (North Bengal Gateway / Bagdogra)', state: 'West Bengal', lat: 26.7271, lng: 88.3953, category: 'Transit Corridor' },
  { id: 'wb-darjeeling', name: 'Darjeeling (Mall Road & Toy Train)', state: 'West Bengal', lat: 27.0410, lng: 88.2663, category: 'Hill Station' },
  { id: 'wb-durgapur', name: 'Durgapur (Steel City / City Centre)', state: 'West Bengal', lat: 23.5204, lng: 87.3119, category: 'Industrial Hub' },

  // =================== KERALA ===================
  { id: 'kl-tvm', name: 'Thiruvananthapuram (Padmanabhaswamy Temple & Technopark)', state: 'Kerala', lat: 8.5241, lng: 76.9366, category: 'Capital / Tech' },
  { id: 'kl-kochi', name: 'Kochi (Marine Drive, MG Road & Fort Kochi)', state: 'Kerala', lat: 9.9312, lng: 76.2673, category: 'Port / City' },
  { id: 'kl-kochi-airport', name: 'Cochin International Airport (COK / Nedumbassery)', state: 'Kerala', lat: 10.1556, lng: 76.3912, category: 'Airport' },
  { id: 'kl-kozhikode', name: 'Kozhikode (Calicut Beach & SM Street)', state: 'Kerala', lat: 11.2588, lng: 75.7804, category: 'Major City' },
  { id: 'kl-munnar', name: 'Munnar (Tea Estates & Anamudi)', state: 'Kerala', lat: 10.0889, lng: 77.0595, category: 'Hill Station' },
  { id: 'kl-alappuzha', name: 'Alappuzha (Alleppey Backwaters & Beach)', state: 'Kerala', lat: 9.4981, lng: 76.3388, category: 'Tourism' },

  // =================== MADHYA PRADESH ===================
  { id: 'mp-bhopal', name: 'Bhopal (Upper Lake & MP Nagar)', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, category: 'Capital / City' },
  { id: 'mp-indore', name: 'Indore (Chappan Dukan & Super Corridor)', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, category: 'Cleanest City / Tech' },
  { id: 'mp-gwalior', name: 'Gwalior (Gwalior Fort & Station)', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, category: 'Heritage / City' },
  { id: 'mp-jabalpur', name: 'Jabalpur (Bhedaghat Marble Rocks)', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864, category: 'Major City' },
  { id: 'mp-ujjain', name: 'Ujjain (Mahakaleshwar Jyotirlinga)', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885, category: 'Pilgrimage' },

  // =================== PUNJAB & HARYANA ===================
  { id: 'chd-sector17', name: 'Chandigarh (Sector 17 & Sukhna Lake)', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, category: 'Capital / UT' },
  { id: 'pb-amritsar', name: 'Amritsar (Golden Temple / Harmandir Sahib)', state: 'Punjab', lat: 31.6200, lng: 74.8765, category: 'Pilgrimage / Heritage' },
  { id: 'pb-ludhiana', name: 'Ludhiana (Ferozepur Road Industrial Hub)', state: 'Punjab', lat: 30.9010, lng: 75.8573, category: 'Industrial City' },
  { id: 'pb-jalandhar', name: 'Jalandhar (Sports Goods Cluster & GT Road)', state: 'Punjab', lat: 31.3260, lng: 75.5762, category: 'Major City' },
  { id: 'hr-panipat', name: 'Panipat (Textile Hub & Refinery)', state: 'Haryana', lat: 29.3909, lng: 76.9635, category: 'Industrial Hub' },
  { id: 'hr-faridabad', name: 'Faridabad (Mathura Road & NIT)', state: 'Haryana', lat: 28.4089, lng: 77.3178, category: 'Industrial City' },

  // =================== BIHAR & JHARKHAND ===================
  { id: 'br-patna', name: 'Patna (Gandhi Maidan & Bailey Road)', state: 'Bihar', lat: 25.5941, lng: 85.1376, category: 'Capital / City' },
  { id: 'br-gaya', name: 'Bodh Gaya (Mahabodhi Temple)', state: 'Bihar', lat: 24.6961, lng: 84.9869, category: 'Pilgrimage / UNESCO' },
  { id: 'br-muzaffarpur', name: 'Muzaffarpur (Commercial Hub)', state: 'Bihar', lat: 26.1209, lng: 85.3647, category: 'Major City' },
  { id: 'jh-ranchi', name: 'Ranchi (Morabadi & Main Road)', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, category: 'Capital / City' },
  { id: 'jh-jamshedpur', name: 'Jamshedpur (Tata Steel City / Bistupur)', state: 'Jharkhand', lat: 22.8046, lng: 86.2029, category: 'Industrial City' },
  { id: 'jh-dhanbad', name: 'Dhanbad (Coal Capital of India)', state: 'Jharkhand', lat: 23.7957, lng: 86.4304, category: 'Industrial City' },

  // =================== HIMACHAL PRADESH & UTTARAKHAND ===================
  { id: 'hp-shimla', name: 'Shimla (Mall Road & Ridge)', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, category: 'Capital / Hill Station' },
  { id: 'hp-manali', name: 'Manali & Atal Tunnel Portal', state: 'Himachal Pradesh', lat: 32.2432, lng: 77.1892, category: 'Hill Station' },
  { id: 'hp-dharamshala', name: 'Dharamshala & McLeodGanj', state: 'Himachal Pradesh', lat: 32.2190, lng: 76.3234, category: 'Hill Station' },
  { id: 'uk-dehradun', name: 'Dehradun (Rajpur Road & Clock Tower)', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, category: 'Capital / City' },
  { id: 'uk-haridwar', name: 'Haridwar (Har Ki Pauri Ghat)', state: 'Uttarakhand', lat: 29.9457, lng: 78.1642, category: 'Pilgrimage' },
  { id: 'uk-rishikesh', name: 'Rishikesh (Laxman Jhula & Yoga Capital)', state: 'Uttarakhand', lat: 30.0869, lng: 78.2676, category: 'Tourism' },
  { id: 'uk-nainital', name: 'Nainital (Naini Lake & Mall Road)', state: 'Uttarakhand', lat: 29.3919, lng: 79.4542, category: 'Hill Station' },

  // =================== ODISHA & CHHATTISGARH ===================
  { id: 'od-bhubaneswar', name: 'Bhubaneswar (Temple City & Infocity)', state: 'Odisha', lat: 20.2961, lng: 85.8245, category: 'Capital / Smart City' },
  { id: 'od-puri', name: 'Puri (Jagannath Temple & Marine Drive)', state: 'Odisha', lat: 19.8135, lng: 85.8312, category: 'Pilgrimage / Tourism' },
  { id: 'cg-raipur', name: 'Raipur (Nava Raipur Smart City)', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, category: 'Capital / City' },
  { id: 'cg-bhilai', name: 'Bhilai Steel City & Durg', state: 'Chhattisgarh', lat: 21.1938, lng: 81.3509, category: 'Industrial City' },

  // =================== ASSAM & NORTH-EAST ===================
  { id: 'as-guwahati', name: 'Guwahati (Kamakhya Temple & GS Road)', state: 'Assam', lat: 26.1445, lng: 91.7362, category: 'Gateway City' },
  { id: 'as-dispur', name: 'Dispur Secretariat, Assam', state: 'Assam', lat: 26.1408, lng: 91.7900, category: 'Capital' },
  { id: 'sk-gangtok', name: 'Gangtok (MG Marg & Enchey Monastery)', state: 'Sikkim', lat: 27.3389, lng: 88.6065, category: 'Capital / Tourism' },
  { id: 'ml-shillong', name: 'Shillong (Police Bazar & Scotland of East)', state: 'Meghalaya', lat: 25.5788, lng: 91.8933, category: 'Capital / Hill Station' },
  { id: 'ar-itanagar', name: 'Itanagar (Gompa & Civil Secretariat)', state: 'Arunachal Pradesh', lat: 27.0844, lng: 93.6053, category: 'Capital' },
  { id: 'tr-agartala', name: 'Agartala (Ujjayanta Palace)', state: 'Tripura', lat: 23.8315, lng: 91.2868, category: 'Capital' },
  { id: 'mn-imphal', name: 'Imphal (Kangla Fort)', state: 'Manipur', lat: 24.8170, lng: 93.9368, category: 'Capital' },
  { id: 'mz-aizawl', name: 'Aizawl (Tuikual & Millennium Centre)', state: 'Mizoram', lat: 23.7307, lng: 92.7173, category: 'Capital' },
  { id: 'nl-kohima', name: 'Kohima (War Cemetery & Hornbill Festival site)', state: 'Nagaland', lat: 25.6751, lng: 94.1086, category: 'Capital' },

  // =================== JAMMU & KASHMIR, LADAKH ===================
  { id: 'jk-srinagar', name: 'Srinagar (Dal Lake & Lal Chowk)', state: 'Jammu and Kashmir', lat: 34.0837, lng: 74.7973, category: 'Summer Capital' },
  { id: 'jk-jammu', name: 'Jammu (Raghunath Temple & Tawi River)', state: 'Jammu and Kashmir', lat: 32.7266, lng: 74.8570, category: 'Winter Capital' },
  { id: 'jk-gulmarg', name: 'Gulmarg (Gondola & Ski Resort)', state: 'Jammu and Kashmir', lat: 34.0484, lng: 74.3805, category: 'Hill Station' },
  { id: 'lk-leh', name: 'Leh (Leh Palace & Shanti Stupa)', state: 'Ladakh', lat: 34.1526, lng: 77.5771, category: 'Capital / Tourism' },

  // =================== GOA & UNION TERRITORIES ===================
  { id: 'ga-panaji', name: 'Panaji (Fontainhas & Miramar Beach)', state: 'Goa', lat: 15.4909, lng: 73.8278, category: 'Capital / Tourism' },
  { id: 'ga-calangute', name: 'Calangute & Baga Beach Corridor', state: 'Goa', lat: 15.5439, lng: 73.7553, category: 'Tourism' },
  { id: 'ga-airport-mopa', name: 'Manohar International Airport (GOX / Mopa)', state: 'Goa', lat: 15.7592, lng: 73.8647, category: 'Airport' },
  { id: 'py-puducherry', name: 'Puducherry (French Quarter & Promenade Beach)', state: 'Puducherry', lat: 11.9416, lng: 79.8083, category: 'Coastal Heritage' },
  { id: 'py-auroville', name: 'Auroville Matrimandir Community', state: 'Puducherry', lat: 12.0069, lng: 79.8106, category: 'International Community' },
  { id: 'an-port-blair', name: 'Port Blair (Cellular Jail & Marina Park)', state: 'Andaman and Nicobar Islands', lat: 11.6234, lng: 92.7265, category: 'Capital / Island' }
];

/**
 * Popular Interstate & Intercity Highway Corridors for SIH Demonstration
 */
export const POPULAR_INDIAN_CORRIDORS = [
  {
    id: 'corridor-jaipur-ajmer',
    name: 'Jaipur → Ajmer',
    description: 'NH-48 Golden Quadrilateral vs Bagru-Naraina Expressway',
    origin: { name: 'Jaipur (MI Road & Pink City)', lat: 26.9124, lng: 75.7873 },
    destination: { name: 'Ajmer (Dargah Sharif / Station)', lat: 26.4499, lng: 74.6399 },
    state: 'Rajasthan',
    distanceKm: 132.4
  },
  {
    id: 'corridor-delhi-gurgaon',
    name: 'Delhi → Gurgaon Cyber City',
    description: 'NH-48 Mahipalpur Choke vs Mehrauli-Gurgaon (MG) Road',
    origin: { name: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167 },
    destination: { name: 'DLF Cyber City, Gurugram', lat: 28.4950, lng: 77.0895 },
    state: 'Delhi-NCR',
    distanceKm: 28.4
  },
  {
    id: 'corridor-mumbai-pune',
    name: 'Mumbai → Pune Expressway',
    description: 'Yashwantrao Chavan Expressway vs Old NH-48 Ghat Bypass',
    origin: { name: 'Bandra West & BKC, Mumbai', lat: 19.0596, lng: 72.8295 },
    destination: { name: 'Pune (Shivajinagar / FC Road)', lat: 18.5308, lng: 73.8475 },
    state: 'Maharashtra',
    distanceKm: 148.5
  },
  {
    id: 'corridor-delhi-agra',
    name: 'Delhi → Agra (Taj Corridor)',
    description: 'Yamuna 6-Lane Expressway vs Old Mathura NH-19 Corridor',
    origin: { name: 'India Gate / Kartavya Path', lat: 28.6129, lng: 77.2295 },
    destination: { name: 'Agra (Taj Mahal & Yamuna Expressway)', lat: 27.1767, lng: 78.0081 },
    state: 'Uttar Pradesh',
    distanceKm: 215.0
  },
  {
    id: 'corridor-bangalore-mysuru',
    name: 'Bengaluru → Mysuru 10-Lane Expressway',
    description: 'NH-275 Access-Controlled Expressway vs Kanakapura Bypass',
    origin: { name: 'Bengaluru (MG Road / Vidhana Soudha)', lat: 12.9756, lng: 77.6066 },
    destination: { name: 'Mysuru (Mysore Palace & Ring Road)', lat: 12.2958, lng: 76.6394 },
    state: 'Karnataka',
    distanceKm: 144.2
  },
  {
    id: 'corridor-chennai-pondicherry',
    name: 'Chennai → Puducherry (East Coast Road)',
    description: 'ECR Scenic Coastal Highway vs OMR Tindivanam Bypass',
    origin: { name: 'Chennai Central / Marina Beach', lat: 13.0827, lng: 80.2707 },
    destination: { name: 'Puducherry (French Quarter & Promenade Beach)', lat: 11.9416, lng: 79.8083 },
    state: 'Tamil Nadu',
    distanceKm: 151.0
  },
  {
    id: 'corridor-ahmedabad-vadodara',
    name: 'Ahmedabad → Vadodara NE-1',
    description: 'National Expressway 1 vs Old NH-64 Arterial',
    origin: { name: 'Ahmedabad (SG Highway & Sabarmati Ashram)', lat: 23.0225, lng: 72.5714 },
    destination: { name: 'Vadodara (Laxmi Vilas Palace & Alkapuri)', lat: 22.3072, lng: 73.1812 },
    state: 'Gujarat',
    distanceKm: 111.0
  },
  {
    id: 'corridor-chandigarh-shimla',
    name: 'Chandigarh → Shimla Himalayan Expressway',
    description: 'Parwanoo Himalayan 4-Lane vs Kalka-Solan Ghat Section',
    origin: { name: 'Chandigarh (Sector 17 & Sukhna Lake)', lat: 30.7333, lng: 76.7794 },
    destination: { name: 'Shimla (Mall Road & Ridge)', lat: 31.1048, lng: 77.1734 },
    state: 'Himachal Pradesh',
    distanceKm: 113.8
  },
  {
    id: 'corridor-kolkata-durgapur',
    name: 'Kolkata → Durgapur Steel Corridor',
    description: 'NH-19 Durgapur Expressway (4-Lane) vs Dankuni Arterial',
    origin: { name: 'Kolkata (Park Street & Victoria Memorial)', lat: 22.5535, lng: 88.3512 },
    destination: { name: 'Durgapur (Steel City / City Centre)', lat: 23.5204, lng: 87.3119 },
    state: 'West Bengal',
    distanceKm: 168.0
  }
];

export const PRESET_CORRIDORS = POPULAR_INDIAN_CORRIDORS;
