<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/server/firebase";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const router = useRouter();

const signup = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = "비밀번호가 일치하지 않습니다.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    router.push("/home");
  } catch (e: any) {
    error.value = e.message;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="px-8 py-6 mt-4 text-left bg-white shadow-lg">
      <h3 class="text-2xl font-bold text-center">회원가입</h3>
      <form @submit.prevent="signup">
        <div class="mt-4">
          <div>
            <label class="block" for="email">이메일</label>
            <input
              type="email"
              placeholder="이메일"
              v-model="email"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div class="mt-4">
            <label class="block" for="password">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호"
              v-model="password"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div class="mt-4">
            <label class="block" for="confirm-password">비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호 확인"
              v-model="confirmPassword"
              class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div class="flex items-baseline justify-between">
            <button
              class="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              type="submit"
            >
              회원가입
            </button>
            <router-link to="/" class="text-sm text-blue-600 hover:underline">
              이미 계정이 있으신가요?
            </router-link>
          </div>
        </div>
      </form>
      <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
    </div>
  </div>
</template>
