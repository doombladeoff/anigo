interface AnimeContextStatus {
    label: string;
    iconName: string;
    color: string;
}

type Status = {
    [key: string]: {
        en: string;
        ru: string;
    };
}

export const status: Status = {
    released: { en: 'Released', ru: 'Вышло' },
    ongoing: { en: 'Ongoing', ru: 'Оногоинг' },
    anons: { en: 'Anons', ru: 'Анонс' }
}

export const userStatus: Record<string, AnimeContextStatus> = {
    planned: {
        label: 'Запланировано',
        iconName: 'calendar',
        color: '#e7b932',
    },
    watching: {
        label: 'Смотрю',
        iconName: 'play.fill',
        color: 'skyblue',
    },
    completed: {
        label: 'Просмотрено',
        iconName: 'checkmark.seal.fill',
        color: 'rgba(46,204,113,1)',
    },
    on_hold: {
        label: 'Отложено',
        iconName: 'pause.fill',
        color: 'gray',
    },
    dropped: {
        label: 'Брошено',
        iconName: 'xmark.bin.fill',
        color: 'red',
    },
};
