<script setup lang="ts">
import { ChatContents, SideBar } from "@/3_widgets/navigation";
import { useChatQuery } from "@/4_features/chat/api/query";

import { ref, watch } from "vue";

const { data: chatData } = useChatQuery();

const selectedChatID = ref<string | null>(null);

const chatSelected = (chatId: string | null) => {
  selectedChatID.value = chatId;
};

watch(chatData, () => {
  if (chatData.value && chatData.value.length > 0)
    selectedChatID.value = chatData.value[0].id;
});
</script>

<template>
  <div class="flex">
    <SideBar :chatData="chatData" @select-chat="chatSelected" />

    <ChatContents v-model:chatID="selectedChatID" />
  </div>
</template>

<style lang="scss"></style>
