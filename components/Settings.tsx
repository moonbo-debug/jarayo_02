import React, { useState } from 'react';
import { User, Bell, Heart, Copy, Share2, ChevronRight } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsProps {
    currentUser: UserType;
}

const Settings: React.FC<SettingsProps> = ({ currentUser }) => {
    const [notifDiaper, setNotifDiaper] = useState(true);

    return (
        <div className="pb-24 space-y-6 px-5 pt-4">
            <h1 className="text-2xl font-bold text-gray-900">설정 및 가족 관리</h1>

            {/* Baby Profile Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
                    👶
                </div>
                <div className="flex-1">
                    <h2 className="font-bold text-lg text-gray-900">튼튼이 <span className="text-sm font-normal text-gray-500">(태명)</span></h2>
                    <p className="text-sm text-gray-500">2024.01.01 출생</p>
                    <p className="text-xs font-bold text-indigo-500 mt-1 bg-indigo-50 inline-block px-2 py-0.5 rounded">D+124</p>
                </div>
                <button className="text-gray-300 hover:text-gray-500">
                    <ChevronRight />
                </button>
            </div>

            {/* Invite */}
            <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                    <Heart size={18} className="text-pink-300 fill-pink-300" />
                    <h3 className="font-bold">가족 초대하기</h3>
                </div>
                <p className="text-indigo-100 text-sm mb-4">함께 육아할 파트너를 초대해보세요.</p>
                <div className="flex gap-2">
                    <div className="flex-1 bg-black/20 rounded-lg px-3 py-2 text-sm font-mono truncate text-indigo-100 flex items-center">
                        INVITE-X9D2
                    </div>
                    <button className="bg-white text-indigo-600 px-3 rounded-lg font-bold text-sm flex items-center gap-1 hover:bg-indigo-50">
                        <Copy size={14} /> 복사
                    </button>
                    <button className="bg-yellow-400 text-yellow-900 px-3 rounded-lg font-bold text-sm flex items-center gap-1 hover:bg-yellow-300">
                        <Share2 size={14} />
                    </button>
                </div>
            </div>

            {/* Settings List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                            <Bell size={20} />
                        </div>
                        <span className="font-medium text-gray-700">기저귀 교체 알림</span>
                    </div>
                    <div 
                        onClick={() => setNotifDiaper(!notifDiaper)}
                        className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 ${notifDiaper ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${notifDiaper ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                </div>

                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-yellow-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                            <Heart size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-800">케어 알림 (위시리스트)</span>
                            <span className="text-xs text-gray-500">중요도: 매우 높음 🔥</span>
                        </div>
                    </div>
                    {/* Locked Toggle */}
                    <div className="w-12 h-7 rounded-full p-1 bg-green-500 opacity-50 cursor-not-allowed">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md translate-x-5"></div>
                    </div>
                </div>

                 <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 text-gray-500 rounded-lg">
                            <User size={20} />
                        </div>
                        <span className="font-medium text-gray-700">내 프로필 수정</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                </div>
            </div>

            <div className="text-center">
                <button className="text-red-400 text-sm underline font-medium hover:text-red-500">로그아웃</button>
            </div>
        </div>
    );
};

export default Settings;