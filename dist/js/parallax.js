function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Helpers
import { attach, offsetY } from '@meteora-digital/helpers'; // Class

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
      distance: 1,
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
      this.settings.distance = this.container.element.clientHeight / this.media.element.clientHeight * 100 - 100;
      console.log(this.settings.distance);
      this.media.y = this.settings.distance / 100 * this.getScrollPercent();
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;

      // Initialise the scale of the media
      if (this.settings.scale) this.media.element.style.height = this.settings.scale * 100 + '%'; // Update our data

      this.resize(); // Add events

      this.events();
      this.media.element.style.transform = "translateY(".concat(this.settings.distance / 100 * this.getScrollPercent() - 50, "%)");
      setTimeout(function () {
        _this.media.element.style.transition = 'transform .25s ease-out';
        _this.media.element.style.top = '50%';
      }, 100);
    }
  }, {
    key: "events",
    value: function events() {
      var _this2 = this;

      attach(window, 'resize', function () {
        _this2.resize();
      }, this.settings.throttle);
      attach(window, 'scroll', function () {
        if (_this2.settings.enabled === false) {
          _this2.settings.enabled = true;

          _this2.parallax();
        }
      }, 50);
      setTimeout(function () {
        _this2.parallax();
      }, 100);
    }
  }, {
    key: "getScrollPercent",
    value: function getScrollPercent() {
      var distance = window.pageYOffset + window.innerHeight - this.container.offset;
      var percentage = Math.round(distance / ((window.innerHeight + this.container.element.clientHeight) / 100));
      return -(Math.min(100, Math.max(0, percentage)) - 50);
    }
  }, {
    key: "parallax",
    value: function parallax() {
      var _this3 = this;

      if (this.settings.enabled) {
        this.settings.scrollPercent = this.getScrollPercent();

        if (this.settings.scrollPercent > -50 && this.settings.scrollPercent < 50) {
          this.movement = this.settings.distance / 100 * this.settings.scrollPercent - 50;
          this.media.element.style.transform = "translateY(".concat(this.movement, "%)");
          this.settings.enabled = false;
        }

        window.requestAnimationFrame(function () {
          return _this3.parallax();
        });
      }
    }
  }]);

  return ParallaxBackground;
}();

export { ParallaxBackground as default };