import React, { useState, useEffect, useMemo } from 'react';
import { Baby, Milk, Moon, Clock, Phone, ChevronLeft, Calendar, MoreHorizontal, ImageIcon, CheckCircle2, ClipboardList, ArrowRight, Hourglass, CheckSquare, MessageSquare, Plus, ChevronDown, Send, Pencil, XCircle, Stethoscope } from 'lucide-react';
import { User, Log, LogType, LogSubType, Mission } from '../types';
import { format } from 'date-fns';
import CaregiverModal from './CaregiverModal';
import QuickLogModal from './QuickLogModal';

interface DashboardProps {
  currentUser: User;
  partner: User;
  logs: Log[];
  activeMissions: Mission[];
  onAddLog: (type: LogType, subType?: LogSubType, value?: string, note?: string) => void;
  onOpenShiftModal: () => void;
  onToggleMission: (id: string) => void;
  onUpdateMissionMemo: (id: string, memo: string) => void;
  onOpenDoctorReport: () => void;
}

// Background Image Presets for Toggle
const BG_IMAGES = [
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop", // Default Room
    "https://images.unsplash.com/photo-1555252333-9f8e92e65df4?q=80&w=2070&auto=format&fit=crop", // Cozy Bed
    "https://images.unsplash.com/photo-1588856627684-1887e47854e4?q=80&w=2070&auto=format&fit=crop", // Living Room
    "https://images.unsplash.com/photo-1595856402447-73d87455d312?q=80&w=2070&auto=format&fit=crop", // Toys
];

const Dashboard: React.FC<DashboardProps> = ({ 
    currentUser, 
    partner, 
    logs, 
    activeMissions,
    onAddLog, 
    onOpenShiftModal,
    onToggleMission,
    onUpdateMissionMemo,
    onOpenDoctorReport
}) => {
  const [shiftDuration, setShiftDuration] = useState(0);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [memoInputs, setMemoInputs] = useState<Record<string, string>>({});
  const [isEditingMemo, setIsEditingMemo] = useState<Record<string, boolean>>({});
  
  // Modals
  const [isCaregiverModalOpen, setIsCaregiverModalOpen] = useState(false);
  
  // Quick Log Modal State
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [quickLogType, setQuickLogType] = useState<LogType>('diaper');

  const [nextCaregiver, setNextCaregiver] = useState<User>(partner);
  
  // UX Logic: Is the current user on duty?
  const isMeOnDuty = currentUser.isDuty;
  
  // Mock Users List for Modal
  const grandmaUser: User = { 
      id: 'u3', 
      name: '할머니', 
      role: 'Mom', 
      isDuty: false,
      batteryLevel: 100,
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Grandma' 
  };
  const availableUsers = [partner, currentUser, grandmaUser];

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setShiftDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleQuickAction = (type: LogType) => {
      setQuickLogType(type);
      setIsQuickLogOpen(true);
  };

  const handleQuickLogSave = (data: { type: LogType, subType?: LogSubType, time: Date, value?: string, note?: string }) => {
      // Pass the data up to the parent App component
      onAddLog(data.type, data.subType, data.value, data.note);
  };

  const toggleBackground = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent bubbling
      setCurrentBgIndex((prev) => (prev + 1) % BG_IMAGES.length);
  };

  const handleMemoSubmit = (id: string) => {
      if (memoInputs[id]?.trim()) {
          onUpdateMissionMemo(id, memoInputs[id]);
          setMemoInputs(prev => ({ ...prev, [id]: '' }));
          setIsEditingMemo(prev => ({ ...prev, [id]: false }));
      }
  };

  const startEditingMemo = (id: string, currentMemo: string) => {
      setMemoInputs(prev => ({ ...prev, [id]: currentMemo }));
      setIsEditingMemo(prev => ({ ...prev, [id]: true }));
  };

  const handleEditProfile = () => {
      alert("프로필 수정 화면으로 이동합니다 (준비중)");
  };

  // Filter logs to show only CURRENT USER's activities
  const myLogs = logs.filter(log => log.user === currentUser.name);
  const displayedLogs = showAllLogs ? myLogs : myLogs.slice(0, 2);

  // --- Calculate Handoff Readiness Score (Gamification) ---
  const handoffScore = useMemo(() => {
    if (!isMeOnDuty) return 0;
    const logPoints = Math.min(myLogs.length * 20, 100); // 5 logs = 100%
    return logPoints;
  }, [myLogs, isMeOnDuty]);

  return (
    <div className="pb-32 bg-white min-h-screen relative">
      
      {/* 1. Top Header (Back button removed) */}
      <div className="flex justify-between items-center px-5 py-3 bg-white sticky top-0 z-20">
        <h1 className="font-bold text-lg text-gray-900">오늘의 육아</h1>
        {/* Doctor Report Text Button */}
        <button 
            onClick={onOpenDoctorReport}
            className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg shadow-sm hover:bg-rose-100 transition-colors text-xs font-bold flex items-center gap-1"
            aria-label="병원 리포트"
        >
            병원갈 준비
        </button>
      </div>

      {/* 2. Baby Profile (Editable) */}
      <div className="flex items-center gap-4 px-6 mb-6 mt-2">
          <div className="relative group cursor-pointer" onClick={handleEditProfile}>
              <div className="w-14 h-14 rounded-full bg-yellow-100 p-1 border-2 border-white shadow-sm overflow-hidden">
                  <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" alt="Baby" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                  <Pencil size={10} className="text-gray-500" />
              </div>
          </div>
          <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-xl text-gray-900 leading-tight">튼튼이</h2>
                <button 
                    onClick={handleEditProfile}
                    className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                    <Pencil size={14} />
                </button>
              </div>
              <p className="text-gray-500 text-xs font-medium flex items-center gap-1 mt-1">
                  <Calendar size={12} /> D+124
              </p>
          </div>
      </div>

      {/* 3. Hero Status Card (Badge Removed) */}
      <div className="px-5 mb-4">
        <div className="relative w-full aspect-[16/9] bg-gray-900 rounded-3xl overflow-hidden shadow-xl shadow-gray-200 group transition-all duration-500">
           <img 
             key={currentBgIndex} 
             src={BG_IMAGES[currentBgIndex]} 
             className="w-full h-full object-cover opacity-80 animate-fade-in"
             alt="Room"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
           
           <div className="absolute bottom-5 left-5 text-white pr-20">
              <h3 className="text-2xl font-bold mb-1 leading-snug">
                {isMeOnDuty ? (
                    <>현재 <span className="text-yellow-300">내(아빠)</span>가<br/>케어하고 있어요</>
                ) : (
                    <>현재 <span className="text-yellow-300">{partner.name}</span>님이<br/>케어하고 있어요</>
                )}
              </h3>
              <p className="text-sm opacity-90 flex items-center gap-1.5 font-medium bg-black/20 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                 <Clock size={14}/> {formatDuration(shiftDuration)} 경과
              </p>
           </div>

            <button 
                onClick={toggleBackground}
                className="absolute bottom-5 right-5 bg-white/20 backdrop-blur-md hover:bg-white/30 p-2.5 rounded-full text-white transition-all active:scale-95 border border-white/20"
                aria-label="Change Background"
            >
                <ImageIcon size={20} />
            </button>
        </div>
      </div>

      {/* 4. Active Missions Card (UX Improved) */}
      {activeMissions.length > 0 && (
          <div className="px-5 mb-6">
            <div className="bg-indigo-50/60 rounded-3xl p-5 border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                        <CheckSquare size={16} />
                    </div>
                    <h3 className="font-bold text-indigo-900">
                        {activeMissions[0].assignerName}님이 남긴 미션
                    </h3>
                </div>

                <div className="space-y-3">
                    {activeMissions.map((mission) => {
                        const hasInputText = (memoInputs[mission.id] || '').length > 0;
                        const isEditing = isEditingMemo[mission.id];

                        return (
                            <div key={mission.id} className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${mission.isCompleted ? 'border-gray-200 bg-gray-50' : 'border-indigo-100'}`}>
                                {/* Mission Header & Checkbox */}
                                <div className="flex items-start gap-3 mb-2">
                                    {/* Separate Checkbox Target to prevent accidental toggles */}
                                    <button 
                                        onClick={() => onToggleMission(mission.id)}
                                        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all shrink-0 active:scale-90 ${mission.isCompleted ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 bg-white hover:border-indigo-300'}`}
                                    >
                                        {mission.isCompleted && <CheckCircle2 size={16} className="text-white" strokeWidth={3} />}
                                    </button>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-bold truncate ${mission.isCompleted ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-800'}`}>
                                            {mission.text}
                                        </div>
                                        <div className={`text-xs font-mono font-medium ${mission.isCompleted ? 'text-gray-400' : 'text-indigo-500'}`}>
                                            {mission.time}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Memo Section */}
                                <div className="pl-9">
                                    {mission.memo && !isEditing ? (
                                        // Display Existing Memo
                                        <div className="bg-amber-50 p-2.5 rounded-xl text-xs text-amber-900 border border-amber-100 flex justify-between items-start group">
                                            <span className="leading-relaxed break-all">
                                                <span className="font-bold mr-1">Note:</span> 
                                                {mission.memo}
                                            </span>
                                            <button 
                                                onClick={() => startEditingMemo(mission.id, mission.memo || '')}
                                                className="text-amber-400 hover:text-amber-600 p-1 -mr-1 -mt-1 rounded-md hover:bg-amber-100 transition-colors"
                                            >
                                                <Pencil size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        // Input Area (Show if no memo OR isEditing)
                                        <div className="flex gap-2">
                                            <div className="flex-1 relative">
                                                <input 
                                                    type="text" 
                                                    placeholder={mission.isCompleted ? "완료 특이사항 기록..." : "메모 남기기..."}
                                                    value={memoInputs[mission.id] || ''}
                                                    onChange={(e) => setMemoInputs({...memoInputs, [mission.id]: e.target.value})}
                                                    className={`w-full text-xs rounded-xl px-3 py-2.5 focus:outline-none transition-all ${
                                                        mission.isCompleted 
                                                        ? 'bg-white border border-gray-200 focus:border-indigo-300 text-gray-600' 
                                                        : 'bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-2 focus:ring-indigo-50'
                                                    }`}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleMemoSubmit(mission.id)}
                                                    autoFocus={isEditing}
                                                />
                                                {isEditing && (
                                                    <button 
                                                        onClick={() => {
                                                            setIsEditingMemo(prev => ({...prev, [mission.id]: false}));
                                                            setMemoInputs(prev => ({...prev, [mission.id]: mission.memo || ''}));
                                                        }}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <XCircle size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => handleMemoSubmit(mission.id)}
                                                disabled={!hasInputText}
                                                className={`px-3 py-2 rounded-xl flex items-center gap-1 text-xs font-bold transition-all shadow-sm ${
                                                    hasInputText 
                                                    ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 active:scale-95' 
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {hasInputText ? (
                                                    <>등록 <Send size={12} /></>
                                                ) : (
                                                    <Plus size={14} />
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>
      )}

      {/* 5. Shift Countdown & Handoff Card (Existing) */}
      <div className="px-5 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/80 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex justify-between items-start z-10 relative mb-4">
                <div>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 mb-1.5">
                        <Hourglass size={12} /> 교대까지 남은 시간
                    </span>
                    <h3 className="text-3xl font-black text-gray-900 font-mono tracking-tight leading-none">
                        02<span className="text-lg font-bold text-gray-400 mx-1 font-sans">시간</span>
                        15<span className="text-lg font-bold text-gray-400 mx-1 font-sans">분</span>
                    </h3>
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 text-right min-w-[80px]">
                    <span className="text-[10px] text-gray-400 font-bold block mb-0.5">교대 예정</span>
                    <span className="text-sm font-bold text-gray-700 font-mono">18:30</span>
                </div>
            </div>

            {/* Progress Visual */}
            <div className="mb-5">
                <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-2">
                    <span>현재 진행률 75%</span>
                    <span className="text-indigo-500">조금만 더 힘내세요! 🔥</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 w-3/4 rounded-full relative">
                        <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2">
                {/* Next User Info */}
                <div className="flex items-center gap-3" onClick={() => setIsCaregiverModalOpen(true)}>
                    <div className="relative">
                        <img src={nextCaregiver.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-gray-50" alt="Next" />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                            <ArrowRight size={10} className="text-gray-400"/>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Next</p>
                        <p className="text-xs font-bold text-gray-700">{nextCaregiver.name}</p>
                    </div>
                </div>

                {/* Action Button */}
                <button 
                    onClick={onOpenShiftModal}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 shadow-lg ${
                        handoffScore >= 80 
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                    }`}
                >
                    {handoffScore >= 80 ? (
                        <><CheckCircle2 size={16} /> 인계장 작성</>
                    ) : (
                        <><ClipboardList size={16} /> 인계장 작성</>
                    )}
                </button>
            </div>
        </div>
      </div>

      {/* 6. Quick Actions */}
      <div className="px-5 mb-8">
         <div className="flex items-center gap-2 mb-3 ml-1">
            <h3 className="font-bold text-gray-800 text-lg">빠른 기록</h3>
         </div>
         
         <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center gap-2">
                    <button 
                        onClick={() => handleQuickAction('diaper')}
                        className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100 active:scale-95 transition-transform"
                    >
                        <Baby size={24} />
                    </button>
                    <span className="text-xs font-bold text-gray-600">기저귀</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <button 
                        onClick={() => handleQuickAction('feeding')}
                        className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm border border-rose-100 active:scale-95 transition-transform"
                    >
                        <Milk size={24} />
                    </button>
                    <span className="text-xs font-bold text-gray-600">수유</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <button 
                        onClick={() => handleQuickAction('sleep')}
                        className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm border border-indigo-100 active:scale-95 transition-transform"
                    >
                        <Moon size={24} />
                    </button>
                    <span className="text-xs font-bold text-gray-600">수면</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <button 
                        onClick={() => handleQuickAction('health')}
                        className="w-14 h-14 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center shadow-sm border border-gray-100 active:scale-95 transition-transform hover:bg-gray-100"
                    >
                        <MoreHorizontal size={24} />
                    </button>
                    <span className="text-xs font-bold text-gray-500">더보기</span>
                </div>
            </div>
         </div>
      </div>

      {/* 7. Timeline Section */}
      <div className="px-5 mb-8">
         <div className="flex items-center justify-between mb-4 ml-1">
            <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                <h3 className="font-bold text-gray-800 text-lg">
                    <span className="text-blue-600">나</span>의 타임라인
                </h3>
            </div>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                총 {myLogs.length}건
            </span>
         </div>

         <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all">
            {myLogs.length > 0 ? (
                <div className="relative pl-2">
                    <div className="absolute left-[9px] top-2 bottom-4 w-[2px] bg-gray-100"></div>

                    {displayedLogs.map((log, index) => {
                        const isDiaper = log.type === 'diaper';
                        const isFeeding = log.type === 'feeding';
                        const isSleep = log.type === 'sleep';
                        
                        let Icon = MoreHorizontal;
                        if (isDiaper) { Icon = Baby; }
                        if (isFeeding) { Icon = Milk; }
                        if (isSleep) { Icon = Moon; }

                        return (
                            <div key={log.id} className="relative flex gap-4 mb-8 last:mb-0 animate-fade-in">
                                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-colors ${index === 0 ? 'bg-blue-500 text-white ring-2 ring-blue-100' : 'bg-white text-gray-300'}`}>
                                    <CheckCircle2 size={14} fill={index === 0 ? "currentColor" : "none"} className={index === 0 ? "text-white" : "text-gray-300"} />
                                </div>
                                <div className="flex-1 -mt-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className={`text-sm font-bold ${index === 0 ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {isDiaper && '기저귀 교체 완료'}
                                                {isFeeding && '수유 완료'}
                                                {isSleep && '수면 기록'}
                                                {log.type === 'health' && '건강 기록'}
                                            </p>
                                            <p className="text-xs text-gray-400 font-mono mt-0.5">{format(log.timestamp, 'hh:mm a')}</p>
                                        </div>
                                    </div>
                                    {(log.note || log.subType || log.value) && (
                                        <div className="mt-2 text-xs bg-gray-50 p-2 rounded-lg text-gray-500 inline-block font-medium border border-gray-100">
                                            {log.subType} {log.value && ` · ${log.value}`} {log.note && ` · ${log.note}`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {myLogs.length > 2 && (
                        <div className="relative z-10 pt-4 border-t border-gray-50 mt-4 flex justify-center">
                            <button 
                                onClick={() => setShowAllLogs(!showAllLogs)}
                                className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                {showAllLogs ? '접기' : '더보기'}
                                <ChevronDown size={14} className={`transition-transform ${showAllLogs ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                    아직 오늘의 기록이 없습니다.
                </div>
            )}
         </div>
      </div>

      {/* Modals */}
      <CaregiverModal 
        isOpen={isCaregiverModalOpen}
        onClose={() => setIsCaregiverModalOpen(false)}
        users={availableUsers}
        selectedUserId={nextCaregiver.id}
        onSelect={setNextCaregiver}
        onAddNew={() => alert('새 담당자 등록 기능은 준비중입니다!')}
      />

      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        initialType={quickLogType}
        onSave={handleQuickLogSave}
      />

    </div>
  );
};

export default Dashboard;