var privileges = [
    'cellValue',
    'configuration',
]

var templateCell_$PLUGIN_ID = document.createElement('template')
templateCell_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        height: 100%;
        width: calc(100% - 16px);
        padding: 0 8px;
    }

    input {
        color: black;
        background-color: white;

        height: 100%;
        border: 0;
        min-width: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    input:focus {
        outline: none;
    }

    /**
     * ATTENTION:
     * 
     * The section below is what performs the theme operations using media
     * queries in CSS. You can provide the light theme styles above as the
     * default, and then define the dark theme overrides like we do below.
     */
    @media (prefers-color-scheme: dark) {
        input {
            color: white;
            background-color: black;
        }
    }
</style>

<div id="container">
    <input type="text" id="image-value" placeholder="Enter value...">
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

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
