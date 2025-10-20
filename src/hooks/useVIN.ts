import { useState, useCallback } from 'react';
import axios from 'axios';
import 'axios'; // Додаємо імпорт типів axios

// Типи для VIN-декодера
export interface VINDecodedData {
  brand: string;
  model: string;
  year: string;
  bodyType: string;
  engineType: string;
  engineVolume: string;
  fuelType: string;
  transmission: string;
  driveType: string;
  color: string;
  doors: string;
  seats: string;
  vin: string;
}

export interface VINValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface VINInfo {
  wmi: string;
  vds: string;
  vis: string;
  year: number | null;
  plantCode: string;
  serialNumber: string;
}

export const useVIN = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const decodeVIN = useCallback(async (vin: string): Promise<VINDecodedData> => {
    try {
      setLoading(true);
      setError(null);

      // Перевірка формату VIN
      if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        throw new Error('Невірний формат VIN-номера');
      }

      // API ключ потрібно зберігати в .env
      const response = await axios.get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
      );

      if (response.data.Results.length === 0) {
        throw new Error('Не вдалося отримати дані про автомобіль');
      }

      // Перетворення відповіді в зручний формат
      const result = response.data.Results.reduce((acc: Record<string, string>, item: any) => {
        if (item.Value && item.Value !== 'Not Applicable') {
          acc[item.Variable] = item.Value;
        }
        return acc;
      }, {});

      return {
        brand: result.Make || '',
        model: result.Model || '',
        year: result.ModelYear || '',
        bodyType: result.BodyClass || '',
        engineType: result.EngineConfiguration || '',
        engineVolume: result.EngineCylinders || '',
        fuelType: result.FuelTypePrimary || '',
        transmission: result.TransmissionStyle || '',
        driveType: result.DriveType || '',
        color: result.PrimaryColor || '',
        doors: result.Doors || '',
        seats: result.Seats || '',
        vin: vin,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateVIN = useCallback((vin: string): VINValidationResult => {
    try {
      // Перевірка довжини
      if (vin.length !== 17) {
        return {
          isValid: false,
          error: 'VIN-номер повинен містити 17 символів'
        };
      }

      // Перевірка допустимих символів
      if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return {
          isValid: false,
          error: 'VIN-номер містить недопустимі символи'
        };
      }

      // Перевірка контрольного знаку (9-й символ)
      const weights = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
      const transliteration: Record<string, number> = {
        'A':1,'B':2,'C':3,'D':4,'E':5,'F':6,'G':7,'H':8,'J':1,'K':2,'L':3,'M':4,'N':5,'P':7,'R':9,'S':2,'T':3,'U':4,'V':5,'W':6,'X':7,'Y':8,'Z':9,
        '0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9
      };

      let sum = 0;
      for (let i = 0; i < 17; i++) {
        const char = vin[i];
        const value = transliteration[char] || 0;
        sum += value * weights[i];
      }

      const checkDigit = sum % 11;
      const expectedCheckDigit = vin[8];
      const actualCheckDigit = checkDigit === 10 ? 'X' : String(checkDigit);
      const expectedValue = expectedCheckDigit === 'X' ? 10 : transliteration[expectedCheckDigit] || 0;

      if (checkDigit !== expectedValue) {
        return {
          isValid: false,
          error: 'Невірний контрольний знак'
        };
      }

      return {
        isValid: true,
        error: null
      };
    } catch (err) {
      return {
        isValid: false,
        error: 'Помилка перевірки VIN-номера'
      };
    }
  }, []);

  const getVINInfo = useCallback((vin: string): VINInfo => {
    // Отримання базової інформації з VIN без API запиту
    const wmi = vin.substring(0, 3);
    const vds = vin.substring(3, 9);
    const vis = vin.substring(9, 17);

    const yearCode = vis[0];
    const yearMap: Record<string, number> = {
      'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
      'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
      'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024
    };

    return {
      wmi,
      vds,
      vis,
      year: yearMap[yearCode] || null,
      plantCode: vis[1],
      serialNumber: vis.substring(2)
    };
  }, []);

  return {
    loading,
    error,
    decodeVIN,
    validateVIN,
    getVINInfo
  };
};

export default useVIN;
