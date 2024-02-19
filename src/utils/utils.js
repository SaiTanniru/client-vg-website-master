import {US_PREFIX_CODES} from '../constants/us-prefixes';

export const cbBackground = `${arc.path.media}329478c396ca9418561a598ce061359ba28e01b67ded9b3f6f5f9108d10a8e15fa132289f9c1c6ddd251d1cc542afbf1902ff2112976a3f356c926cf55d82a0d_cb-background.png`;
export const cbLogo = `${arc.path.media}69f5851497bb5940e54a8f64bc7783f990db7538652a8d4d0e255e320cf145363cbe2a4bf86dd603339943483d572268439cc8366563e9d62b5ce7c034c9917e_cb-logo.png`;
export const striveLogo = `${arc.path.media}7fd615b65b80597a16117c3e4e038527328b36ca4b4b96369d350daa66a764c41e46e0468bb99cf526ce03f0e8fb241d857c475e2757c6356a3cbc5283e15617_strive-logo-white.png`;
export const txMTBackground =`${arc.path.media}aa1b82a60b36a991b48d4fd2f618a391cd40eef7f954032c0efe7b7aee92467b2b78fc1b50523afb7d88c26b227a72f19e4e121496ad09bde24f38b0475a05c0_STRIVE%20Multi%20Tenant%20Graphic%20Image%20Only.png`;
export const stnlBackground =`${arc.path.media}86f2d245e1f769855b382e0eb7c0ef35958059c2c327dba3b84905fe120cc43ddb9de8f855ef9faee197bfcb67bc2527d3ca7f577f7a6f7469c6efa84da5b86f_stnl_slider_background-min.png?w=120&h=100`;

export const uploadFileErrorMessage = 'Could not upload file';
export const removeFileErrorMessage = 'Could not remove old photo';
export const saveFileErrorMessage = 'Could not save file';

export function formatPhoneNumber(value) {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;
    if (cvLength < 4) return currentValue || '';
    if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
}

export function isPhoneValid(phoneNumber) {
    const cleanedNumber = phoneNumber.replace(/[^\d]/g, '');

    if (cleanedNumber.length !== 10)
        return false;

    return US_PREFIX_CODES.includes(cleanedNumber.substring(0, 3));
}

export function isNameInvalid(name) {
    const normalisedValue = name.toLowerCase();

    if (normalisedValue.length <= 1)
        return true;

    return /(\D\D)\1+/g.test(normalisedValue);
}

export const deviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};

export function dollars(number) {
    if (!number) return;

    const n = typeof number !== 'string' ? number.toString() : number;
    return `$${n.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
