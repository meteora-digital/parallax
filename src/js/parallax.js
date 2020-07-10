// Helpers
import {attach, offsetY, getTransformValues} from '@meteora-digital/helpers';

// Class
export default class ParallaxBackground {
	constructor(container, scale = false) {
		// Initialise data
		this.media = {};
		this.container = {};

		this.settings = {
			scale: scale,
			scrollPercent: 0,
			threshold: .3,
			distance: 1,
			enabled: true,
			movement: null,
			current: null,
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
			// this.media.element.style.transition = 'transform .25s ease-out';
			this.media.element.style.top = '50%';
		}, 100);
	}

	events() {
		attach(window, 'resize', () => {
			this.resize();
		}, 250);

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
		// Only loop when we have scrolled
		if (this.settings.enabled) {
			this.settings.scrollPercent = this.getScrollPercent();

			// Check that the value is within the viewport with our scroll percentage function
			if (this.settings.scrollPercent > -50 && this.settings.scrollPercent < 50) {

				// grab our current transform percentage
				this.current = getTransformValues(this.media.element).translateY / this.media.element.clientHeight * 100;

				// grab the needed transform value
				this.movement = this.settings.distance / 100 * this.settings.scrollPercent - 50;

				// calculate the difference
				let difference = (Math.abs(this.current) - Math.abs(this.movement)) / Math.abs(this.current);

				// add a little threshold to avoid endless loops with maths that wont play nice :)
				if (this.current < this.movement - this.settings.threshold || this.current > this.movement + this.settings.threshold) {
					// update the media's transform css
					this.media.element.style.transform = `translateY(${Math.round((this.current + difference * 3) * 1000) / 1000}%)`;
				}else {
					// if we if our threshold, exit the loop
					this.settings.enabled = false;
				}

				// repeat the function
				window.requestAnimationFrame(() => this.parallax());
			} else {
				// if we're not looking at it, dont animate it!
				this.settings.enabled = false;
			}

		}
	}
}