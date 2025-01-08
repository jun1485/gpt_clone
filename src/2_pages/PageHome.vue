<script setup lang="ts">
import { ChatContents } from "@/3_widgets/chat";
import { useChatQuery } from "@/4_features/chat/api/query";
import { ref, watch } from "vue";

const { data: chatData, refetch: refetchChatData } = useChatQuery();

const selectedChatID = ref<string | null>(null);

const refreshChatList = async () => {
  await refetchChatData();
};

watch(chatData, () => {
  if (
    (selectedChatID.value === null || selectedChatID.value === undefined) &&
    chatData.value &&
    chatData.value.length > 0
  ) {
    selectedChatID.value = chatData.value[0].id;
  }
});
</script>

<template>
  <ChatContents :chatID="selectedChatID" @refetch-chat-list="refreshChatList" />
</template>

<style lang="scss"></style>
