import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";

export const BREAKPOINTS = {
  MOBILE: 680,
  TABLET: 1280,
} as const;

export function useResponsive() {
  const { width } = useWindowSize();

  const isMobile = computed(() => width.value < BREAKPOINTS.MOBILE);
  const isTablet = computed(
    () => width.value >= BREAKPOINTS.MOBILE && width.value < BREAKPOINTS.TABLET
  );
  const isDesktop = computed(() => width.value >= BREAKPOINTS.TABLET);

  return {
    isMobile,
    isTablet,
    isDesktop,
    width,
  };
}
