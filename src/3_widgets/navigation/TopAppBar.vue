<script setup lang="ts">
import {
  BellIcon,
  MicrophoneIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/vue/16/solid";
</script>

<template>
  <div
    class="fixed top-0 flex justify-between items-center bg-black w-full h-14 px-4"
  >
    <div class="flex-1">JunTube</div>
    <div class="flex-1 flex justify-center gap-3 h-10">
      <input
        type="text"
        placeholder="검색"
        class="bg-white/10 focus:ring-1 focus:ring-blue-500 outline-none"
      />
      <div
        class="flex justify-center items-center p-1.5 bg-gray-400 rounded-full w-10"
      >
        <MicrophoneIcon class="h-5 w-5" />
      </div>
    </div>
    <div class="flex-1 flex items-center justify-end gap-2">
      <div
        class="flex justify-center items-center w-10 h-10 rounded-full hover:bg-white/15"
      >
        <PlusIcon class="h-6 w-6" />
      </div>
      <div
        class="flex justify-center items-center w-10 h-10 rounded-full hover:bg-white/15"
      >
        <BellIcon class="h-6 w-6" />
      </div>
      <div
        class="flex justify-center items-center w-10 h-10 rounded-full hover:bg-white/15"
      >
        <UserIcon class="h-6 w-6" />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
