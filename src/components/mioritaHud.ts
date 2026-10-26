// src/components/mioritaHud.ts — Socratic Mascot HUD with Discrete Focus Mode (ADHD-Friendly)
// Displays Miorița (linocut ewe-lamb with brass bell), speaks native Romanian, and provides Socratic nudges.
// Conforms to requirements.md (FR-FB-001..004, NFR-UX-002: ADHD session contract)

import { sound } from '../audio/synth';

export const STORAGE_KEY_MINIMIZED = 'miorita_hud_minimized';

export interface MioritaHudOptions {
  initialPrompt?: string;
  initialBridge?: string;
  onAudioPlay?: () => void;
}

export class MioritaHud {
  private container: HTMLElement;
  private bubbleCard: HTMLElement;
  private mascotWrapper: HTMLElement;
  private minimizeBtn: HTMLButtonElement;
  private pillBtn: HTMLButtonElement;
  private textEl: HTMLElement;
  private bridgeBox: HTMLElement;
  private btnAudio: HTMLButtonElement;
  private btnMic: HTMLButtonElement;
  private isListening = false;
  private isMinimized = false;
  private currentSpeech = '';
  private currentBridge = '';

  private readonly cheerQuotes = [
    'Bravo, Tudor! Limba română se așază frumos în mintea ta.',
    'Minunat! Încă o cusătură adăugată pe covorul tău mioritic.',
    'Tare bine ai potrivit cuvântul! Sună exact ca acasă la bunici.',
    'Ai o ureche grozavă pentru vorba curată românească!',
  ];

  constructor(options: MioritaHudOptions = {}) {
    this.isMinimized =
      typeof window !== 'undefined' &&
      localStorage.getItem(STORAGE_KEY_MINIMIZED) === 'true';

    this.currentSpeech =
      options.initialPrompt ||
      'Bună, Tudor! Eu sunt <strong>Miorița</strong>. Alege un loc din sat și hai să ne jucăm cu vorbele românești!';
    this.currentBridge = options.initialBridge || '';

    // Main HUD Container
    this.container = document.createElement('div');
    this.container.className = 'miorita-hud-container';

    // 1. Minimized Focus Pill (Parked subtly when Tudor needs zero distraction)
    this.pillBtn = document.createElement('button');
    this.pillBtn.className = 'miorita-hud-pill';
    this.pillBtn.setAttribute('type', 'button');
    this.pillBtn.setAttribute('title', 'Deschide-o pe Miorița 🐑');
    this.pillBtn.innerHTML = `
      <span class="pill-avatar">
        <img src="/art/mascot.jpg" alt="Miorița" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';" />
        <span style="display:none;">🐑</span>
      </span>
      <span class="pill-label">Miorița</span>
      <span class="pill-bell">🔔</span>
    `;
    this.pillBtn.addEventListener('click', () => {
      sound.playBrassBell();
      this.toggleMinimized();
    });

    // 2. Full Mascot Alcove & Socratic Speech Card
    this.bubbleCard = document.createElement('div');
    this.bubbleCard.className = 'miorita-speech-card';

    // Top action bar inside card
    const cardTopBar = document.createElement('div');
    cardTopBar.className = 'speech-card-topbar';

    const speakerInfo = document.createElement('div');
    speakerInfo.className = 'speaker-meta';
    speakerInfo.innerHTML = `
      <span class="speaker-name">Miorița</span>
      <span class="speaker-badge">Ghidul tău</span>
    `;

    this.minimizeBtn = document.createElement('button');
    this.minimizeBtn.className = 'btn-minimize-hud';
    this.minimizeBtn.setAttribute('type', 'button');
    this.minimizeBtn.setAttribute('title', 'Ascunde Miorița (Mod Concentrare) 🐑');
    this.minimizeBtn.innerHTML = `<span>Ascunde</span> <span style="font-size:12px;">✕</span>`;
    this.minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playWoodenTap();
      this.toggleMinimized();
    });

    cardTopBar.appendChild(speakerInfo);
    cardTopBar.appendChild(this.minimizeBtn);

    // Body with avatar and text
    const cardBody = document.createElement('div');
    cardBody.className = 'speech-card-body';

    // Mascot Avatar with Brass Bell
    this.mascotWrapper = document.createElement('div');
    this.mascotWrapper.className = 'mascot-portrait';
    this.mascotWrapper.setAttribute('title', 'Apasă pe Miorița!');
    this.mascotWrapper.innerHTML = `
      <img src="/art/mascot.jpg" alt="Miorița" class="mascot-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
      <span class="mascot-fallback" style="display:none;">🐑</span>
      <span class="mascot-bell-tag">🔔</span>
    `;
    this.mascotWrapper.addEventListener('click', () => {
      sound.playBrassBell();
      this.handleMascotClick();
    });

    // Speech text container
    const textContainer = document.createElement('div');
    textContainer.className = 'speech-text-wrap';

    this.textEl = document.createElement('div');
    this.textEl.className = 'speech-text';
    this.textEl.innerHTML = this.currentSpeech;

    // Controls under text (Audio button + Bridge toggle)
    const speechControls = document.createElement('div');
    speechControls.className = 'speech-controls';

    this.btnAudio = document.createElement('button');
    this.btnAudio.className = 'btn-audio-pill';
    this.btnAudio.setAttribute('type', 'button');
    this.btnAudio.innerHTML = `<span>🔊</span> <span>Ascultă în română</span>`;
    this.btnAudio.addEventListener('click', () => {
      sound.playBrassBell();
      const plainText = this.textEl.textContent || '';
      sound.speakRomanian(plainText);
    });

    this.btnMic = document.createElement('button');
    this.btnMic.className = 'btn-mic-pill';
    this.btnMic.setAttribute('type', 'button');
    this.btnMic.setAttribute('title', 'Apasă și rostește în română (Spune tu!)');
    this.btnMic.innerHTML = `<span>🎙️</span> <span>Spune tu!</span>`;
    this.btnMic.addEventListener('click', () => {
      this.handleMicClick();
    });

    // Contrastive English Bridge Box
    this.bridgeBox = document.createElement('div');
    this.bridgeBox.className = 'hud-bridge-box';
    this.bridgeBox.style.display = this.currentBridge ? 'flex' : 'none';
    this.bridgeBox.innerHTML = `
      <span class="bridge-flag">🇬🇧</span>
      <div class="bridge-content">
        <strong>De ce se întâmplă asta în engleză? </strong>
        <span class="bridge-text">${this.currentBridge}</span>
      </div>
    `;

    speechControls.appendChild(this.btnAudio);
    speechControls.appendChild(this.btnMic);
    textContainer.appendChild(this.textEl);
    textContainer.appendChild(this.bridgeBox);
    textContainer.appendChild(speechControls);

    cardBody.appendChild(this.mascotWrapper);
    cardBody.appendChild(textContainer);

    this.bubbleCard.appendChild(cardTopBar);
    this.bubbleCard.appendChild(cardBody);

    this.container.appendChild(this.pillBtn);
    this.container.appendChild(this.bubbleCard);

    this.updateVisibility();
  }

  getElement(): HTMLElement {
    return this.container;
  }

  /** Speak new dialogue text with optional English bridge explanation */
  say(text: string, englishBridge = '', autoSpeak = false): void {
    this.currentSpeech = text;
    this.currentBridge = englishBridge;
    this.textEl.innerHTML = text;

    const bridgeSpan = this.bridgeBox.querySelector('.bridge-text');
    if (bridgeSpan) bridgeSpan.textContent = englishBridge;
    this.bridgeBox.style.display = englishBridge ? 'flex' : 'none';

    // Micro-wobble animation
    this.bubbleCard.classList.remove('pop');
    void this.bubbleCard.offsetWidth; // trigger reflow
    this.bubbleCard.classList.add('pop');

    if (autoSpeak) {
      sound.speakRomanian(this.textEl.textContent || '');
    }
  }

  /** Gentle Socratic nudge on retry (zero negative framing) */
  nudge(hintText: string, englishBridge = ''): void {
    sound.playGentleNudge();
    this.say(`Aproape! 🐑 ${hintText}`, englishBridge, false);
  }

  /** Celebratory cheer on success */
  celebrate(customText?: string): void {
    sound.playBrassBell();
    const text =
      customText ||
      this.cheerQuotes[Math.floor(Math.random() * this.cheerQuotes.length)];
    this.say(`🎉 ${text}`, '', true);
  }

  private handleMascotClick(): void {
    const quote =
      this.cheerQuotes[Math.floor(Math.random() * this.cheerQuotes.length)];
    this.say(`🐑 <em>${quote}</em>`, '', true);
  }

  private handleMicClick(): void {
    if (this.isListening) return;

    const SpeechRec =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      sound.playGentleNudge();
      const phrase = (this.textEl.textContent || '').trim();
      this.say(
        `Spune cu voce tare după mine: «<strong>${phrase}</strong>». Te ascult cu drag! 🐑`,
        '',
        false
      );
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'ro-RO';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      this.isListening = true;
      this.btnMic.classList.add('listening');
      this.btnMic.innerHTML = `<span>🔴</span> <span>Te ascult...</span>`;

      const timeoutId = setTimeout(() => {
        try {
          recognition.stop();
        } catch {}
      }, 5000);

      recognition.onresult = (event: any) => {
        clearTimeout(timeoutId);
        this.isListening = false;
        this.btnMic.classList.remove('listening');
        this.btnMic.innerHTML = `<span>🎙️</span> <span>Spune tu!</span>`;

        const transcript = event.results[0][0].transcript;
        sound.playBrassBell();
        this.say(
          `Te-am auzit! 🌟 Ai spus: <strong>«${transcript}»</strong>. Sună tare frumos românește!`,
          '',
          false
        );
      };

      recognition.onerror = () => {
        clearTimeout(timeoutId);
        this.isListening = false;
        this.btnMic.classList.remove('listening');
        this.btnMic.innerHTML = `<span>🎙️</span> <span>Spune tu!</span>`;
        this.say(
          'Bravo că ai încercat cu voce tare! 🐑 Apasă pe 🔊 dacă vrei să asculți din nou.',
          '',
          false
        );
      };

      recognition.onend = () => {
        clearTimeout(timeoutId);
        this.isListening = false;
        this.btnMic.classList.remove('listening');
        this.btnMic.innerHTML = `<span>🎙️</span> <span>Spune tu!</span>`;
      };

      recognition.start();
    } catch {
      this.isListening = false;
      this.btnMic.classList.remove('listening');
      this.btnMic.innerHTML = `<span>🎙️</span> <span>Spune tu!</span>`;
      this.say(
        'Spune cu voce tare după mine! Vorba românească se așază cel mai bine când o rostești! 🐑',
        '',
        false
      );
    }
  }

  toggleMinimized(): void {
    this.isMinimized = !this.isMinimized;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_MINIMIZED, this.isMinimized.toString());
    }
    this.updateVisibility();
  }

  private updateVisibility(): void {
    if (this.isMinimized) {
      this.bubbleCard.style.display = 'none';
      this.pillBtn.style.display = 'inline-flex';
    } else {
      this.bubbleCard.style.display = 'block';
      this.pillBtn.style.display = 'none';
    }
  }
}
