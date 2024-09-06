<script setup lang="ts">
import { SideBar } from "@/3_widgets/navigation";
import { useChatQuery } from "@/4_features/chat/api/query";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { data: chatData, refetch: refetchChatData } = useChatQuery();
const selectedChatID = ref<string | null>(null);

const chatSelected = (chatId: string | null) => {
  selectedChatID.value = chatId;
  router.push({ name: "chat", params: { id: chatId } });
};

const refreshChatList = async () => {
  await refetchChatData();
};

watch(chatData, () => {
  if (chatData.value && chatData.value.length > 0)
    selectedChatID.value = chatData.value[0].id;
});
</script>

<template>
  <div class="flex">
    <div class="w-72 flex-shrink-0">
      <SideBar :chatData="chatData" @select-chat="chatSelected" />
    </div>
    <main class="flex-grow">
      <router-view
        :key="$route.fullPath"
        v-model:chatID="selectedChatID"
        @refetch-chat-list="refreshChatList"
      />
    </main>
  </div>
</template>
