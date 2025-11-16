"use client";

import { useState } from 'react';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleNavigation = (path) => {
    if (path === 'text-to-sign') {
      window.location.href = 'https://sign-translate-66d69.web.app';
    } else {
      window.location.href = '/sign-to-text';
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated background with particles */}
      <div style={styles.particleBackground}>
        <div style={styles.particle1}></div>
        <div style={styles.particle2}></div>
        <div style={styles.particle3}></div>
      </div>
      
      <div style={styles.content}>
        {/* Navigation Bar */}
        <nav style={styles.navbar}>
          <div style={styles.navLogo}>
            <span style={styles.logoIcon}>🤟</span>
            <span style={styles.brandName}>KheiroVox</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#about" style={styles.navLink}>About</a>
          </div>
        </nav>

        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.badge}>
              <span style={styles.badgeText}>AI-Powered Communication</span>
            </div>
            <h1 style={styles.heroTitle}>
              Welcome to <span style={styles.brandHighlight}>KheiroVox</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Breaking barriers in communication with cutting-edge AI technology.
              <br />
              Translate between sign language and text seamlessly.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div id="features" style={styles.cardsSection}>
          <h2 style={styles.sectionTitle}>Choose Your Translation Mode</h2>
          
          <div style={styles.cardsGrid}>
            {/* Sign to Text Card */}
            <div
              style={{
                ...styles.card,
                ...(hoveredCard === 'sign' ? styles.cardHovered : {})
              }}
              onMouseEnter={() => setHoveredCard('sign')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleNavigation('sign-to-text')}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardIconWrapper}>
                  <span style={styles.cardIcon}>📹</span>
                </div>
                <div style={styles.cardBadge}>Real-time</div>
              </div>
              
              <h3 style={styles.cardTitle}>Sign to Text</h3>
              <p style={styles.cardDescription}>
                Use your webcam to translate American Sign Language (ASL) into written text instantly with our advanced AI recognition system.
              </p>
              
              <div style={styles.cardFeatures}>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>✓</span>
                  <span>Real-time hand tracking</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>✓</span>
                  <span>16+ ASL letters supported</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>✓</span>
                  <span>MediaPipe AI technology</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>✓</span>
                  <span>High accuracy detection</span>
                </div>
              </div>
              
              <button style={styles.cardButton}>
                <span>Launch Translator</span>
                <span style={styles.buttonArrow}>→</span>
              </button>
            </div>

            {/* Text to Sign Card */}
            <div
              style={{
                ...styles.card,
                ...(hoveredCard === 'text' ? styles.cardHovered : {})
              }}
              onMouseEnter={() => setHoveredCard('text')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleNavigation('text-to-sign')}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardIconWrapper}>
                  <span style={styles.cardIcon}>✍</span>
                </div>
                <div style={styles.cardBadge}>Interactive</div>
              </div>
              
              <h3 style={styles.cardTitle}>Text to Sign</h3>
              <p style={styles.cardDescription}>
                Type or speak your message and watch as it's beautifully translated into animated sign language with lifelike movements.
              </p>
              
              <div style={styles.cardFeatures}>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>✓</span>
                  <span>3D skeleton animation</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>✓</span>
                  <span>Multiple sign languages</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>✓</span>
                  <span>Voice input support</span>
                </div>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>✓</span>
                  <span>Text-to-speech playback</span>
                </div>
              </div>
              
              <button style={styles.cardButton}>
                <span>Launch Translator</span>
                <span style={styles.buttonArrow}>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
                    <div style={styles.statCard}>
            <div style={styles.statNumber}>Inspired by Open source</div>
            <div style={styles.statLabel}>sign.mt</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>16+</div>
            <div style={styles.statLabel}>ASL Letters</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>4+</div>
            <div style={styles.statLabel}>Sign Languages</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>95%</div>
            <div style={styles.statLabel}>Accuracy</div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" style={styles.aboutSection}>
          <h2 style={styles.aboutTitle}>Empowering Communication</h2>
          <p style={styles.aboutText}>
            KheiroVox is a cutting-edge platform designed to bridge communication gaps between deaf/hard-of-hearing communities and the hearing world. Using state-of-the-art AI and machine learning, we provide real-time, accurate translation services that make communication accessible to everyone.
          </p>
          
          <div style={styles.techStack}>
            <div style={styles.techTitle}>Powered By:</div>
            <div style={styles.techBadges}>
              <span style={styles.techBadge}>Next.js</span>
              <span style={styles.techBadge}>Angular</span>
              <span style={styles.techBadge}>Flask</span>
              <span style={styles.techBadge}>MediaPipe</span>
              <span style={styles.techBadge}>Python</span>
              <span style={styles.techBadge}>TensorFlow</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerContent}>
            <div style={styles.footerBrand}>
              <span style={styles.footerLogo}>🤟</span>
              <span style={styles.footerBrandName}>KheiroVox</span>
            </div>
            <p style={styles.footerText}>
              Built with ❤ for accessibility and inclusion
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(100px, -100px);
          }
          50% {
            transform: translate(-50px, -200px);
          }
          75% {
            transform: translate(-150px, -100px);
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  particleBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  particle1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    top: '10%',
    left: '10%',
    animation: 'particleFloat 20s infinite ease-in-out',
  },
  particle2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    top: '50%',
    right: '10%',
    animation: 'particleFloat 25s infinite ease-in-out',
  },
  particle3: {
    position: 'absolute',
    width: '250px',
    height: '250px',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    bottom: '10%',
    left: '50%',
    animation: 'particleFloat 30s infinite ease-in-out',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px 0',
    animation: 'slideIn 0.6s ease-out',
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    fontSize: '32px',
  },
  brandName: {
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    gap: '30px',
  },
  navLink: {
    color: '#e2e8f0',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'color 0.3s ease',
    cursor: 'pointer',
  },
  hero: {
    textAlign: 'center',
    padding: '80px 0',
    animation: 'slideIn 0.8s ease-out',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '100px',
    padding: '8px 20px',
    marginBottom: '25px',
  },
  badgeText: {
    color: '#a5b4fc',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  heroTitle: {
    fontSize: '64px',
    fontWeight: '900',
    color: '#f1f5f9',
    marginBottom: '20px',
    lineHeight: '1.2',
    letterSpacing: '-2px',
  },
  brandHighlight: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#cbd5e0',
    lineHeight: '1.8',
    fontWeight: '400',
  },
  cardsSection: {
    padding: '60px 0',
    animation: 'slideIn 1s ease-out',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: '60px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '40px',
  },
  card: {
    background: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
  },
  cardHovered: {
    transform: 'translateY(-12px)',
    boxShadow: '0 20px 60px rgba(99, 102, 241, 0.3)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  cardIconWrapper: {
    width: '70px',
    height: '70px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
  },
  cardIcon: {
    fontSize: '36px',
  },
  cardBadge: {
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#a5b4fc',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '15px',
  },
  cardDescription: {
    fontSize: '16px',
    color: '#cbd5e0',
    lineHeight: '1.7',
    marginBottom: '30px',
  },
  cardFeatures: {
    marginBottom: '30px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    color: '#e2e8f0',
    fontSize: '15px',
  },
  featureIcon: {
    color: '#6366f1',
    fontWeight: '700',
    fontSize: '18px',
  },
  cardButton: {
    width: '100%',
    padding: '18px 32px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
  },
  buttonArrow: {
    fontSize: '20px',
    transition: 'transform 0.3s ease',
  },
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    padding: '60px 0',
    animation: 'slideIn 1.2s ease-out',
  },
  statCard: {
    textAlign: 'center',
    padding: '30px',
    background: 'rgba(30, 41, 59, 0.5)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },
  statNumber: {
    fontSize: '48px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '16px',
    color: '#cbd5e0',
    fontWeight: '500',
  },
  aboutSection: {
    textAlign: 'center',
    padding: '80px 0',
    maxWidth: '900px',
    margin: '0 auto',
    animation: 'slideIn 1.4s ease-out',
  },
  aboutTitle: {
    fontSize: '42px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '25px',
  },
  aboutText: {
    fontSize: '18px',
    color: '#cbd5e0',
    lineHeight: '1.8',
    marginBottom: '50px',
  },
  techStack: {
    marginTop: '40px',
  },
  techTitle: {
    fontSize: '16px',
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: '20px',
  },
  techBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
  },
  techBadge: {
    background: 'rgba(99, 102, 241, 0.15)',
    color: '#a5b4fc',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid rgba(99, 102, 241, 0.2)',
  },
  footer: {
    padding: '40px 0',
    borderTop: '1px solid rgba(148, 163, 184, 0.1)',
    marginTop: '60px',
  },
  footerContent: {
    textAlign: 'center',
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  footerLogo: {
    fontSize: '24px',
  },
  footerBrandName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#f1f5f9',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: '14px',
  },
};