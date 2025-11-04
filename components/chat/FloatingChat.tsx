'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

import {
  getConversation,
  saveConversation,
  LocalMessage,
} from '@/utils/ai/conversation-storage';

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages(getConversation());
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;

      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const newMessages: LocalMessage[] = [
      ...messages,
      { role: 'user' as const, content: input },
    ];

    setMessages(newMessages);
    setInput('');
    try {
      const res = await fetch('/api/ai/laminGPT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply =
        data.choices?.[0]?.message?.content || 'Sorry, something went wrong.';
      const updated = [
        ...newMessages,
        { role: 'assistant' as const, content: reply },
      ];

      setMessages(updated);
      saveConversation(updated);
    } catch (e) {
      const updated = [
        ...newMessages,
        { role: 'assistant' as const, content: 'Sorry, there was an error.' },
      ];

      setMessages(updated);
      saveConversation(updated);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="relative">
      <motion.button
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full rounded-br-none bg-primary shadow-lg hover:shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}>
        <Image
          priority
          alt="Hỗ trợ trực tuyến Lamin"
          className="rounded-full object-cover"
          height={56}
          sizes="56px"
          src="/images/logo.jpg"
          width={56}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] bg-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-none shadow-xl overflow-hidden"
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}>
            <div className="bg-primary py-3 px-5 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Chat với Lamin</h2>
              <button
                className="p-1.5 rounded-full hover:bg-primary-dark transition-colors text-white"
                onClick={() => setIsOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div
              ref={chatContainerRef}
              className="h-[350px] overflow-y-auto mb-4 border rounded-lg p-3 bg-gray-50">
              <div className="flex flex-col gap-2">
                {messages.length === 0 && (
                  <div className="bg-blue-100 p-2 rounded-lg rounded-tl-none max-w-[80%] self-start">
                    <p className="text-sm">
                      Chào bạn, Lamin có thể giúp gì được cho bạn ạ?
                    </p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={
                      msg.role === 'user'
                        ? 'bg-gray-200 p-2 rounded-lg rounded-tr-none max-w-[80%] self-end'
                        : 'bg-blue-100 p-2 rounded-lg rounded-tl-none max-w-[80%] self-start'
                    }>
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                ))}
                {loading && (
                  <div className="text-xs text-gray-400 self-start">
                    Đang trả lời...
                  </div>
                )}
              </div>
            </div>

            <div className="relative px-5 pb-4">
              <input
                ref={inputRef}
                className="w-[90%] rounded-full border border-gray-300 py-2.5 pl-4 pr-10 focus:border-primary focus:outline-none text-sm"
                disabled={loading}
                placeholder="Nhập tin nhắn của bạn..."
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                aria-label="Send"
                className="absolute right-3 top-1/3 -translate-y-1/2 rounded-full bg-primary p-2 text-white hover:bg-primary-dark disabled:bg-gray-300 transition-colors"
                disabled={loading || !input.trim()}
                onClick={handleSend}>
                <svg
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
