import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setDataIntoStorage<T extends string>(
  key: string,
  value: T
) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('AsyncStorage set error', error);
  }
}

export const getDataFromStorage = async (key: string) => {
  let data: string | null = null;
  try {
    data = await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('AsyncStorage get error', error);
  }
  return data;
};

export const deleteDataFromStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('AsyncStorage remove error', error);
  }
};

export async function setObjectDataIntoStorage<T>(
  key: string,
  value: Record<string | number, unknown> | number | boolean | T
) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error storing object data', e);
  }
}

export async function getParseDataFromStorage<T>(
  key: string
): Promise<Record<string | number, unknown> | T | number | boolean | null> {
  let jsonValue: string | null = null;
  try {
    jsonValue = await AsyncStorage.getItem(key);
  } catch (e) {
    console.error('Error reading value', e);
  }
  return jsonValue !== null ? JSON.parse(jsonValue) : null;
}
