export const playScanTone = (ok: boolean) => {
  try {
    const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = ok ? 'sine' : 'square';
    oscillator.frequency.value = ok ? 880 : 220;
    gain.gain.value = 0.07;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.16);
    void ctx.resume();
    window.setTimeout(() => {
      void ctx.close();
    }, 300);
  } catch {
    // El navegador puede silenciar audio automático.
  }
};
