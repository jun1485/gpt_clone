<script setup lang="ts">
import { useSelectedChatQuery } from "@/5_entities/chat/api/query";

const props = defineProps<{
  chatData: any;
}>();

const { data: selectedChatData } = useSelectedChatQuery(props.chatdata.id);
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
