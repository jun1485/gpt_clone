import { useQuery, UseQueryReturnType } from "@tanstack/vue-query";
import { ChatType, MessageType } from "../../../5_entities/chat/model/type";
import { ComputedRef } from "vue";
import {
  collection,
  DocumentData,
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

// 특정 채팅 데이터를 가져오는 함수
export const getDBSelectedChat = async (
  uuid: string | null
): Promise<ChatType | null> => {
  if (uuid === null) return null;
  const chatCollection = collection(db, "chats");
  const q = query(chatCollection, where("id", "==", uuid));
  const chatSnapshot = await getDocs(q);

  if (!chatSnapshot.empty) {
    const chatDoc = chatSnapshot.docs[0];
    return convertToChatType(chatDoc);
  } else {
    console.log("Chat not found");
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
    queryFn: async () => {
      if (id.value !== null) {
        const result = await getDBSelectedChat(id.value);
        console.log("Selected chat:", result);
        return result;
      }
      return null;
    },
  });
