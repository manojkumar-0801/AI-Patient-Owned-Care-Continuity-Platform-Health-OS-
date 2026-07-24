import React from 'react';
import { Calendar, FileText, Activity, Beaker, FileSignature } from 'lucide-react';

export const TimelineIcon = ({ type }) => {
  let IconComponent = Activity;
  let bgClass = "bg-primary/10 text-primary border-primary/20";
  
  if (!type) return null;
  const t = type.toLowerCase();

  if (t === 'appointment') {
    IconComponent = Calendar;
    bgClass = "bg-blue-500/10 text-blue-500 border-blue-500/20";
  } else if (t.includes('record') || t === 'document') {
    IconComponent = FileText;
    bgClass = "bg-green-500/10 text-green-500 border-green-500/20";
  } else if (t.includes('note') || t === 'prescription') {
    IconComponent = FileSignature;
    bgClass = "bg-purple-500/10 text-purple-500 border-purple-500/20";
  } else if (t.includes('lab') || t === 'test') {
    IconComponent = Beaker;
    bgClass = "bg-orange-500/10 text-orange-500 border-orange-500/20";
  }

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${bgClass} shadow-sm bg-background relative z-10 shrink-0`}>
      <IconComponent className="w-5 h-5" />
    </div>
  );
};
