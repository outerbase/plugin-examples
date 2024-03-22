var decodeAttributeByName = (fromClass, name) => {
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

var triggerEvent = (fromClass, data) => {
  const event = new CustomEvent("custom-change", {
    detail: data,
    bubbles: true,
    composed: true,
  });

  fromClass.dispatchEvent(event);
};

var privileges_$PLUGIN_ID = ["cellValue", "configuration"];

var templateCell_$PLUGIN_ID = document.createElement("template");
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
</style>

<div id="container">
    <input type="text" id="image-value" placeholder="Enter URL...">
    <button id="view-image">View</button>
</div>
`;

var templateEditor_$PLUGIN_ID = document.createElement("template");
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        margin-top: 4px;
        width: 320px;
        height: 320px;
        border: 1px solid black;
        border-radius: 8px;
        overflow: hidden;
    }

    #image-old {
        width: 100%;
        height: 100%;
    }

    #image {
        background-size: contain;
        background-repeat: no-repeat;
        max-width: 400px;
    }

    #background-image {
        background-repeat: no-repeat;
        background-size: contain;
    }

    #image-details {
        display: none;
        max-width: calc(100% - 56px);

        position: absolute;
        left: 12px;
        bottom: 12px;
        align-items: center;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 700;
        border: 1px solid white;
        border-radius: 999px;
        color: white;
        background: rgba(255, 255, 255, 0.10);
        backdrop-filter: blur(2px);
        transition: backdrop-filter 0.3s ease, background 0.3s ease;
    }

    #image-details:hover {
        background: rgba(255, 255, 255, 0.20);
        backdrop-filter: blur(0px);
        cursor: pointer;
    }

    #image-details-title {
        margin-right: 32px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 50%;
        direction: rtl;
        text-align: left;
    }

    #image-details-size {
        text-align: right;
    }
</style>

<div id="container">
    <div id="background-image">
        <img id="image" style="visibility: hidden;" />
    </div>

    <div id="image-details">
    
    </div>
</div>
`;

// This is the configuration object that Outerbase passes to your plugin.
// Define all of the configuration options that your plugin requires here.
class OuterbasePluginConfig_$PLUGIN_ID {
  constructor(object) {
    // No custom properties needed in this plugin.
  }
}

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return privileges_$PLUGIN_ID;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();

    // The shadow DOM is a separate DOM tree that is attached to the element.
    // This allows us to encapsulate our styles and markup. It also prevents
    // styles from the parent page from leaking into our plugin.
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateCell_$PLUGIN_ID.content.cloneNode(true));
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
    this.shadow.querySelector("#image-value").value =
      this.getAttribute("cellvalue");

    var imageInput = this.shadow.getElementById("image-value");
    var viewImageButton = this.shadow.getElementById("view-image");

    if (imageInput && viewImageButton) {
      imageInput.addEventListener("focus", () => {
        // Tell Outerbase to start editing the cell
        this.callCustomEvent({
          action: "onstopedit",
          value: true,
        });
      });

      imageInput.addEventListener("blur", () => {
        // Tell Outerbase to update the cells raw value
        this.callCustomEvent({
          action: "cellvalue",
          value: imageInput.value,
        });

        // Then stop editing the cell and close the editor view
        this.callCustomEvent({
          action: "onstopedit",
          value: true,
        });
      });

      viewImageButton.addEventListener("click", () => {
        this.callCustomEvent({
          action: "onedit",
          value: true,
        });
      });
    }
  }

  callCustomEvent(data) {
    const event = new CustomEvent("custom-change", {
      detail: data,
      bubbles: true, // If you want the event to bubble up through the DOM
      composed: true, // Allows the event to pass through shadow DOM boundaries
    });

    this.dispatchEvent(event);
  }
}

class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return privileges;
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

  // This function is called when the UI is made available into the DOM. Put any
  // logic that you want to run when the element is first stood up here, such as
  // event listeners, default values to display, etc.
  connectedCallback() {
    var imageView = this.shadow.getElementById("image");
    var backgroundImageView = this.shadow.getElementById("background-image");

    if (imageView && backgroundImageView) {
      imageView.src = this.getAttribute("cellvalue");
      console.log("imageView.src", imageView.src);
      backgroundImageView.style.backgroundImage = `url(${this.getAttribute(
        "cellvalue"
      )})`;

      const imageUrl = this.getAttribute("cellvalue");
      this.getImageSize(imageUrl).then((size) => {
        const sizeInKilobytes = this.bytesToKilobytes(size);

        // Update image details
        this.shadow.getElementById("image-details").innerHTML = `
                    <div id="image-details-title">${this.extractImageName(
                      imageUrl
                    )}</div>
                    <div id="image-details-size">${sizeInKilobytes.toFixed(
                      1
                    )} KB</div>
                `;
        this.shadow.getElementById("image-details").style.display = "flex";
      });
    }
  }

  getImageSize(url) {
    return fetch(url, { method: "GET" }) // Use HEAD request to get headers without downloading the whole image
      .then((response) => {
        const contentLength = response.headers.get("content-length");
        if (contentLength) {
          return parseInt(contentLength, 10);
        } else {
          // If content-length header is not available, fetch the whole image and compute its size
          return response.blob().then((data) => data.size);
        }
      });
  }

  extractImageName(url) {
    return url.split("/").pop();
  }

  bytesToKilobytes(bytes) {
    return bytes / 1024;
  }
}

/**
 * ******************
 * Configuration View
 * ******************
 *
 *  ░░░░░░░░░░░░░░░░░
 *  ░░░░░▀▄░░░▄▀░░░░░
 *  ░░░░▄█▀███▀█▄░░░░
 *  ░░░█▀███████▀█░░░
 *  ░░░█░█▀▀▀▀▀█░█░░░
 *  ░░░░░░▀▀░▀▀░░░░░░
 *  ░░░░░░░░░░░░░░░░░
 *
 * When a user either installs a plugin onto a table resource for the first time
 * or they configure an existing installation, this is the view that is presented
 * to the user. For many plugin applications it's essential to capture information
 * that is required to allow your plugin to work correctly and this is the best
 * place to do it.
 *
 * It is a requirement that a save button that triggers the `OuterbaseEvent.onSave`
 * event exists so Outerbase can complete the installation or preference update
 * action.
 */
var templateConfiguration_$PLUGIN_ID = document.createElement("template");
templateConfiguration_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        display: flex;
        height: 100%;
        overflow-y: scroll;
        padding: 40px 50px 65px 40px;
    }
</style>

<div id="container">
    
</div>
`;

class OuterbasePluginConfiguration_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return privileges_$PLUGIN_ID;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(
      templateConfiguration_$PLUGIN_ID.content.cloneNode(true)
    );
  }

  connectedCallback() {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      decodeAttributeByName(this, "configuration")
    );
    this.config.cellValue = decodeAttributeByName(this, "cellValue");
    this.render();
  }

  render() {
    this.shadow.querySelector("#container").innerHTML = `
        <div>
            <h1>Hello, Configuration World!</h1>
            <button id="saveButton">Save View</button>
        </div>
        `;

    var saveButton = this.shadow.getElementById("saveButton");
    saveButton.addEventListener("click", () => {
      triggerEvent(this, {
        action: OuterbaseEvent.onSave,
        value: {},
      });
    });
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
// JOHNNY commented this out because it serves no purpose but to interrupt installation (at the moment?)
// window.customElements.define('outerbase-plugin-configuration-$PLUGIN_ID', OuterbasePluginConfiguration_$PLUGIN_ID)
