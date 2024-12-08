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
  controls: HTMLElement,
  startPosition: CardPosition,
  targetPosition: CardPosition,
  onComplete?: () => void
) => {
  const timeline = gsap.timeline({
    onComplete
  });

  // Set initial state
  gsap.set(element, {
    position: 'fixed',
    left: '50%',
    top: '-90%',
    xPercent: -50,
    yPercent: -50,
    width: targetPosition.width,
    height: targetPosition.height,
    opacity: 0,
    zIndex: 999,
  });

  gsap.set(controls, {
    opacity: 0,
  });

  // Fade in both card and controls simultaneously
  timeline.to([element, controls], {
    opacity: 1,
    duration: 0.5,
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

  // Simple fade out
  timeline.to(element, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut',
  });

  return timeline;
};