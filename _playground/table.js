const observableAttributes = [
    // The value of the cell that the plugin is being rendered in
    "cellvalue",
    // The value of the row that the plugin is being rendered in
    "rowvalue",
    // The value of the table that the plugin is being rendered in
    "tablevalue",
    // The schema of the table that the plugin is being rendered in
    "tableschemavalue",
    // The schema of the database that the plugin is being rendered in
    "databaseschemavalue",
    // The configuration object that the user specified when installing the plugin
    "configuration",
    // Additional information about the view such as count, page and offset.
    "metadata"
]

const OuterbaseEvent = {
    // The user has triggered an action to save updates
    onSave: "onSave",
}

const OuterbaseColumnEvent = {
    // The user has began editing the selected cell
    onEdit: "onEdit",
    // Stops editing a cells editor popup view and accept the changes
    onStopEdit: "onStopEdit",
    // Stops editing a cells editor popup view and prevent persisting the changes
    onCancelEdit: "onCancelEdit",
    // Updates the cells value with the provided value
    updateCell: "updateCell",
}

const OuterbaseTableEvent = {
    // Updates the value of a row with the provided JSON value
    updateRow: "updateRow",
    // Deletes an entire row with the provided JSON value
    deleteRow: "deleteRow",
    // Creates a new row with the provided JSON value
    createRow: "createRow",
    // Performs an action to get the next page of results, if they exist
    getNextPage: "getNextPage",
    // Performs an action to get the previous page of results, if they exist
    getPreviousPage: "getPreviousPage"
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
    // Inputs from Outerbase for us to retain
    tableValue = undefined
    count = 0
    page = 1
    offset = 50
    theme = "light"

    // Inputs from the configuration screen
    imageKey = undefined
    titleKey = undefined
    descriptionKey = undefined
    subtitleKey = undefined

    // Variables for us to hold state of user actions
    deletedRows = []

    constructor(object) {
        this.imageKey = object?.imageKey
        this.titleKey = object?.titleKey
        this.descriptionKey = object?.descriptionKey
        this.subtitleKey = object?.subtitleKey
    }
}

const triggerEvent = (fromClass, data) => {
    const event = new CustomEvent("custom-change", {
        detail: data,
        bubbles: true,
        composed: true
    });

    fromClass.dispatchEvent(event);
}

const decodeAttributeByName = (fromClass, name) => {
    const encodedJSON = fromClass.getAttribute(name);
    const decodedJSON = encodedJSON
        ?.replace(/&quot;/g, '"')
        ?.replace(/&#39;/g, "'");
    return decodedJSON ? JSON.parse(decodedJSON) : {};
}


/**
 * **********
 * Table View
 * **********
 * 
 *  ░░░░░░░░░░░░░░░░░░
 *  ░░░░░▄▄████▄▄░░░░░
 *  ░░░▄██████████▄░░░
 *  ░▄██▄██▄██▄██▄██▄░
 *  ░░░▀█▀░░▀▀░░▀█▀░░░
 *  ░░░░░░░░░░░░░░░░░░
 *  ░░░░░░░░░░░░░░░░░░
 */
var templateTable = document.createElement("template")
templateTable.innerHTML = `
<style>
    #container {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: scroll;
    }

    .grid-container {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        padding: 12px;
    }

    .grid-item {
        position: relative;
        display: flex;
        flex-direction: column;
        background-color: transparent;
        border: 1px solid rgb(238, 238, 238);
        border-radius: 4px;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);
        overflow: clip;
    }

    .img-wrapper {
        height: 0;
        overflow: hidden;
        padding-top: 100%;
        box-sizing: border-box;
        position: relative;
    }

    img {
        width: 100%;
        vertical-align: top;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        object-fit: cover;
    }

    .contents {
        padding: 12px;
    }

    .title {
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
        font-family: "Inter", sans-serif;
        line-clamp: 2;
        margin-bottom: 8px;
    }

    .description {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        line-height: 20px;
        font-family: "Inter", sans-serif;

        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
        overflow: hidden;
    }

    .subtitle {
        font-size: 12px;
        line-height: 16px;
        font-family: "Inter", sans-serif;
        color: gray;
        font-weight: 300;
        margin-top: 8px;
    }

    p {
        margin: 0;
    }

    .dark {
        #container {
            background-color: black;
            color: white;
        }
    }

    @media only screen and (min-width: 768px) {
        .grid-container {
            grid-template-columns: repeat(4, minmax(0, 1fr));
        }
    }

    @media only screen and (min-width: 1200px) {
        .grid-container {
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 20px;
        }
    }

    @media only screen and (min-width: 1400px) {
        .grid-container {
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 32px;
        }
    }
</style>

<div id="theme-container">
    <div id="container">
        
    </div>
</div>
`
// Can the above div just be a self closing container: <div />

class OuterbasePluginTable_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateTable.content.cloneNode(true))
    }

    connectedCallback() {
        this.render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName(this, "configuration"))
        this.config.tableValue = decodeAttributeByName(this, "tableValue")
        this.config.theme = decodeAttributeByName(this, "metadata").theme

        var element = this.shadow.getElementById("theme-container");
        element.classList.remove("dark")
        element.classList.add(this.config.theme);

        console.log('Theme: ', this.config.theme)

        this.render()
    }

    render() {
        this.shadow.querySelector("#container").innerHTML = `
        <div class="grid-container">
            <h1>Welcome to the Outerbase Car Dealership!<br /><br /><br /><br />View All ></h1>
            ${this.config?.tableValue?.length && this.config?.tableValue?.map((row) => `
                <div class="grid-item">
                    <button class="deleteRowButton" style="position: absolute; top: 12px; right: 12px; z-index: 1;">X</button>
                    ${ this.config.imageKey ? `<div class="img-wrapper"><img src="${row[this.config.imageKey]}" width="100" height="100"></div>` : `` }

                    <div class="contents">
                        ${ this.config.titleKey ? `<p class="title">${row[this.config.titleKey]}</p>` : `` }
                        ${ this.config.subtitleKey ? `<p class="subtitle">${row[this.config.subtitleKey]}</p>` : `` }
                        ${ this.config.descriptionKey ? `<p class="description">${row[this.config.descriptionKey]}</p>` : `` }

                        <button class="markSoldButton" style="margin-top: 12px;">Mark as sold</button>
                    </div>
                </div>
            `).join("")}

            <div style="display: flex; flex-direction: column; gap: 12px;">
                <h1>What Next?</h1>
                <button id="createRowButton">Create New</button>
                <button id="previousPageButton">Previous Page</button>
                <button id="nextPageButton">Next Page</button>
            </div>
        </div>
        `

        const deleteRowButtons = this.shadow.querySelectorAll('.deleteRowButton');
        deleteRowButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                let row = this.config.tableValue[index]
                triggerEvent(this, {
                    action: OuterbaseTableEvent.deleteRow,
                    value: row
                })

                this.config.deletedRows.push(row)
                this.config.tableValue.splice(index, 1)
                this.render()
            });
        });

        const markSoldButtons = this.shadow.querySelectorAll('.markSoldButton');
        markSoldButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                let row = this.config.tableValue[index]
                triggerEvent(this, {
                    action: OuterbaseTableEvent.updateRow,
                    value: row
                })
            });
        });

        var createRowButton = this.shadow.getElementById("createRowButton");
        createRowButton.addEventListener("click", () => {
            triggerEvent(this, {
                action: OuterbaseTableEvent.createRow,
                value: {}
            })
        });

        var previousPageButton = this.shadow.getElementById("previousPageButton");
        previousPageButton.addEventListener("click", () => {
            triggerEvent(this, {
                action: OuterbaseTableEvent.getPreviousPage,
                value: {}
            })
        });

        var nextPageButton = this.shadow.getElementById("nextPageButton");
        nextPageButton.addEventListener("click", () => {
            triggerEvent(this, {
                action: OuterbaseTableEvent.getNextPage,
                value: {}
            })
        });
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
        height: 100%;
        overflow-y: scroll;
        padding: 40px 50px 65px 40px;
    }
</style>

<div id="container">
    
</div>
`
// Can the above div just be a self closing container: <div />

class OuterbasePluginTableConfiguration_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateConfiguration.content.cloneNode(true))
    }

    connectedCallback() {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName(this, "configuration"))
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
            triggerEvent(this, {
                action: OuterbaseEvent.onSave,
                value: {}
            })
        });
    }
}

window.customElements.define("outerbase-plugin-table", OuterbasePluginTable_$PLUGIN_ID)
window.customElements.define("outerbase-plugin-table-configuration", OuterbasePluginTableConfiguration_$PLUGIN_ID)