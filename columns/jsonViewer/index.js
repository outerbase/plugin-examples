const templateCell_$PLUGIN_ID = document.createElement("template");
templateCell_$PLUGIN_ID.innerHTML = `
<style>
#container { 
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
  height: 100%;
  width: calc(100% - 36px);
  padding: 0 18px;
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
  font-size: 12px;
  color: var(--ob-text-color);
}

input:focus {
  outline: none;
}

#action-button {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid var(--ob-border-color);
  cursor: pointer;
}

#action-button:hover {
  opacity: 0.5;
}

#action-button > svg {
  width: 13px;
  height: 13px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#action-button > svg > path {
  fill: black;
}

.dark #action-button > svg > path {
  fill: white;
}
</style>
<div id="container" class="theme-container">
    <input type="text" id="jsonValue" placeholder="Enter JSON...">
    <div id="action-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 256 256"><path d="M43.18,128a29.78,29.78,0,0,1,8,10.26c4.8,9.9,4.8,22,4.8,33.74,0,24.31,1,36,24,36a8,8,0,0,1,0,16c-17.48,0-29.32-6.14-35.2-18.26-4.8-9.9-4.8-22-4.8-33.74,0-24.31-1-36-24-36a8,8,0,0,1,0-16c23,0,24-11.69,24-36,0-11.72,0-23.84,4.8-33.74C50.68,38.14,62.52,32,80,32a8,8,0,0,1,0,16C57,48,56,59.69,56,84c0,11.72,0,23.84-4.8,33.74A29.78,29.78,0,0,1,43.18,128ZM240,120c-23,0-24-11.69-24-36,0-11.72,0-23.84-4.8-33.74C205.32,38.14,193.48,32,176,32a8,8,0,0,0,0,16c23,0,24,11.69,24,36,0,11.72,0,23.84,4.8,33.74a29.78,29.78,0,0,0,8,10.26,29.78,29.78,0,0,0-8,10.26c-4.8,9.9-4.8,22-4.8,33.74,0,24.31-1,36-24,36a8,8,0,0,0,0,16c17.48,0,29.32-6.14,35.2-18.26,4.8-9.9,4.8-22,4.8-33.74,0-24.31,1-36,24-36a8,8,0,0,0,0-16Z"></path></svg>
    </div>
</div>
`;

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return ["cellvalue", "configuration"];
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateCell_$PLUGIN_ID.content.cloneNode(true));
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      this.decodeAttributeByName(this, "configuration")
    );

    let metadata = JSON.parse(this.decodeAttributeByName(this, "metadata"));
    this.config.theme = metadata?.theme;

    var element = this.shadow.querySelector(".theme-container");
    element.classList.remove("dark");
    element.classList.add(this.config.theme);
  }
  decodeAttributeByName = (fromClass, name) => {
    const encodedJSON = fromClass.getAttribute(name);
    const decodedJSON = encodedJSON
      ?.replace(/&quot;/g, '"')
      ?.replace(/&#39;/g, "'");

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
    const cell = this.shadow.getElementById("jsonValue");
    const cellValue = this.decodeAttributeByName(this, "cellvalue");

    // Handle NULL text coloring
    if (cellValue === "NULL") {
      cell.style.color = `var(--ob-null-text-color)`;
    } else {
      cell.style.color = `var(--ob-text-color)`;
    }

    try {
      const parsedCellValue = JSON.parse(cellValue);
      const prettyJSON = JSON.stringify(parsedCellValue);
      cell.value = prettyJSON;
    } catch {
      cell.value = cellValue;
    }

    var jsonValue = this.shadow.getElementById("jsonValue");
    var viewJSON = this.shadow.getElementById("action-button");

    jsonValue.addEventListener("focus", () => {
      this.callCustomEvent({
        action: "onstopedit",
        value: true,
      });
    });

    jsonValue.addEventListener("blur", () => {
      try {
        const parsedCellValue = JSON.parse(jsonValue.value);
        const prettyJSON = JSON.stringify(parsedCellValue);
        this.callCustomEvent({
          action: "updatecell",
          value: prettyJSON.replace(/\n/g, ""),
        });
        cell.value = prettyJSON;
      } catch {
        this.callCustomEvent({
          action: "updatecell",
          value: jsonValue.value.replace(/\n/g, ""),
        });
      }

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
      try {
        const parsedCellValue = JSON.parse(jsonValue.value);
        const prettyJSON = JSON.stringify(parsedCellValue);
        this.callCustomEvent({
          action: "updatecell",
          value: prettyJSON.replace(/\n/g, ""),
        });
        cell.value = prettyJSON;
      } catch {
        this.callCustomEvent({
          action: "updatecell",
          value: jsonValue.value.replace(/\n/g, ""),
        });
      }

      this.callCustomEvent({
        action: "onstopedit",
        value: true,
      });
      jsonValue.blur();
    });

    viewJSON.addEventListener("click", () => {
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
      width: 260px;
      margin-top: 4px;
    }

    #jsonOutput {
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

    .json-container {
        resize: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        outline: none;
        border: 1px solid #ccc;
        padding: 10px;
        margin: 10px;
        height: 200px; /* You can set the height as you want */
        font-family: var(--ob-cell-font-family);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 21px; /* 150% */
        border-radius: 6px;
        overflow: auto;
      }
      .json-light-key {
        color: green;
      }
      .json-light-value {
        color: red;
      }
      .json-light-string {
        color: blue;
      }
      .json-light-boolean {
        color: purple;
      }
      
      .json-dark-key {
        color: #98E491
      }
      .json-dark-value {
        color: #89BEFA;
      }
      .json-dark-string {
        color: #89BEFA;
      }
      .json-dark-boolean {
        color: #89BEFA;
      }

</style>
<div id="container">
    <div id="jsonOutput" class="json-container" contenteditable="true"></div>
</div>
`;

class OuterbasePluginConfig_$PLUGIN_ID {
  theme = "light";

  constructor(object) {
    this.theme = object?.theme ? object?.theme : "light";
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
    const metadata = this.decodeAttributeByName(this, "metadata");
    const syntaxColor = JSON.parse(metadata).theme;
    const cellValue = this.decodeAttributeByName(this, "cellvalue");
    const jsonEditor = this.shadow.getElementById("jsonOutput");
    try {
      const parsedJSON = JSON.parse(cellValue);
      jsonEditor.innerHTML = this.syntaxHighlight(
        JSON.stringify(parsedJSON, undefined, 2),
        syntaxColor
      );
    } catch {
      jsonEditor.innerHTML = cellValue;
    }

    jsonEditor.addEventListener("blur", (ev) => {
      try {
        const cleanedValue = JSON.stringify(JSON.parse(jsonEditor.innerText));
        this.callCustomEvent({
          action: "updatecell",
          value: cleanedValue.replace(/\n/g, ""),
        });
      } catch (e) {
        this.callCustomEvent({
          action: "updatecell",
          value: jsonEditor.innerText.replace(/\n/g, ""),
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

      try {
        const cleanedValue = JSON.stringify(JSON.parse(jsonEditor.innerText));

        this.callCustomEvent({
          action: "updatecell",
          value: cleanedValue.replace(/\n/g, ""),
        });
      } catch (e) {
        this.callCustomEvent({
          action: "updatecell",
          value: jsonEditor.innerText.replace(/\n/g, ""),
        });
      }

      this.callCustomEvent({
        action: "onstopedit",
        value: true,
      });
    });
  }

  syntaxHighlight(json, theme) {
    if (typeof json != "string") {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return json.replace(
      /("(\\u[a-fA-F\d]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      function (match) {
        var cls = `json-${theme}-value`;
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = `json-${theme}-key`;
          } else {
            cls = `json-${theme}-string`;
          }
        } else if (/true|false|null/.test(match)) {
          cls = `json-${theme}-boolean`;
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
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
