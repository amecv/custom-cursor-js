# Custom Cursor With UI interactions :sparkles:

Using vanilla JavaScript and CSS. Inspired in part bit the iPadOS mouse cursor interactions.

See on [CodePen](https://codepen.io/amecv/pen/JjLQjKO)

<img src="https://media.giphy.com/media/9qPw6B0HAnyUl4Bfbq/giphy.gif" style="width: 100%"/>

## Usage

Add the CSS and Javascript file in your HTML

```html
<link rel="stylesheet" href="customCursor.min.css">
<script src="customCursor.min.js"></script>
```

Add the `has-custom-cursor` class to your container, and add a div with id `custom-cursor`

```html
<div class="container has-custom-cursor">
    <div id="custom-cursor"></div>
    ...
</div>
```

You can customize the cursor using CSS Custom Properties on `.has-custom-cursor`

```css
--cursor-size: 20px;
--cursor-border-width: 1px;
--cursor-transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
--cursor-interaction-padding: 3px;
--cursor-color: #f7b32b;

```

Initialize the custom cursor in your JS

```js
startCustomCursor();
```

**Optional parameters:**

- list of elements to interact with as a string using CSS selector format

```js
startCustomCursor('button, a');
```

- disable "sticky" behaviour by using `false` as a seccond parameter

```js
startCustomCursor('button, a', false);
```