import React, { useState, useEffect } from 'react';
import { forwardRef, useImperativeHandle, useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import './LandingPage.css';
import { useNavigate } from "react-router-dom";
import { auth } from './firebase';

// Utility function for extending materials
function extendMaterial(BaseMaterial, cfg) {
  const physical = THREE.ShaderLib.physical;
  const {
    vertexShader: baseVert,
    fragmentShader: baseFrag,
    uniforms: baseUniforms,
  } = physical;
  const baseDefines = physical.defines ?? {};

  const uniforms = THREE.UniformsUtils.clone(baseUniforms);
  const defaults = new BaseMaterial(cfg.material || {});

  if (defaults.color) uniforms.diffuse.value = defaults.color;
  if ("roughness" in defaults) uniforms.roughness.value = defaults.roughness;
  if ("metalness" in defaults) uniforms.metalness.value = defaults.metalness;
  if ("envMap" in defaults) uniforms.envMap.value = defaults.envMap;
  if ("envMapIntensity" in defaults)
    uniforms.envMapIntensity.value = defaults.envMapIntensity;

  Object.entries(cfg.uniforms ?? {}).forEach(([key, u]) => {
    uniforms[key] =
      u !== null && typeof u === "object" && "value" in u
        ? u
        : { value: u };
  });

  let vert = `${cfg.header}\n${cfg.vertexHeader ?? ""}\n${baseVert}`;
  let frag = `${cfg.header}\n${cfg.fragmentHeader ?? ""}\n${baseFrag}`;

  for (const [inc, code] of Object.entries(cfg.vertex ?? {})) {
    vert = vert.replace(inc, `${inc}\n${code}`);
  }
  for (const [inc, code] of Object.entries(cfg.fragment ?? {})) {
    frag = frag.replace(inc, `${inc}\n${code}`);
  }

  const mat = new THREE.ShaderMaterial({
    defines: { ...baseDefines },
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    lights: true,
    fog: !!cfg.material?.fog,
  });

  return mat;
}

// Canvas wrapper component
const CanvasWrapper = ({ children }) => (
  <Canvas 
    dpr={[1, 2]} 
    frameloop="always" 
    className="canvas-background"
  >
    {children}
  </Canvas>
);

// Utility functions
const hexToNormalizedRGB = (hex) => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r / 255, g / 255, b / 255];
};

// Shader noise functions
const noise = `
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
           (c - a)* u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x,Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy,Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2 * n_xyz;
}
`;

// Beams component with improved parameters
const Beams = ({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = "#FFD700",
  speed = 1.5,
  noiseIntensity = 1.2,
  scale = 0.15,
  rotation = 0,
}) => {
  const meshRef = useRef(null);
  const beamMaterial = useMemo(
    () =>
      extendMaterial(THREE.MeshStandardMaterial, {
        header: `
  varying vec3 vEye;
  varying float vNoise;
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  uniform float uSpeed;
  uniform float uNoiseIntensity;
  uniform float uScale;
  ${noise}`,
        vertexHeader: `
  float getPos(vec3 pos) {
    vec3 noisePos =
      vec3(pos.x * 0., pos.y - uv.y, pos.z + time * uSpeed * 3.) * uScale;
    return cnoise(noisePos);
  }
  vec3 getCurrentPos(vec3 pos) {
    vec3 newpos = pos;
    newpos.z += getPos(pos);
    return newpos;
  }
  vec3 getNormal(vec3 pos) {
    vec3 curpos = getCurrentPos(pos);
    vec3 nextposX = getCurrentPos(pos + vec3(0.01, 0.0, 0.0));
    vec3 nextposZ = getCurrentPos(pos + vec3(0.0, -0.01, 0.0));
    vec3 tangentX = normalize(nextposX - curpos);
    vec3 tangentZ = normalize(nextposZ - curpos);
    return normalize(cross(tangentZ, tangentX));
  }`,
        fragmentHeader: "",
        vertex: {
          "#include <begin_vertex>": `transformed.z += getPos(transformed.xyz);`,
          "#include <beginnormal_vertex>": `objectNormal = getNormal(position.xyz);`,
        },
        fragment: {
          "#include <dithering_fragment>": `
    float randomNoise = noise(gl_FragCoord.xy);
    gl_FragColor.rgb -= randomNoise / 15. * uNoiseIntensity;`,
        },
        material: { fog: true },
        uniforms: {
          diffuse: new THREE.Color(...hexToNormalizedRGB("#1a1a1a")),
          time: { shared: true, mixed: true, linked: true, value: 0 },
          roughness: 0.2,
          metalness: 0.8,
          uSpeed: { shared: true, mixed: true, linked: true, value: speed },
          envMapIntensity: 15,
          uNoiseIntensity: noiseIntensity,
          uScale: scale,
        },
      }),
    [speed, noiseIntensity, scale]
  );

  return (
    <CanvasWrapper>
      <group rotation={[0, 0, degToRad(rotation)]}>
        <PlaneNoise
          ref={meshRef}
          material={beamMaterial}
          count={beamNumber}
          width={beamWidth}
          height={beamHeight}
        />
        <DirLight color={lightColor} position={[0, 3, 10]} />
      </group>
      <ambientLight intensity={0.3} />
      <color attach="background" args={["#000000"]} />
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={30} />
    </CanvasWrapper>
  );
};

// Geometry creation function
function createStackedPlanesBufferGeometry(
  n,
  width,
  height,
  spacing,
  heightSegments
) {
  const geometry = new THREE.BufferGeometry();
  const numVertices = n * (heightSegments + 1) * 2;
  const numFaces = n * heightSegments * 2;
  const positions = new Float32Array(numVertices * 3);
  const indices = new Uint32Array(numFaces * 3);
  const uvs = new Float32Array(numVertices * 2);

  let vertexOffset = 0;
  let indexOffset = 0;
  let uvOffset = 0;
  const totalWidth = n * width + (n - 1) * spacing;
  const xOffsetBase = -totalWidth / 2;

  for (let i = 0; i < n; i++) {
    const xOffset = xOffsetBase + i * (width + spacing);
    const uvXOffset = Math.random() * 300;
    const uvYOffset = Math.random() * 300;

    for (let j = 0; j <= heightSegments; j++) {
      const y = height * (j / heightSegments - 0.5);
      const v0 = [xOffset, y, 0];
      const v1 = [xOffset + width, y, 0];
      positions.set([...v0, ...v1], vertexOffset * 3);

      const uvY = j / heightSegments;
      uvs.set(
        [uvXOffset, uvY + uvYOffset, uvXOffset + 1, uvY + uvYOffset],
        uvOffset
      );

      if (j < heightSegments) {
        const a = vertexOffset,
          b = vertexOffset + 1,
          c = vertexOffset + 2,
          d = vertexOffset + 3;
        indices.set([a, b, c, c, b, d], indexOffset);
        indexOffset += 6;
      }
      vertexOffset += 2;
      uvOffset += 4;
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  return geometry;
}

// MergedPlanes component
const MergedPlanes = forwardRef(({ material, width, count, height }, ref) => {
  const mesh = useRef(null);
  useImperativeHandle(ref, () => mesh.current);
  const geometry = useMemo(
    () => createStackedPlanesBufferGeometry(count, width, height, 0, 100),
    [count, width, height]
  );
  useFrame((_, delta) => {
    if (mesh.current?.material?.uniforms?.time) {
      mesh.current.material.uniforms.time.value += 0.1 * delta;
    }
  });
  return <mesh ref={mesh} geometry={geometry} material={material} />;
});
MergedPlanes.displayName = "MergedPlanes";

// PlaneNoise component
const PlaneNoise = forwardRef((props, ref) => (
  <MergedPlanes
    ref={ref}
    material={props.material}
    width={props.width}
    count={props.count}
    height={props.height}
  />
));
PlaneNoise.displayName = "PlaneNoise";

// Directional Light component
const DirLight = ({ position, color }) => {
  const dir = useRef(null);
  useEffect(() => {
    if (!dir.current) return;
    const cam = dir.current.shadow.camera;
    if (!cam) return;
    cam.top = 24;
    cam.bottom = -24;
    cam.left = -24;
    cam.right = 24;
    cam.far = 64;
    dir.current.shadow.bias = -0.004;
  }, []);
  return (
    <directionalLight
      ref={dir}
      color={color}
      intensity={2}
      position={position}
    />
  );
};

// Popup Modal Component
const PopupModal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3 className="popup-title">{title}</h3>
          <button className="popup-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="popup-content">
          {children}
        </div>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ handleNav,  }) => (
  <header className="header">
    <nav className="nav">
      <div className="nav-brand">
        <span className="logo-fin">Fin</span>
        <span className="logo-ed">Ed</span>
      </div>
      <div className="nav-links">
        <button onClick={() => {
          const user=auth.currentUser;
        
          if(!user){
            handleNav('/signup');
            return;
          }
          handleNav("/features")}} className="nav-cta">Get Started</button>
      </div>
    </nav>
  </header>
);

// Hero Section Component
const HeroSection = ({ isLoaded, onLearnMore, onJoinCommunity, isMobile }) => (
  <main className="hero">
    <div className={`hero-content ${isLoaded ? 'fade-in' : ''}`} style={{paddingTop : isMobile ? "30px" : "0px"}}>
      <div className="hero-badge">
        <span className="badge-text">Gamified Financial Literacy Platform</span>
      </div>
      
      <h1 className="hero-title" style={{paddingTop : isMobile ? "15px" : "10px"}} >
        Master Your Money,<br />
        <span className="hero-title-gold">Shape Your Future</span>
      </h1>
      
      <p className="hero-subtitle">
        Bridge the gap in financial literacy through engaging simulations, 
        AI mentorship, and community-driven learning. Make money management 
        simple, practical, and rewarding.
      </p>
      
      <div className="hero-stats">
        <div className="stat-item">
          <div className="stat-number">10K+</div>
          <div className="stat-label">Active Learners</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">95%</div>
          <div className="stat-label">Success Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Lessons</div>
        </div>
      </div>
      
      <div className="hero-actions">
        <button className="btn btn-primary" onClick={onLearnMore}>
          <span>Discover Features</span>
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
          </svg>
        </button>
        <button className="btn btn-secondary" onClick={onJoinCommunity}>
          <span>Join Community</span>
        </button>
      </div>
    </div>
  </main>
);

// Footer Component with Popup functionality
const Footer = () => {
  const [activePopup, setActivePopup] = useState(null);
  const navigate = useNavigate();

  const openPopup = (popupName) => {
    setActivePopup(popupName);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const handleFeaturesClick = () => {
    navigate("/features");
  };

  const handleCommunityClick = () => {
    navigate("/signup");
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-fin">Fin</span>
              <span className="logo-ed">Ed</span>
            </div>
            <p className="footer-description">
              Empowering the next generation with financial wisdom through 
              innovative education and gamified learning experiences.
            </p>
          </div>
          <div className="footer-links-section">
            <div className="footer-column">
              <h4 className="footer-heading">Platform</h4>
              <button onClick={handleFeaturesClick} className="footer-link footer-button">Features</button>
              <button onClick={handleCommunityClick} className="footer-link footer-button">Community</button>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <button onClick={() => openPopup('about')} className="footer-link footer-button">About Us</button>
              <button onClick={() => openPopup('contact')} className="footer-link footer-button">Contact</button>
            </div>
            <div className="footer-column">
              <h4 className="footer-heading">Support</h4>
              <button onClick={() => openPopup('help')} className="footer-link footer-button">Help Center</button>
              <button onClick={() => openPopup('privacy')} className="footer-link footer-button">Privacy Policy</button>
              <button onClick={() => openPopup('terms')} className="footer-link footer-button">Terms of Service</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 FinEd. All rights reserved.
          </p>
          <div className="footer-social">
            <a 
              href="https://www.youtube.com/watch?v=cFMwaZGT5Bg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link" 
              aria-label="Demo Video"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a2.95 2.95 0 00-2.079-2.094C19.544 3.5 12 3.5 12 3.5s-7.544 0-9.419.592A2.95 2.95 0 00.502 6.186C0 8.071 0 12 0 12s0 3.929.502 5.814a2.95 2.95 0 002.079 2.094C4.456 20.5 12 20.5 12 20.5s7.544 0 9.419-.592a2.95 2.95 0 002.079-2.094C24 15.929 24 12 24 12s0-3.929-.502-5.814zM9.75 15.568V8.432L15.5 12l-5.75 3.568z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/a6hinandh/FinEd" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link" 
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Popup Modals */}
      <PopupModal isOpen={activePopup === 'about'} onClose={closePopup} title="About FinEd">
        <div className="popup-section">
          <h4>Our Mission</h4>
          <p>FinEd is revolutionizing financial education by making it engaging, accessible, and practical. We believe everyone deserves the knowledge and tools to build a secure financial future.</p>
        </div>
        <div className="popup-section">
          <h4>What We Do</h4>
          <p>We provide gamified financial literacy experiences through:</p>
          <ul>
            <li>Interactive simulations and real-world scenarios</li>
            <li>AI-powered personalized mentorship</li>
            <li>Community-driven learning experiences</li>
            <li>Comprehensive curriculum covering all aspects of personal finance</li>
          </ul>
        </div>
        <div className="popup-section">
          <h4>Our Impact</h4>
          <p>We’re proud to be leading the change in financial education. Our platform empowers learners to build healthy financial habits and take real steps toward achieving their money goals.</p>
        </div>
      </PopupModal>

      <PopupModal isOpen={activePopup === 'contact'} onClose={closePopup} title="Contact Us">
        <div className="popup-section">
          <h4>Get In Touch</h4>
          <p>We'd love to hear from you! Whether you have questions, feedback, or partnership inquiries, our team is here to help.</p>
        </div>
        <div className="contact-info">
          <div className="contact-item">
            <strong>Email:</strong>
            <span>vionix37@gmail.com</span>
          </div>
          
        </div>
      </PopupModal>

      <PopupModal isOpen={activePopup === 'help'} onClose={closePopup} title="Help Center">
  <div className="popup-section">
    <h4>Getting Started</h4>
    <p>New to FinEd? Here’s how to begin your journey toward financial confidence:</p>
    <ol>
      <li>Create your free FinEd account</li>
      <li>Pick a personalized learning path based on your goals</li>
      <li>Explore our gamified modules, simulations, and real-world scenarios</li>
      <li>Join the community and learn with others</li>
    </ol>
  </div>

  <div className="popup-section">
    <h4>Frequently Asked Questions</h4>
    <div className="faq-item">
      <strong>Q: What makes FinEd different?</strong>
      <p>A: FinEd combines gamified learning, AI-powered mentorship, and community-driven experiences to make financial education engaging and practical.</p>
    </div>
    <div className="faq-item">
      <strong>Q: Is FinEd free to use?</strong>
      <p>A: Yes! Our core platform is completely free, giving everyone access to essential financial literacy.</p>
    </div>
  </div>

  <div className="popup-section">
    <h4>Need More Help?</h4>
    <p>Can’t find the answer here? Our team is happy to help. Reach us anytime at <a href="mailto:vionix37@gmail.com">vionix37@gmail.com</a>.</p>
  </div>
</PopupModal>


      <PopupModal isOpen={activePopup === 'privacy'} onClose={closePopup} title="Privacy Policy">
        <div className="popup-section">
          <h4>Your Privacy Matters</h4>
          <p>At FinEd, we take your privacy seriously. This policy explains how we collect, use, and protect your information.</p>
        </div>
        <div className="popup-section">
          <h4>Information We Collect</h4>
          <ul>
            <li>Account information (name, email, preferences)</li>
            <li>Usage analytics to improve our platform</li>
            <li>Community interactions and forum posts</li>
          </ul>
        </div>
        <div className="popup-section">
          <h4>How We Use Your Data</h4>
          <ul>
            <li>Personalize your learning experience</li>
            <li>Track your progress and achievements</li>
            <li>Improve our platform and features</li>
            <li>Facilitate community interactions</li>
          </ul>
        </div>
        <div className="popup-section">
          <h4>Data Security</h4>
          <p>We use industry-standard encryption and security measures to protect your data. We never sell your personal information to third parties.</p>
        </div>
        <div className="popup-section">
          <h4>Your Rights</h4>
          <p>You have the right to access, update, or delete your personal data at any time. Contact us at vionix37@gmail.com for data requests.</p>
          <p><small>Last updated: September 2025</small></p>
        </div>
      </PopupModal>

      <PopupModal isOpen={activePopup === 'terms'} onClose={closePopup} title="Terms of Service">
        <div className="popup-section">
          <h4>Terms of Use</h4>
          <p>By using FinEd, you agree to these terms of service. Please read them carefully.</p>
        </div>
        <div className="popup-section">
          <h4>User Responsibilities</h4>
          <ul>
            <li>Provide accurate information during registration</li>
            <li>Keep your account credentials secure</li>
            <li>Use the platform for educational purposes</li>
            <li>Respect other community members</li>
            <li>Follow community guidelines in forums</li>
          </ul>
        </div>
        <div className="popup-section">
          <h4>Platform Usage</h4>
          <ul>
            <li>Our content is for educational purposes only</li>
            <li>Not professional financial advice</li>
            <li>You're responsible for your financial decisions</li>
            <li>We may update content and features regularly</li>
          </ul>
        </div>
        <div className="popup-section">
          <h4>Community Guidelines</h4>
          <ul>
            <li>Be respectful and constructive</li>
            <li>No spam, harassment, or inappropriate content</li>
            <li>Share knowledge and help others learn</li>
            <li>Report any issues to our moderators</li>
          </ul>
        </div>
        <div className="popup-section">
          <h4>Service Availability</h4>
          <p>We strive for 99.9% uptime but cannot guarantee uninterrupted service. We may perform maintenance and updates as needed.</p>
          <p><small>Last updated: September 2025</small></p>
        </div>
      </PopupModal>
    </footer>
  );
};

// Main Landing Page Component
const FinEdLanding = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

  const handleLearnMore = () => {
    navigate("/features");
  };

  const handleJoinCommunity = () => {
    navigate("/signup");
  };

  return (
    <div className="app-container">
      {/* Background Beams */}
      <Beams
        beamWidth={2.5}
        beamHeight={18}
        beamNumber={15}
        lightColor="#FFD700"
        speed={1.2}
        noiseIntensity={1.0}
        scale={0.18}
        rotation={5}
      />
      
      {/* Content Overlay */}
      <div className="content-overlay">
        <Header handleNav={navigate}  />
        <HeroSection 
          isLoaded={isLoaded}
          onLearnMore={handleLearnMore}
          onJoinCommunity={handleJoinCommunity}
          isMobile={isMobile}
        />
        <Footer />
      </div>
    </div>
  );
};

export default FinEdLanding;