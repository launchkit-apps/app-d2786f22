"use client";

import React, { useState, useEffect } from 'react';

interface MoodEntry {
  date: string;
  mood: string;
  note: string;
}

export default function MoodTracker() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const moodOptions = [
    'Very Happy',
    'Happy',
    'Calm',
    'Neutral',
    'Anxious',
    'Sad',
    'Stressed'
  ];

  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return;

    const newEntry = {
      date: selectedDate,
      mood,
      note
    };

    const newEntries = [...entries.filter(e => e.date !== selectedDate), newEntry];
    setEntries(newEntries);
    localStorage.setItem('moodEntries', JSON.stringify(newEntries));
    
    setMood('');
    setNote('');
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthData = () => {
    const currentDate = new Date(selectedDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    
    return { year, month, daysInMonth, firstDay };
  };

  const getMoodForDate = (dateStr: string) => {
    return entries.find(entry => entry.date === dateStr)?.mood || '';
  };

  const renderCalendar = () => {
    const { year, month, daysInMonth, firstDay } = getMonthData();
    const days = [];
    
    // Empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString().split('T')[0];
      const mood = getMoodForDate(date);
      
      days.push(
        <div 
          key={day} 
          className={`p-2 border cursor-pointer ${date === selectedDate ? 'bg-blue-100' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="text-sm">{day}</div>
          {mood && (
            <div className="text-xs mt-1 truncate" style={{
              backgroundColor: mood === 'Very Happy' ? '#4ade80' :
                            mood === 'Happy' ? '#a3e635' :
                            mood === 'Calm' ? '#93c5fd' :
                            mood === 'Neutral' ? '#e5e7eb' :
                            mood === 'Anxious' ? '#fcd34d' :
                            mood === 'Sad' ? '#93c5fd' :
                            mood === 'Stressed' ? '#f87171' : 'transparent',
              padding: '2px 4px',
              borderRadius: '4px'
            }}>
              {mood}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Daily Mood Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">How are you feeling today?</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select mood...</option>
                {moodOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Notes (max 160 characters)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 160))}
                maxLength={160}
                className="w-full p-2 border rounded"
                rows={3}
              />
              <div className="text-sm text-gray-500 mt-1">
                {note.length}/160 characters
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              disabled={!mood}
            >
              Save Entry
            </button>
          </form>
        </div>

        {/* Calendar Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {new Date(selectedDate).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold p-2">{day}</div>
            ))}
            {renderCalendar()}
          </div>
        </div>
      </div>
    </div>
  );
}