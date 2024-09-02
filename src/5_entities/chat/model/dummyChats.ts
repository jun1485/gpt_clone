import { ChatType } from "./type";

export const dummyChats: ChatType[] = [
  {
    id: "1",
    title: "Hello",
    messages: [
      { id: "1", content: "Hello, World!", timestamp: "2021-09-01T12:00:00" },
    ],
  },
  {
    id: "2",
    title: "Goodbye",
    messages: [
      { id: "1", content: "Goodbye, World!", timestamp: "2021-09-01T12:00:00" },
    ],
  },
];

export const selectedChat = {
  id: 1,
  title: "Hello",
  messages: [
    { id: "1", content: "Hello, World!", timestamp: "2021-09-01T12:00:00" },
  ],
};
