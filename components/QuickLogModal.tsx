import React, { useState, useEffect } from 'react';
import { X, Clock, Check, Droplets, Baby, Utensils, Moon, Thermometer, Bath, Pill, Activity } from 'lucide-react';
import { LogType, LogSubType } from '../types';
import { format } from 'date-fns';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: LogType;
  onSave: (data: { type: LogType, subType?: LogSubType, time: Date, value?: string, note?: string }) => void;
}

const QuickLogModal: React.FC<QuickLogModalProps> = ({ isOpen, onClose, initialType, onSave }) => {
  const [activeType, setActiveType] = useState<LogType>(initialType);
  const [subType, setSubType] = useState<LogSubType | undefined>(undefined);
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [amount, setAmount] = useState<string>(''); // For ml or 'High/Low'
  const [note, setNote] = useState('');
  
  // Specific states for interactions
  const [pooAmount, setPooAmount] = useState('보통');
  const [feedingAmount, setFeedingAmount] = useState(120);

  useEffect(() => {
    if (isOpen) {
        setActiveType(initialType);
        setTime(format(new Date(), 'HH:mm'));
        setAmount('');
        setNote('');
        setSubType(undefined);
        
        // Set defaults
        if (initialType === 'diaper') setSubType('pee');
        if (initialType === 'feeding') setSubType('formula');
        if (initialType === 'sleep') setSubType('sleep_start');
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Construct Date from time string
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const logDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    let finalValue = amount;
    
    // Process values based on type
    if (activeType === 'diaper' && subType === 'poo') {
        finalValue = pooAmount;
    } else if (activeType === 'feeding' && subType === 'formula') {
        finalValue = `${feedingAmount}ml`;
    }

    onSave({
        type: activeType,
        subType,
        time: logDate,
        value: finalValue,
        note
    });
    onClose();
  };

  const tabs: { id: LogType, label: string, icon: React.ReactNode }[] = [
    { id: 'diaper', label: '기저귀', icon: <Baby size={18} /> },
    { id: 'feeding', label: '수유', icon: <Utensils size={18} /> },
    { id: 'sleep', label: '수면', icon: <Moon size={18} /> },
    { id: 'health', label: '건강/기타', icon: <Activity size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        
        {/* Header & Tabs */}
        <div className="bg-white border-b border-gray-100">
            <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                    <Clock size={16} className="text-gray-500" />
                    <input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bg-transparent text-sm font-bold text-gray-900 outline-none w-24"
                    />
                </div>
                <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                    <X size={20} className="text-gray-500" />
                </button>
            </div>
            
            {/* Type Tabs */}
            <div className="flex px-2 pb-2 gap-1 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveType(tab.id)}
                        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                            activeType === tab.id 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                    >
                        <div className="mb-1">{tab.icon}</div>
                        <span className="text-xs font-bold whitespace-nowrap">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 overflow-y-auto">
            
            {/* 1. Diaper Content */}
            {activeType === 'diaper' && (
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setSubType('pee')}
                            className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                                subType === 'pee' ? 'border-yellow-400 bg-yellow-50 text-yellow-700' : 'border-gray-100 text-gray-400'
                            }`}
                        >
                            <Droplets size={32} />
                            <span className="font-bold">소변</span>
                        </button>
                        <button 
                            onClick={() => setSubType('poo')}
                            className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                                subType === 'poo' ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-gray-100 text-gray-400'
                            }`}
                        >
                            <span className="text-3xl">💩</span>
                            <span className="font-bold">대변</span>
                        </button>
                    </div>

                    {subType === 'poo' && (
                        <div className="animate-fade-in bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                            <label className="text-xs font-bold text-amber-800 mb-3 block">대변 양</label>
                            <div className="flex gap-2 mb-4">
                                {['적음', '보통', '많음'].map((opt) => (
                                    <button 
                                        key={opt}
                                        onClick={() => setPooAmount(opt)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                                            pooAmount === opt ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-amber-700 border border-amber-200'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 2. Feeding Content */}
            {activeType === 'feeding' && (
                <div className="space-y-6">
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                         <button 
                            onClick={() => setSubType('formula')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${subType === 'formula' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                         >
                            분유
                         </button>
                         <button 
                            onClick={() => setSubType('breast')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${subType === 'breast' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                         >
                            모유
                         </button>
                         <button 
                            onClick={() => setSubType('food')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${subType === 'food' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                         >
                            이유식
                         </button>
                    </div>

                    {subType === 'formula' && (
                         <div className="text-center animate-fade-in">
                            <div className="text-5xl font-bold text-indigo-600 mb-2 font-mono">
                                {feedingAmount}<span className="text-2xl text-gray-400 ml-1">ml</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="300" 
                                step="10" 
                                value={feedingAmount}
                                onChange={(e) => setFeedingAmount(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-6"
                            />
                            <div className="grid grid-cols-4 gap-2">
                                {[40, 80, 120, 160, 200, 240].map(val => (
                                    <button 
                                        key={val} 
                                        onClick={() => setFeedingAmount(val)}
                                        className="py-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-100"
                                    >
                                        {val}ml
                                    </button>
                                ))}
                            </div>
                         </div>
                    )}

                    {subType === 'breast' && (
                        <div className="bg-pink-50 rounded-2xl p-6 text-center border border-pink-100">
                             <p className="text-pink-800 font-bold mb-4">수유 타이머</p>
                             <div className="flex justify-center gap-4">
                                <button className="w-24 h-24 rounded-full bg-white border-4 border-pink-200 flex flex-col items-center justify-center shadow-sm active:scale-95 transition-transform">
                                    <span className="text-xs text-gray-500 font-bold">왼쪽</span>
                                    <span className="text-xl font-bold text-pink-500">Start</span>
                                </button>
                                <button className="w-24 h-24 rounded-full bg-white border-4 border-pink-200 flex flex-col items-center justify-center shadow-sm active:scale-95 transition-transform">
                                    <span className="text-xs text-gray-500 font-bold">오른쪽</span>
                                    <span className="text-xl font-bold text-pink-500">Start</span>
                                </button>
                             </div>
                        </div>
                    )}
                </div>
            )}

            {/* 3. Sleep Content */}
            {activeType === 'sleep' && (
                 <div className="space-y-4">
                    <button 
                        onClick={() => setSubType('sleep_start')}
                        className={`w-full py-6 rounded-2xl border-2 flex items-center justify-between px-6 transition-all ${
                            subType === 'sleep_start' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-200 rounded-full text-indigo-700"><Moon size={20}/></div>
                            <div className="text-left">
                                <p className="font-bold text-lg text-gray-900">잠들었어요</p>
                                <p className="text-xs text-gray-500">수면 시작 시간 기록</p>
                            </div>
                        </div>
                        {subType === 'sleep_start' && <Check size={24} className="text-indigo-600"/>}
                    </button>

                    <button 
                        onClick={() => setSubType('sleep_end')}
                        className={`w-full py-6 rounded-2xl border-2 flex items-center justify-between px-6 transition-all ${
                            subType === 'sleep_end' ? 'border-orange-500 bg-orange-50' : 'border-gray-100'
                        }`}
                    >
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-200 rounded-full text-orange-700"><Activity size={20}/></div>
                            <div className="text-left">
                                <p className="font-bold text-lg text-gray-900">일어났어요</p>
                                <p className="text-xs text-gray-500">기상 시간 기록</p>
                            </div>
                        </div>
                        {subType === 'sleep_end' && <Check size={24} className="text-orange-600"/>}
                    </button>
                 </div>
            )}

            {/* 4. Health/More Content */}
            {activeType === 'health' && (
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setSubType('bath')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                            subType === 'bath' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500'
                        }`}
                    >
                        <Bath size={28} />
                        <span className="font-bold">목욕</span>
                    </button>
                    <button 
                        onClick={() => setSubType('fever_mild')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                            subType === 'fever_mild' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 text-gray-500'
                        }`}
                    >
                        <Thermometer size={28} />
                        <span className="font-bold">체온 측정</span>
                    </button>
                    <button 
                        onClick={() => setSubType('medicine')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                            subType === 'medicine' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-500'
                        }`}
                    >
                        <Pill size={28} />
                        <span className="font-bold">약 복용</span>
                    </button>
                     <button 
                        onClick={() => setSubType('tummy_time')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                            subType === 'tummy_time' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-500'
                        }`}
                    >
                        <Activity size={28} />
                        <span className="font-bold">터미타임</span>
                    </button>
                 </div>
            )}

            {/* Common Note Input */}
            <div className="mt-6">
                <input 
                    type="text" 
                    placeholder="메모를 입력하세요 (선택)" 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

        </div>

        {/* Footer Save Button */}
        <div className="p-4 bg-white border-t border-gray-100">
            <button 
                onClick={handleSave}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 active:scale-[0.98] transition-transform"
            >
                기록 저장
            </button>
        </div>

      </div>
    </div>
  );
};

export default QuickLogModal;
