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
        flex-direction: column;
        height: 100%;
        overflow-y: scroll;
        padding: 24px;
    }

    #flag-list {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
    }

    .list-item {
        width: 300px;
        height: 300px;
        border: 1px solid white;
        border-radius: 8px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .value-input {
        width: calc(100% - 16px);
        background: transparent;
        border: 1px solid white;
        color: white;
        padding: 4px 8px;
        flex: 1;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
      }
      
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #2196F3;
    }

    input:checked + .slider:before {
        transform: translateX(26px);
    }
      

    @media (prefers-color-scheme: dark) {
        #container {
            color: white;
        }
    }
</style>

<div id="container">
    <h1>My Feature Flags</h1>

    <div id="flag-list">

    </div>
</div>
`

class OuterbasePluginConfig_$PLUGIN_ID {
    constructor(object) {
        
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
        this.shadow.querySelector('#flag-list').innerHTML = `
            ${this.items.map((item, index) => `
                <div class="list-item">
                    <h4 style="margin: 0;" class="text-3xl font-bold underline">${item.name}</h4>
                    <p style="margin: 0;">Flag Value:</p>
                    <textarea class="value-input" data-index="${index}" placeholder="Enter value">${item.value}</textarea>

                    <div>
                        <label class="switch">
                            <input type="checkbox" id="toggleSwitch" data-index="${index}" checked="${item.status === 'on'}">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            `).join("")}
        `

        const textareas = this.shadowRoot.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('blur', (event) => {
                const index = event.target.getAttribute('data-index');
                const value = event.target.value; 

                this.items[index].value = event.target.value;

                const data = {
                    action: 'onUpdateRow',
                    value: {...this.items[index]}
                };

                const customEvent = new CustomEvent('custom-change', {
                    detail: data,
                    bubbles: true,  // If you want the event to bubble up through the DOM
                    composed: true  // Allows the event to pass through shadow DOM boundaries
                });

                this.dispatchEvent(customEvent)
            });
        });

        this.shadow.addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"]')) {
                const index = Number(e.target.getAttribute('data-index'));
                this.items[index].status = e.target.checked;

                const data = {
                    action: 'onUpdateRow',
                    value: {...this.items[index]}
                };

                const event = new CustomEvent('custom-change', {
                    detail: data,
                    bubbles: true,  // If you want the event to bubble up through the DOM
                    composed: true  // Allows the event to pass through shadow DOM boundaries
                });

                this.dispatchEvent(event);
            }
        });
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
            <h1>Hello, Configuration World!</h1>

            <div style="margin-top: 8px;">
                <button id="saveButton">Save View</button>
            </div>
        </div>
        `

        var saveButton = this.shadow.getElementById("saveButton");
        saveButton.addEventListener("click", () => {
            this.setAttribute('onsave', true)
        });
    }
}

window.customElements.define('outerbase-plugin-table-$PLUGIN_ID', OuterbasePluginTable_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-table-configuration-$PLUGIN_ID', OuterbasePluginTableConfiguration_$PLUGIN_ID)
