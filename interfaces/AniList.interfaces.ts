export interface AniListAnime {
    id: number;
    bannerImage: string;
    externalLinks: {
        url: string;
        site: string
    }[];
    coverImage: {
        large: string;
        extraLarge: string
    };
    streamingEpisodes: { url: string }[];
};