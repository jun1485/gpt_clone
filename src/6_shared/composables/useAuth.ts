import { ref, onUnmounted } from "vue";
import { auth } from "@/server/firebase";
import { User, onAuthStateChanged, signOut } from "firebase/auth";

export function useAuth() {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    isAuthenticated.value = !!currentUser;
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

  return { user, isAuthenticated, logout };
}
