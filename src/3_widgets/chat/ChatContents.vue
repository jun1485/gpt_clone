<script setup lang="ts">
import InputMessage from "@/6_shared/ui/InputMessage.vue";
import { useChat } from "@/4_features/chat/composables/useChat";

const {
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
} = useChat();
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
  @apply max-h-[calc(100vh-180px)];
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
    @apply max-h-[calc(100vh-130px)];
  }
}
</style>
