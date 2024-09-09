<script setup lang="ts">
import { getDBSelectedChat } from "@/4_features/chat/api/query";
import { ChatType } from "@/5_entities/chat/model/type";
import InputMessage from "@/6_shared/ui/InputMessage.vue";
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

const handleSendMessage = async (message: string) => {
  console.log(message);
};

onMounted(fetchSelectedChatData);
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-4 w-full h-full justify-between">
    <h1 class="text-xl">My GPT</h1>

    <div class="flex flex-col gap-3 grow justify-end overflow-y-scroll mb-5">
      <div v-if="selectedChatData === null" class="mx-auto">
        <p>채팅을 선택해주세요!</p>
      </div>
      <div v-else v-for="message in selectedChatData.messages" class="mx-auto">
        {{ message.content }}
      </div>
    </div>

    <InputMessage @send="handleSendMessage" />
  </div>
</template>

<style lang="scss"></style>
