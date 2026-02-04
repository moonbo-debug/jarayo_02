
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
  const [amount, setAmount] = useState<string>(''); 
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
        
        // Auto-select subtype based on initialType to ensure focus
        if (initialType === 'diaper') setSubType('pee');
        else if (initialType === 'feeding') setSubType('formula');
        else if (initialType === 'sleep') setSubType('sleep_start');
        else setSubType(undefined);
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleSave = () => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const logDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    let finalValue = amount;
    
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
      <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col font-sans">
        
        {/* Header & Tabs */}
        <div className="bg-white border-b border-gray-100">
            <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
                    <Clock size={16} className="text-gray-500" />
                    <input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bg-transparent text-sm font-bold text-gray-900 outline-none w-24"
                    />
                </div>
                <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 hover:text-black text-gray-400">
                    <X size={20} />
                </button>
            </div>
            
            {/* Type Tabs */}
            <div className="flex px-3 pb-3 gap-2 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveType(tab.id)}
                        className={`flex-1 flex flex-col items-center justify-center py-3 px-1 rounded-xl transition-all border ${
                            activeType === tab.id 
                            ? 'bg-black text-white border-black shadow-md' 
                            : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600'
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
                            className={`flex-1 py-6 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                                subType === 'pee' ? 'border-black bg-gray-50 text-black ring-1 ring-black' : 'border-gray-200 text-gray-400 hover:border-gray-300'
                            }`}
                        >
                            <Droplets size={32} className={subType === 'pee' ? 'text-blue-500' : 'text-gray-300'} />
                            <span className="font-bold">소변</span>
                        </button>
                        <button 
                            onClick={() => setSubType('poo')}
                            className={`flex-1 py-6 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                                subType === 'poo' ? 'border-black bg-gray-50 text-black ring-1 ring-black' : 'border-gray-200 text-gray-400 hover:border-gray-300'
                            }`}
                        >
                            <span className="text-3xl grayscale-[0.5]">💩</span>
                            <span className="font-bold">대변</span>
                        </button>
                    </div>

                    {subType === 'poo' && (
                        <div className="animate-fade-in bg-gray-50 p-4 rounded-2xl border border-gray-200">
                            <label className="text-xs font-bold text-gray-500 mb-3 block">대변 양</label>
                            <div className="flex gap-2 mb-1">
                                {['적음', '보통', '많음'].map((opt) => (
                                    <button 
                                        key={opt}
                                        onClick={() => setPooAmount(opt)}
                                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${
                                            pooAmount === opt ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'
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
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${subType === 'formula' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
                         >
                            분유
                         </button>
                         <button 
                            onClick={() => setSubType('breast')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${subType === 'breast' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
                         >
                            모유
                         </button>
                         <button 
                            onClick={() => setSubType('food')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${subType === 'food' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}
                         >
                            이유식
                         </button>
                    </div>

                    {subType === 'formula' && (
                         <div className="text-center animate-fade-in">
                            <div className="text-5xl font-black text-gray-900 mb-2 font-mono tracking-tight">
                                {feedingAmount}<span className="text-2xl text-gray-300 ml-1 font-bold">ml</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="300" 
                                step="10" 
                                value={feedingAmount}
                                onChange={(e) => setFeedingAmount(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mb-8"
                            />
                            <div className="grid grid-cols-4 gap-2">
                                {[40, 80, 120, 160, 200, 240].map(val => (
                                    <button 
                                        key={val} 
                                        onClick={() => setFeedingAmount(val)}
                                        className="py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:border-black hover:text-black transition-colors"
                                    >
                                        {val}ml
                                    </button>
                                ))}
                            </div>
                         </div>
                    )}

                    {subType === 'breast' && (
                        <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
                             <p className="text-gray-500 font-bold mb-6 text-xs uppercase tracking-wide">수유 타이머</p>
                             <div className="flex justify-center gap-4">
                                <button className="w-24 h-24 rounded-full bg-white border-4 border-gray-100 flex flex-col items-center justify-center shadow-sm active:scale-95 transition-transform hover:border-lime-400 group">
                                    <span className="text-xs text-gray-400 font-bold mb-1">왼쪽</span>
                                    <span className="text-xl font-black text-gray-900 group-hover:text-lime-600">Start</span>
                                </button>
                                <button className="w-24 h-24 rounded-full bg-white border-4 border-gray-100 flex flex-col items-center justify-center shadow-sm active:scale-95 transition-transform hover:border-lime-400 group">
                                    <span className="text-xs text-gray-400 font-bold mb-1">오른쪽</span>
                                    <span className="text-xl font-black text-gray-900 group-hover:text-lime-600">Start</span>
                                </button>
                             </div>
                        </div>
                    )}
                </div>
            )}

            {/* 3. Sleep Content */}
            {activeType === 'sleep' && (
                 <div className="space-y-3">
                    <button 
                        onClick={() => setSubType('sleep_start')}
                        className={`w-full py-5 rounded-2xl border flex items-center justify-between px-6 transition-all ${
                            subType === 'sleep_start' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 bg-white'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${subType === 'sleep_start' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <Moon size={20} fill={subType === 'sleep_start' ? 'currentColor' : 'none'}/>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-lg text-gray-900">잠들었어요</p>
                                <p className="text-xs text-gray-500">수면 시작 시간 기록</p>
                            </div>
                        </div>
                        {subType === 'sleep_start' && <Check size={20} className="text-black"/>}
                    </button>

                    <button 
                        onClick={() => setSubType('sleep_end')}
                        className={`w-full py-5 rounded-2xl border flex items-center justify-between px-6 transition-all ${
                            subType === 'sleep_end' ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 bg-white'
                        }`}
                    >
                         <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${subType === 'sleep_end' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <Activity size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-lg text-gray-900">일어났어요</p>
                                <p className="text-xs text-gray-500">기상 시간 기록</p>
                            </div>
                        </div>
                        {subType === 'sleep_end' && <Check size={20} className="text-black"/>}
                    </button>
                 </div>
            )}

            {/* 4. Health/More Content */}
            {activeType === 'health' && (
                 <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'bath', label: '목욕', icon: Bath },
                        { id: 'fever_mild', label: '체온 측정', icon: Thermometer },
                        { id: 'medicine', label: '약 복용', icon: Pill },
                        { id: 'tummy_time', label: '터미타임', icon: Activity }
                    ].map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => setSubType(item.id as LogSubType)}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                subType === item.id 
                                ? 'border-black bg-gray-50 text-black ring-1 ring-black' 
                                : 'border-gray-200 text-gray-400 hover:border-gray-300'
                            }`}
                        >
                            <item.icon size={28} strokeWidth={1.5} />
                            <span className="font-bold">{item.label}</span>
                        </button>
                    ))}
                 </div>
            )}

            {/* Common Note Input */}
            <div className="mt-6">
                <input 
                    type="text" 
                    placeholder="메모를 입력하세요 (선택)" 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black font-medium"
                />
            </div>

        </div>

        {/* Footer Save Button */}
        <div className="p-4 bg-white border-t border-gray-100">
            <button 
                onClick={handleSave}
                className="w-full py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-transform"
            >
                기록 저장
            </button>
        </div>

      </div>
    </div>
  );
};

export default QuickLogModal;
