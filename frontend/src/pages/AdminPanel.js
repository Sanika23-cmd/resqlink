import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';

export default function AdminPanel() {
  const [incidents, setIncidents] = useState([]);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('warning');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/incidents`).then(r => setIncidents(r.data));
    socket.on('new_incident', inc => setIncidents(prev => [inc, ...prev]));
  }, []);

  const broadcastAlert = async () => {
    if (!alertMsg.trim()) return;
    await axios.post(`${process.env.REACT_APP_API_URL}/alerts/broadcast`, { message: alertMsg, type: alertType });
    setAlertMsg('');
    alert('Alert broadcasted to all users!');
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`${process.env.REACT_APP_API_URL}/incidents/${id}/status`, { status });
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">⚙️ Admin Control Panel</h1>
      <div className="bg-gray-800 rounded-2xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">📢 Broadcast Alert</h2>
        <textarea value={alertMsg} onChange={e => setAlertMsg(e.target.value)} placeholder="Type emergency alert message..." className="w-full bg-gray-700 text-white p-3 rounded-lg h-20 mb-3 resize-none"/>
        <div className="flex gap-3">
          <select value={alertType} onChange={e => setAlertType(e.target.value)} className="bg-gray-700 text-white p-2 rounded-lg">
            <option value="warning">Warning</option>
            <option value="evacuation">Evacuation</option>
            <option value="all-clear">All Clear</option>
          </select>
          <button onClick={broadcastAlert} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold">Broadcast</button>
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">📋 All Incidents</h2>
        {incidents.map(inc => (
          <div key={inc.id} className="bg-gray-800 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{inc.type} — <span className="text-yellow-400">{inc.severity}</span></p>
              <p className="text-gray-400 text-sm">{inc.description}</p>
              <p className="text-blue-400 text-xs">AI: {inc.aiAction}</p>
              <p className="text-gray-500 text-xs">Status: {inc.status}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => updateStatus(inc.id, 'in-progress')} className="bg-yellow-600 text-xs px-3 py-1 rounded-lg">In Progress</button>
              <button onClick={() => updateStatus(inc.id, 'resolved')} className="bg-green-700 text-xs px-3 py-1 rounded-lg">Resolved</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}