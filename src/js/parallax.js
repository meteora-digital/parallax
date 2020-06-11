// Helpers
import {attach, offsetY} from '@meteora-digital/helpers';

// const attach = require('@meteora-digital/helpers/dist/js/attach');
// const offsetY = require('@meteora-digital/helpers/dist/js/offsetY');

// Class
export default class ParallaxBackground {
	constructor(container, scale = false) {
		// Initialise data
		this.media = {};
		this.container = {};

		this.settings = {
			scale: scale,
			throttle: 250,
			scrollPercent: 0,
			minDistance: 1,
			distance: 0,
			enabled: true,
			movement: null,
		}

		// Find the elements
		this.container.element = container;
		this.media.element = this.container.element.querySelector('[data-parallax-watch]');

		// If we have elements, then start the function
		if (this.container.element && this.media.element) this.init();
	}

	resize() {
		// Container data
		this.container.offset = offsetY(this.container.element);
		this.settings.distance = this.media.element.clientHeight - this.container.element.clientHeight;
		
		this.media.y = this.settings.distance / 100 * this.getScrollPercent();
	}

	init() {
		// Initialise the scale of the media
		if (this.settings.scale) this.media.element.style.height = this.settings.scale * 100 + '%';

		this.media.element.style.transition = 'transform .25s ease-out';

		// Update our data
		this.resize();

		// Add events
		this.events();
	}

	events() {
		attach(window, 'resize', () => {
			this.resize();
		}, this.settings.throttle);

		attach(window, 'scroll', () => {
			if (this.settings.enabled === false) {
				this.settings.enabled = true;
				this.parallax();
			}
		}, 50);

		this.parallax();
	}

	getScrollPercent() {
		const distance = (window.pageYOffset + window.innerHeight) - (this.container.offset);
		const percentage = Math.round(distance / ((window.innerHeight + (this.container.element.clientHeight)) / 100));

		return (Math.min(100, Math.max(0, percentage)) - 100);
	}

	parallax() {
		if (this.settings.enabled) {
			this.settings.scrollPercent = this.getScrollPercent();

			if (this.settings.scrollPercent > -100 && this.settings.scrollPercent < 0) {
				this.movement = this.settings.scrollPercent / 100 * this.settings.distance;

				if (this.media.y > this.movement + this.settings.minDistance || this.media.y < this.movement - this.settings.minDistance) {
					this.media.y = this.movement;
					this.media.element.style.transform = `translateY(${this.media.y}px)`;

				}else {
					this.settings.enabled = false;
				}

			}else {
				this.settings.enabled = false;
			}

			window.requestAnimationFrame(() => this.parallax());
		}
	}

	// parallax() {
	// 	if (this.settings.enabled) {
	// 		this.settings.scrollPercent = this.getScrollPercent();

	// 		if (this.settings.scrollPercent > -99 && this.settings.scrollPercent < -1) {
	// 			let percentage = this.settings.distance / 100 * this.settings.scrollPercent;

	// 			if (this.media.y > percentage + this.settings.minDistance || this.media.y < percentage - this.settings.minDistance) {
	// 				if (this.media.element.clientHeight > this.container.element.clientHeight) {
	// 					this.media.y += scaleDifference(this.media.y, percentage) * 10;
	// 				}else {
	// 					this.media.y -= scaleDifference(this.media.y, percentage) * 10;
	// 				}

	// 				this.media.element.style.transform = `translateY(${this.media.y}px)`;
	// 			}else {
	// 				this.settings.enabled = false;
	// 			}
	// 		}else {
	// 			this.settings.enabled = false;
	// 		}

	// 		window.requestAnimationFrame(() => this.parallax());
	// 	}
	// }
}