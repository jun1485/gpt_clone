import { ChatType } from "@/5_entities/chat/model/type";
import { db } from "@/server/firebase";
import { useMutation, UseMutationOptions } from "@tanstack/vue-query";
import { addDoc, collection } from "firebase/firestore";

const addNewChatToDB = async (newChat: ChatType): Promise<void> => {
  const chatCollection = collection(db, "chats");
  await addDoc(chatCollection, newChat);
};

export const useAddChatMutation = (
  options?: UseMutationOptions<void, unknown, ChatType, unknown>
) => {
  return useMutation<void, unknown, ChatType, unknown>(addNewChatToDB, options);
};
