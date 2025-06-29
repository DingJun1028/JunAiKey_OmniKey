// 繁中英碼, 矩陣圖說

import React, { useState, useEffect, useRef } from 'react';
import { JunAiAssistant } from '../junai';
import { ActionIntent } from '../interfaces';

// 定義單則訊息的資料結構
// Defines the data structure for a single message.
interface Message {
  actor: 'user' | 'assistant';
  text: string;
  decision?: ActionIntent;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [junaiAssistant, setJunaiAssistant] = useState<JunAiAssistant | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // 在元件掛載時，從全域 window 物件取得 junaiAssistant 實例
  // When the component mounts, get the junaiAssistant instance from the global window object.
  useEffect(() => {
    if ((window as any).systemContext?.junaiAssistant) {
      setJunaiAssistant((window as any).systemContext.junaiAssistant);
      setMessages([{ actor: 'assistant', text: '萬能元鑰系統已就緒，請輸入您的指令。' }]);
    }
  }, []);

  // 確保訊息列表自動滾動到底部
  // Ensures the message list automatically scrolls to the bottom.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !junaiAssistant || isLoading) return;

    const userMessage: Message = { actor: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 呼叫核心助理的 processInput 方法
      const { response, decision } = await junaiAssistant.processInput(input, {
        conversation_id: 'web-chat-session-1', // 範例對話 ID
        source: 'web-ui',
        platform: 'web'
      });
      
      const assistantMessage: Message = { actor: 'assistant', text: response, decision };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = { actor: 'assistant', text: `發生錯誤: ${error.message}` };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.actor}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content thinking-indicator">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="在此輸入您的指令..." disabled={isLoading || !junaiAssistant} />
        <button onClick={handleSend} disabled={isLoading || !junaiAssistant}>{isLoading ? '思考中...' : '傳送'}</button>
      </div>
    </div>
  );
};