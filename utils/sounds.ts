
export const playSynthesizedSound = (type: 'pop' | 'magic' | 'sparkle') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0.15;
  master.connect(ctx.destination);

  if (type === 'pop') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(master);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } else if (type === 'magic') {
    [440, 554, 659, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.05 + 0.02);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.05 + 0.2);
      osc.connect(gain);
      gain.connect(master);
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.2);
    });
  } else if (type === 'sparkle') {
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 1000 + Math.random() * 2000;
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.02);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.02 + 0.01);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.02 + 0.05);
      osc.connect(gain);
      gain.connect(master);
      osc.start(ctx.currentTime + i * 0.02);
      osc.stop(ctx.currentTime + i * 0.02 + 0.05);
    }
  }
};
