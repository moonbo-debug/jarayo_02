
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Log, User, LogType } from '../types';
import { Shield, ChevronRight, Utensils, Moon, Baby, Crown, BarChart3, MessageCircle, Zap, PieChart as PieChartIcon, X } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, 
  CartesianGrid, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import SendMessageModal from './SendMessageModal';
import { format, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';

interface HistoryProps {
  logs: Log[];
  currentUser: User;
  partner: User;
  onOpenDoctorReport: () => void;
}

const getPoints = (type: LogType) => {
    switch (type) {
        case 'health': return 30; 
        case 'sleep': return 20; 
        case 'diaper': return 10;
        case 'feeding': return 15;
        default: return 5;
    }
};

const getTier = (points: number) => {
    if (points >= 300) return { name: '마스터', color: 'text-gray-900', badge: 'bg-lime-400' };
    if (points >= 150) return { name: '다이아', color: 'text-gray-900', badge: 'bg-gray-200' };
    if (points >= 80) return { name: '골드', color: 'text-gray-800', badge: 'bg-yellow-100' };
    if (points >= 30) return { name: '실버', color: 'text-gray-600', badge: 'bg-gray-100' };
    return { name: '브론즈', color: 'text-gray-500', badge: 'bg-gray-50' };
};

const generateWeeklyData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        data.push({
            name: format(date, 'E', { locale: ko }),
            feeding: Math.floor(Math.random() * (900 - 600) + 600),
            sleep: parseFloat((Math.random() * (14 - 10) + 10).toFixed(1)),
            diaper: Math.floor(Math.random() * (12 - 6) + 6),
        });
    }
    return data;
};

const PIE_COLORS = ['#111827', '#9ca3af', '#d1d5db', '#bef264'];

const History: React.FC<HistoryProps> = ({ logs, currentUser, partner, onOpenDoctorReport }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'stats' | 'ranking'>('stats');
  
  // Bottom Sheet Logic for Ranking
  const [selectedRankUser, setSelectedRankUser] = useState<any | null>(null);
  const [showRankAnalysis, setShowRankAnalysis] = useState(false);

  const [sentMessages, setSentMessages] = useState<{id: string, toUser: User, text: string, time: Date}[]>([]);
  const weeklyData = useMemo(() => generateWeeklyData(), []);

  const stats = useMemo(() => {
    const grandma: User = { id: 'u3', name: '할머니', role: 'Mom', isDuty: false, batteryLevel: 90, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Grandma' };
    const helper: User = { id: 'u4', name: '이모님', role: 'Mom', isDuty: false, batteryLevel: 100, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Liliana' };
    
    const allUsers = [currentUser, partner, grandma, helper];
    
    const userStats = allUsers.map((u) => {
        const userLogs = logs.filter(l => l.user === u.name);
        const totalPoints = userLogs.reduce((acc, log) => acc + getPoints(log.type), 0);
        return {
            ...u,
            points: totalPoints,
            tier: getTier(totalPoints),
            logCount: userLogs.length,
            breakdown: {
                diaper: userLogs.filter(l => l.type === 'diaper').length,
                feeding: userLogs.filter(l => l.type === 'feeding').length,
                sleep: userLogs.filter(l => l.type === 'sleep').length,
                health: userLogs.filter(l => l.type === 'health').length,
            }
        };
    });

    return userStats.sort((a, b) => b.points - a.points);
  }, [logs, currentUser, partner]);

  // URL에서 선택된 유저 찾기 (for Message Modal)
  const targetUserId = searchParams.get('msgTo');
  const msgTargetUser = useMemo(() => {
      return stats.find(u => u.id === targetUserId) || null;
  }, [stats, targetUserId]);
  
  const isMsgModalOpen = !!msgTargetUser;

  const pieData = stats.map(u => ({
      name: u.name,
      value: u.points
  }));

  const handleCardClick = (user: any) => {
      setSelectedRankUser(user);
      setShowRankAnalysis(false); 
  };

  const closeRankDetail = () => {
      setSelectedRankUser(null);
  };

  const openMessageModal = (userId: string) => {
      setSelectedRankUser(null); // Close bottom sheet
      setSearchParams(prev => {
          prev.set('msgTo', userId);
          return prev;
      });
  };

  const closeMsgModal = () => {
      setSearchParams(prev => {
          prev.delete('msgTo');
          return prev;
      });
  };

  const handleSendMessage = (text: string) => {
      if (msgTargetUser) {
          setSentMessages(prev => [
              { id: Date.now().toString(), toUser: msgTargetUser, text, time: new Date() },
              ...prev
          ]);
      }
  };

  const CustomTooltip = ({ active, payload, label, unit }: any) => {
      if (active && payload && payload.length) {
      return (
          <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-lg text-xs z-50">
            <p className="text-gray-400 font-bold mb-1">{label}요일</p>
            <p className="text-gray-900 font-bold text-sm">{payload[0].value} {unit}</p>
          </div>
      );
      }
      return null;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32 font-sans text-gray-900 overflow-hidden relative">
      
      {/* 1. 상단 헤더 */}
      <div className="px-5 pt-6 pb-4 bg-[#F9FAFB] sticky top-0 z-20">
          <div className="flex justify-between items-center mb-6">
              <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      리포트
                  </h1>
              </div>
          </div>

          {/* 탭 전환 */}
          <div className="flex p-1 bg-gray-200 rounded-lg">
              <button 
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${
                    activeTab === 'stats' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                  건강 통계
              </button>
              <button 
                onClick={() => setActiveTab('ranking')}
                className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${
                    activeTab === 'ranking' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                  멤버 랭킹
              </button>
          </div>
      </div>

      {/* 2. 컨텐츠 영역 */}
      <div className="relative z-10 px-5 pt-2 pb-10 space-y-6">
          
          {/* TAB 1: 건강 통계 */}
          {activeTab === 'stats' && (
              <div className="animate-fade-in space-y-5">
                  <div 
                    onClick={onOpenDoctorReport}
                    className="bg-lime-400 rounded-2xl p-5 shadow-sm text-black cursor-pointer active:scale-95 transition-transform relative overflow-hidden flex items-center justify-between"
                  >
                      <div>
                          <h3 className="text-lg font-bold flex items-center gap-2">
                              <Shield size={20} className="text-white" fill="black" />
                              진료용 리포트
                          </h3>
                          <p className="text-gray-800 text-xs mt-1 font-medium">
                              최근 7일간의 건강 데이터 요약
                          </p>
                      </div>
                      <ChevronRight size={20} className="text-black" />
                  </div>

                  {/* 카드 1: 수유량 (Area Chart) */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-0.5">주간 수유량</h3>
                            <p className="text-[10px] text-gray-400">일 평균 850ml 달성</p>
                          </div>
                          <Utensils size={18} className="text-gray-300" />
                      </div>
                      <div className="h-44 w-full text-xs">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData}>
                              <defs>
                                <linearGradient id="colorFeed" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#111827" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                              <XAxis dataKey="name" tick={{fontSize: 11, fill: '#9ca3af'}} axisLine={false} tickLine={false} dy={10} />
                              <Tooltip content={<CustomTooltip unit="ml"/>} cursor={{stroke: '#e5e7eb', strokeWidth: 1}} />
                              <Area type="monotone" dataKey="feeding" stroke="#111827" strokeWidth={2} fillOpacity={1} fill="url(#colorFeed)" />
                            </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* 카드 2: 수면 시간 (Bar Chart) */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-0.5">수면 시간</h3>
                            <p className="text-[10px] text-gray-400">규칙적인 수면 패턴 유지 중</p>
                          </div>
                          <Moon size={18} className="text-gray-300" />
                      </div>
                      <div className="h-44 w-full text-xs">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData} barSize={12}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                              <XAxis dataKey="name" tick={{fontSize: 11, fill: '#9ca3af'}} axisLine={false} tickLine={false} dy={10} />
                              <Tooltip content={<CustomTooltip unit="시간"/>} cursor={{fill: '#f9fafb', radius: 4}} />
                              <Bar dataKey="sleep" fill="#111827" radius={[4, 4, 4, 4]} />
                            </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* 카드 3: 기저귀 교체 (Line Chart) */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-0.5">기저귀 교체 횟수</h3>
                            <p className="text-[10px] text-gray-400">평균 9.5회 / 일</p>
                          </div>
                          <Baby size={18} className="text-gray-300" />
                      </div>
                       <div className="h-40 w-full text-xs">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                              <XAxis dataKey="name" tick={{fontSize: 11, fill: '#9ca3af'}} axisLine={false} tickLine={false} dy={10} />
                              <Tooltip content={<CustomTooltip unit="회"/>} />
                              <Line 
                                type="monotone" 
                                dataKey="diaper" 
                                stroke="#111827" 
                                strokeWidth={2} 
                                dot={{r: 3, fill: 'white', stroke: '#111827', strokeWidth: 2}} 
                                activeDot={{r: 5}}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* 카드 4: 기여도 분석 (Pie Chart) */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                           <h3 className="text-sm font-bold text-gray-900">멤버별 육아 기여도</h3>
                           <PieChartIcon size={18} className="text-gray-300" />
                      </div>
                      <div className="flex items-center">
                          <div className="h-40 w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={pieData} 
                                        innerRadius={35} 
                                        outerRadius={55} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                        cornerRadius={4}
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="w-1/2 pl-4 space-y-3">
                              {pieData.map((entry, index) => (
                                  <div key={index} className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                                          <span className="font-bold text-gray-700 truncate max-w-[60px]">{entry.name}</span>
                                      </div>
                                      <span className="font-mono text-gray-400 font-medium">{entry.value}p</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* TAB 2: 멤버 랭킹 (Reverted to Bottom Sheet) */}
          {activeTab === 'ranking' && (
              <div className="animate-fade-in space-y-4">
                  
                  {/* 상단 MVP 카드 */}
                  <div 
                    onClick={() => handleCardClick(stats[0])}
                    className="relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm cursor-pointer active:scale-[0.99]"
                  >
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-full border border-gray-100 p-0.5">
                                <img src={stats[0].avatar} className="w-full h-full rounded-full bg-gray-50 object-cover" />
                            </div>
                            <div className="absolute -top-3 -right-2">
                                <Crown size={24} className="text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-black font-bold text-[10px] bg-lime-400 px-2 py-0.5 rounded">Weekly MVP</span>
                            </div>
                            <h2 className="text-lg font-bold truncate text-gray-900">{stats[0].name}</h2>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <span className="font-medium">{stats[0].tier.name} 티어</span>
                                <span>•</span>
                                <span className="font-mono font-bold text-gray-900">{stats[0].points} XP</span>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-300" size={20}/>
                      </div>
                  </div>

                  <h3 className="text-xs font-bold text-gray-400 mt-6 mb-2 uppercase tracking-wide px-1">전체 순위</h3>
                  
                  {/* 리스트형 랭킹 */}
                  <div className="space-y-3">
                      {stats.map((user, index) => {
                          const isMe = user.id === currentUser.id;

                          return (
                              <div 
                                key={user.id}
                                onClick={() => handleCardClick(user)}
                                className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all active:scale-[0.99] cursor-pointer bg-white overflow-hidden ${
                                    isMe ? 'border-gray-900 shadow-sm' : 'border-gray-100 hover:border-gray-300'
                                }`}
                              >
                                  {/* 순위 */}
                                  <div className={`text-lg font-black w-6 text-center ${index < 3 ? 'text-gray-900' : 'text-gray-300'}`}>
                                      {index + 1}
                                  </div>

                                  {/* 아바타 */}
                                  <div className="relative shrink-0">
                                      <img src={user.avatar} className="w-10 h-10 rounded-full bg-gray-50 object-cover border border-gray-100" />
                                      {isMe && (
                                          <div className="absolute -bottom-1 -right-1 bg-black text-white text-[9px] font-bold px-1 py-0.5 rounded shadow-sm border border-white z-10">
                                              ME
                                          </div>
                                      )}
                                  </div>

                                  {/* 정보 */}
                                  <div className="flex-1 min-w-0 flex justify-between items-center pl-2">
                                      <div>
                                          <div className="flex items-center gap-2">
                                              <span className="text-sm font-bold text-gray-900 truncate">
                                                  {user.name}
                                              </span>
                                              <span className={`text-[9px] px-1.5 rounded font-bold ${user.tier.badge} text-gray-900`}>
                                                  {user.tier.name}
                                              </span>
                                          </div>
                                          
                                          <div className="flex gap-3 text-[10px] text-gray-400 mt-1.5 font-medium">
                                              <span className="flex items-center gap-0.5"><Utensils size={10}/> {user.breakdown.feeding}</span>
                                              <span className="flex items-center gap-0.5"><Moon size={10}/> {user.breakdown.sleep}</span>
                                          </div>
                                      </div>
                                      
                                      <div className="text-right">
                                          <span className="block text-sm font-black text-gray-900 font-mono">{user.points}</span>
                                          <span className="text-[10px] text-gray-400 font-bold">XP</span>
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>

                  {/* Sent Messages Log */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide px-1 mb-3">내가 보낸 응원 메시지</h3>
                      {sentMessages.length === 0 ? (
                          <div className="text-center py-6 bg-white rounded-xl border border-dashed border-gray-200">
                              <p className="text-xs text-gray-400">아직 보낸 메시지가 없습니다.</p>
                          </div>
                      ) : (
                          <div className="space-y-3">
                              {sentMessages.map((msg) => (
                                  <div key={msg.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3 animate-fade-in">
                                      <img src={msg.toUser.avatar} className="w-8 h-8 rounded-full border border-gray-100 bg-gray-50 shrink-0"/>
                                      <div className="flex-1">
                                          <div className="flex justify-between items-center mb-1">
                                              <span className="text-xs font-bold text-gray-900">To. {msg.toUser.name}</span>
                                              <span className="text-[10px] text-gray-400">{format(msg.time, 'HH:mm')}</span>
                                          </div>
                                          <div className="text-xs text-gray-600 font-medium">
                                              "{msg.text}"
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>

              </div>
          )}
      </div>

       {/* NEW: User Ranking Detail Bottom Sheet (Restored) */}
       {selectedRankUser && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up">
                  {/* Header with User Info */}
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                           <img src={selectedRankUser.avatar} className="w-12 h-12 rounded-full border border-gray-100 bg-gray-50" />
                           <div>
                               <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                   {selectedRankUser.name}
                                   <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${selectedRankUser.tier.badge}`}>
                                       {selectedRankUser.tier.name}
                                   </span>
                               </h3>
                               <p className="text-xs text-gray-500 font-mono mt-0.5">Total: {selectedRankUser.points} XP</p>
                           </div>
                      </div>
                      <button onClick={closeRankDetail} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-black">
                          <X size={20} />
                      </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                      {showRankAnalysis ? (
                          <div className="animate-fade-in">
                               <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                   <BarChart3 size={16}/> 점수 상세 분석
                               </h4>
                               <div className="space-y-3 mb-6">
                                   <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                       <span className="text-xs font-bold text-gray-600 flex items-center gap-2"><Utensils size={14}/> 수유 ({selectedRankUser.breakdown.feeding}회)</span>
                                       <span className="text-sm font-bold text-gray-900">+{selectedRankUser.breakdown.feeding * 15}p</span>
                                   </div>
                                   <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                       <span className="text-xs font-bold text-gray-600 flex items-center gap-2"><Moon size={14}/> 수면 ({selectedRankUser.breakdown.sleep}회)</span>
                                       <span className="text-sm font-bold text-gray-900">+{selectedRankUser.breakdown.sleep * 20}p</span>
                                   </div>
                                   <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                       <span className="text-xs font-bold text-gray-600 flex items-center gap-2"><Baby size={14}/> 기저귀 ({selectedRankUser.breakdown.diaper}회)</span>
                                       <span className="text-sm font-bold text-gray-900">+{selectedRankUser.breakdown.diaper * 10}p</span>
                                   </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                       <span className="text-xs font-bold text-gray-600 flex items-center gap-2"><Zap size={14}/> 기타 활동</span>
                                       <span className="text-sm font-bold text-gray-900">+{selectedRankUser.points - ((selectedRankUser.breakdown.feeding * 15) + (selectedRankUser.breakdown.sleep * 20) + (selectedRankUser.breakdown.diaper * 10))}p</span>
                                   </div>
                               </div>
                               <button 
                                    onClick={() => setShowRankAnalysis(false)} 
                                    className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm"
                                >
                                    뒤로 가기
                                </button>
                          </div>
                      ) : (
                          <div className="flex gap-3">
                              <button 
                                onClick={() => setShowRankAnalysis(true)}
                                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold flex flex-col items-center gap-2 transition-colors"
                              >
                                  <BarChart3 size={24} />
                                  <span className="text-xs">랭킹 분석</span>
                              </button>

                              {/* Message Button - Disabled if it's Me */}
                              {selectedRankUser.id !== currentUser.id ? (
                                  <button 
                                    onClick={() => openMessageModal(selectedRankUser.id)}
                                    className="flex-1 py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-bold flex flex-col items-center gap-2 transition-colors shadow-lg active:scale-95"
                                  >
                                      <MessageCircle size={24} className="text-lime-400" />
                                      <span className="text-xs">응원 보내기</span>
                                  </button>
                              ) : (
                                  <div className="flex-1 py-4 bg-gray-50 text-gray-300 rounded-xl font-bold flex flex-col items-center gap-2 border border-gray-100 cursor-not-allowed">
                                      <MessageCircle size={24} />
                                      <span className="text-xs">나에게 메시지 불가</span>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* 메시지 모달 (This remains as a modal for the actual message input) */}
      {msgTargetUser && (
        <SendMessageModal 
            isOpen={isMsgModalOpen}
            onClose={closeMsgModal}
            targetUser={msgTargetUser}
            onSend={handleSendMessage}
        />
      )}

    </div>
  );
};

export default History;
