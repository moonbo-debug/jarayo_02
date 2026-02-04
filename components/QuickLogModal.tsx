
import React, { useState, useEffect } from 'react';
import { X, Clock, Check, Droplets, Baby, Utensils, Moon, Thermometer, Bath, Pill, Activity } from 'lucide-react';
import { LogType, LogSubType } from '../types';
import { format } from 'date-fns';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: LogType;
  onSave: (data: { type: LogType, subType?: LogSubType, time: Date, value?: string, note?: string }) => void;
}

const QuickLogModal: React.FC<QuickLogModalProps> = ({ isOpen, onClose, initialType, onSave }) => {
  const [activeType, setActiveType] = useState<LogType>(initialType);
  const [subType, setSubType] = useState<LogSubType | undefined>(undefined);
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [amount, setAmount] = useState<string>(''); 
  const [note, setNote] = useState('');
  
  // Specific states for interactions
  const [pooAmount, setPooAmount] = useState('보통');
  const [feedingAmount, setFeedingAmount] = useState(120);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
        setActiveType(initialType);
        setTime(format(new Date(), 'HH:mm'));
        setAmount('');
        setNote('');
        
        // Auto-select subtype based on initialType to ensure focus logic is robust
        if (initialType === 'diaper') setSubType('pee');
        else if (initialType === 'feeding') setSubType('formula');
        else if (initialType === 'sleep') setSubType('sleep_start');
        else setSubType(undefined);
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleSave = () => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const logDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    let finalValue = amount;
    
    if (activeType === 'diaper' && subType === 'poo') {
        finalValue = pooAmount;
    } else if (activeType === 'feeding' && subType === 'formula') {
        finalValue = `${feedingAmount}ml`;
    }

    onSave({
        type: activeType,
