<script setup lang="ts">
import { useSelectedChatQuery } from "@/5_entities/chat/api/query";
import { ref, watch } from "vue";

const props = defineProps<{
  chatData: any;
}>();

const selectedChatID = ref<number>(props.chatData?.id ?? 1);

const { data: selectedChatData, refetch } = useSelectedChatQuery(
  selectedChatID.value
);

watch(
  () => props.chatData,
  (newChatData) => {
    console.log("newChatData", newChatData);
    selectedChatID.value = newChatData?.id;
    refetch();
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-col gap-3 px-6 py-4 w-full">
    <h1 class="text-xl">My GPT</h1>

    <div class="mx-auto">
      {{ props.chatData }},
      <br />
      selectedID -> {{ selectedChatID }},
      <br />
      {{ selectedChatData?.content }}
    </div>
  </div>
</template>

<style lang="scss"></style>
