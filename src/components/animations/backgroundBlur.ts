import { gsap } from 'gsap';

export const blurBackground = (element: HTMLElement) => {
  gsap.to(element, {
    backdropFilter: 'blur(5px)',
    duration: 1,
  });
};

export const unblurBackground = (element: HTMLElement) => {
  gsap.to(element, {
    backdropFilter: 'blur(0px)',
    duration: 1,
  });
};