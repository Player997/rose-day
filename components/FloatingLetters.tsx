
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Image, Float } from '@react-three/drei';
import { HINGLISH_MESSAGES } from '../constants';
import { playSynthesizedSound } from '../utils/sounds';

interface FloatingLettersProps {
  onLetterClick: (text: string) => void;
  isMuted: boolean;
}

const Letter: React.FC<{ msg: typeof HINGLISH_MESSAGES[0], onClick: (t: string) => void, isMuted: boolean }> = ({ msg, onClick, isMuted }) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      const speed = 0.4 + msg.id * 0.05;
      // Gentle floating path
      groupRef.current.position.x = msg.position[0] + Math.cos(time * speed) * 0.6;
      groupRef.current.position.z = msg.position[2] + Math.sin(time * speed) * 0.6;
      groupRef.current.position.y = msg.position[1] + Math.sin(time * 1.5 + msg.id) * 0.3;
      // Soft tilt
      groupRef.current.rotation.z = Math.sin(time * 0.5 + msg.id) * 0.1;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!isMuted) {
      playSynthesizedSound('pop');
    }
    onClick(msg.text);
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      <Float speed={3} rotationIntensity={1.5} floatIntensity={1}>
        {/* Love Letter Emoji Sprite */}
        <Image
          url="https://fonts.gstatic.com/s/e/notoemoji/latest/1f48c/512.png"
          transparent
          scale={[0.8, 0.8]}
        />
      </Float>
    </group>
  );
};

export const FloatingLetters: React.FC<FloatingLettersProps> = ({ onLetterClick, isMuted }) => {
  return (
    <group>
      {HINGLISH_MESSAGES.map((msg) => (
        <Letter key={msg.id} msg={msg} onClick={onLetterClick} isMuted={isMuted} />
      ))}
    </group>
  );
};
