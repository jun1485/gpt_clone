<script setup lang="ts">
import { computed } from "vue";
import {
  useAddChatMutation,
  useAddMessageMutation,
} from "@/4_features/chat/api/mutation";
import { useSelectedChatQuery } from "@/4_features/chat/api/query";
import { ChatType, MessageType } from "@/5_entities/chat/model/type";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import InputMessage from "@/6_shared/ui/InputMessage.vue";

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

const currentChat = computed(() => selectedChatData.value);

const API_KEY = import.meta.env.OPENAI_API_KEY;
const API_URL = import.meta.env.OPENAI_API_URL;

const isWaitingForResponse = ref(false);

const callGPTAPI = async (message: string): Promise<string> => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("GPT API 호출 중 오류 발생:", error);
    throw new Error("GPT 응답을 가져오는 데 실패했습니다.");
  }
};

const handleSendMessage = async (message: string) => {
  if (message !== "") {
    const userMessage: MessageType = {
      id: uuidv4(),
      content: message,
      timestamp: new Date().toISOString(),
    };

    try {
      let currentChatID = chatID.value;
      if (!currentChatID) {
        const newChat: ChatType = {
          id: uuidv4(),
          title: userMessage.content.slice(0, 20) + "...",
          messages: [userMessage],
        };
        await addChat(newChat);
        currentChatID = newChat.id;
        chatID.value = currentChatID;
      } else {
        await addMessage({ chatID: currentChatID, message: userMessage });
      }

      await refetchSelectedChat();
      emit("refetch-chat-list");

      // GPT API 호출
      isWaitingForResponse.value = true;
      const gptResponse = await callGPTAPI(userMessage.content);

      const gptMessage: MessageType = {
        id: uuidv4(),
        content: gptResponse,
        timestamp: new Date().toISOString(),
      };

      await addMessage({ chatID: currentChatID, message: gptMessage });
      await refetchSelectedChat();
      isWaitingForResponse.value = false;
    } catch (error) {
      console.error("메시지 전송 또는 GPT 응답 처리 중 오류 발생:", error);
      // TODO: 사용자에게 오류 메시지 표시
      isWaitingForResponse.value = false;
    }
  }
};
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-4 w-full h-full justify-between">
    <h1 class="text-xl">My GPT</h1>

    <div v-if="isLoading" class="mx-auto">
      <p>로딩 중...</p>
    </div>
    <div v-else-if="error" class="mx-auto">
      <p>오류: {{ error.message }}</p>
    </div>
    <div v-else-if="!currentChat" class="mx-auto">
      <p>새로운 대화를 시작하거나 채팅을 선택하세요!</p>
    </div>
    <div v-else class="flex flex-col gap-2">
      <div
        v-for="message in currentChat.messages"
        :key="message.id"
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
      >
        {{ message.content }}
      </div>
    </div>

    <div class="grow" />

    <InputMessage
      @send="handleSendMessage"
      :disabled="isAddingMessage || isAddingChat || isWaitingForResponse"
    />
    <div v-if="isWaitingForResponse" class="text-center mt-2">
      GPT 응답을 기다리는 중...
    </div>
  </div>
</template>

<style scoped></style>
