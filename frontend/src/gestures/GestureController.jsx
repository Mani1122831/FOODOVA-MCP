import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  CameraOff, 
  X, 
  HelpCircle,
  Volume2,
  RefreshCw,
  Sparkles,
  MousePointer2,
  ArrowUp,
  ArrowDown,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

export const GestureController = ({ isActive, onClose }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [mediapipeReady, setMediapipeReady] = useState(false);
  const [currentFingerPose, setCurrentFingerPose] = useState('READY');
  const [touchDistancePct, setTouchDistancePct] = useState(100);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100, visible: false, touching: false });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null); // 'UP' | 'DOWN' | null

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const lastActionTimeRef = useRef(0);
  const prevIndexYRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const lastTimestampMsRef = useRef(0);
  const audioCtxRef = useRef(null);
  const isTouchingRef = useRef(false);
  const smoothCursorRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const navigate = useNavigate();

  // Play audio chime
  const playSound = (freq = 700, type = 'sine') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (_) {}
  };

  // Initialize MediaPipe HandLandmarker with robust GPU -> CPU fallback
  useEffect(() => {
    let isCancelled = false;

    const initMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm'
        );
        if (isCancelled) return;

        let handLandmarker;
        try {
          // Attempt 1: High performance GPU delegate
          handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'GPU'
            },
            runningMode: 'VIDEO',
            numHands: 1
          });
        } catch (gpuErr) {
          console.warn('GPU delegate unavailable, falling back to CPU delegate:', gpuErr);
          // Attempt 2: Universal CPU delegate
          handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'CPU'
            },
            runningMode: 'VIDEO',
            numHands: 1
          });
        }

        if (isCancelled) return;
        landmarkerRef.current = handLandmarker;
        setMediapipeReady(true);
        console.log('✅ MediaPipe HandLandmarker ready for finger gesture detection');
      } catch (err) {
        console.warn('MediaPipe initialization fallback to optical detector:', err.message);
        setMediapipeReady(false);
      }
    };

    initMediaPipe();

    return () => {
      isCancelled = true;
      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch (_) {}
        landmarkerRef.current = null;
      }
    };
  }, []);

  // Camera stream lifecycle
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(e => console.warn('Video play caught:', e));
            if (canvasRef.current && videoRef.current.videoWidth) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          }
          setCameraActive(true);
          toast.success('Camera active! 👆 Finger up/down scrolls • ✌️ 2 fingers touch clicks!', { duration: 4000 });
          startFingerDetectionLoop();
        };
      } else {
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError(err.message || 'Camera permission required.');
      setCameraActive(false);
      toast('Camera unavailable. Interactive finger controls ready below.', { icon: '👆' });
    }
  };

  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCursorPos({ x: -100, y: -100, visible: false, touching: false });
    clearAllHighlights();
  };

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isActive]);

  // Main Detection Loop with Monotonic Timestamp Protection
  const startFingerDetectionLoop = () => {
    const loop = () => {
      if (!streamRef.current || !videoRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState >= 2 && canvas) {
        // Sync canvas resolution to video
        if (video.videoWidth && canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Process frame if video currentTime has updated
        if (landmarkerRef.current && video.currentTime > 0 && video.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = video.currentTime;
          
          // Guarantee strictly increasing timestamp for MediaPipe
          const now = performance.now();
          const timestamp = now > lastTimestampMsRef.current ? now : (lastTimestampMsRef.current + 1);
          lastTimestampMsRef.current = timestamp;

          try {
            const results = landmarkerRef.current.detectForVideo(video, timestamp);
            if (results && results.landmarks && results.landmarks.length > 0) {
              const landmarks = results.landmarks[0];
              processFingerGestures(landmarks, ctx, canvas.width, canvas.height);
            } else {
              setCursorPos(prev => ({ ...prev, visible: false }));
              setCurrentFingerPose('READY');
              setScrollDirection(null);
            }
          } catch (e) {
            // Timestamp collision protected
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
  };

  // Core Finger Gesture Recognition
  // Spec:
  // 1. Two Fingers Touch -> CLICK
  // 2. One Finger Up -> SCROLL UP
  // 3. One Finger Down -> SCROLL DOWN
  // 4. One Finger Steady -> AIM / MOVE VIRTUAL CURSOR
  const processFingerGestures = (landmarks, ctx, width, height) => {
    // Key landmarks:
    // 0: Wrist
    // 4: Thumb Tip
    // 6: Index PIP, 8: Index Tip
    // 10: Middle PIP, 12: Middle Tip
    // 14: Ring PIP, 16: Ring Tip
    // 18: Pinky PIP, 20: Pinky Tip

    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const indexPip = landmarks[6];
    const middleTip = landmarks[12];
    const middlePip = landmarks[10];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    // Draw visual joint skeleton on HUD
    drawFingerSkeleton(landmarks, ctx, width, height);

    // ── Coordinate Mapping & Smoothing (Mirror X for natural interaction) ──
    const mirrorIndexX = 1 - indexTip.x;
    const targetScreenX = mirrorIndexX * window.innerWidth;
    const targetScreenY = indexTip.y * window.innerHeight;

    // Exponential smoothing to eliminate camera jitter
    smoothCursorRef.current.x = smoothCursorRef.current.x * 0.6 + targetScreenX * 0.4;
    smoothCursorRef.current.y = smoothCursorRef.current.y * 0.7 + targetScreenY * 0.3;
    const screenX = smoothCursorRef.current.x;
    const screenY = smoothCursorRef.current.y;

    // Extension state of individual fingers
    const isIndexExtended = indexTip.y < indexPip.y;
    const isMiddleExtended = middleTip.y < middlePip.y;
    const isRingExtended = ringTip.y < landmarks[14].y;
    const isPinkyExtended = pinkyTip.y < landmarks[18].y;

    // ── TWO FINGER TOUCH DETECTION ────────────────────────────────────
    // 1) Thumb Tip touches Index Tip (Pinch)
    const distThumbIndex = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
    // 2) Index Tip touches Middle Tip (Two fingers brought together)
    const distIndexMiddle = Math.hypot(indexTip.x - middleTip.x, indexTip.y - middleTip.y);

    // Calculate proximity percent for HUD meter
    const bestTouchDist = Math.min(distThumbIndex, distIndexMiddle);
    const touchPct = Math.min(100, Math.round((bestTouchDist / 0.16) * 100));
    setTouchDistancePct(touchPct);

    // Touching condition: generous threshold for effortless activation
    const isTouching = distThumbIndex < 0.08 || (isMiddleExtended && distIndexMiddle < 0.065);

    const now = Date.now();

    // ──────────────────────────────────────────────────────────────────
    // GESTURE 1: TWO FINGERS TOUCH -> CLICK
    // ──────────────────────────────────────────────────────────────────
    if (isTouching) {
      setCurrentFingerPose('✨ TWO FINGERS TOUCH (CLICK)');
      setScrollDirection(null);
      setCursorPos({ x: screenX, y: screenY, visible: true, touching: true });

      // Visual touch indicator on canvas
      ctx.beginPath();
      ctx.arc((1 - indexTip.x) * width, indexTip.y * height, 16, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (!isTouchingRef.current && (now - lastActionTimeRef.current > 380)) {
        isTouchingRef.current = true;
        lastActionTimeRef.current = now;
        playSound(950, 'triangle');

        // Click element under virtual cursor
        executeFingerClickAt(screenX, screenY);
      }
      return;
    } else {
      isTouchingRef.current = false;
    }

    // ──────────────────────────────────────────────────────────────────
    // GESTURE 2: ONE FINGER UP -> SCROLL UP  /  ONE FINGER DOWN -> SCROLL DOWN
    // Only index finger extended (other fingers folded)
    // ──────────────────────────────────────────────────────────────────
    if (isIndexExtended && !isRingExtended && !isPinkyExtended) {
      const currentY = indexTip.y;
      
      // Calculate vertical delta if we have previous frame
      let deltaY = 0;
      if (prevIndexYRef.current !== null) {
        deltaY = currentY - prevIndexYRef.current;
      }
      prevIndexYRef.current = currentY;

      // Condition A: Moving finger UP (deltaY < -0.01) OR finger held in TOP 36% zone
      const isMovingUp = deltaY < -0.012;
      const isInTopZone = currentY < 0.36;

      // Condition B: Moving finger DOWN (deltaY > 0.01) OR finger held in BOTTOM 36% zone
      const isMovingDown = deltaY > 0.012;
      const isInBottomZone = currentY > 0.64;

      if (isMovingUp || isInTopZone) {
        setCurrentFingerPose('👆 ONE FINGER UP (SCROLL UP)');
        setScrollDirection('UP');
        setCursorPos(prev => ({ ...prev, visible: false }));

        // Scroll page up smoothly
        const scrollAmount = isMovingUp ? Math.abs(deltaY) * 2200 : 28;
        window.scrollBy({ top: -Math.max(22, scrollAmount), behavior: 'auto' });

        if (now - lastActionTimeRef.current > 260) {
          playSound(620, 'sine');
          lastActionTimeRef.current = now;
        }
        return;
      } else if (isMovingDown || isInBottomZone) {
        setCurrentFingerPose('👇 ONE FINGER DOWN (SCROLL DOWN)');
        setScrollDirection('DOWN');
        setCursorPos(prev => ({ ...prev, visible: false }));

        // Scroll page down smoothly
        const scrollAmount = isMovingDown ? deltaY * 2200 : 28;
        window.scrollBy({ top: Math.max(22, scrollAmount), behavior: 'auto' });

        if (now - lastActionTimeRef.current > 260) {
          playSound(480, 'sine');
          lastActionTimeRef.current = now;
        }
        return;
      } else {
        // Finger is in center zone -> AIM / POINT with virtual cursor
        setCurrentFingerPose('🎯 ONE FINGER (AIM & POINT)');
        setScrollDirection(null);
        setCursorPos({ x: screenX, y: screenY, visible: true, touching: false });
        highlightElementAt(screenX, screenY);
        return;
      }
    } else {
      prevIndexYRef.current = null;
      setScrollDirection(null);
      setCurrentFingerPose('READY');
      setCursorPos(prev => ({ ...prev, visible: false }));
    }
  };

  // Draw 21-joint skeleton with glowing lines & touch link
  const drawFingerSkeleton = (landmarks, ctx, w, h) => {
    const fingers = [
      [0, 1, 2, 3, 4],       // Thumb
      [0, 5, 6, 7, 8],       // Index
      [0, 9, 10, 11, 12],    // Middle
      [0, 13, 14, 15, 16],   // Ring
      [0, 17, 18, 19, 20]    // Pinky
    ];

    ctx.save();
    ctx.lineWidth = 2.5;

    // Draw finger chains
    fingers.forEach((finger, fIdx) => {
      ctx.beginPath();
      ctx.strokeStyle = fIdx === 1 ? '#F59E0B' : '#10B981'; // Gold for index, Emerald for others

      finger.forEach((ptIdx, i) => {
        const pt = landmarks[ptIdx];
        const x = (1 - pt.x) * w;
        const y = pt.y * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    // Draw joint nodes
    landmarks.forEach((pt, idx) => {
      const x = (1 - pt.x) * w;
      const y = pt.y * h;

      ctx.beginPath();
      if (idx === 8) {
        ctx.arc(x, y, 7.5, 0, Math.PI * 2);
        ctx.fillStyle = '#F59E0B'; // Index Tip
      } else if (idx === 4) {
        ctx.arc(x, y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = '#EF4444'; // Thumb Tip
      } else if (idx === 12) {
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#3B82F6'; // Middle Tip
      } else {
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#34D399';
      }
      ctx.fill();
    });

    // Draw active touch connection line
    const t4 = landmarks[4];
    const i8 = landmarks[8];
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 2;
    ctx.moveTo((1 - t4.x) * w, t4.y * h);
    ctx.lineTo((1 - i8.x) * w, i8.y * h);
    ctx.stroke();

    ctx.restore();
  };

  // Execute click at virtual cursor position
  const executeFingerClickAt = (x, y) => {
    clearAllHighlights();
    const el = document.elementFromPoint(x, y);
    if (el) {
      const clickable = el.closest('button, a, input, [role="button"], .cursor-pointer') || el;
      clickable.click();
      toast.success('✨ Clicked with Two Fingers Touch!', { id: 'finger-click-toast', duration: 1400 });

      // Click ripple visual effect
      clickable.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
      clickable.style.transform = 'scale(0.95)';
      clickable.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.8)';
      setTimeout(() => {
        clickable.style.transform = '';
        clickable.style.boxShadow = '';
      }, 160);
    }
  };

  // Highlight interactive element under virtual cursor
  const highlightElementAt = (x, y) => {
    clearAllHighlights();
    const el = document.elementFromPoint(x, y);
    if (el) {
      const target = el.closest('button, a, input, [role="button"], .cursor-pointer');
      if (target) {
        target.setAttribute('data-finger-hovered', 'true');
        target.style.outline = '3px solid #F59E0B';
        target.style.outlineOffset = '2px';
        target.style.borderRadius = '16px';
      }
    }
  };

  const clearAllHighlights = () => {
    document.querySelectorAll('[data-finger-hovered]').forEach(el => {
      el.removeAttribute('data-finger-hovered');
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
  };

  // Manual Trigger for Fingers Simulator
  const triggerManualAction = (type) => {
    playSound(800, 'sine');
    switch (type) {
      case 'TWO_FINGER_TOUCH': {
        const target = document.querySelector('button.bg-amber-400, button.bg-brand-500, main button, #explore-menu-btn');
        if (target) {
          target.click();
          toast.success('✨ Two Fingers Touch: Clicked Item!');
        } else {
          toast.success('✨ Two Fingers Touch Registered!');
        }
        break;
      }
      case 'ONE_FINGER_UP': {
        window.scrollBy({ top: -380, behavior: 'smooth' });
        toast('👆 One Finger Up: Scrolled Up');
        break;
      }
      case 'ONE_FINGER_DOWN': {
        window.scrollBy({ top: 380, behavior: 'smooth' });
        toast('👇 One Finger Down: Scrolled Down');
        break;
      }
      case 'THUMB_UP': {
        const addBtn = document.querySelector('button:has(svg), button.bg-amber-400, button.bg-brand-500');
        if (addBtn) {
          addBtn.click();
          toast.success('👍 Thumb Up: Added to Cart!');
        }
        break;
      }
      case 'MENU': {
        navigate('/menu?category=burgers');
        toast('🍔 Pointed to Gourmet Burgers!');
        break;
      }
      default:
        break;
    }
  };

  if (!isActive) return null;

  return (
    <>
      {/* ── Virtual Floating Finger Laser Cursor ─────────────────── */}
      {cursorPos.visible && (
        <div
          style={{
            transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
            transition: 'transform 0.04s ease-out'
          }}
          className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        >
          {/* Glowing Target Ring */}
          <div className={`relative flex items-center justify-center transition-all ${
            cursorPos.touching ? 'scale-125' : 'scale-100'
          }`}>
            <div className={`w-9 h-9 rounded-full border-2 ${
              cursorPos.touching ? 'border-amber-400 bg-amber-400/40 animate-ping' : 'border-emerald-400 bg-emerald-400/20 shadow-lg'
            }`} />
            <div className={`w-3.5 h-3.5 rounded-full absolute shadow-lg ${
              cursorPos.touching ? 'bg-amber-400' : 'bg-emerald-400'
            }`} />
            <MousePointer2 className="w-4 h-4 text-white absolute -bottom-4 -right-4 drop-shadow-md" />
          </div>
        </div>
      )}

      {/* ── Fullscreen Scroll Direction Splash Overlay ───────────── */}
      <AnimatePresence>
        {scrollDirection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`fixed right-10 top-1/2 -translate-y-1/2 z-[999] pointer-events-none p-4 rounded-3xl backdrop-blur-xl border flex flex-col items-center gap-1 shadow-2xl ${
              scrollDirection === 'UP' 
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' 
                : 'bg-blue-950/80 border-blue-500/50 text-blue-300'
            }`}
          >
            {scrollDirection === 'UP' ? (
              <>
                <ArrowUp className="w-8 h-8 animate-bounce text-emerald-400" />
                <span className="text-xs font-black tracking-wider uppercase">Scrolling Up</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-8 h-8 animate-bounce text-blue-400" />
                <span className="text-xs font-black tracking-wider uppercase">Scrolling Down</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Hands-Free Overlay Indicator ─────────────────── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="fixed top-20 right-4 sm:right-6 z-50 bg-dark-900/95 backdrop-blur-xl text-white p-4 rounded-3xl shadow-2xl border border-amber-500/50 w-80 sm:w-88 select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dark-800">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Finger Motion AI
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded-full">
                  Fingers Only
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block">
                2 fingers touch = click • 1 finger = scroll
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
              className={`p-1.5 rounded-xl transition-colors ${soundEnabled ? 'bg-amber-500/20 text-amber-400' : 'bg-dark-800 text-gray-500'}`}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="p-1.5 rounded-xl bg-dark-800 text-gray-300 hover:text-white transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-dark-800 hover:bg-rose-500/30 text-gray-300 hover:text-rose-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Camera Box + 21-Joint Finger Skeleton Canvas */}
        <div className="relative mt-3 rounded-2xl overflow-hidden bg-dark-950 border border-dark-700 h-44 flex items-center justify-center shadow-inner">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${cameraActive ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}
          />

          {/* Real-time 21-Joint Finger Skeleton Canvas */}
          <canvas
            ref={canvasRef}
            width={320}
            height={240}
            className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${cameraActive ? 'block' : 'hidden'}`}
          />

          {/* Camera offline/connecting fallback */}
          {!cameraActive && (
            <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 z-10">
              <CameraOff className="w-7 h-7 text-amber-500/80 animate-pulse" />
              <p className="text-xs text-gray-300 font-semibold">
                {cameraError ? 'Camera permission needed' : 'Starting camera stream...'}
              </p>
              <button
                onClick={startCamera}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-dark-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3 h-3" />
                Retry Camera
              </button>
            </div>
          )}

          {/* Live Finger Pose Floating Badge */}
          <div className="absolute bottom-2 left-2 z-20 bg-dark-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{currentFingerPose}</span>
          </div>

          {/* Real-time Touch Meter */}
          <div className="absolute top-2 right-2 z-20 bg-dark-900/85 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-gray-300 border border-dark-700 flex items-center gap-1.5">
            <span>Touch:</span>
            <div className="w-12 h-1.5 bg-dark-800 rounded-full overflow-hidden">
              <div 
                style={{ width: `${Math.max(5, 100 - touchDistancePct)}%` }}
                className={`h-full transition-all duration-75 ${
                  touchDistancePct < 30 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Action Controls for Quick Testing */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Finger Gestures:
            </span>
            <span className="text-[10px] text-amber-400 font-mono">Fingers Only</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            <button
              onClick={() => triggerManualAction('TWO_FINGER_TOUCH')}
              className="p-2 rounded-xl bg-dark-800 hover:bg-amber-500 hover:text-dark-950 font-bold text-gray-200 transition-all flex items-center justify-center gap-1 border border-dark-700 hover:border-amber-400"
            >
              ✨ 2-Finger Touch
            </button>
            <button
              onClick={() => triggerManualAction('ONE_FINGER_UP')}
              className="p-2 rounded-xl bg-dark-800 hover:bg-emerald-500 hover:text-white font-bold text-gray-200 transition-all flex items-center justify-center gap-1 border border-dark-700 hover:border-emerald-400"
            >
              👆 Finger Up
            </button>
            <button
              onClick={() => triggerManualAction('ONE_FINGER_DOWN')}
              className="p-2 rounded-xl bg-dark-800 hover:bg-blue-500 hover:text-white font-bold text-gray-200 transition-all flex items-center justify-center gap-1 border border-dark-700 hover:border-blue-400"
            >
              👇 Finger Down
            </button>
            <button
              onClick={() => triggerManualAction('THUMB_UP')}
              className="p-2 rounded-xl bg-dark-800 hover:bg-amber-500 hover:text-dark-950 font-bold text-gray-200 transition-all flex items-center justify-center gap-1 border border-dark-700 hover:border-amber-400"
            >
              👍 Thumb Up
            </button>
            <button
              onClick={() => triggerManualAction('MENU')}
              className="p-2 rounded-xl bg-dark-800 hover:bg-orange-500 hover:text-white font-bold text-gray-200 transition-all flex items-center justify-center gap-1 border border-dark-700 hover:border-orange-400 col-span-2"
            >
              🍔 Open 24 Burgers
            </button>
          </div>
        </div>

        {/* Finger Movement Guide */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t border-dark-800 text-[11px] text-gray-300 space-y-2 overflow-hidden"
            >
              <div className="flex justify-between items-center">
                <span>✌️ <strong>Two Fingers Touch:</strong></span>
                <span className="text-amber-400 font-bold">Clicks Targeted Item</span>
              </div>
              <div className="flex justify-between items-center">
                <span>👆 <strong>One Finger Up:</strong></span>
                <span className="text-emerald-400 font-bold">Scrolls Page Up ⬆️</span>
              </div>
              <div className="flex justify-between items-center">
                <span>👇 <strong>One Finger Down:</strong></span>
                <span className="text-blue-400 font-bold">Scrolls Page Down ⬇️</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🎯 <strong>One Finger Steady:</strong></span>
                <span className="text-amber-300 font-bold">Aims Laser Pointer</span>
              </div>
              <div className="flex justify-between items-center">
                <span>👍 <strong>Thumb Up:</strong></span>
                <span className="text-emerald-400 font-bold">Add to Cart</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default GestureController;
