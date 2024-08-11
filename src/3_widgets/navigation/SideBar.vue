<script setup lang="ts">
defineProps<{
  chatData: any;
}>();

const emit = defineEmits(["selectChat"]);

const selectChat = (chatId: number | null) => {
  emit("selectChat", chatId);
};
</script>

<template>
  <div
    class="sticky top-0 left-0 flex flex-col bg-black/90 h-[100svh] w-72 p-3"
  >
    <div class="flex justify-center gap-3 h-10">
      <h1 class="text-lg text-white">Jun's GPT</h1>
    </div>

    <div
      v-for="chat in chatData"
      :key="chat.id"
      @click="selectChat(chat.id)"
      class="p-2 bg-transparent hover:bg-gray-400/10 rounded-md cursor-pointer text-white"
    >
      {{ chat.title }}
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

<style lang="scss"></style>
