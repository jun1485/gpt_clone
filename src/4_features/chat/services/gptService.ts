export async function callGPTAPI(message: string): Promise<string> {
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const API_URL = import.meta.env.VITE_OPENAI_API_URL;

  if (!API_URL || !API_KEY) {
    throw new Error("API URL 또는 API 키가 설정되지 않았습니다.");
  }

  let response: Response;
  try {
    response = await fetch(API_URL, {
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
  } catch (networkError) {
    console.error("네트워크 에러:", networkError);
    throw new Error("네트워크 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }

  if (!response.ok || !response.body) {
    console.error(`GPT 응답 실패: ${response.status} - ${response.statusText}`);
    throw new Error("GPT 응답을 가져오는 데 실패했습니다.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let fullResponse = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true }).split("\n");

    for (const line of chunk) {
      if (line.trim().startsWith("data:")) {
        const jsonStr = line.replace(/^data:\s*/, "");
        if (jsonStr === "[DONE]") {
          break;
        }
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullResponse += content;
          }
        } catch (error) {
          console.error("스트림 메시지 파싱 오류:", error);
        }
      }
    }
  }

  return fullResponse;
}
