'use client';

/**
 * Client-side conversation storage utilities
 * This file handles localStorage operations for chat conversations
 */

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
