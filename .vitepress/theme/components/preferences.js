import { ref } from "vue";

const hasStorage = typeof localStorage !== "undefined";
const get = (key, defaultValue = false) =>
  hasStorage
    ? JSON.parse(localStorage.getItem(key) || String(defaultValue))
    : defaultValue;

export const preferCompositionKey = "vue-docs-prefer-composition";
export const preferComposition = ref(get(preferCompositionKey));

export const preferSFCKey = "vue-docs-prefer-sfc";
export const preferSFC = ref(get(preferSFCKey, true));

export function filterHeadersByPreference(h) {
  return preferComposition.value ? !h.optionsOnly : !h.compositionOnly;
}
