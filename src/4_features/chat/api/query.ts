import { useQuery, UseQueryReturnType } from "@tanstack/vue-query";
import { ChatType, MessageType } from "../../../5_entities/chat/model/type";
import { Ref } from "vue";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/server/firebase";
import { useAuth } from "@/6_shared/composables/useAuth";

const { userId } = useAuth();

const convertToChatType = (doc: DocumentData): ChatType => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || "",
    messages: Array.isArray(data.messages)
      ? data.messages.map(
          (msg: any): MessageType => ({
            id: msg.id || "",
            content: msg.content || "",
            timestamp: msg.timestamp || "",
          })
        )
      : [],
  };
};

// 모든 채팅 데이터를 가져오는 함수
export const getDBChats = async (): Promise<ChatType[]> => {
  if (!userId.value) return [];
  const chatCollection = collection(db, `users/${userId.value}/chats`);
  const chatSnapshot = await getDocs(chatCollection);
  const chatList = chatSnapshot.docs.map(convertToChatType);
  return chatList;
};

export const useChatQuery = (): UseQueryReturnType<ChatType[], unknown> =>
  useQuery({
    queryKey: ["chats", userId],
    queryFn: getDBChats,
    enabled: !!userId.value,
  });

export const getDBSelectedChat = async (
  chatId: string
): Promise<ChatType | null> => {
  if (!userId.value) return null;
  const chatDoc = doc(db, `users/${userId.value}/chats`, chatId);
  const chatSnapshot = await getDoc(chatDoc);

  if (chatSnapshot.exists()) {
    return convertToChatType(chatSnapshot);
  } else {
    console.log(`Chat not found for ID: ${chatId}`);
    return null;
  }
};

export const useSelectedChatQuery = (
  id: Ref<string | null>
): UseQueryReturnType<ChatType | null, unknown> =>
  useQuery({
    queryKey: ["chat", userId, id],
    queryFn: async () => {
      if (id.value !== null) {
        const result = await getDBSelectedChat(id.value);
        return result;
      }
      return null;
    },
    enabled: !!userId.value && !!id.value,
  });
