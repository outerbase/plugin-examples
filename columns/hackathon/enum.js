var privileges_$PLUGIN_ID = [
    'cellValue',
    'configuration',
]

var observableAttributes = [
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
    theme = "light"

    constructor(object) {
        this.theme = object?.theme ? object.theme : "light";
    }
}

var triggerEvent = (fromClass, data) => {
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

        // Get the indicator element
        // const indicator = this.shadow.querySelector("#indicator")

        // // If the indicator is less than 5, set the color to red
        // let number = parseInt(cellValue)

        // // Check if `number` is a number
        // if (isNaN(number)) {
        //     number = 0
        // }

        // if (number <= 5) {
        //     indicator.style.backgroundColor = "#fafafa"
        // } else if (number > 5 && number < 10) {
        //     indicator.style.backgroundColor = "#a8a29e"
        // } else {
        //     indicator.style.backgroundColor = "#44403c"
        // }
    }
}


// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
// window.customElements.define('outerbase-plugin-cell', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)