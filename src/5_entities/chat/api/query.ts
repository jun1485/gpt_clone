import { useQuery, UseQueryReturnType } from "@tanstack/vue-query";
import { dummyChats } from "../model/dummyChats";
import { ChatType } from "../model/type";

const getChats = async () => {
  return dummyChats;
};

export const useChatQuery = (): UseQueryReturnType<ChatType[], unknown> =>
  useQuery({
    queryKey: ["Chat"],
    queryFn: getChats,
  });

const getSelectedChat = async (id: string) => {
  return dummyChats.find((message) => message.id === Number(id));
};

export const useSelectedChatQuery = (
  id: string
): UseQueryReturnType<ChatType, unknown> =>
  useQuery({
    queryKey: ["message", id],
    queryFn: () => getSelectedChat(id),
  });
