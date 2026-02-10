import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

const AIChat = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, type: 'ai', text: "Hello! I'm your CampusPay AI assistant. How can I help you navigate the Algorand ecosystem today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            let aiResponse = "I'm still learning, but I can help you with payments, splitting bills, or event tickets! Try asking about 'how to split' or 'buying tickets'.";

            const lowerInput = input.toLowerCase();
            if (lowerInput.includes('split')) {
                aiResponse = "To split a bill, go to the 'Expense Splitting' tab, add your friends' Algorand addresses, and click 'Deploy Split Smart Contract'. The contract will handle the math and logic on-chain!";
            } else if (lowerInput.includes('ticket')) {
                aiResponse = "You can buy event tickets in the 'Ticketing' tab. Each ticket is a unique NFT (ASA) on Algorand, ensuring it's authentic and secure.";
            } else if (lowerInput.includes('fund') || lowerInput.includes('donate')) {
                aiResponse = "Our fundraising module allows you to donate ALGO directly to campus projects. Every donation is recorded on the Algorand blockchain for full transparency.";
            } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
                aiResponse = "Hi there! I'm ready to help you with your CampusPay experience. What's on your mind?";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: aiResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.9 }}
                    className="glass-card ai-chat-window"
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '40px',
                        width: '380px',
                        height: '500px',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid rgba(0, 255, 213, 0.2)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '20px',
                        background: 'linear-gradient(to right, rgba(0, 255, 213, 0.1), rgba(157, 0, 255, 0.1))',
                        borderBottom: '1px solid var(--glass-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'var(--accent-cyan)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Bot size={20} color="#000" />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>CampusPay AI</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff88' }}></div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Always active</span>
                                </div>
                            </div>
                        </div>
                        <X
                            size={20}
                            style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
                            onClick={onClose}
                        />
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        style={{
                            flex: 1,
                            padding: '20px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}
                    >
                        {messages.map((msg) => (
                            <div key={msg.id} style={{
                                alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                display: 'flex',
                                gap: '8px',
                                flexDirection: msg.type === 'user' ? 'row-reverse' : 'row'
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: msg.type === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0, 255, 213, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {msg.type === 'user' ? <User size={14} /> : <Sparkles size={14} color="var(--accent-cyan)" />}
                                </div>
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: msg.type === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    background: msg.type === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(0, 255, 213, 0.05)',
                                    border: msg.type === 'user' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0, 255, 213, 0.1)',
                                    fontSize: '0.85rem',
                                    lineHeight: '1.4',
                                    color: msg.type === 'user' ? '#fff' : 'var(--text-secondary)'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px' }}></div>
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)' }}>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            background: 'rgba(255,255,255,0.03)',
                            padding: '6px',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <input
                                type="text"
                                placeholder="Ask me anything..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: '#fff',
                                    padding: '8px 12px',
                                    fontSize: '0.85rem'
                                }}
                            />
                            <button
                                onClick={handleSend}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'var(--accent-cyan)',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <Send size={18} color="#000" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AIChat;
