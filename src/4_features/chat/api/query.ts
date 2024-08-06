import { useQuery, UseQueryReturnType } from "@tanstack/vue-query";
import { ChatType } from "../../../5_entities/chat/model/type";
import { ComputedRef } from "vue";
import { collection, getDocs, query, where } from "firebase/firestore";
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
  uuid: string | null
): Promise<ChatType | null> => {
  if (uuid === null) return null;

  const chatCollection = collection(db, "chats");
  const q = query(chatCollection, where("id", "==", uuid)); // UUID를 기준으로 쿼리
  const chatSnapshot = await getDocs(q);

  if (!chatSnapshot.empty) {
    const chatDoc = chatSnapshot.docs[0];
    return {
      ...chatDoc.data(),
    } as ChatType;
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
  id: ComputedRef<string | null>
): UseQueryReturnType<ChatType | null, unknown> =>
  useQuery({
    queryKey: ["chat", id],
    queryFn: () => {
      if (id.value !== null) {
        return getDBSelectedChat(id.value.toString());
      }
      return null;
    },
  });
