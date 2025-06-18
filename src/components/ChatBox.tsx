import React, { useState, useRef, useEffect } from "react";
import { chat } from "../api";

interface Props {
  username: string;
  password: string;
  role: string;
  onLogout: () => void;
}

interface Source {
  title: string;
  source: string;
  role: string;
  score: number;
  file_type: string;
  word_count: number;
}

interface Metadata {
  total_sources: number;
  total_words_referenced: number;
  average_relevance_score: number;
  role_distribution: Record<string, number>;
  user_role: string;
  query: string;
  [key: string]: any;
}

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  sources?: Source[];
  metadata?: Metadata;
}

const ChatBox: React.FC<Props> = ({ username, password, role, onLogout }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      type: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    try {
      const res = await chat(username, password, message.trim());
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: res.response,
        type: 'assistant',
        sources: res.sources || undefined,
        metadata: res.metadata || undefined
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        type: 'assistant'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Helper to render metadata
  const renderMetadata = (metadata?: Metadata) => {
    if (!metadata) return null;
    return (
      <div className="metadata-section">
        <h4>Metadata</h4>
        <ul className="metadata-list">
          {Object.entries(metadata).map(([key, value]) => (
            <li key={key}>
              <strong>{key.replace(/_/g, ' ')}:</strong> {typeof value === 'object' ? <pre style={{display:'inline'}}>{JSON.stringify(value, null, 2)}</pre> : String(value)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-content">
          <div className="header-left">
            <h2>AI Assistant</h2>
            <p>Ask me anything about your documents</p>
          </div>
          <button className="logout-button" onClick={onLogout}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="message assistant">
            <div className="message-avatar">AI</div>
            <div className="message-content">
              Hello! I'm your AI assistant. How can I help you today?
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.type}`}>
            <div className="message-avatar">
              {msg.type === 'user' ? getInitials(username) : 'AI'}
            </div>
            <div className="message-content">
              {msg.content}
              {/* Enhanced sources display for assistant messages */}
              {msg.type === 'assistant' && msg.sources && msg.sources.length > 0 && (
                <div className="sources-section">
                  <h4>Sources</h4>
                  <table className="sources-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Source</th>
                        <th>Role</th>
                        <th>Score</th>
                        <th>File Type</th>
                        <th>Word Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {msg.sources.map((source, i) => (
                        <tr key={i}>
                          <td>{source.title}</td>
                          <td>{source.source}</td>
                          <td>{source.role}</td>
                          <td>{source.score}</td>
                          <td>{source.file_type}</td>
                          <td>{source.word_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar">AI</div>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="message-input-container">
        <div className="input-wrapper">
          <textarea
            className="message-textarea"
            placeholder="Type your message here..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            rows={1}
          />
          <button 
            className="send-button" 
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
