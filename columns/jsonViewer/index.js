const templateCell_$PLUGIN_ID = document.createElement("template");
templateCell_$PLUGIN_ID.innerHTML = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200&display=swap" rel="stylesheet">
<style>
    #container { 
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: space-between;
        height: 100%;
        width: calc(100% - 16px);
        padding: 0 8px;
        font-family: var(--ob-font-family);
        color: var(--ob-text-color);
    }
    input {
        height: 100%;
        flex: 1;
        background-color: transparent;
        border: 0;
        min-width: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    input:focus {
        outline: none;
    }
    #view-json {
        color: var(--ob-text-color);
        text-align: center;
        font-family: var(--ob-font-family);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        letter-spacing: 1.2px;
        background-color: var(--ob-background-color);
        border-radius: 5px;
        filter: invert(100%);
        border: 0px;
        padding: 5px;
    }
</style>
<div id="container">
    <input type="text" id="jsonValue" placeholder="Enter JSON...">
    <button id="view-json">{;}</button>
</div>
`;

const templateEditor_$PLUGIN_ID = document.createElement("template");
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        max-width: 400px;
    }

    #jsonEditor {
        width: 250px;
        height: 250px;
    }
    input:focus {
        outline: none;
    }
</style>
<div>
    <textarea
        id="jsonEditor"
    ></textarea>
</div>
`;

// No Configuration needed
class OuterbasePluginConfig_$PLUGIN_ID {
  constructor(object) {}
}

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return ["cellvalue"];
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.appendChild(templateCell_$PLUGIN_ID.content.cloneNode(true));
  }
  decodeAttributeByName = (fromClass, name) => {
    const encodedJSON = fromClass.getAttribute(name);
    const decodedJSON = encodedJSON
      ?.replace(/&quot;/g, '"')
      ?.replace(/&#39;/g, "'");

    try {
      const decodedAttribute = JSON.stringify(JSON.parse(decodedJSON.replace( /\n/g, '' )));
      return decodedAttribute;
    } catch (e) {
      return JSON.stringify({});
    }
  };

  // This function is called when the UI is made available into the DOM. Put any
  // logic that you want to run when the element is first stood up here, such as
  // event listeners, default values to display, etc.
  connectedCallback() {
    // Parse the configuration object from the `configuration` attribute
    // and store it in the `config` property.
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      JSON.parse(this.getAttribute("configuration"))
    );

    let cellValue;
    cellValue = JSON.stringify(
      JSON.parse(this.decodeAttributeByName(this, "cellvalue")),
      undefined,
      2
    );
    const cell = this.shadow.getElementById("jsonValue");
    cell.value = cellValue;

    var jsonValue = this.shadow.getElementById("jsonValue");
    var viewImageButton = this.shadow.getElementById("view-json");

    jsonValue.addEventListener("focus", () => {
      this.callCustomEvent({
        action: "onstopedit",
        value: true,
      });
    });

    jsonValue.addEventListener("blur", () => {
      let jsonCellValue;
      try {
        jsonCellValue = JSON.stringify(
          JSON.parse(jsonValue.value),
          undefined,
          2
        );
      } catch (e) {
        jsonCellValue = JSON.stringify({});
      }
      this.callCustomEvent({
        action: "updatecell",
        value: jsonCellValue.replace( /\n/g, '' ),
      });

      this.callCustomEvent({
        action: "onstopedit",
        value: true,
      });
    });

    jsonValue.addEventListener("keydown", (e) => {
      if (e.code == "Enter" && e.shiftKey) {
        return;
      }
      if (e.code != "Enter") {
        return;
      }
      let jsonCellValue;
      try {
        jsonCellValue = JSON.stringify(
          JSON.parse(jsonValue.value),
          undefined,
          2
        );
      } catch (e) {
        jsonCellValue = JSON.stringify({});
      }
      this.callCustomEvent({
        action: "updatecell",
        value: jsonCellValue.replace( /\n/g, '' ),
      });

      this.callCustomEvent({
        action: "onstopedit",
        value: true,
      });
      jsonValue.blur();
    });
    viewImageButton.addEventListener("click", () => {
      this.callCustomEvent({
        action: "onedit",
        value: true,
      });
    });
  }

  callCustomEvent(data) {
    const event = createCustomEvent(data);
    this.dispatchEvent(event);
  }
}

class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return ["cellvalue"];
  }

  constructor() {
    super();

    // The shadow DOM is a separate DOM tree that is attached to the element.
    // This allows us to encapsulate our styles and markup. It also prevents
    // styles from the parent page from leaking into our plugin.
    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.appendChild(templateEditor_$PLUGIN_ID.content.cloneNode(true));

    // Parse the configuration object from the `configuration` attribute
    // and store it in the `config` property.
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      JSON.parse(this.getAttribute("configuration"))
    );
  }
  decodeAttributeByName = (fromClass, name) => {
    const encodedJSON = fromClass.getAttribute(name);
    const decodedJSON = encodedJSON
      ?.replace(/&quot;/g, '"')
      ?.replace(/&#39;/g, "'");

    try {
      return JSON.stringify(JSON.parse(decodedJSON));
    } catch (e) {
      return JSON.stringify({});
    }
  };

  // This function is called when the UI is made available into the DOM. Put any
  // logic that you want to run when the element is first stood up here, such as
  // event listeners, default values to display, etc.
  connectedCallback() {
    const cellValue = this.decodeAttributeByName(this, "cellvalue");

    const jsonEditor = this.shadow.getElementById("jsonEditor");
    jsonEditor.innerHTML = JSON.stringify(JSON.parse(cellValue), undefined, 2);

    jsonEditor.addEventListener("blur", (ev) => {
      let cellEditorValue;
      try {
        cellEditorValue = JSON.stringify(
          JSON.parse(jsonEditor.value),
          undefined,
          2
        );
      } catch (e) {
        cellEditorValue = JSON.stringify({});
      }

      this.callCustomEvent({
        action: "updatecell",
        value: cellEditorValue.replace( /\n/g, '' ),
      });

      this.callCustomEvent({
        action: "onstopedit",
        value: true,
      });
    });

    jsonEditor.addEventListener("keydown", (e) => {
      if (e.code == "Enter" && e.shiftKey) {
        return;
      }
      if (e.code != "Enter") {
        return;
      }
      e.preventDefault();

      let cellEditorValue;
      try {
        cellEditorValue = JSON.stringify(
          JSON.parse(jsonEditor.value.replace( /\n/g, '' )),
          undefined,
          2
        );
      } catch (e) {
        cellEditorValue = JSON.stringify({});
      }

      this.callCustomEvent({
        action: "updatecell",
        value: cellEditorValue.replace( /\n/g, '' ),
      });

      this.callCustomEvent({
        action: "onstopedit",
        value: true,
      });
    });
  }
  callCustomEvent(data) {
    const event = createCustomEvent(data);
    this.dispatchEvent(event);
  }
}

const createCustomEvent = (data) =>
  new CustomEvent("custom-change", {
    detail: data,
    bubbles: true, // If you want the event to bubble up through the DOM
    composed: true, // Allows the event to pass through shadow DOM boundaries
  });

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define(
  "outerbase-plugin-cell-$PLUGIN_ID",
  OuterbasePluginCell_$PLUGIN_ID
);
window.customElements.define(
  "outerbase-plugin-editor-$PLUGIN_ID",
  OuterbasePluginEditor_$PLUGIN_ID
);

