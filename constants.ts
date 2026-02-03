import { Log, User } from './types';
import { subMinutes, subHours, subDays } from 'date-fns';

export const CURRENT_USER: User = {
  id: 'u1',
  name: '아빠',
  role: 'Dad',
  avatar: 'https://picsum.photos/200',
  isDuty: true,
  batteryLevel: 80,
};

export const PARTNER_USER: User = {
  id: 'u2',
  name: '엄마',
  role: 'Mom',
  avatar: 'https://picsum.photos/201',
  isDuty: false,
  batteryLevel: 45,
};

// Initial logs for the demo including Grandma and Helper
export const INITIAL_LOGS: Log[] = [
  { id: '1', type: 'diaper', subType: 'pee', timestamp: subMinutes(new Date(), 15), user: '아빠' },
  { id: '2', type: 'feeding', subType: 'formula', timestamp: subHours(new Date(), 2), user: '아빠', note: '160ml' },
  { id: '3', type: 'sleep', subType: 'sleep_end', timestamp: subHours(new Date(), 4), user: '이모님' },
  { id: '4', type: 'diaper', subType: 'poo', timestamp: subHours(new Date(), 5), user: '이모님' },
  { id: '5', type: 'feeding', subType: 'formula', timestamp: subHours(new Date(), 7), user: '할머니', note: '140ml' },
  { id: '6', type: 'health', subType: 'bath', timestamp: subDays(new Date(), 1), user: '아빠' },
  { id: '7', type: 'sleep', subType: 'sleep_start', timestamp: subDays(new Date(), 1), user: '엄마' },
  { id: '8', type: 'feeding', subType: 'food', timestamp: subDays(new Date(), 1), user: '엄마' },
  { id: '9', type: 'diaper', subType: 'pee', timestamp: subDays(new Date(), 1), user: '할머니' },
  { id: '10', type: 'play', subType: 'tummy_time', timestamp: subHours(new Date(), 1), user: '할머니', note: '터미타임 10분' },
];

export const WISH_TAGS = ['자유시간 1시간', '마사지', '달달한거', '저녁포장', '설거지 부탁'];