
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { X, Clock, Plus, Lock, AlertCircle, Send, Check } from 'lucide-react';
import { EnergyLevel, ShiftReport, BabyMood, Mission } from '../types';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: ShiftReport) => void;
}

const NEXT_ACTION_TAGS = ['약 먹이기', '수유', '재우기', '목욕', '놀아주기', '설거지', '빨래'];

const ShiftModal: React.FC<ShiftModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // Initialize state from URL Params
  const moodsFromUrl = searchParams.get('moods')?.split(',').filter(Boolean) as BabyMood[] || [];
  const energyFromUrl = (searchParams.get('energy') as EnergyLevel) || 'medium';

  // Local state
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
      setNextActionTime('16:00');

      // Check for Editing Data passed via state
      const initialData = location.state?.reportData as ShiftReport | undefined;

      if (initialData) {
          // Load existing data
          setMissions(initialData.missions || []);
          setWishlist(initialData.wishlist || '');
          setBriefing(initialData.autoBriefing || '');
          
          // Populate URL params for mood/energy to keep UI consistent
          setSearchParams(prev => {
              if (initialData.babyMoods?.length) prev.set('moods', initialData.babyMoods.join(','));
              if (initialData.caregiverEnergy) prev.set('energy', initialData.caregiverEnergy);
              return prev;
          }, { replace: true });

      } else {
          // Default New Report
          setBriefing("오늘 총 수유 4회(680ml), 낮잠 2시간 잤어요. 3시쯤에 약간 칭얼거렸는데 기저귀 갈아주니 괜찮아졌습니다.");
          if (!searchParams.has('energy')) {
              setSearchParams(prev => {
                  prev.set('energy', 'medium');
                  return prev;
              }, { replace: true });
          }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation Logic: Input text acts as a valid entry
  const isValid = moodsFromUrl.length > 0 || missions.length > 0 || nextAction.trim().length > 0 || wishlist.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    // Handle Input as Mission if not empty (Auto-add)
    let finalMissions = [...missions];
    if (nextAction.trim()) {
        const implicitMission: Mission = {
            id: Date.now().toString(),
            text: nextAction,
            time: nextActionTime,
            isCompleted: false,
            assignerName: '나'
        };
        finalMissions.push(implicitMission);
    }

    onSubmit({
        babyMoods: moodsFromUrl,
        missions: finalMissions,
        caregiverEnergy: energyFromUrl,
        wishlist,
        autoBriefing: briefing,
        timestamp: new Date(),
        isEarlyExit,
    });
  };

  const toggleBabyMood = (mood: BabyMood) => {
      const currentMoods = moodsFromUrl;
      let newMoods;
      if (currentMoods.includes(mood)) {
          newMoods = currentMoods.filter(m => m !== mood);
      } else {
          newMoods = [...currentMoods, mood];
      }
      
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

  const handleNextActionTag = (tag: string) => {
    setNextAction(tag);
  };

  const handlePremiumAdd = () => {
      alert("🔒 프리미엄 기능: 미션은 한 번에 최대 1개까지만 등록할 수 있습니다.\n(무제한 미션 등록 기능을 구독해보세요!)");
  };

  const energyOptions: { id: EnergyLevel, label: string }[] = [
      { id: 'low', label: '지침 😫' },
      { id: 'medium', label: '보통 😐' },
      { id: 'high', label: '쌩쌩함 😄' }
  ];

  const moodOptions: { id: BabyMood, label: string, emoji: string }[] = [
    { id: 'happy', label: '좋음', emoji: '🥰' },
    { id: 'energetic', label: '활발', emoji: '🤸' },
    { id: 'calm', label: '평온', emoji: '🧘' },
    { id: 'hungry', label: '배고픔', emoji: '🍼' },
    { id: 'sleeping', label: '수면중', emoji: '😴' },
    { id: 'fussy', label: '찡찡', emoji: '😫' },
    { id: 'sick', label: '아픔', emoji: '🤒' },
    { id: 'poop', label: '응가함', emoji: '💩' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in max-h-[90vh] flex flex-col font-sans">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-900">인계장 작성</h2>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-8 pb-32 no-scrollbar flex-1 bg-white">
          
          {/* 1. Baby Mood */}
          <section>
             <h3 className="text-sm font-bold text-gray-900 mb-3">현재 튼튼이 기분</h3>
             <div className="grid grid-cols-4 gap-2">
                {moodOptions.map((option) => {
                    const isSelected = moodsFromUrl.includes(option.id);
                    return (
                        <button 
                            key={option.id}
                            onClick={() => toggleBabyMood(option.id)}
                            className={`flex flex-col items-center justify-center aspect-square p-2 rounded-xl border transition-all ${
                                isSelected 
                                ? 'bg-black text-white border-black shadow-md' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <span className="text-2xl mb-1">{option.emoji}</span>
                            <span className="text-xs font-bold">{option.label}</span>
                            {isSelected && <div className="absolute top-1 right-1 w-2 h-2 bg-lime-400 rounded-full"></div>}
                        </button>
                    );
                })}
             </div>
          </section>

          {/* 2. Next Action (Mission) */}
          <section className="border-t border-gray-100 pt-6">
             <div className="flex justify-between items-center mb-3">
                 <h3 className="text-sm font-bold text-gray-900">부탁할 미션 (1개)</h3>
             </div>
             
             {/* Main Input Area */}
             <div className="flex gap-2 mb-3">
                 <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 flex items-center gap-1 w-[110px]">
                    <Clock size={16} className="text-gray-400 shrink-0" />
                    <input 
                        type="time" 
                        value={nextActionTime}
                        onChange={(e) => setNextActionTime(e.target.value)}
                        className="bg-transparent font-bold text-gray-900 outline-none w-full text-center text-sm p-0 ml-1"
                    />
                 </div>
                 
                 <div className="flex-1 min-w-0">
                    <input 
                        type="text"
                        value={nextAction}
                        onChange={(e) => setNextAction(e.target.value)}
                        placeholder="예: 분유 먹이기"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black outline-none font-medium text-gray-900 placeholder-gray-400 text-sm bg-gray-50"
                    />
                 </div>
             </div>

             {/* Tags */}
             <div className="flex gap-2 flex-wrap mb-4">
                 {NEXT_ACTION_TAGS.map(tag => (
                     <button
                        key={tag}
                        onClick={() => handleNextActionTag(tag)}
                        className="text-xs px-3 py-1.5 rounded-full font-bold bg-white border border-gray-200 text-gray-500 hover:border-black hover:text-black transition-colors"
                     >
                        {tag}
                     </button>
                 ))}
             </div>

             {/* Premium Lock Button */}
             <button 
                onClick={handlePremiumAdd}
                className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-gray-400 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
             >
                 <Plus size={16} />
                 <span className="text-xs font-bold">미션 추가하기 (Premium)</span>
                 <Lock size={12} className="text-gray-300" />
             </button>

          </section>

          {/* 3. Auto Briefing */}
          <section className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3">PHR 요약 리포트</h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <textarea
                value={briefing}
                onChange={(e) => setBriefing(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-900 leading-relaxed resize-none p-0 h-20 outline-none"
              />
            </div>
          </section>

          {/* 4. Caregiver Status */}
          <section className="border-t border-gray-100 pt-6">
             <div className="flex justify-between items-center mb-3">
                 <h3 className="text-sm font-bold text-gray-900">내 컨디션 & 한마디</h3>
             </div>
             
             <div className="grid grid-cols-3 gap-2 mb-4">
                {energyOptions.map((opt) => {
                    const isSelected = energyFromUrl === opt.id;
                    return (
                        <button 
                            key={opt.id}
                            onClick={() => setEnergy(opt.id)}
                            className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                                isSelected 
                                ? 'bg-black text-white border-black' 
                                : 'bg-white text-gray-500 border-gray-200'
                            }`}
                        >
                            {opt.label}
                        </button>
                    );
                })}
             </div>
             
             <input 
                type="text" 
                value={wishlist}
                onChange={(e) => setWishlist(e.target.value)}
                placeholder="남길 한마디 (선택)"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
             />
          </section>

        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-gray-100 bg-white absolute bottom-0 left-0 right-0 z-20">
            {!isValid && (
                <div className="text-center mb-2 flex items-center justify-center gap-1 text-red-500 text-xs font-bold animate-pulse">
                    <AlertCircle size={12} />
                    <span>필수 항목을 입력해주세요</span>
                </div>
            )}
            
            <button 
                onClick={handleSubmit}
                disabled={!isValid}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    isValid 
                        ? 'bg-black hover:bg-gray-800 text-white active:scale-[0.98]' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                <span>인계장 전송하기</span>
                <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftModal;
