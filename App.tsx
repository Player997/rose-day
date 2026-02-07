
import React, { useState, Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { FloatingLetters } from './components/FloatingLetters';
import { Heart, X, Sparkles as SparklesIcon, Loader2, Volume2, VolumeX } from 'lucide-react';
import { COLORS } from './constants';
import { playSynthesizedSound } from './utils/sounds';

const BokehMagic = ({ count = 35 }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 12 - 6
      ],
      scale: 0.1 + Math.random() * 0.45,
      speed: 0.004 + Math.random() * 0.012,
      opacity: 0.1 + Math.random() * 0.35
    }));
  }, [count]);

  const refs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    particles.forEach((p, i) => {
      const ref = refs.current[i];
      if (ref) {
        ref.position.y += Math.sin(time * p.speed + i) * 0.0025;
        ref.position.x += Math.cos(time * p.speed + i) * 0.0025;
        const mesh = ref.children[0] as THREE.Mesh;
        if (mesh && mesh.material) {
          (mesh.material as THREE.MeshBasicMaterial).opacity = p.opacity + Math.sin(time * 1.5 + i) * 0.12;
        }
      }
    });
  });

  return (
    <group>
      {particles.map((p, i) => (
        <group 
          key={i} 
          ref={(el) => (refs.current[i] = el!)} 
          position={p.position as [number, number, number]}
        >
          <mesh scale={p.scale}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial 
              color="#ffccdd" 
              transparent 
              opacity={p.opacity} 
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const PetalRain = ({ count = 55 }) => {
  const petals = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 16,
        Math.random() * 15 + 6,
        (Math.random() - 0.5) * 16
      ],
      speed: 0.018 + Math.random() * 0.035,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      rSpeed: (Math.random() - 0.5) * 0.04
    }));
  }, [count]);

  const refs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    petals.forEach((petal, i) => {
      const ref = refs.current[i];
      if (ref) {
        ref.position.y -= petal.speed;
        ref.rotation.x += petal.rSpeed;
        ref.rotation.z += petal.rSpeed * 0.4;
        if (ref.position.y < -8) {
          ref.position.y = 16;
          ref.position.x = (Math.random() - 0.5) * 16;
        }
      }
    });
  });

  return (
    <group>
      {petals.map((petal, i) => (
        <group 
          key={i} 
          ref={(el) => (refs.current[i] = el!)} 
          position={petal.position as [number, number, number]} 
          rotation={petal.rotation as [number, number, number]}
        >
          <mesh scale={[0.14, 0.14, 0.04]}>
            <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.3]} />
            <meshBasicMaterial color={COLORS.roseLight} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const MessageModal: React.FC<{ message: string | null; onClose: () => void }> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-lg transition-all duration-500">
      <div className="bg-white rounded-[3rem] p-12 max-w-sm w-full shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative border-4 border-pink-100 animate-in zoom-in duration-300">
        <button 
          onClick={() => {
            playSynthesizedSound('pop');
            onClose();
          }}
          className="absolute -top-4 -right-4 bg-pink-500 text-white p-4 rounded-full shadow-2xl hover:bg-pink-600 transition-all active:scale-90"
        >
          <X size={28} />
        </button>
        <div className="text-pink-500 mb-8 flex justify-center">
          <Heart fill="currentColor" size={64} className="animate-pulse" />
        </div>
        <p className="text-2xl text-center text-gray-800 font-bold leading-relaxed font-cursive">
          {message}
        </p>
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => {
              playSynthesizedSound('pop');
              onClose();
            }}
            className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white px-12 py-5 rounded-full font-black shadow-2xl active:scale-95 transition-all text-sm uppercase tracking-[0.25em]"
          >
            Pyaar Se! ✨
          </button>
        </div>
      </div>
    </div>
  );
};

const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-10 left-10 text-pink-500 rotate-12"><Heart size={45} /></div>
         <div className="absolute bottom-20 right-10 text-pink-500 -rotate-12"><Heart size={65} /></div>
         <div className="absolute top-1/2 left-1/4 text-pink-300 -rotate-45 opacity-50"><SparklesIcon size={110} /></div>
      </div>
      
      <div className="relative mb-14">
        <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(236,72,153,0.3)] border-4 border-pink-200 animate-pulse overflow-hidden">
          <img 
            src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f48c/512.png" 
            alt="Love Letter" 
            className="w-24 h-24 object-contain"
          />
        </div>
        <div className="absolute -bottom-3 -right-3 bg-pink-500 p-4 rounded-full shadow-2xl">
          <SparklesIcon className="text-white" size={28} />
        </div>
      </div>
      
      <h1 className="text-7xl font-black text-pink-600 mb-8 font-cursive tracking-tight animate-in slide-in-from-bottom duration-1000">
        Diksha, Bestie!
      </h1>
      <p className="text-gray-500 mb-14 max-w-sm text-xl leading-relaxed font-medium">
        Roses fade, but a bond like ours is forever. This special rose is as real as our friendship! 🌹
      </p>
      
      <button 
        onClick={() => {
          playSynthesizedSound('magic');
          onStart();
        }}
        className="bg-pink-500 text-white text-3xl font-bold py-7 px-16 rounded-full shadow-[0_20px_50px_rgba(236,72,153,0.5)] hover:bg-pink-600 active:scale-95 transition-all flex items-center gap-5 group"
      >
        Open Surprize <SparklesIcon className="group-hover:rotate-12 transition-transform" />
      </button>
      
      <p className="mt-20 text-pink-400/60 text-xs font-black uppercase tracking-[0.4em] animate-bounce">
        For my favorite suar 🐷
      </p>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
    <Loader2 className="text-pink-400 animate-spin mb-6" size={60} />
    <span className="text-pink-500 text-sm font-black uppercase tracking-[0.3em] animate-pulse">Growing the magic...</span>
  </div>
);

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpened && !isMuted) {
      if (!bgmRef.current) {
        // 🎵 TODO: ADD YOUR MUSIC LINK HERE 🎵
        // Replace the string below with the direct URL to "Arz kiya hai" by Anuv Jain or your downloaded MP3 file path.
        // Example: '/music/arz-kiya-hai.mp3' or 'https://example.com/song.mp3'
        bgmRef.current = new Audio('Arz Kiya Hai.mp3');
        bgmRef.current.loop = true;
        // Setting volume to be present but not overwhelming
        bgmRef.current.volume = 0.4;
      }
      // Added error handling for the placeholder link
      bgmRef.current.play().catch(e => console.log("BGM play blocked or link invalid. Please update the Audio URL in App.tsx", e));
    } else if (bgmRef.current) {
      bgmRef.current.pause();
    }
  }, [isOpened, isMuted]);

  const handleOpenLetter = (msg: string) => {
    // The pop sound is handled within FloatingLetters component on click
    if (!isMuted) playSynthesizedSound('sparkle');
    setSelectedMessage(msg);
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <style>
        {`
          @keyframes floatEmoji {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(2deg); }
          }
          .animate-float-emoji {
            animation: floatEmoji 4s ease-in-out infinite;
          }
        `}
      </style>

      {!isOpened && <IntroScreen onStart={() => setIsOpened(true)} />}
      
      {isOpened && (
        <>
          {/* Audio Toggle */}
          <button 
            onClick={() => {
              playSynthesizedSound('pop');
              setIsMuted(!isMuted);
            }}
            className="fixed top-6 right-6 z-[100] bg-white/20 backdrop-blur-lg p-4 rounded-full text-pink-600 hover:bg-white/40 transition-all border border-pink-200/50 shadow-xl"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} className="animate-pulse" />}
          </button>

          {/* Centered Rose Emoji Image */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <div className="animate-float-emoji">
               <img 
                 src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f339/512.png" 
                 alt="Rose Emoji" 
                 className="w-[20vh] h-[20vh] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] select-none opacity-100 transition-all duration-1000 animate-in zoom-in-50"
               />
            </div>
          </div>

          <div className="absolute inset-0 z-10">
            <Suspense fallback={<LoadingFallback />}>
              <Canvas 
                camera={{ position: [0, 0, 8], fov: 32 }} 
                shadows
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              >
                <ambientLight intensity={0.6} />
                <hemisphereLight intensity={0.8} color="#ffffff" groundColor="#ffccdd" />
                
                <FloatingLetters onLetterClick={handleOpenLetter} isMuted={isMuted} />
                <PetalRain />
                
                <Sparkles 
                  count={60} 
                  scale={12} 
                  size={3} 
                  speed={0.3} 
                  opacity={0.4} 
                  color={COLORS.roseLight} 
                />
                
                <BokehMagic />
                
                <Stars radius={50} depth={50} count={4000} factor={7} saturation={0} fade speed={1.5} />
                
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false}
                  autoRotate={false}
                  minPolarAngle={Math.PI / 2.5}
                  maxPolarAngle={Math.PI / 1.8}
                />
              </Canvas>
            </Suspense>
          </div>

          <div className="absolute top-12 left-0 right-0 pointer-events-none text-center px-8 z-20 animate-in slide-in-from-top duration-1000">
            <h1 className="text-6xl font-black text-pink-600 drop-shadow-[0_5px_15px_rgba(236,72,153,0.3)] font-cursive mb-3">
              Happy Rose Day!
            </h1>
            <p className="text-pink-400 font-black tracking-[0.5em] uppercase text-[11px] opacity-90">
              Diksha, Ladoo Rani
            </p>
          </div>

          <div className="absolute bottom-12 left-0 right-0 px-10 text-center pointer-events-none z-20 animate-in slide-in-from-bottom duration-1000 delay-300">
            <div className="inline-block bg-white/95 backdrop-blur-3xl px-12 py-8 rounded-[3rem] shadow-[0_25px_80px_rgba(236,72,153,0.25)] border border-white/60">
              <p className="text-gray-500 font-bold text-sm mb-3 italic tracking-wide">
                "Purest red for my bestie."
              </p>
              <p className="text-pink-600 font-black text-2xl leading-tight drop-shadow-sm">
                Tu hamesha aise hi khili-khili reh! 🐷🌹
              </p>
            </div>
            <p className="mt-8 text-pink-500/80 text-[10px] uppercase font-black tracking-[0.4em] opacity-60">
              Click the hearts for secret letters
            </p>
          </div>

          <MessageModal 
            message={selectedMessage} 
            onClose={() => setSelectedMessage(null)} 
          />
        </>
      )}
    </div>
  );
}
