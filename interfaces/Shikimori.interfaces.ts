export interface ShikimoriAnime {
    id: number;
    malId: number;
    name: string;
    russian: string;
    licenseNameRu: string;
    english: string;
    japanese: string;
    rating: string;
    score: string;
    status: string;
    episodes: number;
    episodesAired: number;
    url: string;
    poster: Poster;
    nextEpisodeAt: string;
    isCensored: boolean;
    genres: Genre[];
    studios: Studio[];
    related: Related[];
    screenshots: Screenshot[];
    characterRoles: CharacterRole[];
    externalLinks: ExternalLinks[];
    description: string;
    airedOn: AiredOn;
    releasedOn: ReleasedOn;
}

export interface Poster {
    id: number;
    originalUrl: string;
    mainUrl: string;
}

export interface Genre {
    id: number;
    name: string;
    russian: string;
    kind: number;
}

export interface Studio {
    id: number;
    name: string;
    imageUrl: string;
}

export interface Related {
    id: number;
    anime: { id: number; name: string };
    manga: { id: number; name: string };
    relationKind: string;
    relationText: string;
}

export interface Screenshot {
    id: number;
    originalUrl: string;
    x166Url: string;
    x332Url: string;
}

export interface CharacterRole {
    character: Character;
    id: number;
    rolesEn: string[];
    rolesRu: string[];
}

export interface Character {
    createdAt: Date;
    description: string;
    descriptionHtml: string;
    descriptionSource: string;
    id: number;
    isAnime: boolean;
    isManga: boolean;
    isRanobe: boolean;
    japanese: string;
    malId: number;
    name: string;
    poster: Poster;
    russian: string;
    synonyms: string[];
    topic: Topic;
    updatedAt: Date;
    url: string;
}

export interface Topic {
    body: string;
    commentsCount: number;
    createdAt: Date;
    htmlBody: string;
    id: number;
    tags: string[];
    title: string;
    type: string;
    updatedAt: Date;
    url: string;
}

export interface AiredOn {
    year: number;
    month: number;
    day: number;
    date: string;
}

export interface ReleasedOn {
    year: number;
    month: number;
    day: number;
    date: string;
}

export interface ExternalLinks {
    id: string;
    kind: string;
    url: string;
}
