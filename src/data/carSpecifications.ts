import { EngineType, BodyType, TransmissionType, CarColor } from '../types/data/carSpecifications';

/**
 * Типи двигунів
 */
export const engineTypes: EngineType[] = [
  'Бензин',
  'Дизель',
  'Гібрид',
  'Електричний',
  'Газ',
  'Газ/Бензин'
];

/**
 * Типи кузовів
 */
export const bodyTypes: BodyType[] = [
  'Седан',
  'Хетчбек',
  'Універсал',
  'Купе',
  'Кабріолет',
  'Пікап',
  'Кросовер',
  'Позашляховик',
  'Мінівен',
  'Фургон'
];

/**
 * Типи трансмісій
 */
export const transmissionTypes: TransmissionType[] = [
  'automatic',
  'manual',
  'semi_automatic',
  'variator'
];

/**
 * Кольори автомобілів
 */
export const colors: CarColor[] = [
  'Білий',
  'Чорний',
  'Сірий',
  'Сріблястий',
  'Червоний',
  'Синій',
  'Зелений',
  'Жовтий',
  'Оранжевий',
  'Коричневий',
  'Бежевий',
  'Бордовий',
  'Фіолетовий',
  'Золотий',
  'Хром'
];
