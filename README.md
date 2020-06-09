# Parallax

An easy to use parallax class.

## Installation

with webpack

```bash
yarn add parallax-background
```

## Usage

```html
<div class="banner" data-parallax>
	<div class="banner__background" style="background-image: url('your/image/directory');" data-parallax-watch></div>
</div>
```

```es6
import Parallax from 'parallax-background';

const banner = document.querySelectorAll('[data-parallax]');

const myParallax = new Parallax(banner);

```

```scss
.banner {
	position: relative;
	height: 600px;

	&__background {
		position: absolute;
		top: 0;
		left: 0;
		height: 130%;
		width: 100%;
	}
}
```

```es6
import Parallax from 'parallax-background';

const banner = document.querySelectorAll('[data-parallax]');

const myParallax = new Parallax(banner);

```

## Options

set the height of the banner to 130% the height of the parent.

```es6
new Parallax(banner, 1.3);
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

