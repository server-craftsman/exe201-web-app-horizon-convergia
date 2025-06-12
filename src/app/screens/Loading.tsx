import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading: React.FC = () => {
  return (
    <div
      style={{
        zIndex: 2147483647,
        position: 'fixed',
      }}
      className="fixed inset-0 h-screen w-full flex justify-center items-center backdrop-blur-md bg-black/50"
    >
      <DotLottieReact
        src="https://lottie.host/820b9650-929d-48e4-88f8-9eb3ef18eddb/sWzRIbqGz8.lottie"
        loop
        autoplay
        style={{ width: '300px', height: '300px' }}
      />
    </div>
  )
}

export default Loading;
