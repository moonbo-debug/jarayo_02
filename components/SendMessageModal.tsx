
import React, { useState } from 'react';
import { X, Send, Heart, ThumbsUp, Coffee, Zap, Gift, MessageCircle } from 'lucide-react';
import { User } from '../types';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User;
  onSend: (message: string) => void;
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({ isOpen, onClose, targetUser, onSend }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
      if(!message.trim()) return;
      onSend(message);
      setMessage('');
      onClose();
  };

  const handleQuickReaction = (text: string) => {
      setMessage(text);
  };

  const quickReactions = [
      { icon: <Heart size={18} />, label: "사랑해", text: "오늘도 고마워 사랑해! ❤️" },
      { icon: <ThumbsUp size={18} />, label: "최고야", text: "진짜 고생했어, 당신이 최고야! 👍" },
      { icon: <Coffee size={18} />, label: "커피수혈", text: "이따가 커피 한잔 어때? ☕️" },
      { icon: <Zap size={18} />, label: "화이팅", text: "조금만 더 힘내자 화이팅! ⚡️" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up font-sans">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <img src={targetUser.avatar} alt={targetUser.name} className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50" />
                    <div className="absolute -bottom-1 -right-1 bg-black text-white p-0.5 rounded-full border border-white">
                        <MessageCircle size={10} />
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-sm">응원 메시지 보내기</h3>
                    <p className="text-xs text-gray-500 font-bold">To. {targetUser.name}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-black p-2 rounded-full hover:bg-gray-50 transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-5">
            {/* Quick Reactions */}
            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">빠른 문구 선택</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
                {quickReactions.map((reaction, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleQuickReaction(reaction.text)}
                        className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white hover:border-black hover:bg-gray-50 transition-all active:scale-95 group text-left"
                    >
                        <span className="text-gray-400 group-hover:text-black">{reaction.icon}</span>
                        <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">{reaction.label}</span>
                    </button>
                ))}
            </div>

            {/* Custom Message */}
            <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">직접 입력</p>
            <div className="relative">
                <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="따뜻한 한마디를 남겨주세요..."
                    className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-black focus:ring-0 resize-none mb-3 font-medium placeholder-gray-400 text-gray-900"
                />
            </div>
            
            <button 
                onClick={handleSend}
                disabled={!message.trim()}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    message.trim() 
                    ? 'bg-black text-white shadow-lg active:scale-95 hover:bg-gray-800' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
