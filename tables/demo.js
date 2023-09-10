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
    'tableValue',
    'configuration',
]

var templateTable = document.createElement('template')
templateTable.innerHTML = `
<style>
    #container {
        display: flex;
        height: 100%;
        overflow-y: scroll;
    }
</style>

<div id="container">
    
</div>
`

class OuterbasePluginConfig_$PLUGIN_ID {
    imageKey = undefined
    titleKey = undefined
    descriptionKey = undefined
    subtitleKey = undefined

    constructor(object) {
        this.imageKey = object?.imageKey
        this.titleKey = object?.titleKey
        this.descriptionKey = object?.descriptionKey
        this.subtitleKey = object?.subtitleKey
    }

    toJSON() {
        return {
            "imageKey": this.imageKey,
            "titleKey": this.titleKey,
            "descriptionKey": this.descriptionKey,
            "subtitleKey": this.subtitleKey
        }
    }
}

class OuterbasePluginTable_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})
    items = []

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateTable.content.cloneNode(true))
    }

    connectedCallback() {
        const encodedTableJSON = this.getAttribute('configuration');
        const decodedTableJSON = encodedTableJSON
            ?.replace(/&quot;/g, '"')
            ?.replace(/&#39;/g, "'");
        const configuration = JSON.parse(decodedTableJSON);

        if (configuration) {
            this.config = new OuterbasePluginConfig_$PLUGIN_ID(
                configuration
            )
        }

        // Set the items property to the value of the `tableValue` attribute.
        if (this.getAttribute('tableValue')) {
            const encodedTableJSON = this.getAttribute('tableValue');
            const decodedTableJSON = encodedTableJSON
                ?.replace(/&quot;/g, '"')
                ?.replace(/&#39;/g, "'");
            this.items = JSON.parse(decodedTableJSON);
        }

        // Manually render dynamic content
        this.render()
    }

    render() {
        this.shadow.querySelector('#container').innerHTML = `
        <div class="grid-container">
            ${this.items.map((item) => `
                <div class="grid-item">
                    ${ this.config.imageKey ? `<div class="img-wrapper"><img src="${item[this.config.imageKey]}" width="100" height="100"></div>` : `` }

                    <div class="contents">
                        ${ this.config.titleKey ? `<p class="title">${item[this.config.titleKey]}</p>` : `` }
                        ${ this.config.descriptionKey ? `<p class="description">${item[this.config.descriptionKey]}</p>` : `` }
                        ${ this.config.subtitleKey ? `<p class="subtitle">${item[this.config.subtitleKey]}</p>` : `` }
                    </div>
                </div>
            `).join("")}
        </div>
        `
    }

    callCustomEvent(data) {
        const event = new CustomEvent('custom-change', {
            detail: data,
            bubbles: true,  // If you want the event to bubble up through the DOM
            composed: true  // Allows the event to pass through shadow DOM boundaries
        });

        this.dispatchEvent(event);
    }
}

var templateConfiguration = document.createElement('template')
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

class OuterbasePluginTableConfiguration_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})
    items = []

    constructor() {
        super()

        // The shadow DOM is a separate DOM tree that is attached to the element.
        // This allows us to encapsulate our styles and markup. It also prevents
        // styles from the parent page from leaking into our plugin.
        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateConfiguration.content.cloneNode(true))
    }

    connectedCallback() {
        // Parse the configuration object from the `configuration` attribute
        // and store it in the `config` property.
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(
            JSON.parse(this.getAttribute('configuration'))
        )

        // Set the items property to the value of the `tableValue` attribute.
        if (this.getAttribute('tableValue')) {
            this.items = JSON.parse(this.getAttribute('tableValue'))
        }

        // Manually render dynamic content
        this.render()
    }

    render() {
        let sample = this.items.length ? this.items[0] : {}
        let keys = Object.keys(sample)

        this.shadow.querySelector('#container').innerHTML = `
        <div style="flex: 1;">
            <p class="field-title">Image Key</p>
            <select id="imageKeySelect">
                ` + keys.map((key) => `<option value="${key}" ${key === this.config.imageKey ? 'selected' : ''}>${key}</option>`).join("") + `
            </select>

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

        <div>
            <div class="preview-card">
                <img src="${sample[this.config.imageKey]}" width="100" height="100">

                <div>
                    <p style="margin-bottom: 8px; font-weight: bold; font-size: 16px; line-height: 24px; font-family: 'Inter', sans-serif;">${sample[this.config.titleKey]}</p>
                    <p style="margin-bottom: 8px; font-size: 14px; line-height: 21px; font-weight: 400; font-family: 'Inter', sans-serif;">${sample[this.config.descriptionKey]}</p>
                    <p style="margin-top: 12px; font-size: 12px; line-height: 16px; font-family: 'Inter', sans-serif; color: gray; font-weight: 300;">${sample[this.config.subtitleKey]}</p>
                </div>
            </div>
        </div>
        `

        var saveButton = this.shadow.getElementById("saveButton");
        saveButton.addEventListener("click", () => {
            this.callCustomEvent({
                action: 'onsave',
                value: this.config.toJSON()
            })
        });

        var imageKeySelect = this.shadow.getElementById("imageKeySelect");
        imageKeySelect.addEventListener("change", () => {
            this.config.imageKey = imageKeySelect.value
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

    callCustomEvent(data) {
        const event = new CustomEvent('custom-change', {
            detail: data,
            bubbles: true,  // If you want the event to bubble up through the DOM
            composed: true  // Allows the event to pass through shadow DOM boundaries
        });

        this.dispatchEvent(event);
    }
}

window.customElements.define('outerbase-plugin-table-$PLUGIN_ID', OuterbasePluginTable_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-table-configuration-$PLUGIN_ID', OuterbasePluginTableConfiguration_$PLUGIN_ID)
