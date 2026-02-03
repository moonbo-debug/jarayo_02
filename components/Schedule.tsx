import React, { useState } from 'react';
import { ChevronLeft, Settings, Plus, UserPlus, Sparkles, X, Clock, GripHorizontal, Trash2, Check, CalendarDays } from 'lucide-react';
import { ScheduleItem } from '../types';

// Helper for User Mapping to keep avatars consistent
const USERS_MAP: Record<string, { id: string, avatar: string }> = {
    '아빠': { id: 'u1', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix' },
    '엄마': { id: 'u2', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka' },
    '할머니': { id: 'u3', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Grandma' },
    '가사도우미': { id: 'helper', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Liliana' },
};

// Mock Initial Data
const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 's1',
    userId: 'u2',
    userName: '엄마',
    userAvatar: USERS_MAP['엄마'].avatar,
    startTime: '08:00',
    endTime: '10:00',
    type: 'care',
    description: '등원 담당',
  },
  {
    id: 's1-2', // Added consecutive slot for demo
    userId: 'u2',
    userName: '엄마',
    userAvatar: USERS_MAP['엄마'].avatar,
    startTime: '10:00',
    endTime: '13:00',
    type: 'chores',
    description: '집안일',
  },
  {
    id: 's3',
    userId: 'u3',
    userName: '할머니',
    userAvatar: USERS_MAP['할머니'].avatar,
    startTime: '13:00',
    endTime: '18:00',
    type: 'play',
    description: '놀이 시간',
  },
  {
    id: 's4',
    userId: 'u1',
    userName: '아빠',
    userAvatar: USERS_MAP['아빠'].avatar,
    startTime: '18:30',
    endTime: '21:00',
    type: 'care',
    description: '목욕/취침',
  }
];

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(1); // Default to '16th (Mon)'
  
  // Handlers
  const handleEdit = (item: ScheduleItem) => {
    if (item.type === 'empty') {
        // If clicking an empty slot, prepare it for 'care' creation by default
        setEditingItem({ 
            ...item, 
            type: 'care', 
            description: '', 
            userName: '아빠', // Default user
            userId: USERS_MAP['아빠'].id,
            userAvatar: USERS_MAP['아빠'].avatar
        });
    } else {
        setEditingItem({ ...item }); // Clone for editing
    }
  };

  const handleDelete = () => {
    if (editingItem) {
        // Check if the item in the list was ALREADY empty (meaning user wants to remove the slot entirely)
        const originalItem = schedule.find(i => i.id === editingItem.id);
        
        if (originalItem && originalItem.type === 'empty') {
            // Completely remove the slot
            setSchedule(prev => prev.filter(i => i.id !== editingItem.id));
        } else {
            // Convert to 'empty' slot instead of shifting up
            setSchedule(prev => prev.map(item => item.id === editingItem.id ? {
                ...item,
                type: 'empty',
                userId: '',
                userName: '',
                userAvatar: '',
                description: '빈 시간'
            } : item));
        }
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
      // Create a temp item
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
    <div className="bg-white min-h-screen pb-32">
      {/* Header (Padding unified to px-5) */}
      <div className="flex justify-between items-center px-5 py-3 bg-white sticky top-0 z-20 shadow-sm border-b border-gray-50">
        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full -ml-2">
            <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-lg text-gray-900">교대 일정표</h1>
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full -mr-2">
            <Settings size={24} />
        </button>
      </div>

      {/* Month & Avatar Row */}
      <div className="px-5 flex justify-between items-center mb-4 mt-4">
        <div className="flex items-center gap-2">
            <button className="text-gray-400"><ChevronLeft size={16} /></button>
            <h2 className="text-xl font-bold text-gray-900">2023년 10월</h2>
            <button className="text-gray-400 rotate-180"><ChevronLeft size={16} /></button>
        </div>
        <div className="flex -space-x-2">
            {Object.values(USERS_MAP).slice(0, 3).map((u) => (
                <img key={u.id} src={u.avatar} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100" alt="User" />
            ))}
            <button className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200">
                <Plus size={14} />
            </button>
        </div>
      </div>

      {/* Date Strip */}
      <div className="px-2 mb-6">
        <div className="flex justify-between items-center">
            {days.map((d, i) => {
                const active = i === selectedDateIndex;
                return (
                    <button 
                        key={i} 
                        onClick={() => setSelectedDateIndex(i)}
                        className={`flex flex-col items-center justify-center w-11 h-16 rounded-2xl transition-all ${active ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 scale-105' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        <span className={`text-xs mb-1 ${active ? 'font-medium opacity-80' : ''}`}>{d.weekday}</span>
                        <span className={`text-lg font-bold ${active ? '' : 'text-gray-800'}`}>{d.day}</span>
                        {active && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
                    </button>
                )
            })}
        </div>
      </div>

      {/* Timeline Area (Padding unified to px-5) */}
      <div className="relative px-5">
        
        {/* Vertical Dashed Line */}
        <div className="absolute left-[74px] top-0 bottom-0 w-px border-r border-dashed border-gray-200 h-full"></div>

        {/* Dynamic Items */}
        {schedule.map((item, index) => {
            // HANDLE EMPTY SLOT
            if (item.type === 'empty') {
                return (
                    <div key={item.id} className="flex mb-4 group relative cursor-pointer" onClick={() => handleEdit(item)}>
                        <div className="w-14 text-right text-xs text-gray-400 font-mono pt-4 pr-4">{item.startTime}</div>
                        <div className="flex-1 relative">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center bg-gray-50/50 hover:bg-gray-100 hover:border-blue-300 transition-all min-h-[80px]">
                                <span className="text-xs text-gray-400 font-bold flex items-center gap-1 group-hover:text-blue-500">
                                    <Plus size={14} /> 터치하여 일정 추가
                                </span>
                            </div>
                        </div>
                    </div>
                );
            }

            const isChores = item.type === 'chores';
            const isPlay = item.type === 'play';
            
            // Colors based on type
            let bgColor = 'bg-blue-50 border-blue-500';
            let textColor = 'text-blue-600';
            
            if (isChores) {
                bgColor = 'bg-purple-50 border-purple-200';
                textColor = 'text-purple-600';
            } else if (isPlay) {
                bgColor = 'bg-red-50 border-red-400';
                textColor = 'text-red-500';
            } else if (item.userName === '아빠') {
                bgColor = 'bg-green-50 border-green-500';
                textColor = 'text-green-600';
            }

            // Logic to merge visual boxes if adjacent items are same user
            const nextItem = schedule[index + 1];
            const prevItem = schedule[index - 1];
            
            const isConnectedToNext = nextItem && nextItem.userId === item.userId && nextItem.type !== 'empty';
            const isConnectedToPrev = prevItem && prevItem.userId === item.userId && prevItem.type !== 'empty';
            
            let borderRadiusClass = 'rounded-xl';
            let marginBottomClass = 'mb-4';
            let borderBottomClass = '';

            if (isConnectedToNext) {
                borderRadiusClass = 'rounded-t-xl rounded-b-none';
                marginBottomClass = 'mb-0';
                borderBottomClass = 'border-b-0 pb-6'; // Extend padding to cover gap
            }
            if (isConnectedToPrev) {
                borderRadiusClass = 'rounded-t-none rounded-b-xl';
                if (isConnectedToNext) {
                    borderRadiusClass = 'rounded-none'; // Middle item
                }
            }
            
            return (
                <div key={item.id} className={`flex ${marginBottomClass} relative group animate-fade-in`} onClick={() => handleEdit(item)}>
                    <div className="w-14 text-right text-xs text-gray-400 font-mono pt-2 pr-4">
                        {/* Only show time if NOT connected to previous (to avoid clutter) or show distinct times? Keeping simple for now */}
                        {!isConnectedToPrev && item.startTime}
                    </div>
                    <div className="flex-1 relative">
                        <div className={`${bgColor} ${borderRadiusClass} ${borderBottomClass} p-3 border-l-4 relative min-h-[80px] active:scale-[0.98] transition-transform cursor-pointer shadow-sm hover:shadow-md`}>
                            {/* Header: Hide if connected to previous to reduce noise */}
                            {!isConnectedToPrev && (
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <img src={item.userAvatar} className="w-6 h-6 rounded-full bg-white border border-gray-100 object-cover" />
                                        <span className="font-bold text-gray-800">{item.userName}</span>
                                    </div>
                                    {/* Type Badge - Always show to distinguish activity */}
                                    <span className={`text-[10px] ${textColor} bg-white px-2 py-0.5 rounded-full border border-gray-100 font-bold`}>
                                        {item.type === 'care' ? '육아' : item.type === 'chores' ? '가사' : '놀이'}
                                    </span>
                                </div>
                            )}
                            
                            {isConnectedToPrev && (
                                <div className="absolute top-2 right-3">
                                     <span className={`text-[10px] ${textColor} bg-white px-2 py-0.5 rounded-full border border-gray-100 font-bold opacity-80`}>
                                        {item.type === 'care' ? '육아' : item.type === 'chores' ? '가사' : '놀이'}
                                    </span>
                                </div>
                            )}

                            {/* Aligned Text: Always use ml-8 to match the indentation of the avatar version */}
                            <p className={`text-sm font-bold text-gray-800 ml-8 ${isConnectedToPrev ? 'mt-1' : 'mt-1'}`}>{item.description}</p>
                            <p className={`text-xs text-gray-500 mt-0.5 font-mono ml-8`}>{item.startTime} - {item.endTime}</p>

                             {/* Drag Handle Visual */}
                             {!isConnectedToNext && (
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-black/10">
                                    <GripHorizontal size={16} />
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            );
        })}

        {/* Current Time Indicator */}
        <div className="absolute top-[350px] left-0 right-0 flex items-center pointer-events-none z-10 opacity-70">
            <div className="w-14 text-right text-xs font-bold text-blue-500 pr-4">15:00</div>
            <div className="flex-1 h-px bg-blue-500 relative">
                <div className="absolute -left-1 -top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
        </div>

        {/* Empty Slot (Bottom) */}
        <div className="flex mb-4 mt-6" onClick={() => handleCreateNew('18:00')}>
            <div className="w-14 text-right text-xs text-gray-400 font-mono pr-4">18:00</div>
            <div className="flex-1 border-t border-b border-gray-100 py-4 flex justify-center bg-gray-50/50 rounded-lg hover:bg-gray-100 cursor-pointer border-dashed transition-colors">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Plus size={12} /> 터치하여 일정 추가
                </span>
            </div>
        </div>

      </div>

      {/* Floating Bottom Button */}
      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-20 pointer-events-none">
         <button 
            onClick={() => handleCreateNew('09:00')}
            className="pointer-events-auto w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
         >
            <UserPlus size={18} />
            담당자 배정하기
         </button>
      </div>

      {/* Edit Modal (Bottom Sheet) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CalendarDays size={20} className="text-indigo-500" />
                        일정 상세 편집
                    </h3>
                    <button onClick={() => setEditingItem(null)} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100">
                        <X size={20}/>
                    </button>
                </div>
                
                <div className="space-y-6">
                    {/* 1. Time Selection */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">시간 설정</label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500">
                                <input 
                                    type="time"
                                    value={editingItem.startTime}
                                    onChange={(e) => setEditingItem({...editingItem, startTime: e.target.value})}
                                    className="bg-transparent font-mono font-bold text-xl outline-none w-full text-center"
                                />
                            </div>
                            <span className="text-gray-300 font-bold">-</span>
                             <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2 flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500">
                                <input 
                                    type="time"
                                    value={editingItem.endTime}
                                    onChange={(e) => setEditingItem({...editingItem, endTime: e.target.value})}
                                    className="bg-transparent font-mono font-bold text-xl outline-none w-full text-center"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Type Selection */}
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
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                                            isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {labels[type]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Activity Description */}
                    <div>
                         <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">내용</label>
                         <input 
                            type="text" 
                            placeholder="예: 등원시키기, 이유식 먹이기"
                            value={editingItem.description} 
                            onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                         />
                    </div>

                    {/* 4. Assignee */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">담당자</label>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {Object.keys(USERS_MAP).map(name => {
                                const isActive = editingItem.userName === name;
                                return (
                                    <button 
                                        key={name}
                                        onClick={() => handleUserChange(name)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-w-[80px] ${
                                            isActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 bg-white'
                                        }`}
                                    >
                                        <div className="relative">
                                            <img src={USERS_MAP[name].avatar} className="w-10 h-10 rounded-full bg-white" />
                                            {isActive && (
                                                <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-0.5 border-2 border-white">
                                                    <Check size={10} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-xs font-bold ${isActive ? 'text-indigo-700' : 'text-gray-600'}`}>{name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 mt-8 pt-4 border-t border-gray-50">
                     <button 
                        onClick={handleDelete}
                        className="flex-1 py-4 rounded-xl font-bold text-red-500 bg-red-50 hover:bg-red-100 flex items-center justify-center gap-2 transition-colors"
                     >
                        <Trash2 size={18} /> {editingItem.type === 'empty' ? '슬롯 제거' : '삭제'}
                     </button>
                     <button 
                        onClick={handleSave} 
                        className="flex-[2] py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
                     >
                        <Check size={20} /> 저장하기
                     </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Schedule;