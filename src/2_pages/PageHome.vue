<script setup lang="ts">
import { ChatContents, SideBar } from "@/3_widgets/navigation";
import {
  useChatQuery,
  useSelectedChatQuery,
} from "@/5_entities/chat/api/query";
import { ref } from "vue";

const { data: chatData } = useChatQuery();
// const { data: selectedChatData } = useSelectedChatQuery(1);

const selectedChatID = ref<string>();

const chatSelected = (chatId: string) => {
  selectedChatID.value = chatId;
};
</script>

<template>
  <div class="flex">
    <SideBar :chatData="chatData" @select-chat="chatSelected" />

    <ChatContents :chatData="selectedChatID ?? 1" />
  </div>
</template>

<style lang="scss"></style>
