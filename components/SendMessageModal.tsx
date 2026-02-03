
import React, { useState } from 'react';
import { X, Send, Heart, ThumbsUp, Coffee, Zap, Gift, MessageCircle } from 'lucide-react';
import { User } from '../types';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User;
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({ isOpen, onClose, targetUser }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = (msg: string = message) => {
      if(!msg.trim()) return;
      
      // Mock API call / Alert
      alert(`[To: ${targetUser.name}] 메시지가 전송되었습니다!\n"${msg}"`);
      setMessage('');
      onClose();
  };

  const quickReactions = [
      { icon: <Heart size={18} />, label: "사랑해", text: "오늘도 고마워 사랑해! ❤️", color: "text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-100" },
      { icon: <ThumbsUp size={18} />, label: "최고야", text: "진짜 고생했어, 당신이 최고야! 👍", color: "text-blue-500 bg-blue-50 border-blue-200 hover:bg-blue-100" },
      { icon: <Coffee size={18} />, label: "커피수혈", text: "이따가 커피 한잔 어때? ☕️", color: "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100" },
      { icon: <Zap size={18} />, label: "화이팅", text: "조금만 더 힘내자 화이팅! ⚡️", color: "text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <img src={targetUser.avatar} alt={targetUser.name} className="w-10 h-10 rounded-full border border-slate-200 bg-white" />
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">에게 메시지 보내기</h3>
                    <p className="text-xs text-slate-500 font-bold">{targetUser.name}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-5">
            {/* Quick Reactions */}
            <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">빠른 반응</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
                {quickReactions.map((reaction, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleSend(reaction.text)}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all active:scale-95 ${reaction.color}`}
                    >
                        {reaction.icon}
                        <span className="text-xs font-bold">{reaction.label}</span>
                    </button>
                ))}
            </div>

            {/* Custom Message */}
            <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">직접 입력</p>
            <div className="relative">
                <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="따뜻한 한마디를 남겨주세요..."
                    className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-3"
                />
            </div>
            
            <button 
                onClick={() => handleSend()}
                disabled={!message.trim()}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    message.trim() 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
            >
                <Send size={16} />
                전송하기
            </button>
        </div>

      </div>
    </div>
  );
};

export default SendMessageModal;
