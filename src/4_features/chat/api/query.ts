import { useQuery, UseQueryReturnType } from "@tanstack/vue-query";
import { ChatType, MessageType } from "../../../5_entities/chat/model/type";
import { ComputedRef } from "vue";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/server/firebase";

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
  const chatCollection = collection(db, "chats");
  const chatSnapshot = await getDocs(chatCollection);
  const chatList = chatSnapshot.docs.map(convertToChatType);
  return chatList;
};

export const useChatQuery = (): UseQueryReturnType<ChatType[], unknown> =>
  useQuery({
    queryKey: ["chats"],
    queryFn: getDBChats,
  });

export const getDBSelectedChat = async (
  uuid: string
): Promise<ChatType | null> => {
  const chatDoc = doc(db, "chats", uuid);
  const chatSnapshot = await getDoc(chatDoc);

  if (chatSnapshot.exists()) {
    return convertToChatType(chatSnapshot);
  } else {
    console.log(`Chat not found for ID: ${uuid}`);
    return null;
  }
};

export const useSelectedChatQuery = (
  id: ComputedRef<string | null>
): UseQueryReturnType<ChatType | null, unknown> =>
  useQuery({
    queryKey: ["chat", id],
    queryFn: async () => {
      if (id.value !== null) {
        console.log(`Fetching chat with ID: ${id.value}`);
        const result = await getDBSelectedChat(id.value);
        console.log("Selected chat:", result);
        return result;
      }
      console.log("No chat ID provided");
      return null;
    },
    enabled: !!id.value,
  });
