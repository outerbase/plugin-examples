const privileges = [
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
    <input type="text" id="jsonValue" placeholder="Enter JSON...">
    <button id="view-image">{ }</button>
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
    #jsonEditor {
        width: 250px;
        height: 250px;
    }
</style>

<div class="bg-transparent backdrop-blur-md pt-3 pr-3 pb-2 pl-3 rounded">
    <textarea
        id="jsonEditor"
    ></textarea>
    <div>
        <button id="saveButton">Save</button>
    </div>
</div>
`



// This is the configuration object that Outerbase passes to your plugin.
// Define all of the configuration options that your plugin requires here.
class OuterbasePluginConfig_$PLUGIN_ID {
    constructor(object) {
        this.example = "Caleb"
    }
}

var templateConfiguration = document.createElement("template")
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
// Can the above div just be a self closing container: <div />

var decodeAttributeByName = (fromClass, name) => {
    const encodedJSON = fromClass.getAttribute(name);
    const decodedJSON = encodedJSON
        ?.replace(/&quot;/g, '"')
        ?.replace(/&#39;/g, "'");
    return decodedJSON ? JSON.parse(decodedJSON) : {};
}

class OuterbasePluginConfiguration_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes
    }

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateConfiguration.content.cloneNode(true))
    }

    connectedCallback() {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(
            JSON.parse(this.getAttribute('configuration'))
        )

        this.config.tableValue = decodeAttributeByName(this, "tableValue")
        this.render()
    }

    render() {
        this.shadow.querySelector("#container").innerHTML = `
        <div>
            <h1>Hello, Configuration World!</h1>
            <button id="saveButton">Save View</button>
        </div>
        `

        var saveButton = this.shadow.getElementById("saveButton");
        saveButton.addEventListener("click", () => {
            this.callCustomEvent({
                action: "onSave",
                value: this.config
            })
        });
    }
    callCustomEvent(data) {
        const event = createCustomEvent(data)
        this.dispatchEvent(event);
    }
}


class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

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

        const cellValue = JSON.stringify(JSON.parse(this.getAttribute('cellvalue')), undefined, 2)
        const cell = this.shadow.getElementById('jsonValue')
        cell.value = cellValue

        var jsonValue = this.shadow.getElementById("jsonValue");
        var viewImageButton = this.shadow.getElementById("view-image");

        jsonValue.addEventListener("focus", () => {
            this.callCustomEvent({
                action: 'onstopedit',
                value: true
            })
        });
        
        jsonValue.addEventListener("blur", () => {
            this.callCustomEvent({
                action: 'updatecell',
                value: JSON.stringify(JSON.parse(jsonValue.value), undefined, 2)
            })

            // Then stop editing the cell and close the editor view
            this.callCustomEvent({
                action: 'onstopedit',
                value: true
            })
        });

        jsonValue.addEventListener("keydown", (e) => {
            if (e.code != "Enter") {
                return
            }

            this.callCustomEvent({
                action: 'updatecell',
                value: JSON.stringify(JSON.parse(jsonValue.value), undefined, 2)
            })

            this.callCustomEvent({
                action: 'onstopedit',
                value: true
            })
            jsonValue.blur()
        });

            viewImageButton.addEventListener("click", () => {
                this.callCustomEvent({
                    action: 'onedit',
                    value: true
                })
            });
        
    }

    callCustomEvent(data) {
        const event = createCustomEvent(data)
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
        const cellValue = JSON.stringify(JSON.parse(this.getAttribute('cellvalue')), undefined, 2)
        const jsonEditor = this.shadow.getElementById("jsonEditor");

        jsonEditor.innerHTML = cellValue

        const saveButton = this.shadow.getElementById('saveButton')
        saveButton.onclick = () => {
            this.callCustomEvent({
                action: 'updatecell',
                value: JSON.stringify(JSON.parse(jsonEditor.value), undefined, 2)
            })

            // Then stop editing the cell and close the editor view
            this.callCustomEvent({
                action: 'onstopedit',
                value: true
            })
        }

        jsonEditor.addEventListener('blur', (ev) => {
            this.callCustomEvent({
                action: 'updatecell',
                value: JSON.stringify(JSON.parse(jsonEditor.value), undefined, 2)
            })

            this.callCustomEvent({
                action: 'onstopedit',
                value: true
            })
        })
    }
    callCustomEvent(data) {
        const event = createCustomEvent(data)
        this.dispatchEvent(event);
    }
}

const createCustomEvent = (data) => new CustomEvent('custom-change', {
    detail: data,
    bubbles: true,  // If you want the event to bubble up through the DOM
    composed: true  // Allows the event to pass through shadow DOM boundaries
});

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-editor-$PLUGIN_ID', OuterbasePluginEditor_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-configuration-$PLUGIN_ID', OuterbasePluginConfiguration_$PLUGIN_ID)
