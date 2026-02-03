import React from 'react';
import { X, Plus, Check } from 'lucide-react';
import { User } from '../types';

interface CaregiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  selectedUserId: string;
  onSelect: (user: User) => void;
  onAddNew: () => void;
}

const CaregiverModal: React.FC<CaregiverModalProps> = ({ 
  isOpen, 
  onClose, 
  users, 
  selectedUserId, 
  onSelect, 
  onAddNew 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in">
      <div className="w-full max-w-md bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-gray-900">다음 담당자 선택</h2>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* User List */}
        <div className="p-5 space-y-3">
          {users.map((user) => {
            const isSelected = user.id === selectedUserId;
            return (
              <button
                key={user.id}
                onClick={() => {
                    onSelect(user);
                    onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                    : 'border-gray-100 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className={`w-12 h-12 rounded-full border-2 ${isSelected ? 'border-indigo-200' : 'border-gray-100'}`}
                  />
                  <div className="text-left">
                    <p className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}

          {/* Add New Button */}
          <button
            onClick={onAddNew}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white">
                <Plus size={18} />
            </div>
            <span className="font-bold">새 담당자 등록하기</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-50 text-center text-xs text-gray-400">
            담당자를 변경하면 알림이 발송됩니다.
        </div>
      </div>
    </div>
  );
};

export default CaregiverModal;