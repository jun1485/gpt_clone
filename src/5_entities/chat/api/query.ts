import { useQuery, UseQueryReturnType } from "@tanstack/vue-query";
import { dummyChats } from "../model/dummyChats";
import { ChatType } from "../model/type";
import { ComputedRef } from "vue";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/server/firebase";

const getChats = async () => {
  return dummyChats;
};

// export const useChatQuery = (): UseQueryReturnType<ChatType[], unknown> =>
//   useQuery({
//     queryKey: ["chats"],
//     queryFn: getChats,
//   });

// const getSelectedChat = async (id: number) => {
//   return dummyChats.find((chat) => chat.id === id);
// };

// export const useSelectedChatQuery = (id: ReturnType<typeof computed>) => {
//   return useQuery({
//     queryKey: ["chat", id],
//     queryFn: () => {
//       if (id.value !== null) return getSelectedChat(id.value as number);
//       return Promise.resolve(null);
//     },
//   });
// };

// 모든 채팅 데이터를 가져오는 함수
export const getDBChats = async (): Promise<ChatType[]> => {
  const chatCollection = collection(db, "chats");
  const chatSnapshot = await getDocs(chatCollection);
  const chatList = chatSnapshot.docs.map((doc) => doc.data() as ChatType);
  return chatList;
};

// 특정 채팅 데이터를 가져오는 함수
export const getDBSelectedChat = async (
  id: number
): Promise<ChatType | null> => {
  const chatDoc = doc(db, "chats", id.toString());
  const chatSnapshot = await getDoc(chatDoc);
  if (chatSnapshot.exists()) {
    return chatSnapshot.data() as ChatType;
  } else {
    return null;
  }
};

export const useChatQuery = (): UseQueryReturnType<ChatType[], unknown> =>
  useQuery({
    queryKey: ["chats"],
    queryFn: getDBChats,
  });

export const useSelectedChatQuery = (
  id: ComputedRef<number | null>
): UseQueryReturnType<ChatType | null, unknown> =>
  useQuery({
    queryKey: ["chat", id],
    queryFn: () => {
      if (id.value !== null) {
        return getDBSelectedChat(id.value as number);
      }
      return Promise.resolve(null);
    },
    enabled: id.value !== null, // id가 null일 때는 쿼리를 비활성화
  });
