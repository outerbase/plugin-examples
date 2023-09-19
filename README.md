# Getting started with Outerbase Plugins

This guide helps you create plugins that fit well and look good within the Outerbase platform. Using Tailwind CSS and Web Components, our approach offers flexibility and ease of customization. Here you'll find guidelines on color, typography, and borders, along with tips for using Web Components effectively.

---
## ⚡ Getting Started

This project uses [npm](https://www.npmjs.com/) and [webpack](https://webpack.js.org/) to supercharge your development and make it easier to see your changes right after you save. Getting things setup is simple!
1. Install `npm`
2. Run `npm install`
3. Run `npm run dev`

Feel free to [read up on how to create a plugin with Outerbase](https://docs.outerbase.com/docs/plugins/introduction) and get started creating your very own plugin! ✨

---

## 🕸️ Web Components

Web components empower you to create reusable, encapsulated custom elements that enrich your plugins. Whether you're a seasoned developer or new to web components, this section will guide you through defining and styling them in the context of Outerbase.

### How to Define a Web Component

Here's a simple example to get you started with defining a web component:

```javascript
class MyComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<p>Hello, Web Component!</p>`;
  }
}

customElements.define('my-component', MyComponent);
```

### Styling Web Components

To align your web components with our style guide, you can use inline styles or include a `<style>` tag within the `shadow DOM`.

```javascript
class StyledComponent extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        /* Add your Tailwind classes or custom CSS here */
      </style>
      <p class="font-inter font-regular text-14 text-neutral-700 dark:text-neutral-300">Styled Body Text</p>
    `;
  }
}

customElements.define('styled-component', StyledComponent);
```

---

Feel free to use this style guide as a reference when creating your Outerbase plugins. If you have any questions or suggestions, please don't hesitate to contribute or reach out. Happy coding! 🎉
## 🎨 Color Palette

- **Background**: `neutral-50` for light mode, `dark:neutral-950` for dark mode
- **Text (Header)**: `neutral-950` for light mode, `dark:neutral-50` for dark mode
- **Text (Body)**: `neutral-700` for light mode, `dark:neutral-300` for dark mode
- **Text (Label)**: `neutral-950` for light mode, `dark:neutral-50` for dark mode
- **Text (Code)**: `neutral-700` for light mode, `dark:neutral-300` for dark mode
- **Borders**: `neutral-200` for light mode, `dark:neutral-800` for dark mode

---

## 📝 Typography

- **Header**: 
  - Font: Inter
  - Weight: Semibold
  - Size: 24px
- **Body**: 
  - Font: Inter
  - Weight: Regular
  - Size: 14px
- **Label**: 
  - Font: Inter
  - Weight: Semibold
  - Size: 12px
- **Code**: 
  - Font: Input Mono
  - Weight: Regular
  - Size: 14px

---

## 📏 Borders

- Width: 1px
- Style: Solid

---

## 🌓 Modes

- **Light Mode**: Use the default colors specified above.
- **Dark Mode**: Use the `dark:` prefixed colors.

---

Feel free to use this style guide as a reference when creating your plugins. If you have any questions or suggestions, please don't hesitate to contribute or reach out. Happy coding! 🎉
