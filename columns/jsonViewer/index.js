const templateCell_$PLUGIN_ID = document.createElement("template");
templateCell_$PLUGIN_ID.innerHTML = `
<style>
    #container { 
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: space-between;
        height: 100%;
        width: calc(100% - 16px);
        padding: 0 8px;
        font-family: var(--ob-cell-font-family);
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
        font-family: var(--ob-cell-font-family);
        color: var(--ob-text-color);
        font-size: 12px;
        font-weight: 400;
        font-style: normal;
    }
    input:focus {
        outline: none;
    }
    #view-json {
        color: var(--ob-text-color);
        text-align: center;
        font-family: var(--ob-cell-font-family);
        background-color: var(--ob-background-color);
        border-radius: 5px;
        filter: invert(100%);
        border: 0px;
        width: 22px;
        height: 18px;
    }

svg {
  padding: 2px;
  background-color: var(--ob-background-color);
  fill: var(--ob-text-color);
  cursor: pointer;
}
svg:hover {
  opacity: .8;
}
</style>
<div id="container">
    <input type="text" id="jsonValue" placeholder="Enter JSON...">
    <svg id="view-json" xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 256 256"><path d="M43.18,128a29.78,29.78,0,0,1,8,10.26c4.8,9.9,4.8,22,4.8,33.74,0,24.31,1,36,24,36a8,8,0,0,1,0,16c-17.48,0-29.32-6.14-35.2-18.26-4.8-9.9-4.8-22-4.8-33.74,0-24.31-1-36-24-36a8,8,0,0,1,0-16c23,0,24-11.69,24-36,0-11.72,0-23.84,4.8-33.74C50.68,38.14,62.52,32,80,32a8,8,0,0,1,0,16C57,48,56,59.69,56,84c0,11.72,0,23.84-4.8,33.74A29.78,29.78,0,0,1,43.18,128ZM240,120c-23,0-24-11.69-24-36,0-11.72,0-23.84-4.8-33.74C205.32,38.14,193.48,32,176,32a8,8,0,0,0,0,16c23,0,24,11.69,24,36,0,11.72,0,23.84,4.8,33.74a29.78,29.78,0,0,0,8,10.26,29.78,29.78,0,0,0-8,10.26c-4.8,9.9-4.8,22-4.8,33.74,0,24.31-1,36-24,36a8,8,0,0,0,0,16c17.48,0,29.32-6.14,35.2-18.26,4.8-9.9,4.8-22,4.8-33.74,0-24.31,1-36,24-36a8,8,0,0,0,0-16Z"></path></svg>
</div>
`;

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
    console.log("This is it before all that goes on", decodedJSON);
    try {
      const decodedAttribute = JSON.stringify(JSON.parse(decodedJSON));
      return decodedAttribute;
    } catch (e) {
      return decodedJSON;
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
    const editJSONButton = this.shadow.getElementById("view-json");
    const cell = this.shadow.getElementById("jsonValue");
    const cellValue = this.decodeAttributeByName(this, "cellvalue");
    console.log('Cell Value after decoded')
    cell.value = cellValue;

    cell.addEventListener("focus", () => {
      this.callCustomEvent({
        action: "onstopedit",
        value: true,
      });
    })

    cell.addEventListener("blur", () => {
      this.callCustomEvent({
        action: "updatecell",
        value: cell.value,
      });

      this.callCustomEvent({
        action: "onstopedit",
        value: true,
      });
    });

    cell.addEventListener("keydown", (e) => {
      if (e.code == "Enter" && e.shiftKey) {
        return;
      }
      if (e.code != "Enter") {
        return;
      }

      this.callCustomEvent({
        action: "updatecell",
        value: cell.value,
      });

      this.callCustomEvent({
        action: "onstopedit",
        value: true,
      });
      cell.blur();
    });

    editJSONButton.addEventListener("click", () => {
      this.callCustomEvent({
        action: "onedit",
        value: true,
      });
    });
  }

  callCustomEvent(data) {
    const event = createCustomEvent_$PLUGIN_ID(data);
    this.dispatchEvent(event);
  }
}
const CELL_RENDERER_NAME_$PLUGIN_ID = "outerbase-plugin-cell-$PLUGIN_ID";
const CELL_EDITOR_NAME_$PLUGIN_ID = "outerbase-plugin-editor-$PLUGIN_ID";
const templateEditor_$PLUGIN_ID = document.createElement("template");
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
    #container {
      margin-top: 4px;
    }

    #jsonEditor {
        width: 314px;
        height: 165px;
        border-radius: 20px;
        color: var(--ob-text-color);
        border-color: var(--ob-border-color);
        background-color: var(--ob-background-color);
    }

    input:focus {
        outline: none;
    }

</style>
<div id="container">
    <textarea
        id="jsonEditor"
    ></textarea>
</div>
`;

class OuterbasePluginConfig_$PLUGIN_ID {
  constructor(object) {}
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
      console.log("Im stringifying and parsing", decodedJSON);
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
    try {
      const parsedJSON = JSON.parse(cellValue);
      jsonEditor.innerHTML = JSON.stringify(parsedJSON, undefined, 2);
    } catch {
      jsonEditor.innerHTML = cellValue;
    }

    jsonEditor.addEventListener("blur", (ev) => {
      try {
        this.callCustomEvent({
          action: "updatecell",
          value: jsonEditor.value,
        });
      } catch (e) {
        this.callCustomEvent({
          action: "updatecell",
          value: jsonEditor.value,
        });
      }
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

      if (JSON.parse(cellValue) === JSON.parse(jsonEditor.value)){
        this.callCustomEvent({
          action: "updatecell",
          value: cellValue,
        });
      }
      console.log('Comparing', JSON.stringify(JSON.parse(cellValue)) === JSON.stringify(JSON.parse(jsonEditor.value)),)
      this.callCustomEvent({
        action: "updatecell",
        value: jsonEditor.value,
      });

      this.callCustomEvent({
        action: "onstopedit",
        value: true,
      });
    });
  }
  callCustomEvent(data) {
    const event = createCustomEvent_$PLUGIN_ID(data);
    this.dispatchEvent(event);
  }
}

const createCustomEvent_$PLUGIN_ID = (data) =>
  new CustomEvent("custom-change", {
    detail: data,
    bubbles: true, // If you want the event to bubble up through the DOM
    composed: true, // Allows the event to pass through shadow DOM boundaries
  });

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define(
  CELL_RENDERER_NAME_$PLUGIN_ID,
  OuterbasePluginCell_$PLUGIN_ID
);
window.customElements.define(
  CELL_EDITOR_NAME_$PLUGIN_ID,
  OuterbasePluginEditor_$PLUGIN_ID
);
