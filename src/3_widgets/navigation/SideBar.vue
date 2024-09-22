<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { useDeleteChatMutation } from "@/4_features/chat/api/mutation";

defineProps<{
  chatData: any;
}>();

const emit = defineEmits(["selectChat", "deleteChat"]);

const selectChat = (chatId: number | null) => {
  emit("selectChat", chatId);
};

const { mutate: deleteChat } = useDeleteChatMutation();

const handleDeleteChat = async (chatId: string, event: Event) => {
  event.stopPropagation();
  await deleteChat(chatId);
  emit("deleteChat", chatId);
};
</script>

<template>
  <div
    class="sticky top-0 left-0 flex flex-col bg-black/90 h-[100svh] w-72 min-w-[18rem] max-w-[18rem] p-3"
  >
    <div class="flex justify-center gap-3 h-10">
      <h1 class="text-lg text-white">Jun's GPT</h1>
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
