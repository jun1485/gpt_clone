<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { useDeleteChatMutation } from "@/4_features/chat/api/mutation";
import { useWindowSize } from "@vueuse/core";
import { computed } from "vue";

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
  if (isMobile.value) {
    emit("closeSidebar");
  }
};
</script>

<template>
  <div
    v-if="isOpen && isMobile"
    class="fixed inset-0 bg-black/50 z-40"
    @click="handleOverlayClick"
  ></div>
  <div
    :class="[
      'flex flex-col bg-black/90 h-[100svh] w-72 min-w-[18rem] max-w-[18rem] p-3',
      isOpen ? 'fixed left-0 top-0 z-50' : 'hidden sm:flex',
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
      class="p-2 bg-gray-400/40 rounded-md text-white"
    >
      새 채팅
    </button>
  </div>
</template>

<style scoped></style>
