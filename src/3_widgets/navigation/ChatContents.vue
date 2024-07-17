<script setup lang="ts">
import { useSelectedChatQuery } from "@/5_entities/chat/api/query";
import { computed } from "vue";

const props = defineProps<{
  chatData: any;
}>();

const chatID = computed(() => props.chatData.id);

const { data: selectedChatData } = useSelectedChatQuery(chatID.value ?? 1);
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-4 w-full">
    <h1 class="text-xl">My GPT</h1>

    <div class="mx-auto">
      {{ selectedChatData?.id }}
      {{ selectedChatData?.content }}
    </div>
  </div>
</template>

<style lang="scss"></style>
