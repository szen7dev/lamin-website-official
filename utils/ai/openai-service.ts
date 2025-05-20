import OpenAI from 'openai';
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OpenAI API key is not present');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const DEFAULT_MODELS = {
  premium: 'gpt-4',
  standard: 'gpt-4o-mini',
  basic: 'gpt-3.5-turbo',
  vision: 'gpt-4o-mini',
};

export default openai;

export type LocalMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const LOCAL_STORAGE_KEY = 'floating_chat_conversation';

export function getConversation(): LocalMessage[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

  return stored ? JSON.parse(stored) : [];
}

export function saveConversation(messages: LocalMessage[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  }
}

/**
 * Phan nay tam thoi chua su dung, ham nay dung de handle cach response tu chatgpt voi cac cau hoi
 * Tam thoi chi chat se su dung ham duoi
 */

// export async function handleUserQuestion(
//   question: string,
// ): Promise<LocalMessage[]> {
//   let conversation = getConversation();

//   conversation.push({ role: 'user', content: question });

//   const assistantReply = `You asked: "${question}"`;

//   conversation.push({ role: 'assistant', content: assistantReply });

//   saveConversation(conversation);

//   return conversation;
// }

/**
 * Lay curl khi goi den chatgpt de test
 */

// export function generateOpenAICurl(
//   model: string,
//   messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
//   temperature: number = 0.7,
// ): string {
//   const messagesJson = JSON.stringify(messages);

//   const curlCommand = `curl https://api.openai.com/v1/chat/completions \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer ${OPENAI_API_KEY}" \
//   -d '{
//     "model": "${model}",
//     "messages": ${messagesJson},
//     "temperature": ${temperature}
//   }'`;

//   return curlCommand;
// }

export async function chatWithOpenAI(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
) {
  try {
    if (!OPENAI_API_KEY) {
      console.error(
        'OpenAI API key is not configured. Cannot generate assignment.',
      );

      return {
        error: 'OpenAI API key is not configured',
      };
    }

    const systemGuide = `
      You are a helpful Vietnamese assistant from the Lamin Corporation
      You have extensive knowledge of medicine and supplements for children. 
      You always respond positively and in detail when asked about medications, and you always advise users to consult a doctor before using them.
      When users greet you, respond with: "Lamin thân thiện ở đây sẵn sàng giúp đỡ bạn. Bạn có câu hỏi gì cho mình không?"
      Khi user hỏi về sản phẩm hoặc Lamin: "Lamin là công ty cung cấp giải pháp tăng cao cho trẻ LaminGrow dựa trên 4 trụ cột: cha mẹ tỉnh thức, ngủ sớm, thể dục và uống cốm LaminGrow mỗi ngày?"
    `;

    const formattedMessages = [
      {
        role: 'system',
        content: systemGuide,
      },
      { role: 'user', content: messages[messages.length - 1].content },
      ...messages,
    ];

    //In ra curl de test

    // const curlCommand = generateOpenAICurl(
    //   DEFAULT_MODELS.basic,
    //   formattedMessages as Array<{
    //     role: 'user' | 'assistant' | 'system';
    //     content: string;
    //   }>,
    //   0.7,
    // );

    // console.log('OpenAI cURL:');
    // console.log(curlCommand);

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODELS.basic,
      messages: formattedMessages as Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
      }>,
      temperature: 0.7,
    });

    return response;
  } catch (error) {
    console.error('Error in laminGPT API:', error);

    return {
      error: `Failed to get chat response: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
