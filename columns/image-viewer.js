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
        font-family: 'Inter', sans-serif;
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
    <input type="text" id="image-value" placeholder="Enter URL...">
    <div id="action-button">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 0.1875H1.5C1.1519 0.1875 0.818064 0.325781 0.571922 0.571922C0.325781 0.818064 0.1875 1.1519 0.1875 1.5V16.5C0.1875 16.8481 0.325781 17.1819 0.571922 17.4281C0.818064 17.6742 1.1519 17.8125 1.5 17.8125H16.5C16.8481 17.8125 17.1819 17.6742 17.4281 17.4281C17.6742 17.1819 17.8125 16.8481 17.8125 16.5V1.5C17.8125 1.1519 17.6742 0.818064 17.4281 0.571922C17.1819 0.325781 16.8481 0.1875 16.5 0.1875ZM1.3125 16.5V1.5C1.3125 1.45027 1.33225 1.40258 1.36742 1.36742C1.40258 1.33225 1.45027 1.3125 1.5 1.3125H16.5C16.5497 1.3125 16.5974 1.33225 16.6326 1.36742C16.6677 1.40258 16.6875 1.45027 16.6875 1.5V9.20625L14.0531 6.57187C13.9312 6.44998 13.7866 6.35329 13.6273 6.28733C13.4681 6.22136 13.2974 6.18741 13.125 6.18741C12.9526 6.18741 12.7819 6.22136 12.6227 6.28733C12.4634 6.35329 12.3188 6.44998 12.1969 6.57187L2.08125 16.6875H1.5C1.45027 16.6875 1.40258 16.6677 1.36742 16.6326C1.33225 16.5974 1.3125 16.5497 1.3125 16.5ZM16.5 16.6875H3.67219L12.9919 7.36781C13.0093 7.35038 13.03 7.33655 13.0527 7.32711C13.0755 7.31768 13.0999 7.31282 13.1245 7.31282C13.1492 7.31282 13.1736 7.31768 13.1963 7.32711C13.2191 7.33655 13.2398 7.35038 13.2572 7.36781L16.6875 10.7972V16.5C16.6875 16.5497 16.6677 16.5974 16.6326 16.6326C16.5974 16.6677 16.5497 16.6875 16.5 16.6875ZM6 8.0625C6.40792 8.0625 6.80669 7.94154 7.14586 7.71491C7.48504 7.48828 7.7494 7.16616 7.9055 6.78928C8.06161 6.41241 8.10245 5.99771 8.02287 5.59763C7.94329 5.19754 7.74685 4.83004 7.45841 4.54159C7.16996 4.25315 6.80246 4.05671 6.40237 3.97713C6.00229 3.89755 5.58759 3.93839 5.21072 4.0945C4.83384 4.2506 4.51172 4.51496 4.28509 4.85414C4.05846 5.19331 3.9375 5.59208 3.9375 6C3.9375 6.54701 4.1548 7.07161 4.54159 7.45841C4.92839 7.8452 5.45299 8.0625 6 8.0625ZM6 5.0625C6.18542 5.0625 6.36668 5.11748 6.52085 5.2205C6.67502 5.32351 6.79518 5.46993 6.86614 5.64123C6.93709 5.81254 6.95566 6.00104 6.91949 6.1829C6.88331 6.36475 6.79402 6.5318 6.66291 6.66291C6.5318 6.79402 6.36475 6.88331 6.1829 6.91949C6.00104 6.95566 5.81254 6.93709 5.64123 6.86614C5.46993 6.79518 5.32351 6.67502 5.2205 6.52085C5.11748 6.36668 5.0625 6.18542 5.0625 6C5.0625 5.75136 5.16127 5.5129 5.33709 5.33709C5.5129 5.16127 5.75136 5.0625 6 5.0625Z" fill="white"/>
        </svg>
    </div>
</div>
`

var templateEditor_$PLUGIN_ID = document.createElement('template')
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
`

// This is the configuration object that Outerbase passes to your plugin.
// Define all of the configuration options that your plugin requires here.
class OuterbasePluginConfig_$PLUGIN_ID {
    baseURL = ""
    theme = "light"

    constructor(object) {
        this.baseURL = object?.baseUrl ?? ""
        this.theme = object?.theme ? object.theme : "light";
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
        this.shadow.querySelector('#image-value').value = this.getAttribute('cellvalue')

        var imageInput = this.shadow.getElementById("image-value");
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
        var imageView = this.shadow.getElementById("image");
        var backgroundImageView = this.shadow.getElementById("background-image");

        if (imageView && backgroundImageView) {
            const source = this.config.baseURL ? `${this.config.baseURL}${this.getAttribute('cellvalue')}` : this.getAttribute('cellvalue')
            imageView.src = source
            backgroundImageView.style.backgroundImage = `url(${source})`

            this.getImageSize(source).then(size => {
                const sizeInKilobytes = this.bytesToKilobytes(size);

                // Update image details
                this.shadow.getElementById("image-details").innerHTML = `
                    <div id="image-details-title">${this.extractImageName(source)}</div>
                    <div style="flex: 1;"></div>
                    <div id="image-details-size">${sizeInKilobytes.toFixed(1)} KB</div>
                `
                this.shadow.getElementById("image-details").style.display = "flex";
            });
        }
    }

    getImageSize(url) {
        return fetch(url, { method: 'GET' }) // Use HEAD request to get headers without downloading the whole image
            .then(response => {
                const contentLength = response.headers.get('content-length');
                if (contentLength) {
                    return parseInt(contentLength, 10);
                } else {
                    // If content-length header is not available, fetch the whole image and compute its size
                    return response.blob().then(data => data.size);
                }
            }).catch(() => {
                // If the request fails, return 0
                return 0;
            });
    }

    extractImageName(url) {
        return url.split('/').pop();
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
var templateConfiguration_$PLUGIN_ID = document.createElement("template")
var templateConfigurationInnerHTML_$PLUGIN_ID = `
<style>
    :host {
        font-family: 'Inter', sans-serif;
        font-weight: 400;
    }

    #container {
        display: flex;
        height: 100%;
        overflow-y: scroll;
        padding: 40px;
        width: 400px;
    }

    input {
        margin-top: 4px;
        width: 100%;
        font-family: 'Inter', sans-serif;
        padding: 8px 12px;
        border: 1px solid #a3a3a3;
        border-radius: 6px;
        background: linear-gradient(180deg, #FAFAFA 0%, rgba(250, 250, 250, 0.00) 100%), #FFF;
    }

    button {
        display: inline-block;
        padding: 10px 24px;
        font-size: 14px;
        line-height: 18px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        color: white;
        font-family: 'Inter', sans-serif;
        background: linear-gradient(180deg, #171717 0%, #262626 79.91%, #0A0A0A 100%);
        box-shadow: 0px 0px 2px 1.5px rgba(250, 250, 250, 0.50) inset, 0px -2px 2px 0.5px #0A0A0A inset;
    }

    .dark button {
        background: linear-gradient(180deg, #F8F8F8 0%, #FEFEFE 100%);
        box-shadow: 0px -1px 1px 1px #B0B0B0 inset, 0px 0px 2px 0px #FCFCFC inset;
        color: black;
    }
</style>

<div id="container">
    
</div>
`

class OuterbasePluginConfiguration_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges_$PLUGIN_ID
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateConfiguration_$PLUGIN_ID.content.cloneNode(true))
    }

    connectedCallback() {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        this.config.cellValue = decodeAttributeByName_$PLUGIN_ID(this, "cellValue")
        this.render()
    }

    setupCheck() {
        // Remove all elements from shadow DOM
        while (this.shadow.firstChild) {
            this.shadow.removeChild(this.shadow.firstChild);
        }

        let template = templateConfiguration_$PLUGIN_ID
        template.innerHTML = templateConfigurationInnerHTML_$PLUGIN_ID
        this.shadow.appendChild(template.content.cloneNode(true))
    }

    render() {
        this.setupCheck()

        this.shadow.querySelector("#container").innerHTML = `
        <div>
            <div style="margin-bottom: 24px;">
                If the URL values in this column require a base URL, enter it below.
                This will be prepended to all URLs in this column.
            </div>

            <div>Base URL <i>(optional)</i>:</div>
            <input type="text" id="base-url" placeholder="Enter URL...">

            <div style="margin-top: 24px;">
                <button id="saveButton">Save View</button>
            </div>
        </div>
        `

        var saveButton = this.shadow.getElementById("saveButton");
        saveButton.addEventListener("click", () => {
            triggerEvent_$PLUGIN_ID(this, {
                action: OuterbaseEvent_$PLUGIN_ID.onSave,
                value: {
                    baseURL: this.shadow.getElementById("base-url").value
                }
            })
        });
    }
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-editor-$PLUGIN_ID', OuterbasePluginEditor_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-configuration-$PLUGIN_ID', OuterbasePluginConfiguration_$PLUGIN_ID)
