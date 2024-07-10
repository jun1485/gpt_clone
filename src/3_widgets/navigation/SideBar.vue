<script setup lang="ts">
import { useMessageQuery } from "../../5_entities/message/api/query";

const { data: messages } = useMessageQuery();

// TODO: messages mutation
</script>

<template>
  <div class="fixed left-0 flex flex-col bg-black/90 h-[100svh] w-72 p-3">
    <div class="flex justify-center gap-3 h-10">
      <h1 class="text-lg">Jun's</h1>
    </div>

    <div
      v-for="chat in messages"
      :key="chat.id"
      class="p-2 bg-transparent hover:bg-gray-400/10 rounded-md cursor-pointer"
    >
      {{ chat.title }}
    </div>
  </div>
</template>

<style lang="scss"></style>
