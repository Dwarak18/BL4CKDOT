import { useEffect, useRef } from "react";
import * as THREE from "three";

export function useMouseParallax() {
  const rawMouse   = useRef(new THREE.Vector2(0, 0));
  const smoothMouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      rawMouse.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      rawMouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return { rawMouse, smoothMouse };
}
