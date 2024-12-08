<script setup lang="ts">
import { SideBar } from "@/3_widgets/navigation";
import { useChatQuery } from "@/4_features/chat/api/query";
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Bars3Icon } from "@heroicons/vue/24/solid";
import { useResponsive } from "@/6_shared/composables/useResponsive";

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

// watch(chatData, () => {
//   if (
//     selectedChatID.value === undefined &&
//     chatData.value &&
//     chatData.value.length > 0
//   ) {
//     selectedChatID.value = chatData.value[0].id;
//   }
// });

const { isMobile, isTablet } = useResponsive();

const isSidebarOpen = ref(!isMobile.value && !isTablet.value);

const lgMediaQuery = window.matchMedia("(min-width: 1280px)");

// 미디어쿼리 변경 감지 핸들러
const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
  isSidebarOpen.value = e.matches;
};

onMounted(() => {
  handleResize(lgMediaQuery);
  lgMediaQuery.addEventListener("change", handleResize);
});

onUnmounted(() => {
  lgMediaQuery.removeEventListener("change", handleResize);
});

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
    <!-- hamburger 메뉴 아이콘 (모바일 및 태블릿) -->
    <button
      @click="toggleSidebar"
      class="fixed top-4 left-4 z-50 block lg:hidden"
    >
      <Bars3Icon v-if="!isSidebarOpen" class="h-6 w-6 text-gray-500" />
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
        v-model:isOpen="isSidebarOpen"
        @select-chat="chatSelected"
        @delete-chat="handleDeleteChat"
        @close-sidebar="closeSidebar"
      />
    </div>

    <!-- 메인 콘텐츠 -->
    <main
      :class="[
        'flex-grow overflow-auto w-full transition-all duration-300 ease-in-out',
        isMobile ? '' : isTablet ? 'ml-0' : 'ml-72',
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
