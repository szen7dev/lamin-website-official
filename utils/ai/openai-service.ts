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

export async function handleUserQuestion(
  question: string,
): Promise<LocalMessage[]> {
  let conversation = getConversation();

  conversation.push({ role: 'user', content: question });

  const assistantReply = `You asked: "${question}"`;

  conversation.push({ role: 'assistant', content: assistantReply });

  saveConversation(conversation);

  return conversation;
}

export async function chatWithOpenAI(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
  });

  return response;
}
