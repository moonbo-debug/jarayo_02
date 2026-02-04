
import React, { useState } from 'react';
import { Settings, Plus, UserPlus, X, Check } from 'lucide-react';
import { ScheduleItem } from '../types';

// Helper for User Mapping
const USERS_MAP: Record<string, { id: string, avatar: string, role: string }> = {
    '아빠': { id: 'u1', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix', role: 'Dad' },
    '엄마': { id: 'u2', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka', role: 'Mom' },
    '할머니': { id: 'u3', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Grandma', role: 'Grandma' },
    '이모님': { id: 'helper', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Liliana', role: 'Helper' },
};

// Fixed Mock Data as requested
const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 's1',
    userId: 'u1',
    userName: '아빠',
    userAvatar: USERS_MAP['아빠'].avatar,
    startTime: '07:00',
    endTime: '09:00',
    type: 'care',
    description: '기상 및 아침 수유',
  },
  {
    id: 's2',
    userId: 'u2',
    userName: '엄마',
    userAvatar: USERS_MAP['엄마'].avatar,
    startTime: '09:00',
    endTime: '13:00',
    type: 'chores',
    description: '등원 담당 & 집안일',
  },
  {
    id: 's3',
    userId: 'helper',
    userName: '이모님',
    userAvatar: USERS_MAP['이모님'].avatar,
    startTime: '13:00',
    endTime: '18:00',
    type: 'play',
    description: '놀이 시간 & 간식',
  },
  {
    id: 's4',
    userId: 'joint', 
    userName: '엄마, 아빠',
    userAvatar: USERS_MAP['아빠'].avatar,
    startTime: '18:00',
    endTime: '21:00',
    type: 'care',
    description: '목욕 및 밤잠 준비',
  }
];

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(1); 
  
  // Fixed Demo Time
  const CURRENT_TIME_STRING = "09:00";

  // Handlers
  const handleEdit = (item: ScheduleItem) => {
      setEditingItem({ ...item });
  };

  const handleDelete = () => {
    if (editingItem) {
        setSchedule(prev => prev.filter(i => i.id !== editingItem.id));
        setEditingItem(null);
    }
  };

  const handleSave = () => {
    if (editingItem) {
        setSchedule(prev => {
            const exists = prev.find(i => i.id === editingItem.id);
            if (exists) {
                return prev.map(item => item.id === editingItem.id ? editingItem : item);
            } else {
                return [...prev, editingItem].sort((a, b) => a.startTime.localeCompare(b.startTime));
            }
        });
        setEditingItem(null);
    }
  };

  const handleCreateNew = (startTime: string) => {
      const newItem: ScheduleItem = {
          id: Date.now().toString(),
          userId: 'u1',
          userName: '아빠',
          userAvatar: USERS_MAP['아빠'].avatar,
          startTime: startTime,
          endTime:  (parseInt(startTime.split(':')[0]) + 1).toString().padStart(2, '0') + ":00",
          type: 'care',
          description: '새 일정',
      };
      setEditingItem(newItem);
  };

  const handleUserChange = (name: string) => {
      if (editingItem && USERS_MAP[name]) {
          setEditingItem({
              ...editingItem,
              userName: name,
              userId: USERS_MAP[name].id,
              userAvatar: USERS_MAP[name].avatar
          });
      }
  };

  const days = [
    { day: '15', weekday: '일' },
    { day: '16', weekday: '월' },
    { day: '17', weekday: '화' },
    { day: '18', weekday: '수' },
    { day: '19', weekday: '목' },
    { day: '20', weekday: '금' },
    { day: '21', weekday: '토' },
  ];

  return (
    <div className="bg-[#F9FAFB] min-h-screen pb-32 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-6 bg-[#F9FAFB] sticky top-0 z-20">
        <h1 className="font-bold text-2xl text-gray-900 tracking-tight">교대 일정표</h1>
        <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full -mr-2">
            <Settings size={24} />
        </button>
      </div>

      {/* Date Strip */}
      <div className="px-2 mb-8">
        <div className="flex justify-between items-center">
            {days.map((d, i) => {
                const active = i === selectedDateIndex;
                return (
                    <button 
                        key={i} 
                        onClick={() => setSelectedDateIndex(i)}
                        className={`flex flex-col items-center justify-center w-11 h-16 rounded-2xl transition-all ${active ? 'bg-black text-white shadow-md scale-105' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        <span className={`text-xs mb-1 ${active ? 'font-medium opacity-80' : ''}`}>{d.weekday}</span>
                        <span className={`text-lg font-bold ${active ? 'text-lime-400' : 'text-gray-900'}`}>{d.day}</span>
                        {active && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
                    </button>
                )
            })}
        </div>
      </div>

      {/* Timeline Area */}
      <div className="relative px-5 pb-20">
        
        {/* Vertical Line */}
        <div className="absolute left-[70px] top-4 bottom-0 w-px border-r border-dashed border-gray-300 h-full"></div>

        {/* Dynamic Items */}
        {schedule.map((item, index) => {
            const isJoint = item.userId === 'joint';
            const isMe = item.userName === '아빠';
            
            // Render Avatar(s)
            const renderAvatar = () => {
                if (isJoint) {
                    return (
                        <div className="flex -space-x-2 mr-3">
                             <img src={USERS_MAP['아빠'].avatar} className="w-10 h-10 rounded-full border-2 border-white bg-gray-50" />
                             <img src={USERS_MAP['엄마'].avatar} className="w-10 h-10 rounded-full border-2 border-white bg-gray-50" />
                        </div>
                    );
                }
                return (
                    <img src={item.userAvatar} className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 object-cover mr-3" />
                );
            };

            return (
                <div key={item.id} className="flex mb-8 relative group animate-fade-in" onClick={() => handleEdit(item)}>
                    {/* Time Column */}
                    <div className="w-14 text-right pr-4 pt-1 shrink-0">
                        <span className="text-xs font-mono font-bold text-gray-400 block">{item.startTime}</span>
                    </div>

                    {/* Card Column */}
                    <div className="flex-1 relative">
                        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm active:scale-[0.99] transition-transform cursor-pointer hover:border-gray-300">
                             {/* Badge (Top Right) */}
                             <div className="absolute top-5 right-5">
                                 <span className={`text-[10px] px-2 py-1 rounded font-bold border ${isMe ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200'}`}>
                                    {item.type === 'care' ? '육아' : item.type === 'chores' ? '가사' : '놀이'}
                                </span>
                             </div>

                             {/* User Info */}
                             <div className="flex items-center mb-3">
                                 {renderAvatar()}
                                 <span className="font-bold text-gray-900 text-base">{item.userName}</span>
                             </div>

                             {/* Description */}
                             <h3 className="text-base font-bold text-gray-900 mb-1">{item.description}</h3>
                             <p className="text-xs text-gray-400 font-mono">
                                 {item.startTime} - {item.endTime}
                             </p>
                        </div>
                    </div>
                </div>
            );
        })}

        {/* Current Time Indicator (Fixed at 09:00 position) */}
        <div className="absolute top-[135px] left-0 right-0 flex items-center pointer-events-none z-10">
            <div className="w-14 text-right pr-4">
                 <span className="text-xs font-bold text-lime-600 block">{CURRENT_TIME_STRING}</span>
            </div>
            <div className="flex-1 h-px bg-lime-500 relative">
                <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-lime-500 rounded-full ring-4 ring-white"></div>
            </div>
        </div>

        {/* Empty Slot (Bottom) */}
        <div className="flex mb-4 mt-2" onClick={() => handleCreateNew('21:00')}>
            <div className="w-14 text-right text-xs text-gray-400 font-mono pr-4 pt-4">21:00</div>
            <div className="flex-1 border border-gray-200 py-4 flex justify-center bg-white rounded-2xl hover:bg-gray-50 cursor-pointer border-dashed transition-colors shadow-sm">
                <span className="text-xs text-gray-400 flex items-center gap-1 font-bold">
                    <Plus size={14} /> 터치하여 추가
                </span>
            </div>
        </div>

      </div>

      {/* Floating Bottom Button */}
      <div className="fixed bottom-24 left-0 right-0 px-5 max-w-md mx-auto z-30 pointer-events-none">
         <button 
            onClick={() => handleCreateNew('09:00')}
            className="pointer-events-auto w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
         >
            <UserPlus size={18} />
            담당자 배정하기
         </button>
      </div>

      {/* Edit Modal (Bottom Sheet) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        일정 상세 편집
                    </h3>
                    <button onClick={() => setEditingItem(null)} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black">
                        <X size={20}/>
                    </button>
                </div>
                
                <div className="space-y-6">
                    {/* Time */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">시간 설정</label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-50 rounded-xl px-3 py-3 flex items-center border border-gray-200 focus-within:border-black">
                                <input 
                                    type="time"
                                    value={editingItem.startTime}
                                    onChange={(e) => setEditingItem({...editingItem, startTime: e.target.value})}
                                    className="bg-transparent font-mono font-bold text-xl outline-none w-full text-center"
                                />
                            </div>
                            <span className="text-gray-300 font-bold">-</span>
                             <div className="flex-1 bg-gray-50 rounded-xl px-3 py-3 flex items-center border border-gray-200 focus-within:border-black">
                                <input 
                                    type="time"
                                    value={editingItem.endTime}
                                    onChange={(e) => setEditingItem({...editingItem, endTime: e.target.value})}
                                    className="bg-transparent font-mono font-bold text-xl outline-none w-full text-center"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Type */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">활동 유형</label>
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            {(['care', 'chores', 'play'] as const).map((type) => {
                                const isActive = editingItem.type === type;
                                const labels: Record<string, string> = { care: '육아', chores: '가사', play: '놀이' };
                                return (
                                    <button
                                        key={type}
                                        onClick={() => setEditingItem({...editingItem, type})}
                                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                                            isActive ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                    >
                                        {labels[type]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Assignee (User Selection) */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">담당자 변경</label>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {Object.keys(USERS_MAP).map(name => {
                                const isActive = editingItem.userName === name;
                                return (
                                    <button 
                                        key={name}
                                        onClick={() => handleUserChange(name)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all min-w-[80px] ${
                                            isActive ? 'border-black bg-black text-white' : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="relative">
                                            <img src={USERS_MAP[name].avatar} className="w-10 h-10 rounded-full bg-white border border-gray-100" />
                                            {isActive && (
                                                <div className="absolute -bottom-1 -right-1 bg-lime-400 text-black rounded-full p-0.5 border-2 border-black">
                                                    <Check size={10} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>{name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                         <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">내용</label>
                         <input 
                            type="text" 
                            placeholder="예: 등원시키기"
                            value={editingItem.description} 
                            onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:border-black" 
                         />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-3 mt-8 pt-4 border-t border-gray-50">
                        <button 
                            onClick={handleDelete}
                            className="flex-1 py-4 rounded-xl font-bold text-red-500 bg-white border border-red-100 hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
                        >
                            삭제
                        </button>
                        <button 
                            onClick={handleSave} 
                            className="flex-[2] py-4 rounded-xl font-bold text-white bg-black hover:bg-gray-800 flex items-center justify-center gap-2 transition-transform active:scale-95"
                        >
                            <Check size={20} /> 저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Schedule;
