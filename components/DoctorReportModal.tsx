import React, { useState } from 'react';
import { ArrowLeft, Calendar, Moon, Milk, Baby, AlertCircle, Plus, Pencil, Check, Share, FileText, ChevronRight, X, Save, ClipboardList } from 'lucide-react';

interface DoctorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type HealthStat = {
    value: string;
    memo: string;
};

const DoctorReportModal: React.FC<DoctorReportModalProps> = ({ isOpen, onClose }) => {
  // State for Editable Stats
  const [sleepStat, setSleepStat] = useState<HealthStat>({ value: '11.5', memo: '' });
  const [feedingStat, setFeedingStat] = useState<HealthStat>({ value: '820', memo: '' });
  const [poopStat, setPoopStat] = useState<HealthStat>({ value: '2.1', memo: '' });
  
  // NEW: Overall Memo State
  const [overallMemo, setOverallMemo] = useState('');
  const [isEditingOverallMemo, setIsEditingOverallMemo] = useState(false);
  
  const [editingSection, setEditingSection] = useState<'sleep' | 'feeding' | 'poop' | null>(null);

  // Mock Data for Charts (Static for demo)
  const sleepData = [0.4, 0.6, 0.5, 0.4, 0.7, 0.8, 0.6]; 
  const feedingData = [0.6, 0.6, 0.6, 0.7, 0.6, 0.6, 0.8];
  
  // Mock Questions
  const [questions, setQuestions] = useState([
    { id: 1, text: '최근 밤잠을 자주 설치는데 정상인가요?', memo: '1시간 간격으로 깸, 달래도 잘 안 멈춤', checked: true },
    { id: 2, text: '이유식 후 입가에 발진이 생깁니다.', memo: '계란 노른자 먹인 후 빨갛게 올라옴', checked: true },
    { id: 3, text: '비타민D는 계속 먹여야 하나요?', memo: '현재 드롭형 2방울 섭취 중', checked: false },
  ]);

  const toggleQuestion = (id: number) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, checked: !q.checked } : q));
  };

  const handleSave = () => {
      setEditingSection(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="w-full max-w-md bg-gray-50 sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up h-[90vh] flex flex-col">
        
        {/* 1. Header */}
        <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-900">병원 진료용 리포트</h2>
          <button onClick={onClose} className="p-2 -mr-2 hover:bg-gray-50 rounded-full text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pb-24 no-scrollbar">
            
            {/* Date Selector */}
            <div className="px-5 py-4 flex justify-between items-center bg-white border-b border-gray-50">
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} className="text-blue-500" />
                    <span className="font-bold text-sm">2023.10.20 - 10.27 (7일간)</span>
                </div>
                <button className="text-xs font-bold text-blue-500 hover:bg-blue-50 px-2 py-1 rounded">기간 변경</button>
            </div>

            {/* 2. 7-Day Summary */}
            <div className="px-5 pt-8 pb-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    7일 건강 요약
                    <span className="text-[10px] font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">터치하여 수정 가능</span>
                </h3>
                
                {/* Sleep Card */}
                <div className={`bg-white rounded-2xl p-5 shadow-sm border mb-4 transition-all ${editingSection === 'sleep' ? 'border-purple-300 ring-2 ring-purple-50' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <Moon size={16} className="text-purple-500 fill-purple-500" />
                            <span className="text-sm font-bold text-gray-600">평균 수면</span>
                        </div>
                        {editingSection === 'sleep' ? (
                            <button onClick={handleSave} className="text-purple-600 hover:bg-purple-50 p-1.5 rounded-lg transition-colors">
                                <Save size={16} />
                            </button>
                        ) : (
                            <button onClick={() => setEditingSection('sleep')} className="text-gray-300 hover:text-gray-500 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                                <Pencil size={14} />
                            </button>
                        )}
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="w-full">
                            <div className="flex items-baseline gap-1 mb-1">
                                {editingSection === 'sleep' ? (
                                    <input 
                                        type="number" 
                                        value={sleepStat.value} 
                                        onChange={(e) => setSleepStat({...sleepStat, value: e.target.value})}
                                        className="text-2xl font-bold text-gray-900 border-b border-purple-200 focus:border-purple-500 outline-none w-20 bg-transparent"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900">{sleepStat.value}</span>
                                )}
                                <span className="text-sm font-medium text-gray-500">시간</span>
                            </div>
                            
                            {editingSection === 'sleep' ? (
                                <textarea 
                                    placeholder="의사 선생님께 보여줄 메모 (예: 낮잠 누락됨)"
                                    value={sleepStat.memo}
                                    onChange={(e) => setSleepStat({...sleepStat, memo: e.target.value})}
                                    className="w-full mt-2 text-xs p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-300 resize-none"
                                    rows={2}
                                />
                            ) : (
                                <>
                                    <span className="text-xs text-gray-400 block">지난주 대비 -0.5시간</span>
                                    {sleepStat.memo && (
                                        <div className="mt-2 text-xs bg-purple-50 text-purple-700 px-2 py-1.5 rounded-lg flex items-start gap-1">
                                            <FileText size={10} className="mt-0.5 shrink-0"/> {sleepStat.memo}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        
                        {/* Chart (Hide slightly when editing to focus on input) */}
                        <div className={`flex items-end gap-1.5 h-12 transition-opacity ${editingSection === 'sleep' ? 'opacity-30' : 'opacity-100'}`}>
                            {sleepData.map((h, i) => (
                                <div key={i} style={{ height: `${h * 100}%` }} className={`w-2 rounded-t-sm ${i === 6 ? 'bg-purple-500' : 'bg-purple-100'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feeding Card */}
                <div className={`bg-white rounded-2xl p-5 shadow-sm border mb-4 transition-all ${editingSection === 'feeding' ? 'border-blue-300 ring-2 ring-blue-50' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <Milk size={16} className="text-blue-500 fill-blue-500" />
                            <span className="text-sm font-bold text-gray-600">평균 수유</span>
                        </div>
                        {editingSection === 'feeding' ? (
                            <button onClick={handleSave} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
                                <Save size={16} />
                            </button>
                        ) : (
                            <button onClick={() => setEditingSection('feeding')} className="text-gray-300 hover:text-gray-500 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                                <Pencil size={14} />
                            </button>
                        )}
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="w-full">
                            <div className="flex items-baseline gap-1 mb-1">
                                {editingSection === 'feeding' ? (
                                    <input 
                                        type="number" 
                                        value={feedingStat.value} 
                                        onChange={(e) => setFeedingStat({...feedingStat, value: e.target.value})}
                                        className="text-2xl font-bold text-gray-900 border-b border-blue-200 focus:border-blue-500 outline-none w-24 bg-transparent"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900">{feedingStat.value}</span>
                                )}
                                <span className="text-sm font-medium text-gray-500">ml</span>
                            </div>
                            
                            {editingSection === 'feeding' ? (
                                <textarea 
                                    placeholder="메모를 입력하세요..."
                                    value={feedingStat.memo}
                                    onChange={(e) => setFeedingStat({...feedingStat, memo: e.target.value})}
                                    className="w-full mt-2 text-xs p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-300 resize-none"
                                    rows={2}
                                />
                            ) : (
                                <>
                                    <span className="text-xs font-bold text-green-500 block">권장량 충족</span>
                                    {feedingStat.memo && (
                                        <div className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1.5 rounded-lg flex items-start gap-1">
                                            <FileText size={10} className="mt-0.5 shrink-0"/> {feedingStat.memo}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        
                        <div className={`flex items-end gap-1.5 h-12 transition-opacity ${editingSection === 'feeding' ? 'opacity-30' : 'opacity-100'}`}>
                            {feedingData.map((h, i) => (
                                <div key={i} style={{ height: `${h * 100}%` }} className={`w-2 rounded-t-sm ${i === 6 ? 'bg-blue-500' : 'bg-blue-100'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                 {/* Poop Card */}
                 <div className={`bg-white rounded-2xl p-5 shadow-sm border mb-6 transition-all ${editingSection === 'poop' ? 'border-orange-300 ring-2 ring-orange-50' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <Baby size={16} className="text-orange-500" />
                            <span className="text-sm font-bold text-gray-600">대변 횟수</span>
                        </div>
                        {editingSection === 'poop' ? (
                            <button onClick={handleSave} className="text-orange-600 hover:bg-orange-50 p-1.5 rounded-lg transition-colors">
                                <Save size={16} />
                            </button>
                        ) : (
                            <button onClick={() => setEditingSection('poop')} className="text-gray-300 hover:text-gray-500 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                                <Pencil size={14} />
                            </button>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-end">
                        <div className="w-full">
                            <div className="flex items-baseline gap-1 mb-1">
                                {editingSection === 'poop' ? (
                                    <input 
                                        type="number" 
                                        value={poopStat.value} 
                                        onChange={(e) => setPoopStat({...poopStat, value: e.target.value})}
                                        className="text-2xl font-bold text-gray-900 border-b border-orange-200 focus:border-orange-500 outline-none w-16 bg-transparent"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900">{poopStat.value}</span>
                                )}
                                <span className="text-sm font-medium text-gray-500">회/일</span>
                            </div>
                            
                             {editingSection === 'poop' ? (
                                <textarea 
                                    placeholder="메모를 입력하세요..."
                                    value={poopStat.memo}
                                    onChange={(e) => setPoopStat({...poopStat, memo: e.target.value})}
                                    className="w-full mt-2 text-xs p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-300 resize-none"
                                    rows={2}
                                />
                            ) : (
                                <>
                                    <span className="text-xs text-gray-400 block">상태: 정상 (황금변)</span>
                                    {poopStat.memo && (
                                        <div className="mt-2 text-xs bg-orange-50 text-orange-800 px-2 py-1.5 rounded-lg flex items-start gap-1">
                                            <FileText size={10} className="mt-0.5 shrink-0"/> {poopStat.memo}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className={`flex items-end gap-2 h-10 pb-1 transition-opacity ${editingSection === 'poop' ? 'opacity-30' : 'opacity-100'}`}>
                            {[1, 2, 1, 3, 2, 2, 2].map((count, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    {Array.from({ length: count }).map((_, idx) => (
                                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${i === 6 ? 'bg-orange-500' : 'bg-orange-200'}`}></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Alerts (Red Zone) */}
            <div className="px-5 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">특이사항 감지</h3>
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="bg-red-100 p-2 rounded-lg text-red-500 shrink-0">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-red-600">발열 증상 2회 기록</h4>
                            <p className="text-xs text-red-400 mt-1 leading-relaxed">
                                지난 7일간 38도 이상의 고열이 2회 있었습니다.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2 pl-12">
                        <div className="bg-white border border-red-100 rounded-lg px-3 py-2 text-sm text-gray-600 font-medium flex justify-between">
                            <span>10/24 22:00</span>
                            <span className="font-bold text-red-500">38.2°C</span>
                        </div>
                        <div className="bg-white border border-red-100 rounded-lg px-3 py-2 text-sm text-gray-600 font-medium flex justify-between">
                            <span>10/26 04:30</span>
                            <span className="font-bold text-red-500">38.5°C</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW LOCATION: Overall Memo Section */}
            <div className="px-5 pb-4">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        📋 전체 특이사항
                    </h3>
                     {isEditingOverallMemo ? (
                        <button onClick={() => setIsEditingOverallMemo(false)} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors">
                            <Save size={18} />
                        </button>
                    ) : (
                        <button onClick={() => setIsEditingOverallMemo(true)} className="text-gray-300 hover:text-gray-500 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                            <Pencil size={16} />
                        </button>
                    )}
                </div>
                <div 
                    className={`bg-white rounded-2xl p-3 border transition-all ${isEditingOverallMemo ? 'border-indigo-300 ring-2 ring-indigo-50' : 'border-gray-200 shadow-sm'}`}
                    onClick={() => !isEditingOverallMemo && setIsEditingOverallMemo(true)}
                >
                    {isEditingOverallMemo ? (
                        <textarea 
                            value={overallMemo}
                            onChange={(e) => setOverallMemo(e.target.value)}
                            placeholder="예: 3일 전부터 밤잠을 자주 설치고, 이유식을 거부합니다."
                            className="w-full resize-none outline-none text-sm text-gray-800 leading-relaxed bg-transparent"
                            rows={3} // Resized to approx 3 lines
                            autoFocus
                        />
                    ) : (
                        <div className="min-h-[72px]">
                            {overallMemo ? (
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{overallMemo}</p>
                            ) : (
                                <div className="h-[72px] flex items-center justify-center text-gray-400 gap-2 cursor-pointer">
                                    <ClipboardList size={18} className="opacity-30" />
                                    <span className="text-xs">터치하여 특이사항 작성</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Questions */}
            <div className="px-5">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">의사 선생님께 질문</h3>
                    <button className="text-blue-500 text-sm font-bold flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded">
                        <Plus size={14} /> 추가
                    </button>
                </div>
                
                <div className="space-y-3">
                    {questions.map((q) => (
                        <div 
                            key={q.id} 
                            onClick={() => toggleQuestion(q.id)}
                            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start gap-3 cursor-pointer active:scale-[0.99] transition-transform"
                        >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${q.checked ? 'bg-blue-500 border-blue-500' : 'border-2 border-gray-300'}`}>
                                {q.checked && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-bold text-sm mb-1 ${q.checked ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {q.text}
                                    </h4>
                                    <button className="text-gray-300 hover:text-gray-500 p-1">
                                        <Pencil size={14} />
                                    </button>
                                </div>
                                {q.memo && (
                                    <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">
                                        메모: {q.memo}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* 5. Footer Button */}
        <div className="bg-white p-4 border-t border-gray-100 sticky bottom-0 z-20">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                <Share size={20} />
                <span>의사용 리포트 내보내기 (PDF)</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default DoctorReportModal;