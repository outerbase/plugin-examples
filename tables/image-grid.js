var observableAttributes_$PLUGIN_ID = [
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

var OuterbaseEvent_$PLUGIN_ID = {
    // The user has triggered an action to save updates
    onSave: "onSave",
    // The user has triggered an action to configure the plugin
    configurePlugin: "configurePlugin",
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

var OuterbaseTableEvent_$PLUGIN_ID = {
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
    limit = 0
    offset = 0
    page = 0
    pageCount = 0
    theme = "light"

    // Inputs from the configuration screen
    imageKey = undefined
    optionalImagePrefix = undefined
    titleKey = undefined
    descriptionKey = undefined
    subtitleKey = undefined

    // Variables for us to hold state of user actions
    deletedRows = []

    constructor(object) {
        this.imageKey = object?.imageKey
        this.optionalImagePrefix = object?.optionalImagePrefix
        this.titleKey = object?.titleKey
        this.descriptionKey = object?.descriptionKey
        this.subtitleKey = object?.subtitleKey
    }

    toJSON() {
        return {
            "imageKey": this.imageKey,
            "optionalImagePrefix": this.optionalImagePrefix,
            "titleKey": this.titleKey,
            "descriptionKey": this.descriptionKey,
            "subtitleKey": this.subtitleKey
        }
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
var templateTable_$PLUGIN_ID = document.createElement("template")
templateTable_$PLUGIN_ID.innerHTML = `
<style>
    #theme-container {
        height: 100%;
    }

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
        overflow: clip;
    }

    .img-wrapper {
        height: 0;
        overflow: hidden;
        padding-top: 100%;
        box-sizing: border-box;
        position: relative;
    }

    .img-empty {
        height: 0;
        overflow: hidden;
        padding-top: 100%;
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #A3A3A3;
        background: #171717;
    }

    .img-empty > div {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        font-family: "Inter", sans-serif;
        font-size: 11px;
        font-style: normal;
        font-weight: 700;
        line-height: 21px; 
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

    .select-column-link {
        font-weight: 500;
        text-decoration-line: underline;
        cursor: pointer;
    }

    .contents {
        padding: 12px 0 0 0;
    }

    .title {
        font-weight: 700;
        font-size: 14px;
        line-height: 21px;
        font-family: "Menlo", sans-serif;
        line-clamp: 2;
        margin-bottom: 0;
    }

    .subtitle {
        font-size: 12px;
        line-height: 21px;
        font-family: "Menlo", sans-serif;
        font-weight: 400;
    }

    .description {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        line-height: 21px;
        font-family: "Menlo", sans-serif;

        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
        overflow: hidden;
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
            gap: 32px;
        }
    }

    @media only screen and (min-width: 1200px) {
        .grid-container {
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 32px;
        }
    }

    @media only screen and (min-width: 1600px) {
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
        return observableAttributes_$PLUGIN_ID
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateTable_$PLUGIN_ID.content.cloneNode(true))
    }

    connectedCallback() {
        this.render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        this.config.tableValue = decodeAttributeByName_$PLUGIN_ID(this, "tableValue")

        let metadata = decodeAttributeByName_$PLUGIN_ID(this, "metadata")
        this.config.count = metadata?.count
        this.config.limit = metadata?.limit
        this.config.offset = metadata?.offset
        this.config.theme = metadata?.theme
        this.config.page = metadata?.page
        this.config.pageCount = metadata?.pageCount

        var element = this.shadow.getElementById("theme-container");
        element.classList.remove("dark")
        element.classList.add(this.config.theme);

        this.render()
    }

    render() {
        this.shadow.querySelector("#container").innerHTML = `
        <div class="grid-container">
            ${this.config?.tableValue?.length && this.config?.tableValue?.map((row) => `
                <div class="grid-item">
                    ${ (this.config.imageKey && this.isValidURL(`${this.config.optionalImagePrefix ?? ''}${row[this.config.imageKey]}`)) 
                        ? `<div class="img-wrapper"><img src="${`${this.config.optionalImagePrefix ?? ''}${row[this.config.imageKey]}`}" width="100" height="100"></div>` 
                        : `<div class="img-empty">
                                <div>
                                    <div style="flex: 1;"></div>
                                    <div>No image selected</div>
                                    <div class="select-column-link">Select column</div>
                                    <div style="flex: 1;"></div>
                                </div>
                            </div>` }

                    <div class="contents">
                        ${ this.config.titleKey ? `<p class="title">${row[this.config.titleKey]}</p>` : `` }
                        ${ this.config.subtitleKey ? `<p class="subtitle">${row[this.config.subtitleKey]}</p>` : `` }
                        ${ this.config.descriptionKey ? `<p class="description">${row[this.config.descriptionKey]}</p>` : `` }
                    </div>
                </div>
            `).join("")}
        </div>

        <div style="text-align: center; padding-top: 40px; padding-bottom: 100px;">
            Viewing ${this.config.offset} - ${this.config.limit} of ${this.config.count} results
            <br />
            Page ${this.config.page} of ${this.config.pageCount}
            <br />
            ${this.config.page > 1 ? `<button id="previousPageButton">Previous Page</button>` : ``}
            ${this.config.page < this.config.pageCount ? `<button id="nextPageButton">Next Page</button>` : ``}
        </div>
        `

        const configurePluginButtons = this.shadow.querySelectorAll('.select-column-link');
        configurePluginButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                triggerEvent_$PLUGIN_ID(this, {
                    action: OuterbaseEvent_$PLUGIN_ID.configurePlugin
                })
            });
        });

        var previousPageButton = this.shadow.getElementById("previousPageButton");
        previousPageButton?.addEventListener("click", () => {
            triggerEvent_$PLUGIN_ID(this, {
                action: OuterbaseTableEvent_$PLUGIN_ID.getPreviousPage,
                value: {}
            })
        });

        var nextPageButton = this.shadow.getElementById("nextPageButton");
        nextPageButton?.addEventListener("click", () => {
            triggerEvent_$PLUGIN_ID(this, {
                action: OuterbaseTableEvent_$PLUGIN_ID.getNextPage,
                value: {}
            })
        });
    }

    isValidURL(string) {
        try {
            new URL(string);
        } catch (_) {
            return false;  
        }

        return true;
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
var templateConfiguration_$PLUGIN_ID = document.createElement("template")
templateConfiguration_$PLUGIN_ID.innerHTML = `
<style>
    #configuration-container {
        display: flex;
        height: 100%;
        overflow-y: scroll;
        padding: 40px 50px 65px 40px;
    }

    .field-title {
        font: "Inter", sans-serif;
        font-size: 12px;
        line-height: 18px;
        font-weight: 500;
        margin: 0 0 8px 0;
    }

    select {
        width: 220px;
        height: 34px;
        margin-bottom: 16px;
        color: black;
        font-size: 14px;
        padding: 0 8px;
        cursor: pointer;

        width: 100%;
        font-family: 'Inter', sans-serif;
        border: 1px solid #a3a3a3;
        border-radius: 6px;
        background: linear-gradient(180deg, #FAFAFA 0%, rgba(250, 250, 250, 0.00) 100%), #FFF;

        background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="32"><path fill="black" d="M480-380 276-584l16-16 188 188 188-188 16 16-204 204Z"/></svg>');
        background-position: 100%;
        background-repeat: no-repeat;
        appearance: none;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
    }

    .preview-card {
        margin-left: 80px;
        width: 240px;
        background-color: white;
        border-radius: 16px;
        overflow: hidden;
    }

    .preview-card > img {
        width: 100%;
        height: 165px;
    }

    .preview-card > div {
        display: flex; 
        flex-direction: column;
    }

    .preview-card > div > p {
        margin: 0;
    }

    .dark {
        #configuration-container {
            background-color: black;
            color: white;
        }
    }

    .dark > div > div> input {
        color: white !important;
    }

    .dark > div > div> select {
        color: white !important;
        background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="32"><path fill="white" d="M480-380 276-584l16-16 188 188 188-188 16 16-204 204Z"/></svg>');
    }

    input {
        width: 220px;
        margin-bottom: 16px;
        font-family: 'Inter', sans-serif;
        padding: 8px 12px;
        border: 1px solid #a3a3a3;
        border-radius: 6px;
        background: linear-gradient(180deg, #FAFAFA 0%, rgba(250, 250, 250, 0.00) 100%), #FFF;
    }

    button {
        display: inline-block;
        padding: 10px 24px;
        font-size: 14px;
        line-height: 18px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        color: white;
        font-family: 'Inter', sans-serif;
        background: linear-gradient(180deg, #171717 0%, #262626 79.91%, #0A0A0A 100%);
        box-shadow: 0px 0px 2px 1.5px rgba(250, 250, 250, 0.50) inset, 0px -2px 2px 0.5px #0A0A0A inset;
    }

    .dark button {
        background: linear-gradient(180deg, #F8F8F8 0%, #FEFEFE 100%);
        box-shadow: 0px -1px 1px 1px #B0B0B0 inset, 0px 0px 2px 0px #FCFCFC inset;
        color: black;
    }

    .img-empty {
        height: 240px;
        overflow: hidden;
        padding-top: 100%;
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #A3A3A3;
        background: #171717;
    }

    .img-empty > div {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        font-family: "Inter", sans-serif;
        font-size: 11px;
        font-style: normal;
        font-weight: 700;
        line-height: 21px; 
    }

    .title {
        font-weight: 700;
        font-size: 14px;
        line-height: 21px;
        font-family: "Menlo", sans-serif;
        line-clamp: 2;
        margin-bottom: 0;
    }

    .subtitle {
        font-size: 12px;
        line-height: 21px;
        font-family: "Menlo", sans-serif;
        font-weight: 400;
    }

    .description {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        line-height: 21px;
        font-family: "Menlo", sans-serif;

        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
        overflow: hidden;
    }
</style>

<div id="theme-container">
    <div id="configuration-container">
        
    </div>
</div>
`
// Can the above div just be a self closing container: <div />

class OuterbasePluginConfiguration_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes_$PLUGIN_ID
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateConfiguration_$PLUGIN_ID.content.cloneNode(true))
    }

    connectedCallback() {
        this.render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        this.config.tableValue = decodeAttributeByName_$PLUGIN_ID(this, "tableValue")
        this.config.theme = decodeAttributeByName_$PLUGIN_ID(this, "metadata").theme

        var element = this.shadow.getElementById("theme-container");
        element.classList.remove("dark")
        element.classList.add(this.config.theme);

        this.render()
    }

    render() {
        let sample = this.config.tableValue.length ? this.config.tableValue[0] : {}
        let keys = Object.keys(sample)

        if (!keys || keys.length === 0 || !this.shadow.querySelector('#configuration-container')) return

        this.shadow.querySelector('#configuration-container').innerHTML = `
        <div style="flex: 1;">
            <p class="field-title">Image Key</p>
            <select id="imageKeySelect">
                ` + keys.map((key) => `<option value="${key}" ${key === this.config.imageKey ? 'selected' : ''}>${key}</option>`).join("") + `
            </select>

            <p class="field-title">Image URL Prefix (optional)</p>
            <input type="text" value="${this.config.optionalImagePrefix ? this.config.optionalImagePrefix : ''}" />

            <p class="field-title">Title Key</p>
            <select id="titleKeySelect">
                ` + keys.map((key) => `<option value="${key}" ${key === this.config.titleKey ? 'selected' : ''}>${key}</option>`).join("") + `
            </select>

            <p class="field-title">Description Key</p>
            <select id="descriptionKeySelect">
                ` + keys.map((key) => `<option value="${key}" ${key === this.config.descriptionKey ? 'selected' : ''}>${key}</option>`).join("") + `
            </select>

            <p class="field-title">Subtitle Key</p>
            <select id="subtitleKeySelect">
                ` + keys.map((key) => `<option value="${key}" ${key === this.config.subtitleKey ? 'selected' : ''}>${key}</option>`).join("") + `
            </select>

            <div style="margin-top: 8px;">
                <button id="saveButton">Save View</button>
            </div>
        </div>

        <div style="position: relative;">
            <div class="preview-card">
                ${ (this.config.imageKey && this.isValidURL(`${this.shadow.querySelector("input")?.value}${sample[this.config.imageKey]}`)) 
                    ? `<div class="img-wrapper"><img src="${`${this.shadow.querySelector("input")?.value}${sample[this.config.imageKey]}`}" width="100%" height="100%"></div>` 
                    : `<div class="img-empty">
                            <div>
                                <div style="flex: 1;"></div>
                                <div>No image selected</div>
                                <div class="select-column-link">Select column</div>
                                <div style="flex: 1;"></div>
                            </div>
                        </div>` }

                <div style="padding: 16px;">
                    <p class="title">${sample[this.config.titleKey]}</p>
                    <p class="subtitle">${sample[this.config.subtitleKey]}</p>
                    <p class="description">${sample[this.config.descriptionKey]}</p>
                </div>
            </div>
        </div>
        `

        var saveButton = this.shadow.getElementById("saveButton");
        saveButton.addEventListener("click", () => {
            triggerEvent_$PLUGIN_ID(this, {
                action: OuterbaseEvent_$PLUGIN_ID.onSave,
                value: this.config.toJSON()
            })
        });

        var imageKeySelect = this.shadow.getElementById("imageKeySelect");
        imageKeySelect.addEventListener("change", () => {
            this.config.imageKey = imageKeySelect.value
            this.render()
        });
        
        var optionalImagePrefixInput = this.shadow.querySelector("input");
        optionalImagePrefixInput.addEventListener("change", () => {
            this.config.optionalImagePrefix = optionalImagePrefixInput.value
            this.render()
        });

        var titleKeySelect = this.shadow.getElementById("titleKeySelect");
        titleKeySelect.addEventListener("change", () => {
            this.config.titleKey = titleKeySelect.value
            this.render()
        });

        var descriptionKeySelect = this.shadow.getElementById("descriptionKeySelect");
        descriptionKeySelect.addEventListener("change", () => {
            this.config.descriptionKey = descriptionKeySelect.value
            this.render()
        });

        var subtitleKeySelect = this.shadow.getElementById("subtitleKeySelect");
        subtitleKeySelect.addEventListener("change", () => {
            this.config.subtitleKey = subtitleKeySelect.value
            this.render()
        });
    }

    isValidURL(string) {
        try {
            new URL(string);
        } catch (_) {
            return false;  
        }

        return true;
    }
}

window.customElements.define('outerbase-plugin-table-$PLUGIN_ID', OuterbasePluginTable_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-configuration-$PLUGIN_ID', OuterbasePluginConfiguration_$PLUGIN_ID)
// window.customElements.define('outerbase-plugin-table-gallery', OuterbasePluginTable_$PLUGIN_ID)
// window.customElements.define('outerbase-plugin-configuration-gallery', OuterbasePluginConfiguration_$PLUGIN_ID)
