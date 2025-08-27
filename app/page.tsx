import React from 'react';
import MoodTracker from '../components/MoodTracker';

export default function Home() {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <MoodTracker />
    </div>
  );
}