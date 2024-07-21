import { useQuery, UseQueryReturnType } from "@tanstack/vue-query";
import { dummyChats } from "../model/dummyChats";
import { ChatType } from "../model/type";
import { computed } from "vue";

const getChats = async () => {
  return dummyChats;
};

export const useChatQuery = (): UseQueryReturnType<ChatType[], unknown> =>
  useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });

const getSelectedChat = async (id: number) => {
  return dummyChats.find((chat) => chat.id === id);
};

export const useSelectedChatQuery = (id: ReturnType<typeof computed>) => {
  return useQuery({
    queryKey: ["chat", id],
    queryFn: () => {
      if (id.value !== null) return getSelectedChat(id.value as number);
      return Promise.resolve(null);
    },
  });
};
