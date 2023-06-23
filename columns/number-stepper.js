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
    'configuration',
]

var templateCell = document.createElement('template')
templateCell.innerHTML = `
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
    <input type="text" id="counter_value" placeholder="Enter value...">
    <button id="decrement">-</button>
    <button id="increment">+</button>
</div>
`

var templateEditor = document.createElement('template')
templateEditor.innerHTML = `
<style>
    #container {
        width: 200px;
        height: 120px;
        background-color: red;
    }

    p {
        margin: 0;
    }
</style>

<div id="container">
    <p>Welcome to the Outerbase Plugin Editor! Value is <span id="counter_value">0</span></p>
</div>
`

// This is the configuration object that Outerbase passes to your plugin.
// Define all of the configuration options that your plugin requires here.
class OuterbasePluginConfig {
    constructor(object) {
        // No custom properties needed in this plugin.
    }
}

class OuterbasePluginCell extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig({})

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
        this.config = new OuterbasePluginConfig(
            JSON.parse(this.getAttribute('configuration'))
        )

        // Set default value based on input
        this.shadow.querySelector('#counter_value').value = this.getAttribute('cellValue')

        // Add event listeners for buttons
        this.shadow
            .querySelector('#decrement')
            .addEventListener('click', () => {
                const counter_value = Number(this.shadow.querySelector('#counter_value').value)
                this.shadow.querySelector('#counter_value').value = counter_value - 1
                this.setAttribute('cellValue', this.shadow.querySelector('#counter_value').value)
            })

        // Add event listeners for buttons
        this.shadow
            .querySelector('#increment')
            .addEventListener('click', () => {
                const counter_value = Number(this.shadow.querySelector('#counter_value').value)
                this.shadow.querySelector('#counter_value').value = counter_value + 1
                this.setAttribute('cellValue', this.shadow.querySelector('#counter_value').value)
            })
    }
}

class OuterbasePluginEditor extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    constructor() {
        super()

        // The shadow DOM is a separate DOM tree that is attached to the element.
        // This allows us to encapsulate our styles and markup. It also prevents
        // styles from the parent page from leaking into our plugin.
        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateEditor.content.cloneNode(true))

        // Parse the configuration object from the `configuration` attribute
        // and store it in the `config` property.
        this.config = new OuterbasePluginConfig(
            JSON.parse(this.getAttribute('configuration'))
        )
    }

    // This function is called when the UI is made available into the DOM. Put any
    // logic that you want to run when the element is first stood up here, such as
    // event listeners, default values to display, etc.
    connectedCallback() {
        this.shadow.querySelector('#counter_value').innerHTML = this.getAttribute('cellValue')
    }
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define('outerbase-plugin-cell', OuterbasePluginCell)
window.customElements.define('outerbase-plugin-editor', OuterbasePluginEditor)
