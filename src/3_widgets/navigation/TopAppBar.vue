<script setup lang="ts">
import { MicrophoneIcon } from "@heroicons/vue/16/solid";
</script>

<template>
  <div
    class="fixed top-0 flex justify-between items-center bg-black w-full h-14"
  >
    <div class="flex-1">JunTube</div>
    <div class="flex-1 flex justify-center gap-3">
      <input
        type="text"
        placeholder="검색"
        class="bg-transparent focus:ring-1 focus:ring-blue-500 outline-none"
      />
      <div class="p-1.5 bg-gray-400 rounded-full">
        <MicrophoneIcon class="h-5 w-5" />
      </div>
    </div>
    <div class="flex-1">3</div>
  </div>
</template>

<style lang="scss"></style>
