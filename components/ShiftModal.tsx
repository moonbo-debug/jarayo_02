
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Battery, BatteryWarning, Zap, Send, Clock, Sparkles, Smile, Frown, Moon, Thermometer, AlertTriangle, Plus, Trash2, Lock, Milk, Flame, Coffee, Baby } from 'lucide-react';
import { EnergyLevel, ShiftReport, BabyMood, Mission } from '../types';
import { format, addMinutes } from 'date-fns';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: ShiftReport) => void;
}

const NEXT_ACTION_TAGS = ['수유', '재우기', '목욕', '약 먹이기', '놀아주기', '설거지', '빨래'];

const ShiftModal: React.FC<ShiftModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL Params
  const moodsFromUrl = searchParams.get('moods')?.split(',').filter(Boolean) as BabyMood[] || ['happy'];
  const energyFromUrl = (searchParams.get('energy') as EnergyLevel) || 'medium';

  // Local state for things that don't need instant URL reflection (like text input)
  // or sync them too if desired. For now, we sync the main "Selections".
  
  const [missions, setMissions] = useState<Mission[]>([]);
  const [nextAction, setNextAction] = useState('');
  const [nextActionTime, setNextActionTime] = useState('');
  const [wishlist, setWishlist] = useState('');
  const [briefing, setBriefing] = useState('');
  const [isEarlyExit, setIsEarlyExit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentHour = new Date().getHours();
      const scheduledEnd = 21; 
      setIsEarlyExit(currentHour < scheduledEnd);

      const nextTime = addMinutes(new Date(), 30);
      setNextActionTime(format(nextTime, 'HH:mm'));

      setBriefing("오늘 총 수유 4회(680ml), 낮잠 2시간 잤어요. 3시쯤에 약간 칭얼거렸는데 기저귀 갈아주니 괜찮아졌습니다.");
      
      // Clear URL params if just opened? 
      // No, we want to preserve them if user navigates back/forth or shares link.
      // But if empty, we might want defaults.
      if (!searchParams.has('moods')) {
          setSearchParams(prev => {
              prev.set('moods', 'happy');
              prev.set('energy', 'medium');
              return prev;
          }, { replace: true });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({
      babyMoods: moodsFromUrl,
      missions: missions,
      caregiverEnergy: energyFromUrl,
      wishlist,
      autoBriefing: briefing,
      timestamp: new Date(),
      isEarlyExit,
    });
    onClose();
  };

  const toggleBabyMood = (mood: BabyMood) => {
      const currentMoods = moodsFromUrl;
      let newMoods;
      if (currentMoods.includes(mood)) {
          newMoods = currentMoods.filter(m => m !== mood);
      } else {
          newMoods = [...currentMoods, mood];
      }
      
      // Update URL
      setSearchParams(prev => {
          if (newMoods.length > 0) {
              prev.set('moods', newMoods.join(','));
          } else {
              prev.delete('moods');
          }
          return prev;
      }, { replace: true });
  };

  const setEnergy = (level: EnergyLevel) => {
      setSearchParams(prev => {
          prev.set('energy', level);
          return prev;
      }, { replace: true });
  };

  const addMission = () => {
      if (missions.length >= 1) {
          alert("🔒 프리미엄 기능: 미션은 한 번에 최대 1개까지만 등록할 수 있습니다. 무제한 미션을 원하시면 업그레이드하세요!");
          return;
      }
      if (nextAction.trim()) {
          const newMission: Mission = {
              id: Date.now().toString(),
              text: nextAction,
              time: nextActionTime,
              isCompleted: false,
              assignerName: '나'
          };
          setMissions([...missions, newMission]);
          setNextAction('');
          const [h, m] = nextActionTime.split(':').map(Number);
          const nextDate = new Date();
          nextDate.setHours(h);
          nextDate.setMinutes(m + 30);
          setNextActionTime(format(nextDate, 'HH:mm'));
      }
  };

  const handlePremiumClick = () => {
      alert("🔒 프리미엄 기능: 미션은 한 번에 최대 1개까지만 등록할 수 있습니다. 무제한 미션을 원하시면 업그레이드하세요!");
  };

  const removeMission = (id: string) => {
      setMissions(missions.filter(m => m.id !== id));
  };

  const handleNextActionTag = (tag: string) => {
    setNextAction(tag);
  };

  const isLimitReached = missions.length >= 1;

  const energyOptions: { id: EnergyLevel, label: string, icon: React.ReactNode, colorClass: string }[] = [
      { id: 'low', label: '방전', icon: <BatteryWarning size={14} />, colorClass: 'text-red-500 bg-red-100' },
      { id: 'medium', label: '보통', icon: <Battery size={14} />, colorClass: 'text-blue-500 bg-blue-100' },
      { id: 'high', label: '쌩쌩', icon: <Zap size={14} />, colorClass: 'text-green-500 bg-green-100' }
  ];

  const moodOptions: { id: BabyMood, label: string, icon: React.ReactNode, color: string, bg: string, border: string }[] = [
    { id: 'happy', label: '천사모드', icon: <Smile size={24} strokeWidth={2}/>, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-400' },
    { id: 'energetic', label: '활발함', icon: <Flame size={24} strokeWidth={2}/>, color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-400' },
    { id: 'calm', label: '평온', icon: <Coffee size={24} strokeWidth={2}/>, color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-400' },
    { id: 'hungry', label: '배고픔', icon: <Milk size={24} strokeWidth={2}/>, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-400' },
    { id: 'sleeping', label: '수면 중', icon: <Moon size={24} strokeWidth={2}/>, color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-400' },
    { id: 'fussy', label: '칭얼거림', icon: <Frown size={24} strokeWidth={2}/>, color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-400' },
    { id: 'sick', label: '아파요', icon: <Thermometer size={24} strokeWidth={2}/>, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-400' },
    { id: 'poop', label: '응가함', icon: <Baby size={24} strokeWidth={2}/>, color: 'text-amber-800', bg: 'bg-amber-100', border: 'border-amber-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
          <div>
              <h2 className="text-lg font-bold text-gray-900">📝 육아 인계장 작성</h2>
              <p className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                  <Sparkles size={12}/> 다음 담당자를 위해 꼼꼼히!
              </p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-500 hover:bg-gray-100 shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-8 pb-8 no-scrollbar flex-1">
          
          {/* 1. Baby Mood (Synced with URL) */}
          <section>
             <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-1">
                    <span className="bg-indigo-100 text-indigo-600 w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
                    현재 튼튼이 기분은? <span className="text-gray-400 text-xs font-normal">(복수선택 가능)</span>
                </h3>
             </div>
             
             <div className="grid grid-cols-4 gap-2.5">
                {moodOptions.map((option) => {
                    const isSelected = moodsFromUrl.includes(option.id);
                    return (
                        <button 
                            key={option.id}
                            onClick={() => toggleBabyMood(option.id)}
                            className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-2xl border-2 transition-all active:scale-95 aspect-square ${
                                isSelected 
                                ? `${option.border} ${option.bg} ${option.color} shadow-sm` 
                                : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'
                            }`}
                        >
                            <div className={isSelected ? '' : 'grayscale opacity-70'}>{option.icon}</div>
                            <span className="text-[10px] font-bold whitespace-nowrap">{option.label}</span>
                        </button>
                    );
                })}
             </div>
          </section>

          {/* 2. Next Action (Mission Registration) */}
          <section className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
             <div className="flex justify-between items-center mb-3">
                 <h3 className="text-sm font-bold text-orange-900 flex items-center gap-1">
                    <AlertTriangle size={14} /> 다음 담당자 미션 (부탁하기)
                 </h3>
                 <span className="text-[10px] font-bold bg-white text-orange-600 px-2 py-0.5 rounded border border-orange-100">
                     {missions.length}/1 (Free)
                 </span>
             </div>
             
             {missions.length > 0 && (
                 <div className="space-y-2 mb-4">
                     {missions.map((m) => (
                         <div key={m.id} className="bg-white p-3 rounded-xl border border-orange-200 flex justify-between items-center shadow-sm animate-fade-in">
                             <div className="flex items-center gap-3">
                                 <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg border border-orange-200">{m.time}</span>
                                 <span className="text-sm font-bold text-gray-800">{m.text}</span>
                             </div>
                             <button onClick={() => removeMission(m.id)} className="text-gray-400 hover:text-red-500 bg-gray-50 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                                 <Trash2 size={16} />
                             </button>
                         </div>
                     ))}
                 </div>
             )}

             <div className="flex gap-2 mb-3">
                 <div className="bg-white px-3 py-2 rounded-xl border border-orange-200 flex items-center gap-1 shadow-sm w-[110px] focus-within:ring-2 focus-within:ring-orange-300 shrink-0">
                    <Clock size={16} className="text-orange-400 shrink-0" />
                    <input 
                        type="time" 
                        value={nextActionTime}
                        onChange={(e) => setNextActionTime(e.target.value)}
                        disabled={isLimitReached}
                        className={`bg-transparent font-bold text-gray-800 outline-none w-full text-center text-sm p-0 ml-1 ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                 </div>
                 
                 <div className="flex-1 flex gap-2 min-w-0">
                    <input 
                        type="text"
                        value={nextAction}
                        onChange={(e) => setNextAction(e.target.value)}
                        placeholder={isLimitReached ? "프리미엄 기능입니다" : "예: 분유 먹이기"}
                        disabled={isLimitReached}
                        className={`flex-1 px-4 py-2 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-300 outline-none font-bold text-gray-800 placeholder-gray-400 text-sm shadow-sm min-w-0 ${isLimitReached ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
                        onKeyDown={(e) => e.key === 'Enter' && addMission()}
                    />
                    
                    {isLimitReached ? (
                        <button 
                            onClick={handlePremiumClick}
                            className="w-12 rounded-xl font-bold flex items-center justify-center bg-gray-800 text-white shadow-md active:scale-95 transition-all shrink-0"
                        >
                            <Lock size={18} />
                        </button>
                    ) : (
                        <button 
                            onClick={addMission}
                            disabled={!nextAction.trim()}
                            className={`w-12 rounded-xl font-bold flex items-center justify-center transition-all shrink-0 ${nextAction.trim() ? 'bg-orange-500 text-white shadow-md active:scale-95' : 'bg-gray-200 text-gray-400'}`}
                        >
                            <Plus size={22} />
                        </button>
                    )}
                 </div>
             </div>

             <div className="flex gap-2 flex-wrap">
                 {NEXT_ACTION_TAGS.map(tag => (
                     <button
                        key={tag}
                        onClick={() => !isLimitReached && handleNextActionTag(tag)}
                        disabled={isLimitReached}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                            isLimitReached 
                            ? 'bg-gray-100 text-gray-400 border border-gray-100 cursor-not-allowed'
                            : nextAction === tag 
                                ? 'bg-orange-500 text-white shadow-sm' 
                                : 'bg-white text-orange-600 border border-orange-100 hover:bg-orange-100'
                        }`}
                     >
                        {tag}
                     </button>
                 ))}
             </div>
          </section>

          {/* 3. Auto Briefing */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">PHR 요약 리포트</h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <textarea
                value={briefing}
                onChange={(e) => setBriefing(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-700 leading-relaxed resize-none p-0 h-20"
              />
            </div>
          </section>

          {/* 4. Caregiver Status (Synced with URL) */}
          <section className="border-t border-gray-100 pt-4">
             <div className="flex justify-between items-center mb-3">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">내 상태 & 한마디</h3>
                 <div className="flex gap-1.5 bg-gray-100 p-1 rounded-full">
                    {energyOptions.map((opt) => {
                        const isSelected = energyFromUrl === opt.id;
                        return (
                            <button 
                                key={opt.id}
                                onClick={() => setEnergy(opt.id)}
                                className={`flex items-center justify-center gap-1.5 rounded-full transition-all duration-300 ${
                                    isSelected 
                                    ? `px-3 py-1.5 ${opt.colorClass} shadow-sm` 
                                    : 'w-8 h-8 text-gray-400 hover:bg-gray-200'
                                }`}
                            >
                                {opt.icon}
                                {isSelected && <span className="text-xs font-bold whitespace-nowrap">{opt.label}</span>}
                            </button>
                        );
                    })}
                 </div>
             </div>
             <input 
                type="text" 
                value={wishlist}
                onChange={(e) => setWishlist(e.target.value)}
                placeholder="다음 담당자에게 남길 한마디 (선택)"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
             />
          </section>

        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handleSubmit}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
          >
            <span>교대 및 인계장 전송</span>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftModal;
