import { gsap } from 'gsap';

export const blurBackground = (element: HTMLElement) => {
  gsap.to(element, {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    duration: 0.3,
  });
};

export const unblurBackground = (element: HTMLElement) => {
  gsap.to(element, {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    backdropFilter: 'blur(0px)',
    duration: 0.3,
    onComplete: () => {
      element.style.backgroundColor = '';
    }
  });
};