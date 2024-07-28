<script setup lang="ts">
import { useSelectedChatQuery } from "@/4_features/chat/api/query";
import { computed } from "vue";

const props = defineProps<{
  chatID: any;
}>();

const selectedChatID = computed(() => props.chatID);

const { data: selectedChatData } = useSelectedChatQuery(selectedChatID);
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-4 w-full">
    <h1 class="text-xl">My GPT</h1>

    <div v-if="selectedChatData === null" class="mx-auto">
      <p>채팅을 선택해주세요!</p>
    </div>
    <div class="mx-auto">
      {{ selectedChatData?.content }}
    </div>
  </div>
</template>

<style lang="scss"></style>
