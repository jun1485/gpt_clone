import { ChatType } from "@/5_entities/chat/model/type";
import { db } from "@/server/firebase";
import { useMutation, UseMutationReturnType } from "@tanstack/vue-query";
import { addDoc, collection } from "firebase/firestore";

const addNewChatToDB = async (newChat: ChatType): Promise<void> => {
  const chatCollection = collection(db, "chats");
  await addDoc(chatCollection, newChat);
};

export const useAddChatMutation = (): UseMutationReturnType<
  unknown,
  Error,
  ChatType,
  unknown
> => {
  return useMutation({
    mutationFn: addNewChatToDB,
    mutationKey: ["addChat"],
  });
};
