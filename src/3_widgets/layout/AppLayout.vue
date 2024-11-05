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
const isMobile = computed(() => width.value < 768);
const isTablet = computed(() => width.value >= 768 && width.value < 1024);
const isSidebarOpen = ref(!isMobile.value && !isTablet.value);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  if (isMobile.value || isTablet.value) {
    isSidebarOpen.value = false;
  }
};
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- 햄버거 메뉴 아이콘 (모바일 및 태블릿) -->
    <button
      @click="toggleSidebar"
      class="fixed top-4 left-4 z-50 block lg:hidden"
    >
      <Bars3Icon class="h-6 w-6 text-gray-500" />
    </button>

    <!-- 사이드바 -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out transform w-72 flex-shrink-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)]',
        isMobile ? 'w-full' : isTablet ? '' : ' xs:relative xs:translate-x-0',
      ]"
    >
      <SideBar
        :chatData="chatData"
        :isOpen="isSidebarOpen"
        @select-chat="chatSelected"
        @delete-chat="handleDeleteChat"
        @close-sidebar="closeSidebar"
      />
    </div>

    <!-- 메인 콘텐츠 -->
    <main
      :class="[
        'flex-grow overflow-auto w-full transition-all duration-300 ease-in-out',
        isMobile ? '' : isTablet ? 'ml-0' : 'sm:ml-72',
      ]"
    >
      <router-view
        :key="$route.fullPath"
        v-model:chatID="selectedChatID"
        @refetch-chat-list="refreshChatList"
      />
    </main>

    <!-- 오버레이 (모바일 및 태블릿에서 사이드바가 열렸을 때) -->
    <div
      v-if="(isMobile || isTablet) && isSidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-30"
      @click="closeSidebar"
    />
  </div>
</template>

<style scoped></style>
