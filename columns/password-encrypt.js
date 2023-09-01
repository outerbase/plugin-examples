// ----------------------
// IMPORTANT PLEASE READ:
// ----------------------
// A list of all of the attributes that Outerbase can optionally pass to this element.
// It is **IMPORTANT** to note that you should _REMOVE ALL_ attributes that you do not use.
// Outerbase will pass in all of the attributes that you specify here, which could cause
// undesired performance issues if you are not using them.
//
// When you submit your plugin to our marketplace, the attributes you list here will also
// be displayed to users installing your plugin, so it is important to only list the ones
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

var templateCell = document.createElement('template')
templateCell.innerHTML = `
<style>
    #container {
        height: calc(100% - 16px);
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
class OuterbasePluginConfig_$PLUGIN_ID {
    constructor(object) {
        
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
        this.shadow.appendChild(templateCell.content.cloneNode(true))
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
        this.shadow.querySelector('#container').innerHTML = `
        <div>
            ` + this.getAttribute('cellValue') + `
        </div>
        `

        this.shadow.querySelector('#container').addEventListener('click', () => {
            this.setAttribute('onEdit', true)
            this.render()
        })
    }
}

var templateEditor = document.createElement('template')
templateEditor.innerHTML = `
<style>
    #container {
        max-height: 120px;
        overflow-y: scroll;
    }
</style>

<div id="container">

</div>
`

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
        this.shadow.appendChild(templateEditor.content.cloneNode(true))

        // Parse the configuration object from the `configuration` attribute
        // and store it in the `config` property.
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(
            JSON.parse(this.getAttribute('configuration'))
        )

        this.render()
    }

    connectedCallback() {
        // Parse the configuration object from the `configuration` attribute
        // and store it in the `config` property.
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(
            JSON.parse(this.getAttribute('configuration'))
        )

        this.render()
    }

    render() {
        this.shadow.querySelector('#container').innerHTML = `
        <div>
            <input type="text" id="password" value="` + this.getAttribute('cellValue') + `">
            <button>Save</button>
        </div>
        `

        // Assuming your options have the class "option"
        const options = this.shadow.querySelectorAll('#password')

        options.forEach((option) => {
            option.addEventListener('click', () => {
                // POST "string" to function
                const optionValue = option.innerHTML
                this.setAttribute('cellValue', optionValue)
                this.setAttribute('onStopEdit', true)
            })
        })
    }
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define('outerbase-plugin-cell', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-editor', OuterbasePluginEditor_$PLUGIN_ID)