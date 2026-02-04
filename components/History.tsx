
import React, { useMemo } from 'react';
import { Log, User } from '../types';
import { Shield, ChevronRight, Utensils, Moon, PieChart as PieChartIcon } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, 
  CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { format, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';

interface HistoryProps {
  logs: Log[];
  currentUser: User;
  partner: User;
  onOpenDoctorReport: () => void;
}

// Stats Helpers
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
  const weeklyData = useMemo(() => generateWeeklyData(), []);

  // Pie Chart Logic
  const stats = useMemo(() => {
    const grandma: User = { id: 'u3', name: '할머니', role: 'Mom', isDuty: false, batteryLevel: 90, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Grandma' };
    const helper: User = { id: 'u4', name: '이모님', role: 'Mom', isDuty: false, batteryLevel: 100, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Liliana' };
    const allUsers = [currentUser, partner, grandma, helper];
    
    return allUsers.map((u) => {
        const userLogs = logs.filter(l => l.user === u.name);
        // Simple point calculation for chart
        const totalPoints = userLogs.length * 10; 
        return {
            ...u,
            points: totalPoints,
        };
    }).sort((a, b) => b.points - a.points);
  }, [logs, currentUser, partner]);

  const pieData = stats.map(u => ({ name: u.name, value: u.points }));

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
          <div className="flex justify-between items-center mb-2">
              <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      리포트
                  </h1>
                  <p className="text-xs text-gray-500 font-bold">우리 아이 건강 데이터 분석</p>
              </div>
          </div>
      </div>

      {/* 2. 컨텐츠 영역 */}
      <div className="relative z-10 px-5 pt-2 pb-10 space-y-6">
          
          <div className="animate-fade-in space-y-5">
              <div 
                onClick={onOpenDoctorReport}
                className="bg-lime-400 rounded-2xl p-5 shadow-sm text-black cursor-pointer active:scale-95 transition-transform relative overflow-hidden flex items-center justify-between"
              >
                  <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                          <Shield size={20} className="text-white" fill="black" />
                          진료용 리포트 확인
                      </h3>
                      <p className="text-gray-800 text-xs mt-1 font-medium">
                          최근 7일간의 건강 데이터 요약 보기
                      </p>
                  </div>
                  <ChevronRight size={20} className="text-black" />
              </div>

              {/* 차트 영역들 */}
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

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                       <h3 className="text-sm font-bold text-gray-900">활동 기록 분포</h3>
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
                                  <span className="font-mono text-gray-400 font-medium">{entry.value}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default History;
