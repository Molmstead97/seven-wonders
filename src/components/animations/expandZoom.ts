import { gsap } from 'gsap';

interface CardPosition {
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
}

export const expandZoom = (
  element: HTMLElement,
  startPosition: CardPosition,
  targetPosition: CardPosition,
  onComplete?: () => void
) => {
  const timeline = gsap.timeline({
    onComplete
  });

  // Set initial position absolutely
  gsap.set(element, {
    position: 'fixed',
    left: startPosition.x,
    top: startPosition.y,
    width: startPosition.width,
    height: startPosition.height,
    rotation: startPosition.rotation,
    zIndex: 50,
  });

  // Animate to target position
  timeline.to(element, {
    left: targetPosition.x,
    top: targetPosition.y,
    width: targetPosition.width,
    height: targetPosition.height,
    rotation: 0,
    duration: 0.8,
    ease: 'power2.inOut',
  });

  return timeline;
};

export const shrinkZoom = (
  element: HTMLElement,
  targetPosition: CardPosition,
  onComplete?: () => void
) => {
  const timeline = gsap.timeline({
    onComplete
  });

  timeline.to(element, {
    x: targetPosition.x,
    y: targetPosition.y,
    rotation: targetPosition.rotation,
    width: targetPosition.width,
    height: targetPosition.height,
    scale: 1,
    duration: 0.8,
    ease: 'power2.inOut',
  });

  return timeline;
};