var observableAttributes_$PLUGIN_ID = [
    // The value of the cell that the plugin is being rendered in
    "cellValue",
    // The configuration object that the user specified when installing the plugin
    "configuration",
    // Additional information about the view such as count, page and offset.
    "metadata"
]

var OuterbaseEvent = {
    // The user has triggered an action to save updates
    onSave: "onSave",
}

var OuterbaseColumnEvent = {
    // The user has began editing the selected cell
    onEdit: "onEdit",
    // Stops editing a cells editor popup view and accept the changes
    onStopEdit: "onStopEdit",
    // Stops editing a cells editor popup view and prevent persisting the changes
    onCancelEdit: "onCancelEdit",
    // Updates the cells value with the provided value
    updateCell: "updateCell",
}

/**
 * ******************
 * Custom Definitions
 * ******************
 * 
 *  ░░░░░░░░░░░░░░░░░
 *  ░░░░▄▄████▄▄░░░░░
 *  ░░░██████████░░░░
 *  ░░░██▄▄██▄▄██░░░░
 *  ░░░░▄▀▄▀▀▄▀▄░░░░░
 *  ░░░▀░░░░░░░░▀░░░░
 *  ░░░░░░░░░░░░░░░░░
 * 
 * Define your custom classes here. We do recommend the usage of our `OuterbasePluginConfig_$PLUGIN_ID`
 * class for you to manage properties between the other classes below, however, it's strictly optional.
 * However, this would be a good class to contain the properties you need to store when a user installs
 * or configures your plugin.
 */
class OuterbasePluginConfig_$PLUGIN_ID {
    cellValue = undefined

    constructor(object) {
        
    }
}

var triggerEvent_$PLUGIN_ID = (fromClass, data) => {
    const event = new CustomEvent("plugin-change", {
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

/**
 * **********
 * Cell View
 * **********
 * 
 *  ░░░░░░░░░░░░░░░░░░
 *  ░░░░░▄▄████▄▄░░░░░
 *  ░░░▄██████████▄░░░
 *  ░▄██▄██▄██▄██▄██▄░
 *  ░░░▀█▀░░▀▀░░▀█▀░░░
 *  ░░░░░░░░░░░░░░░░░░
 *  ░░░░░░░░░░░░░░░░░░
 * 
 * TBD
 */
var templateCell_$PLUGIN_ID = document.createElement('template')
templateCell_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        height: 100%;
        width: calc(100% - 16px);
        padding: 0 8px;
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
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
        color: var(--ob-text-color);
    }

    input:focus {
        outline: none;
    }

    svg {
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: 16px;
        fill: var(--ob-text-color);
        cursor: pointer;
        padding: 2px;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    #container:hover svg {
        opacity: 1;
    }
</style>

<div id="container">
    <input type="text" id="image-value" placeholder="NULL">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M216,48V96a8,8,0,0,1-16,0V67.31l-50.34,50.35a8,8,0,0,1-11.32-11.32L188.69,56H160a8,8,0,0,1,0-16h48A8,8,0,0,1,216,48ZM106.34,138.34,56,188.69V160a8,8,0,0,0-16,0v48a8,8,0,0,0,8,8H96a8,8,0,0,0,0-16H67.31l50.35-50.34a8,8,0,0,0-11.32-11.32Z"></path></svg>
</div>
`

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateCell_$PLUGIN_ID.content.cloneNode(true))
    }
    
    connectedCallback() {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        this.render()

        // When the SVG is clicked, we want to trigger an event to the parent
        this.shadow.querySelector('svg').addEventListener('click', () => {
            triggerEvent_$PLUGIN_ID(this, {
                action: "onedit",
                value: true,
            })
        })
    }

    render() {
        let cellValue = this.getAttribute('cellvalue')

        if (cellValue.length === 0) {
            this.shadow.querySelector('input').placeholder = "NULL"
        } else {
            this.shadow.querySelector('input').value = cellValue
        }
    }
}










var templateEditor_$PLUGIN_ID = document.createElement("template");
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        transform: translateY(4px);
        margin-top: 4px;
        padding: 16px;
        width: 400px;
        height: 200px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        overflow: hidden;
        background-color: #f5f5f5;
        color: var(--ob-text-color);
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-family: Inter, sans-serif;
    }

    .dark {
        border: 1px solid #262626 !important;
        background-color: #171717 !important;
    }

    p {
        margin: 0;
        font-size: 12px;
        opacity: 0.5;
    }

    textarea {
        resize: none;
        flex: 1;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        padding: 8px;
    }

    textarea:focus { 
        outline: none !important;
        border: 3px solid #e5e5e5;
    }

    .dark textarea {
        border: 1px solid #a3a3a3;
        background: #e5e5e5 !important;
    }

    #header {
        display: flex;
        gap: 4px;
        align-items: center;
    }

    #footer {
        display: flex;
        flex-direction: row-reverse;
        gap: 8px;
        align-items: center;
    }

    svg {
        fill: var(--ob-text-color);
        opacity: 0.5;
    }

    #cancel-button {
        color: var(--ob-text-color);
        padding: 8px 10px;
        font-size: 12px;
        line-height: 16px;
        cursor: pointer;
    }
</style>

<div id="container" class="theme-container dark">
    <div id="header">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"></path></svg>
        <p>Cell Text</p>
    </div>

    <textarea></textarea>

    <div id="footer">
        <astra-button id="update-button" size="compact">Update</astra-button>
        <div id="cancel-button">Cancel</div>
    </div>
</div>
`;

class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes_$PLUGIN_ID;
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateEditor_$PLUGIN_ID.content.cloneNode(true))
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        let metadata = decodeAttributeByName_$PLUGIN_ID(this, "metadata")
        this.config.theme = metadata?.theme

        var element = this.shadow.querySelector(".theme-container")
        element.classList.remove("dark")
        element.classList.add(this.config.theme);

        this.render()
    }
    
    connectedCallback() {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        this.render()

        // Listen to input changes in textarea
        // this.shadow.querySelector('textarea').addEventListener('input', (event) => {
        //     // this.config.cellValue = event.target.value

        //     console.log('Textarea updated: ', event.target.value)

        //     triggerEvent_$PLUGIN_ID(this, {
        //         action: "updatecell",
        //         value: event.target.value,
        //     })
        // })
        
        // Listen to `update-button` and `cancel-button` clicks
        this.shadow.querySelector('#update-button').addEventListener('click', () => {
            // Get value of textarea
            let value = this.shadow.querySelector('textarea').value

            triggerEvent_$PLUGIN_ID(this, {
                action: "updatecell",
                value,
            })
        })

        this.shadow.querySelector('#cancel-button').addEventListener('click', () => {
            triggerEvent_$PLUGIN_ID(this, {
                action: "oncanceledit",
                value: true,
            })
        })
    }

    render() {
        // Get the `cellValue` and populate it in the `textarea`
        let cellValue = this.getAttribute('cellvalue')
        this.shadow.querySelector('textarea').value = cellValue
    }
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
// window.customElements.define('outerbase-plugin-cell', OuterbasePluginCell_$PLUGIN_ID)
// window.customElements.define('outerbase-plugin-editor', OuterbasePluginEditor_$PLUGIN_ID)

window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-editor-$PLUGIN_ID', OuterbasePluginEditor_$PLUGIN_ID)