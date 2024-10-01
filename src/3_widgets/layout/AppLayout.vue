<script setup lang="ts">
import { SideBar } from "@/3_widgets/navigation";
import { useChatQuery } from "@/4_features/chat/api/query";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Bars3Icon } from "@heroicons/vue/24/solid";
import { useWindowSize } from "@vueuse/core";

const router = useRouter();
const { data: chatData, refetch: refetchChatData } = useChatQuery();
const selectedChatID = ref<string | null>(null);

const chatSelected = (chatId: string | null) => {
  if (chatId === null) {
    selectedChatID.value = null;
    router.push({ name: "home" });
  } else {
    selectedChatID.value = chatId;
    router.push({ name: "chat", params: { id: chatId } });
  }
};

const refreshChatList = async () => {
  await refetchChatData();
};

const handleDeleteChat = async (chatId: string) => {
  await refreshChatList();
  if (selectedChatID.value === chatId) {
    router.push({ name: "home" });
  }
};

watch(chatData, () => {
  if (chatData.value && chatData.value.length > 0)
    selectedChatID.value = chatData.value[0].id;
});

const { width } = useWindowSize();
const isMobile = computed(() => width.value < 640);
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <div class="flex relative">
    <!-- 햄버거 메뉴 아이콘 (모바일) -->
    <button
      v-if="isMobile"
      @click="toggleSidebar"
      class="fixed top-4 left-4 z-50"
    >
      <Bars3Icon class="h-6 w-6 text-gray-500" />
    </button>

    <!-- 사이드바 (데스크톱 및 모바일) -->
    <div
      :class="{
        'fixed inset-y-0 left-0 transform -translate-x-full': isMobile,
        'translate-x-0': isSidebarOpen,
        'transition-transform duration-300 ease-in-out z-40': true,
      }"
    >
      <SideBar
        :chatData="chatData"
        @select-chat="chatSelected"
        @delete-chat="handleDeleteChat"
        @close-sidebar="isSidebarOpen = false"
      />
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

<style scoped></style>
