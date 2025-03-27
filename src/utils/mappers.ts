import { i18n } from "@/i18n";
import type { ControlItem } from "@/models/frontend";

export const makeControlItems = (items: any): ControlItem[] => {
  return items.map((item: any) => ({
    value: item.id,
    label: item?.name[i18n.global.locale.value] || item?.name,
  }));
};

export const convertPhone = (value: string) =>
  value.replaceAll(/\(|\)|-| /g, "");

export const convertPassport = (value: string) => value.replaceAll(/\s/g, "");

export const convertCardNumber = (value: string) => value.replaceAll(/\s/g, "");

export const getNameFromObject = (name: any) =>
  name[i18n.global.locale.value] || name;
