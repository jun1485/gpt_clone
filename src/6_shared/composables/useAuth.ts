import { ref, onMounted, onUnmounted } from "vue";
import { auth } from "@/server/firebase";
import { User, onAuthStateChanged, signOut } from "firebase/auth";

export function useAuth() {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    isAuthenticated.value = !!currentUser;
    if (currentUser) {
      // 사용자가 인증되면 localStorage에 표시를 저장합니다.
      localStorage.setItem("isLoggedIn", "true");
    } else {
      // 로그아웃 시 localStorage에서 제거합니다.
      localStorage.removeItem("isLoggedIn");
    }
  });

  onMounted(() => {
    // 컴포넌트 마운트 시 localStorage를 확인하여 로그인 상태를 복원합니다.
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      isAuthenticated.value = true;
    }
  });

  onUnmounted(() => {
    unsubscribe();
  });

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("isLoggedIn");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return { user, isAuthenticated, logout };
}
