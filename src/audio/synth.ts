// src/audio/synth.ts — Tactile Web Audio Synthesizer (FR-FB-004, Zero Jarring Buzzers)
// Generates warm acoustic sounds: wooden toacă tap, brass sheep bell (talangă), and gentle marimba chimes.

class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Warm wooden tap (like a small wooden toacă / woodblock)
   * Used for card drag, tap, or gentle interaction.
   */
  playWoodenTap() {
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Brass sheep bell (talangă) chime
   * Resonant warm metallic chime for successful sorts and milestones.
   */
  playBrassBell() {
    try {
      const ctx = this.initContext();
      const t = ctx.currentTime;

      // Primary tone + harmonic overtones
      const freqs = [880, 1320, 1760];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        const volume = idx === 0 ? 0.3 : 0.12 / (idx + 1);
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.65);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Encouraging "Mai încearcă o dată!" gentle marimba chord (no jarring error sounds)
   */
  playGentleNudge() {
    try {
      const ctx = this.initContext();
      const t = ctx.currentTime;
      const notes = [330, 392]; // E4, G4 soft interval

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);

        gain.gain.setValueAtTime(0.18, t + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.2);
      });
    } catch {
      // Ignore
    }
  }

  private activeAudio: HTMLAudioElement | null = null;

  private readonly audioClipMap: Record<string, string> = {
    'casă': '/audio/word_casa.mp3',
    'o casă, două case': '/audio/phrase_casa.mp3',
    'tren': '/audio/word_tren.mp3',
    'un tren, două trenuri': '/audio/phrase_tren.mp3',
    'câine': '/audio/word_caine.mp3',
    'un câine, doi câini': '/audio/phrase_caine.mp3',
    'scaun': '/audio/word_scaun.mp3',
    'un scaun, două scaune': '/audio/phrase_scaun.mp3',
    'carte': '/audio/word_carte.mp3',
    'o carte, două cărți': '/audio/phrase_carte.mp3',
    'pom': '/audio/word_pom.mp3',
    'un pom, doi pomi': '/audio/phrase_pom.mp3',
    'casa bunicii': '/audio/cas_casa_bunicii.mp3',
    'mamei': '/audio/cas_mamei.mp3',
    'cartea fetei': '/audio/cas_fetei.mp3',
    'mingea băiatului': '/audio/cas_baiatului.mp3',
    'am 8 ani': '/audio/clq_am_8_ani.mp3',
    'are sens': '/audio/clq_are_sens.mp3',
    'mi-e frig': '/audio/clq_mi_e_frig.mp3',
    'am făcut un duș': '/audio/clq_dus.mp3',
    'câinele': '/audio/art_cainele.mp3',
    'pe masă': '/audio/art_pe_masa.mp3',
    'băiatul': '/audio/art_baiatul.mp3',
    'cartea': '/audio/art_cartea.mp3',
    'să merg afară': '/audio/sub_vreau_sa_merg.mp3',
    'vreau să merg afară': '/audio/sub_vreau_sa_merg.mp3',
    'să mănânc supa': '/audio/sub_trebuie_sa_mananc.mp3',
    'trebuie să mănânc supa': '/audio/sub_trebuie_sa_mananc.mp3',
    'să te ajut': '/audio/sub_pot_sa_ajut.mp3',
    'eu pot să te ajut': '/audio/sub_pot_sa_ajut.mp3',
    'să desenez': '/audio/sub_place_sa_desenez.mp3',
    'îmi place să desenez': '/audio/sub_place_sa_desenez.mp3',
    'al': '/audio/pos_prieten_al_meu.mp3',
    'un prieten al meu': '/audio/pos_prieten_al_meu.mp3',
    'a': '/audio/pos_carte_a_mea.mp3',
    'o carte a mea': '/audio/pos_carte_a_mea.mp3',
    'ai': '/audio/pos_colegii_ai_mei.mp3',
    'colegii ai mei': '/audio/pos_colegii_ai_mei.mp3',
    'ale': '/audio/pos_jucariile_ale_mele.mp3',
    'jucăriile ale mele': '/audio/pos_jucariile_ale_mele.mp3',
    'douăzeci de mere': '/audio/num_20_de_mere.mp3',
    'cinci cărți': '/audio/num_5_carti.mp3',
    'treizeci și cinci de oițe': '/audio/num_35_de_oite.mp3',
    'doisprezece prieteni': '/audio/num_12_prieteni.mp3',
    'l-am văzut pe ion în parc': '/audio/cli_pe_ion.mp3',
    'l-am văzut pe ion': '/audio/cli_pe_ion.mp3',
    'am chemat-o pe maria ieri': '/audio/cli_pe_maria.mp3',
    'am chemat-o pe maria': '/audio/cli_pe_maria.mp3',
    'îl aștept pe tata la școală': '/audio/cli_pe_tata.mp3',
    'îl aștept pe tata': '/audio/cli_pe_tata.mp3',
    'o ajut pe bunica în grădină': '/audio/cli_pe_bunica.mp3',
    'o ajut pe bunica': '/audio/cli_pe_bunica.mp3',
    'îi aud pe băieți jucând fotbal': '/audio/cli_pe_baieti.mp3',
    'îi aud pe băieți': '/audio/cli_pe_baieti.mp3',
    'o mașină roșie': '/audio/agr_masina_rosie.mp3',
    'doi câini albi': '/audio/agr_caini_albi.mp3',
    'creionul albastru': '/audio/ord_creionul_albastru.mp3',
    'trei mere verzi': '/audio/agr_mere_verzi.mp3',
    'mere verzi': '/audio/agr_mere_verzi.mp3',
    'casa frumoasă': '/audio/ord_casa_frumoasa.mp3',
    'bună, tudor! eu sunt miorița.': '/audio/greet_mascot.mp3',
    'bravo, tudor!': '/audio/bravo.mp3',
    'minunat!': '/audio/minunat.mp3'
  };

  /**
   * Speak authentic native Romanian text.
   * NEVER falls back to an English OS voice.
   */
  speakRomanian(text: string) {
    const clean = text.trim();
    const cleanLower = clean.toLowerCase();

    // 1. Look for pre-rendered clip
    let clipUrl = this.audioClipMap[cleanLower];
    if (!clipUrl) {
      for (const [k, v] of Object.entries(this.audioClipMap)) {
        if (cleanLower.includes(k) && k.length > 3) {
          clipUrl = v;
          break;
        }
      }
    }

    if (clipUrl) {
      this.playAudioFile(clipUrl);
      return;
    }

    // 2. Check if browser has a real native Romanian voice installed
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const roVoice = voices.find(v => v.lang.startsWith('ro') && (v.name.includes('Natural') || v.name.includes('Online'))) ||
                      voices.find(v => v.lang.startsWith('ro'));

      if (roVoice) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = 'ro-RO';
        u.voice = roVoice;
        u.rate = 0.92;
        u.pitch = 1.05;
        window.speechSynthesis.speak(u);
        return;
      }
    }

    // 3. Fallback: stream authentic Romanian TTS directly so the user NEVER hears an English voice
    const streamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ro&client=tw-ob&q=${encodeURIComponent(clean)}`;
    this.playAudioFile(streamUrl);
  }

  private playAudioFile(url: string) {
    try {
      if (this.activeAudio) {
        this.activeAudio.pause();
        this.activeAudio = null;
      }
      this.activeAudio = new Audio(url);
      this.activeAudio.play().catch(err => {
        console.warn('Could not play Romanian audio file:', err);
      });
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundSynthesizer();
