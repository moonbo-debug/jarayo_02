import React, { useState } from 'react';
import { Home, PieChart, Settings as SettingsIcon, Calendar } from 'lucide-react';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Settings from './components/Settings';
import Schedule from './components/Schedule';
import ShiftModal from './components/ShiftModal';
import DoctorReportModal from './components/DoctorReportModal';
import { ViewState, Log, LogType, LogSubType, ShiftReport, Mission } from './types';
import { CURRENT_USER, PARTNER_USER, INITIAL_LOGS } from './constants';

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isDoctorReportOpen, setIsDoctorReportOpen] = useState(false); // Global state for Doctor Report
  const [logs, setLogs] = useState<Log[]>(INITIAL_LOGS);
  
  // Initial Mock Mission from Partner
  const [activeMissions, setActiveMissions] = useState<Mission[]>([
      {
          id: 'm1',
          text: '저녁 약 먹이기 (해열제)',
          time: '19:00',
          isCompleted: false,
          assignerName: PARTNER_USER.name,
          memo: ''
      }
  ]);

  // Handlers
  const handleAddLog = (type: LogType, subType?: LogSubType, value?: string, note?: string) => {
    const newLog: Log = {
      id: Date.now().toString(),
      type,
      subType,
      timestamp: new Date(),
      user: CURRENT_USER.name,
      value,
      note,
    };
    setLogs([newLog, ...logs]);
  };

  const handleShiftSubmit = (report: ShiftReport) => {
    // 1. Process Missions
    const newMissions = report.missions.map(m => ({
        ...m,
        assignerName: CURRENT_USER.name // Sent by me
    }));
    
    // Demo: Refresh active missions with the new ones
    setActiveMissions(newMissions);

    console.log("Shift Report:", report);
    
    const moodMap: Record<string, string> = {
        happy: '🥰 좋음',
        fussy: '😫 찡찡',
        sleeping: '😴 수면중',
        sick: '🤒 아픔',
        hungry: '🍼 배고픔',
        energetic: '🤸 활발',
        calm: '🧘 평온',
        poop: '💩 응가함'
    };

    const moodsText = report.babyMoods.map(m => moodMap[m]).join(', ');
    const missionsText = report.missions.map(m => `- ${m.time} ${m.text}`).join('\n');

    alert(
        `[인계 완료] 리포트가 전송되었습니다!\n\n` +
        `👶 아기 상태: ${moodsText || '기록 없음'}\n` +
        `🚨 전달 미션:\n${missionsText || '없음'}\n` +
        `📝 요약: ${report.autoBriefing}\n` +
        `💬 한마디: ${report.wishlist}`
    );
  };

  const handleToggleMission = (id: string) => {
      setActiveMissions(prev => prev.map(m => 
          m.id === id ? { ...m, isCompleted: !m.isCompleted } : m
      ));
  };

  const handleUpdateMissionMemo = (id: string, memo: string) => {
      setActiveMissions(prev => prev.map(m => 
          m.id === id ? { ...m, memo } : m
      ));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            currentUser={CURRENT_USER}
            partner={PARTNER_USER}
            logs={logs}
            activeMissions={activeMissions}
            onAddLog={handleAddLog}
            onOpenShiftModal={() => setIsShiftModalOpen(true)}
            onToggleMission={handleToggleMission}
            onUpdateMissionMemo={handleUpdateMissionMemo}
            onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
          />
        );
      case 'schedule':
        return <Schedule />;
      case 'history':
        return (
            <History 
                logs={logs} 
                currentUser={CURRENT_USER} 
                partner={PARTNER_USER} 
                onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
            />
        );
      case 'settings':
        return <Settings currentUser={CURRENT_USER} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-indigo-100">
      
      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-screen bg-white sm:shadow-xl sm:border-x sm:border-gray-100 relative">
        <div className="pt-2">
          {renderView()}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 max-w-md mx-auto">
          <div className="flex justify-around items-center h-16 pb-2">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'dashboard' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Home size={24} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">홈</span>
            </button>
            
            <button 
              onClick={() => setCurrentView('schedule')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'schedule' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Calendar size={24} strokeWidth={currentView === 'schedule' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">일정</span>
            </button>

            <button 
              onClick={() => setCurrentView('history')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'history' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <PieChart size={24} strokeWidth={currentView === 'history' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">통계</span>
            </button>

            <button 
              onClick={() => setCurrentView('settings')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'settings' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <SettingsIcon size={24} strokeWidth={currentView === 'settings' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">설정</span>
            </button>
          </div>
        </nav>
      </main>

      {/* Modals */}
      <ShiftModal 
        isOpen={isShiftModalOpen} 
        onClose={() => setIsShiftModalOpen(false)} 
        onSubmit={handleShiftSubmit}
      />

      <DoctorReportModal
        isOpen={isDoctorReportOpen}
        onClose={() => setIsDoctorReportOpen(false)}
      />
      
    </div>
  );
};

export default App;