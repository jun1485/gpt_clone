export enum GPTErrorCode {
  CONFIG_MISSING = "CONFIG_MISSING",
  API_ERROR = "API_ERROR",
  EMPTY_RESPONSE = "EMPTY_RESPONSE",
  NETWORK_ERROR = "NETWORK_ERROR",
  PARSE_ERROR = "PARSE_ERROR",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
}

export class GPTError extends Error {
  constructor(message: string, public code?: GPTErrorCode) {
    super(message);
    this.name = "GPTError";
  }
}

export async function callGPTAPI(message: string): Promise<string> {
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const API_URL = import.meta.env.VITE_OPENAI_API_URL;

  if (!API_URL || !API_KEY) {
    throw new GPTError(
      "API 설정이 누락되었습니다.",
      GPTErrorCode.CONFIG_MISSING
    );
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new GPTError(
        `API 응답 오류: ${response.status}`,
        GPTErrorCode.API_ERROR
      );
    }

    if (!response.body) {
      throw new GPTError(
        "응답 본문이 비어있습니다.",
        GPTErrorCode.EMPTY_RESPONSE
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullResponse = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.trim().startsWith("data:")) {
          const jsonStr = line.replace(/^data:\s*/, "");
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) fullResponse += content;
          } catch (error) {
            console.warn("스트림 메시지 파싱 오류:", error);
          }
        }
      }
    }

    return fullResponse || "응답을 생성할 수 없습니다.";
  } catch (error) {
    if (error instanceof GPTError) throw error;
    throw new GPTError(
      "예기치 않은 오류가 발생했습니다.",
      GPTErrorCode.UNEXPECTED_ERROR
    );
  }
}
