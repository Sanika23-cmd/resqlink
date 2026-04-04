import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import axios from 'axios';
import socket from '../socket';

const SEVERITY_COLOR = { critical: '#ef4444', high: '#f97316', moderate: '#eab308', low: '#22c55e' };

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/incidents`).then(r => setIncidents(r.data));
    socket.on('new_incident', inc => setIncidents(prev => [inc, ...prev]));
    socket.on('alert', a => { setAlert(a); setTimeout(() => setAlert(null), 8000); });
    socket.on('incident_updated', updated => setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i)));
    return () => { socket.off('new_incident'); socket.off('alert'); socket.off('incident_updated'); };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">🗺 Live Disaster Map</h1>
      {alert && (
        <div className="bg-red-700 text-white p-4 rounded-xl mb-4 font-semibold animate-pulse">
          🔔 ALERT: {alert.message}
        </div>
      )}
      <div className="flex gap-2 mb-3 text-sm">
        {Object.entries(SEVERITY_COLOR).map(([s, c]) => (
          <span key={s} className="flex items-center gap-1">
            <span style={{ background: c }} className="w-3 h-3 rounded-full inline-block"/>
            {s}
          </span>
        ))}
      </div>
      <div className="h-96 rounded-2xl overflow-hidden mb-6">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap"/>
          {incidents.map(inc => (
            <CircleMarker key={inc.id} center={[inc.latitude, inc.longitude]}
              radius={inc.severity === 'critical' ? 16 : inc.severity === 'high' ? 12 : 8}
              color={SEVERITY_COLOR[inc.severity] || '#22c55e'} fillOpacity={0.7}>
              <Popup>
                <div className="text-gray-900">
                  <strong>{inc.type.toUpperCase()}</strong><br/>
                  {inc.description}<br/>
                  <span className="text-xs">Severity: {inc.severity}</span><br/>
                  <span className="text-xs">AI: {inc.aiAction}</span><br/>
                  {inc.isFake && <span className="text-red-600 font-bold">⚠ Possibly Fake ({(inc.fakeScore*100).toFixed(0)}%)</span>}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {incidents.map(inc => (
          <div key={inc.id} className="bg-gray-800 rounded-xl p-3 flex justify-between items-start">
            <div>
              <span className="font-semibold text-white">{inc.type}</span>
              <p className="text-gray-400 text-sm">{inc.description}</p>
              <p className="text-blue-400 text-xs mt-1">🤖 {inc.aiAction}</p>
              {inc.isFake && <p className="text-red-400 text-xs">⚠ Possible misinformation ({(inc.fakeScore*100).toFixed(0)}% fake)</p>}
            </div>
            <span style={{ background: SEVERITY_COLOR[inc.severity] }} className="text-xs px-2 py-1 rounded-full text-white font-bold">{inc.severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}