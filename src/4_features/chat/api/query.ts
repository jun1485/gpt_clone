import { useQuery, UseQueryReturnType } from "@tanstack/vue-query";
import { ChatType } from "../../../5_entities/chat/model/type";
import { ComputedRef } from "vue";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/server/firebase";

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
  if (id === null) return null;

  const chatCollection = collection(db, "chats");
  const chatSnapshot = await getDoc(doc(chatCollection, id.toString()));

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
      return null;
    },
  });
