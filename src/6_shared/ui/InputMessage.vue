<script setup lang="ts">
import { ref } from "vue";

interface Props {
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "메시지를 입력하세요",
  disabled: false,
});

const emit = defineEmits<{
  (e: "send", message: string): void;
}>();

const inputValue = ref("");
const handleSendMessage = () => {
  if (inputValue.value.trim() !== "") {
    emit("send", inputValue.value.trim());
    inputValue.value = "";
  }
};
</script>

<template>
  <div class="h-16">
    <input
      type="text"
      v-model="inputValue"
      @keydown.enter="handleSendMessage"
      class="w-full h-14 p-2 border border-gray-400 rounded-md"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </div>
</template>
