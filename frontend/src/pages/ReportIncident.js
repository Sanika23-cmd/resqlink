import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LocationPicker({ setPosition, position }) {
  useMapEvents({
    click(e) { setPosition([e.latlng.lat, e.latlng.lng]); }
  });
  return position ? <Marker position={position} /> : null;
}

export default function ReportIncident() {
  const [type, setType] = useState('flood');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!position) return alert('Please click on the map to set location');
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/incidents`, {
        type, description, latitude: position[0], longitude: position[1], reportedBy: 'anonymous'
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch { alert('Error submitting incident'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-red-500 mb-6">🚨 Report Incident</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-lg">
            <option value="flood">Flood</option>
            <option value="earthquake">Earthquake</option>
            <option value="fire">Fire</option>
            <option value="cyclone">Cyclone</option>
            <option value="landslide">Landslide</option>
          </select>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what you see..." className="w-full bg-gray-700 text-white p-3 rounded-lg h-32 resize-none" />
          {position && <p className="text-green-400">📍 Location set: {position[0].toFixed(4)}, {position[1].toFixed(4)}</p>}
          {success ? (
            <div className="bg-green-700 p-4 rounded-lg text-center">✅ Incident reported! AI is triaging...</div>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold">
              {loading ? 'Submitting & AI Triaging...' : 'Submit Incident'}
            </button>
          )}
        </div>
        <div className="h-80 rounded-xl overflow-hidden">
          <MapContainer center={[19.076, 72.877]} zoom={10} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker setPosition={setPosition} position={position} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}