import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = import.meta.env.VITE_OPENAI_API_URL;

export async function callGPTAPI(message: string): Promise<string> {
  try {
    if (!API_URL || !API_KEY) {
      throw new Error("API URL 또는 API 키가 설정되지 않았습니다.");
    }

    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        stream: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        responseType: "text",
      }
    );

    let fullResponse = "";
    const reader = response.data.split("\n");
    for (const line of reader) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") {
          break;
        }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0].delta.content;
          if (content) {
            fullResponse += content;
            // 필요한 경우 추가 로직
          }
        } catch (error) {
          console.error("스트림 메시지 파싱 오류:", error);
        }
      }
    }
    return fullResponse;
  } catch (error) {
    console.error("GPT API 호출 중 오류 발생:", error);
    throw new Error("GPT 응답을 가져오는 데 실패했습니다.");
  }
}
