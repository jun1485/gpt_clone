<script setup lang="ts">
import { ChatContents } from "@/3_widgets/chat";
import { getDBSelectedChat } from "@/4_features/chat/api/query";
import { ChatType } from "@/5_entities/chat/model/type";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const chatID = route.params.id as string;

const selectedChatData = ref<ChatType | null>(null);

const fetchSelectedChatData = async () => {
  if (chatID !== null) {
    selectedChatData.value = await getDBSelectedChat(chatID);
  }
};

onMounted(fetchSelectedChatData);
</script>

<template>
  <div class="flex flex-col gap-3 w-full h-full justify-between">
    <ChatContents :chatID="route.params.id as string" />
  </div>
</template>

<style lang="scss"></style>
