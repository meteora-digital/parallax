function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Helpers
var attach = require('@meteora-digital/helpers/dist/js/attach');

var offsetY = require('@meteora-digital/helpers/dist/js/offsetY'); // Class


var ParallaxBackground = /*#__PURE__*/function () {
  function ParallaxBackground(container) {
    var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, ParallaxBackground);

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
      movement: null
    }; // Find the elements

    this.container.element = container;
    this.media.element = this.container.element.querySelector('[data-parallax-watch]'); // If we have elements, then start the function

    if (this.container.element && this.media.element) this.init();
  }

  _createClass(ParallaxBackground, [{
    key: "resize",
    value: function resize() {
      // Container data
      this.container.offset = offsetY(this.container.element);
      this.settings.distance = this.media.element.clientHeight - this.container.element.clientHeight;
      this.media.y = this.settings.distance / 100 * this.getScrollPercent();
    }
  }, {
    key: "init",
    value: function init() {
      // Initialise the scale of the media
      if (this.settings.scale) this.media.element.style.height = this.settings.scale * 100 + '%';
      this.media.element.style.transition = 'transform .25s ease-out'; // Update our data

      this.resize(); // Add events

      this.events();
    }
  }, {
    key: "events",
    value: function events() {
      var _this = this;

      attach(window, 'resize', function () {
        _this.resize();
      }, this.settings.throttle);
      attach(window, 'scroll', function () {
        if (_this.settings.enabled === false) {
          _this.settings.enabled = true;

          _this.parallax();
        }
      }, 50);
      this.parallax();
    }
  }, {
    key: "getScrollPercent",
    value: function getScrollPercent() {
      var distance = window.pageYOffset + window.innerHeight - this.container.offset;
      var percentage = Math.round(distance / ((window.innerHeight + this.container.element.clientHeight) / 100));
      return Math.min(100, Math.max(0, percentage)) - 100;
    }
  }, {
    key: "parallax",
    value: function parallax() {
      var _this2 = this;

      if (this.settings.enabled) {
        this.settings.scrollPercent = this.getScrollPercent();

        if (this.settings.scrollPercent > -100 && this.settings.scrollPercent < 0) {
          this.movement = this.settings.scrollPercent / 100 * this.settings.distance;

          if (this.media.y > this.movement + this.settings.minDistance || this.media.y < this.movement - this.settings.minDistance) {
            this.media.y = this.movement;
            this.media.element.style.transform = "translateY(".concat(this.media.y, "px)");
          } else {
            this.settings.enabled = false;
          }
        } else {
          this.settings.enabled = false;
        }

        window.requestAnimationFrame(function () {
          return _this2.parallax();
        });
      }
    } // parallax() {
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

  }]);

  return ParallaxBackground;
}();

export { ParallaxBackground as default };