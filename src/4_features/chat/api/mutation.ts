import { ChatType, MessageType } from "@/5_entities/chat/model/type";
import { db } from "@/server/firebase";
import { useMutation, UseMutationReturnType } from "@tanstack/vue-query";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";

interface AddMessageParams {
  chatID: string;
  message: MessageType;
}

const addNewChatToDB = async (newChat: ChatType): Promise<string> => {
  const chatCollection = collection(db, "chats");
  const docRef = await addDoc(chatCollection, newChat);
  return docRef.id;
};

export const useAddChatMutation = (): UseMutationReturnType<
  string,
  Error,
  ChatType,
  unknown
> => {
  return useMutation({
    mutationFn: addNewChatToDB,
    mutationKey: ["addChat"],
  });
};

const addMessageToChat = async ({
  chatID,
  message,
}: AddMessageParams): Promise<void> => {
  const chatRef = doc(db, "chats", chatID);
  await updateDoc(chatRef, {
    messages: arrayUnion(message),
  });
};

export const useAddMessageMutation = (): UseMutationReturnType<
  void,
  Error,
  AddMessageParams,
  unknown
> => {
  return useMutation({
    mutationFn: addMessageToChat,
    mutationKey: ["addMessage"],
  });
};
