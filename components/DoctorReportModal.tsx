
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Moon, Milk, Baby, AlertCircle, Plus, Pencil, Check, Share, FileText, ChevronRight, X, Save, ClipboardList, Trash2 } from 'lucide-react';

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

  // Question Input Modal State
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('독감 예방접종 시기가 궁금합니다.');
  const [newQuestionMemo, setNewQuestionMemo] = useState('지난번에 감기 기운이 있어서 못 맞았는데 지금은 괜찮을까요?');

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

  const handleAddQuestionSubmit = () => {
      const newId = Math.max(...questions.map(q => q.id), 0) + 1;
      const newQuestion = {
          id: newId,
          text: newQuestionTitle, 
          memo: newQuestionMemo,
          checked: false
      };
      setQuestions([...questions, newQuestion]);
      setIsAddQuestionOpen(false);
      // Reset demo text (optional)
      setNewQuestionTitle('독감 예방접종 시기가 궁금합니다.');
      setNewQuestionMemo('지난번에 감기 기운이 있어서 못 맞았는데 지금은 괜찮을까요?');
  };

  const removeQuestion = (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSave = () => {
      setEditingSection(null);
  };

  const handleExport = () => {
      window.alert('데모: 리포트 내보내기가 완료되었습니다.');
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm animate-fade-in font-sans">
      <div className="w-full max-w-md bg-[#F9FAFB] sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up h-[90vh] flex flex-col relative">
        
        {/* 1. Header */}
        <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-900">병원 진료용 리포트</h2>
          <button onClick={onClose} className="p-2 -mr-2 hover:bg-gray-50 rounded-full text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pb-24 no-scrollbar">
            
            {/* Date Selector */}
            <div className="px-5 py-4 flex justify-between items-center bg-white border-b border-gray-50">
                <div className="flex items-center gap-2 text-gray-900">
                    <Calendar size={18} />
                    <span className="font-bold text-sm">2023.10.20 - 10.27 (7일간)</span>
                </div>
                <button className="text-xs font-bold text-gray-500 hover:text-black bg-gray-100 px-2 py-1 rounded">기간 변경</button>
            </div>

            {/* 2. 7-Day Summary */}
            <div className="px-5 pt-8 pb-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    7일 건강 요약
                    <span className="text-[10px] font-normal text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded">터치하여 수정</span>
                </h3>
                
                {/* Sleep Card */}
                <div className={`bg-white rounded-2xl p-5 shadow-sm border mb-4 transition-all ${editingSection === 'sleep' ? 'border-black ring-1 ring-black' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <Moon size={16} className="text-gray-900" />
                            <span className="text-sm font-bold text-gray-600">평균 수면</span>
                        </div>
                        {editingSection === 'sleep' ? (
                            <button onClick={handleSave} className="text-black bg-gray-100 p-1.5 rounded-lg transition-colors">
                                <Save size={14} />
                            </button>
                        ) : (
                            <button onClick={() => setEditingSection('sleep')} className="text-gray-300 hover:text-black p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
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
                                        className="text-2xl font-bold text-gray-900 border-b border-black outline-none w-20 bg-transparent"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900">{sleepStat.value}</span>
                                )}
                                <span className="text-sm font-medium text-gray-500">시간</span>
                            </div>
                            
                            {editingSection === 'sleep' ? (
                                <textarea 
                                    placeholder="메모 입력..."
                                    value={sleepStat.memo}
                                    onChange={(e) => setSleepStat({...sleepStat, memo: e.target.value})}
                                    className="w-full mt-2 text-xs p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black resize-none"
                                    rows={2}
                                />
                            ) : (
                                <>
                                    <span className="text-xs text-gray-400 block">지난주 대비 -0.5시간</span>
                                    {sleepStat.memo && (
                                        <div className="mt-2 text-xs bg-gray-50 text-gray-700 px-2 py-1.5 rounded-lg flex items-start gap-1 border border-gray-100">
                                            <FileText size={10} className="mt-0.5 shrink-0"/> {sleepStat.memo}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        
                        {/* Chart */}
                        <div className={`flex items-end gap-1.5 h-12 transition-opacity ${editingSection === 'sleep' ? 'opacity-30' : 'opacity-100'}`}>
                            {sleepData.map((h, i) => (
                                <div key={i} style={{ height: `${h * 100}%` }} className={`w-2 rounded-t-sm ${i === 6 ? 'bg-black' : 'bg-gray-200'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feeding Card */}
                <div className={`bg-white rounded-2xl p-5 shadow-sm border mb-4 transition-all ${editingSection === 'feeding' ? 'border-black ring-1 ring-black' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <Milk size={16} className="text-gray-900" />
                            <span className="text-sm font-bold text-gray-600">평균 수유</span>
                        </div>
                        {editingSection === 'feeding' ? (
                            <button onClick={handleSave} className="text-black bg-gray-100 p-1.5 rounded-lg transition-colors">
                                <Save size={14} />
                            </button>
                        ) : (
                            <button onClick={() => setEditingSection('feeding')} className="text-gray-300 hover:text-black p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
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
                                        className="text-2xl font-bold text-gray-900 border-b border-black outline-none w-24 bg-transparent"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900">{feedingStat.value}</span>
                                )}
                                <span className="text-sm font-medium text-gray-500">ml</span>
                            </div>
                            
                            {editingSection === 'feeding' ? (
                                <textarea 
                                    placeholder="메모 입력..."
                                    value={feedingStat.memo}
                                    onChange={(e) => setFeedingStat({...feedingStat, memo: e.target.value})}
                                    className="w-full mt-2 text-xs p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black resize-none"
                                    rows={2}
                                />
                            ) : (
                                <>
                                    <span className="text-xs font-bold text-lime-600 block">권장량 충족</span>
                                    {feedingStat.memo && (
                                        <div className="mt-2 text-xs bg-gray-50 text-gray-700 px-2 py-1.5 rounded-lg flex items-start gap-1 border border-gray-100">
                                            <FileText size={10} className="mt-0.5 shrink-0"/> {feedingStat.memo}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        
                        <div className={`flex items-end gap-1.5 h-12 transition-opacity ${editingSection === 'feeding' ? 'opacity-30' : 'opacity-100'}`}>
                            {feedingData.map((h, i) => (
                                <div key={i} style={{ height: `${h * 100}%` }} className={`w-2 rounded-t-sm ${i === 6 ? 'bg-black' : 'bg-gray-200'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                 {/* Poop Card */}
                 <div className={`bg-white rounded-2xl p-5 shadow-sm border mb-6 transition-all ${editingSection === 'poop' ? 'border-black ring-1 ring-black' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <Baby size={16} className="text-gray-900" />
                            <span className="text-sm font-bold text-gray-600">대변 횟수</span>
                        </div>
                        {editingSection === 'poop' ? (
                            <button onClick={handleSave} className="text-black bg-gray-100 p-1.5 rounded-lg transition-colors">
                                <Save size={14} />
                            </button>
                        ) : (
                            <button onClick={() => setEditingSection('poop')} className="text-gray-300 hover:text-black p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
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
                                        className="text-2xl font-bold text-gray-900 border-b border-black outline-none w-16 bg-transparent"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900">{poopStat.value}</span>
                                )}
                                <span className="text-sm font-medium text-gray-500">회/일</span>
                            </div>
                            
                             {editingSection === 'poop' ? (
                                <textarea 
                                    placeholder="메모 입력..."
                                    value={poopStat.memo}
                                    onChange={(e) => setPoopStat({...poopStat, memo: e.target.value})}
                                    className="w-full mt-2 text-xs p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black resize-none"
                                    rows={2}
                                />
                            ) : (
                                <>
                                    <span className="text-xs text-gray-400 block">상태: 정상 (황금변)</span>
                                    {poopStat.memo && (
                                        <div className="mt-2 text-xs bg-gray-50 text-gray-700 px-2 py-1.5 rounded-lg flex items-start gap-1 border border-gray-100">
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
                                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${i === 6 ? 'bg-black' : 'bg-gray-200'}`}></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Alerts (Red Zone) -> Gray/Black Warning */}
            <div className="px-5 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">특이사항 감지</h3>
                <div className="bg-white rounded-2xl p-5 border border-gray-200">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="bg-gray-100 p-2 rounded-lg text-gray-900 shrink-0">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">발열 증상 2회 기록</h4>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                지난 7일간 38도 이상의 고열이 2회 있었습니다.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2 pl-12">
                        <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600 font-medium flex justify-between">
                            <span>10/24 22:00</span>
                            <span className="font-bold text-gray-900">38.2°C</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600 font-medium flex justify-between">
                            <span>10/26 04:30</span>
                            <span className="font-bold text-gray-900">38.5°C</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overall Memo Section */}
            <div className="px-5 pb-4">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        📋 전체 특이사항
                    </h3>
                     {isEditingOverallMemo ? (
                        <button onClick={() => setIsEditingOverallMemo(false)} className="text-black bg-gray-100 p-1.5 rounded-lg transition-colors">
                            <Save size={16} />
                        </button>
                    ) : (
                        <button onClick={() => setIsEditingOverallMemo(true)} className="text-gray-300 hover:text-black p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                            <Pencil size={16} />
                        </button>
                    )}
                </div>
                <div 
                    className={`bg-white rounded-2xl p-3 border transition-all ${isEditingOverallMemo ? 'border-black ring-1 ring-black' : 'border-gray-200 shadow-sm'}`}
                    onClick={() => !isEditingOverallMemo && setIsEditingOverallMemo(true)}
                >
                    {isEditingOverallMemo ? (
                        <textarea 
                            value={overallMemo}
                            onChange={(e) => setOverallMemo(e.target.value)}
                            placeholder="내용을 입력하세요."
                            className="w-full resize-none outline-none text-sm text-gray-900 leading-relaxed bg-transparent"
                            rows={3} 
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
                    <button 
                        onClick={() => setIsAddQuestionOpen(true)}
                        className="text-black text-sm font-bold flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded border border-gray-200"
                    >
                        <Plus size={14} /> 질문 추가
                    </button>
                </div>
                
                <div className="space-y-3">
                    {questions.map((q) => (
                        <div 
                            key={q.id} 
                            onClick={() => toggleQuestion(q.id)}
                            className={`bg-white rounded-2xl p-4 border shadow-sm flex items-start gap-3 cursor-pointer active:scale-[0.99] transition-all group ${q.checked ? 'border-gray-200 bg-gray-50' : 'border-gray-200'}`}
                        >
                            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${q.checked ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}>
                                {q.checked && <Check size={14} className="text-lime-400" strokeWidth={3} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-bold text-sm mb-1 ${q.checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                        {q.text}
                                    </h4>
                                    <button 
                                        onClick={(e) => removeQuestion(q.id, e)}
                                        className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                {q.memo && (
                                    <p className={`text-xs px-2 py-1 rounded inline-block ${q.checked ? 'text-gray-400 bg-transparent p-0' : 'text-gray-500 bg-gray-50'}`}>
                                        {q.memo}
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
            <button 
                onClick={handleExport}
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
                <Share size={18} />
                <span>리포트 PDF 내보내기</span>
            </button>
        </div>

        {/* Add Question Modal (Nested) */}
        {isAddQuestionOpen && (
            <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-5">
                <div className="bg-white w-full rounded-2xl p-5 shadow-2xl animate-scale-up">
                    <h3 className="font-bold text-lg mb-4">질문 등록하기 (Demo)</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">질문 제목</label>
                            <input 
                                type="text"
                                value={newQuestionTitle}
                                onChange={(e) => setNewQuestionTitle(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm font-bold focus:border-black outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">상세 내용 (메모)</label>
                            <textarea 
                                value={newQuestionMemo}
                                onChange={(e) => setNewQuestionMemo(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-black outline-none resize-none h-20"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button 
                            onClick={() => setIsAddQuestionOpen(false)}
                            className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200"
                        >
                            취소
                        </button>
                        <button 
                            onClick={handleAddQuestionSubmit}
                            className="flex-1 py-3 rounded-xl font-bold text-white bg-black hover:bg-gray-800"
                        >
                            등록
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default DoctorReportModal;
