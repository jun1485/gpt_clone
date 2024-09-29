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
import { useRouter } from "vue-router";

const emit = defineEmits<{
  (e: "refetch-chat-list"): void;
}>();

const router = useRouter();

const chatID = defineModel<string | null>("chatID", { default: null });

const {
  data: selectedChatData,
  refetch: refetchSelectedChat,
  isLoading,
  error,
} = useSelectedChatQuery(computed(() => chatID.value));
const { mutate: addChat, isPending: isAddingChat } = useAddChatMutation();
const { mutate: addMessage, isPending: isAddingMessage } =
  useAddMessageMutation();

const currentChat = computed(() => selectedChatData.value);

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = import.meta.env.VITE_OPENAI_API_URL;

const isWaitingForResponse = ref(false);
const pendingGPTResponse = ref("");
const isTyping = ref(false);
const typedResponse = ref("");

const currentChatWithPendingResponse = computed(() => {
  if (!currentChat.value || !isWaitingForResponse.value) {
    return currentChat.value;
  }

  return {
    ...currentChat.value,
    messages: [
      ...currentChat.value.messages,
      {
        id: "pending-gpt-response",
        content: isTyping.value
          ? typedResponse.value
          : "GPT가 응답을 생성하고 있습니다...",
        timestamp: new Date().toISOString(),
      },
    ],
  };
});

const callGPTAPI = async (message: string): Promise<string> => {
  try {
    if (!API_URL || !API_KEY) {
      throw new Error("API URL 또는 API 키가 설정되지 않았습니다.");
    }

    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        stream: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        responseType: "text",
      }
    );

    let fullResponse = "";
    const reader = response.data.split("\n");
    for (const line of reader) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") {
          break;
        }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0].delta.content;
          if (content) {
            fullResponse += content;
            pendingGPTResponse.value = fullResponse;
            await typeResponse(content);
          }
        } catch (error) {
          console.error("Error parsing stream message:", error);
        }
      }
    }
    return fullResponse;
  } catch (error) {
    console.error("GPT API 호출 중 오류 발생:", error);
    throw new Error("GPT 응답을 가져오는 데 실패했습니다.");
  }
};

const typeResponse = async (text: string) => {
  isTyping.value = true;
  for (let i = 0; i < text.length; i++) {
    typedResponse.value += text[i];
    await new Promise((resolve) => setTimeout(resolve, 15));
  }
};

const handleSendMessage = async (message: string) => {
  if (message !== "") {
    const userMessage: MessageType = {
      id: `user-${uuidv4()}`, // 사용자 메시지 ID에 'user-' 접두사 추가
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

        router.push({ path: `/chat/${currentChatID}` });
      } else {
        await addMessage({ chatID: currentChatID, message: userMessage });
      }

      await refetchSelectedChat();
      emit("refetch-chat-list");

      // GPT API 호출
      isWaitingForResponse.value = true;
      pendingGPTResponse.value = "";
      typedResponse.value = "";
      const gptResponse = await callGPTAPI(userMessage.content);

      const gptMessage: MessageType = {
        id: `gpt-${uuidv4()}`, // GPT 메시지 ID에 'gpt-' 접두사 추가
        content: gptResponse,
        timestamp: new Date().toISOString(),
      };

      await addMessage({ chatID: currentChatID, message: gptMessage });
      await refetchSelectedChat();
    } catch (error) {
      console.error("메시지 전송 또는 GPT 응답 처리 중 오류 발생:", error);
      // TODO: 사용자에게 오류 메시지 표시
    } finally {
      isWaitingForResponse.value = false;
      pendingGPTResponse.value = "";
      isTyping.value = false;
      typedResponse.value = "";
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
      <p>오류: {{ error }}</p>
    </div>
    <div v-else-if="!currentChatWithPendingResponse" class="mx-auto">
      <p>새로운 대화를 시작하거나 채팅을 선택하세요!</p>
    </div>
    <div v-else class="flex flex-col gap-4 overflow-y-auto">
      <div
        v-for="message in currentChatWithPendingResponse.messages"
        :key="message.id"
        class="flex"
        :class="{
          'justify-end': !message.id.startsWith('gpt'),
          'justify-start': message.id.startsWith('gpt'),
        }"
      >
        <div
          class="max-w-[70%] p-3 rounded-lg"
          :class="{
            'bg-blue-500 text-white': !message.id.startsWith('gpt'),
            'bg-gray-300 text-black': message.id.startsWith('gpt'),
            'animate-pulse': message.id === 'pending-gpt-response',
          }"
        >
          {{ message.content }}
        </div>
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

<style scoped>
.overflow-y-auto {
  max-height: calc(100vh - 200px);
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
</style>
