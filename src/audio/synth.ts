// src/audio/synth.ts — Tactile Web Audio Synthesizer & Context-Aware Studio Audio Player
// Plays pre-recorded Romanian studio clips ONLY for exact/context-matched words & phrases (never random substring hijacking!).

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
      // Ignore
    }
  }

  /**
   * Brass sheep bell (talangă) chime
   */
  playBrassBell() {
    try {
      const ctx = this.initContext();
      const t = ctx.currentTime;

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
   * Encouraging gentle marimba chord (no jarring error sounds)
   */
  playGentleNudge() {
    try {
      const ctx = this.initContext();
      const t = ctx.currentTime;
      const notes = [330, 392];

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

  /**
   * Exact & context-aware mapping of recorded Romanian studio audio clips in /public/audio.
   */
  private readonly audioClipMap: Record<string, string> = {
    // Nouns & Genders (GEN)
    'casă': '/audio/word_casa.mp3',
    'o casă': '/audio/word_casa.mp3',
    'o casă, două case': '/audio/phrase_casa.mp3',
    'două case': '/audio/phrase_casa.mp3',
    'tren': '/audio/word_tren.mp3',
    'un tren': '/audio/word_tren.mp3',
    'un tren, două trenuri': '/audio/phrase_tren.mp3',
    'două trenuri': '/audio/phrase_tren.mp3',
    'câine': '/audio/word_caine.mp3',
    'un câine': '/audio/word_caine.mp3',
    'un câine, doi câini': '/audio/phrase_caine.mp3',
    'doi câini': '/audio/phrase_caine.mp3',
    'scaun': '/audio/word_scaun.mp3',
    'un scaun': '/audio/word_scaun.mp3',
    'un scaun, două scaune': '/audio/phrase_scaun.mp3',
    'două scaune': '/audio/phrase_scaun.mp3',
    'carte': '/audio/word_carte.mp3',
    'o carte': '/audio/word_carte.mp3',
    'o carte, două cărți': '/audio/phrase_carte.mp3',
    'două cărți': '/audio/phrase_carte.mp3',
    'pom': '/audio/word_pom.mp3',
    'un pom': '/audio/word_pom.mp3',
    'un pom, doi pomi': '/audio/phrase_pom.mp3',
    'doi pomi': '/audio/phrase_pom.mp3',

    // Definite Articles (ART)
    'câinele': '/audio/art_cainele.mp3',
    'pe masă': '/audio/art_pe_masa.mp3',
    'masă': '/audio/art_pe_masa.mp3',
    'băiatul': '/audio/art_baiatul.mp3',
    'cartea': '/audio/art_cartea.mp3',

    // Genitive / Possessive Endings (CAS)
    'casa bunicii': '/audio/cas_casa_bunicii.mp3',
    'bunicii': '/audio/cas_casa_bunicii.mp3',
    'mamei': '/audio/cas_mamei.mp3',
    'cartea fetei': '/audio/cas_fetei.mp3',
    'fetei': '/audio/cas_fetei.mp3',
    'mingea băiatului': '/audio/cas_baiatului.mp3',
    'băiatului': '/audio/cas_baiatului.mp3',

    // Adjective Agreement & Word Order (AGR / ORD)
    'o mașină roșie': '/audio/agr_masina_rosie.mp3',
    'mașină roșie': '/audio/agr_masina_rosie.mp3',
    'roșie': '/audio/agr_masina_rosie.mp3',
    'doi câini albi': '/audio/agr_caini_albi.mp3',
    'câini albi': '/audio/agr_caini_albi.mp3',
    'albi': '/audio/agr_caini_albi.mp3',
    'creionul albastru': '/audio/ord_creionul_albastru.mp3',
    'albastru': '/audio/ord_creionul_albastru.mp3',
    'trei mere verzi': '/audio/agr_mere_verzi.mp3',
    'mere verzi': '/audio/agr_mere_verzi.mp3',
    'verzi': '/audio/agr_mere_verzi.mp3',
    'casa frumoasă': '/audio/ord_casa_frumoasa.mp3',
    'o casă frumoasă': '/audio/ord_casa_frumoasa.mp3',
    'frumoasă': '/audio/ord_casa_frumoasa.mp3',

    // Subjunctive "SĂ" (SUB)
    'să merg': '/audio/sub_vreau_sa_merg.mp3',
    'să merg afară': '/audio/sub_vreau_sa_merg.mp3',
    'vreau să merg afară': '/audio/sub_vreau_sa_merg.mp3',
    'vreau să merg': '/audio/sub_vreau_sa_merg.mp3',
    'să mănânc': '/audio/sub_trebuie_sa_mananc.mp3',
    'să mănânc supa': '/audio/sub_trebuie_sa_mananc.mp3',
    'trebuie să mănânc supa': '/audio/sub_trebuie_sa_mananc.mp3',
    'să te ajut': '/audio/sub_pot_sa_ajut.mp3',
    'pot să te ajut': '/audio/sub_pot_sa_ajut.mp3',
    'eu pot să te ajut': '/audio/sub_pot_sa_ajut.mp3',
    'să desenez': '/audio/sub_place_sa_desenez.mp3',
    'îmi place să desenez': '/audio/sub_place_sa_desenez.mp3',

    // Possessives (POS)
    'un prieten al meu': '/audio/pos_prieten_al_meu.mp3',
    'prietenul meu': '/audio/pos_prieten_al_meu.mp3',
    'al meu': '/audio/pos_prieten_al_meu.mp3',
    'o carte a mea': '/audio/pos_carte_a_mea.mp3',
    'cartea mea': '/audio/pos_carte_a_mea.mp3',
    'a mea': '/audio/pos_carte_a_mea.mp3',
    'colegii ai mei': '/audio/pos_colegii_ai_mei.mp3',
    'ai mei': '/audio/pos_colegii_ai_mei.mp3',
    'jucăriile ale mele': '/audio/pos_jucariile_ale_mele.mp3',
    'ale mele': '/audio/pos_jucariile_ale_mele.mp3',

    // Numerals & "DE" (NUM)
    'douăzeci de mere': '/audio/num_20_de_mere.mp3',
    'douăzeci de': '/audio/num_20_de_mere.mp3',
    'cinci cărți': '/audio/num_5_carti.mp3',
    'treizeci și cinci de oițe': '/audio/num_35_de_oite.mp3',
    'treizeci și cinci de': '/audio/num_35_de_oite.mp3',
    'doisprezece prieteni': '/audio/num_12_prieteni.mp3',

    // Clitic Doubling & "PE" (CLI)
    'l-am văzut pe ion în parc': '/audio/cli_pe_ion.mp3',
    'l-am văzut pe ion': '/audio/cli_pe_ion.mp3',
    'pe ion': '/audio/cli_pe_ion.mp3',
    'am chemat-o pe maria ieri': '/audio/cli_pe_maria.mp3',
    'am chemat-o pe maria': '/audio/cli_pe_maria.mp3',
    'pe maria': '/audio/cli_pe_maria.mp3',
    'îl aștept pe tata la școală': '/audio/cli_pe_tata.mp3',
    'îl aștept pe tata': '/audio/cli_pe_tata.mp3',
    'pe tata': '/audio/cli_pe_tata.mp3',
    'o ajut pe bunica în grădină': '/audio/cli_pe_bunica.mp3',
    'o ajut pe bunica': '/audio/cli_pe_bunica.mp3',
    'pe bunica': '/audio/cli_pe_bunica.mp3',
    'îi aud pe băieți jucând fotbal': '/audio/cli_pe_baieti.mp3',
    'îi aud pe băieți': '/audio/cli_pe_baieti.mp3',
    'pe băieți': '/audio/cli_pe_baieti.mp3',

    // Idioms & Calques (CLQ)
    'am 8 ani': '/audio/clq_am_8_ani.mp3',
    'am opt ani': '/audio/clq_am_8_ani.mp3',
    'are opt ani': '/audio/clq_am_8_ani.mp3',
    'are sens': '/audio/clq_are_sens.mp3',
    'mi-e frig': '/audio/clq_mi_e_frig.mp3',
    'am făcut un duș': '/audio/clq_dus.mp3',

    // Greetings & Praise
    'bună, tudor! eu sunt miorița.': '/audio/greet_mascot.mp3',
    'bravo, tudor!': '/audio/bravo.mp3',
    'minunat!': '/audio/minunat.mp3',
  };

  private normalizeLookupKey(text: string): string {
    return String(text || '')
      .toLowerCase()
      .replace(/[„”"'!?.,:;()[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Returns the studio audio clip URL ONLY if `text` is an exact match for a recorded word or phrase.
   * Never matches random words inside a long paragraph!
   */
  getMatchingAudioClip(text: string): string | null {
    const key = this.normalizeLookupKey(text);
    if (!key) return null;
    return this.audioClipMap[key] || null;
  }

  /**
   * Returns true if this word or short phrase has a studio audio clip that can be heard.
   */
  hasRecordedAudio(text: string): boolean {
    return this.getMatchingAudioClip(text) !== null;
  }

  /**
   * Finds all recorded audio phrases that appear inside a sentence so the UI can highlight or play them in context.
   */
  findRecordedClipsInSentence(sentence: string): Array<{ phrase: string; url: string }> {
    const normSentence = this.normalizeLookupKey(sentence);
    if (!normSentence) return [];

    // Check if the entire sentence is a recorded phrase first
    const exactFull = this.audioClipMap[normSentence];
    if (exactFull) {
      return [{ phrase: sentence.trim(), url: exactFull }];
    }

    const matches: Array<{ phrase: string; url: string }> = [];
    const seenUrls = new Set<string>();

    // Sort keys longest-first so "casa bunicii" matches before "casă"
    const sortedEntries = Object.entries(this.audioClipMap).sort(
      (a, b) => b[0].length - a[0].length
    );

    const wordsInSentence = normSentence.split(' ');
    for (const [k, url] of sortedEntries) {
      if (k.length < 3 || seenUrls.has(url)) continue;
      // Must match on whole word boundaries, not partial substrings!
      const keyWords = k.split(' ');
      for (let i = 0; i <= wordsInSentence.length - keyWords.length; i++) {
        const slice = wordsInSentence.slice(i, i + keyWords.length).join(' ');
        if (slice === k) {
          matches.push({ phrase: k, url });
          seenUrls.add(url);
          break;
        }
      }
    }

    return matches;
  }

  /**
   * Speak authentic Romanian text:
   * 1. If it is an exact match for a studio-recorded word/phrase, play the studio MP3.
   * 2. Otherwise, if the browser has a native Romanian (`ro-RO`) voice installed, use it.
   * 3. Never play a random single-word clip for a multi-sentence paragraph!
   */
  speakRomanian(text: string, customRate = 0.92) {
    const clean = text.trim();
    if (!clean) return;

    // 1. Exact match for a studio-recorded word or phrase
    const exactClipUrl = this.getMatchingAudioClip(clean);
    if (exactClipUrl) {
      this.playAudioFile(exactClipUrl, customRate < 0.9 ? 0.85 : 1.0);
      return;
    }

    // 2. If it's a single short sentence (<= 8 words) that contains a studio-recorded target phrase, play that target phrase
    const wordCount = clean.split(/\s+/).length;
    if (wordCount <= 8) {
      const contextualClips = this.findRecordedClipsInSentence(clean);
      if (contextualClips.length > 0) {
        this.playAudioFile(contextualClips[0].url, customRate < 0.9 ? 0.85 : 1.0);
        return;
      }
    }

    // 3. Check if browser has a real native Romanian voice installed
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const roVoice =
        voices.find(
          (v) => v.lang.startsWith('ro') && (v.name.includes('Natural') || v.name.includes('Online'))
        ) || voices.find((v) => v.lang.startsWith('ro'));

      if (roVoice) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = 'ro-RO';
        u.voice = roVoice;
        u.rate = customRate;
        u.pitch = 1.05;
        window.speechSynthesis.speak(u);
        return;
      }
    }
  }

  speakRomanianSlow(text: string) {
    this.speakRomanian(text, 0.82);
  }

  private playAudioFile(url: string, playbackRate = 1.0) {
    try {
      if (this.activeAudio) {
        this.activeAudio.pause();
        this.activeAudio = null;
      }
      this.activeAudio = new Audio(url);
      this.activeAudio.playbackRate = playbackRate;
      this.activeAudio.play().catch((err) => {
        console.warn('Could not play Romanian audio file:', err);
      });
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundSynthesizer();
