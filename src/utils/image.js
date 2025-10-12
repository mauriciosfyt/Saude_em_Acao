// src/utils/image.js
// Utilitário para normalizar URLs de imagem e evitar Mixed Content
export function fixImageUrl(url) {
    if (!url) return url;
    if (/^https:\/\//i.test(url)) return url;
    if (/^http:\/\//i.test(url)) return url.replace(/^http:\/\//i, 'https://');
    if (/^\/\//.test(url)) return 'https:' + url;
    return url;
}
