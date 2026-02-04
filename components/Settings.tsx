
import React, { useState } from 'react';
import { User, Bell, Heart, Copy, Share2, ChevronRight, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsProps {
    currentUser: UserType;
}

const Settings: React.FC<SettingsProps> = ({ currentUser }) => {
    const [notifDiaper, setNotifDiaper] = useState(true);

    return (
        <div className="pb-24 space-y-6 px-5 pt-8 bg-[#F9FAFB] min-h-screen">
            <h1 className="text-xl font-bold text-gray-900">설정</h1>

            {/* Baby Profile Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-3xl border border-gray-100">
                    👶
                </div>
                <div className="flex-1">
                    <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        튼튼이 
                        <span className="text-xs font-bold text-black bg-lime-400 px-2 py-0.5 rounded">D+124</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">2024.01.01 출생 · 남</p>
                </div>
                <button className="text-gray-300 hover:text-black transition-colors">
                    <ChevronRight />
                </button>
            </div>

            {/* Invite */}
            <div className="bg-black rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Heart size={18} className="text-lime-400 fill-lime-400" />
                    <h3 className="font-bold">가족 초대하기</h3>
                </div>
                <p className="text-gray-400 text-sm mb-5">함께 육아할 파트너를 초대해보세요.</p>
                <div className="flex gap-2">
                    <div className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-sm font-mono truncate text-gray-200 flex items-center border border-gray-700">
                        INVITE-X9D2
                    </div>
                    <button className="bg-white text-black px-4 rounded-xl font-bold text-sm flex items-center gap-1 hover:bg-gray-200 transition-colors">
                        <Copy size={16} /> 복사
                    </button>
                </div>
            </div>

            {/* Settings List */}
            <div>
                <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide px-1">앱 설정</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 text-gray-900 rounded-lg">
                                <Bell size={20} />
                            </div>
                            <span className="font-bold text-sm text-gray-900">기저귀 교체 알림</span>
                        </div>
                        <div 
                            onClick={() => setNotifDiaper(!notifDiaper)}
                            className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${notifDiaper ? 'bg-black' : 'bg-gray-200'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${notifDiaper ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </div>

                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 text-gray-900 rounded-lg">
                                <Heart size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-gray-900">케어 알림 (위시리스트)</span>
                                <span className="text-[10px] text-gray-400">중요도: 높음</span>
                            </div>
                        </div>
                        {/* Locked Toggle */}
                        <div className="w-12 h-7 rounded-full p-1 bg-gray-300 cursor-not-allowed">
                            <div className="w-5 h-5 bg-white rounded-full shadow-sm translate-x-5"></div>
                        </div>
                    </div>

                     <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 text-gray-900 rounded-lg">
                                <User size={20} />
                            </div>
                            <span className="font-bold text-sm text-gray-900">내 프로필 수정</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                    </div>
                </div>
            </div>

            <div className="text-center pt-4">
                <button className="text-gray-400 text-xs font-bold hover:text-red-500 flex items-center justify-center gap-1 mx-auto transition-colors">
                    <LogOut size={14} /> 로그아웃
                </button>
            </div>
        </div>
    );
};

export default Settings;
