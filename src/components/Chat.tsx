import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { Client } from '@stomp/stompjs';
import type { IMessage, StompSubscription } from '@stomp/stompjs';
import { useUser } from '../hooks/useUser';
// Backend STOMP endpoint (SockJS enabled). Use the native WebSocket upgrade path.
const WS_BROKER_URL = 'ws://localhost:8080/websocket-endpoint/websocket';

// Destinations (user sends to admin; replies come back via per-client topic if enabled)
const SEND_CHAT_DEST = '/app/chat.sendMessage';
const SEND_JOIN_DEST = '/app/chat.addUser';
const replyTopic = (clientId: string) => `/topic/user.${clientId}`;

type ServerMessageType = 'CHAT' | 'JOIN' | 'LEAVE';
type ServerMessage = {
    id?: number;
    clientId?: string;
    content?: string;
    type?: ServerMessageType;
    timestamp?: string;
};

interface ChatMessage {
    id: number;
    text: string;
    timestamp: Date;
    direction: 'incoming' | 'outgoing' | 'system';
}

const Chat: React.FC = () => {
    const { user } = useUser();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);

    // Stable clientId for this browser/app
    const clientIdRef = useRef<string>('');
    useEffect(() => {
        let id = localStorage.getItem('chat.clientId');
        if (!id) {
            id =
                typeof crypto !== 'undefined' && 'randomUUID' in crypto
                    ? (crypto as any).randomUUID()
                    : `cid-${Math.random().toString(36).slice(2)}-${Date.now()}`;
            localStorage.setItem('chat.clientId', id);
        }
        clientIdRef.current = id;
    }, []);

    const stompRef = useRef<Client | null>(null);
    const subsRef = useRef<StompSubscription[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Connect STOMP and subscribe to admin replies for this client
    useEffect(() => {
        const client = new Client({
            brokerURL: WS_BROKER_URL,
            reconnectDelay: 4000,
            // debug: (msg) => console.log('[STOMP]', msg),
            onConnect: () => {
                setWsConnected(true);

                // Subscribe to admin replies for me (if backend supports /app/admin.reply -> /topic/user.{clientId})
                const topic = replyTopic(clientIdRef.current);
                const sub = client.subscribe(topic, (frame: IMessage) => {
                    try {
                        const data: ServerMessage = JSON.parse(frame.body);
                        const id = typeof data.id === 'number' ? data.id : Date.now();
                        const when = data.timestamp ? new Date(data.timestamp) : new Date();
                        setMessages(prev => [
                            ...prev,
                            { id, text: data.content ?? '', timestamp: when, direction: 'incoming' },
                        ]);
                    } catch {
                        // ignore malformed
                    }
                });
                subsRef.current.push(sub);

                // Optional: presence notification for admin inbox
                client.publish({
                    destination: SEND_JOIN_DEST,
                    body: JSON.stringify({
                        id: Date.now(),
                        clientId: clientIdRef.current,
                        type: 'JOIN' as ServerMessageType,
                        timestamp: new Date().toISOString(),
                    }),
                });
            },
            onDisconnect: () => setWsConnected(false),
            onStompError: () => setWsConnected(false),
            onWebSocketClose: () => setWsConnected(false),
        });

        client.activate();
        stompRef.current = client;

        return () => {
            subsRef.current.forEach(s => s.unsubscribe());
            subsRef.current = [];
            client.deactivate();
            stompRef.current = null;
        };
    }, []);

    // Auto-scroll when messages change and chat is open
    useEffect(() => {
        if (isOpen && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const client = stompRef.current;
        if (!newMessage.trim() || !client || !wsConnected) return;

        const id = Date.now();

        // Optimistic append so the user sees their message immediately
        setMessages(prev => [
            ...prev,
            { id, text: newMessage, timestamp: new Date(), direction: 'outgoing' },
        ]);

        // Send to admin inbox with my clientId
        client.publish({
            destination: SEND_CHAT_DEST,
            body: JSON.stringify({
                id,
                sender: user?.username || 'Anonymous',
                clientId: clientIdRef.current,
                content: newMessage,
                type: 'CHAT' as ServerMessageType,
                timestamp: new Date().toISOString(),
            }),
        });

        setNewMessage('');
    };

    // Unread badge when closed
    const [unread, setUnread] = useState(0);
    useEffect(() => {
        if (!isOpen && messages.length > 0) setUnread(prev => prev + 1);
        if (isOpen) setUnread(0);
    }, [messages, isOpen]);

    return (
        <>
            {!isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1000,
                        cursor: 'pointer',
                        background: '#007bff',
                        color: '#fff',
                        width: 66,
                        height: 66,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                        fontSize: 28,
                    }}
                    onClick={() => setIsOpen(true)}
                    aria-label="Open chat"
                    title="Support"
                >
                    💬
                    {unread > 0 && (
                        <span
                            style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                background: 'red',
                                color: '#fff',
                                borderRadius: '50%',
                                width: 20,
                                height: 20,
                                fontSize: 13,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                            }}
                        >
              {unread}
            </span>
                    )}
                </div>
            )}

            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1050,
                        width: 350,
                        height: 450,
                        maxWidth: '90vw',
                        background: '#fff',
                        borderRadius: 12,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            background: '#007bff',
                            color: '#fff',
                            padding: '8px 12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span>Support</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}
                            aria-label="Close chat"
                        >
                            ×
                        </button>
                    </div>

                    {/* Body */}
                    <div
                        ref={chatContainerRef}
                        style={{
                            height: 350,
                            overflowY: 'auto',
                            padding: 12,
                            background: '#f8f9fa',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                        }}
                    >
                        {messages.map(m => {
                            const right = m.direction === 'outgoing';
                            return (
                                <div key={m.id} style={{ display: 'flex', flexDirection: right ? 'row-reverse' : 'row' }}>
                                    <div>
                                        <small className="text-muted" style={{ display: 'block', textAlign: right ? 'right' : 'left' }}>
                                            {m.timestamp.toLocaleTimeString()}
                                        </small>
                                        <div
                                            className="p-2 rounded"
                                            style={{
                                                background: right ? '#d1e7dd' : '#e2e3e5',
                                                color: '#000',
                                                textAlign: right ? 'right' : 'left',
                                                marginLeft: right ? 0 : 8,
                                                marginRight: right ? 8 : 0,
                                                minWidth: 50,
                                                maxWidth: 240,
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {m.text}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} style={{ padding: 12, display: 'flex', gap: 8 }}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder={wsConnected ? 'Type your message...' : 'Connecting...'}
                            autoFocus
                            style={{ flex: 1, padding: 6, borderRadius: 6, border: '1px solid #ced4da' }}
                            disabled={!wsConnected}
                        />
                        <button
                            type="submit"
                            disabled={!wsConnected || !newMessage.trim()}
                            style={{ padding: '6px 12px', borderRadius: 6, background: '#0d6efd', color: '#fff', border: 'none' }}
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chat;