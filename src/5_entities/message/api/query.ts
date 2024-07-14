import { useQuery, UseQueryReturnType } from "@tanstack/vue-query";
import { MessageType } from "../model/type";
import { dummyMessages } from "../model/dummyMessages";

const getMessages = async () => {
  return dummyMessages;
};

export const useMessageQuery = (): UseQueryReturnType<MessageType[], unknown> =>
  useQuery({
    queryKey: ["message"],
    queryFn: getMessages,
  });

const getSelectedChat = async (id: string) => {
  return dummyMessages.find((message) => message.id === Number(id));
};

export const useSelectedChatQuery = (
  id: string
): UseQueryReturnType<MessageType, unknown> =>
  useQuery({
    queryKey: ["message", id],
    queryFn: () => getSelectedChat(id),
  });
