
import React, { useState } from 'react';
import { Home, PieChart, Settings as SettingsIcon, Calendar, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { Routes, Route, useNavigate, useLocation, Link, Outlet, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Settings from './components/Settings';
import Schedule from './components/Schedule';
import Teamwork from './components/Teamwork';
import ShiftModal from './components/ShiftModal';
import DoctorReportModal from './components/DoctorReportModal';
import { Log, LogType, LogSubType, ShiftReport, Mission } from './types';
import { CURRENT_USER, PARTNER_USER, INITIAL_LOGS } from './constants';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logs, setLogs] = useState<Log[]>(INITIAL_LOGS);
  
  // Store the most recent shift report to display on Dashboard
  const [recentReport, setRecentReport] = useState<ShiftReport | null>(null);
  
  // Initial Mock Mission from Grandma (Updated)
  const [activeMissions, setActiveMissions] = useState<Mission[]>([
      {
          id: 'm1',
          text: '저녁 약 먹이기 (해열제)',
          time: '19:00',
          isCompleted: false,
          assignerName: '할머니',
          memo: ''
      },
      {
          id: 'm2',
          text: '목욕 후 로션 꼼꼼히 바르기',
          time: '20:30',
          isCompleted: false,
          assignerName: '할머니',
          memo: ''
      }
  ]);

  // Determine current active tab based on path
  const currentPath = location.pathname;
  let activeTab = 'dashboard';
  if (currentPath.includes('schedule')) activeTab = 'schedule';
  else if (currentPath.includes('history')) activeTab = 'history';
  else if (currentPath.includes('teamwork')) activeTab = 'teamwork';
  else if (currentPath.includes('settings')) activeTab = 'settings';
  // Include 'home' in dashboard tab logic
  else if (currentPath.includes('report') || currentPath.includes('shift') || currentPath.includes('home')) activeTab = 'dashboard';
  else activeTab = 'dashboard';

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
    // 1. Process Missions (Inject assigner as ME)
    const newMissions = report.missions.map(m => ({
        ...m,
        assignerName: CURRENT_USER.name 
    }));
    
    // Update activeMissions demo logic
    if (newMissions.length > 0 || report.missions.length === 0) {
        // In a real app, this logic would be more complex to handle bi-directional state.
    }

    // 2. Save Report to State (Inject author as ME)
    const reportWithAuthor = { ...report, authorName: CURRENT_USER.name };
    setRecentReport(reportWithAuthor);
    
    console.log("Shift Report:", reportWithAuthor);

    // Maze Tracking: Navigate to Home with params indicating success and content existence
    // tab=sent: Switch tab to 'Sent'
    // toast=success: Show toast popup
    // has_report=true: Distinct URL for state where report exists
    navigate('/home?tab=sent&toast=success&has_report=true');
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

  const handleEditReport = (report: ShiftReport) => {
      navigate('/shift', { state: { reportData: report } });
  };

  // Layout wrapper to keep Dashboard mounted while modals are open
  const DashboardLayout = () => (
    <>
      <Dashboard 
        currentUser={CURRENT_USER}
        partner={PARTNER_USER}
        logs={logs}
        activeMissions={activeMissions}
        recentReport={recentReport}
        onAddLog={handleAddLog}
        onOpenShiftModal={() => navigate('/shift')}
        onToggleMission={handleToggleMission}
        onUpdateMissionMemo={handleUpdateMissionMemo}
        onOpenDoctorReport={() => navigate('/report')}
        onEditReport={handleEditReport}
      />
      <Outlet />
    </>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans selection:bg-lime-100">
      
      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-screen bg-[#F9FAFB] sm:shadow-xl sm:border-x sm:border-gray-200 relative">
        <div className="pt-2">
          <Routes>
            {/* Dashboard Routes with Layout for Persistence */}
            <Route element={<DashboardLayout />}>
              {/* Redirect root to /home explicitly for Maze & Clarity */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={null} />
              
              <Route path="/shift" element={
                <ShiftModal 
                  isOpen={true} 
                  onClose={() => navigate(-1)} 
                  onSubmit={handleShiftSubmit}
                />
              } />
              <Route path="/report" element={
                <DoctorReportModal
                  isOpen={true}
                  onClose={() => navigate(-1)}
                />
              } />
            </Route>

            <Route path="/schedule" element={<Schedule />} />
            
            <Route path="/teamwork" element={
                <Teamwork currentUser={CURRENT_USER} partner={PARTNER_USER} />
            } />

            <Route path="/history" element={
                <History 
                    logs={logs} 
                    currentUser={CURRENT_USER} 
                    partner={PARTNER_USER} 
                    onOpenDoctorReport={() => navigate('/report')}
                />
            } />
            <Route path="/settings" element={<Settings currentUser={CURRENT_USER} />} />
          </Routes>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 max-w-md mx-auto">
          <div className="flex justify-around items-center h-16 pb-2">
            <Link 
              to="/home"
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'dashboard' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
            >
              <Home size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">홈</span>
            </Link>
            
            <Link 
              to="/schedule"
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'schedule' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
            >
              <Calendar size={24} strokeWidth={activeTab === 'schedule' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">일정</span>
            </Link>

            <Link 
              to="/teamwork"
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'teamwork' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
            >
              <Sparkles size={24} strokeWidth={activeTab === 'teamwork' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">팀워크</span>
            </Link>

            <Link 
              to="/history"
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'history' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
            >
              <FileText size={24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">리포트</span>
            </Link>

            <Link 
              to="/settings"
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'settings' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
            >
              <SettingsIcon size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">설정</span>
            </Link>
          </div>
        </nav>
      </main>
      
    </div>
  );
};

export default App;
