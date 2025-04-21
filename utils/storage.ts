import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV();

const EPISODE_KEY_PREFIX = "last-episode-";
const CASTER_KEY_PREFIX = "last-caster-";

export const storage  = {
    //Episodes
    setLastViewEpisode: (key: string, value: string) => mmkv.set(`${EPISODE_KEY_PREFIX}$${key}`, value),
    getLastViewEpisode: (key: string) => mmkv.getString(`${EPISODE_KEY_PREFIX}$${key}`),

    //Casters
    setEpisodeCaster: (key: string, value: string) => mmkv.set(`${CASTER_KEY_PREFIX}$${key}`, value),
    getEpisodeCaster: (key: string) => mmkv.getString(`${CASTER_KEY_PREFIX}$${key}`),
};