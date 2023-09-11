// Change the words here. These are the words the code will analyze for.
var wordsToCheck = ["bad", "yak", "shoot", "magical", "inner", "stories", "writing", "lyrical", "murakami"];

var privileges = ["cellValue", "configuration"];

var templateCell_$PLUGIN_ID = document.createElement("template");
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
  </style>
  <div id="container">
    <input type="text" id="content-value" placeholder="Enter URL...">
    <button id="view-content">Analyze</button>
  </div>
`;

var templateEditor_$PLUGIN_ID = document.createElement('template')
templateEditor_$PLUGIN_ID.innerHTML = `
  <style>
    #container {
      width: 150px;
      max-width:400px;
    }
    #content-old {
      width:100%;
      height:100%;
    }
    #content {
      background-size: contain;
      background-repeat:no-repeat;
      max-width:400px;
    }
    #background-content {
      background-repeat:no-repeat;
      background-size:contain;
      height:100px;
      display:flex;
      align-items:center;
      justify-content:center;
    }
  </style>
  <div id="container">
    <div id="background-content"></div>
  </div>
`

class OuterbasePluginConfig_$PLUGIN_ID {
  constructor(object) {}
}

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return privileges;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateCell_$PLUGIN_ID.content.cloneNode(true));
  }

  connectedCallback() {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      JSON.parse(this.getAttribute("configuration"))
    );
    var cellValue = this.getAttribute("cellvalue");
    this.shadow.querySelector("#content-value").value = cellValue;
    var contentInput = this.shadow.getElementById("content-value");
    var viewContentButton = this.shadow.getElementById("view-content");

    if (contentInput && viewContentButton) {
      contentInput.addEventListener("focus", () => {
        console.log("onstopedit 1");
        this.callCustomEvent({
          action: "onstopedit",
          value: true,
        });
      });

      contentInput.addEventListener("blur", () => {
        this.callCustomEvent({
          action: "cellvalue",
          value: contentInput.value,
        });
        this.callCustomEvent({
          action: "onstopedit",
          value: true,
        });
      });

      viewContentButton.addEventListener("click", () => {
        var containsWords = wordsToCheck.some((word) =>
          cellValue.includes(word)
        );
        var message = containsWords ? "contains words" : "no";
        contentInput.value = message;
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
      bubbles: true,
      composed: true,
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
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateEditor_$PLUGIN_ID.content.cloneNode(true));
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      JSON.parse(this.getAttribute("configuration"))
    );
  }

  connectedCallback() {
    var cellValue = this.getAttribute("cellvalue").toLowerCase();
    var foundWords = wordsToCheck.filter((word) => cellValue.includes(word));
    var message = foundWords.length > 0 ? "contains words: " + foundWords.join(", ") : "no";
    var backgroundContentView = this.shadow.getElementById("background-content");
    if (backgroundContentView) {
      backgroundContentView.innerHTML = message;
    }
    backgroundContentView.style.backgroundColor = 'blue';
    backgroundContentView.style.color = 'white';
  }
}

window.customElements.define(
  "outerbase-plugin-cell-$PLUGIN_ID",
  OuterbasePluginCell_$PLUGIN_ID
);
window.customElements.define(
  "outerbase-plugin-editor-$PLUGIN_ID",
  OuterbasePluginEditor_$PLUGIN_ID
);