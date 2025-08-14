import React from 'react';
import { ChatService } from '@services/chat/chat.service';

const ChatPage: React.FC = () => {
    const [a, setA] = React.useState('');
    const [b, setB] = React.useState('');
    const [limit, setLimit] = React.useState<number>(50);
    const [messages, setMessages] = React.useState<any[]>([]);
    const [senderId, setSenderId] = React.useState('');
    const [receiverId, setReceiverId] = React.useState('');
    const [content, setContent] = React.useState('');
    const [image, setImage] = React.useState<File | undefined>(undefined);
    const [loading, setLoading] = React.useState(false);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const resp = await ChatService.history({ a, b, limit });
            const payload = (resp as any)?.data;
            const items = payload?.data?.items || payload?.items || payload || [];
            setMessages(Array.isArray(items) ? items : []);
        } finally {
            setLoading(false);
        }
    };

    const send = async () => {
        if (!senderId || !receiverId || (!content && !image)) return;
        setLoading(true);
        try {
            await ChatService.send({ senderId, receiverId, content, image });
            setContent('');
            setImage(undefined);
            await loadHistory();
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => { loadHistory(); }, []);

    return (
        <section className="py-10 bg-gray-50 min-h-[70vh]">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                        <h1 className="text-xl font-bold text-gray-800">Chat</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500">a</label>
                            <input value={a} onChange={e => setA(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" placeholder="a" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500">b</label>
                            <input value={b} onChange={e => setB(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" placeholder="b" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500">limit</label>
                            <input type="number" value={limit} onChange={e => setLimit(Number(e.target.value || 0))} className="w-full border rounded px-3 py-2 text-sm" />
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                            <button onClick={loadHistory} className="px-4 py-2 bg-gray-900 hover:bg-amber-600 text-white rounded-lg text-sm">Tải lịch sử</button>
                        </div>
                    </div>

                    <div className="p-4 h-[400px] overflow-y-auto space-y-3">
                        {loading && <div className="text-sm text-gray-500">Đang tải...</div>}
                        {!loading && messages.length === 0 && <div className="text-sm text-gray-500">Chưa có tin nhắn</div>}
                        {!loading && messages.map((m, idx) => (
                            <div key={m.id || idx} className={`flex ${m.senderId === senderId ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow ${m.senderId === senderId ? 'bg-amber-100 text-gray-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {m.imageUrl && (<img src={m.imageUrl} alt="msg" className="rounded-lg mb-1 max-h-48 object-cover" />)}
                                    {m.content && <div>{m.content}</div>}
                                    <div className="text-[10px] text-gray-500 mt-1">{m.createdAt ? new Date(m.createdAt).toLocaleString('vi-VN') : ''}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t bg-gray-50 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <input placeholder="Sender ID" value={senderId} onChange={e => setSenderId(e.target.value)} className="border rounded px-3 py-2 text-sm" />
                            <input placeholder="Receiver ID" value={receiverId} onChange={e => setReceiverId(e.target.value)} className="border rounded px-3 py-2 text-sm" />
                            <input placeholder="Nhập tin nhắn..." value={content} onChange={e => setContent(e.target.value)} className="md:col-span-2 border rounded px-3 py-2 text-sm" />
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0])} className="text-xs" />
                            <button onClick={send} disabled={loading} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm disabled:opacity-60">Gửi</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChatPage; 