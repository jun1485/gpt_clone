<script setup lang="ts">
import { ChatContents } from "@/3_widgets/chat";
import { useSelectedChatQuery } from "@/4_features/chat/api/query";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const chatID = ref<string | null>(route.params.id as string | null);

const { refetch: fetchSelectedChatData } = useSelectedChatQuery(chatID);

watch(
  () => route.params.id,
  (newId) => {
    chatID.value = newId as string | null;
    fetchSelectedChatData();
  }
);
</script>

<template>
  <div class="flex flex-col gap-3 w-full h-full justify-between">
    <ChatContents :chatID="chatID" @refetch-chat-list="fetchSelectedChatData" />
  </div>
</template>

<style lang="scss"></style>
