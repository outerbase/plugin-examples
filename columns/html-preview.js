var privileges_$PLUGIN_ID = [
    'cellValue',
    'configuration',
]

var OuterbaseEvent_$PLUGIN_ID = {
    // The user has triggered an action to save updates
    onSave: "onSave",
}

var triggerEvent_$PLUGIN_ID = (fromClass, data) => {
    const event = new CustomEvent("custom-change", {
        detail: data,
        bubbles: true,
        composed: true
    });

    fromClass.dispatchEvent(event);
}

var decodeAttributeByName_$PLUGIN_ID = (fromClass, name) => {
    const encodedJSON = fromClass.getAttribute(name);
    const decodedJSON = encodedJSON
        ?.replace(/&quot;/g, '"')
        ?.replace(/&#39;/g, "'");
    return decodedJSON ? JSON.parse(decodedJSON) : {};
}

var templateCell_$PLUGIN_ID = document.createElement('template')
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
    <input type="text" id="html-value" placeholder="Enter URL...">
    <div id="action-button">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.375 0C5.11415 0 3.88161 0.373887 2.83324 1.07438C1.78488 1.77488 0.967779 2.77051 0.485271 3.93539C0.00276208 5.10027 -0.123484 6.38207 0.122497 7.6187C0.368478 8.85533 0.975637 9.99125 1.8672 10.8828C2.75876 11.7744 3.89467 12.3815 5.1313 12.6275C6.36793 12.8735 7.64973 12.7472 8.81461 12.2647C9.97949 11.7822 10.9751 10.9651 11.6756 9.91676C12.3761 8.8684 12.75 7.63586 12.75 6.375C12.748 4.68485 12.0757 3.0645 10.8806 1.86939C9.6855 0.674272 8.06515 0.00198491 6.375 0ZM11.4731 4H8.96188C8.6886 2.86649 8.19018 1.79951 7.49625 0.8625C8.35772 1.03953 9.16591 1.4154 9.85637 1.96013C10.5468 2.50486 11.1005 3.20338 11.4731 4ZM12 6.375C12.0004 6.92548 11.9198 7.47302 11.7606 8H9.11625C9.2946 6.92401 9.2946 5.82599 9.11625 4.75H11.7606C11.9198 5.27698 12.0004 5.82452 12 6.375ZM6.375 12C6.35942 12.0001 6.344 11.9968 6.32977 11.9905C6.31554 11.9841 6.30283 11.9748 6.2925 11.9631C5.4875 11.0963 4.89625 9.98312 4.5625 8.75H8.1875C7.85375 9.98312 7.2625 11.0963 6.4575 11.9631C6.44717 11.9748 6.43447 11.9841 6.42024 11.9905C6.40601 11.9968 6.39059 12.0001 6.375 12ZM4.39438 8C4.20188 6.92522 4.20188 5.82478 4.39438 4.75H8.35563C8.54812 5.82478 8.54812 6.92522 8.35563 8H4.39438ZM0.750003 6.375C0.749582 5.82452 0.830239 5.27698 0.989378 4.75H3.63375C3.4554 5.82599 3.4554 6.92401 3.63375 8H0.989378C0.830239 7.47302 0.749582 6.92548 0.750003 6.375ZM6.375 0.75C6.39059 0.749914 6.40601 0.753159 6.42024 0.759519C6.43447 0.765879 6.44717 0.775206 6.4575 0.786875C7.2625 1.65375 7.85375 2.76688 8.1875 4H4.5625C4.89625 2.76688 5.4875 1.65375 6.2925 0.786875C6.30283 0.775206 6.31554 0.765879 6.32977 0.759519C6.344 0.753159 6.35942 0.749914 6.375 0.75ZM5.25375 0.8625C4.55983 1.79951 4.06141 2.86649 3.78813 4H1.27688C1.64954 3.20338 2.20317 2.50486 2.89363 1.96013C3.58409 1.4154 4.39228 1.03953 5.25375 0.8625ZM1.27688 8.75H3.78813C4.06141 9.88351 4.55983 10.9505 5.25375 11.8875C4.39228 11.7105 3.58409 11.3346 2.89363 10.7899C2.20317 10.2451 1.64954 9.54662 1.27688 8.75ZM7.49625 11.8875C8.19018 10.9505 8.6886 9.88351 8.96188 8.75H11.4731C11.1005 9.54662 10.5468 10.2451 9.85637 10.7899C9.16591 11.3346 8.35772 11.7105 7.49625 11.8875Z" fill="white"/>
        </svg>    
    </div>
</div>
`

{/* <button id="view-html">View</button> */}

var templateEditor_$PLUGIN_ID = document.createElement('template')
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        min-width: 600px;
        max-width: 1000px;
        max-height: 80%;
        background: white;
        border: 1px solid black;
        border-radius: 8px;
        overflow: hidden;
        margin-top: 4px;
    }

    #header {
        font-family: inter;
        font-weight: 600;
        font-size: 24px;
    }

    #error {
        display: none;
        margin: 10px 0;
        font-family: inter;
        font-weight: 400;
        font-size: 16px;
        color: #B22222;

        -moz-user-select: text;
        -khtml-user-select: text;
        -webkit-user-select: text;
        -ms-user-select: text;
        user-select: text;
    }

    #content {
        overflow: scroll;

        -moz-user-select: text;
        -khtml-user-select: text;
        -webkit-user-select: text;
        -ms-user-select: text;
        user-select: text;
    }
</style>

<div id="container">
    <h1 id="header"></h1>
    <hr id="hr" />
    <div id="error"></div>
    <div id="content"></div>
</div>
`

// This is the configuration object that Outerbase passes to your plugin.
// Define all of the configuration options that your plugin requires here.
class OuterbasePluginConfig_$PLUGIN_ID {
    theme = "light";

    constructor(object) {
        this.theme = object.theme ? object.theme : "light";
    }
}

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges_$PLUGIN_ID
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

        // The shadow DOM is a separate DOM tree that is attached to the element.
        // This allows us to encapsulate our styles and markup. It also prevents
        // styles from the parent page from leaking into our plugin.
        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateCell_$PLUGIN_ID.content.cloneNode(true))
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))

        let metadata = decodeAttributeByName_$PLUGIN_ID(this, "metadata")
        this.config.theme = metadata?.theme

        var element = this.shadow.querySelector(".theme-container")
        element.classList.remove("dark")
        element.classList.add(this.config.theme);
    }

    // This function is called when the UI is made available into the DOM. Put any
    // logic that you want to run when the element is first stood up here, such as
    // event listeners, default values to display, etc.
    connectedCallback() {
        // Parse the configuration object from the `configuration` attribute
        // and store it in the `config` property.
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(
            JSON.parse(this.getAttribute('configuration'))
        )

        // Set default value based on input
        this.shadow.querySelector('#html-value').value = this.getAttribute('cellvalue')

        var imageInput = this.shadow.getElementById("html-value");
        var viewImageButton = this.shadow.getElementById("action-button");

        if (imageInput && viewImageButton) {
            imageInput.addEventListener("focus", () => {
                // Tell Outerbase to start editing the cell
                this.callCustomEvent({
                    action: 'onstopedit',
                    value: true
                })
            });

            imageInput.addEventListener("blur", () => {
                // Tell Outerbase to update the cells raw value
                this.callCustomEvent({
                    action: 'cellvalue',
                    value: imageInput.value
                })

                // Then stop editing the cell and close the editor view
                this.callCustomEvent({
                    action: 'onstopedit',
                    value: true
                })
            });

            viewImageButton.addEventListener("click", () => {
                this.callCustomEvent({
                    action: 'onedit',
                    value: true
                })
            });
        }
    }

    callCustomEvent(data) {
        const event = new CustomEvent('custom-change', {
            detail: data,
            bubbles: true,  // If you want the event to bubble up through the DOM
            composed: true  // Allows the event to pass through shadow DOM boundaries
        });

        this.dispatchEvent(event);
    }
}

class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    static NO_VALUE_HEADER = "Nothing to preview";
    static BAD_VALUE_HEADER = "Failed to load preview";

    config = new OuterbasePluginConfig_$PLUGIN_ID({});

    constructor() {
        super()

        // The shadow DOM is a separate DOM tree that is attached to the element.
        // This allows us to encapsulate our styles and markup. It also prevents
        // styles from the parent page from leaking into our plugin.
        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateEditor_$PLUGIN_ID.content.cloneNode(true))

        // Parse the configuration object from the `configuration` attribute
        // and store it in the `config` property.
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(
            JSON.parse(this.getAttribute('configuration'))
        )
    }

    // This function is called when the UI is made available into the DOM. Put any
    // logic that you want to run when the element is first stood up here, such as
    // event listeners, default values to display, etc.
    connectedCallback() {
        const value = this.getAttribute("cellValue");

        this.shadow.querySelector("#container").style.padding = "0px";
        this.shadow.querySelector("#header").style.display = "block";
        this.shadow.querySelector("#hr").style.display = "block";

        if (this.isEmpty(value)) {
            this.shadow.querySelector("#header").innerHTML = OuterbasePluginEditor_$PLUGIN_ID.NO_VALUE_HEADER;
            return;
        }

        var error = this.isInvalidHTML(value);
        if (error) {
            this.shadow.querySelector("#container").style.padding = "20px";
            this.shadow.querySelector("#header").innerHTML = OuterbasePluginEditor_$PLUGIN_ID.BAD_VALUE_HEADER;
            this.shadow.querySelector("#error").style.display = "block";
            this.shadow.querySelector("#error").innerHTML = error.innerHTML;
            this.shadow.querySelector("#content").innerText = value;
            return;
        }

        this.shadow.querySelector("#header").style.display = "none";
        this.shadow.querySelector("#hr").style.display = "none";
        this.shadow.querySelector("#content").innerHTML = value;
    }
    
    isEmpty(data) {
        return !data || data.length == 0;
    }
    
    isInvalidHTML(data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "application/xml");
        return doc.querySelector("parsererror");
    }
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-editor-$PLUGIN_ID', OuterbasePluginEditor_$PLUGIN_ID)
