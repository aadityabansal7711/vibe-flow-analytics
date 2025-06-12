
import React from 'react';
import { Music, Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <Music className="h-20 w-20 text-green-400 mx-auto animate-bounce" />
          <div className="absolute -top-2 -right-2">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">MyVibeLytics</h1>
        <p className="text-xl text-gray-300 mb-8">Analyzing your musical journey...</p>
        
        <div className="flex justify-center space-x-1 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-8 bg-green-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
