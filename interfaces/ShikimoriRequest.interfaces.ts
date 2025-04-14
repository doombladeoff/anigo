export interface RequestProps {
    name?: string;
    ids?: string;
    kind?: (
        | "tv"
        | "movie"
        | "ova"
        | "ona"
        | "special"
        | "tv_special"
        | "music"
        )[];
    status?: ("ongoing" | "released" | "latest" | "anons")[];
    /**
     * Максимальное значение для limit — 50.
     * default — 2
     * Если указано больше 50, оно будет автоматически ограничено.
     */
    limit?: number;
    order?: string;
    /**
     * S - Less than 10 minutes
     * D - Less than 30 minutes
     * F - More than 30 minutes
     */
    duration?: ("S" | "D" | "F")[];
    /*
    Query RatingString:
      none - No rating
      g - G - All ages
      pg - PG - Children
      pg_13 - PG-13 - Teens 13 or older
      r - R - 17+ recommended (violence & profanity)
      r_plus - R+ - Mild Nudity (may also contain violence & profanity)
      rx - Rx - Hentai (extreme sexual content/nudity)
    */
    rating?: ("none" | "g" | "pg" | "pg_13" | "r" | "r_plus" | "rx")[];
    page?: number;
    /* year (examples 2016, 2014_2016, summer_2017) */
    season?: string;
}