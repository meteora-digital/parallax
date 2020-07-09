// Helpers
import {attach, offsetY} from '@meteora-digital/helpers';

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
			distance: 1,
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
		this.settings.distance = (this.container.element.clientHeight / this.media.element.clientHeight * 100) - 100;

		console.log(this.settings.distance);

		this.media.y = this.settings.distance / 100 * this.getScrollPercent();
	}

	init() {
		// Initialise the scale of the media
		if (this.settings.scale) this.media.element.style.height = this.settings.scale * 100 + '%';

		// Update our data
		this.resize();

		// Add events
		this.events();

		this.media.element.style.transform = `translateY(${(this.settings.distance / 100 * this.getScrollPercent()) - 50}%)`;

		setTimeout(() => {
			this.media.element.style.transition = 'transform .25s ease-out';
			this.media.element.style.top = '50%';
		}, 100);
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

		setTimeout(() => {
			this.parallax();
		}, 100);
	}

	getScrollPercent() {
		const distance = (window.pageYOffset + window.innerHeight) - (this.container.offset);
		const percentage = Math.round(distance / ((window.innerHeight + (this.container.element.clientHeight)) / 100));

		return  - ((Math.min(100, Math.max(0, percentage)) - 50));
	}

	parallax() {
		if (this.settings.enabled) {
			this.settings.scrollPercent = this.getScrollPercent();

			if (this.settings.scrollPercent > -50 && this.settings.scrollPercent < 50) {
				this.movement = (this.settings.distance / 100 * this.settings.scrollPercent) - 50;

				this.media.element.style.transform = `translateY(${this.movement}%)`;

				this.settings.enabled = false;
			}

			window.requestAnimationFrame(() => this.parallax());
		}
	}
}