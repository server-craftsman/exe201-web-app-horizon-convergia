import React from 'react';
import { ChatService } from '@services/chat/chat.service';
import { useUserInfo } from '@hooks/index';

type OpenChatDetail = {
    senderId?: string;
    receiverId?: string;
    message?: string;
    sendImmediately?: boolean;
};

const ChatWidget: React.FC = () => {
    const user = useUserInfo();
    const [open, setOpen] = React.useState(false);
    const [senderId, setSenderId] = React.useState<string>('');
    const [receiverId, setReceiverId] = React.useState<string>('');
    const [messages, setMessages] = React.useState<any[]>([]);
    const [text, setText] = React.useState('');
    const [image, setImage] = React.useState<File | undefined>(undefined);
    const [loading, setLoading] = React.useState(false);
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        if (user?.id) setSenderId(user.id);
    }, [user?.id]);

    const scrollToBottom = () => {
        const el = listRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    };

    const load = async () => {
        if (!senderId || !receiverId) return;
        setLoading(true);
        try {
            const resp = await ChatService.history({ a: senderId, b: receiverId, limit: 50 });
            const payload = (resp as any)?.data;
            const items = payload?.data?.items || payload?.items || payload || [];
            setMessages(Array.isArray(items) ? items : []);
            setTimeout(scrollToBottom, 50);
        } finally { setLoading(false); }
    };

    React.useEffect(() => { if (open) load(); }, [open]);

    const send = async () => {
        if (!senderId || !receiverId || (!text && !image)) return;
        setLoading(true);
        try {
            await ChatService.send({ senderId, receiverId, content: text, image });
            setText(''); setImage(undefined);
            await load();
        } finally { setLoading(false); }
    };

    // Listen external open-chat command
    React.useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent<OpenChatDetail>).detail || {};
            if (detail.senderId) setSenderId(detail.senderId);
            if (detail.receiverId) setReceiverId(detail.receiverId!);
            if (typeof detail.message === 'string') setText(detail.message);
            setOpen(true);
            // ensure states applied before action
            setTimeout(async () => {
                if (detail.sendImmediately && (detail.message || image)) {
                    await send();
                } else {
                    inputRef.current?.focus();
                    await load();
                }
            }, 0);
        };
        window.addEventListener('hc:open-chat' as any, handler as any);
        return () => window.removeEventListener('hc:open-chat' as any, handler as any);
    }, [senderId, receiverId, text, image]);

    return (
        <>
            {/* Floating Button with pulse */}
            <button
                onClick={() => setOpen(v => !v)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105"
                title={open ? 'Đóng chat' : 'Mở chat'}
            >
                <span className="absolute -z-10 inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-20" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 drop-shadow">
                    <path d="M2.25 12c0 2.485 2.099 4.5 4.688 4.5H9.75l3.75 3.75V16.5h3.813c2.589 0 4.687-2.015 4.687-4.5s-2.098-4.5-4.687-4.5H6.938C4.349 7.5 2.25 9.515 2.25 12z" />
                </svg>
            </button>

            {/* Panel */}
            <div className={`fixed bottom-24 right-6 z-50 w-96 max-w-[95vw] transition-all ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden backdrop-blur">
                    {/* Header */}
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">HC</div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border border-white" title="Online" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold">Hỗ trợ trực tuyến</div>
                                <div className="text-[11px] opacity-90">Phản hồi trong vài phút</div>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} className="text-white/90 hover:text-white">×</button>
                    </div>

                    {/* Setup IDs if missing */}
                    {(!senderId || !receiverId) && (
                        <div className="p-3 space-y-2 border-b">
                            <input value={senderId} onChange={e => setSenderId(e.target.value)} placeholder="Sender ID"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
                            <input value={receiverId} onChange={e => setReceiverId(e.target.value)} placeholder="Receiver ID"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
                            <button onClick={load} className="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm">Bắt đầu</button>
                        </div>
                    )}

                    {/* Messages */}
                    <div ref={listRef} className="p-3 h-80 overflow-y-auto space-y-2 bg-gradient-to-b from-white to-gray-50">
                        {loading && <div className="text-sm text-gray-500">Đang tải...</div>}
                        {!loading && messages.length === 0 && <div className="text-sm text-gray-500">Hãy nhập tin nhắn để bắt đầu</div>}
                        {!loading && messages.map((m, i) => (
                            <div key={m.id || i} className={`flex ${m.senderId === senderId ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow ${m.senderId === senderId ? 'bg-amber-100' : 'bg-white border'} text-gray-800`}>
                                    {m.imageUrl && (<img src={m.imageUrl} alt="img" className="rounded-lg mb-1 max-h-40 object-cover" />)}
                                    {m.content && <div className="leading-relaxed">{m.content}</div>}
                                    <div className="text-[10px] text-gray-500 mt-1 text-right">{m.createdAt ? new Date(m.createdAt).toLocaleString('vi-VN') : ''}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Composer */}
                    <div className="p-3 bg-gray-50 border-t space-y-2">
                        {image && (
                            <div className="flex items-center justify-between bg-white border rounded-lg px-3 py-2 text-xs">
                                <span className="truncate mr-2">{image.name}</span>
                                <button onClick={() => setImage(undefined)} className="text-red-600 hover:underline">Gỡ</button>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <input ref={inputRef} value={text} onChange={e => setText(e.target.value)} placeholder="Nhập tin nhắn..."
                                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
                            <label className="inline-flex items-center justify-center w-10 h-10 rounded-lg border bg-white hover:bg-gray-50 cursor-pointer">
                                <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0])} className="hidden" />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-gray-600"><path d="M4 16l4-4 4 4 8-8" /><path d="M14 8h6v6" /></svg>
                            </label>
                            <button onClick={send} disabled={loading || !senderId || !receiverId}
                                className="px-4 h-10 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-lg text-sm shadow disabled:opacity-60 inline-flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3.4 20.6l17.9-8.95c.9-.45.9-1.75 0-2.2L3.4.5C2.6.1 1.7.7 1.9 1.6L4 10l8 2-8 2-2.1 8.4c-.2.9.7 1.5 1.5 1.2z" /></svg>
                                Gửi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatWidget; 