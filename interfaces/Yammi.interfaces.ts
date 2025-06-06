export interface Yammi {
    anime_id: number;
    title: string;
    remote_ids: {
        shikimori_id: number;
    };
    poster: {
        medium: string;
    };
    year: number;
    rating: {
        shikimori_rating: number;
    };
}