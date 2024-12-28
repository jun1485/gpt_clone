import { computed, ref, watchEffect, onMounted, nextTick, watch } from "vue";
import {
  useAddChatMutation,
  useAddMessageMutation,
} from "@/4_features/chat/api/mutation";
import { useSelectedChatQuery } from "@/4_features/chat/api/query";
import { ChatType, MessageType } from "@/5_entities/chat/model/type";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "vue-router";
import { useResponsive } from "@/6_shared/composables/useResponsive";
import { callGPTAPI } from "../services/gptService";

export function useChat() {
  const router = useRouter();
  const { isMobile } = useResponsive();

  const chatID = ref<string | null>(null);

  const {
    data: selectedChatData,
    refetch: refetchSelectedChat,
    isLoading,
    error,
  } = useSelectedChatQuery(computed(() => chatID.value));

  const { mutate: addChat, isPending: isAddingChat } = useAddChatMutation();
  const { mutate: addMessage, isPending: isAddingMessage } =
    useAddMessageMutation();

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

  const typeResponse = async (text: string) => {
    isTyping.value = true;
    for (let i = 0; i < text.length; i++) {
      typedResponse.value += text[i];
      await new Promise((resolve) => setTimeout(resolve, 15));
    }
    isTyping.value = false;
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
        // emit은 ChatContents.vue에서 처리
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

  onMounted(() => {
    nextTick(() => {
      scrollToBottom();
    });
  });

  watch(currentChatMessages, () => {
    nextTick(() => {
      scrollToBottom();
    });
  });

  watch(typedResponse, () => {
    nextTick(() => {
      scrollToBottom();
    });
  });

  return {
    chatID,
    selectedChatData,
    refetchSelectedChat,
    isLoading,
    error,
    isAddingChat,
    isAddingMessage,
    isWaitingForResponse,
    pendingGPTResponse,
    isTyping,
    typedResponse,
    currentChatMessages,
    currentChatWithPendingResponse,
    handleSendMessage,
    messageContainer,
    isMobile,
  };
}
