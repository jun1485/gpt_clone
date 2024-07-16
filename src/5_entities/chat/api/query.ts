import { useQuery, UseQueryReturnType } from "@tanstack/vue-query";
import { dummyChats } from "../model/dummyChats";
import { ChatType } from "../model/type";

const getChats = async () => {
  return dummyChats;
};

export const useChatQuery = (): UseQueryReturnType<ChatType[], unknown> =>
  useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });

const getSelectedChat = async (id: number): Promise<ChatType | undefined> => {
  return dummyChats.find((chat) => chat.id === id);
};

export const useSelectedChatQuery = (
  id: number
): UseQueryReturnType<ChatType, unknown> =>
  useQuery({
    queryKey: ["chat", id],
    queryFn: () => getSelectedChat(id),
  });
