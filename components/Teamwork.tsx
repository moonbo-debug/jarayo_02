
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User } from '../types';
import { Sparkles, Trophy, Lock, Puzzle, Users, Check, CheckCircle2, Link2, X } from 'lucide-react';
import SendMessageModal from './SendMessageModal';

interface TeamworkProps {
  currentUser: User;
  partner: User;
}

// --- TYPES ---
type ComboType = 'shift' | 'request' | 'flow';
interface TikiTakaCombo {
    id: string;
    type: ComboType;
    fromUser: User;
    toUser: User;
    title: string;
    description: string;
    timestamp: string;
    icon: string;
    score: number;
}

interface Badge {
    id: number;
    name: string;
    icon: string;
    desc: string;
    detail: string;
}

const Teamwork: React.FC<TeamworkProps> = ({ currentUser, partner }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // --- STATE ---
  const [currentXP, setCurrentXP] = useState(850);
  const maxXP = 1200;
  const teamLevel = 12;
  const [collectedCombos, setCollectedCombos] = useState<string[]>([]);
  
  // Derive UI state from URL Params for Maze tracking
  const selectedBadgeId = searchParams.get('badge');
  const isMsgModalOpen = searchParams.get('view') === 'message';

  // Mock Users for Demo
  const grandma: User = { id: 'u3', name: '할머니', role: 'Mom', isDuty: false, batteryLevel: 90, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Grandma' };

  // --- MOCK DATA ---
  const activeBadges: Badge[] = [
      { id: 1, name: '밤샘 수비대', icon: '🌙', desc: '새벽 케어 3회 연속 성공', detail: '모두가 잠든 새벽 2시~5시 사이에 3일 연속으로 수유와 기저귀 교체를 완벽하게 해냈습니다. 진정한 야간 경비조!' },
      { id: 2, name: '칼퇴 요정', icon: '🧚', desc: '교대 시간 오차 5분 이내', detail: '약속된 교대 시간(19:00)을 5분 오차 내로 지켰습니다. 서로의 저녁 있는 삶을 지켜주는 멋진 매너!' },
      { id: 3, name: '배달의 기수', icon: '🍼', desc: '수유 텀 완벽 방어', detail: '아기가 배고파서 울기 전에 딱 맞춰 수유를 준비했습니다. 환상의 타이밍으로 평화를 지켜냈어요.' },
  ];

  const recentCombos: TikiTakaCombo[] = [
      { 
          id: 'c1', type: 'flow', fromUser: currentUser, toUser: partner, 
          title: '배부르고 등 따습게', description: '아빠 수유 ➔ 엄마 재우기 연결', 
          timestamp: '방금 전', icon: '💤', score: 50
      },
      { 
          id: 'c2', type: 'request', fromUser: grandma, toUser: currentUser, 
          title: '미션 임파서블?', description: '할머니 요청 ➔ 아빠 미션 클리어', 
          timestamp: '2시간 전', icon: '✅', score: 30
      },
      { 
          id: 'c3', type: 'shift', fromUser: partner, toUser: currentUser, 
          title: '완벽한 바통터치', description: '인계장 전송 ➔ 3분 내 출근 완료', 
          timestamp: '5시간 전', icon: '🤝', score: 100
      },
  ];

  const selectedBadge = activeBadges.find(b => b.id.toString() === selectedBadgeId) || null;

  // --- HANDLERS ---
  const handleCollectXP = (comboId: string, score: number) => {
      if (collectedCombos.includes(comboId)) return;
      
      setCollectedCombos(prev => [...prev, comboId]);
      setCurrentXP(prev => Math.min(prev + score, maxXP));
  };

  const handleOpenBadge = (id: number) => {
      setSearchParams(prev => {
          prev.set('badge', id.toString());
          return prev;
      });
  };

  const handleCloseBadge = () => {
      setSearchParams(prev => {
          prev.delete('badge');
          return prev;
      });
  };

  const handleOpenMsgModal = () => {
      setSearchParams(prev => {
          prev.set('view', 'message');
          return prev;
      });
  };

  const handleCloseMsgModal = () => {
      setSearchParams(prev => {
          prev.delete('view');
          return prev;
      });
  };

  const handleSendMessage = (text: string) => {
      // Mock sending message
      console.log(`Sending to Partner: ${text}`);
      alert(`💌 ${partner.name}님에게 응원을 보냈습니다!\n" ${text} "`);
      
      // Bonus XP for communication
      if (currentXP < maxXP) {
          setCurrentXP(prev => Math.min(prev + 10, maxXP));
      }
      handleCloseMsgModal();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32 font-sans text-gray-900 overflow-hidden relative">
      
      {/* 1. Header */}
      <div className="px-5 pt-6 pb-4 bg-[#F9FAFB] sticky top-0 z-20 flex justify-between items-center">
          <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
                  육아 팀워크
                  <Sparkles size={20} className="text-lime-500 fill-lime-500" />
              </h1>
              <p className="text-xs text-gray-500 font-bold mt-1">함께라서 더 즐거운 육아 라이프</p>
          </div>
      </div>

      <div className="relative z-10 px-5 pt-2 pb-10 space-y-6">
          
          {/* 1. Team Score Hero Card */}
          <div className="bg-gradient-to-br from-black to-gray-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden transition-all duration-500">
              {/* Abstract Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400 rounded-full blur-[60px] opacity-20"></div>
              
              <div className="relative z-10 flex justify-between items-start mb-6">
                  <div>
                      <div className="flex items-center gap-2 mb-1">
                          <span className="bg-lime-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide">
                              Team Level {teamLevel}
                          </span>
                      </div>
                      <h2 className="text-2xl font-black italic tracking-tight">환상의 콤비</h2>
                      <p className="text-gray-400 text-xs mt-1">우리 팀워크가 불타오르고 있어요! 🔥</p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                      <Trophy size={24} className="text-yellow-400 fill-yellow-400" />
                  </div>
              </div>

              <div className="relative z-10">
                  <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                      <span>현재 경험치</span>
                      <span className="text-white">{currentXP} / {maxXP} XP</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden border border-white/5">
                      <div 
                        style={{ width: `${(currentXP / maxXP) * 100}%` }}
                        className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full shadow-[0_0_10px_rgba(163,230,53,0.5)] transition-all duration-700 ease-out"
                      ></div>
                  </div>
              </div>
          </div>

          {/* 2. Team Badges */}
          <div>
              <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide px-1 flex items-center justify-between">
                  <span>이번 주 획득 타이틀</span>
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">3개</span>
              </h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {activeBadges.map(badge => (
                      <button 
                        key={badge.id} 
                        onClick={() => handleOpenBadge(badge.id)}
                        className="min-w-[120px] bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:border-black transition-colors active:scale-95"
                      >
                          <span className="text-3xl filter drop-shadow-sm">{badge.icon}</span>
                          <div className="text-center">
                              <p className="font-bold text-xs text-gray-900">{badge.name}</p>
                              <p className="text-[9px] text-gray-400 mt-0.5">{badge.desc}</p>
                          </div>
                      </button>
                  ))}
                  <div className="min-w-[100px] bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 opacity-60">
                      <Lock size={20} className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-400">???</span>
                  </div>
              </div>
          </div>

          {/* 3. Reward Puzzle (Updated Image with Prompt) */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Puzzle size={16} /> 베스트 컷 잠금해제
                  </h3>
                  <span className="text-[10px] font-bold text-lime-600 bg-lime-50 px-2 py-1 rounded-full">
                      {Math.floor((currentXP / maxXP) * 100)}% 달성
                  </span>
              </div>
              
              <div className="aspect-square w-full rounded-xl overflow-hidden relative bg-gray-100">
                  {/* Generated Image from Prompt */}
                  <img 
                    src="https://image.pollinations.ai/prompt/cute%20baby%20illustration%2C%20soft%20pastel%20colors%2C%20warm%20atmosphere%2C%20pixar%20style%2C%203d%20render%2C%20high%20quality%2C%20baby%20playing?nologo=true" 
                    onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop"}
                    alt="Best Cut Reward" 
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                       <div className="bg-transparent"></div>
                       <div className="bg-transparent"></div>
                       <div className="bg-white/90 backdrop-blur-sm border border-gray-100 flex items-center justify-center">
                           <Lock size={16} className="text-gray-300" />
                       </div>
                       
                       <div className="bg-transparent"></div>
                       <div className="bg-transparent"></div>
                       <div className="bg-transparent"></div>
                       
                       <div className="bg-white/90 backdrop-blur-sm border border-gray-100 flex items-center justify-center">
                           <Lock size={16} className="text-gray-300" />
                       </div>
                       <div className="bg-transparent"></div>
                       <div className="bg-transparent"></div>
                  </div>
                  
                  {currentXP < maxXP && (
                      <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md rounded-lg p-3 text-center">
                          <p className="text-white text-xs font-bold">
                              팀 XP {maxXP - currentXP}만 더 모으면<br/>이번 주 베스트 컷 공개! 📸
                          </p>
                      </div>
                  )}
              </div>
          </div>

          {/* 4. Tiki-Taka Timeline (Clickable Cards) */}
          <div>
               <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide px-1">
                   오늘의 티키타카 (Combos)
               </h3>
               <div className="space-y-4">
                   {recentCombos.map((combo, idx) => {
                       const isCollected = collectedCombos.includes(combo.id);
                       return (
                           <div key={combo.id} className="relative">
                               {/* CLICKABLE CARD FOR XP COLLECTION */}
                               <button 
                                    onClick={() => handleCollectXP(combo.id, combo.score)}
                                    disabled={isCollected}
                                    className={`w-full text-left bg-white rounded-2xl p-4 border shadow-sm relative transition-all duration-300 overflow-visible ${
                                        isCollected 
                                            ? 'border-gray-100 bg-gray-50 z-10' 
                                            : 'border-gray-200 active:scale-[0.98] hover:border-black cursor-pointer group z-20 hover:z-30'
                                    }`}
                               >
                                   {/* Score Badge (Z-Index increased to 50 to sit on top of everything) */}
                                   <div className={`absolute -top-2 -right-2 z-50 text-[10px] font-bold px-2 py-1 rounded-full shadow-md border-2 border-white flex items-center gap-1 transition-colors ${
                                       isCollected 
                                        ? 'bg-gray-200 text-gray-500' 
                                        : 'bg-black text-white animate-bounce-slow group-hover:bg-lime-400 group-hover:text-black'
                                   }`}>
                                       {isCollected ? <Check size={10} /> : '+'}{combo.score} XP
                                   </div>

                                   <div className={`flex items-center gap-3 mb-3 ${isCollected ? 'opacity-50' : 'opacity-100'}`}>
                                       {/* Avatars */}
                                       <div className="flex items-center">
                                            <div className="relative z-10">
                                                <img src={combo.fromUser.avatar} className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 shadow-sm" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center -ml-2 z-20 border-2 border-white relative">
                                                <span className="text-sm">{combo.icon}</span>
                                            </div>
                                            <div className="relative z-10 -ml-2">
                                                <img src={combo.toUser.avatar} className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 shadow-sm" />
                                            </div>
                                       </div>
                                       
                                       <div className="flex-1 min-w-0">
                                           <h4 className="font-bold text-sm text-gray-900 truncate">{combo.title}</h4>
                                           <span className="text-[10px] text-gray-400">{combo.timestamp}</span>
                                       </div>
                                   </div>

                                   <div className={`rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-2 ${
                                       isCollected ? 'bg-gray-100 text-gray-400' : 'bg-gray-50 text-gray-600'
                                   }`}>
                                       {combo.type === 'shift' && <Users size={12} className={isCollected ? "text-gray-400" : "text-blue-500"} />}
                                       {combo.type === 'request' && <CheckCircle2 size={12} className={isCollected ? "text-gray-400" : "text-green-500"} />}
                                       {combo.type === 'flow' && <Link2 size={12} className={isCollected ? "text-gray-400" : "text-orange-500"} />}
                                       {combo.description}
                                   </div>
                                   
                                   {/* Hover Overlay (Z-Index 40, lower than Badge) */}
                                   {!isCollected && (
                                       <div className="absolute inset-0 flex items-center justify-center bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl backdrop-blur-[1px] z-40">
                                           <span className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">터치하여 XP 수령</span>
                                       </div>
                                   )}
                               </button>
                           </div>
                       );
                   })}
               </div>
          </div>

          {/* Encouragement Button */}
          <div className="pt-4 pb-4 text-center">
              <p className="text-xs text-gray-400 mb-3">서로에게 응원을 보내면 콤보 점수 2배! ✨</p>
              <button 
                onClick={handleOpenMsgModal}
                className="bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
              >
                  💌 배우자에게 '화이팅' 보내기
              </button>
          </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-5">
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-up relative text-center">
                  <button 
                      onClick={handleCloseBadge}
                      className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
                  >
                      <X size={20} />
                  </button>
                  
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm text-5xl">
                      {selectedBadge.icon}
                  </div>
                  
                  <h3 className="text-xl font-black text-gray-900 mb-1">{selectedBadge.name}</h3>
                  <p className="text-xs font-bold text-lime-600 bg-lime-50 inline-block px-2 py-1 rounded-full mb-4">
                      {selectedBadge.desc}
                  </p>
                  
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed text-left border border-gray-100">
                      {selectedBadge.detail}
                  </div>
                  
                  <button 
                      onClick={handleCloseBadge}
                      className="w-full bg-black text-white font-bold py-3.5 rounded-xl mt-6 shadow-lg active:scale-95 transition-transform"
                  >
                      닫기
                  </button>
              </div>
          </div>
      )}

      {/* Message Modal */}
      <SendMessageModal 
        isOpen={isMsgModalOpen}
        onClose={handleCloseMsgModal}
        targetUser={partner}
        onSend={handleSendMessage}
      />

    </div>
  );
};

export default Teamwork;
