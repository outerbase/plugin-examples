var privileges_$PLUGIN_ID = [
    'cellValue',
    'configuration',
]

var observableAttributes_$PLUGIN_ID = [
    // The value of the cell that the plugin is being rendered in
    "cellValue",
    // The configuration object that the user specified when installing the plugin
    "configuration",
    // Additional information about the view such as count, page and offset.
    "metadata"
]

var OuterbaseEvent_$PLUGIN_ID = {
    // The user has triggered an action to save updates
    onSave: "onSave",
}

var OuterbaseColumnEvent_$PLUGIN_ID = {
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
    theme = "light"
    enumOptions = []

    constructor(object) {
        this.theme = object?.theme ? object.theme : "light";
        this.enumOptions = object?.enumOptions ? object.enumOptions : [];
    }
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
    }

    #inner {
        padding: 2px 8px;
        border-radius: 10px;
        background-color: #f0f0f0;
        color: #333;
        cursor: pointer;
        display: flex;
        gap: 8px;
        transition: background-color 0.2s ease;
    }

    #label {
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        color: var(--ob-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
        flex: 1;
    }

    .dark #inner {
        background-color: #333;
    }

    #inner:hover {
        background-color: #e0e0e0;
    }

    .dark #inner:hover {
        background-color: #444;
    }

    /* Default fill color for the SVG */
    #inner svg {
        fill: #000000;
    }

    /* Fill color for SVG when the dark class is applied */
    .dark #inner svg {
        fill: #FFFFFF;
    }
</style>

<div id="container" class="theme-container">
    <div id="inner">
        <div id="label"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
    </div>
</div>
`

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges_$PLUGIN_ID
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

        this.shadow.querySelector('#inner').addEventListener('click', () => {
            triggerEvent_$PLUGIN_ID(this, {
                action: "onedit",
                value: true,
            })
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))

        let metadata = decodeAttributeByName_$PLUGIN_ID(this, "metadata")
        this.config.theme = metadata?.theme

        var element = this.shadow.querySelector(".theme-container")
        element.classList.remove("dark")
        element.classList.add(this.config.theme);
    }

    render() {
        let cellValue = this.getAttribute('cellvalue')

        if (cellValue.length === 0) {
            cellValue = "NULL"
        }

        this.shadow.querySelector('#label').innerText = cellValue
    }
}







/**
 * ****************
 * Cell Editor View
 * ****************
 * 
 *  ░░░░░░░░░░░░░░░░░░
 *  ░░░░░▄▄████▄▄░░░░░
 *  ░░░▄██████████▄░░░
 *  ░▄██▄██▄██▄██▄██▄░
 *  ░░░▀█▀░░▀▀░░▀█▀░░░
 *  ░░░░░░░░░░░░░░░░░░
 *  ░░░░░░░░░░░░░░░░░░
 * 
 * An optional view that pops below the cell for an expanded viewing area
 * of additional UI data.
 */
var templateEditor_$PLUGIN_ID = document.createElement("template")
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        transform: translateY(4px);
        margin-top: 4px;
        width: 200px;
        height: auto;
        max-height: 240px;
        overflow-y: scroll;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        background-color: #f5f5f5;
        color: var(--ob-text-color);
        font-family: Inter, sans-serif;
    }

    .dark {
        border: 1px solid #262626 !important;
        background-color: #171717 !important;
    }

    #options {
        display: flex;
        flex-direction: column;
    }

    .option {
        cursor: pointer;
        transition: background-color 0.2s ease;
        padding: 8px;
    }

    .option-cell {
        padding: 2px 8px;
        border-radius: 10px;
        background-color: #f0f0f0;
        color: #333;
    }

    .option-cell > span {
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        color: var(--ob-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
        flex: 1;
    }

    .dark .option-cell {
        background-color: #333;
    }

    .option:hover {
        background-color: #e0e0e0;
    }

    .dark .option:hover {
        background-color: #444;
    }
</style>

<div id="container" class="theme-container">
    
    <div id="options">

    </div>
</div>
`

class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes_$PLUGIN_ID
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
        // this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        // this.config.cellValue = decodeAttributeByName_$PLUGIN_ID(this, "cellValue")
        this.render()
    }

    render() {
        // const options = ['Option 1', 'Option 2', 'Option 3']
        const options = this.config.enumOptions
        const optionsContainer = this.shadow.querySelector('#options')

        // Remove all existing options
        optionsContainer.innerHTML = ''

        options.forEach(option => {
            const optionElement = this.createOptionElement(option)
            optionsContainer.appendChild(optionElement)
        })

        // When a user clicks an `option` element, trigger an event
        optionsContainer.querySelectorAll('.option').forEach((option, index) => {
            option.addEventListener('click', () => {
                triggerEvent_$PLUGIN_ID(this, {
                    action: "updatecell",
                    value: options[index],
                })
            })
        })
    }

    createOptionElement(name) {
        // Create a DIV element
        let div = document.createElement('div')
        div.innerHTML = `
            <div class="option">
                <div class="option-cell">
                    <span>${name}</span>
                </div>
            </div>
        `

        return div
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
var templateConfiguration = document.createElement("template")
templateConfiguration.innerHTML = `
<style>
    #container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 100%;
        overflow-y: scroll;
        padding: 40px 50px 65px 40px;
    }

    h1 {
        color: var(--ob-text-color);
    }

    #options {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
    }

    .option {
        padding: 4px 8px;
        background: #333;
        display: flex;
        gap: 8px;
        align-items: center;
        color: white;
        border-radius: 4px;
    }

    .dark .option {
        background: #333;
    }

    .option-cell {
        flex: 1;
    }

    .new-option {
        background: #C1DDC4;
        padding: 4px 8px;
        display: flex;
        gap: 8px;
        align-items: center;
        color: black;
        border-radius: 4px;
    }

    .dark .new-option {
        background: #234427;
    }

    #add-new-option-container {
        display: flex;
        gap: 8px;
        align-items: center;
    }
</style>

<div id="container" class="theme-container">
    <h1>Select Enum Options</h1>

    <div id="options">

    </div>

    <div>
        <div id="adding-options">
            
        </div>

        <div id="add-new-option-container">
            <input id="current-new-option" type="text" placeholder="New Option" style="flex: 1;" />
            <astra-button size="compact" variant="secondary" id="add-new-option">Add Option</astra-button>
        </div>

    </div>

    <astra-button size="compact" id="saveButton">Save View</astra-button>
</div>
`

class OuterbasePluginConfiguration_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})
    newOptions = []

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateConfiguration.content.cloneNode(true))
    }

    connectedCallback() {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        this.config.cellValue = decodeAttributeByName_$PLUGIN_ID(this, "cellValue")

        var saveButton = this.shadow.getElementById("saveButton");
        saveButton.addEventListener("click", () => {
            // Combine the existing `enumOptions` with the `newOptions` array
            this.config.enumOptions = this.config.enumOptions.concat(this.newOptions)

            triggerEvent_$PLUGIN_ID(this, {
                action: OuterbaseEvent_$PLUGIN_ID.onSave,
                value: this.config
            })
        });

        // Listen to when the `add-new-option` button is clicked
        this.shadow.querySelector('#add-new-option').addEventListener('click', () => {
            let value = this.shadow.querySelector('#current-new-option').value
            this.newOptions.push(value)
            this.shadow.querySelector('#current-new-option').value = ""

            this.render();
        })

        this.fetchDistinctValues()
        this.render()
    }

    // attributeChangedCallback(name, oldValue, newValue) {
    //     this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
    //     let metadata = decodeAttributeByName_$PLUGIN_ID(this, "metadata")
    //     this.config.theme = metadata?.theme

    //     var element = this.shadow.querySelector(".theme-container")
    //     element.classList.remove("dark")
    //     element.classList.add(this.config.theme);

    //     this.render()
    // }

    async fetchDistinctValues() {
        try {
            // Based on the information provided to our plugin, we need to identify
            // what the column constraints are and what database table it is linked to.
            // This will allow us to construct a SQL query to fetch the value from the
            // linked table.
            const column = this.getAttribute('columnName')
            const table = JSON.parse(this.getAttribute('tableSchemaValue')).name
            const schema = JSON.parse(this.getAttribute('tableSchemaValue')).schema ?? "public"

            // Necessary information is graciously stored by Outerbase in the `localStorage`
            // for us to make the necessary network request to fetch the value from the linked table.
            const session = JSON.parse(localStorage.getItem('session'))
            const workspaceId = localStorage.getItem('workspace_id')
            const sourceId = localStorage.getItem('source_id')

            // SELECT DISTINCT column_name FROM table_name;

            // When a cached value does not exist for this `schema.table.column.value`, fetch the value
            // from the database and store it in the cache for future re-use.
            await fetch(`https://app.dev.outerbase.com/api/v1/workspace/${workspaceId}/source/${sourceId}/query/raw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': session?.state?.session?.token
                },
                body: JSON.stringify({
                    query: `SELECT DISTINCT ${column} FROM ${schema}.${table};`,
                    options: {}
                })
            }).then(response => response.json()).then(data => {
                const items = data.response?.items ?? []

                // Condense the above `items` array with the structure above into an array of strings
                let itemsArray = items.map(item => item[column])
                this.config.enumOptions = itemsArray

                this.render();
            })
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        const items = this.config.enumOptions
        let select = this.shadow.querySelector('#options')
        select.innerHTML = ''

        items.forEach(item => {
            const div = document.createElement('div')
            div.innerHTML = `
                <div class="option">
                    <div class="option-cell">
                        <span>${item}</span>
                    </div>

                    <button class="remove-option">Remove</button>
                </div>
            `
            select.appendChild(div)
        })

        this.newOptions.forEach(item => {
            const div = document.createElement('div')
            div.innerHTML = `
                <div class="new-option">
                    <div class="option-cell">
                        <span>${item}</span>
                    </div>

                    <button class="remove-option">Remove</button>
                </div>
            `
            select.appendChild(div)
        })

        // Listen to the Remove buttons and remove from list when clicked
        select.querySelectorAll('.remove-option').forEach((removeButton, index) => {
            removeButton.addEventListener('click', () => {
                if (index < items.length) {
                    this.config.enumOptions.splice(index, 1)
                } else {
                    this.newOptions.splice(index - items.length, 1)
                }

                this.render()
            })
        })
    }
}


// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
// window.customElements.define('outerbase-plugin-cell', OuterbasePluginCell_$PLUGIN_ID)
// window.customElements.define('outerbase-plugin-editor', OuterbasePluginEditor_$PLUGIN_ID)
// window.customElements.define('outerbase-plugin-configuration', OuterbasePluginConfiguration_$PLUGIN_ID)

window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-editor-$PLUGIN_ID', OuterbasePluginEditor_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-configuration-$PLUGIN_ID', OuterbasePluginConfiguration_$PLUGIN_ID)
