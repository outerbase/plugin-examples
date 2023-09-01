// ----------------------
// IMPORTANT PLEASE READ:
// ----------------------
// A list of all of the attributes that Outerbase can optionally pass to this element.
// If an attribute is listed here it does **NOT** mean that it will receive this data.
// When you submit your plugin to our marketplace, you will be asked again to accurately
// select which attributes your plugin requires to operate successfully. When those selections
// are made, Outerbase will only pass the attributes that you have selected, not the ones
// specified here. Outerbase will pass in all of the attributes that you specify here, which 
// could cause undesired performance issues if you are not using them.
//
// When you submit your plugin to our marketplace, the attributes you select when uploading will
// be displayed to users installing your plugin, so it is important to only select the ones
// that you are using. Asking for more data than you need will likely cause users to not
// install your plugin.
//
// Supported values:
// - cellValue: The value of the cell that the plugin is being rendered in.
// - rowValue: The value of the row that the plugin is being rendered in.
// - tableValue: The value of the table that the plugin is being rendered in.
// - tableSchemaValue: The schema of the table that the plugin is being rendered in.
// - databaseSchemaValue: The schema of the database that the plugin is being rendered in.
// - configuration: The configuration object that the user specified when installing the plugin.
//
var privileges = [
    'cellValue',
    'configuration',
]

var templateCell_$PLUGIN_ID = document.createElement('template')
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
    <input type="text" id="image-value" placeholder="Enter URL...">
    <button id="view-image">View</button>
</div>
`

var templateEditor_$PLUGIN_ID = document.createElement('template')
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        max-width: 400px;
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
</style>

<div id="container">
    <div id="background-image">
        <img id="image" style="visibility: hidden;" />
    </div>
</div>
`

// This is the configuration object that Outerbase passes to your plugin.
// Define all of the configuration options that your plugin requires here.
class OuterbasePluginConfig_$PLUGIN_ID {
    constructor(object) {
        // No custom properties needed in this plugin.
    }
}

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
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
        var viewImageButton = this.shadow.getElementById("view-image");

        if (imageInput && viewImageButton) {
            imageInput.addEventListener("focus", () => {
                // Tell Outerbase to start editing the cell
                this.setAttribute('onstopedit', true)
            });

            imageInput.addEventListener("blur", () => {
                // Tell Outerbase to update the cells raw value
                this.setAttribute('cellvalue', imageInput.value)

                // Then stop editing the cell and close the editor view
                this.setAttribute('onstopedit', true)
            });

            viewImageButton.addEventListener("click", () => {
                this.setAttribute('onedit', true)
            });
        }
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
            imageView.src = this.getAttribute('cellvalue')
            backgroundImageView.style.backgroundImage = `url(${this.getAttribute('cellvalue')})`
        }
    }
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-editor-$PLUGIN_ID', OuterbasePluginEditor_$PLUGIN_ID)
