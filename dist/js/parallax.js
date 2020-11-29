function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Helpers
import { objectAssign, attach, offset, getTransformValues } from '@meteora-digital/helpers'; // Class

var ParallaxBackground = /*#__PURE__*/function () {
  function ParallaxBackground(container) {
    var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, ParallaxBackground);

    // Initialise data
    this.media = {};
    this.container = {};
    this.deadzone = 0.005;
    this.scrollPercent = 0;
    this.direction = objectAssign({
      x: 0,
      y: 1
    }, direction);
    this.transform = {
      x: -50,
      y: -50
    };
    this.enabled = {
      x: false,
      y: false
    }, this.current = {
      x: 0,
      y: 0
    }, this.distance = {
      x: 0,
      y: 0
    };
    this.direction = {
      x: Math.round(Math.min(1, Math.max(-1, this.direction.x))),
      y: Math.round(Math.min(1, Math.max(-1, this.direction.y)))
    }; // Find the elements

    this.container.element = container;
    this.media.element = this.container.element.querySelector('[data-parallax-watch]'); // If we have elements, then start the function

    if (this.container.element && this.media.element) this.init();
  }

  _createClass(ParallaxBackground, [{
    key: "resize",
    value: function resize() {
      // Container data
      this.container.offset = offset(this.container.element).y;
      this.distance.y = this.container.element.clientHeight / this.media.element.clientHeight * 100 - 100;
      this.distance.x = this.container.element.clientWidth / this.media.element.clientWidth * 100 - 100;
      this.media.x = this.distance / 100 * this.getScrollPercent();
      this.media.y = this.distance / 100 * this.getScrollPercent();
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;

      // Update our data
      this.resize(); // Add events

      this.events(); // Initialise the x transform

      if (this.direction.x != 0) {
        this.enabled.x = true;
        this.transform.x = this.distance.x / 100 * this.getScrollPercent() - 50;
      } // Initialise the y transform


      if (this.direction.y != 0) {
        this.enabled.y = true;
        this.transform.y = this.distance.y / 100 * this.getScrollPercent() - 50;
      } // Initialise the element transform


      this.media.element.style.transform = "translateX(".concat(this.transform.x, "%) translateY(").concat(this.transform.y, "%)");
      setTimeout(function () {
        // this.media.element.style.transition = 'transform .25s ease-out';
        _this.media.element.style.top = '50%';
        _this.media.element.style.left = '50%';
      }, 100);
    }
  }, {
    key: "events",
    value: function events() {
      var _this2 = this;

      attach(window, 'resize', function () {
        return _this2.resize();
      }, 250);
      attach(window, 'scroll', function () {
        if (_this2.enabled.x === false || _this2.enabled.y === false) {
          if (_this2.distance.x != 0 && _this2.direction.x != 0) _this2.enabled.x = true;
          if (_this2.distance.y != 0 && _this2.direction.y != 0) _this2.enabled.y = true;

          _this2.parallax();
        }
      }, 50);
      setTimeout(function () {
        return _this2.parallax();
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

      // Only loop when we have scrolled
      if (this.enabled.x || this.enabled.y) {
        // console.log(this.enabled);
        this.scrollPercent = this.getScrollPercent(); // Check that the value is within the viewport with our scroll percentage function

        if (this.scrollPercent > -50 && this.scrollPercent < 50) {
          // grab our current transform percentage
          this.current = {
            x: getTransformValues(this.media.element).translateX / this.media.element.clientWidth * 100,
            y: getTransformValues(this.media.element).translateY / this.media.element.clientHeight * 100
          };

          if (this.enabled.x) {
            // grab the needed transform value
            this.movementX = this.distance.x / 100 * this.scrollPercent - 50 * this.direction.x; // calculate the difference

            this.differenceX = (Math.abs(this.current.x) - Math.abs(this.movementX)) / Math.abs(this.current.x);

            if (this.current.x < this.movementX - this.deadzone || this.current.x > this.movementX + this.deadzone) {
              // update the media's transform css
              this.transform.x = Math.round((this.current.x + this.differenceX) * 10000) / 10000;
            } else {
              // if we if our deadzone, exit the loop
              this.enabled.x = false;
            }
          } else {
            // there is no animation required so parallax is not needed
            this.enabled.x = false;
          }

          if (this.enabled.y) {
            // grab the needed transform value
            this.movementY = this.distance.y / 100 * this.scrollPercent - 50 * this.direction.y; // calculate the difference

            this.differenceY = (Math.abs(this.current.y) - Math.abs(this.movementY)) / Math.abs(this.current.y);

            if (this.current.y < this.movementY - this.deadzone || this.current.y > this.movementY + this.deadzone) {
              // update the media's transform css
              if (this.direction.y != 0) {
                this.transform.y = Math.round((this.current.y + this.differenceY) * 10000) / 10000;
              }
            } else {
              // if we if our deadzone, exit the loop
              this.enabled.y = false;
            }
          } else {
            // there is no animation required so parallax is not needed
            this.enabled.y = false;
          } // Add the element's transform


          this.media.element.style.transform = "translateX(".concat(this.transform.x, "%) translateY(").concat(this.transform.y, "%)"); // repeat the function

          window.requestAnimationFrame(function () {
            return _this3.parallax();
          });
        } else {
          // if we're not looking at it, dont animate it!
          this.enabled.x = false;
          this.enabled.y = false;
        }
      }
    }
  }]);

  return ParallaxBackground;
}();

export { ParallaxBackground as default };