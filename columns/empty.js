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
    'cellValue',
    'configuration'
]

// Do NOT change the variable name. Doing so will break the plugin when uploaded
// to Outerbase.
var templateCell_$PLUGIN_ID = document.createElement('template')
templateCell_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        width: calc(100% - 16px);
        padding: 8px;
        position: relative;
    }
</style>

<div id="container">

</div>
`

// This is the configuration object that Outerbase passes to your plugin.
// Define all of the configuration options that your plugin requires here.
//
// Do NOT change the class name. Doing so will break the plugin when uploaded
// to Outerbase.
class OuterbasePluginConfig_$PLUGIN_ID {
    constructor(object) {
        
    }
}

// Do NOT change the class name. Doing so will break the plugin when uploaded
// to Outerbase.
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

        this.render()
    }

    render() {
        
    }
}

// Do NOT change the variable name. Doing so will break the plugin when uploaded
// to Outerbase.
var templateEditor_$PLUGIN_ID = document.createElement('template')
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        max-height: 120px;
        overflow-y: scroll;
    }
</style>

<div id="container">

</div>
`

// Do NOT change the class name. Doing so will break the plugin when uploaded
// to Outerbase.
class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
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
        this.shadow.appendChild(templateEditor_$PLUGIN_ID.content.cloneNode(true))

        // Parse the configuration object from the `configuration` attribute
        // and store it in the `config` property.
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(
            JSON.parse(this.getAttribute('configuration'))
        )

        this.render()
    }

    connectedCallback() {
        
    }

    render() {
        
    }
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-cell-editor-$PLUGIN_ID', OuterbasePluginEditor_$PLUGIN_ID)