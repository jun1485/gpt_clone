<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect, onMounted } from "vue";
import {
  useAddChatMutation,
  useAddMessageMutation,
} from "@/4_features/chat/api/mutation";
import { useSelectedChatQuery } from "@/4_features/chat/api/query";
import { ChatType, MessageType } from "@/5_entities/chat/model/type";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import InputMessage from "@/6_shared/ui/InputMessage.vue";
import { useRouter } from "vue-router";
import { useResponsive } from "@/6_shared/composables/useResponsive";

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

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = import.meta.env.VITE_OPENAI_API_URL;

const { isMobile } = useResponsive();

const isWaitingForResponse = ref(false);
const pendingGPTResponse = ref("");
const isTyping = ref(false);
const typedResponse = ref("");

const currentChatMessages = ref<MessageType[]>([]);

const currentChatWithPendingResponse = computed(() => {
  if (!isWaitingForResponse.value) {
    return currentChatMessages.value;
  }

  const messages = [...currentChatMessages.value];

  messages.push({
    id: "pending-gpt-response",
    content: isTyping.value
      ? typedResponse.value
      : "GPT가 응답을 생성하고 있습니다...",
    timestamp: new Date().toISOString(),
  });

  return messages;
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
      id: `user-${uuidv4()}`,
      content: message,
      timestamp: new Date().toISOString(),
    };

    try {
      let currentChatID = chatID.value;

      // 사용자 메시지를 즉시 로컬 상태에 추가
      currentChatMessages.value.push(userMessage);

      // GPT API 호출 준비
      isWaitingForResponse.value = true;
      pendingGPTResponse.value = "";
      typedResponse.value = "";

      if (!currentChatID) {
        const newChat: ChatType = {
          id: uuidv4(),
          title: userMessage.content.slice(0, 20) + "...",
          messages: [userMessage],
        };
        await addChat(newChat);
        currentChatID = newChat.id;
        chatID.value = currentChatID;

        router.push({ path: `home/chat/${currentChatID}` });
      } else {
        await addMessage({ chatID: currentChatID, message: userMessage });
      }

      // GPT API 호출
      const gptResponse = await callGPTAPI(userMessage.content);

      const gptMessage: MessageType = {
        id: `gpt-${uuidv4()}`,
        content: gptResponse,
        timestamp: new Date().toISOString(),
      };

      await addMessage({ chatID: currentChatID, message: gptMessage });

      // GPT 응답을 즉시 로컬 상태에 추가
      currentChatMessages.value.push(gptMessage);

      // GPT 응답 후에 채팅 목록을 새로고침
      await refetchSelectedChat();
      emit("refetch-chat-list");
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

watchEffect(() => {
  if (selectedChatData.value) {
    currentChatMessages.value = [...selectedChatData.value.messages];
  } else {
    currentChatMessages.value = [];
  }
});

const messageContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

// 컴포넌트가 마운트될 때 스크롤
onMounted(() => {
  nextTick(() => {
    scrollToBottom();
  });
});

// 메시지가 변경될 때 스크롤
watch(currentChatMessages, () => {
  nextTick(() => {
    scrollToBottom();
  });
});

// 타이핑 응답이 업데이트될 때 스크롤
watch(typedResponse, () => {
  nextTick(() => {
    scrollToBottom();
  });
});
</script>

<template>
  <div
    class="flex flex-col gap-3 pl-4 py-2 sm:py-4 w-full h-full justify-between"
  >
    <div v-if="isLoading" class="mx-auto">
      <p>로딩 중...</p>
    </div>
    <div v-else-if="error" class="mx-auto">
      <p>오류: {{ error }}</p>
    </div>
    <div
      v-else-if="
        !currentChatWithPendingResponse.length && !isWaitingForResponse
      "
      class="mx-auto text-sm sm:text-base"
    >
      <p class="mt-10">새로운 대화를 시작하거나 채팅을 선택하세요!</p>
    </div>
    <div
      v-else
      ref="messageContainer"
      class="flex flex-col gap-2 sm:gap-4 overflow-y-auto pr-2 md:pr-6"
    >
      <div
        v-for="message in currentChatWithPendingResponse"
        :key="message.id"
        class="flex"
        :class="{
          'justify-end':
            !message.id.startsWith('gpt') &&
            message.id !== 'pending-gpt-response',
          'justify-start':
            message.id.startsWith('gpt') ||
            message.id === 'pending-gpt-response',
        }"
      >
        <div
          class="max-w-[90%] sm:max-w-[70%] p-2 sm:p-3 rounded-lg text-sm sm:text-base"
          :class="{
            'bg-blue-500 text-white':
              !message.id.startsWith('gpt') &&
              message.id !== 'pending-gpt-response',
            'bg-gray-300 text-black':
              message.id.startsWith('gpt') ||
              message.id === 'pending-gpt-response',
            'animate-pulse': message.id === 'pending-gpt-response',
          }"
        >
          {{ message.content }}
        </div>
      </div>
    </div>

    <div class="grow" />

    <div
      v-show="isWaitingForResponse || isTyping"
      class="text-center mt-1 sm:mt-2 text-xs sm:text-sm"
    >
      GPT 응답을 기다리는 중...
    </div>

    <InputMessage
      @send="handleSendMessage"
      :disabled="isAddingMessage || isAddingChat || isWaitingForResponse"
      class="mt-2 sm:mt-4"
      :placeholder="isMobile ? '메시지 입력...' : '메시지를 입력하세요'"
    />
  </div>
</template>

<style scoped>
.overflow-y-auto {
  max-height: calc(100vh - 180px);
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

@media (max-width: 640px) {
  .overflow-y-auto {
    max-height: calc(100vh - 130px);
  }
}
</style>
