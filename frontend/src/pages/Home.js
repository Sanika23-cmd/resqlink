import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-red-500 mb-2">ResQLink</h1>
      <p className="text-gray-400 mb-10 text-lg">Real-time disaster response platform</p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <Link to="/report" className="bg-red-600 hover:bg-red-700 text-white text-center py-4 rounded-xl font-semibold text-lg">🚨 Report Incident</Link>
        <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-xl font-semibold text-lg">🗺 Live Map</Link>
        <Link to="/login" className="col-span-2 bg-gray-700 hover:bg-gray-600 text-white text-center py-4 rounded-xl font-semibold text-lg">🔐 Authority Login</Link>
      </div>
    </div>
  );
}