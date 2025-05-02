import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV();

const EPISODE_KEY_PREFIX = "last-episode-";
const CASTER_KEY_PREFIX = "last-caster-";
const FAVORITE_KEY_PREFIX = "favorite";
const SKIP_KEY = "skip";

export interface FavoriteItem {
    id: string | number;
    title: string;
    poster: string;
}

export const storage = {
    // AUTH
    setToken: (key: string, token: string) => mmkv.set(key, token),
    getToken: (key: string) => mmkv.getString(key),
    deleteToken: (key: string) => mmkv.delete(key),
    setSkip: (value: boolean) => mmkv.set(SKIP_KEY, value),
    getSkip: () => mmkv.getBoolean(SKIP_KEY),

    //SETTINGS
    setSkipOpening: (value: boolean) => mmkv.set('SKIP_OPENING', value),
    getSkipOpening: () => mmkv.getBoolean('SKIP_OPENING'),
    setShowComments: (value: boolean) => mmkv.set('SHOW_COMM', value),
    getShowComments: () => mmkv.getBoolean('SHOW_COMM'),

    //Episodes
    setLastViewEpisode: (key: string, value: string) => mmkv.set(`${EPISODE_KEY_PREFIX}$${key}`, value),
    getLastViewEpisode: (key: string) => mmkv.getString(`${EPISODE_KEY_PREFIX}$${key}`),

    //Casters
    setEpisodeCaster: (key: string, value: string) => mmkv.set(`${CASTER_KEY_PREFIX}$${key}`, value),
    getEpisodeCaster: (key: string) => mmkv.getString(`${CASTER_KEY_PREFIX}$${key}`),

    //Favorites
    saveFavorites: (array: FavoriteItem[]): boolean => {
        try {
            const jsonString = JSON.stringify(array);
            mmkv.set(FAVORITE_KEY_PREFIX, jsonString);
            return true;
        } catch (error) {
            console.error('Ошибка при сохранении массива избранного:', error);
            return false;
        }
    },

    getFavorites: (): FavoriteItem[] | null => {
        try {
            const jsonString = mmkv.getString(FAVORITE_KEY_PREFIX);
            if (jsonString) {
                return JSON.parse(jsonString) as FavoriteItem[];
            }
            return null;
        } catch (error) {
            console.error('Ошибка при получении массива избранного:', error);
            return null;
        }
    },

    checkIsFavorite: (keyToCheck: string | number): boolean => {
        try {
            const currentFavorites = storage.getFavorites();
            if (currentFavorites) {
                return currentFavorites.some(item => item.id === keyToCheck);
            }
            return false;
        } catch (error) {
            console.error('Ошибка при проверке наличия в избранном:', error);
            return false;
        }
    },

    addFavorite: (item: FavoriteItem): boolean => {
        try {
            const currentFavorites = storage.getFavorites() || [];
            const updatedFavorites = [...currentFavorites, item];
            return storage.saveFavorites(updatedFavorites);
        } catch (error) {
            console.error('Ошибка при добавлении в избранное:', error);
            return false;
        }
    },

    removeFavorite: (idToRemove: string | number): boolean => {
        try {
            const currentFavorites = storage.getFavorites();
            if (currentFavorites) {
                const updatedFavorites = currentFavorites.filter(item => item.id !== idToRemove);
                return storage.saveFavorites(updatedFavorites);
            }
            return false;
        } catch (error) {
            console.error('Ошибка при удалении из избранного по ID:', error);
            return false;
        }
    },

    clearALL: () => {
        return mmkv.clearAll();
    }

};