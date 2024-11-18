import { gsap } from 'gsap';

export const fadeIn = (element: HTMLElement, onComplete?: () => void) => {
  gsap.fromTo(element,
    { opacity: 0 },
    { 
      opacity: 1, 
      duration: .1,
      onComplete: onComplete
    }
  );
};

export const fadeOut = (element: HTMLElement, onComplete?: () => void) => {
  gsap.to(element, {
    opacity: 0,
    duration: .1,
    onComplete: onComplete
  });
};