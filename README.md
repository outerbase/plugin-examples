# Getting started with Outerbase Plugins

This guide helps you create plugins that fit well and look good within the Outerbase platform. Using Web Components, our approach offers flexibility and ease of customization. Here you'll find guidelines on color, typography, and borders, along with tips for using Web Components effectively.


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

In your project, we've defined a set of named CSS variables so that you align your web components with our style guide. These variables make it easy to customize the look and feel of your components while adhering to a shared design system.

```javascript
class StyledComponent extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .paragraph {
          background-color: var(--ob-background-color);
          font-family: var(--ob-font-family);
          width: 25px;
        }
      </style>
      <p class="paragraph">Styled Body Text</p>
    `;
  }
}

customElements.define('styled-component', StyledComponent);
```

#### Available CSS Variables

Here are the named CSS variables available for use in your web components:

```css
    --ob-background-color: #0A0A0A;
    --ob-text-color: #D4D4D4;
    --ob-border-color: #262626;
    --ob-font-family: "Inter", sans-serif;    
    --ob-cell-font-family: "input-mono", monospace;
```
---


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

Feel free to use this style guide as a reference when creating your Outerbase plugins. If you have any questions or suggestions, please don't hesitate to contribute or reach out. Happy coding! 🎉