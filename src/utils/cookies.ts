import Cookies from "js-cookie";

const languageKey = "language";
export const getLanguage = () => Cookies.get(languageKey);
export const setLanguage = (language: string) =>
  Cookies.set(languageKey, language);

const sizeKey = "size";
export const getSize = () => Cookies.get(sizeKey);
export const setSize = (size: string) => Cookies.set(sizeKey, size);

// User
const accessTokenKey = "access_token";
export const getAccessToken = () => Cookies.get(accessTokenKey);
export const setAccessToken = (token: string) =>
  Cookies.set(accessTokenKey, token);
export const removeAccessToken = () => Cookies.remove(accessTokenKey);

// User
const refreshTokenKey = "refresh_token";
export const getRefreshToken = () => Cookies.get(refreshTokenKey);
export const setRefreshToken = (token: string) =>
  Cookies.set(refreshTokenKey, token);
export const removeRefreshToken = () => Cookies.remove(refreshTokenKey);

const codeKey = "code";
export const getCode = () => Cookies.get(codeKey);
export const setCode = (token: string) => Cookies.set(codeKey, token);
export const removeCode = () => Cookies.remove(refreshTokenKey);
