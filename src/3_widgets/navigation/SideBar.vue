<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { useDeleteChatMutation } from "@/4_features/chat/api/mutation";
import { useWindowSize } from "@vueuse/core";
import { computed } from "vue";
import { useAuth } from "@/6_shared/composables/useAuth";
import { useRouter } from "vue-router";

defineProps<{
  chatData: any;
  isOpen: boolean;
}>();

const emit = defineEmits(["selectChat", "deleteChat", "closeSidebar"]);

const { width } = useWindowSize();
const isMobile = computed(() => width.value < 640);

const selectChat = (chatId: number | null) => {
  emit("selectChat", chatId);
  if (isMobile.value) {
    emit("closeSidebar");
  }
};

const { mutate: deleteChat } = useDeleteChatMutation();

const handleDeleteChat = async (chatId: string, event: Event) => {
  event.stopPropagation();
  await deleteChat(chatId);
  emit("deleteChat", chatId);
};

const handleOverlayClick = () => {
  emit("closeSidebar");
};

const { isAuthenticated, logout } = useAuth();
const router = useRouter();

const handleLogout = async () => {
  await logout();
  router.push("/");
};
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen && isMobile"
      class="fixed inset-0 bg-black/50 z-40"
      @click="handleOverlayClick"
    ></div>
  </Transition>
  <Transition name="slide">
    <div
      v-if="isOpen || !isMobile"
      :class="[
        'fixed inset-y-0 left-0 flex flex-col bg-black/90 w-72 min-w-[18rem] max-w-[18rem] p-3 z-50',
        { 'sm:relative': !isMobile },
      ]"
    >
      <div class="flex justify-between items-center h-10 mb-4">
        <h1 class="text-lg text-white">Jun's GPT</h1>
        <XMarkIcon
          v-if="isMobile"
          @click="emit('closeSidebar')"
          class="h-6 w-6 text-white cursor-pointer"
        />
      </div>

      <div
        v-for="chat in chatData"
        :key="chat.id"
        @click="selectChat(chat.id)"
        class="p-2 bg-transparent hover:bg-gray-400/10 rounded-md cursor-pointer text-white flex justify-between items-center"
      >
        <span>{{ chat.title }}</span>
        <XMarkIcon
          @click="handleDeleteChat(chat.id, $event)"
          class="h-5 w-5 text-gray-400 hover:text-white cursor-pointer"
        />
      </div>

      <div class="grow" />

      <button
        @click="selectChat(null)"
        class="p-2 bg-gray-400/40 rounded-md text-white mb-2"
      >
        새 채팅
      </button>

      <button
        v-if="isAuthenticated"
        @click="handleLogout"
        class="p-2 bg-red-500 text-white rounded-md w-full"
      >
        로그아웃
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
