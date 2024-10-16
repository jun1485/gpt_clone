import { ChatType, MessageType } from "@/5_entities/chat/model/type";
import { db } from "@/server/firebase";
import { useMutation, UseMutationReturnType } from "@tanstack/vue-query";
import {
  arrayUnion,
  collection,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "@/6_shared/composables/useAuth";

const { userId } = useAuth();

interface AddMessageParams {
  chatID: string;
  message: MessageType;
}

const addNewChatToDB = async (newChat: ChatType): Promise<string> => {
  if (!userId.value) throw new Error("User not authenticated");
  const chatCollection = collection(db, `users/${userId.value}/chats`);
  const docRef = doc(chatCollection, newChat.id);
  await setDoc(docRef, newChat);
  return newChat.id;
};

export const useAddChatMutation = (): UseMutationReturnType<
  string,
  Error,
  ChatType,
  unknown
> => {
  return useMutation({
    mutationFn: addNewChatToDB,
    mutationKey: ["addChat", userId],
  });
};

const addMessageToChat = async ({
  chatID,
  message,
}: AddMessageParams): Promise<void> => {
  if (!userId.value) throw new Error("User not authenticated");
  const chatRef = doc(db, `users/${userId.value}/chats`, chatID);
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
    mutationKey: ["addMessage", userId],
  });
};

const deleteChatFromDB = async (chatID: string): Promise<void> => {
  if (!userId.value) throw new Error("User not authenticated");
  const chatRef = doc(db, `users/${userId.value}/chats`, chatID);
  await deleteDoc(chatRef);
};

export const useDeleteChatMutation = (): UseMutationReturnType<
  void,
  Error,
  string,
  unknown
> => {
  return useMutation({
    mutationFn: deleteChatFromDB,
    mutationKey: ["deleteChat", userId],
  });
};
