
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Log, User, LogType } from '../types';
import { Trophy, Baby, Utensils, Moon, Activity, Crown, Shield, Star, ChevronRight, PieChart as PieIcon, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, 
  CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend 
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

// 점수 계산 로직
const getPoints = (type: LogType) => {
    switch (type) {
        case 'health': return 30; 
        case 'sleep': return 20; 
        case 'diaper': return 10;
        case 'feeding': return 15;
        default: return 5;
    }
};

// 등급 계산
const getTier = (points: number) => {
    if (points >= 300) return { name: '마스터', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' };
    if (points >= 150) return { name: '다이아', color: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-200' };
    if (points >= 80) return { name: '골드', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' };
    if (points >= 30) return { name: '실버', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };
    return { name: '브론즈', color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' };
};

// 차트 데이터 생성 (Mock Data - 날짜 한글화)
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

// 파이 차트 색상 팔레트
const PIE_COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b'];

const History: React.FC<HistoryProps> = ({ logs, currentUser, partner, onOpenDoctorReport }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'stats' | 'ranking'>('stats');
  
  const weeklyData = useMemo(() => generateWeeklyData(), []);

  // --- 데이터 가공 ---
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
            }
        };
    });

    return userStats.sort((a, b) => b.points - a.points);
  }, [logs, currentUser, partner]);

  // URL에서 선택된 유저 찾기
  const targetUserId = searchParams.get('msgTo');
  const selectedUser = useMemo(() => {
      return stats.find(u => u.id === targetUserId) || null;
  }, [stats, targetUserId]);
  
  const isMsgModalOpen = !!selectedUser;

  // 기여도 파이 차트 데이터
  const pieData = stats.map(u => ({
      name: u.name,
      value: u.points
  }));

  const handleCardClick = (user: any) => {
      setSearchParams(prev => {
          prev.set('msgTo', user.id);
          return prev;
      });
  };

  const closeMsgModal = () => {
      setSearchParams(prev => {
          prev.delete('msgTo');
          return prev;
      });
  };

  const CustomTooltip = ({ active, payload, label, unit }: any) => {
      if (active && payload && payload.length) {
      return (
          <div className="bg-white border border-slate-100 p-2 rounded-lg shadow-xl text-xs z-50">
            <p className="text-slate-500 font-bold mb-1">{label}요일</p>
            <p className="text-indigo-600 font-bold text-sm">{payload[0].value} {unit}</p>
          </div>
      );
      }
      return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-800 overflow-hidden relative">
      
      {/* 1. 상단 헤더 */}
      <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20">
          <div className="flex justify-between items-center mb-4">
              <div>
                  <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      주간 리포트
                  </h1>
                  <p className="text-slate-400 text-xs mt-0.5">
                      데이터로 보는 우리 아이 성장 기록
                  </p>
              </div>
              <button 
                onClick={onOpenDoctorReport} 
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full border border-indigo-100 transition-all active:scale-95 shadow-sm"
              >
                  <Shield className="text-indigo-600" size={14} />
                  <span className="text-xs font-bold text-indigo-600">진료용</span>
              </button>
          </div>

          {/* 탭 전환 */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
              <button 
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'stats' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                  <TrendingUp size={14} /> 건강 통계
              </button>
              <button 
                onClick={() => setActiveTab('ranking')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'ranking' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                  <Trophy size={14} /> 멤버 랭킹
              </button>
          </div>
      </div>

      {/* 2. 컨텐츠 영역 */}
      <div className="relative z-10 px-5 pt-6 pb-10 space-y-6">
          
          {/* TAB 1: 건강 통계 (다양한 차트) */}
          {activeTab === 'stats' && (
              <div className="animate-fade-in space-y-5">
                  
                  {/* 카드 1: 수유량 (Area Chart) */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-rose-50 rounded-lg">
                                <Utensils size={16} className="text-rose-500" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-slate-800">주간 수유량</h3>
                                <p className="text-[10px] text-slate-400">일 평균 850ml 달성</p>
                              </div>
                          </div>
                          <ArrowUpRight size={16} className="text-rose-400" />
                      </div>
                      <div className="h-44 w-full text-xs">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData}>
                              <defs>
                                <linearGradient id="colorFeed" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                              <Tooltip content={<CustomTooltip unit="ml"/>} cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}} />
                              <Area type="monotone" dataKey="feeding" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorFeed)" />
                            </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* 카드 2: 수면 시간 (Bar Chart) */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                               <div className="p-1.5 bg-indigo-50 rounded-lg">
                                <Moon size={16} className="text-indigo-500" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-slate-800">수면 시간</h3>
                                <p className="text-[10px] text-slate-400">규칙적인 수면 패턴 유지 중</p>
                              </div>
                          </div>
                      </div>
                      <div className="h-44 w-full text-xs">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData} barSize={16}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                              <Tooltip content={<CustomTooltip unit="시간"/>} cursor={{fill: '#f8fafc', radius: 4}} />
                              <Bar dataKey="sleep" fill="#6366f1" radius={[4, 4, 4, 4]} />
                            </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* 카드 3: 기저귀 교체 (Line Chart) */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                               <div className="p-1.5 bg-blue-50 rounded-lg">
                                <Baby size={16} className="text-blue-500" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-slate-800">기저귀 교체 횟수</h3>
                                <p className="text-[10px] text-slate-400">평균 9.5회 / 일</p>
                              </div>
                          </div>
                      </div>
                       <div className="h-40 w-full text-xs">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                              <Tooltip content={<CustomTooltip unit="회"/>} />
                              <Line 
                                type="monotone" 
                                dataKey="diaper" 
                                stroke="#3b82f6" 
                                strokeWidth={3} 
                                dot={{r: 4, fill: 'white', stroke: '#3b82f6', strokeWidth: 2}} 
                                activeDot={{r: 6}}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* 카드 4: 기여도 분석 (Donut Chart) */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-center mb-2">
                           <div className="flex items-center gap-2">
                               <div className="p-1.5 bg-emerald-50 rounded-lg">
                                <PieIcon size={16} className="text-emerald-500" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-slate-800">멤버별 육아 기여도</h3>
                              </div>
                          </div>
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
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="w-1/2 pl-2 space-y-2">
                              {pieData.map((entry, index) => (
                                  <div key={index} className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                                          <span className="font-bold text-slate-600 truncate max-w-[60px]">{entry.name}</span>
                                      </div>
                                      <span className="font-mono text-slate-400 font-medium">{entry.value}p</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

              </div>
          )}

          {/* TAB 2: 멤버 랭킹 */}
          {activeTab === 'ranking' && (
              <div className="animate-fade-in space-y-4">
                  
                  {/* 상단 MVP 카드 */}
                  <div 
                    onClick={() => handleCardClick(stats[0])}
                    className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-indigo-200 cursor-pointer active:scale-[0.99] text-white"
                  >
                      <div className="relative shrink-0">
                          <div className="w-16 h-16 rounded-full border-2 border-white/30 p-1 shadow-inner bg-white/10">
                              <img src={stats[0].avatar} className="w-full h-full rounded-full bg-slate-800 object-cover" />
                          </div>
                          <div className="absolute -top-4 -right-2 animate-bounce">
                              <Crown size={28} className="text-yellow-300 fill-yellow-300 drop-shadow-md" />
                          </div>
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                              <span className="text-yellow-300 font-extrabold text-[10px] bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">Weekly MVP</span>
                          </div>
                          <h2 className="text-xl font-black truncate leading-tight">{stats[0].name}</h2>
                          <div className="flex items-center gap-2 text-xs text-indigo-100 mt-1 opacity-90">
                              <span className="font-bold">{stats[0].tier.name} 티어</span>
                              <span>•</span>
                              <span className="font-mono font-bold">{stats[0].points} XP</span>
                          </div>
                      </div>
                      <ChevronRight className="text-white/50" size={24}/>
                  </div>

                  <h3 className="text-xs font-bold text-slate-400 mt-6 mb-2 uppercase tracking-wide px-1">전체 순위</h3>
                  
                  {/* 리스트형 랭킹 */}
                  <div className="space-y-3">
                      {stats.map((user, index) => {
                          const isMe = user.id === currentUser.id;
                          
                          return (
                              <div 
                                key={user.id}
                                onClick={() => handleCardClick(user)}
                                className={`relative flex items-center gap-3 p-3.5 rounded-xl border transition-all active:scale-[0.98] cursor-pointer
                                    ${isMe 
                                        ? 'bg-indigo-50 border-indigo-200 shadow-[0_0_0_1px_rgba(99,102,241,0.2)]' 
                                        : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                                    }
                                `}
                              >
                                  {/* 순위 */}
                                  <div className={`text-lg font-black w-6 text-center ${index < 3 ? 'text-indigo-900' : 'text-slate-400'}`}>
                                      {index + 1}
                                  </div>

                                  {/* 아바타 */}
                                  <div className="relative shrink-0">
                                      <img src={user.avatar} className="w-11 h-11 rounded-full bg-slate-100 object-cover border border-slate-100" />
                                      {/* '나' 표시 강화 */}
                                      {isMe && (
                                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm border border-white whitespace-nowrap z-10 flex items-center gap-0.5">
                                              <Star size={8} fill="currentColor"/> 나
                                          </div>
                                      )}
                                  </div>

                                  {/* 정보 */}
                                  <div className="flex-1 min-w-0 flex justify-between items-center pl-2">
                                      <div>
                                          <div className="flex items-center gap-2">
                                              <span className={`text-sm font-bold truncate ${isMe ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                  {user.name}
                                              </span>
                                              <span className={`text-[9px] px-1.5 rounded font-bold border ${user.tier.color} ${user.tier.bg} ${user.tier.border}`}>
                                                  {user.tier.name}
                                              </span>
                                          </div>
                                          
                                          {/* 활동 아이콘 요약 */}
                                          <div className="flex gap-3 text-[10px] text-slate-400 mt-1.5 font-medium">
                                              <span className="flex items-center gap-0.5"><Utensils size={10} className="text-slate-400"/> {user.breakdown.feeding}</span>
                                              <span className="flex items-center gap-0.5"><Moon size={10} className="text-slate-400"/> {user.breakdown.sleep}</span>
                                              <span className="flex items-center gap-0.5"><Baby size={10} className="text-slate-400"/> {user.breakdown.diaper}</span>
                                          </div>
                                      </div>
                                      
                                      <div className="text-right">
                                          <span className="block text-sm font-black text-slate-800 font-mono">{user.points}</span>
                                          <span className="text-[10px] text-slate-400 font-bold">XP</span>
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          )}
      </div>

      {/* 메시지 모달 */}
      {selectedUser && (
        <SendMessageModal 
            isOpen={isMsgModalOpen}
            onClose={closeMsgModal}
            targetUser={selectedUser}
        />
      )}

    </div>
  );
};

export default History;
