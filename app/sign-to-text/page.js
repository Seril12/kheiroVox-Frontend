"use client";

import { useEffect, useRef, useState } from 'react';

export default function SignToText() {
  const videoRef = useRef(null);
  const [gesture, setGesture] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
      setIsCameraActive(true);
      initMediaPipe();
    } catch (err) {
      console.error('Camera permission denied:', err);
      setCameraPermission('denied');
      alert('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    if (handsRef.current) {
      handsRef.current.close();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
    setGesture('Camera stopped');
  };

  const initMediaPipe = async () => {
    try {
      const { Hands } = await import('@mediapipe/hands');
      const { Camera } = await import('@mediapipe/camera_utils');

      function detectGesture(landmarks) {
        const thumbUp = landmarks[4].y < landmarks[3].y;
        const indexUp = landmarks[8].y < landmarks[6].y;
        const middleUp = landmarks[12].y < landmarks[10].y;
        const ringUp = landmarks[16].y < landmarks[14].y;
        const pinkyUp = landmarks[20].y < landmarks[18].y;

        // 👍 THUMBS UP
        if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
          return 'THUMBS UP';
        }

        // 👋 HELLO
        if (indexUp && middleUp && ringUp && pinkyUp) {
          return 'HELLO';
        }

        return null;
      }

      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      hands.onResults((results) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks[0]) {
          const detected = detectGesture(results.multiHandLandmarks[0]);
          if (detected) {
            setGesture(detected);
            if (detected !== translatedText) {
              setTranslatedText(prev => prev ? `${prev} ${detected}` : detected);
            }
          } else {
            setGesture('Show a gesture');
          }
        } else {
          setGesture('No hand detected');
        }
      });

      handsRef.current = hands;

      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await hands.send({ image: videoRef.current });
          },
          width: 640,
          height: 480,
        });

        cameraRef.current = camera;
        await camera.start();
        setGesture('Show a gesture');
      }
    } catch (err) {
      console.error('MediaPipe initialization error:', err);
      setGesture('Initialization error');
    }
  };

  const clearText = () => {
    setTranslatedText('');
  };

  const readAloud = () => {
    if (translatedText) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (handsRef.current) handsRef.current.close();
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Back Button */}
        <button 
          onClick={() => window.location.href = '/'} 
          style={styles.backButton}
          onMouseEnter={(e) => e.target.style.background = 'rgba(99, 102, 241, 0.3)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(99, 102, 241, 0.2)'}
        >
          ← Back to Home
        </button>

        <div style={styles.grid}>
          {/* Left Panel - Camera Input */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Camera Input</h2>
            </div>

            <div style={styles.languageSelector}>
              <label style={styles.label}>From:</label>
              <select style={styles.select}>
                <option>American Sign Language (ASL)</option>
              </select>
            </div>

            {/* Video Container */}
            <div style={styles.videoWrapper}>
              {isCameraActive ? (
                <div style={styles.videoContainer}>
                  <video ref={videoRef} autoPlay playsInline style={styles.video} />
                  <div style={styles.gestureOverlay}>
                    <span style={styles.gestureText}>{gesture}</span>
                  </div>
                </div>
              ) : (
                <div style={styles.placeholderContainer}>
                  <div style={styles.placeholderIcon}>📹</div>
                  <p style={styles.placeholderText}>Camera is off</p>
                  <p style={styles.placeholderSubtext}>Click "Open Camera" to start</p>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div style={styles.buttonGroup}>
              {!isCameraActive ? (
                <button 
                  onClick={startCamera}
                  style={styles.primaryButton}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  📹 Open Camera
                </button>
              ) : (
                <button 
                  onClick={stopCamera}
                  style={styles.dangerButton}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.3)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                >
                  ⏹ Stop Camera
                </button>
              )}
            </div>

            {/* Gesture Guide */}
            <div style={styles.gestureGuide}>
              <div style={styles.guideTitle}>💡 Supported Gestures:</div>
              <div style={styles.gestureCards}>
                <div style={styles.gestureCard}>
                  <span style={styles.gestureEmoji}>👍</span>
                  <span style={styles.gestureName}>Thumbs Up</span>
                </div>
                <div style={styles.gestureCard}>
                  <span style={styles.gestureEmoji}>👋</span>
                  <span style={styles.gestureName}>Hello</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Text Output */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Translated Text</h2>
            </div>

            <div style={styles.languageSelector}>
              <label style={styles.label}>To:</label>
              <select style={styles.select}>
                <option>English</option>
              </select>
            </div>

            {/* Output Text Area */}
            <div style={styles.outputWrapper}>
              <div style={styles.outputContainer}>
                {translatedText ? (
                  <p style={styles.outputText}>{translatedText}</p>
                ) : (
                  <div style={styles.outputPlaceholder}>
                    <div style={styles.outputIcon}>✋</div>
                    <p style={styles.outputPlaceholderText}>
                      Translation will appear here
                    </p>
                    <p style={styles.outputPlaceholderSubtext}>
                      Show gestures to the camera to translate
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Output Controls */}
            <div style={styles.buttonGroup}>
              <button 
                onClick={readAloud}
                disabled={!translatedText}
                style={{
                  ...styles.secondaryButton,
                  ...(translatedText ? {} : styles.disabledButton)
                }}
                onMouseEnter={(e) => translatedText && (e.target.style.background = 'rgba(99, 102, 241, 0.3)')}
                onMouseLeave={(e) => translatedText && (e.target.style.background = 'rgba(99, 102, 241, 0.2)')}
              >
                🔊 Read Aloud
              </button>
              <button 
                onClick={clearText}
                disabled={!translatedText}
                style={{
                  ...styles.secondaryButton,
                  ...(translatedText ? {} : styles.disabledButton)
                }}
                onMouseEnter={(e) => translatedText && (e.target.style.background = 'rgba(99, 102, 241, 0.3)')}
                onMouseLeave={(e) => translatedText && (e.target.style.background = 'rgba(99, 102, 241, 0.2)')}
              >
                🗑 Clear
              </button>
            </div>

            <div style={styles.hint}>
              <span style={styles.hintIcon}>💡</span>
              <span style={styles.hintText}>
                Translation updates in real-time as you perform gestures
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    padding: '20px',
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  backButton: {
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#a5b4fc',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '30px',
    transition: 'all 0.3s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '30px',
  },
  panel: {
    background: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '30px',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },
  panelHeader: {
    marginBottom: '25px',
  },
  panelTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#f1f5f9',
    margin: 0,
  },
  languageSelector: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '15px',
    cursor: 'pointer',
    outline: 'none',
  },
  videoWrapper: {
    marginBottom: '20px',
  },
  videoContainer: {
    position: 'relative',
    background: '#000',
    borderRadius: '16px',
    overflow: 'hidden',
    aspectRatio: '4/3',
  },
  video: {
    width: '100%',
    height: '100%',
    display: 'block',
    transform: 'scaleX(-1)',
  },
  gestureOverlay: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: '12px 24px',
    borderRadius: '30px',
    border: '1px solid rgba(99, 102, 241, 0.5)',
  },
  gestureText: {
    color: '#a5b4fc',
    fontSize: '16px',
    fontWeight: '700',
  },
  placeholderContainer: {
    background: 'rgba(15, 23, 42, 0.6)',
    border: '2px dashed rgba(148, 163, 184, 0.3)',
    borderRadius: '16px',
    padding: '80px 40px',
    textAlign: 'center',
    aspectRatio: '4/3',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  placeholderText: {
    color: '#cbd5e0',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  },
  placeholderSubtext: {
    color: '#64748b',
    fontSize: '14px',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  primaryButton: {
    flex: 1,
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
  },
  dangerButton: {
    flex: 1,
    padding: '14px 24px',
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    flex: 1,
    padding: '14px 24px',
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#a5b4fc',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  gestureGuide: {
    background: 'rgba(15, 23, 42, 0.4)',
    borderRadius: '12px',
    padding: '20px',
  },
  guideTitle: {
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '15px',
  },
  gestureCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  gestureCard: {
    background: 'rgba(30, 41, 59, 0.6)',
    padding: '15px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },
  gestureEmoji: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '8px',
  },
  gestureName: {
    color: '#cbd5e0',
    fontSize: '13px',
    fontWeight: '600',
  },
  outputWrapper: {
    marginBottom: '20px',
  },
  outputContainer: {
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '16px',
    padding: '30px',
    minHeight: '300px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  outputText: {
    color: '#e2e8f0',
    fontSize: '18px',
    lineHeight: '1.8',
    margin: 0,
  },
  outputPlaceholder: {
    textAlign: 'center',
    paddingTop: '60px',
  },
  outputIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  outputPlaceholderText: {
    color: '#cbd5e0',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  },
  outputPlaceholderSubtext: {
    color: '#64748b',
    fontSize: '14px',
    margin: 0,
  },
  hint: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(99, 102, 241, 0.1)',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(99, 102, 241, 0.2)',
  },
  hintIcon: {
    fontSize: '18px',
  },
  hintText: {
    color: '#94a3b8',
    fontSize: '13px',
    fontStyle: 'italic',
  },
};