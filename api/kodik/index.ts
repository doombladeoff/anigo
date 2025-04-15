import { getInfoById } from "@/api/kodik/getInfoById";
import { getLinksWithActualEndpoint } from "@/api/kodik/getLinksWithActualEndpoint";
import { getToken } from "@/api/kodik/getToken";
import { getVoicers } from "@/api/kodik/getVoicers";

export const KodikAPI = {
    getToken: getToken,
    getVoicers: getVoicers,
    getInfoById: getInfoById,
    getLinksWithActualEndpoint: getLinksWithActualEndpoint,
};