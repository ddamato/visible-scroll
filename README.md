# [`<visible-scroll/>`](https://ddamato.github.io/visible-scroll/)

[![npm version](https://img.shields.io/npm/v/visible-scroll.svg)](https://www.npmjs.com/package/visible-scroll)

Attemps to keep the horizontal scrollbar visible in different overflow contexts.

## Install

The project is distributed as an [`IIFE`](https://developer.mozilla.org/en-US/docs/Glossary/IIFE), so the easiest way is to just create a script tag pointing to the export hosted on [unpkg](https://unpkg.com/).

```html
<script src="unpkg.com/visible-scroll" defer></script>
```

However, you can also install the package and add the script through some build process.

```html
<script src="dist/visible-scroll.iife.js" defer></script>
```

## Usage

Once the script is loaded, you can add the new component to a page.

```html
<visible-scroll>
  <!-- Some scrollable content -->
</visible-scroll>
```

Visibility depends on the user's device settings. If the user has configured the scrollbars to only show while scrolling, then the scrollbars will only be visible then.

## Customizing

You may update the following properties to adjust dimension of the scrollable container.

| Property | Description |
| -------- | ----------- |
| `--visible-scroll-max-width` | Sets the maximum width for the scrollable container. |
| `--visible-scroll-max-height` | Sets the maximum height for the scrollable container. |