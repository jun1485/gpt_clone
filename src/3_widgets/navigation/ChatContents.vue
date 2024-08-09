<script setup lang="ts">
import { useAddChatMutation } from "@/4_features/chat/api/mutation";
import { useSelectedChatQuery } from "@/4_features/chat/api/query";
import { ChatType } from "@/5_entities/chat/model/type";
import { computed, ref, watch } from "vue";
import { v4 as uuidv4 } from "uuid";

const chatID = defineModel<string>("chatID");

const selectedChatID = computed(() => chatID);

const { data: selectedChatData, refetch: refetchSelectedChat } =
  useSelectedChatQuery(selectedChatID.value);
const { mutate: addChat, isPending: isAddingChat } = useAddChatMutation();

const inputValue = ref("");

const handleSendMessage = async () => {
  if (selectedChatID.value !== null && inputValue.value.trim() !== "") {
    const newMessage = <ChatType>{
      id: uuidv4(),
      title: "New",
      content: inputValue.value.trim(),
    };

    try {
      await addChat(newMessage);
      inputValue.value = "";
      await refetchSelectedChat();
    } catch (error) {
      console.error(error);
    }
  }

  watch(selectedChatID, () => {
    inputValue.value = "";
  });
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
        @keydown.enter="handleSendMessage()"
        class="w-full h-14 p-2 border border-gray-400 rounded-md"
        placeholder="메시지를 입력하세요"
        :disabled="isAddingChat"
      />
    </div>
  </div>
</template>

<style lang="scss"></style>
