<script setup lang="ts">
import { toggleDarkMode } from "../../6_shared/theme/theme";

defineProps<{
  chatData: any;
}>();
</script>

<template>
  <div class="px-6 py-4">
    <h1 class="text-black text-xl">My GPT</h1>

    <div @click="toggleDarkMode" class="">asdadssda</div>
    asdsdasd
  </div>
</template>

<style lang="scss"></style>
