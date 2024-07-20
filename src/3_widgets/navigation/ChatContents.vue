<script setup lang="ts">
import { useSelectedChatQuery } from "@/5_entities/chat/api/query";
import { computed } from "vue";

const props = defineProps<{
  chatID: number | null;
}>();

const { data: selectedChatData } = useSelectedChatQuery(
  computed(() => props.chatID)
);
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-4 w-full">
    <h1 class="text-xl">My GPT</h1>

    <div class="mx-auto">
      {{ selectedChatData?.content }}
    </div>
  </div>
</template>

<style lang="scss"></style>
