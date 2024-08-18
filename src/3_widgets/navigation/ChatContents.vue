<script setup lang="ts">
import {
  useAddChatMutation,
  useAddMessageMutation,
} from "@/4_features/chat/api/mutation";
import { useSelectedChatQuery } from "@/4_features/chat/api/query";
import { ChatType, MessageType } from "@/5_entities/chat/model/type";
import { computed, ref, watch } from "vue";
import { v4 as uuidv4 } from "uuid";

const emit = defineEmits<{
  (e: "refetch-chat-list"): void;
}>();

const chatID = defineModel<string>("chatID");

const selectedChatID = computed(() => chatID.value);

const { data: selectedChatData, refetch: refetchSelectedChat } =
  useSelectedChatQuery(selectedChatID);
const { mutate: addChat, isPending: isAddingChat } = useAddChatMutation();
const { mutate: addMessage, isPending: isAddingMessage } =
  useAddMessageMutation();

const inputValue = ref("");

const handleSendMessage = async () => {
  if (selectedChatID.value !== null && inputValue.value.trim() !== "") {
    const newMessage = <MessageType>{
      id: uuidv4(),
      content: inputValue.value.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      if (selectedChatID.value) {
        await addMessage({ chatID: selectedChatID.value, message: newMessage });
      } else {
        // 새 채팅방 생성
        const newChat: ChatType = {
          id: uuidv4(),
          title: newMessage.content.slice(0, 20) + "...", // 첫 메시지의 일부를 제목으로 사용
          messages: [newMessage],
        };
        await addChat(newChat);
        chatID.value = newChat.id; // 새로 생성된 채팅방 선택
      }
      inputValue.value = "";
      await refetchSelectedChat();
      emit("refetch-chat-list");
    } catch (error) {
      console.error(error);
    }
  }
};

watch(selectedChatID, () => {
  inputValue.value = "";
});
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-4 w-full">
    <h1 class="text-xl">My GPT</h1>

    <div v-if="!selectedChatData" class="mx-auto">
      {{ selectedChatData }}
      <p>새로운 대화를 시작하거나 채팅을 선택하세요!</p>
    </div>
    <div v-else class="flex flex-col gap-2">
      <div v-for="message in selectedChatData?.messages" :key="message.id">
        {{ message?.content }}
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

<style lang="scss"></style>
