// ----------------------
// IMPORTANT PLEASE READ:
// ----------------------
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
    'tableValue',
    'configuration',
]

var templateTable = document.createElement('template')
templateTable.innerHTML = `
<style>
    #container {
        display: flex;
        height: 100%;
        overflow-y: scroll;
    }
</style>

<div id="container">
    
</div>
`

class OuterbasePluginConfig_$PLUGIN_ID {
    constructor(object) {
        
    }
}

class OuterbasePluginTable_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})
    items = []

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateTable.content.cloneNode(true))
    }

    connectedCallback() {
        const encodedTableJSON = this.getAttribute('configuration');
        const decodedTableJSON = encodedTableJSON
            ?.replace(/&quot;/g, '"')
            ?.replace(/&#39;/g, "'");
        const configuration = JSON.parse(decodedTableJSON);

        if (configuration) {
            this.config = new OuterbasePluginConfig_$PLUGIN_ID(
                configuration
            )
        }

        // Set the items property to the value of the `tableValue` attribute.
        if (this.getAttribute('tableValue')) {
            const encodedTableJSON = this.getAttribute('tableValue');
            const decodedTableJSON = encodedTableJSON
                ?.replace(/&quot;/g, '"')
                ?.replace(/&#39;/g, "'");
            this.items = JSON.parse(decodedTableJSON);
        }

        // Manually render dynamic content
        this.render()
    }

    render() {
        this.shadow.querySelector('#container').innerHTML = `
        <div class="grid-container">
            <h1>Hello, Table World!</h1>
        </div>
        `
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

var templateConfiguration = document.createElement('template')
templateConfiguration.innerHTML = `
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
`

class OuterbasePluginConfiguration_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})
    items = []

    constructor() {
        super()

        // The shadow DOM is a separate DOM tree that is attached to the element.
        // This allows us to encapsulate our styles and markup. It also prevents
        // styles from the parent page from leaking into our plugin.
        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateConfiguration.content.cloneNode(true))
    }

    connectedCallback() {
        // Parse the configuration object from the `configuration` attribute
        // and store it in the `config` property.
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(
            JSON.parse(this.getAttribute('configuration'))
        )

        // Set the items property to the value of the `tableValue` attribute.
        if (this.getAttribute('tableValue')) {
            this.items = JSON.parse(this.getAttribute('tableValue'))
        }

        // Manually render dynamic content
        this.render()
    }

    render() {
        let sample = this.items.length ? this.items[0] : {}
        let keys = Object.keys(sample)

        this.shadow.querySelector('#container').innerHTML = `
        <div style="flex: 1;">
            <h1>Hello, Configuration World!</h1>

            <div style="margin-top: 8px;">
                <button id="saveButton">Save View</button>
            </div>
        </div>
        `

        var saveButton = this.shadow.getElementById("saveButton");
        saveButton.addEventListener("click", () => {
            this.callCustomEvent({
                action: 'onsave',
                value: {}
            })
        });
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

window.customElements.define('outerbase-plugin-table-$PLUGIN_ID', OuterbasePluginTable_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-configuration-$PLUGIN_ID', OuterbasePluginConfiguration_$PLUGIN_ID)
