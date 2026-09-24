/**
 * Q-ROUTE: Complete All-India Cities & States Database
 * Exhaustive coverage of all 28 States and 8 Union Territories with their respective cities,
 * district headquarters, municipal corporations, and coordinates.
 */

export const ALL_INDIAN_STATES = [
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

export const CITIES_BY_STATE = {
  'Andhra Pradesh': [
    { name: 'Amaravati', lat: 16.5417, lng: 80.5158, isCapital: true },
    { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
    { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
    { name: 'Guntur', lat: 16.3067, lng: 80.4365 },
    { name: 'Tirupati', lat: 13.6288, lng: 79.4192 },
    { name: 'Kurnool', lat: 15.8281, lng: 78.0373 },
    { name: 'Nellore', lat: 14.4426, lng: 79.9865 },
    { name: 'Rajahmundry', lat: 17.0005, lng: 81.8040 },
    { name: 'Kakinada', lat: 16.9891, lng: 82.2475 },
    { name: 'Kadapa', lat: 14.4673, lng: 78.8242 },
    { name: 'Anantapur', lat: 14.6819, lng: 77.6006 },
    { name: 'Eluru', lat: 16.7107, lng: 81.0952 },
    { name: 'Ongole', lat: 15.5057, lng: 80.0499 },
    { name: 'Chittoor', lat: 13.2172, lng: 79.1003 },
    { name: 'Machilipatnam', lat: 16.1875, lng: 81.1389 },
    { name: 'Srikakulam', lat: 18.2949, lng: 83.8938 },
    { name: 'Vizianagaram', lat: 18.1067, lng: 83.3956 }
  ],

  'Arunachal Pradesh': [
    { name: 'Itanagar', lat: 27.0844, lng: 93.6053, isCapital: true },
    { name: 'Naharlagun', lat: 27.1062, lng: 93.6936 },
    { name: 'Tawang', lat: 27.5861, lng: 91.8594 },
    { name: 'Pasighat', lat: 28.0664, lng: 95.3267 },
    { name: 'Ziro', lat: 27.5950, lng: 93.8340 },
    { name: 'Bomdila', lat: 27.2645, lng: 92.4229 },
    { name: 'Tezu', lat: 27.9140, lng: 96.1660 },
    { name: 'Roing', lat: 28.1408, lng: 95.8360 },
    { name: 'Aalo (Along)', lat: 28.1670, lng: 94.8010 }
  ],

  'Assam': [
    { name: 'Dispur', lat: 26.1408, lng: 91.7900, isCapital: true },
    { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
    { name: 'Silchar', lat: 24.8333, lng: 92.7789 },
    { name: 'Dibrugarh', lat: 27.4728, lng: 94.9120 },
    { name: 'Jorhat', lat: 26.7509, lng: 94.2037 },
    { name: 'Nagaon', lat: 26.3465, lng: 92.6840 },
    { name: 'Tinsukia', lat: 27.4922, lng: 95.3468 },
    { name: 'Tezpur', lat: 26.6528, lng: 92.7926 },
    { name: 'Bongaigaon', lat: 26.4816, lng: 90.5594 },
    { name: 'Karimganj', lat: 24.8649, lng: 92.3592 },
    { name: 'Dhubri', lat: 26.0207, lng: 89.9742 },
    { name: 'Diphu', lat: 25.8457, lng: 93.4300 }
  ],

  'Bihar': [
    { name: 'Patna', lat: 25.5941, lng: 85.1376, isCapital: true },
    { name: 'Gaya', lat: 24.7955, lng: 85.0002 },
    { name: 'Bhagalpur', lat: 25.2425, lng: 86.9842 },
    { name: 'Muzaffarpur', lat: 26.1209, lng: 85.3647 },
    { name: 'Purnia', lat: 25.7771, lng: 87.4753 },
    { name: 'Darbhanga', lat: 26.1542, lng: 85.8918 },
    { name: 'Bihar Sharif', lat: 25.1982, lng: 85.5149 },
    { name: 'Arrah (Bhojpur)', lat: 25.5560, lng: 84.6603 },
    { name: 'Begusarai', lat: 25.4182, lng: 86.1272 },
    { name: 'Katihar', lat: 25.5394, lng: 87.5709 },
    { name: 'Munger', lat: 25.3757, lng: 86.4744 },
    { name: 'Chhapra', lat: 25.7796, lng: 84.7499 },
    { name: 'Samastipur', lat: 25.8628, lng: 85.7811 },
    { name: 'Sasaram', lat: 24.9528, lng: 84.0315 },
    { name: 'Motihari', lat: 26.6470, lng: 84.9089 },
    { name: 'Bodh Gaya', lat: 24.6961, lng: 84.9869 },
    { name: 'Rajgir', lat: 25.0300, lng: 85.4200 },
    { name: 'Nalanda', lat: 25.1357, lng: 85.4438 }
  ],

  'Chhattisgarh': [
    { name: 'Raipur', lat: 21.2514, lng: 81.6296, isCapital: true },
    { name: 'Nava Raipur (Atal Nagar)', lat: 21.1611, lng: 81.7865 },
    { name: 'Bhilai', lat: 21.1938, lng: 81.3509 },
    { name: 'Durg', lat: 21.1904, lng: 81.2849 },
    { name: 'Bilaspur', lat: 22.0797, lng: 82.1409 },
    { name: 'Korba', lat: 22.3595, lng: 82.7501 },
    { name: 'Rajnandgaon', lat: 21.0974, lng: 81.0332 },
    { name: 'Jagdalpur (Bastar)', lat: 19.0740, lng: 82.0080 },
    { name: 'Raigarh', lat: 21.8974, lng: 83.3950 },
    { name: 'Ambikapur (Surguja)', lat: 23.1200, lng: 83.1900 },
    { name: 'Dhamtari', lat: 20.7071, lng: 81.5498 }
  ],

  'Goa': [
    { name: 'Panaji', lat: 15.4909, lng: 73.8278, isCapital: true },
    { name: 'Margao', lat: 15.2832, lng: 73.9862 },
    { name: 'Vasco da Gama', lat: 15.3959, lng: 73.8153 },
    { name: 'Mapusa', lat: 15.5937, lng: 73.8142 },
    { name: 'Ponda', lat: 15.4026, lng: 74.0150 },
    { name: 'Calangute', lat: 15.5439, lng: 73.7553 },
    { name: 'Candolim', lat: 15.5178, lng: 73.7667 },
    { name: 'Bicholim', lat: 15.5944, lng: 73.9531 },
    { name: 'Curchorem', lat: 15.2597, lng: 74.1092 }
  ],

  'Gujarat': [
    { name: 'Gandhinagar', lat: 23.2156, lng: 72.6369, isCapital: true },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Surat', lat: 21.1702, lng: 72.8311 },
    { name: 'Vadodara', lat: 22.3072, lng: 73.1812 },
    { name: 'Rajkot', lat: 22.3039, lng: 70.8022 },
    { name: 'Bhavnagar', lat: 21.7645, lng: 72.1519 },
    { name: 'Jamnagar', lat: 22.4707, lng: 70.0577 },
    { name: 'Junagadh', lat: 21.5222, lng: 70.4579 },
    { name: 'Anand', lat: 22.5645, lng: 72.9289 },
    { name: 'Navsari', lat: 20.9500, lng: 72.9300 },
    { name: 'Morbi', lat: 22.8120, lng: 70.8380 },
    { name: 'Bharuch', lat: 21.7051, lng: 72.9959 },
    { name: 'Porbandar', lat: 21.6417, lng: 69.6293 },
    { name: 'Mehsana', lat: 23.5880, lng: 72.3693 },
    { name: 'Bhuj (Kutch)', lat: 23.2420, lng: 69.6669 },
    { name: 'Valsad', lat: 20.6100, lng: 72.9300 },
    { name: 'Vapi', lat: 20.3700, lng: 72.9100 },
    { name: 'Somnath (Veraval)', lat: 20.8880, lng: 70.4012 },
    { name: 'Dwarka', lat: 22.2442, lng: 68.9685 },
    { name: 'Statue of Unity (Kevadia)', lat: 21.8380, lng: 73.7191 }
  ],

  'Haryana': [
    { name: 'Chandigarh (Capital Region)', lat: 30.7333, lng: 76.7794, isCapital: true },
    { name: 'Gurugram (Gurgaon)', lat: 28.4595, lng: 77.0266 },
    { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
    { name: 'Panipat', lat: 29.3909, lng: 76.9635 },
    { name: 'Ambala', lat: 30.3782, lng: 76.7767 },
    { name: 'Yamunanagar', lat: 30.1290, lng: 77.2674 },
    { name: 'Rohtak', lat: 28.8955, lng: 76.6066 },
    { name: 'Hisar', lat: 29.1492, lng: 75.7217 },
    { name: 'Karnal', lat: 29.6857, lng: 76.9905 },
    { name: 'Sonipat', lat: 28.9931, lng: 77.0151 },
    { name: 'Panchkula', lat: 30.6942, lng: 76.8606 },
    { name: 'Bhiwani', lat: 28.7830, lng: 76.1390 },
    { name: 'Sirsa', lat: 29.5349, lng: 75.0290 },
    { name: 'Bahadurgarh', lat: 28.6925, lng: 76.9240 },
    { name: 'Rewari', lat: 28.1830, lng: 76.6170 },
    { name: 'Kurukshetra', lat: 29.9695, lng: 76.8783 }
  ],

  'Himachal Pradesh': [
    { name: 'Shimla', lat: 31.1048, lng: 77.1734, isCapital: true },
    { name: 'Dharamshala', lat: 32.2190, lng: 76.3234 },
    { name: 'Manali', lat: 32.2432, lng: 77.1892 },
    { name: 'Solan', lat: 30.9045, lng: 77.0967 },
    { name: 'Mandi', lat: 31.7087, lng: 76.9320 },
    { name: 'Kullu', lat: 31.9579, lng: 77.1095 },
    { name: 'Baddi', lat: 30.9578, lng: 76.7914 },
    { name: 'Hamirpur', lat: 31.6862, lng: 76.5213 },
    { name: 'Una', lat: 31.4685, lng: 76.2708 },
    { name: 'Bilaspur (HP)', lat: 31.3400, lng: 76.7600 },
    { name: 'Chamba', lat: 32.5534, lng: 76.1258 },
    { name: 'Dalhousie', lat: 32.5387, lng: 75.9710 },
    { name: 'Palampur', lat: 32.1109, lng: 76.5363 }
  ],

  'Jharkhand': [
    { name: 'Ranchi', lat: 23.3441, lng: 85.3096, isCapital: true },
    { name: 'Jamshedpur', lat: 22.8046, lng: 86.2029 },
    { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
    { name: 'Bokaro Steel City', lat: 23.6693, lng: 86.1511 },
    { name: 'Deoghar', lat: 24.4826, lng: 86.7001 },
    { name: 'Hazaribagh', lat: 23.9961, lng: 85.3644 },
    { name: 'Giridih', lat: 24.1860, lng: 86.3090 },
    { name: 'Ramgarh', lat: 23.6300, lng: 85.5100 },
    { name: 'Medininagar (Daltonganj)', lat: 24.0400, lng: 84.0700 },
    { name: 'Chaibasa', lat: 22.5500, lng: 85.8100 }
  ],

  'Karnataka': [
    { name: 'Bengaluru (Bangalore)', lat: 12.9716, lng: 77.5946, isCapital: true },
    { name: 'Mysuru (Mysore)', lat: 12.2958, lng: 76.6394 },
    { name: 'Hubballi - Dharwad', lat: 15.3647, lng: 75.1240 },
    { name: 'Mangaluru (Mangalore)', lat: 12.9141, lng: 74.8560 },
    { name: 'Belagavi (Belgaum)', lat: 15.8497, lng: 74.4977 },
    { name: 'Kalaburagi (Gulbarga)', lat: 17.3297, lng: 76.8343 },
    { name: 'Davanagere', lat: 14.4644, lng: 75.9218 },
    { name: 'Ballari (Bellary)', lat: 15.1394, lng: 76.9214 },
    { name: 'Vijayapura (Bijapur)', lat: 16.8302, lng: 75.7100 },
    { name: 'Shivamogga (Shimoga)', lat: 13.9299, lng: 75.5681 },
    { name: 'Tumakuru (Tumkur)', lat: 13.3379, lng: 77.1173 },
    { name: 'Raichur', lat: 16.2076, lng: 77.3463 },
    { name: 'Bidar', lat: 17.9104, lng: 77.5199 },
    { name: 'Hosapete (Hospet / Hampi)', lat: 15.2700, lng: 76.3900 },
    { name: 'Hassan', lat: 13.0072, lng: 76.1030 },
    { name: 'Udupi - Manipal', lat: 13.3409, lng: 74.7421 },
    { name: 'Chikkamagaluru', lat: 13.3161, lng: 75.7720 },
    { name: 'Mandya', lat: 12.5200, lng: 76.9000 },
    { name: 'Madikeri (Coorg)', lat: 12.4244, lng: 75.7382 }
  ],

  'Kerala': [
    { name: 'Thiruvananthapuram (Trivandrum)', lat: 8.5241, lng: 76.9366, isCapital: true },
    { name: 'Kochi (Cochin)', lat: 9.9312, lng: 76.2673 },
    { name: 'Kozhikode (Calicut)', lat: 11.2588, lng: 75.7804 },
    { name: 'Kollam (Quilon)', lat: 8.8932, lng: 76.6141 },
    { name: 'Thrissur', lat: 10.5276, lng: 76.2144 },
    { name: 'Kannur', lat: 11.8745, lng: 75.3704 },
    { name: 'Alappuzha (Alleppey)', lat: 9.4981, lng: 76.3388 },
    { name: 'Kottayam', lat: 9.5916, lng: 76.5222 },
    { name: 'Palakkad', lat: 10.7867, lng: 76.6548 },
    { name: 'Malappuram', lat: 11.0732, lng: 76.0740 },
    { name: 'Kasaragod', lat: 12.5102, lng: 74.9852 },
    { name: 'Pathanamthitta', lat: 9.2648, lng: 76.7870 },
    { name: 'Munnar', lat: 10.0889, lng: 77.0595 },
    { name: 'Wayanad (Kalpetta)', lat: 11.6050, lng: 76.0830 }
  ],

  'Madhya Pradesh': [
    { name: 'Bhopal', lat: 23.2599, lng: 77.4126, isCapital: true },
    { name: 'Indore', lat: 22.7196, lng: 75.8577 },
    { name: 'Jabalpur', lat: 23.1815, lng: 79.9864 },
    { name: 'Gwalior', lat: 26.2183, lng: 78.1828 },
    { name: 'Ujjain', lat: 23.1765, lng: 75.7885 },
    { name: 'Sagar', lat: 23.8388, lng: 78.7378 },
    { name: 'Dewas', lat: 22.9676, lng: 76.0534 },
    { name: 'Satna', lat: 24.5800, lng: 80.8300 },
    { name: 'Ratlam', lat: 23.3315, lng: 75.0367 },
    { name: 'Rewa', lat: 24.5362, lng: 81.3037 },
    { name: 'Katni', lat: 23.8343, lng: 80.3957 },
    { name: 'Singrauli', lat: 24.1997, lng: 82.6645 },
    { name: 'Chhindwara', lat: 22.0574, lng: 78.9382 },
    { name: 'Morena', lat: 26.4950, lng: 77.9940 },
    { name: 'Bhind', lat: 26.5650, lng: 78.7880 },
    { name: 'Shivpuri', lat: 25.4310, lng: 77.6590 },
    { name: 'Vidisha', lat: 23.5251, lng: 77.8081 },
    { name: 'Khajuraho', lat: 24.8318, lng: 79.9199 },
    { name: 'Hoshangabad (Narmadapuram)', lat: 22.7500, lng: 77.7200 }
  ],

  'Maharashtra': [
    { name: 'Mumbai', lat: 18.9256, lng: 72.8242, isCapital: true },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
    { name: 'Thane', lat: 19.2183, lng: 72.9781 },
    { name: 'Pimpri-Chinchwad', lat: 18.6298, lng: 73.7997 },
    { name: 'Nashik', lat: 19.9975, lng: 73.7898 },
    { name: 'Kalyan - Dombivli', lat: 19.2403, lng: 73.1305 },
    { name: 'Vasai - Virar', lat: 19.3919, lng: 72.8397 },
    { name: 'Chhatrapati Sambhajinagar (Aurangabad)', lat: 19.8762, lng: 75.3433 },
    { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297 },
    { name: 'Solapur', lat: 17.6599, lng: 75.9064 },
    { name: 'Mira - Bhayandar', lat: 19.2812, lng: 72.8561 },
    { name: 'Bhiwandi', lat: 19.2813, lng: 73.0483 },
    { name: 'Amravati', lat: 20.9320, lng: 77.7523 },
    { name: 'Nanded', lat: 19.1383, lng: 77.3210 },
    { name: 'Kolhapur', lat: 16.7050, lng: 74.2433 },
    { name: 'Ulhasnagar', lat: 19.2215, lng: 73.1645 },
    { name: 'Sangli - Miraj', lat: 16.8524, lng: 74.5815 },
    { name: 'Malegaon', lat: 20.5535, lng: 74.5288 },
    { name: 'Jalgaon', lat: 21.0077, lng: 75.5626 },
    { name: 'Akola', lat: 20.7002, lng: 77.0082 },
    { name: 'Latur', lat: 18.4088, lng: 76.5604 },
    { name: 'Dhule', lat: 20.9042, lng: 74.7749 },
    { name: 'Ahmednagar', lat: 19.0948, lng: 74.7480 },
    { name: 'Chandrapur', lat: 19.9615, lng: 79.2961 },
    { name: 'Parbhani', lat: 19.2608, lng: 76.7748 },
    { name: 'Satara', lat: 17.6805, lng: 73.9934 },
    { name: 'Ratnagiri', lat: 16.9902, lng: 73.3120 },
    { name: 'Shirdi', lat: 19.7645, lng: 74.4762 },
    { name: 'Lonavala', lat: 18.7546, lng: 73.4062 }
  ],

  'Manipur': [
    { name: 'Imphal', lat: 24.8170, lng: 93.9368, isCapital: true },
    { name: 'Thoubal', lat: 24.6300, lng: 94.0100 },
    { name: 'Bishnupur', lat: 24.6300, lng: 93.7600 },
    { name: 'Churachandpur', lat: 24.3300, lng: 93.6700 },
    { name: 'Ukhrul', lat: 25.1100, lng: 94.3600 },
    { name: 'Senapati', lat: 25.2600, lng: 94.0200 }
  ],

  'Meghalaya': [
    { name: 'Shillong', lat: 25.5788, lng: 91.8933, isCapital: true },
    { name: 'Tura', lat: 25.5140, lng: 90.2200 },
    { name: 'Jowai', lat: 25.4500, lng: 92.2000 },
    { name: 'Nongpoh', lat: 25.9000, lng: 91.8800 },
    { name: 'Cherrapunji (Sohra)', lat: 25.2700, lng: 91.7300 },
    { name: 'Baghmara', lat: 25.1900, lng: 90.6300 }
  ],

  'Mizoram': [
    { name: 'Aizawl', lat: 23.7307, lng: 92.7173, isCapital: true },
    { name: 'Lunglei', lat: 22.8800, lng: 92.7300 },
    { name: 'Champhai', lat: 23.4700, lng: 93.3300 },
    { name: 'Serchhip', lat: 23.3000, lng: 92.8300 },
    { name: 'Kolasib', lat: 24.2300, lng: 92.6800 }
  ],

  'Nagaland': [
    { name: 'Kohima', lat: 25.6751, lng: 94.1086, isCapital: true },
    { name: 'Dimapur', lat: 25.9090, lng: 93.7270 },
    { name: 'Mokokchung', lat: 26.3200, lng: 94.5200 },
    { name: 'Tuensang', lat: 26.2800, lng: 94.8300 },
    { name: 'Wokha', lat: 26.1000, lng: 94.2600 },
    { name: 'Zunheboto', lat: 25.9700, lng: 94.5200 }
  ],

  'Odisha': [
    { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, isCapital: true },
    { name: 'Cuttack', lat: 20.4625, lng: 85.8828 },
    { name: 'Rourkela', lat: 22.2604, lng: 84.8536 },
    { name: 'Berhampur', lat: 19.3149, lng: 84.7941 },
    { name: 'Sambalpur', lat: 21.4669, lng: 83.9812 },
    { name: 'Puri', lat: 19.8135, lng: 85.8312 },
    { name: 'Balasore', lat: 21.4934, lng: 86.9135 },
    { name: 'Bhadrak', lat: 21.0574, lng: 86.4950 },
    { name: 'Baripada', lat: 21.9340, lng: 86.7330 },
    { name: 'Jharsuguda', lat: 21.8550, lng: 84.0090 },
    { name: 'Angul', lat: 20.8400, lng: 85.1000 },
    { name: 'Konark', lat: 19.8876, lng: 86.0945 },
    { name: 'Paradip', lat: 20.3160, lng: 86.6110 }
  ],

  'Punjab': [
    { name: 'Chandigarh (Capital Territory)', lat: 30.7333, lng: 76.7794, isCapital: true },
    { name: 'Ludhiana', lat: 30.9010, lng: 75.8573 },
    { name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
    { name: 'Jalandhar', lat: 31.3260, lng: 75.5762 },
    { name: 'Patiala', lat: 30.3398, lng: 76.3869 },
    { name: 'Bathinda', lat: 30.2110, lng: 74.9455 },
    { name: 'SAS Nagar (Mohali)', lat: 30.7046, lng: 76.7179 },
    { name: 'Hoshiarpur', lat: 31.5273, lng: 75.9149 },
    { name: 'Batala', lat: 31.8186, lng: 75.2028 },
    { name: 'Pathankot', lat: 32.2684, lng: 75.6529 },
    { name: 'Moga', lat: 30.8230, lng: 75.1730 },
    { name: 'Abohar', lat: 30.1453, lng: 74.1994 },
    { name: 'Malerkotla', lat: 30.5250, lng: 75.8840 },
    { name: 'Khanna', lat: 30.7071, lng: 76.2166 },
    { name: 'Phagwara', lat: 31.2240, lng: 75.7708 },
    { name: 'Firozpur', lat: 30.9237, lng: 74.6065 }
  ],

  'Rajasthan': [
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, isCapital: true },
    { name: 'Jodhpur', lat: 26.2968, lng: 73.0351 },
    { name: 'Kota', lat: 25.1825, lng: 75.8398 },
    { name: 'Bikaner', lat: 28.0229, lng: 73.3119 },
    { name: 'Ajmer', lat: 26.4499, lng: 74.6399 },
    { name: 'Udaipur', lat: 24.5854, lng: 73.7125 },
    { name: 'Bhilwara', lat: 25.3407, lng: 74.6313 },
    { name: 'Alwar', lat: 27.5530, lng: 76.6346 },
    { name: 'Bharatpur', lat: 27.2152, lng: 77.5030 },
    { name: 'Sikar', lat: 27.6094, lng: 75.1398 },
    { name: 'Pali', lat: 25.7711, lng: 73.3234 },
    { name: 'Sri Ganganagar', lat: 29.9038, lng: 73.8772 },
    { name: 'Chittorgarh', lat: 24.8887, lng: 74.6269 },
    { name: 'Hanumangarh', lat: 29.5817, lng: 74.3294 },
    { name: 'Beawar', lat: 26.1011, lng: 74.3214 },
    { name: 'Kishangarh', lat: 26.5746, lng: 74.8653 },
    { name: 'Jhunjhunu', lat: 28.1289, lng: 75.3995 },
    { name: 'Churu', lat: 28.2900, lng: 74.9600 },
    { name: 'Tonk', lat: 26.1600, lng: 75.7900 },
    { name: 'Barmer', lat: 25.7500, lng: 71.3900 },
    { name: 'Jaisalmer', lat: 26.9157, lng: 70.9083 },
    { name: 'Mount Abu', lat: 24.5926, lng: 72.7156 },
    { name: 'Pushkar', lat: 26.4897, lng: 74.5511 },
    { name: 'Sawai Madhopur', lat: 25.9928, lng: 76.3533 },
    { name: 'Nagaur', lat: 27.2000, lng: 73.7400 },
    { name: 'Dausa', lat: 26.8900, lng: 76.3300 }
  ],

  'Sikkim': [
    { name: 'Gangtok', lat: 27.3389, lng: 88.6065, isCapital: true },
    { name: 'Namchi', lat: 27.1700, lng: 88.3500 },
    { name: 'Geyzing (Pelling)', lat: 27.2800, lng: 88.2400 },
    { name: 'Mangan', lat: 27.5100, lng: 88.5300 },
    { name: 'Ravangla', lat: 27.3100, lng: 88.3600 }
  ],

  'Tamil Nadu': [
    { name: 'Chennai', lat: 13.0827, lng: 80.2707, isCapital: true },
    { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
    { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
    { name: 'Tiruchirappalli (Trichy)', lat: 10.7905, lng: 78.7047 },
    { name: 'Salem', lat: 11.6643, lng: 78.1460 },
    { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567 },
    { name: 'Tiruppur', lat: 11.1085, lng: 77.3411 },
    { name: 'Erode', lat: 11.3410, lng: 77.7172 },
    { name: 'Vellore', lat: 12.9165, lng: 79.1325 },
    { name: 'Thoothukudi (Tuticorin)', lat: 8.7642, lng: 78.1348 },
    { name: 'Dindigul', lat: 10.3673, lng: 77.9803 },
    { name: 'Thanjavur', lat: 10.7870, lng: 79.1378 },
    { name: 'Ranipet', lat: 12.9270, lng: 79.3330 },
    { name: 'Sivakasi', lat: 9.4533, lng: 77.7977 },
    { name: 'Karur', lat: 10.9601, lng: 78.0766 },
    { name: 'Hosur', lat: 12.7409, lng: 77.8253 },
    { name: 'Nagercoil', lat: 8.1833, lng: 77.4119 },
    { name: 'Kanchipuram', lat: 12.8342, lng: 79.7036 },
    { name: 'Ooty (Udhagamandalam)', lat: 11.4102, lng: 76.6950 },
    { name: 'Kanyakumari', lat: 8.0883, lng: 77.5385 },
    { name: 'Rameswaram', lat: 9.2876, lng: 79.3129 }
  ],

  'Telangana': [
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, isCapital: true },
    { name: 'Warangal', lat: 17.9689, lng: 79.5941 },
    { name: 'Nizamabad', lat: 18.6725, lng: 78.0941 },
    { name: 'Khammam', lat: 17.2473, lng: 80.1514 },
    { name: 'Karimnagar', lat: 18.4386, lng: 79.1288 },
    { name: 'Ramagundam', lat: 18.7551, lng: 79.5134 },
    { name: 'Mahbubnagar', lat: 16.7488, lng: 77.9940 },
    { name: 'Nalgonda', lat: 17.0500, lng: 79.2700 },
    { name: 'Adilabad', lat: 19.6640, lng: 78.5320 },
    { name: 'Suryapet', lat: 17.1400, lng: 79.6200 },
    { name: 'Miryalaguda', lat: 16.8700, lng: 79.5600 },
    { name: 'Siddipet', lat: 18.1000, lng: 78.8500 }
  ],

  'Tripura': [
    { name: 'Agartala', lat: 23.8315, lng: 91.2868, isCapital: true },
    { name: 'Dharmanagar', lat: 24.3700, lng: 92.1700 },
    { name: 'Udaipur (Tripura)', lat: 23.5300, lng: 91.4800 },
    { name: 'Kailashahar', lat: 24.3300, lng: 92.0000 },
    { name: 'Belonia', lat: 23.2500, lng: 91.4500 }
  ],

  'Uttar Pradesh': [
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462, isCapital: true },
    { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
    { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538 },
    { name: 'Agra', lat: 27.1767, lng: 78.0081 },
    { name: 'Meerut', lat: 28.9845, lng: 77.7064 },
    { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
    { name: 'Prayagraj (Allahabad)', lat: 25.4358, lng: 81.8463 },
    { name: 'Bareilly', lat: 28.3670, lng: 79.4304 },
    { name: 'Aligarh', lat: 27.8974, lng: 78.0880 },
    { name: 'Moradabad', lat: 28.8350, lng: 78.7747 },
    { name: 'Saharanpur', lat: 29.9679, lng: 77.5510 },
    { name: 'Gorakhpur', lat: 26.7606, lng: 83.3732 },
    { name: 'Noida', lat: 28.5355, lng: 77.3910 },
    { name: 'Greater Noida', lat: 28.4744, lng: 77.5040 },
    { name: 'Firozabad', lat: 27.1591, lng: 78.3957 },
    { name: 'Jhansi', lat: 25.4484, lng: 78.5685 },
    { name: 'Muzaffarnagar', lat: 29.4727, lng: 77.7085 },
    { name: 'Mathura', lat: 27.4924, lng: 77.6737 },
    { name: 'Ayodhya', lat: 26.7922, lng: 82.1998 },
    { name: 'Rampur', lat: 28.8154, lng: 79.0250 },
    { name: 'Shahjahanpur', lat: 27.8814, lng: 79.9100 },
    { name: 'Farrukhabad', lat: 27.3826, lng: 79.5807 },
    { name: 'Mirzapur', lat: 25.1337, lng: 82.5644 },
    { name: 'Bulandshahr', lat: 28.4069, lng: 77.8498 },
    { name: 'Vrindavan', lat: 27.5806, lng: 77.7006 }
  ],

  'Uttarakhand': [
    { name: 'Dehradun', lat: 30.3165, lng: 78.0322, isCapital: true },
    { name: 'Haridwar', lat: 29.9457, lng: 78.1642 },
    { name: 'Roorkee', lat: 29.8543, lng: 77.8880 },
    { name: 'Haldwani', lat: 29.2183, lng: 79.5130 },
    { name: 'Rudrapur', lat: 28.9800, lng: 79.4000 },
    { name: 'Kashipur', lat: 29.2100, lng: 78.9500 },
    { name: 'Rishikesh', lat: 30.0869, lng: 78.2676 },
    { name: 'Nainital', lat: 29.3919, lng: 79.4542 },
    { name: 'Mussoorie', lat: 30.4598, lng: 78.0644 },
    { name: 'Almora', lat: 29.5971, lng: 79.6591 },
    { name: 'Pithoragarh', lat: 29.5800, lng: 80.2100 },
    { name: 'Ramnagar (Corbett)', lat: 29.3900, lng: 79.1200 }
  ],

  'West Bengal': [
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, isCapital: true },
    { name: 'Howrah', lat: 22.5958, lng: 88.2636 },
    { name: 'Siliguri', lat: 26.7271, lng: 88.3953 },
    { name: 'Asansol', lat: 23.6739, lng: 86.9524 },
    { name: 'Durgapur', lat: 23.5204, lng: 87.3119 },
    { name: 'Bardhaman (Burdwan)', lat: 23.2324, lng: 87.8615 },
    { name: 'Malda', lat: 25.0108, lng: 88.1411 },
    { name: 'Baharampur', lat: 24.1000, lng: 88.2500 },
    { name: 'Habra', lat: 22.8300, lng: 88.6300 },
    { name: 'Kharagpur', lat: 22.3400, lng: 87.3200 },
    { name: 'Shantipur', lat: 23.2500, lng: 88.4300 },
    { name: 'Darjeeling', lat: 27.0410, lng: 88.2663 },
    { name: 'Haldia', lat: 22.0667, lng: 88.0698 },
    { name: 'Kalimpong', lat: 27.0600, lng: 88.4700 },
    { name: 'Digha', lat: 21.6266, lng: 87.5074 }
  ],

  // =================== 8 UNION TERRITORIES ===================
  'Delhi-NCR': [
    { name: 'New Delhi (Connaught Place)', lat: 28.6315, lng: 77.2167, isCapital: true },
    { name: 'Gurugram (Cyber City)', lat: 28.4950, lng: 77.0895 },
    { name: 'Noida (Sector 18 & 62)', lat: 28.5700, lng: 77.3200 },
    { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
    { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538 },
    { name: 'Greater Noida', lat: 28.4744, lng: 77.5040 },
    { name: 'Dwarka', lat: 28.5800, lng: 77.0500 },
    { name: 'Rohini', lat: 28.7100, lng: 77.1100 },
    { name: 'Saket (South Delhi)', lat: 28.5200, lng: 77.2100 },
    { name: 'IGI Airport (T3)', lat: 28.5562, lng: 77.1000 }
  ],

  'Chandigarh': [
    { name: 'Chandigarh (Sector 17)', lat: 30.7333, lng: 76.7794, isCapital: true },
    { name: 'Chandigarh IT Park', lat: 30.7250, lng: 76.8450 },
    { name: 'Sukhna Lake', lat: 30.7421, lng: 76.8188 },
    { name: 'Manimajra', lat: 30.7100, lng: 76.8400 }
  ],

  'Jammu and Kashmir': [
    { name: 'Srinagar', lat: 34.0837, lng: 74.7973, isCapital: true },
    { name: 'Jammu', lat: 32.7266, lng: 74.8570, isCapital: true },
    { name: 'Anantnag', lat: 33.7311, lng: 75.1522 },
    { name: 'Baramulla', lat: 34.2000, lng: 74.3400 },
    { name: 'Udhampur', lat: 32.9300, lng: 75.1400 },
    { name: 'Katra (Vaishno Devi)', lat: 32.9900, lng: 74.9300 },
    { name: 'Gulmarg', lat: 34.0484, lng: 74.3805 },
    { name: 'Pahalgam', lat: 34.0100, lng: 75.1900 },
    { name: 'Pulwama', lat: 33.8700, lng: 74.8900 }
  ],

  'Ladakh': [
    { name: 'Leh', lat: 34.1526, lng: 77.5771, isCapital: true },
    { name: 'Kargil', lat: 34.5539, lng: 76.1349 },
    { name: 'Nubra Valley (Diskit)', lat: 34.5428, lng: 77.5620 },
    { name: 'Pangong Tso', lat: 33.7595, lng: 78.6674 }
  ],

  'Puducherry': [
    { name: 'Puducherry (Pondicherry Town)', lat: 11.9416, lng: 79.8083, isCapital: true },
    { name: 'Auroville', lat: 12.0069, lng: 79.8106 },
    { name: 'Karaikal', lat: 10.9254, lng: 79.8380 },
    { name: 'Mahe', lat: 11.7000, lng: 75.5300 },
    { name: 'Yanam', lat: 16.7300, lng: 82.2100 }
  ],

  'Andaman and Nicobar Islands': [
    { name: 'Port Blair', lat: 11.6234, lng: 92.7265, isCapital: true },
    { name: 'Havelock Island (Swaraj Dweep)', lat: 11.9761, lng: 92.9876 },
    { name: 'Neil Island (Shaheed Dweep)', lat: 11.8323, lng: 93.0506 }
  ],

  'Dadra and Nagar Haveli and Daman and Diu': [
    { name: 'Daman', lat: 20.4283, lng: 72.8397, isCapital: true },
    { name: 'Diu', lat: 20.7144, lng: 70.9874 },
    { name: 'Silvassa', lat: 20.2763, lng: 73.0083 }
  ],

  'Lakshadweep': [
    { name: 'Kavaratti', lat: 10.5669, lng: 72.6420, isCapital: true },
    { name: 'Agatti', lat: 10.8533, lng: 72.1931 }
  ]
};

// Flattened list with state metadata for instant search
export const ALL_INDIAN_CITIES_FLAT = Object.entries(CITIES_BY_STATE).flatMap(([state, cities]) =>
  cities.map(c => ({
    id: `city-${state.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${c.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name: c.name,
    state,
    lat: c.lat,
    lng: c.lng,
    isCapital: Boolean(c.isCapital),
    category: c.isCapital ? 'Capital City' : 'Major City / District Hub',
    displayName: `${c.name}, ${state}`
  }))
);

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

