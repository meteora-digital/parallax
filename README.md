# Parallax

An easy to use parallax class.

## Installation

with webpack

```bash
yarn add background-parallax
```

## Usage

```html
<div class="banner" data-parallax>
	<div class="banner__background" style="background-image: url('your/image/directory');" data-parallax-watch></div>
</div>
```

```es6
import Parallax from 'background-parallax';

const banner = document.querySelectorAll('[data-parallax]');

const myParallax = new Parallax(banner);

```

```scss
.banner {
	position: relative;
	height: 800px;
	overflow: hidden;

	&__background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 140%;
		background-position: center;
		background-size: cover;
	}
}
```

## Options

set the height of the banner to 130% the height of the parent.

```es6
new Parallax(banner, 1.3);
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

