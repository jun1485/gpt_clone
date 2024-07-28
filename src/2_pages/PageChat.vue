<template>
  <div class="flex flex-col gap-3 px-6 py-4 w-full">
    <h1 class="text-xl">My GPT</h1>

    <div v-if="selectedChatData === null" class="mx-auto">
      <p>채팅을 선택해주세요!</p>
    </div>
    <div v-else class="mx-auto">
      {{ selectedChatData?.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDBSelectedChat } from "@/4_features/chat/api/query";
import { ChatType } from "@/5_entities/chat/model/type";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const chatID = route.params.id as string; // URL 파라미터에서 채팅 ID 가져오기

const selectedChatData = ref<ChatType | null>(null);

const fetchSelectedChatData = async () => {
  if (chatID !== null) {
    selectedChatData.value = await getDBSelectedChat(Number(chatID));
  }
};

onMounted(fetchSelectedChatData);
</script>

<style lang="scss"></style>
