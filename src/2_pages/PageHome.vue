<script setup lang="ts">
import { ChatContents, SideBar } from "@/3_widgets/navigation";
import { useChatQuery } from "@/5_entities/chat/api/query";
import { ref } from "vue";

const { data: chatData } = useChatQuery();

const selectedChatID = ref<number>();

const chatSelected = (chatId: number) => {
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
