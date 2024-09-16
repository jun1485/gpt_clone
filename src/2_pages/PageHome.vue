<script setup lang="ts">
import { useChatQuery } from "@/4_features/chat/api/query";
import { ChatContents } from "@/3_widgets/chat";

import { ref, watch } from "vue";

const { data: chatData, refetch: refetchChatData } = useChatQuery();

const selectedChatID = ref<string | undefined>(undefined);

const refreshChatList = async () => {
  await refetchChatData();
};

watch(chatData, () => {
  if (chatData.value && chatData.value.length > 0)
    selectedChatID.value = chatData.value[0].id;
});
</script>

<template>
  <ChatContents
    v-model:chatID="selectedChatID"
    @refetch-chat-list="refreshChatList"
  />
</template>

<style lang="scss"></style>
