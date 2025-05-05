export interface Character {
    mal_id: number;
    url: string;
    images: {
        jpg: {
            image_url: string;
        };
        webp: {
            image_url: string;
            small_image_url: string;
        };
    };
    name: string;
    name_kanji: string;
    nicknames: string[];
    favorites: number;
    about: string;
    anime: CharacterMedia[];
    manga: CharacterMedia[];
    voices: VoiceActor[];
}

export interface ImageSet {
    image_url: string;
    small_image_url?: string;
    large_image_url?: string;
}

export interface MediaEntry {
    mal_id: number;
    url: string;
    title: string;
    images: {
        jpg: ImageSet;
        webp: ImageSet;
    };
}

export interface PersonMedia {
    mal_id: number;
    url: string;
    images: {
        jpg: {
            image_url: string;
        }
    };
    name: string;
}

export interface VoiceActor {
    person: PersonMedia;
    language: string
}

export interface CharacterMedia {
    role: 'Main' | 'Supporting';
    anime?: MediaEntry;
    manga?: MediaEntry;
}
