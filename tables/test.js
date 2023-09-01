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
var privileges = ['tableValue', 'configuration']

var templateTable = document.createElement('template')
templateTable.innerHTML = `
<style>
    #container {
        display: flex;
        height: 100%;
        overflow-y: scroll;
    }

    .grid-container {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        padding: 12px;
        height: calc(100% - 24px);
    }

    .grid-item {
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
    
    @media (prefers-color-scheme: dark) {
        .grid-item {
            border: 1px solid rgb(52, 52, 56);
        }
    }
</style>

<div id="container">
    
</div>
`

// This is the configuration object that Outerbase passes to your plugin.
// Define all of the configuration options that your plugin requires here.
class OuterbasePluginConfig {
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
}

class OuterbasePluginTable extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig({})
    items = []

    constructor() {
        super()

        // The shadow DOM is a separate DOM tree that is attached to the element.
        // This allows us to encapsulate our styles and markup. It also prevents
        // styles from the parent page from leaking into our plugin.
        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateTable.content.cloneNode(true))
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

        // Set the items property to the value of the `tableValue` attribute.
        if (this.getAttribute('tableValue')) {
            this.items = JSON.parse(this.getAttribute('tableValue'))
        }

        // Manually render dynamic content
        this.render()
    }

    render() {
        this.shadow.querySelector('#container').innerHTML = `
        <div class="grid-container">
            ${this.items
                .map(
                    (item) => `
                <div class="grid-item">
                    ${
                        this.config.imageKey
                            ? `<div class="img-wrapper"><img src="${
                                  item[this.config.imageKey]
                              }" width="100" height="100"></div>`
                            : ``
                    }

                    <div class="contents">
                        ${
                            this.config.titleKey
                                ? `<p class="title">${
                                      item[this.config.titleKey]
                                  }</p>`
                                : ``
                        }
                        ${
                            this.config.descriptionKey
                                ? `<p class="description">${
                                      item[this.config.descriptionKey]
                                  }</p>`
                                : ``
                        }
                        ${
                            this.config.subtitleKey
                                ? `<p class="subtitle">${
                                      item[this.config.subtitleKey]
                                  }</p>`
                                : ``
                        }
                    </div>
                </div>
            `
                )
                .join('')}
        </div>
        `
    }
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define('outerbase-plugin-table', OuterbasePluginTable)
