import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dream-background',
  imports: [CommonModule],
  templateUrl: './dream-background.html',
  styleUrl: './dream-background.css'
})
export class DreamBackground {
  circles = Array.from({ length: 100 }).map(() => {
    const startY = 100 + Math.random() * 10; // Initial Y Offset
    const endY = -startY - Math.random() * 30;
    const startX = Math.random() * 100;
    const endX = Math.random() * 100;

    const size = Math.random() * 8 + 2; // radius
    const duration = 28000 + Math.random() * 9000;
    const delay = Math.random() * 37000;
    const innerDelay = Math.random() * 4000;

    // Generate unique keyframe names for each circle
    const key = `move-${Math.floor(Math.random() * 100000)}`;

    return {
      size: `${size}px`,
      duration: `${duration}ms`,
      delay: `${delay}ms`,
      innerDelay: `${innerDelay}ms`,
      keyframesName: key,
      keyframes: `
        @keyframes ${key} {
          from {
            transform: translate3d(${startX}vw, ${startY}vh, 0);
          }
          to {
            transform: translate3d(${endX}vw, ${endY}vh, 0);
          }
        }
      `
    };
  });

  constructor() {
    // Insert dynamically generated keyframes into the document style
    const styleSheet = document.createElement('style');
    this.circles.forEach(c => {
      styleSheet.innerHTML += c.keyframes;
    });
    document.head.appendChild(styleSheet);
  }
}
