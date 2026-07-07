import * as THREE from "https://esm.sh/three@0.161.0";
import { OBJLoader } from "https://esm.sh/three@0.161.0/examples/jsm/loaders/OBJLoader.js";

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const canvas = document.getElementById('scene-canvas');
const sceneOverlay = document.querySelector('.scene-overlay');
const contentSections = Array.from(document.querySelectorAll('.content-section'));
const navLinks = Array.from(document.querySelectorAll('.overlay-nav a, .floating-card, .button, .scene-home'));
const backButtons = Array.from(document.querySelectorAll('.panel-back'));

if (canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xcde8ff, 1);
  renderer.domElement.style.cursor = 'default';

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xbfd8e7, 0.0024);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 220);
  camera.position.set(0, 4.4, 8.6);

  const hemi = new THREE.HemisphereLight(0xf4f8ff, 0x6f8e62, 1.28);
  scene.add(hemi);

  const dirLight = new THREE.DirectionalLight(0xfff4de, 1.5);
  dirLight.position.set(10, 16, 7);
  scene.add(dirLight);

  const fillLight = new THREE.PointLight(0xb8dbff, 3.2, 36, 2);
  fillLight.position.set(-8, 7, -5);
  scene.add(fillLight);

  const groundGroup = new THREE.Group();
  scene.add(groundGroup);

  const groundGeometry = new THREE.PlaneGeometry(320, 320, 220, 220);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x4c6944,
    roughness: 1,
    metalness: 0.01,
    emissive: 0x172313,
    emissiveIntensity: 0.03
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  groundGroup.add(ground);

  const groundShadow = new THREE.Mesh(
    new THREE.CircleGeometry(88, 48),
    new THREE.MeshBasicMaterial({ color: 0x21311f, transparent: true, opacity: 0.95 })
  );
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.y = -0.01;
  groundGroup.add(groundShadow);

  const terrain = groundGeometry.attributes.position;
  const getGroundHeight = (x, z) => Math.sin(x * 0.025) * 0.16 + Math.cos(z * 0.03) * 0.14 + Math.sin(x * 0.01 + z * 0.008) * 0.08;

  for (let i = 0; i < terrain.count; i += 1) {
    const x = terrain.getX(i);
    const z = terrain.getZ(i);
    terrain.setY(i, getGroundHeight(x, z));
  }
  terrain.needsUpdate = true;

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(220, 48, 36),
    new THREE.MeshBasicMaterial({ color: 0xb9ddff, side: THREE.BackSide })
  );
  scene.add(sky);

  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];
  const starColors = [];
  for (let i = 0; i < 1800; i += 1) {
    const radius = 100 + Math.random() * 120;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    starPositions.push(x, y, z);
    const color = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.8, 0.75 + Math.random() * 0.2);
    starColors.push(color.r, color.g, color.b);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 0.16,
    transparent: true,
    opacity: 0,
    vertexColors: true,
    depthWrite: false
  });
  const stars = new THREE.Points(starGeometry, starMaterial);
  stars.visible = false;
  scene.add(stars);

  const treeGroup = new THREE.Group();
  scene.add(treeGroup);

  const grassGroup = new THREE.Group();
  scene.add(grassGroup);



  for (let i = 0; i < 1000; i += 1) {
    const originX = (Math.random() - 0.5) * 125;
    const originZ = (Math.random() - 0.5) * 125;
    const baseY = getGroundHeight(originX, originZ);

    for (let j = 0; j < 3; j += 1) {
      const offsetX = (Math.random() - 0.5) * 0.18;
      const offsetZ = (Math.random() - 0.5) * 0.18;
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.28 + Math.random() * 0.45, 0.03),
        new THREE.MeshStandardMaterial({ color: 0x6f8b4c, roughness: 1 })
      );
      blade.position.set(originX + offsetX, 0.2 + baseY, originZ + offsetZ);
      blade.rotation.y = Math.random() * Math.PI;
      blade.rotation.z = (Math.random() - 0.5) * 0.2;
      blade.scale.x = 0.8 + Math.random() * 0.6;
      grassGroup.add(blade);
    }
  }


  // Placeholder objects for each camera view.
  // These are intentionally varied so the scene feels more like a woodland installation.
  const focalObjects = new THREE.Group();
  scene.add(focalObjects);

  const loader = new OBJLoader();

  const loadModelWithFallback = (name, x, z, variant, y, scale, color) => {
    const url = `./models/${variant}.obj`;
    loader.load(
      url,
      (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material = new THREE.MeshStandardMaterial({
              color: color,
              roughness: 0.95,
              metalness: 0.02
            });
          }
        });
        object.position.set(x, y + 0.12, z);
        object.scale.setScalar(scale);
        object.rotation.y = (Math.random() - 0.5) * 0.7;
        focalObjects.add(object);
      },
      undefined,
      () => {
        addVariedObject(name, x, z, variant, y, scale);
      }
    );
  };

  const addVariedObject = (name, x, z, variant = 'cairn', y = 0, scale = 1) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = (Math.random() - 0.5) * 0.7;

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.8 * scale, 16),
      new THREE.MeshBasicMaterial({ color: 0x22311d, transparent: true, opacity: 0.7 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    group.add(shadow);

    switch (variant) {
      case 'monolith': {
        const shaft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.32 * scale, 0.5 * scale, 2.1 * scale, 8),
          new THREE.MeshStandardMaterial({ color: 0x67503b, roughness: 0.95 })
        );
        shaft.position.y = 1.05 * scale;
        group.add(shaft);

        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(0.9 * scale, 0.16 * scale, 0.9 * scale),
          new THREE.MeshStandardMaterial({ color: 0x8b7a5a, roughness: 0.8 })
        );
        cap.position.y = 2.18 * scale;
        group.add(cap);
        break;
      }
      case 'lantern': {
        const post = new THREE.Mesh(
          new THREE.BoxGeometry(0.24 * scale, 1.1 * scale, 0.24 * scale),
          new THREE.MeshStandardMaterial({ color: 0x4e593b, roughness: 0.9 })
        );
        post.position.y = 0.55 * scale;
        group.add(post);

        const body = new THREE.Mesh(
          new THREE.CylinderGeometry(0.45 * scale, 0.5 * scale, 0.8 * scale, 8),
          new THREE.MeshStandardMaterial({ color: 0x9bae78, roughness: 0.8 })
        );
        body.position.y = 1.2 * scale;
        group.add(body);

        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.4 * scale, 0.06 * scale, 6, 12),
          new THREE.MeshStandardMaterial({ color: 0x6d5a40, roughness: 0.85 })
        );
        ring.position.y = 1.72 * scale;
        group.add(ring);
        break;
      }
      case 'shrine': {
        const plinth = new THREE.Mesh(
          new THREE.BoxGeometry(1.2 * scale, 0.26 * scale, 1.2 * scale),
          new THREE.MeshStandardMaterial({ color: 0x6b5842, roughness: 0.95 })
        );
        plinth.position.y = 0.13 * scale;
        group.add(plinth);

        const arch = new THREE.Mesh(
          new THREE.BoxGeometry(0.5 * scale, 1.05 * scale, 0.24 * scale),
          new THREE.MeshStandardMaterial({ color: 0x827864, roughness: 0.85 })
        );
        arch.position.set(0, 0.6 * scale, 0);
        group.add(arch);

        const topStone = new THREE.Mesh(
          new THREE.BoxGeometry(0.82 * scale, 0.16 * scale, 0.82 * scale),
          new THREE.MeshStandardMaterial({ color: 0x8c7854, roughness: 0.85 })
        );
        topStone.position.y = 1.2 * scale;
        group.add(topStone);
        break;
      }
      case 'mound': {
        const mound = new THREE.Mesh(
          new THREE.CylinderGeometry(0.7 * scale, 0.95 * scale, 0.6 * scale, 10),
          new THREE.MeshStandardMaterial({ color: 0x77694c, roughness: 0.95 })
        );
        mound.position.y = 0.3 * scale;
        group.add(mound);

        const stone1 = new THREE.Mesh(
          new THREE.BoxGeometry(0.24 * scale, 0.18 * scale, 0.24 * scale),
          new THREE.MeshStandardMaterial({ color: 0x8c8268, roughness: 0.95 })
        );
        stone1.position.set(-0.28 * scale, 0.5 * scale, 0.18 * scale);
        group.add(stone1);

        const stone2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.26 * scale, 0.16 * scale, 0.2 * scale),
          new THREE.MeshStandardMaterial({ color: 0x8f7f5f, roughness: 0.95 })
        );
        stone2.position.set(0.32 * scale, 0.5 * scale, -0.14 * scale);
        group.add(stone2);
        break;
      }
      case 'totem': {
        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(0.35 * scale, 0.45 * scale, 0.5 * scale, 8),
          new THREE.MeshStandardMaterial({ color: 0x634d34, roughness: 0.95 })
        );
        base.position.y = 0.25 * scale;
        group.add(base);

        const mid = new THREE.Mesh(
          new THREE.BoxGeometry(0.24 * scale, 1.1 * scale, 0.24 * scale),
          new THREE.MeshStandardMaterial({ color: 0x5f6d44, roughness: 0.9 })
        );
        mid.position.y = 0.95 * scale;
        group.add(mid);

        const top = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 0.42 * scale, 6),
          new THREE.MeshStandardMaterial({ color: 0x8f6c34, roughness: 0.85 })
        );
        top.position.y = 1.7 * scale;
        group.add(top);
        break;
      }
      case 'cairn':
      default: {
        const base = new THREE.Mesh(
          new THREE.BoxGeometry(1.05 * scale, 0.55 * scale, 1.05 * scale),
          new THREE.MeshStandardMaterial({ color: 0x7a6a4d, roughness: 0.9 })
        );
        base.position.y = 0.27 * scale;
        group.add(base);

        const top = new THREE.Mesh(
          new THREE.CylinderGeometry(0.5 * scale, 0.72 * scale, 0.72 * scale, 6),
          new THREE.MeshStandardMaterial({ color: 0x9aa59a, roughness: 0.8 })
        );
        top.position.y = 0.95 * scale;
        group.add(top);
        break;
      }
    }

    group.userData.name = name;
    focalObjects.add(group);
    return group;
  };

  // These are the positions that the camera currently looks toward.
  // They are spread out across the forest to feel more natural and less clustered.
  loadModelWithFallback('about-focus', -12.4, -10.8, 'sign', 0, .4, 0x7a6a4d);
  loadModelWithFallback('portfolio-focus', 16.8, -14.2, 'hammock', 0, 1.1, 0xFFFAA0);
  loadModelWithFallback('blog-focus', -18.6, 12.4, 'cairn', 0, 0.4, 0xB2BEB5);
  loadModelWithFallback('contact-focus', 14.2, 16.8, 'fire', 0, .8, 0xB2BEB5);
  loadModelWithFallback('home-focus', 4.8, 8.6, 'tent', 0, 0.9, 0x7a6a4d);

  const treePositions = [
    [-24, -22], [-18, -12], [-10, -26], [12, -20], [24, -10], [30, 8], [-16, 18], [-28, 8],
    [20, 22], [28, 16], [-32, -10], [8, 28], [-6, 34], [32, -28], [-24, 28], [14, 34],
    [-38, 22], [26, -34], [-12, -40], [40, 2], [-32, -28], [18, 14], [34, 26],
    [-8, -34], [6, -38], [18, -30], [-30, -20], [36, -18], [-20, 2], [22, 6], [-40, 12],
    [10, 40], [-16, 38], [30, 34], [-34, 30], [2, -10], [16, -6], [-6, 20], [26, 20],
    [-28, -34], [40, 14], [-14, -24], [34, -2], [-2, 30], [24, -40], [8, 18], [-40, -8],
    [18, 40], [-26, 24], [32, 10], [-8, 44], [44, -24], [12, -44], [-36, 18], [20, -18],
    [-16, -32], [38, 24], [2, 44], [-30, 38], [28, -34], [-44, 2], [14, 2], [-24, 14],
    [22, 30], [-12, 8], [40, 32], [-34, -16], [6, 12], [-22, 28], [30, -12], [16, 24],
    [-40, -28], [34, 18], [-10, -18], [26, 8], [-30, 6], [8, -28], [42, 8], [-20, -12],
    [24, 16], [-14, 34], [32, -24], [-28, 20], [14, -14], [36, 2], [-8, 26], [20, 12]
  ];

  treePositions.forEach(([x, z]) => {
    const baseY = getGroundHeight(x, z);
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2 + Math.random() * 0.08, 0.24 + Math.random() * 0.08, 1.6 + Math.random() * 0.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x5c4332, roughness: 1 })
    );
    trunk.position.set(x, 0.72 + baseY, z);

    const crown = new THREE.Mesh(
      new THREE.ConeGeometry(1.4 + Math.random() * 0.4, 2.4 + Math.random() * 0.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x4d7752, roughness: 0.95 })
    );
    crown.position.set(x, 2.05 + baseY, z);

    const crown2 = new THREE.Mesh(
      new THREE.ConeGeometry(0.95 + Math.random() * 0.2, 1.4 + Math.random() * 0.35, 8),
      new THREE.MeshStandardMaterial({ color: 0x689368, roughness: 0.95 })
    );
    crown2.position.set(x, 2.85 + baseY, z);

    treeGroup.add(trunk, crown, crown2);
  });

  const clock = new THREE.Clock();
  let pointerX = 0;
  let pointerY = 0;
  const activeCameraPosition = new THREE.Vector3(0, 4.4, 8.6);
  const targetCameraPosition = new THREE.Vector3(0, 4.4, 8.6);
  const activeLookAt = new THREE.Vector3(0, 1.2, 0);
  const targetLookAt = new THREE.Vector3(0, 1.2, 0);

  const cameraTargets = {
    home: { position: [0, 4.8, 9.6], lookAt: [4.8, 1.6, 8.6] },
    about: { position: [-10.4, 4.8, 8.4], lookAt: [-12.4, 1.8, -10.8] },
    portfolio: { position: [12.8, 4.6, 8.2], lookAt: [16.8, 1.8, -14.2] },
    blog: { position: [-13.2, 4.6, 10.8], lookAt: [-18.6, 1.8, 12.4] },
    contact: { position: [13.8, 4.8, 11.2], lookAt: [14.2, 1.8, 16.8] }
  };

  // How to add custom objects:
  // 1. Place a model file in the project (for example: public/stone.glb).
  // 2. Load it with GLTFLoader.
  // 3. Position the model at the same world coordinates as the target lookAt point.
  // 4. Make the camera target look at that model's position or a nearby point.
  // Example:
  // const loader = new THREE.GLTFLoader();
  // loader.load('/stone.glb', (gltf) => {
  //   gltf.scene.scale.set(1.2, 1.2, 1.2);
  //   gltf.scene.position.set(-2.2, 0, -1.2);
  //   scene.add(gltf.scene);
  // });

  const setActiveScene = (id = 'home') => {
    const safeId = id && id !== 'top' ? id : 'home';
    const target = cameraTargets[safeId] || cameraTargets.home;
    targetCameraPosition.set(...target.position);
    targetLookAt.set(...target.lookAt);

    if (sceneOverlay) {
      sceneOverlay.classList.toggle('is-hidden', safeId !== 'home');
    }

    contentSections.forEach((section) => {
      section.classList.toggle('is-visible', section.id === safeId);
    });

    const nextHash = safeId === 'home' ? '#home' : `#${safeId}`;
    if (window.location.hash !== nextHash) {
      history.replaceState(null, '', nextHash);
    }
  };

  const activateFromHash = () => {
    const hash = window.location.hash.replace(/^#/, '');
    setActiveScene(hash || 'home');
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) {
        return;
      }

      event.preventDefault();
      const id = href.slice(1);
      if (id) {
        setActiveScene(id);
      }
    });
  });

  backButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setActiveScene('home');
    });
  });

  window.addEventListener('hashchange', activateFromHash);

  window.addEventListener('pointermove', (event) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.18;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.1;
  });

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    activeCameraPosition.lerp(targetCameraPosition, 0.04);
    activeLookAt.lerp(targetLookAt, 0.04);

    const driftX = pointerX * 0.8;
    const driftY = pointerY * 0.05;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, activeCameraPosition.x + driftX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, activeCameraPosition.y + Math.sin(elapsed * 0.25) * 0.03 + driftY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, activeCameraPosition.z + Math.sin(elapsed * 0.18) * 0.03, 0.04);
    camera.lookAt(activeLookAt);

    groundGroup.rotation.y = Math.sin(elapsed * 0.08) * 0.01;
    treeGroup.rotation.y = Math.sin(elapsed * 0.16) * 0.01;
    stars.rotation.y = elapsed * 0.002;

    renderer.render(scene, camera);
  }

  activateFromHash();
  animate();
} else {
  console.warn('Three.js could not be loaded.');
}
