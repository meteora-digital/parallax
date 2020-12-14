// Helpers
import { objectAssign, attach, offset, getTransformValues } from '@meteora-digital/helpers';

// Class
export default class ParallaxBackground {
  constructor(container, direction = {}) {
    // Initialise data
    this.media = {};
    this.container = {};

    this.deadzone = 0.005;
    this.scrollPercent = 0;

    this.direction = objectAssign({
      x: 0,
      y: 1,
    }, direction);

    this.transform = {
      x: (this.direction.x !== 0) ? -50 : 0,
      y: (this.direction.y !== 0) ? -50 : 0,
    }

    this.enabled = {
      x: false,
      y: false,
    },

    this.current = {
      x: 0,
      y: 0,
    },

    this.distance = {
      x: 0,
      y: 0,
    }

    this.direction = {
      x: Math.round(Math.min(1, Math.max(-1, this.direction.x))),
      y: Math.round(Math.min(1, Math.max(-1, this.direction.y))),
    }

    // Find the elements
    this.container.element = container;
    this.media.element = this.container.element.querySelector('[data-parallax-watch]');

    // If we have elements, then start the function
    if (this.container.element && this.media.element) this.init();
  }

  resize() {
    // Container data
    this.container.offset = offset(this.container.element).y;

    if (this.direction.y !== 0) {
      this.distance.y = (this.container.element.clientHeight / this.media.element.clientHeight * 100) - 100;
    }

    if (this.direction.x !== 0) {
      this.distance.x = (this.container.element.clientWidth / this.media.element.clientWidth * 100) - 100;
    }

    this.media.x = this.distance / 100 * this.getScrollPercent();
    this.media.y = this.distance / 100 * this.getScrollPercent();
  }

  init() {
    // Update our data
    this.resize();

    // Add events
    this.events();

    // Initialise the x transform
    if (this.direction.x != 0) {
      this.enabled.x = true;
      this.transform.x = (this.distance.x / 100 * this.getScrollPercent()) - 50;
    }

    // Initialise the y transform
    if (this.direction.y != 0) {
      this.enabled.y = true;
      this.transform.y = (this.distance.y / 100 * this.getScrollPercent()) - 50;
    }

    // Initialise the element transform
    this.media.element.style.transform = `translateX(${this.transform.x}%) translateY(${this.transform.y}%)`;

    setTimeout(() => {
      if (this.direction.y !== 0) {
        this.media.element.style.top = '50%';
      }

      if (this.direction.x !== 0) {
        this.media.element.style.left = '50%';
      }
    }, 100);
  }

  events() {
    attach(window, 'resize', () => this.resize(), 250);

    attach(window, 'scroll', () => {
      if (this.enabled.x === false || this.enabled.y === false) {
        if (this.distance.x != 0 || this.direction.x != 0) this.enabled.x = true;
        if (this.distance.y != 0 || this.direction.y != 0) this.enabled.y = true;

        this.parallax();
      }
    }, 50);

    setTimeout(() => this.parallax(), 100);
  }

  getScrollPercent() {
    const distance = (window.pageYOffset + window.innerHeight) - (this.container.offset);
    const percentage = Math.round(distance / ((window.innerHeight + (this.container.element.clientHeight)) / 100));

    return  - ((Math.min(100, Math.max(0, percentage)) - 50));
  }

  parallax() {
    // Only loop when we have scrolled
    if (this.enabled.x || this.enabled.y) {
      // console.log(this.enabled);
      this.scrollPercent = this.getScrollPercent();

      // Check that the value is within the viewport with our scroll percentage function
      if (this.scrollPercent > -50 && this.scrollPercent < 50) {
        // grab our current transform percentage
        this.current = {
          x: getTransformValues(this.media.element).translateX / this.media.element.clientWidth * 100,
          y: getTransformValues(this.media.element).translateY / this.media.element.clientHeight * 100,
        }

        if (this.enabled.x) {
          // grab the needed transform value
          this.movementX =  this.distance.x / 100 * this.scrollPercent - 50 * this.direction.x;

          // calculate the difference
          this.differenceX = (Math.abs(this.current.x) - Math.abs(this.movementX)) / Math.abs(this.current.x);

          if (this.current.x < this.movementX - this.deadzone || this.current.x > this.movementX + this.deadzone) {
            // update the media's transform css
            this.transform.x = (Math.round((this.current.x + this.differenceX) * 10000) / 10000);
          }else {
            // if we if our deadzone, exit the loop
            this.enabled.x = false;
          }
        }else {
          // there is no animation required so parallax is not needed
          this.enabled.x = false;
        }

        if (this.enabled.y) {
          // grab the needed transform value
          this.movementY =  this.distance.y / 100 * this.scrollPercent - 50 * this.direction.y;

          // calculate the difference
          this.differenceY = (Math.abs(this.current.y) - Math.abs(this.movementY)) / Math.abs(this.current.y);

          if (this.current.y < this.movementY - this.deadzone || this.current.y > this.movementY + this.deadzone) {
            // update the media's transform css
            if (this.direction.y != 0) {
              this.transform.y = (Math.round((this.current.y + this.differenceY) * 10000) / 10000);
            }
          }else {
            // if we if our deadzone, exit the loop
            this.enabled.y = false;
          }
        }else {
          // there is no animation required so parallax is not needed
          this.enabled.y = false;
        }

        // Add the element's transform
        this.media.element.style.transform = `translateX(${this.transform.x}%) translateY(${this.transform.y}%)`;
        // repeat the function
        window.requestAnimationFrame(() => this.parallax());
      } else {
        // if we're not looking at it, dont animate it!
        this.enabled.x = false;
        this.enabled.y = false;
      }
    }
  }
}