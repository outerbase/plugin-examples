var privileges_$PLUGIN_ID = ["cellValue", "configuration", "metadata"];

var OuterbaseEvent_$PLUGIN_ID = {
  // The user has triggered an action to save updates
  onSave: "onSave",
};

var triggerEvent_$PLUGIN_ID = (fromClass, data) => {
  const event = new CustomEvent("change", {
    detail: data,
    bubbles: true,
    composed: true,
  });

  fromClass.dispatchEvent(event);
};

var decodeAttributeByName_$PLUGIN_ID = (fromClass, name) => {
  const encodedJSON = fromClass.getAttribute(name);
  const decodedJSON = encodedJSON
    ?.replace(/&quot;/g, '"')
    ?.replace(/&#39;/g, "'");
  return decodedJSON ? JSON.parse(decodedJSON) : {};
};

var templateCell_$PLUGIN_ID = document.createElement("template");
templateCell_$PLUGIN_ID.innerHTML = `
<style>
    #container { 
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: space-between;
        height: 100%;
        width: calc(100% - 20px);
        padding: 0 10px;
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
        font-family: Inter, Helvetica, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
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
    <input type="text" id="image-value" placeholder="NULL">

    <div id="action-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 256 256"><path d="M43.18,128a29.78,29.78,0,0,1,8,10.26c4.8,9.9,4.8,22,4.8,33.74,0,24.31,1,36,24,36a8,8,0,0,1,0,16c-17.48,0-29.32-6.14-35.2-18.26-4.8-9.9-4.8-22-4.8-33.74,0-24.31-1-36-24-36a8,8,0,0,1,0-16c23,0,24-11.69,24-36,0-11.72,0-23.84,4.8-33.74C50.68,38.14,62.52,32,80,32a8,8,0,0,1,0,16C57,48,56,59.69,56,84c0,11.72,0,23.84-4.8,33.74A29.78,29.78,0,0,1,43.18,128ZM240,120c-23,0-24-11.69-24-36,0-11.72,0-23.84-4.8-33.74C205.32,38.14,193.48,32,176,32a8,8,0,0,0,0,16c23,0,24,11.69,24,36,0,11.72,0,23.84,4.8,33.74a29.78,29.78,0,0,0,8,10.26,29.78,29.78,0,0,0-8,10.26c-4.8,9.9-4.8,22-4.8,33.74,0,24.31-1,36-24,36a8,8,0,0,0,0,16c17.48,0,29.32-6.14,35.2-18.26,4.8-9.9,4.8-22,4.8-33.74,0-24.31,1-36,24-36a8,8,0,0,0,0-16Z"></path></svg>
    </div>
</div>
`;

var templateEditor_$PLUGIN_ID = document.createElement("template");
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        margin-top: 4px;
        padding: 10px;
        width: 320px;
        height: 320px;
        border: 1px solid black;
        border-radius: 8px;
        overflow: hidden;
        background-color: black; /* <-- This should change based on theme */
    }
</style>

<div id="container">
    <outerbase-editor id="editor" mode="dark" language="javascript" theme="invasion"></outerbase-editor>
</div>
`;

/**
 * 1. Use `<outerbase-editor>` in the plugin directly
 * 2. Listen for the `event.detail.code` change on each keystroke
 * 3. Send the change to Starboard to update the cell value
 * 4. Pass in starboard
 */

// This is the configuration object that Outerbase passes to your plugin.
// Define all of the configuration options that your plugin requires here.
class OuterbasePluginConfig_$PLUGIN_ID {
  baseURL = "";
  theme = "light";

  constructor(object) {
    this.baseURL = object?.baseUrl ?? "";
    this.theme = object?.theme ? object.theme : "light";
  }
}

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return privileges_$PLUGIN_ID;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();

    this.attributeChangedCallback = this.attributeChangedCallback.bind(this);
    this.connectedCallback = this.connectedCallback.bind(this);
    this.callCustomEvent = this.callCustomEvent.bind(this);

    // The shadow DOM is a separate DOM tree that is attached to the element.
    // This allows us to encapsulate our styles and markup. It also prevents
    // styles from the parent page from leaking into our plugin.
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      templateCell_$PLUGIN_ID.content.cloneNode(true)
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      decodeAttributeByName_$PLUGIN_ID(this, "configuration")
    );

    let metadata = decodeAttributeByName_$PLUGIN_ID(this, "metadata");
    this.config.theme = metadata?.theme;

    var element = this.shadowRoot.querySelector(".theme-container");
    element.classList.remove("dark");
    element.classList.add(this.config.theme);
  }

  // This function is called when the UI is made available into the DOM. Put any
  // logic that you want to run when the element is first stood up here, such as
  // event listeners, default values to display, etc.
  connectedCallback() {
    // Parse the configuration object from the `configuration` attribute
    // and store it in the `config` property.
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      JSON.parse(this.getAttribute("configuration"))
    );

    // Set default value based on input
    this.shadowRoot.querySelector("#image-value").value =
      this.getAttribute("cellvalue");

    var imageInput = this.shadowRoot.getElementById("image-value");
    var viewImageButton = this.shadowRoot.getElementById("action-button");

    if (imageInput && viewImageButton) {
      const emit = this.callCustomEvent.bind(this);
      // TODO This listener should be removed?
      viewImageButton.addEventListener("click", () => {
        emit({
          action: "onedit",
          value: true,
        });
      });
    }
  }

  callCustomEvent(data) {
    const event = new CustomEvent("plugin-change", {
      detail: data,
      bubbles: true, // If you want the event to bubble up through the DOM
      composed: true, // Allows the event to pass through shadow DOM boundaries
    });

    this.dispatchEvent(event);
  }
}

class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return privileges_$PLUGIN_ID;
  }

  constructor() {
    super();

    // this.attributeChangedCallback = this.attributeChangedCallback.bind(this);
    this.connectedCallback = this.connectedCallback.bind(this);

    // The shadow DOM is a separate DOM tree that is attached to the element.
    // This allows us to encapsulate our styles and markup. It also prevents
    // styles from the parent page from leaking into our plugin.
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      templateEditor_$PLUGIN_ID.content.cloneNode(true)
    );

    // Parse the configuration object from the `configuration` attribute
    // and store it in the `config` property.
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      JSON.parse(this.getAttribute("configuration"))
    );
  }

  // This function is called when the UI is made available into the DOM. Put any
  // logic that you want to run when the element is first stood up here, such as
  // event listeners, default values to display, etc.
  connectedCallback() {
    if (this.config.theme === "light") {
      this.shadowRoot.querySelector("#container").style.backgroundColor =
        "white";
    } else {
      this.shadowRoot.querySelector("#container").style.backgroundColor =
        "black";
    }

    this.editor = this.shadowRoot.getElementById("editor");
    this.editor.setAttribute("code", this.getAttribute("cellvalue"));
    this.editor.addEventListener("editor-change", (event) => {
      event.stopPropagation();
      const {
        detail: { value: jsonString },
      } = event;

      try {
        const value = JSON.parse(jsonString);
        this.dispatchEvent(
          new CustomEvent("plugin-change", {
            bubbles: true,
            composed: true,
            detail: {
              action: "updatecell",
              value,
            },
          })
        );
      } catch (err) {
        console.error(err);
      }
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        let metadata = decodeAttributeByName_$PLUGIN_ID(this, "metadata")
        this.config.theme = metadata?.theme

        // Set the `mode` attribute of id `editor` to value of `theme`
        var editor = this.shadowRoot.getElementById("editor")
        if (editor) {
            editor.setAttribute("mode", this.config.theme)
        }
  }
}

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
