import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { LOW_STOCK_LIMIT } from "../data";
import "../home.css";

const WORDS = ["Schedule", "Track", "Repair", "Restock"];
const FEATURES = [
  ["Aircraft", "Every aircraft, its status and its full history in one place."],
  ["Maintenance schedule", "Plan inspections and see what is due or overdue."],
  ["Work orders", "Assign technicians and follow each job to completion."],
  ["Spare parts", "Live stock levels with low-stock warnings."],
  ["Technicians", "Know who is available and who is loaded with work."],
  ["Dashboard", "One screen with the numbers that matter today."],
];

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv ${seen ? "in" : ""} ${className}`}>{children}</div>;
}

function Counter({ to }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, start;
    const tick = (t) => {
      start ??= t;
      const p = Math.min((t - start) / 1200, 1);
      setN(Math.round(to * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <b>{n}</b>;
}

export default function Home() {
  const { aircraft, workOrders, parts, maintenance } = useData();
  const [word, setWord] = useState(0);
  const [solid, setSolid] = useState(false);
  const [videoOk, setVideoOk] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % WORDS.length), 2200);
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => { clearInterval(id); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div className="home">
      <header className={`hnav ${solid ? "solid" : ""}`}>
        <a href="#top" className="brand">FlightFix</a>
        <nav className="hlinks">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <Link to="/login" className="btn btn-primary">Sign in</Link>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="sky" />
        {videoOk && (
          <video autoPlay muted loop playsInline onError={() => setVideoOk(false)}>
            <source src="/media/hero.mp4" type="video/mp4" />
          </video>
        )}
        {[8, 32, 58, 78].map((top, i) => (
          <div key={i} className="cloud" style={{ top: `${top}%`, animationDuration: `${38 + i * 9}s`, animationDelay: `-${i * 11}s` }} />
        ))}
        <img className="flyer" src="/images/plane.svg" alt="" />
        <div className="hero-copy">
          <div className="eyebrow">Aircraft maintenance management</div>
          <h1><span className="swap" key={word}>{WORDS[word]}</span><br />every aircraft, on time.</h1>
          <p>FlightFix brings schedules, work orders, technicians and spare parts together so aircraft spend less time on the ground.</p>
          <div className="cta">
            <Link to="/login" className="btn-primary btn">Open the dashboard</Link>
            <a href="#features" className="btn-line">See what it does</a>
          </div>
        </div>
      </section>

      <section className="sec">
        <Reveal>
          <h2>Your fleet right now</h2>
          <p className="lead">Live numbers from the system, updated as you work.</p>
          <div className="live">
            <div><Counter to={aircraft.length} />Aircraft</div>
            <div><Counter to={workOrders.filter((w) => w.status !== "Completed").length} />Open work orders</div>
            <div><Counter to={maintenance.length} />Maintenance due</div>
            <div><Counter to={parts.filter((p) => p.quantity < LOW_STOCK_LIMIT).length} />Low stock parts</div>
          </div>
        </Reveal>
      </section>

      <div className="band" id="features">
        <section className="sec">
          <Reveal><h2>Everything maintenance needs</h2><p className="lead">One system replaces the registers and spreadsheets.</p></Reveal>
          <div className="feats">
            {FEATURES.map(([t, d], i) => (
              <Reveal key={t}><div className="feat"><span>0{i + 1}</span><h3>{t}</h3><p>{d}</p></div></Reveal>
            ))}
          </div>
        </section>
      </div>

      <section className="sec split" id="how">
        <Reveal>
          <h2>From inspection to sign-off</h2>
          <ol className="steps">
            <li><b>Schedule</b>Plan the inspection and its due date.</li>
            <li><b>Assign</b>Create a work order for a technician.</li>
            <li><b>Repair</b>Update status and use parts from stock.</li>
            <li><b>Record</b>Completed work goes into the aircraft history.</li>
          </ol>
        </Reveal>
        <Reveal><img src="/images/hangar.svg" alt="Aircraft inside a maintenance hangar" /></Reveal>
      </section>

      <section className="endcta">
        <Reveal><h2>Ready to keep your fleet flying?</h2><Link to="/login" className="btn btn-primary" style={{ background: "#f2a900", color: "#14213d", borderColor: "#f2a900", padding: "12px 28px" }}>Sign in</Link></Reveal>
      </section>
      <footer className="hfoot">FlightFix: Aircraft Maintenance Efficiency</footer>
    </div>
  );
}
