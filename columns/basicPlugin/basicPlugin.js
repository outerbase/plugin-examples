const templateEditor_$PLUGIN_ID = document.createElement("template");
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
</style>
<div>
    <h1>The Editor View</h1>
    <textarea id="userInputEditor"></textarea>
</div>
`;
class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateEditor_$PLUGIN_ID.content.cloneNode(true));
  }
  connectedCallback() {
    const textAreaInput = this.shadow.getElementById("userInputEditor");
    const cellValue = this.getAttribute("cellvalue");
    textAreaInput.value = cellValue;
  }
}
window.customElements.define(
  "outerbase-plugin-editor-$PLUGIN_ID",
  OuterbasePluginEditor_$PLUGIN_ID
);

// Define your HTML for the cell that renders in HTML
const templateCell_$PLUGIN_ID = document.createElement("template");
templateCell_$PLUGIN_ID.innerHTML = `
<style>
</style>
<div id="container" class="theme-container">
    <input id="userInput" type="text"/>
</div>
`;

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateCell_$PLUGIN_ID.content.cloneNode(true));
  }

  connectedCallback() {
    const cellValueFromOuterbase = this.getAttribute("cellvalue");
    const cellInput = this.shadow.getElementById("userInput");
    cellInput.value = cellValueFromOuterbase;
  }
}
window.customElements.define(
  "outerbase-plugin-cell-$PLUGIN_ID",
  OuterbasePluginCell_$PLUGIN_ID
);
