<script setup lang="ts">
import { computed } from "vue";
import {
  useAddChatMutation,
  useAddMessageMutation,
} from "@/4_features/chat/api/mutation";
import { useSelectedChatQuery } from "@/4_features/chat/api/query";
import { ChatType, MessageType } from "@/5_entities/chat/model/type";
import { ref, watch } from "vue";
import { v4 as uuidv4 } from "uuid";

const emit = defineEmits<{
  (e: "refetch-chat-list"): void;
}>();

const chatID = defineModel<string>("chatID");

const {
  data: selectedChatData,
  refetch: refetchSelectedChat,
  isLoading,
  error,
} = useSelectedChatQuery(chatID);
const { mutate: addChat, isPending: isAddingChat } = useAddChatMutation();
const { mutate: addMessage, isPending: isAddingMessage } =
  useAddMessageMutation();

const inputValue = ref("");

const currentChat = computed(() => selectedChatData.value);

const handleSendMessage = async () => {
  if (inputValue.value.trim() !== "") {
    const newMessage: MessageType = {
      id: uuidv4(),
      content: inputValue.value.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      if (chatID.value) {
        await addMessage({ chatID: chatID.value, message: newMessage });
      } else {
        const newChat: ChatType = {
          id: uuidv4(),
          title: newMessage.content.slice(0, 20) + "...",
          messages: [newMessage],
        };
        await addChat(newChat);
        chatID.value = newChat.id;
      }
      inputValue.value = "";
      await refetchSelectedChat();
      emit("refetch-chat-list");
    } catch (error) {
      console.error("Failed to send message:", error);
      // TODO: Show error message to user
    }
  }
};

watch(chatID, () => {
  console.log("chatID changed:", chatID.value);
  inputValue.value = "";
});
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-4 w-full">
    <h1 class="text-xl">My GPT</h1>

    <div v-if="isLoading" class="mx-auto">
      <p>Loading...</p>
    </div>
    <div v-else-if="error" class="mx-auto">
      <p>Error: {{ error.message }}</p>
    </div>
    <div v-else-if="!currentChat" class="mx-auto">
      <p>새로운 대화를 시작하거나 채팅을 선택하세요!</p>
    </div>
    <div v-else class="flex flex-col gap-2">
      <div
        v-for="message in currentChat.messages"
        :key="message.id"
        class="message"
      >
        {{ message.content }}
      </div>
    </div>

    <div class="grow" />

    <div class="h-16">
      <input
        type="text"
        v-model="inputValue"
        @keydown.enter="handleSendMessage()"
        class="w-full h-14 p-2 border border-gray-400 rounded-md"
        placeholder="메시지를 입력하세요"
        :disabled="isAddingMessage || isAddingChat"
      />
    </div>
  </div>
</template>
