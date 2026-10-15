import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Card, CombatState, DungeonTheme } from '../types/game.ts';
import { SoundEngine } from '../services/audio.ts';

interface Dungeon3DViewProps {
  phase: string;
  isMyTurn: boolean;
  onKickDoor?: () => void;
  combatState?: CombatState | null;
  currentTurnCard?: Card | null;
  theme?: DungeonTheme;
  isWinning?: boolean;
  isCombatVictory?: boolean;
}

// Procedural texture generator for Blender-style dungeon materials
function createStoneTexture(theme: DungeonTheme = 'dungeon'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base stone tone (Vibrant, high-readability masonry)
  let baseColor = '#584433';
  let mortarColor = '#21160e';
  let highlightColor = '#7a604a';
  if (theme === 'crypt') {
    baseColor = '#3c483c';
    mortarColor = '#141c14';
    highlightColor = '#566656';
  } else if (theme === 'bridge') {
    baseColor = '#364858';
    mortarColor = '#131e28';
    highlightColor = '#526c84';
  }

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Brick rows
  const rows = 16;
  const rowHeight = 512 / rows;
  for (let r = 0; r < rows; r++) {
    const y = r * rowHeight;
    const offset = (r % 2) * 32;
    const cols = 8;
    const colWidth = 512 / cols;

    for (let c = -1; c <= cols; c++) {
      const x = c * colWidth + offset;
      
      // Random stone color variation
      const shade = Math.floor((Math.random() - 0.5) * 30);
      ctx.fillStyle = baseColor;
      ctx.filter = `brightness(${100 + shade}%)`;
      ctx.fillRect(x + 2, y + 2, colWidth - 4, rowHeight - 4);
      ctx.filter = 'none';

      // Stone texture grain
      for (let i = 0; i < 40; i++) {
        const gx = x + Math.random() * colWidth;
        const gy = y + Math.random() * rowHeight;
        ctx.fillStyle = Math.random() > 0.5 ? highlightColor : mortarColor;
        ctx.fillRect(gx, gy, 2, 2);
      }

      // Mortar borders
      ctx.strokeStyle = mortarColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, colWidth, rowHeight);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createWoodPlankTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Aged dark oak wood
  ctx.fillStyle = '#422813';
  ctx.fillRect(0, 0, 256, 512);

  // Wood grain lines
  ctx.strokeStyle = '#2d1809';
  ctx.lineWidth = 2;
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 256, 0);
    ctx.bezierCurveTo(
      Math.random() * 256, 170,
      Math.random() * 256, 340,
      Math.random() * 256, 512
    );
    ctx.stroke();
  }

  // Planks vertical seams
  const planks = 4;
  const pw = 256 / planks;
  for (let p = 1; p < planks; p++) {
    ctx.fillStyle = '#180a03';
    ctx.fillRect(p * pw - 2, 0, 4, 512);
    ctx.fillStyle = '#6e4321';
    ctx.fillRect(p * pw + 2, 0, 1, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createRunicCircleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 512, 512);
  ctx.translate(256, 256);

  // Outer ring
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 220, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 190, 0, Math.PI * 2);
  ctx.stroke();

  // Octagram star
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  for (let star = 0; star < 2; star++) {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI / 2) + (star * Math.PI / 4);
      const x = Math.cos(angle) * 185;
      const y = Math.sin(angle) * 185;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Runic glyphs along perimeter
  const runes = ['ᚦ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ'];
  ctx.fillStyle = '#fbbf24';
  ctx.font = '24px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let r = 0; r < runes.length; r++) {
    const angle = (r / runes.length) * Math.PI * 2;
    const x = Math.cos(angle) * 205;
    const y = Math.sin(angle) * 205;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(runes[r], 0, 0);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const Dungeon3DView: React.FC<Dungeon3DViewProps> = ({
  phase,
  isMyTurn,
  onKickDoor,
  combatState,
  theme = 'dungeon',
  isWinning = false,
  isCombatVictory = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isDoorKickingRef = useRef(false);
  const doorGroupRef = useRef<THREE.Group | null>(null);
  const doorAngleRef = useRef(0);
  const targetDoorAngleRef = useRef(0);
  const combatSwordsGroupRef = useRef<THREE.Group | null>(null);
  const runeMeshRef = useRef<THREE.Mesh | null>(null);
  const coinsGroupRef = useRef<THREE.Group | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const targetCameraRotRef = useRef({ x: 0, y: 0 });

  // Update target door rotation based on phase
  useEffect(() => {
    if (phase === 'kick_door') {
      targetDoorAngleRef.current = 0; // Closed and waiting
      isDoorKickingRef.current = false;
    } else {
      // Swung open in combat, trouble, loot
      targetDoorAngleRef.current = -1.55; // ~90 deg open into corridor
    }
  }, [phase]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Headless browser check
    const isHeadless =
      navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(
      theme === 'crypt' ? 0x0c120c : theme === 'bridge' ? 0x0d151e : 0x140a05,
      0.08
    );

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 5.2);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig (Warm 3-point Blender studio lighting)
    const ambientLight = new THREE.AmbientLight(0x4a3424, 1.4);
    scene.add(ambientLight);

    // Warm key light from overhead torch sconce
    const keyLight = new THREE.DirectionalLight(0xffe2ab, 2.4);
    keyLight.position.set(2, 4.5, 3.5);
    keyLight.castShadow = !isHeadless;
    if (!isHeadless) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 15;
      keyLight.shadow.bias = -0.001;
    }
    scene.add(keyLight);

    // Cool rim light from dungeon depth
    const rimLight = new THREE.DirectionalLight(0x5a8cb0, 1.1);
    rimLight.position.set(-3, 3, -2);
    scene.add(rimLight);

    // Wall Torch Point Lights (with dynamic flicker in tick)
    const torchLightL = new THREE.PointLight(0xff9933, 3.4, 12, 1.2);
    torchLightL.position.set(-2.5, 2.3, 0.6);
    torchLightL.castShadow = !isHeadless;
    scene.add(torchLightL);

    const torchLightR = new THREE.PointLight(0xff9933, 3.4, 12, 1.2);
    torchLightR.position.set(2.5, 2.3, 0.6);
    torchLightR.castShadow = !isHeadless;
    scene.add(torchLightR);

    // God Ray / Corridor light behind the door
    const doorwayGlow = new THREE.PointLight(0xffdf88, 3.6, 9, 1.4);
    doorwayGlow.position.set(0, 1.6, -1.8);
    scene.add(doorwayGlow);

    // 3. Procedural Textures & Materials
    const stoneTexture = createStoneTexture(theme);
    stoneTexture.repeat.set(4, 3);

    const woodTexture = createWoodPlankTexture();
    const runeTexture = createRunicCircleTexture();

    const stoneMaterial = new THREE.MeshStandardMaterial({
      map: stoneTexture,
      roughness: 0.88,
      metalness: 0.08
    });

    const woodMaterial = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.75,
      metalness: 0.1
    });

    const ironMaterial = new THREE.MeshStandardMaterial({
      color: 0x242426,
      roughness: 0.42,
      metalness: 0.85
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc42e,
      roughness: 0.28,
      metalness: 0.95
    });

    // 4. Floor: Stone flagstones
    const floorGeo = new THREE.PlaneGeometry(16, 14, 1, 1);
    const floorMesh = new THREE.Mesh(floorGeo, stoneMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = !isHeadless;
    scene.add(floorMesh);

    // 5. Back Dungeon Wall
    const wallGeo = new THREE.PlaneGeometry(18, 10);
    const wallMesh = new THREE.Mesh(wallGeo, stoneMaterial);
    wallMesh.position.set(0, 4, -2.5);
    wallMesh.receiveShadow = !isHeadless;
    scene.add(wallMesh);

    // 6. Arched Stone Doorway Portal
    const archGroup = new THREE.Group();
    archGroup.position.set(0, 0, -1.5);

    // Left stone jamb
    const jambGeo = new THREE.BoxGeometry(0.5, 3.2, 0.6);
    const leftJamb = new THREE.Mesh(jambGeo, stoneMaterial);
    leftJamb.position.set(-1.25, 1.6, 0);
    leftJamb.castShadow = !isHeadless;
    leftJamb.receiveShadow = !isHeadless;
    archGroup.add(leftJamb);

    // Right stone jamb
    const rightJamb = new THREE.Mesh(jambGeo, stoneMaterial);
    rightJamb.position.set(1.25, 1.6, 0);
    rightJamb.castShadow = !isHeadless;
    rightJamb.receiveShadow = !isHeadless;
    archGroup.add(rightJamb);

    // Top stone lintel / arch
    const lintelGeo = new THREE.BoxGeometry(3.0, 0.6, 0.7);
    const lintelMesh = new THREE.Mesh(lintelGeo, stoneMaterial);
    lintelMesh.position.set(0, 3.3, 0);
    lintelMesh.castShadow = !isHeadless;
    archGroup.add(lintelMesh);

    // Keystone in the center of arch
    const keystoneGeo = new THREE.BoxGeometry(0.6, 0.8, 0.8);
    const keystoneMesh = new THREE.Mesh(keystoneGeo, stoneMaterial);
    keystoneMesh.position.set(0, 3.4, 0.05);
    archGroup.add(keystoneMesh);

    // Corridor interior darkness mesh behind door
    const corridorGeo = new THREE.PlaneGeometry(2.1, 3.1);
    const corridorMat = new THREE.MeshBasicMaterial({ color: 0x050302 });
    const corridorMesh = new THREE.Mesh(corridorGeo, corridorMat);
    corridorMesh.position.set(0, 1.55, -0.15);
    archGroup.add(corridorMesh);

    scene.add(archGroup);

    // 7. Heavy 3D Wooden Door with Iron Straps & Ring
    // We pivot the door around its left hinge at x = -1.0
    const doorHingeGroup = new THREE.Group();
    doorHingeGroup.position.set(-1.0, 0, -1.5);

    const doorLeafGroup = new THREE.Group();
    // Offset door leaf so hinge is on the left edge
    doorLeafGroup.position.set(1.0, 0, 0);

    const doorGeo = new THREE.BoxGeometry(2.0, 3.0, 0.14);
    const doorMesh = new THREE.Mesh(doorGeo, woodMaterial);
    doorMesh.position.set(0, 1.5, 0);
    doorMesh.castShadow = !isHeadless;
    doorLeafGroup.add(doorMesh);

    // Iron reinforcement straps (top, middle, bottom)
    const strapGeo = new THREE.BoxGeometry(2.02, 0.14, 0.17);
    [-0.8, 0, 0.8].forEach((offsetY) => {
      const strap = new THREE.Mesh(strapGeo, ironMaterial);
      strap.position.set(0, 1.5 + offsetY, 0);
      strap.castShadow = !isHeadless;
      doorLeafGroup.add(strap);

      // Iron rivets along strap
      [-0.8, -0.4, 0, 0.4, 0.8].forEach((offsetX) => {
        const rivetGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.05, 8);
        const rivet = new THREE.Mesh(rivetGeo, ironMaterial);
        rivet.rotation.x = Math.PI / 2;
        rivet.position.set(offsetX, 1.5 + offsetY, 0.09);
        doorLeafGroup.add(rivet);
      });
    });

    // Cast iron ring door knocker
    const knockerBaseGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12);
    const knockerBase = new THREE.Mesh(knockerBaseGeo, ironMaterial);
    knockerBase.rotation.x = Math.PI / 2;
    knockerBase.position.set(0.4, 1.5, 0.08);
    doorLeafGroup.add(knockerBase);

    const ringGeo = new THREE.TorusGeometry(0.12, 0.024, 8, 20);
    const ringMesh = new THREE.Mesh(ringGeo, ironMaterial);
    ringMesh.position.set(0.4, 1.4, 0.1);
    doorLeafGroup.add(ringMesh);

    doorHingeGroup.add(doorLeafGroup);
    scene.add(doorHingeGroup);
    doorGroupRef.current = doorHingeGroup;

    // 8. 3D Wall Torches (Left & Right)
    const createTorch = (x: number, y: number, z: number) => {
      const torchGroup = new THREE.Group();
      torchGroup.position.set(x, y, z);

      // Iron wall plate
      const plateGeo = new THREE.BoxGeometry(0.12, 0.4, 0.05);
      const plate = new THREE.Mesh(plateGeo, ironMaterial);
      torchGroup.add(plate);

      // Angled bracket
      const bracketGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.35, 8);
      const bracket = new THREE.Mesh(bracketGeo, ironMaterial);
      bracket.position.set(0, 0, 0.15);
      bracket.rotation.x = Math.PI / 4;
      torchGroup.add(bracket);

      // Torch basket
      const basketGeo = new THREE.CylinderGeometry(0.1, 0.05, 0.18, 8);
      const basket = new THREE.Mesh(basketGeo, ironMaterial);
      basket.position.set(0, 0.16, 0.28);
      torchGroup.add(basket);

      // Multi-layer glowing flame: outer fire cone + inner bright hot core
      const flameCoreGeo = new THREE.SphereGeometry(0.09, 8, 8);
      const flameCoreMat = new THREE.MeshBasicMaterial({
        color: 0xffeb3b
      });
      const flameCore = new THREE.Mesh(flameCoreGeo, flameCoreMat);
      flameCore.position.set(0, 0.32, 0.28);
      torchGroup.add(flameCore);

      const flameGeo = new THREE.ConeGeometry(0.13, 0.34, 8);
      const flameMat = new THREE.MeshStandardMaterial({
        color: 0xff5722,
        emissive: 0xff8c00,
        emissiveIntensity: 3.2,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.set(0, 0.4, 0.28);
      torchGroup.add(flameMesh);

      return { torchGroup, flameMesh, flameCore };
    };

    const torchL = createTorch(-2.5, 2.0, 0.5);
    scene.add(torchL.torchGroup);

    const torchR = createTorch(2.5, 2.0, 0.5);
    torchR.torchGroup.rotation.y = Math.PI;
    torchR.torchGroup.position.x = 2.5;
    scene.add(torchR.torchGroup);

    // 9. Floating Ember Sparks (Particle system)
    const emberCount = isHeadless ? 15 : 60;
    const emberGeo = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    const emberVelocities = new Float32Array(emberCount * 3);

    for (let i = 0; i < emberCount; i++) {
      const isLeft = i % 2 === 0;
      emberPositions[i * 3] = (isLeft ? -2.5 : 2.5) + (Math.random() - 0.5) * 0.4;
      emberPositions[i * 3 + 1] = 2.2 + Math.random() * 2.0;
      emberPositions[i * 3 + 2] = 0.5 + (Math.random() - 0.5) * 0.4;

      emberVelocities[i * 3] = (Math.random() - 0.5) * 0.01;
      emberVelocities[i * 3 + 1] = 0.008 + Math.random() * 0.012;
      emberVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xffaa33,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const emberPoints = new THREE.Points(emberGeo, emberMat);
    scene.add(emberPoints);

    // 10. 3D Combat Arena Platform & Glowing Runes (Active during combat)
    const arenaPlatformGroup = new THREE.Group();
    arenaPlatformGroup.position.set(0, 0.02, 0.8);

    // Carved octagonal dais
    const daisGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.12, 16);
    const daisMesh = new THREE.Mesh(daisGeo, stoneMaterial);
    daisMesh.position.y = 0.06;
    daisMesh.receiveShadow = !isHeadless;
    arenaPlatformGroup.add(daisMesh);

    // Glowing Runic Circle Decal
    const runeGeo = new THREE.PlaneGeometry(4.2, 4.2);
    const runeMat = new THREE.MeshBasicMaterial({
      map: runeTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const runeMesh = new THREE.Mesh(runeGeo, runeMat);
    runeMesh.rotation.x = -Math.PI / 2;
    runeMesh.position.y = 0.13;
    arenaPlatformGroup.add(runeMesh);
    runeMeshRef.current = runeMesh;

    // Animated 3D Crossed Swords for Combat
    const swordsGroup = new THREE.Group();
    swordsGroup.position.set(0, 2.2, 0.8);

    const makeSword = (isLeft: boolean) => {
      const sword = new THREE.Group();
      // Blade
      const bladeGeo = new THREE.BoxGeometry(0.08, 1.4, 0.02);
      const blade = new THREE.Mesh(bladeGeo, ironMaterial);
      blade.position.y = 0.7;
      sword.add(blade);

      // Crossguard
      const guardGeo = new THREE.BoxGeometry(0.4, 0.06, 0.06);
      const guard = new THREE.Mesh(guardGeo, goldMaterial);
      sword.add(guard);

      // Pommel & hilt
      const hiltGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
      const hilt = new THREE.Mesh(hiltGeo, woodMaterial);
      hilt.position.y = -0.15;
      sword.add(hilt);

      sword.rotation.z = isLeft ? Math.PI / 4 : -Math.PI / 4;
      return sword;
    };

    const sword1 = makeSword(true);
    const sword2 = makeSword(false);
    swordsGroup.add(sword1);
    swordsGroup.add(sword2);
    swordsGroup.scale.set(0.001, 0.001, 0.001); // hidden until combat
    arenaPlatformGroup.add(swordsGroup);
    combatSwordsGroupRef.current = swordsGroup;

    scene.add(arenaPlatformGroup);

    // 11. 3D Golden Coins Victory Burst Group
    const coinsGroup = new THREE.Group();
    coinsGroup.position.set(0, 0.2, 0.8);
    const coinMeshes: { mesh: THREE.Mesh; vx: number; vy: number; vz: number; rotV: number }[] = [];
    const coinCount = isHeadless ? 8 : 28;
    const coinGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 12);

    for (let c = 0; c < coinCount; c++) {
      const coin = new THREE.Mesh(coinGeo, goldMaterial);
      coin.position.set(
        (Math.random() - 0.5) * 0.4,
        0,
        (Math.random() - 0.5) * 0.4
      );
      coin.visible = false;
      coinsGroup.add(coin);
      coinMeshes.push({
        mesh: coin,
        vx: (Math.random() - 0.5) * 0.06,
        vy: 0.08 + Math.random() * 0.08,
        vz: (Math.random() - 0.5) * 0.06,
        rotV: (Math.random() - 0.5) * 0.2
      });
    }
    scene.add(coinsGroup);
    coinsGroupRef.current = coinsGroup;

    // 12. Mouse move handler for subtle Blender-style camera parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current = { x: nx, y: ny };
      targetCameraRotRef.current = {
        x: ny * 0.06,
        y: -nx * 0.12
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 13. Smooth Animation Loop (Blender-quality interpolation)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Smooth camera parallax
      camera.rotation.y = THREE.MathUtils.damp(
        camera.rotation.y,
        targetCameraRotRef.current.y,
        3.5,
        delta
      );
      camera.rotation.x = THREE.MathUtils.damp(
        camera.rotation.x,
        targetCameraRotRef.current.x,
        3.5,
        delta
      );

      // Smooth Door Hinge rotation
      doorAngleRef.current = THREE.MathUtils.damp(
        doorAngleRef.current,
        targetDoorAngleRef.current,
        4.0,
        delta
      );
      if (doorGroupRef.current) {
        doorGroupRef.current.rotation.y = doorAngleRef.current;
      }

      // Torchlights flicker
      const flickL = 2.0 + Math.sin(time * 7) * 0.25 + Math.cos(time * 11) * 0.15;
      const flickR = 2.0 + Math.cos(time * 6) * 0.25 + Math.sin(time * 13) * 0.15;
      torchLightL.intensity = flickL;
      torchLightR.intensity = flickR;

      torchL.flameMesh.scale.y = 1.0 + Math.sin(time * 12) * 0.12;
      torchR.flameMesh.scale.y = 1.0 + Math.cos(time * 10) * 0.12;

      // Update Ember Sparks
      const positions = emberGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < emberCount; i++) {
        positions[i * 3] += emberVelocities[i * 3];
        positions[i * 3 + 1] += emberVelocities[i * 3 + 1];
        positions[i * 3 + 2] += emberVelocities[i * 3 + 2];

        // Reset if reached ceiling
        if (positions[i * 3 + 1] > 4.5) {
          const isLeft = i % 2 === 0;
          positions[i * 3] = (isLeft ? -2.5 : 2.5) + (Math.random() - 0.5) * 0.4;
          positions[i * 3 + 1] = 2.2;
          positions[i * 3 + 2] = 0.5 + (Math.random() - 0.5) * 0.4;
        }
      }
      emberGeo.attributes.position.needsUpdate = true;

      // Rotate Runic Circle slowly
      if (runeMeshRef.current) {
        runeMeshRef.current.rotation.z += delta * 0.25;
      }

      // Animate Crossed Swords during Combat
      if (combatSwordsGroupRef.current) {
        const isInCombat = phase === 'combat';
        const targetScale = isInCombat ? 0.9 : 0.001;
        combatSwordsGroupRef.current.scale.lerp(
          new THREE.Vector3(targetScale, targetScale, targetScale),
          delta * 6
        );

        if (isInCombat) {
          // Dynamic clash animation
          const clash = Math.sin(time * 4) * 0.1;
          combatSwordsGroupRef.current.position.y = 2.2 + Math.sin(time * 2) * 0.05;
          sword1.rotation.z = Math.PI / 4 + clash;
          sword2.rotation.z = -Math.PI / 4 - clash;
        }
      }

      // Animate Coins Victory Explosion
      if (isCombatVictory) {
        coinMeshes.forEach((c) => {
          c.mesh.visible = true;
          c.mesh.position.x += c.vx;
          c.mesh.position.y += c.vy;
          c.mesh.position.z += c.vz;
          c.vy -= 0.004; // gravity
          c.mesh.rotation.x += c.rotV;
          c.mesh.rotation.y += c.rotV * 1.5;

          // Bounce on stone dais
          if (c.mesh.position.y < 0.12) {
            c.mesh.position.y = 0.12;
            c.vy = -c.vy * 0.45;
          }
        });
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      stoneTexture.dispose();
      woodTexture.dispose();
      runeTexture.dispose();
      floorGeo.dispose();
      wallGeo.dispose();
      doorGeo.dispose();
      emberGeo.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme, isCombatVictory]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};
