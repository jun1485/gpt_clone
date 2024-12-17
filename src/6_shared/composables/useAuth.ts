import { ref, onUnmounted } from "vue";
import { auth } from "@/server/firebase";
import { User, onAuthStateChanged, signOut } from "firebase/auth";

export function useAuth() {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const userId = ref<string | null>(null);
  const isLoading = ref(true);

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    isAuthenticated.value = !!currentUser;
    userId.value = currentUser ? currentUser.uid : null;
    isLoading.value = false;
  });

  onUnmounted(() => {
    unsubscribe();
  });

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return { user, isAuthenticated, userId, isLoading, logout };
}
