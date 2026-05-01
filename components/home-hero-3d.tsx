"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HomeHero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03111d, 0.065);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setClearColor(0x03111d, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    camera.position.set(4.6, 3.2, 7.2);
    camera.lookAt(0, -0.45, 0);

    const group = new THREE.Group();
    scene.add(group);

    const terrainGeometry = new THREE.PlaneGeometry(11, 7, 84, 54);
    terrainGeometry.rotateX(-Math.PI / 2);
    const terrainPositions = terrainGeometry.attributes.position;
    for (let index = 0; index < terrainPositions.count; index += 1) {
      const x = terrainPositions.getX(index);
      const z = terrainPositions.getZ(index);
      const y = Math.sin(x * 1.1) * 0.14 + Math.cos(z * 1.3) * 0.1 + Math.sin((x + z) * 0.75) * 0.06;
      terrainPositions.setY(index, y - 1.25);
    }
    terrainGeometry.computeVertexNormals();

    const terrain = new THREE.Mesh(
      terrainGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x18b7e8,
        transparent: true,
        opacity: 0.13,
        wireframe: true
      })
    );
    group.add(terrain);

    const grid = new THREE.GridHelper(13, 26, 0x1ab8e5, 0x0b4d73);
    grid.position.y = -1.22;
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    group.add(grid);

    const pointCount = 900;
    const pointPositions = new Float32Array(pointCount * 3);
    const pointColors = new Float32Array(pointCount * 3);
    const cyan = new THREE.Color(0x1bd3ff);
    const white = new THREE.Color(0xffffff);
    for (let index = 0; index < pointCount; index += 1) {
      const x = (Math.random() - 0.5) * 9.5;
      const z = (Math.random() - 0.5) * 5.6;
      const y = Math.sin(x * 1.15) * 0.13 + Math.cos(z * 1.25) * 0.1 + Math.random() * 0.8 - 0.85;
      pointPositions[index * 3] = x;
      pointPositions[index * 3 + 1] = y;
      pointPositions[index * 3 + 2] = z;

      const color = cyan.clone().lerp(white, Math.random() * 0.42);
      pointColors[index * 3] = color.r;
      pointColors[index * 3 + 1] = color.g;
      pointColors[index * 3 + 2] = color.b;
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(pointColors, 3));
    const pointCloud = new THREE.Points(
      pointGeometry,
      new THREE.PointsMaterial({
        size: 0.025,
        vertexColors: true,
        transparent: true,
        opacity: 0.76
      })
    );
    group.add(pointCloud);

    const pathCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.5, -0.62, 2.4),
      new THREE.Vector3(-2.2, -0.36, 0.8),
      new THREE.Vector3(0.4, -0.22, 1.2),
      new THREE.Vector3(2.4, -0.08, -0.45),
      new THREE.Vector3(4.1, 0.02, -1.65)
    ]);
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathCurve.getPoints(120));
    const pathLine = new THREE.Line(
      pathGeometry,
      new THREE.LineBasicMaterial({
        color: 0x24c8ee,
        transparent: true,
        opacity: 0.86
      })
    );
    group.add(pathLine);

    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    pathCurve.getPoints(5).forEach((point) => {
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), markerMaterial);
      marker.position.copy(point);
      group.add(marker);
    });

    const instrument = new THREE.Group();
    instrument.position.set(2.45, -0.54, 0.35);
    instrument.rotation.y = -0.42;
    group.add(instrument);

    const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x0a2c42, roughness: 0.44, metalness: 0.32 });
    const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x1196ce, roughness: 0.38, metalness: 0.28 });
    const glassMaterial = new THREE.MeshStandardMaterial({ color: 0x6fe4ff, roughness: 0.12, metalness: 0.08, transparent: true, opacity: 0.62 });

    const tripodMaterial = new THREE.MeshBasicMaterial({ color: 0x19bde6, transparent: true, opacity: 0.68 });
    [[0, -0.62, 0.48, 0.42], [0.42, -0.62, -0.32, -0.36], [-0.42, -0.62, -0.32, 0.36]].forEach(([x, y, z, rotation]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.03, 1.45, 8), tripodMaterial);
      leg.position.set(x, y, z);
      leg.rotation.z = rotation;
      instrument.add(leg);
    });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.16, 32), darkMaterial);
    base.position.y = 0.08;
    instrument.add(base);

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.58, 0.55), blueMaterial);
    body.position.y = 0.5;
    instrument.add(body);

    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.58, 32), glassMaterial);
    lens.position.set(0, 0.58, 0.48);
    lens.rotation.x = Math.PI / 2;
    instrument.add(lens);

    const head = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 12, 48), darkMaterial);
    head.position.set(0, 0.62, 0.78);
    instrument.add(head);

    const scanCone = new THREE.Mesh(
      new THREE.ConeGeometry(1.9, 3.6, 48, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x25d9ff, transparent: true, opacity: 0.055, side: THREE.DoubleSide })
    );
    scanCone.position.set(0, 0.55, 2.35);
    scanCone.rotation.x = Math.PI / 2;
    instrument.add(scanCone);

    const ambient = new THREE.AmbientLight(0x8fdfff, 1.45);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.65);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    resize();

    let frame = 0;
    const clock = new THREE.Clock();

    const render = () => {
      const elapsed = clock.getElapsedTime();
      if (!reducedMotion) {
        group.rotation.y = Math.sin(elapsed * 0.16) * 0.08 + pointer.x * 0.035;
        group.rotation.x = -0.04 + pointer.y * 0.018;
        pointCloud.rotation.y = elapsed * 0.025;
        instrument.rotation.y = -0.42 + Math.sin(elapsed * 0.35) * 0.08;
        scanCone.rotation.z = elapsed * 0.24;
      }

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      renderer.dispose();
      terrainGeometry.dispose();
      pointGeometry.dispose();
      pathGeometry.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
