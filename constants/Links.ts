export const getLinks = (crunch: string, width: number = 1680, height: number = 2520, type: 'tall' | 'wide' = 'tall') => ({
    backgroundThumbnail: `https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=cover,format=auto,quality=85,width=${width},height=${height}/keyart/${crunch}-backdrop_${type}`,
    titleThumbnail: `https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=600/keyart/${crunch}-title_logo-en-us`
});