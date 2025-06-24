import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import LandingFeatures from './LandingFeatures';
import LandingAlgorithms from './LandingAlgorithms';

function Typewriter({ text, speed = 40 }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return <span className="typewriter">{displayed}</span>;
}

function SparkleParticles() {
  const ref = useRef();
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const sparkles = Array.from(container.children);
    sparkles.forEach((el, i) => {
      el.animate([
        { transform: `translateY(0px) scale(1)` },
        { transform: `translateY(-30px) scale(1.2)` },
        { transform: `translateY(0px) scale(1)` }
      ], {
        duration: 3000 + i * 400,
        iterations: Infinity,
        delay: i * 300
      });
    });
  }, []);
  return (
    <div className="sparkle-particles" ref={ref}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="sparkle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-bg">
      <SparkleParticles />
      <div className="landing-main-content">
        <div className="landing-card animated-fadein">
          <div className="landing-header">
            <h2 className="landing-main-title">CPU Scheduler</h2>
            <nav className="landing-nav">
              <a href="#algorithms">Algorithms</a>
              <a href="#features">Features</a>
            </nav>
          </div>
          <div className="landing-content">
            <h1 className="landing-title">CPU Scheduling Simulator</h1>
            <div className="landing-tagline">
              <Typewriter text="Visualize. Compare. Learn. Experience CPU scheduling like never before!" speed={30} />
            </div>
            <p className="landing-desc">
              Welcome to the interactive CPU Scheduling Simulator!<br />
              Explore, visualize, and compare classic CPU scheduling algorithms with ease.
            </p>
            <Link to="/simulator">
              <button className="landing-btn interactive-btn">Go to Simulator</button>
            </Link>
          </div>
          <LandingAlgorithms />
          <LandingFeatures />
        </div>
        {/* Animated Neon Bubbles */}
        <div className="bubble bubble1 animated-bubble" />
        <div className="bubble bubble2 animated-bubble" />
        <div className="bubble bubble3 animated-bubble" />
        <div className="bubble bubble4 animated-bubble" />
      </div>
      <footer className="landing-footer">
        <div className="footer-section">
          <h3>About</h3>
          <p>This project is a modern, interactive CPU scheduling simulator for learning and comparison of classic algorithms. Built for students and enthusiasts.</p>
          <p>GitHub: <a href="https://github.com/CypherRohan/Process-Schedular" target="_blank" rel="noopener noreferrer">GitHub Repository</a></p>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <div className="footer-email-grid">
            <div className="footer-email-cell">
              <p>Rohan Saini (UI/UX & Landing Page):<br /><a href="mailto:rohanbijnor1@gmail.com">rohanbijnor1@gmail.com</a></p>
            </div>
            <div className="footer-email-cell">
              <p>Ayush Nainwal (Backend Algorithms):<br /><a href="mailto:ayushnainwal2003@gmail.com">ayushnainwal135@gmail.com</a></p>
            </div>
            <div className="footer-email-cell">
              <p>Harshit Rautela (Backend Components):<br /><a href="mailto:harshitrautela2003@gmail.com">harshitrautela3682@gmail.com</a></p>
            </div>
            <div className="footer-email-cell">
              <p>Himanshu Negi (Backend Algorithms):<br /><a href="mailto:himanshunegi2003@gmail.com">n.himanshunegi88@gmail.com</a></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 