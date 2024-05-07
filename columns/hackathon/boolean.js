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
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }

    span {
        color: #333;
        cursor: pointer;
        display: flex;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        color: var(--ob-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
        flex: 1;
        user-select: none;
    }

    #indicators {
        display: flex;
        flex-direction: column;
        gap: 2px;
        cursor: pointer;
    }

    .indicator {
        height: 4px;
        width: 8px;
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: 4px;
        background-color: #d4d4d4;
    }
    
    .indicator-selected {
        background-color: #44403c;
    }

    .dark .indicator {
        background-color: #44403c;
    }

    .dark .indicator-selected {
        background-color: #d4d4d4;
    }

    svg {
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: 16px;
        fill: var(--ob-text-color);
        cursor: pointer;
        padding: 2px;
        opacity: 0.5;
        transition: opacity 0.2s ease;
    }

    svg:hover {
        opacity: 1;
    }
</style>

<div id="container" class="theme-container">
<!--
    <div id="indicators">
        <div class="indicator" id="indicator-true"></div>
        <div class="indicator" id="indicator-false"></div>
        <div class="indicator" id="indicator-empty"></div>
    </div>
-->
    <span></span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M117.66,170.34a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L72,188.69V48a8,8,0,0,1,16,0V188.69l18.34-18.35A8,8,0,0,1,117.66,170.34Zm96-96-32-32a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L168,67.31V208a8,8,0,0,0,16,0V67.31l18.34,18.35a8,8,0,0,0,11.32-11.32Z"></path></svg>
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

        // If user clicks on `.indicators` then update the cell value to go from "true" > "false" > "null" depending on current value
        this.shadow.querySelector("svg").addEventListener("click", () => {
            this.render();
        });
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
        // let cellValue = this.getAttribute('cellvalue')

        // if (cellValue.length === 0) {
        //     cellValue = "NULL"
        // }

        // this.shadow.querySelector('span').innerText = cellValue

        console.log('Render')
        // let currentValue = this.getAttribute("cellvalue").toLowerCase();
        let currentValue = this.shadow.querySelector('span').innerText.toUpperCase();
        let newValue = "TRUE"

        // this.shadow.querySelector("#indicator-true").classList.remove("indicator-selected")
        // this.shadow.querySelector("#indicator-false").classList.remove("indicator-selected")
        // this.shadow.querySelector("#indicator-empty").classList.remove("indicator-selected")

        if (currentValue === "TRUE") {
            newValue = "FALSE"
            // this.shadow.querySelector("#indicator-false").classList.add("indicator-selected")
        } else if (currentValue === "FALSE") {
            newValue = "NULL"
            // this.shadow.querySelector("#indicator-empty").classList.add("indicator-selected")
        } else {
            newValue = "TRUE"
            // this.shadow.querySelector("#indicator-true").classList.add("indicator-selected")
        }

        // Set value of span
        this.shadow.querySelector('span').innerText = newValue

        // triggerEvent(this, {
        //     type: OuterbaseColumnEvent.updateCell,
        //     data: newValue
        // })
    }
}


// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
// window.customElements.define('outerbase-plugin-cell', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)