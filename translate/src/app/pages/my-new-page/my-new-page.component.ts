import {Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

declare global {
  interface HTMLElementTagNameMap {
    'pose-viewer': HTMLPoseViewerElement;
  }
  interface HTMLPoseViewerElement extends HTMLElement {
    src: string;
    autoplay: boolean;
    'aspect-ratio': string;
    background: string;
    duration: number;
    currentTime: number;
    play(): Promise<void>;
    pause(): Promise<void>;
    getPose(): Promise<any>;
    shadowRoot: ShadowRoot;
  }
}

interface Scenario {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  hasRoles?: boolean;
  roles?: Role[];
  quickPhrases?: string[];
  isPriority?: boolean;
}

interface Role {
  id: string;
  name: string;
  icon: string;
  phrases: string[];
}

@Component({
  selector: 'app-my-new-page',
  templateUrl: './my-new-page.component.html',
  styleUrls: ['./my-new-page.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyNewPageComponent implements OnInit {
  textInput = new FormControl('');
  maxTextLength = 500;
  spokenLanguage = 'en';
  signedLanguage = 'ase';
  poseUrl: string = '';
  isLoading = false;
  showOutput = false;
  isPoseViewerLoaded = false;
  isListening = false;
  isSpeaking = false;
  recognition: any;
  speechSynthesis: SpeechSynthesis;

  selectedScenario: string = 'practice';
  selectedRole: string = '';
  showPanicButton = false;
  isPanicMode = false;
  emergencyMode: 'loud' | 'silent' = 'loud';
  userLocation: string = '';

  spokenLanguages = [
    {code: 'en', name: 'English'},
    {code: 'de', name: 'German'},
    {code: 'fr', name: 'French'},
    {code: 'es', name: 'Spanish'},
  ];

  signedLanguages = [
    {code: 'ase', name: 'American Sign Language (ASL)'},
    {code: 'gsg', name: 'German Sign Language (DGS)'},
    {code: 'fsl', name: 'French Sign Language (LSF)'},
    {code: 'bfi', name: 'British Sign Language (BSL)'},
  ];

  scenarios: Scenario[] = [
    {
      id: 'practice',
      name: 'Free Practice',
      icon: '🎯',
      color: '#6366f1',
      description: 'Practice any signs freely',
      quickPhrases: [
        'Hello, how are you?',
        'Thank you very much',
        'Nice to meet you',
        'Have a great day',
        'See you later',
      ],
    },
    {
      id: 'emergency',
      name: 'Emergency',
      icon: '🚨',
      color: '#ef4444',
      description: 'Quick emergency communication',
      isPriority: true,
      quickPhrases: [
        'Help me please',
        'Call 911 now',
        'I need ambulance',
        'Medical emergency',
        'I am hurt',
        'Call police',
        'Fire emergency',
        'I cannot breathe',
        'Someone is injured',
        'Danger here',
      ],
    },
    {
      id: 'medical',
      name: 'Medical',
      icon: '🏥',
      color: '#3b82f6',
      description: 'Hospital and doctor visits',
      hasRoles: true,
      roles: [
        {
          id: 'patient',
          name: 'Patient',
          icon: '👤',
          phrases: [
            'I feel sick',
            'My head hurts',
            'My stomach hurts',
            'I have fever',
            'I need help',
            'Where is doctor?',
            'I am allergic to penicillin',
            'I cannot breathe well',
            'I feel dizzy',
            'I need medicine',
          ],
        },
        {
          id: 'doctor',
          name: 'Doctor/Nurse',
          icon: '🩺',
          phrases: [
            'Where does it hurt?',
            'Open your mouth please',
            'Take this medicine',
            'You need rest',
            'Come back next week',
            'Do you have allergies?',
            'I will examine you',
            'Your blood pressure is normal',
            'Take one pill daily',
            'Call if symptoms worsen',
          ],
        },
      ],
    },
    {
      id: 'college',
      name: 'College',
      icon: '🏫',
      color: '#10b981',
      description: 'Classroom and campus',
      hasRoles: true,
      roles: [
        {
          id: 'student',
          name: 'Student',
          icon: '🎓',
          phrases: [
            'I have a question',
            'Can you explain again?',
            'I did not understand',
            'When is assignment due?',
            'Can I submit late?',
            'I need help with homework',
            'Where is the library?',
            'What is exam date?',
            'Can I talk to professor?',
            'I need more time',
          ],
        },
        {
          id: 'professor',
          name: 'Professor',
          icon: '👨‍🏫',
          phrases: [
            'Any questions class?',
            'Submit by Friday',
            'Read chapter 5 tonight',
            'Exam next Monday',
            'Good job everyone',
            'Please pay attention',
            'Come to office hours',
            'This is important',
            'Review the notes',
            'See you next class',
          ],
        },
      ],
    },
    {
      id: 'interview',
      name: 'Interview',
      icon: '🎤',
      color: '#f59e0b',
      description: 'Job interview preparation',
      hasRoles: true,
      roles: [
        {
          id: 'candidate',
          name: 'Candidate',
          icon: '🧑‍💼',
          phrases: [
            'Thank you for opportunity',
            'I am experienced in this field',
            'I work well in teams',
            'I am a quick learner',
            'When can I start?',
            'What is the salary range?',
            'I have leadership experience',
            'I am passionate about this role',
            'Can I ask a question?',
            'I look forward to hearing from you',
          ],
        },
        {
          id: 'interviewer',
          name: 'Interviewer',
          icon: '👔',
          phrases: [
            'Tell me about yourself',
            'What are your strengths?',
            'Why do you want this job?',
            'Where do you see yourself in 5 years?',
            'Why should we hire you?',
            'Do you have any questions?',
            'When can you start?',
            'We will contact you soon',
            'Welcome to the team',
            'Thank you for coming',
          ],
        },
      ],
    },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    await this.loadPoseViewer();
    this.initSpeechRecognition();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
    this.textInput.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(text => {
      if (text && text.trim().length > 0) {
        this.translateText(text.trim());
      } else {
        this.clearTranslation();
      }
    });
  }

  async loadPoseViewer(): Promise<void> {
    try {
      const {defineCustomElements} = await import('pose-viewer/loader');
      await defineCustomElements();
      this.isPoseViewerLoaded = true;
      console.log('✅ Pose viewer loaded');
    } catch (error) {
      console.error('❌ Failed to load pose-viewer:', error);
    }
  }

  selectScenario(scenarioId: string): void {
    this.selectedScenario = scenarioId;
    this.showPanicButton = scenarioId === 'emergency';
    this.isPanicMode = false;
    this.selectedRole = '';
    this.clearTranslation();
    this.textInput.setValue('');
  }

  selectRole(roleId: string): void {
    this.selectedRole = roleId;
  }

  getSelectedScenario(): Scenario {
    return this.scenarios.find(s => s.id === this.selectedScenario) || this.scenarios[0];
  }

  getCurrentPhrases(): string[] {
    const scenario = this.getSelectedScenario();
    if (scenario.hasRoles && scenario.roles && this.selectedRole) {
      const role = scenario.roles.find(r => r.id === this.selectedRole);
      return role ? role.phrases : [];
    }
    return scenario.quickPhrases || [];
  }

  insertQuickPhrase(phrase: string): void {
    this.textInput.setValue(phrase);
    this.translateText(phrase);
  }

  setEmergencyMode(mode: 'loud' | 'silent'): void {
    this.emergencyMode = mode;
  }

  async triggerPanicMode(): Promise<void> {
    this.isPanicMode = true;
    await this.getLocation();

    if (this.emergencyMode === 'loud') {
      document.body.style.animation = 'panicFlash 0.5s ease-in-out 3';
      const speech = new SpeechSynthesisUtterance('EMERGENCY! EMERGENCY! EMERGENCY!');
      speech.rate = 1.2;
      speech.volume = 1.0;
      speech.lang = 'en-US';
      if (this.speechSynthesis) {
        this.speechSynthesis.cancel();
        this.speechSynthesis.speak(speech);
      }
      this.playEmergencyBeep();
    } else {
      this.vibratePhone([200, 100, 200, 100, 200]);
    }

    this.sendWhatsAppAlert();
    const emergencyText =
      this.emergencyMode === 'loud' ? '🚨 EMERGENCY - CALL 911 NOW 🚨' : '🤫 Silent alert sent via WhatsApp';
    this.textInput.setValue(emergencyText);
    this.translateText('EMERGENCY HELP');

    setTimeout(() => {
      this.isPanicMode = false;
      document.body.style.animation = '';
    }, 5000);
  }

  vibratePhone(pattern: number[]): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  playEmergencyBeep(): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        }, i * 400);
      }
    } catch (error) {
      console.error('Audio beep failed:', error);
    }
  }

  async getLocation(): Promise<void> {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        this.userLocation = `${position.coords.latitude}, ${position.coords.longitude}`;
      } catch (error) {
        this.userLocation = 'Location unavailable';
        console.error('Geolocation error:', error);
      }
    } else {
      this.userLocation = 'Geolocation not supported';
    }
  }

  copyLocation(): void {
    if (this.userLocation && navigator.clipboard) {
      navigator.clipboard.writeText(this.userLocation).then(() => {
        alert('Location copied to clipboard!');
      });
    }
  }

  sendWhatsAppAlert(): void {
    const phoneNumber = '917358676470';
    let message = '🚨 EMERGENCY ALERT 🚨\n\n';
    message += 'I need immediate help!\n\n';

    if (
      this.userLocation &&
      this.userLocation !== 'Location unavailable' &&
      this.userLocation !== 'Geolocation not supported'
    ) {
      const [lat, lng] = this.userLocation.split(', ');
      message += `📍 My Location:\n${this.userLocation}\n\n`;
      message += `🗺 Google Maps:\nhttps://www.google.com/maps?q=${lat},${lng}\n\n`;
    } else {
      message += '📍 Location: Unable to retrieve\n\n';
    }

    message += `⏰ Time: ${new Date().toLocaleString()}\n\n`;
    message += 'Sent via KheiroVox Emergency System';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  translateText(text: string): void {
    if (!text || text.length === 0) return;
    console.log('🔄 Translating:', text);
    this.isLoading = true;
    this.showOutput = true;
    const api = 'https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_pose';
    this.poseUrl = `${api}?text=${encodeURIComponent(text)}&spoken=${this.spokenLanguage}&signed=${this.signedLanguage}`;
    console.log('📊 Pose URL:', this.poseUrl);
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();

      setTimeout(() => {
        const poseViewer = document.querySelector('pose-viewer') as HTMLPoseViewerElement;
        if (poseViewer) {
          console.log('🎯 Found pose-viewer, setting src');
          poseViewer.src = this.poseUrl;
          poseViewer.autoplay = true;
        } else {
          console.error('❌ pose-viewer element not found!');
        }
      }, 100);
    }, 500);
  }

  clearTranslation(): void {
    this.poseUrl = '';
    this.isLoading = false;
    this.showOutput = false;
  }

  onSpokenLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.spokenLanguage = select.value;
    const text = this.textInput.value;
    if (text && text.trim().length > 0) {
      this.translateText(text.trim());
    }
  }

  onSignedLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.signedLanguage = select.value;
    const text = this.textInput.value;
    if (text && text.trim().length > 0) {
      this.translateText(text.trim());
    }
  }

  initSpeechRecognition(): void {
    if (typeof window === 'undefined') return;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.spokenLanguage;
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.textInput.setValue(transcript);
        this.isListening = false;
      };
      this.recognition.onerror = () => {
        this.isListening = false;
      };
      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  toggleVoiceInput(): void {
    if (!this.recognition) {
      alert('Speech recognition not supported. Try Chrome!');
      return;
    }
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      this.recognition.lang = this.spokenLanguage;
      this.recognition.start();
      this.isListening = true;
    }
  }

  speakText(): void {
    const text = this.textInput.value?.trim();
    if (!text) {
      alert('Please enter some text first!');
      return;
    }
    if (!this.speechSynthesis) {
      alert('Text-to-speech not supported.');
      return;
    }
    if (this.isSpeaking) {
      this.speechSynthesis.cancel();
      this.isSpeaking = false;
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.spokenLanguage;
    utterance.rate = 0.9;
    utterance.onstart = () => {
      this.isSpeaking = true;
    };
    utterance.onend = () => {
      this.isSpeaking = false;
    };
    utterance.onerror = () => {
      this.isSpeaking = false;
    };
    this.speechSynthesis.speak(utterance);
  }
}
