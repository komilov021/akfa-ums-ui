import type { App } from "vue";
import Icon from "@/components/icon/index.vue";
import { Semester } from "@/models/backend";
import defaultImg from "../assets/images/avatar.png";
import { marked } from "marked";

export function registerIcons(app: App) {
  app.component("SvgIcon", Icon);
}

export function loadCss(url: string): void {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  link.crossOrigin = "anonymous";
  document.getElementsByTagName("head")[0].appendChild(link);
}

export function loadJs(url: string): void {
  const link = document.createElement("script");
  link.src = url;
  document.body.appendChild(link);
}

/**
 * @param {string} path
 * @return {Boolean}
 */
export function isExternal(path: string) {
  return /^(https?|ftp|mailto|tel):/.test(path);
}

export function selectSemesterByNumber(n: number): string {
  const d = new Date();
  const m = d.getMonth() + 1;
  let year = d.getFullYear();
  let semester = m >= 10 && m <= 12 ? "FALL" : "SPRING";
  if (semester === "SPRING") {
    if (n === 1) {
      semester = "FALL";
      year -= 1;
    }
  } else {
    if (n !== 1) {
      semester = "SPRING";
      year += 1;
    }
  }
  return year + "-" + semester;
}

export const thisYear = (): string => new Date().getFullYear().toString();
export const nextYear = (): string => (new Date().getFullYear() + 1).toString();

export const enrollSemester = () => {
  const now = new Date();
  return now.getMonth() >= 9 && now.getMonth() <= 11
    ? Semester.SPRING
    : Semester.FALL;
};

export const nextSemester = () => {
  const s = enrollSemester();
  const y = s === Semester.SPRING ? nextYear() : thisYear();
  return s + " " + y;
};

export const currentSemester = () => {
  const d = new Date();
  const m = d.getMonth();
  const y = d.getFullYear();
  const s = m >= 9 && m <= 11 ? "FALL" : "SPRING";
  return s + " " + y;
};
export const baseUrl = {
  origin: `${
    import.meta.env.DEV
      ? import.meta.env.VITE_BASE_URL
      : `${window.location.origin}`
  }`,
};

export const saveFile = (blob: Blob, fileName: string, blobUrl?: boolean) => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  const url = blobUrl ? blob : (window.URL.createObjectURL(blob) as any);
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 0);
};
export function semesterSorting(a: any, b: any) {
  const semesterOrder = { SPRING: 1, FALL: 2 } as any;
  const [aSeason, aYear] = a.semester.split(" ");
  const [bSeason, bYear] = b.semester.split(" ");
  if (aYear !== bYear) {
    return parseInt(aYear) - parseInt(bYear);
  }
  return semesterOrder[aSeason] - semesterOrder[bSeason];
}

export const markedContent = (text: string) => {
  if (!text) return "";
  return marked.parse(text);
};
