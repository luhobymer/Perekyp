import { CarBrandsData, SortedCarBrandsData } from '../types/data/carBrands';

// Спочатку створюємо об'єкт з усіма брендами
const unsortedBrands: CarBrandsData = {
  'Audi': [
    'A3', 'A4', 'A6', 'A8', 'Q2', 'Q3', 'Q5',
    'Q7', 'Q8', 'e-tron', 'RS6', 'RS7'
  ],
  'BMW': [
    '3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5',
    'X7', 'M3', 'M5', 'i3', 'i4', 'iX'
  ],
  'BYD': [
    'F3', 'F6', 'S6', 'G6', 'Qin', 'Tang', 'Han', 'Song', 'Yuan', 'e6'
  ],
  'Chery': [
    'Amulet', 'Tiggo', 'Tiggo 2', 'Tiggo 3', 'Tiggo 4', 'Tiggo 5', 'Tiggo 7', 
    'Tiggo 8', 'QQ', 'Kimo', 'Arrizo', 'Fora', 'CrossEastar', 'Eastar', 'Elara'
  ],
  'Changan': [
    'CS35', 'CS55', 'CS75', 'CS85', 'CS95', 'Eado', 'Alsvin', 'UNI-T', 'UNI-K'
  ],
  'Chevrolet': [
    'Cruze', 'Malibu', 'Trax', 'Equinox', 'Trailblazer', 'Tahoe',
    'Suburban', 'Silverado', 'Camaro', 'Corvette', 'Aveo', 'Lacetti',
    'Lanos', 'Epica', 'Captiva', 'Orlando', 'Niva', 'Spark'
  ],
  'Citroen': [
    'C3', 'C4', 'C5', 'Berlingo', 'C4 Cactus', 'C4 Picasso',
    'C5 Aircross', 'Jumpy', 'Jumper', 'Spacetourer'
  ],
  'Dacia': [
    'Logan', 'Sandero', 'Duster', 'Lodgy', 'Dokker', 'Spring'
  ],
  'Daewoo': [
    'Lanos', 'Sens', 'Matiz', 'Nexia', 'Gentra', 'Nubira', 'Leganza',
    'Espero', 'Tacuma', 'Kalos', 'Magnus', 'Rezzo', 'Evanda'
  ],
  'Fiat': [
    'Punto', '500', 'Panda', 'Tipo', 'Linea', 'Doblo', 'Ducato',
    'Scudo', 'Qubo', 'Fiorino', 'Multipla', 'Bravo', 'Albea'
  ],
  'FAW': [
    'Besturn B30', 'Besturn B50', 'Besturn X80', 'Besturn B70', 'V2', 'V5', 'Oley'
  ],
  'Ford': [
    'Focus', 'Fiesta', 'Mondeo', 'Kuga', 'Explorer', 'Edge',
    'Mustang', 'Ranger', 'F-150', 'Transit', 'Tourneo'
  ],
  'Geely': [
    'CK', 'MK', 'MK Cross', 'SC7', 'EC7', 'FC', 'GC6', 'SC5', 'SC7', 'Vision',
    'Emgrand 7', 'Emgrand X7', 'Emgrand EC7', 'Emgrand EC8', 
    'Atlas', 'Coolray', 'Tugella', 'Geometry C', 'Icon', 'Monjaro', 'Azkarra',
    'Boyue', 'Binrui', 'Binyue', 'Xingyue'
  ],
  'Great Wall': [
    'Hover', 'Haval H6', 'Haval H9', 'Haval Jolion', 'Wingle', 'Safe',
    'Deer', 'Voleex C10', 'Voleex C30', 'Pegasus'
  ],
  'Honda': [
    'Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Fit',
    'Jazz', 'City', 'Odyssey', 'Stepwgn', 'Freed'
  ],
  'Hyundai': [
    'Tucson', 'Santa Fe', 'Kona', 'Palisade', 'i30', 'i40',
    'Elantra', 'Sonata', 'Accent', 'Getz', 'Matrix'
  ],
  'Infiniti': [
    'Q50', 'Q60', 'Q70', 'QX50', 'QX60', 'QX70', 'QX80',
    'FX', 'G', 'M', 'EX', 'JX'
  ],
  'JAC': [
    'S2', 'S3', 'S5', 'S7', 'J3', 'J5', 'J7', 'iEV7S', 'iEVA50'
  ],
  'Jaguar': [
    'XE', 'XF', 'XJ', 'F-TYPE', 'E-PACE', 'F-PACE', 'I-PACE', 'XK'
  ],
  'Jeep': [
    'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Wrangler',
    'Gladiator', 'Commander', 'Liberty'
  ],
  'Kia': [
    'Sportage', 'Sorento', 'Soul', 'Rio', 'Ceed', 'Optima',
    'Stinger', 'Carnival', 'Picanto', 'Cerato'
  ],
  'Lada': [
    // Класична серія
    '2101', '2102', '2103', '2104', '2105', '2106', '2107', 
    // Самара
    '2108', '2109', '21099', 
    // Десятка
    '2110', '2111', '2112', '2113', '2114', '2115', 
    // Нова лінійка
    'Vesta', 'Vesta SW', 'Vesta Cross', 'Vesta Sport',
    'Granta', 'Granta Liftback', 'Granta Cross',
    'XRAY', 'XRAY Cross',
    'Kalina', 'Kalina Cross', 'Kalina Sport', 'Kalina NFR',
    'Priora', 'Priora Coupe', 'Priora Універсал',
    'Largus', 'Largus Cross', 'Largus Фургон',
    // Позашляховики
    'Niva', 'Niva Travel', 'Niva Legend', '4x4', '4x4 Urban', 'Нива'
  ],
  'Land Rover': [
    'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque',
    'Discovery', 'Discovery Sport', 'Defender', 'Freelander'
  ],
  'Lexus': [
    'RX', 'NX', 'UX', 'GX', 'LX', 'ES', 'LS', 'IS', 'RC', 'LC'
  ],
  'Lifan': [
    'X60', 'X50', 'Solano', 'Smily', 'Breez', 'Cebrium', 'Murman', 'Myway', '520', '620'
  ],
  'Mazda': [
    '3', '6', 'CX-3', 'CX-5', 'CX-9', 'MX-5',
    'CX-30', 'BT-50', '2', '5', 'MPV'
  ],
  'Mercedes-Benz': [
    'A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC',
    'GLE', 'GLS', 'AMG GT', 'EQS', 'EQE'
  ],
  'Mitsubishi': [
    'Outlander', 'Pajero', 'ASX', 'Eclipse Cross', 'L200', 'Space Star',
    'Colt', 'Lancer', 'Grandis', 'Delica'
  ],
  'Nissan': [
    'Qashqai', 'X-Trail', 'Juke', 'Murano', 'Pathfinder', 'Patrol',
    'Navara', 'Note', 'Micra', 'Almera', 'Sentra'
  ],
  'Opel': [
    'Astra', 'Corsa', 'Insignia', 'Mokka', 'Grandland X', 'Crossland X',
    'Combo', 'Vivaro', 'Movano', 'Zafira'
  ],
  'Peugeot': [
    '208', '308', '508', '2008', '3008', '5008',
    'Partner', 'Expert', 'Boxer', 'Rifter'
  ],
  'Porsche': [
    '911', 'Cayenne', 'Panamera', 'Macan', 'Taycan', '718 Cayman', '718 Boxster'
  ],
  'Renault': [
    'Megane', 'Clio', 'Captur', 'Kadjar', 'Koleos', 'Duster',
    'Logan', 'Sandero', 'Arkana', 'Talisman'
  ],
  'Seat': [
    'Ibiza', 'Leon', 'Ateca', 'Arona', 'Tarraco', 'Alhambra', 'Mii'
  ],
  'Skoda': [
    'Octavia', 'Superb', 'Kodiaq', 'Karoq', 'Fabia', 'Rapid',
    'Scala', 'Kamiq', 'Enyaq', 'Citigo'
  ],
  'SsangYong': [
    'Rexton', 'Korando', 'Kyron', 'Actyon', 'Actyon Sports', 'Rodius',
    'Stavic', 'Tivoli', 'XLV', 'Chairman', 'Musso'
  ],
  'Subaru': [
    'Forester', 'Outback', 'XV', 'Impreza', 'Legacy', 'BRZ',
    'WRX', 'Levorg', 'Tribeca', 'Justy'
  ],
  'Suzuki': [
    'Vitara', 'SX4', 'Swift', 'Ignis', 'Jimny', 'Baleno',
    'Ciaz', 'Grand Vitara', 'Splash', 'Wagon R'
  ],
  'Toyota': [
    'Corolla', 'Camry', 'RAV4', 'Highlander', 'Land Cruiser', 'Prado',
    'Hilux', 'Tacoma', 'Tundra', 'Prius', 'Yaris', 'Auris'
  ],
  'Volkswagen': [
    'Golf', 'Passat', 'Tiguan', 'Touareg', 'Polo', 'Jetta',
    'Arteon', 'T-Roc', 'T-Cross', 'ID.3', 'ID.4'
  ],
  'Volvo': [
    'S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C30', 'C70'
  ],
  'ГАЗ': [
    'Волга', 'Сайбер', 'Соболь', 'Газель', 'Газель Next', '21', '24', '3102', '3110',
    '31105', '3302', '2705', '3221', '2217', '69', '2752', '3309'
  ],
  'ЗАЗ': [
    'Таврія', 'Славута', 'Sens', 'Lanos', 'Vida', 'Forza', 'Chance',
    '965', '966', '968', '968М', '1102', '1103', '1105'
  ],
  'Москвич': [
    '412', '2140', '2141', 'Святогор', 'Юрій Долгорукий', '403', '407', '408',
    '423', '426', '427', '434', '444'
  ],
  'УАЗ': [
    '469', 'Хантер', 'Патріот', 'Пікап', 'Карго', 'Буханка', '452', '3151', '3153',
    '3162', '3163', '3159', '3303', '3741', '3909', '2206'
  ]
};

// Сортуємо об'єкт за ключами (марками автомобілів)
export const carBrands: SortedCarBrandsData = Object.keys(unsortedBrands)
  .sort()
  .reduce<SortedCarBrandsData>((sortedObj, key) => {
    sortedObj[key] = unsortedBrands[key];
    return sortedObj;
  }, {});
