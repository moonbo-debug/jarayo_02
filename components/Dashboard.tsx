
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Baby, Milk, Moon, Clock, ChevronRight, MoreHorizontal, CheckCircle2, ClipboardList, ArrowRight, Hourglass, CheckSquare, Send, Pencil, XCircle, Plus, Zap, X } from 'lucide-react';
import { User, Log, LogType, LogSubType, Mission, ShiftReport } from '../types';
import { format } from 'date-fns';
import CaregiverModal from './CaregiverModal';
import QuickLogModal from './QuickLogModal';

interface DashboardProps {
  currentUser: User;
  partner: User;
  logs: Log[];
  activeMissions: Mission[];
  recentReport: ShiftReport | null;
  onAddLog: (type: LogType, subType?: LogSubType, value?: string, note?: string) => void;
  onOpenShiftModal: () => void;
  onToggleMission: (id: string) => void;
  onUpdateMissionMemo: (id: string, memo: string) => void;
  onOpenDoctorReport: () => void;
  onEditReport: (report: ShiftReport) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    currentUser, 
    partner, 
    logs, 
    activeMissions,
    recentReport,
    onAddLog, 
    onOpenShiftModal,
    onToggleMission,
    onUpdateMissionMemo,
    onOpenDoctorReport,
    onEditReport
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [shiftDuration, setShiftDuration] = useState(0);
  const [showAllLogs, setShowAllLogs] = useState(false);
  
  // Tab state synced with URL
  const tabParam = searchParams.get('tab') as 'sent' | 'received' | null;
  const [handoverTab, setHandoverTab] = useState<'sent' | 'received'>(tabParam || 'received');

  // Success Toast state from URL
  const showSuccessToast = searchParams.get('toast') === 'success';

  // URL-driven Modals
  const actionParam = searchParams.get('action');
  const isCaregiverModalOpen = actionParam === 'caregiver';
  const isQuickLogOpen = actionParam === 'quick';
  
  // Quick Log Type from URL or default
  const [quickLogType, setQuickLogType] = useState<LogType>('diaper');

  const [nextCaregiver, setNextCaregiver] = useState<User>(partner);
  
  // UX Logic: Is the current user on duty?
  const isMeOnDuty = currentUser.isDuty;
  
  // Mock Users for Demo
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

  // Sync tab state with URL
  useEffect(() => {
      if (tabParam) {
          setHandoverTab(tabParam);
      } else {
          // Default logic if no param
          if (recentReport?.authorName === currentUser.name) {
             // If I just sent a report, default to sent? 
             // But let's stick to URL param as source of truth if possible.
          }
      }
  }, [tabParam, recentReport, currentUser.name]);

  const handleTabChange = (tab: 'sent' | 'received') => {
      setHandoverTab(tab);
      setSearchParams(prev => {
          prev.set('tab', tab);
          return prev;
      });
  };

  const handleCloseToast = () => {
      setSearchParams(prev => {
          prev.delete('toast');
          return prev;
      });
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const openModal = (action: string) => {
      setSearchParams(prev => {
          prev.set('action', action);
          return prev;
      });
  };

  const closeModal = () => {
      setSearchParams(prev => {
          prev.delete('action');
          return prev;
      });
  };

  const handleQuickAction = (type: LogType) => {
      setQuickLogType(type);
      openModal('quick');
  };

  const handleQuickLogSave = (data: { type: LogType, subType?: LogSubType, time: Date, value?: string, note?: string }) => {
      onAddLog(data.type, data.subType, data.value, data.note);
  };

  const handleEditProfile = () => {
      alert("프로필 수정 화면으로 이동합니다 (준비중)");
  };
  
  // Wrapped Toggle Handler for Maze URL Tracking
  const handleMissionClick = (id: string, currentStatus: boolean) => {
      onToggleMission(id);
      setSearchParams(prev => {
          prev.set('mission_status', !currentStatus ? 'completed' : 'pending');
          return prev;
      });
  };

  // Filter logs to show only CURRENT USER's activities
  const myLogs = logs.filter(log => log.user === currentUser.name);
  const displayedLogs = showAllLogs ? myLogs : myLogs.slice(0, 2);

  const isMyReport = recentReport?.authorName === currentUser.name;
  const sentReportCount = recentReport && isMyReport ? 1 : 0;

  // Helper component for rendering a single mission item (used in both views)
  const renderMissionItem = (mission: Mission, index: number) => {
      return (
        <div key={mission.id} className={`bg-white rounded-2xl p-4 border transition-all ${mission.isCompleted ? 'border-gray-200 bg-gray-50' : 'border-gray-200 shadow-sm'}`}>
            {/* Mission Header & Checkbox */}
            <div className="flex items-start gap-3">
                <button 
                    onClick={() => handleMissionClick(mission.id, mission.isCompleted)}
                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 active:scale-90 ${mission.isCompleted ? 'bg-black border-black' : 'border-gray-300 bg-white hover:border-black'}`}
                >
                    {mission.isCompleted && <CheckCircle2 size={16} className="text-white" strokeWidth={3} />}
                </button>
                
                <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold truncate ${mission.isCompleted ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-900'}`}>
                        {mission.text}
                    </div>
                    <div className={`text-xs font-mono font-medium ${mission.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                        {mission.time}
                    </div>
                </div>
            </div>
        </div>
      );
  };

  return (
    <div className="pb-32 bg-[#F9FAFB] min-h-screen relative font-sans">
      
      {/* 1. Top Header (Updated Logo) */}
      <div className="flex justify-between items-center px-5 py-5 bg-[#F9FAFB] sticky top-0 z-20">
        <div className="flex items-center gap-1.5">
            <div className="bg-black text-white p-1 rounded-lg">
                <Zap size={16} className="text-lime-400" fill="currentColor" />
            </div>
            <h1 className="font-black text-xl text-gray-900 tracking-tight flex items-center gap-0.5">
                니차례<span className="w-1.5 h-1.5 bg-lime-500 rounded-full mt-3"></span>
            </h1>
        </div>
      </div>

      {/* 2. Baby Profile & Hero Status */}
      <div className="px-5 mb-6">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 relative overflow-hidden">
             
             <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border border-gray-100 p-0.5">
                        <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" alt="Baby" className="w-full h-full rounded-full bg-gray-50 object-cover" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h2 className="font-bold text-lg text-gray-900">튼튼이</h2>
                            <span className="text-[10px] bg-lime-400 text-black px-1.5 py-0.5 rounded font-bold">D+124</span>
                        </div>
                        <button onClick={handleEditProfile} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5 mt-0.5">
                            프로필 수정 <ChevronRight size={10} />
                        </button>
                    </div>
                </div>
                {/* Status Badge */}
                 <div className="bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                     <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></div>
                     {isMeOnDuty ? '내가 케어 중' : '상대방 케어 중'}
                 </div>
             </div>

             {/* Shift Status Content */}
             <div className="relative z-10 mt-2">
                 <div className="flex items-end justify-between">
                     <div>
                        <p className="text-sm text-gray-500 font-bold mb-1">현재 담당자</p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">
                            {isMeOnDuty ? '아빠' : partner.name}
                        </p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm text-gray-500 font-bold mb-1 flex items-center gap-1 justify-end">
                            <Clock size={14} /> 진행 시간
                        </p>
                        <p className="text-2xl font-mono font-bold text-gray-900 leading-none tracking-tight">
                            {formatDuration(shiftDuration)}
                        </p>
                     </div>
                 </div>
             </div>
          </div>
      </div>
      
      {/* 4. Unified Handover Center Card (Tabs) */}
      <div className="px-5 mb-6 animate-slide-up">
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm overflow-hidden relative">
             {/* Header */}
             <div className="flex justify-between items-center mb-5">
                 <div className="flex items-center gap-2">
                     <ClipboardList size={20} className="text-gray-900" />
                     <h3 className="font-bold text-gray-900 text-lg">인계장 & 미션</h3>
                 </div>
                 {handoverTab === 'sent' && recentReport && isMyReport && (
                     <button 
                        onClick={() => onEditReport(recentReport)}
                        className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
                    >
                        <Pencil size={12} /> 수정
                    </button>
                 )}
             </div>

             {/* Custom Tabs - Simple Text Style */}
             <div className="flex border-b border-gray-100 mb-5">
                 <button 
                    onClick={() => handleTabChange('received')}
                    className={`flex-1 pb-3 text-sm font-bold transition-all relative ${
                        handoverTab === 'received' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                    }`}
                 >
                    받은 미션 <span className="text-xs ml-0.5 bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">{activeMissions.length}</span>
                    {handoverTab === 'received' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
                 </button>
                 <button 
                    onClick={() => handleTabChange('sent')}
                    className={`flex-1 pb-3 text-sm font-bold transition-all relative ${
                        handoverTab === 'sent' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                    }`}
                 >
                    보낸 인계장 <span className="text-xs ml-0.5 bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600">{sentReportCount}</span>
                    {handoverTab === 'sent' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
                 </button>
             </div>

             {/* Tab Content: Received Missions */}
             {handoverTab === 'received' && (
                 <div className="animate-fade-in min-h-[120px]">
                    {activeMissions.length > 0 ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1 mb-1">
                                <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                    <CheckSquare size={12} /> {activeMissions[0].assignerName}님의 요청
                                </span>
                            </div>
                            {activeMissions.map((mission, index) => renderMissionItem(mission, index))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400 flex flex-col items-center justify-center h-full">
                            <CheckCircle2 size={32} className="mb-2 opacity-10" />
                            <p className="text-xs">요청받은 미션이 없습니다.</p>
                        </div>
                    )}
                 </div>
             )}

             {/* Tab Content: Sent Report */}
             {handoverTab === 'sent' && (
                 <div className="animate-fade-in min-h-[120px]">
                    {recentReport && isMyReport ? (
                        <div className="relative group">
                            <p className="text-[10px] text-gray-400 font-bold mb-4 flex items-center gap-1">
                                <Send size={10} /> {format(recentReport.timestamp, 'HH:mm')}에 전송됨
                            </p>

                             {/* Moods */}
                             {recentReport.babyMoods.length > 0 && (
                                 <div className="mb-5">
                                     <span className="text-xs font-bold text-gray-900 block mb-2">아기 컨디션</span>
                                     <div className="flex gap-2 flex-wrap">
                                        {recentReport.babyMoods.map(mood => {
                                            const moodMap: Record<string, string> = {
                                                happy: '🥰 좋음', fussy: '😫 찡찡', sleeping: '😴 수면중', sick: '🤒 아픔',
                                                hungry: '🍼 배고픔', energetic: '🤸 활발', calm: '🧘 평온', poop: '💩 응가함'
                                            };
                                            return (
                                                <span key={mood} className="text-xs font-bold bg-white text-gray-900 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                                                    {moodMap[mood]}
                                                </span>
                                            );
                                        })}
                                     </div>
                                 </div>
                             )}

                             {/* Briefing */}
                             {recentReport.autoBriefing && (
                                 <div className="mb-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                     <span className="text-xs font-bold text-gray-900 block mb-1">특이사항 메모</span>
                                     <p className="text-sm text-gray-600 leading-relaxed">
                                         {recentReport.autoBriefing}
                                     </p>
                                 </div>
                             )}
                             
                             {/* Missions Sent */}
                             {recentReport.missions.length > 0 && (
                                 <div className="pt-2 border-t border-gray-100">
                                     <span className="text-xs font-bold text-gray-900 block mb-2">부탁한 미션</span>
                                     <ul className="space-y-2">
                                         {recentReport.missions.map((m, idx) => (
                                             <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                                 <div className="w-1.5 h-1.5 bg-lime-400 rounded-full"></div> 
                                                 {m.text}
                                             </li>
                                         ))}
                                     </ul>
                                 </div>
                             )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400 flex flex-col items-center justify-center h-full">
                            <Send size={32} className="mb-2 opacity-10" />
                            <p className="text-xs">보낸 인계장이 없습니다.</p>
                        </div>
                    )}
                 </div>
             )}
        </div>
      </div>

      {/* 5. Shift Countdown & Handoff Card */}
      <div className="px-5 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
            
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-bold text-gray-500 mb-1">교대까지 남은 시간</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-gray-900 font-mono tracking-tight">02</span>
                        <span className="text-sm font-bold text-gray-400">시간</span>
                        <span className="text-3xl font-black text-gray-900 font-mono tracking-tight ml-2">15</span>
                        <span className="text-sm font-bold text-gray-400">분</span>
                    </div>
                </div>
                <div className="text-right">
                     <span className="text-xs font-bold text-lime-600 bg-lime-100 px-2 py-1 rounded">
                        18:30 예정
                     </span>
                </div>
            </div>

            <div className="mb-6">
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-900 w-3/4 rounded-full relative"></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-right font-bold">진행률 75%</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 cursor-pointer bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 flex-1" onClick={() => openModal('caregiver')}>
                    <img src={nextCaregiver.avatar} className="w-8 h-8 rounded-full border border-gray-200 bg-white" alt="Next" />
                    <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">NEXT</p>
                        <p className="text-xs font-bold text-gray-900 truncate">{nextCaregiver.name}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 ml-auto" />
                </div>

                <button 
                    onClick={onOpenShiftModal}
                    className="flex-1 bg-black text-white px-4 py-3.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform flex justify-center items-center gap-2 hover:bg-gray-800"
                >
                    인계장 작성하기
                </button>
            </div>
        </div>
      </div>

      {/* 6. Quick Actions */}
      <div className="px-5 mb-8">
         <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">빠른 기록</h3>
         </div>
         
         <div className="grid grid-cols-4 gap-3">
             {[
                 { id: 'diaper', label: '기저귀', icon: Baby },
                 { id: 'feeding', label: '수유', icon: Milk },
                 { id: 'sleep', label: '수면', icon: Moon },
                 { id: 'health', label: '더보기', icon: MoreHorizontal }
             ].map((item) => (
                 <button
                    key={item.id}
                    onClick={() => handleQuickAction(item.id as LogType)}
                    className="bg-white rounded-2xl p-3 border border-gray-200 flex flex-col items-center justify-center gap-2 aspect-square shadow-sm active:scale-95 transition-transform hover:border-gray-300"
                 >
                     <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900">
                         <item.icon size={20} />
                     </div>
                     <span className="text-xs font-bold text-gray-600">{item.label}</span>
                 </button>
             ))}
         </div>
      </div>

      {/* 7. Timeline Section */}
      <div className="px-5 mb-10">
         <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">나의 타임라인</h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                {myLogs.length}건
            </span>
         </div>

         <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            {myLogs.length > 0 ? (
                <div className="relative pl-2">
                    <div className="absolute left-[7px] top-2 bottom-4 w-[1px] bg-gray-100"></div>

                    {displayedLogs.map((log, index) => {
                        const isDiaper = log.type === 'diaper';
                        const isFeeding = log.type === 'feeding';
                        const isSleep = log.type === 'sleep';
                        
                        return (
                            <div key={log.id} className="relative flex gap-4 mb-6 last:mb-0 animate-fade-in group">
                                <div className={`relative z-10 w-4 h-4 rounded-full border-2 border-white shadow-sm mt-1 transition-colors ${index === 0 ? 'bg-lime-400 ring-4 ring-lime-50' : 'bg-gray-300'}`}></div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className={`text-sm font-bold ${index === 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {isDiaper && '기저귀 교체'}
                                            {isFeeding && '수유'}
                                            {isSleep && '수면'}
                                            {log.type === 'health' && '건강 기록'}
                                        </p>
                                        <p className="text-xs text-gray-400 font-mono">{format(log.timestamp, 'HH:mm')}</p>
                                    </div>
                                    {(log.note || log.subType || log.value) && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {log.subType} {log.value && ` · ${log.value}`} {log.note && ` · ${log.note}`}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {myLogs.length > 2 && (
                        <button 
                            onClick={() => setShowAllLogs(!showAllLogs)}
                            className="w-full mt-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            {showAllLogs ? '접기' : '전체 보기'}
                        </button>
                    )}
                </div>
            ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                    기록이 없습니다.
                </div>
            )}
         </div>
      </div>

      {/* Success Toast Popup */}
      {showSuccessToast && (
          <div className="fixed bottom-24 left-5 right-5 z-50 animate-slide-up">
              <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-gray-800">
                  <div className="flex items-center gap-3">
                      <div className="bg-lime-400 text-black p-1.5 rounded-full">
                          <CheckCircle2 size={18} strokeWidth={3} />
                      </div>
                      <div>
                          <p className="font-bold text-sm">인계장 전송 완료!</p>
                          <p className="text-xs text-gray-400">파트너에게 알림을 보냈습니다.</p>
                      </div>
                  </div>
                  <button onClick={handleCloseToast} className="p-2 text-gray-500 hover:text-white transition-colors">
                      <X size={16} />
                  </button>
              </div>
          </div>
      )}

      {/* Modals driven by URL Params */}
      <CaregiverModal 
        isOpen={isCaregiverModalOpen}
        onClose={closeModal}
        users={availableUsers}
        selectedUserId={nextCaregiver.id}
        onSelect={setNextCaregiver}
        onAddNew={() => alert('새 담당자 등록 기능은 준비중입니다!')}
      />

      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={closeModal}
        initialType={quickLogType}
        onSave={handleQuickLogSave}
      />

    </div>
  );
};

export default Dashboard;
