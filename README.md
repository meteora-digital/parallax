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

Set the direction of the parallax - note, our image needs to be larger or smaller than the container to parallax, if it is the same size, nothing will happen.
All numbers will be rounded to either -1, 0 or 1.

```es6
new Parallax(banner, {
	x: 0,
	y: 1,
});
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| x | number | 1 will move the image to the right, -1 will move the image to the left, 0 will not move the image | 
| y | number | 1 will move the image down, -1 will move the image up, 0 will not move the image | 

## License
[MIT](https://choosealicense.com/licenses/mit/)

