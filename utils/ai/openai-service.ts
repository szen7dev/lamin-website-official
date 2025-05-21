import OpenAI from 'openai';
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_ASSISTANT_ID;
const VECTOR_STORE_ID = process.env.NEXT_PUBLIC_VECTOR_STORE_ID;

interface ThreadStorage {
  threadId: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}
const threadStorage: ThreadStorage[] = [];
const THREAD_EXPIRATION_MS = 3 * 24 * 60 * 60 * 1000;

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
  retrieval: 'gpt-3.5-turbo-1106',
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

function cleanupExpiredThreads() {
  const now = new Date();
  const expiredThreads = threadStorage.filter(thread => thread.expiresAt < now);

  expiredThreads.forEach(async thread => {
    try {
      await openai.beta.threads.del(thread.threadId);
      console.log(`Deleted expired thread: ${thread.threadId}`);
    } catch (error) {
      console.error(`Failed to delete thread ${thread.threadId}:`, error);
    }
  });

  const activeThreads = threadStorage.filter(thread => thread.expiresAt >= now);

  threadStorage.length = 0;
  threadStorage.push(...activeThreads);
}

async function getOrCreateThreadForUser(userId: string): Promise<string> {
  cleanupExpiredThreads();

  const existingThread = threadStorage.find(thread => thread.userId === userId);

  if (existingThread) {
    existingThread.expiresAt = new Date(Date.now() + THREAD_EXPIRATION_MS);

    return existingThread.threadId;
  }
  const thread = await openai.beta.threads.create();

  threadStorage.push({
    threadId: thread.id,
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + THREAD_EXPIRATION_MS),
  });

  return thread.id;
}

const FILE_SEARCH_KEYWORDS = [
  'tài liệu',
  'document',
  'file',
  'tìm kiếm',
  'search',
  'tìm',
  'find',
  'hướng dẫn',
  'guide',
  'manual',
  'sản phẩm',
  'product',
  'thông tin',
  'information',
  'chính sách',
  'policy',
  'công ty',
  'company',
  'liên hệ',
  'contact',
  'hỗ trợ',
  'support',
  'giới thiệu',
  'introduction',
];

function shouldUseFileSearch(message: string): boolean {
  const lowerCaseMessage = message.toLowerCase();

  return FILE_SEARCH_KEYWORDS.some(keyword =>
    lowerCaseMessage.includes(keyword.toLowerCase()),
  );
}

export async function chatWithOpenAI(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  userId: string = 'anonymous',
) {
  try {
    if (!OPENAI_API_KEY || !ASSISTANT_ID) {
      console.error('OpenAI API key or Assistant ID is not configured.');

      return {
        error: 'OpenAI API key or Assistant ID is not configured',
      };
    }

    const userMessage = messages[messages.length - 1].content;
    const useFileSearch = VECTOR_STORE_ID && shouldUseFileSearch(userMessage);

    if (useFileSearch) {
      console.log('Using file search for query:', userMessage);

      return await handleAssistantWithFileSearch(userMessage, userId);
    } else {
      console.log('Using regular chat completion for query:', userMessage);

      return await handleRegularChatCompletion(messages);
    }
  } catch (error) {
    console.error('Error in laminGPT API:', error);

    return {
      error: `Failed to get chat response: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function handleAssistantWithFileSearch(
  userMessage: string,
  userId: string,
) {
  try {
    const threadId = await getOrCreateThreadForUser(userId);

    if (VECTOR_STORE_ID && ASSISTANT_ID) {
      await openai.beta.assistants.update(ASSISTANT_ID, {
        tool_resources: {
          file_search: { vector_store_ids: [VECTOR_STORE_ID] },
        },
      });
    }

    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: userMessage,
    });

    if (!ASSISTANT_ID) {
      return {
        error: 'Assistant ID is not configured',
      };
    }

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

    while (
      runStatus.status !== 'completed' &&
      runStatus.status !== 'failed' &&
      runStatus.status !== 'expired'
    ) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    if (runStatus.status !== 'completed') {
      return {
        error: `Run failed with status: ${runStatus.status}`,
      };
    }

    const messages_response = await openai.beta.threads.messages.list(threadId);

    const assistantMessages = messages_response.data.filter(
      msg => msg.role === 'assistant',
    );
    const latestMessage = assistantMessages[0];

    if (
      !latestMessage ||
      !latestMessage.content ||
      latestMessage.content.length === 0
    ) {
      return {
        error: 'No response from assistant',
      };
    }

    const responseContent =
      latestMessage.content[0].type === 'text'
        ? latestMessage.content[0].text.value
        : 'Response format not supported';

    return {
      choices: [
        {
          message: {
            role: 'assistant',
            content: responseContent,
          },
        },
      ],
    };
  } catch (error) {
    console.error('Error in assistant with file search:', error);

    return {
      error: `Failed to get response from assistant: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function handleRegularChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
) {
  try {
    const systemGuide = `
      Bạn là một trợ lý chuyên nghiệp từ công ty Lamin.
      Bạn chỉ trả lời những câu hỏi liên quan đến lĩnh vực y tế.
      Bạn có kiến thức chuyên sâu về y học và bổ sung cho trẻ em.
      Không trả lời những câu hỏi không liên quan đến lĩnh vực y tế.
      Nếu người dùng hỏi câu hỏi không liên quan đến y tế, bạn phải từ chối trả lời và nhắc nhở họ rằng bạn chỉ có thể trả lời các câu hỏi về y tế và sức khỏe.
      Với những câu hỏi như toán học, tin tức, thời tiết, hoặc các chủ đề khác không liên quan đến y tế, hãy lịch sự từ chối và đề nghị họ hỏi về các vấn đề y tế.
      Bạn luôn trả lời tích cực và chi tiết khi được hỏi về các loại thuốc, và bạn luôn khuyên người dùng nên tham khảo ý kiến bác sĩ trước khi sử dụng chúng.
      Khi người dùng chào bạn, trả lời với: "Lamin thân thiện ở đây sẵn sàng giúp đỡ bạn. Bạn có câu hỏi gì về y tế cho mình không?"
      Khi người dùng hỏi về sản phẩm hoặc Lamin: "Lamin là công ty cung cấp giải pháp tăng cao cho trẻ LaminGrow dựa trên 4 trụ cột: cha mẹ tỉnh thức, ngủ sớm, thể dục và uống cốm LaminGrow mỗi ngày?"
    `;

    const formattedMessages = [
      {
        role: 'system',
        content: systemGuide,
      },
      { role: 'user', content: messages[messages.length - 1].content },
      ...messages,
    ];

    const typedMessages = formattedMessages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODELS.basic,
      messages: typedMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response;
  } catch (error) {
    console.error('Error in regular chat completion:', error);

    return {
      error: `Failed to get chat response: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
