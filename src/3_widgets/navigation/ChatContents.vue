<script setup lang="ts">
import { useThemeStore } from "../../6_shared/theme/composable/useTheme";

defineProps<{
  chatData: any;
}>();

const themeStore = useThemeStore();
</script>

<template>
  <div class="px-6 py-4">
    <h1 class="text-xl">My GPT</h1>

    <div @click="themeStore.toggleDarkMode" class="">asdadssda</div>
    asdsdasd
  </div>
</template>

<style lang="scss"></style>
