import { ref, onUnmounted } from "vue";
import { auth } from "@/server/firebase";
import { User, onAuthStateChanged, signOut } from "firebase/auth";

export function useAuth() {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const userId = ref<string | null>(null);
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  const unsubscribe = onAuthStateChanged(
    auth,
    (currentUser) => {
      user.value = currentUser;
      isAuthenticated.value = !!currentUser;
      userId.value = currentUser ? currentUser.uid : null;
      isLoading.value = false;
      error.value = null;
    },
    (err) => {
      error.value = err.message;
      isLoading.value = false;
    }
  );

  const logout = async () => {
    try {
      isLoading.value = true;
      await signOut(auth);
    } catch (err) {
      console.error("로그아웃 중 오류 발생:", err);
    } finally {
      isLoading.value = false;
    }
  };

  onUnmounted(() => {
    unsubscribe();
  });

  return { user, isAuthenticated, userId, isLoading, logout, error };
}
