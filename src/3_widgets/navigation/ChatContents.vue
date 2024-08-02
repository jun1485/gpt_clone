<script setup lang="ts">
import { useAddChatMutation } from "@/4_features/chat/api/mutation";
import { useSelectedChatQuery } from "@/4_features/chat/api/query";
import { ChatType } from "@/5_entities/chat/model/type";
import { computed, ref } from "vue";

const props = defineProps<{
  chatID: any;
}>();

const selectedChatID = computed(() => props.chatID);

const { data: selectedChatData } = useSelectedChatQuery(selectedChatID);

const inputValue = ref("");

const { mutate } = useAddChatMutation();

const handleSendMessage = (message: string) => {
  if (selectedChatID.value !== null) {
    const newMessage = <ChatType>{
      id: Date.now(),
      title: "New",
      content: message,
    };
    mutate(newMessage);
  }
};
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-4 w-full">
    <h1 class="text-xl">My GPT</h1>

    <div v-if="selectedChatData === null" class="mx-auto">
      <p>채팅을 선택해주세요!</p>
    </div>
    <div class="mx-auto">
      {{ selectedChatData?.content }}
    </div>

    <div class="grow" />

    <div class="h-16">
      <input
        type="text"
        v-model="inputValue"
        @keydown.enter="handleSendMessage(inputValue)"
        class="w-full h-14 p-2 border border-gray-400 rounded-md"
        placeholder="메시지를 입력하세요"
      />
    </div>
  </div>
</template>

<style lang="scss"></style>
