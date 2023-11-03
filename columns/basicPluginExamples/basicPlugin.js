// Any variable you define in default scope must have $PLUGIN_ID appeneded to it.

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

    cellInput.onclick = () => {
      const bringUpEditorView = {
        action: "onedit",
        value: true,
      };
      const event = new CustomEvent("custom-change", {
        detail: bringUpEditorView,
        bubbles: true, // If you want the event to bubble up through the DOM
        composed: true, // Allows the event to pass through shadow DOM boundaries
      });
      this.dispatchEvent(event);
    };
  }
}
window.customElements.define(
  "outerbase-plugin-cell-$PLUGIN_ID",
  OuterbasePluginCell_$PLUGIN_ID
);

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

    textAreaInput.onkeydown = (e) => {
      // We only want to update after the user presses enter
      if (e.key !== "Enter") return;

      const saveValue = {
        action: "updatecell",
        value: Number(textAreaInput.value),
      };
      const closeEditor = {
        action: "onstopedit",
        value: true,
      };
      console.log("Saving the value as", textAreaInput.value);
      const saveValueToOuterbaseCell = new CustomEvent("custom-change", {
        detail: saveValue,
        bubbles: true, // If you want the event to bubble up through the DOM
        composed: true, // Allows the event to pass through shadow DOM boundaries
      });
      const closeEditorView = new CustomEvent("custom-change", {
        detail: closeEditor,
        bubbles: true, // If you want the event to bubble up through the DOM
        composed: true, // Allows the event to pass through shadow DOM boundaries
      });
      this.dispatchEvent(saveValueToOuterbaseCell);
      this.dispatchEvent(closeEditorView);
    };
  }
}
window.customElements.define(
  "outerbase-plugin-editor-$PLUGIN_ID",
  OuterbasePluginEditor_$PLUGIN_ID
);
