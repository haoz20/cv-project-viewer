import { useEffect, useRef, useState } from 'react';
import ViewerPane from './ViewerPane.jsx';

export default function App() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const interactingRef = useRef(false);
  const lastTimeRef = useRef(performance.now());

  const [bgColor, setBgColor] = useState('#111111');
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [orbitSpeed, setOrbitSpeed] = useState(0.2);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  useEffect(() => {
    let raf;
    function tick() {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      if (autoOrbit && !interactingRef.current) {
        const delta = orbitSpeed * dt;
        leftRef.current?.orbitStep(delta);
        rightRef.current?.orbitStep(delta);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoOrbit, orbitSpeed]);

  function handleInteractingChange(v) {
    interactingRef.current = v;
  }

  function resetCameras() {
    leftRef.current?.resetCamera();
    rightRef.current?.resetCamera();
  }

  return (
    <div id="app">
      <aside className={`panel glass${leftOpen ? '' : ' collapsed'}`} id="leftPanel">
        <div className="panelHeader">
          {leftOpen && <h2>Display</h2>}
          <button
            className="collapseBtn"
            onClick={() => setLeftOpen((v) => !v)}
            aria-label={leftOpen ? 'Hide display panel' : 'Show display panel'}
            title={leftOpen ? 'Hide panel' : 'Show panel'}
          >
            {leftOpen ? '‹' : '›'}
          </button>
        </div>
        {leftOpen && (
          <>
            <div className="field">
              <label htmlFor="bgColor">Background</label>
              <input
                id="bgColor"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>
            <div className="field">
              <ul className="hintList">
                <li>drag = orbit</li>
                <li>scroll = zoom</li>
                <li>right-drag = pan</li>
              </ul>
            </div>
          </>
        )}
      </aside>

      <main id="views">
        <ViewerPane
          ref={leftRef}
          label="Closed lid"
          bgColor={bgColor}
          onInteractingChange={handleInteractingChange}
        />
        <ViewerPane
          ref={rightRef}
          label="Opened lid"
          bgColor={bgColor}
          onInteractingChange={handleInteractingChange}
        />
      </main>

      <aside className={`panel glass${rightOpen ? '' : ' collapsed'}`} id="rightPanel">
        <div className="panelHeader">
          <button
            className="collapseBtn"
            onClick={() => setRightOpen((v) => !v)}
            aria-label={rightOpen ? 'Hide auto-orbit panel' : 'Show auto-orbit panel'}
            title={rightOpen ? 'Hide panel' : 'Show panel'}
          >
            {rightOpen ? '›' : '‹'}
          </button>
          {rightOpen && <h2>Auto-orbit</h2>}
        </div>
        {rightOpen && (
          <>
            <div className="field">
              <label>
                <input
                  type="checkbox"
                  checked={autoOrbit}
                  onChange={(e) => setAutoOrbit(e.target.checked)}
                />
                enabled (both views)
              </label>
            </div>
            <div className="field">
              <div className="row"><span>Speed</span><span>{orbitSpeed.toFixed(2)}</span></div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.05"
                value={orbitSpeed}
                onChange={(e) => setOrbitSpeed(Number(e.target.value))}
              />
            </div>
            <div className="field">
              <button onClick={resetCameras}>Reset cameras</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
