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
