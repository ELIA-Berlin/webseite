/**
 * Schematische 3D-Modelle von Stella (Rakete) und Doug (Rover) für die Köpfe der Themenseiten.
 *
 * Die Modelle sind aus einfachen Grundformen zusammengesetzt und im Stil der Seite dargestellt:
 * dunkler Körper mit hellem Randlicht und leuchtenden Kanten, wie eine Konstruktionszeichnung in 3D.
 * Maße sind angelehnt an die Zeichnungen, aber nicht maßstäblich.
 *
 * Später ersetzbar durch echte Modelle aus Fusion 360: als glTF (.glb) exportieren,
 * mit dem GLTFLoader aus three/examples laden und statt baueStella()/baueDoug() einsetzen.
 */
import * as THREE from 'three';

export type ModellName = 'stella' | 'doug';

/* ---------- Darstellung: Körper mit Randlicht, dazu Kantenlinien ---------- */

const koerperMaterial = () =>
  new THREE.ShaderMaterial({
    uniforms: {
      uDunkel: { value: new THREE.Color('#0e1f2c') },
      uHell: { value: new THREE.Color('#cfe3f5') },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormale;
      varying vec3 vBlick;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormale = normalize(normalMatrix * normal);
        vBlick = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uDunkel;
      uniform vec3 uHell;
      varying vec3 vNormale;
      varying vec3 vBlick;
      void main() {
        vec3 n = normalize(vNormale);
        float rand = pow(1.0 - abs(dot(n, normalize(vBlick))), 2.0);
        float licht = max(dot(n, normalize(vec3(-0.4, 0.8, 0.6))), 0.0);
        vec3 farbe = uDunkel + uHell * (0.1 * licht) + uHell * (0.85 * rand);
        gl_FragColor = vec4(farbe, 1.0);
      }
    `,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });

const kantenMaterial = () =>
  new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });

class Baukasten {
  gruppe = new THREE.Group();
  private koerper = koerperMaterial();
  private kanten = kantenMaterial();

  /** Fügt ein Teil mit Kanten hinzu. winkel: Kanten ab diesem Knick (Grad) werden gezeichnet. */
  teil(geo: THREE.BufferGeometry, pos: [number, number, number] = [0, 0, 0], drehung: [number, number, number] = [0, 0, 0], winkel = 28) {
    const mesh = new THREE.Mesh(geo, this.koerper);
    const linien = new THREE.LineSegments(new THREE.EdgesGeometry(geo, winkel), this.kanten);
    const halter = new THREE.Group();
    halter.add(mesh, linien);
    halter.position.set(...pos);
    halter.rotation.set(...drehung);
    this.gruppe.add(halter);
    return halter;
  }

  /** Balken zwischen zwei Punkten (für Fahrwerk und Arme) */
  balken(a: THREE.Vector3, b: THREE.Vector3, dicke = 0.05) {
    const laenge = a.distanceTo(b);
    const geo = new THREE.BoxGeometry(laenge, dicke, dicke);
    const halter = this.teil(geo);
    halter.position.copy(a).add(b).multiplyScalar(0.5);
    halter.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), b.clone().sub(a).normalize());
    return halter;
  }

  setzeDeckkraft(wert: number) {
    this.kanten.opacity = 0.8 * wert;
  }
}

/* ---------- Stella ---------- */

function baueStella() {
  const k = new Baukasten();
  const r = 0.32;
  // Stapel von unten nach oben: Motor 1.8, Bergung 0.9, Avionik 0.72, Nutzlast 0.83, Nase 1.35
  const abschnitte = [1.8, 0.9, 0.72, 0.83];
  let y = 0;
  abschnitte.forEach((h) => {
    k.teil(new THREE.CylinderGeometry(r, r, h, 48, 1), [0, y + h / 2, 0]);
    y += h;
  });

  // Nasenkonus als Ogive
  const nase: THREE.Vector2[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    nase.push(new THREE.Vector2(r * Math.sqrt(1 - t * t) * (1 - 0.15 * t), 1.35 * t));
  }
  nase[16] = new THREE.Vector2(0, 1.35);
  k.teil(new THREE.LatheGeometry(nase, 48), [0, y, 0], [0, 0, 0], 40);

  // Düse
  const duese = [new THREE.Vector2(0.14, 0), new THREE.Vector2(0.15, -0.08), new THREE.Vector2(0.2, -0.28)];
  k.teil(new THREE.LatheGeometry(duese, 32), [0, 0, 0], [0, 0, 0], 40);

  // Vier Flossen (Leitwerk)
  const form = new THREE.Shape();
  form.moveTo(0, 0.8);
  form.lineTo(0.52, -0.1);
  form.lineTo(0.52, -0.4);
  form.lineTo(0, 0);
  form.closePath();
  const flosse = new THREE.ExtrudeGeometry(form, { depth: 0.035, bevelEnabled: false });
  flosse.translate(r - 0.01, 0, -0.0175);
  for (let i = 0; i < 4; i++) k.teil(flosse, [0, 0, 0], [0, (i * Math.PI) / 2 + Math.PI / 4, 0]);

  // Mitte des Modells in den Ursprung
  k.gruppe.position.y = -2.7;
  const halter = new THREE.Group();
  halter.add(k.gruppe);
  return { baukasten: k, halter, neigung: new THREE.Euler(0, 0, -0.55) };
}

/* ---------- Doug ---------- */

function baueDoug() {
  const k = new Baukasten();
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

  // Rumpf und Deck
  k.teil(new THREE.BoxGeometry(1.5, 0.34, 0.92), [0, 0.86, 0]);
  k.teil(new THREE.BoxGeometry(1.62, 0.04, 1.02), [0, 1.05, 0]);

  // Mast mit Kamerakopf und Antenne
  k.teil(new THREE.CylinderGeometry(0.035, 0.035, 0.62, 16), [0.48, 1.38, 0.22]);
  k.teil(new THREE.BoxGeometry(0.16, 0.12, 0.3), [0.5, 1.74, 0.22]);
  k.teil(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16), [0.59, 1.74, 0.14], [0, 0, Math.PI / 2]);
  k.teil(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16), [0.59, 1.74, 0.3], [0, 0, Math.PI / 2]);
  k.teil(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 8), [-0.62, 1.34, -0.34]);
  k.teil(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 24), [-0.62, 1.62, -0.34]);

  // Greifarm vorne
  k.balken(v(0.72, 0.9, -0.2), v(1.05, 1.08, -0.2), 0.05);
  k.balken(v(1.05, 1.08, -0.2), v(1.22, 0.78, -0.2), 0.045);
  k.teil(new THREE.BoxGeometry(0.08, 0.1, 0.12), [1.24, 0.72, -0.2]);

  // Fahrwerk: Rocker-Bogie auf beiden Seiten, sechs Räder
  const radR = 0.24;
  const radGeo = new THREE.CylinderGeometry(radR, radR, 0.16, 28, 1);
  const nabeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 16, 1);
  [-1, 1].forEach((seite) => {
    const z = seite * 0.62;
    const drehpunkt = v(0.05, 0.78, z);
    const bogie = v(-0.42, 0.52, z);
    const raeder = [v(0.82, radR, z), v(-0.05, radR, z), v(-0.8, radR, z)];
    k.balken(drehpunkt, raeder[0].clone().setY(radR + 0.02));
    k.balken(drehpunkt, bogie);
    k.balken(bogie, raeder[1].clone().setY(radR + 0.02));
    k.balken(bogie, raeder[2].clone().setY(radR + 0.02));
    k.balken(drehpunkt, v(0.05, 0.78, seite * 0.46), 0.06);
    raeder.forEach((p) => {
      k.teil(radGeo, [p.x, p.y, p.z], [Math.PI / 2, 0, 0], 20);
      k.teil(nabeGeo, [p.x, p.y, p.z], [Math.PI / 2, 0, 0], 20);
    });
  });

  k.gruppe.position.set(-0.1, -0.85, 0);
  const halter = new THREE.Group();
  halter.add(k.gruppe);
  return { baukasten: k, halter, neigung: new THREE.Euler(0.42, 0, 0) };
}

/* ---------- Anzeige ---------- */

interface Optionen {
  bewegung: boolean;
  fertig: () => void;
}

/** Startet die 3D-Anzeige in einem Container. Gibt eine Funktion zum Anhalten zurück. */
export function zeigeModell(box: HTMLElement, name: ModellName, { bewegung, fertig }: Optionen) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const leinwand = renderer.domElement;
  leinwand.classList.add('modell3d__leinwand');
  box.appendChild(leinwand);

  const szene = new THREE.Scene();
  const kamera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  const modell = name === 'stella' ? baueStella() : baueDoug();

  // Aufbau: aussen = Ziehen mit der Maus, innen = Neigung, ganz innen = Eigendrehung
  const ziehen = new THREE.Group();
  const neigung = new THREE.Group();
  neigung.rotation.copy(modell.neigung);
  ziehen.add(neigung);
  neigung.add(modell.halter);
  szene.add(ziehen);

  // Kamera so weit weg, dass das Modell ganz hineinpasst
  const kugel = new THREE.Box3().setFromObject(ziehen).getBoundingSphere(new THREE.Sphere());
  const abstand = kugel.radius / Math.sin(THREE.MathUtils.degToRad(kamera.fov / 2)) * 0.98;
  kamera.position.set(0, kugel.radius * 0.18, abstand);
  kamera.lookAt(kugel.center);

  const groesse = () => {
    const b = box.clientWidth;
    const h = box.clientHeight;
    renderer.setSize(b, h, false);
    kamera.aspect = b / h;
    kamera.updateProjectionMatrix();
  };
  groesse();
  const beobachterGroesse = new ResizeObserver(() => { groesse(); zeichne(); });
  beobachterGroesse.observe(box);

  // Ziehen zum Drehen (waagerecht: drehen, senkrecht: kippen); senkrechtes Wischen scrollt weiter
  let gier = 0, nick = 0, zieht = false, lx = 0, ly = 0, ruhtSeit = 0;
  leinwand.addEventListener('pointerdown', (e) => { zieht = true; lx = e.clientX; ly = e.clientY; leinwand.setPointerCapture(e.pointerId); box.classList.add('zieht'); });
  leinwand.addEventListener('pointermove', (e) => {
    if (!zieht) return;
    gier += (e.clientX - lx) * 0.01;
    nick = Math.max(-0.6, Math.min(0.6, nick + (e.clientY - ly) * 0.006));
    lx = e.clientX; ly = e.clientY;
    if (!bewegung) zeichne();
  });
  const loslassen = () => { zieht = false; ruhtSeit = performance.now(); box.classList.remove('zieht'); };
  leinwand.addEventListener('pointerup', loslassen);
  leinwand.addEventListener('pointercancel', loslassen);

  let eigen = 0;
  let einblenden = bewegung ? 0 : 1;
  function zeichne() {
    ziehen.rotation.set(nick, gier, 0);
    modell.halter.rotation.y = eigen;
    modell.baukasten.setzeDeckkraft(einblenden);
    renderer.render(szene, kamera);
  }

  // Laufende Animation nur, solange das Modell zu sehen ist
  let rahmen = 0, sichtbar = false, letzte = 0;
  function schleife(t: number) {
    const dt = Math.min(0.05, (t - (letzte || t)) / 1000);
    letzte = t;
    einblenden = Math.min(1, einblenden + dt / 1.2);
    eigen += dt * 0.35;
    // nach dem Loslassen langsam zurück in die Grundlage kippen
    if (!zieht && t - ruhtSeit > 1500) nick *= 0.97;
    zeichne();
    rahmen = requestAnimationFrame(schleife);
  }
  const beobachter = new IntersectionObserver(([e]) => {
    sichtbar = e.isIntersecting;
    cancelAnimationFrame(rahmen);
    if (sichtbar && bewegung) { letzte = 0; rahmen = requestAnimationFrame(schleife); }
  });
  beobachter.observe(box);

  if (!bewegung) eigen = 0.6;
  zeichne();
  fertig();

  return () => {
    cancelAnimationFrame(rahmen);
    beobachter.disconnect();
    beobachterGroesse.disconnect();
    renderer.dispose();
  };
}
