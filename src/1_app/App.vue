<script setup lang="ts">
import "@/1_app/globals.scss";
import { useAuth } from "@/6_shared/composables/useAuth";
import { useRouter } from "vue-router";
import { watch } from "vue";

const { isAuthenticated, isLoading } = useAuth();
const router = useRouter();

watch([isAuthenticated, isLoading], ([newIsAuthenticated, newIsLoading]) => {
  if (!newIsLoading) {
    if (newIsAuthenticated) {
      if (
        router.currentRoute.value.path === "/login" ||
        router.currentRoute.value.path === "/"
      ) {
        router.push("/home");
      }
    } else {
      if (
        router.currentRoute.value.path !== "/login" &&
        router.currentRoute.value.path !== "/signup"
      ) {
        router.push("/login");
      }
    }
  }
});
</script>

<template>
  <div v-if="!isLoading">
    <router-view></router-view>
  </div>
  <div v-else>
    <!-- 로딩 인디케이터 -->
    로딩 중...
  </div>
</template>

<style lang="scss"></style>
