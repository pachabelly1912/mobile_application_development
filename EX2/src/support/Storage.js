import {
  AsyncStorage,
} from 'react-native';

const HISTORY = 'HISTORY';

const getHistory = async () => {
  try {
    const savedItems = await AsyncStorage.getItem(HISTORY);
    return savedItems ? JSON.parse(savedItems) : []; 
  } catch(e) {
    return [];
  }
}

const setHistory = async (items) => {
  try {
    const savedItems = await AsyncStorage.setItem(HISTORY, JSON.stringify(items));
  } catch(e) {}
}

export { getHistory, setHistory };