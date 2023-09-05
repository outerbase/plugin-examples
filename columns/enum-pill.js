var privileges = [
    'cellValue',
    'configuration'
]

var templateCell = document.createElement('template')
templateCell.innerHTML = `
<style>
    #container {
        height: calc(100% - 16px);
        width: calc(100% - 16px);
        padding: 8px;
        position: relative;
    }

    #pill {
        display: flex;
        align-items: center;
        border-radius: 999px;
        padding: 0 16px;
        height: 100%;
        line-height: 100%;
        cursor: pointer;
    }

    #pill:hover {
        background-color: #ff8c00;
    }

    .pill-title {
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>

<div id="container">
    <div id="pill">
        
    </div>
</div>
`

// This is the configuration object that Outerbase passes to your plugin.
// Define all of the configuration options that your plugin requires here.
class OuterbasePluginConfig_$PLUGIN_ID {
    options = []

    constructor(object) {
        this.options = object.options || []
    }
}

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

        // The shadow DOM is a separate DOM tree that is attached to the element.
        // This allows us to encapsulate our styles and markup. It also prevents
        // styles from the parent page from leaking into our plugin.
        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateCell.content.cloneNode(true))
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

        this.render()
    }

    getSelectedColor() {
        let item = this.config.options.find((item) => {
            return item.label?.trim() === this.getAttribute('cellValue')?.trim()
        })

        return item?.color || '#ededed'
    }

    render() {
        this.shadow.querySelector('#container').innerHTML = `
        <div id="pill" style="background-color: ${this.getSelectedColor()};">
            <div class="pill-title">` +
            this.getAttribute('cellValue') +
            `</div>
            <div>
                <svg fill="#000000" height="800px" width="12px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                        viewBox="0 0 511.787 511.787" xml:space="preserve">
                <g>
                    <g>
                        <path d="M508.667,125.707c-4.16-4.16-10.88-4.16-15.04,0L255.76,363.573L18,125.707c-4.267-4.053-10.987-3.947-15.04,0.213
                            c-3.947,4.16-3.947,10.667,0,14.827L248.293,386.08c4.16,4.16,10.88,4.16,15.04,0l245.333-245.333
                            C512.827,136.693,512.827,129.867,508.667,125.707z"/>
                    </g>
                </g>
                </svg>
            </div>
        </div>
        `

        this.shadow.querySelector('#pill').addEventListener('click', () => {
            this.setAttribute('onEdit', true)
            this.render()
        })
    }
}

var templateEditor = document.createElement('template')
templateEditor.innerHTML = `
<style>
    #container {
        max-height: 120px;
        overflow-y: scroll;
    }

    p {
        margin: 0;
    }

    #pill-options {
        top: 100%;
        left: 0;
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);
        z-index: 1;
        padding: 8px;
    }

    .pill-option {
        padding: 0px 8px;
        display: flex;
        align-items: center;
        border-radius: 999px;
        padding: 0 16px;
        line-height: 20px;
        cursor: pointer;
        margin-bottom: 6px;
    }

    .pill-option:hover {
        background-color: #f5f5f5;
    }
</style>

<div id="container">
    <div id="pill-options">
    
    </div>
</div>
`

class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

        // The shadow DOM is a separate DOM tree that is attached to the element.
        // This allows us to encapsulate our styles and markup. It also prevents
        // styles from the parent page from leaking into our plugin.
        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateEditor.content.cloneNode(true))

        // Parse the configuration object from the `configuration` attribute
        // and store it in the `config` property.
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(
            JSON.parse(this.getAttribute('configuration'))
        )

        this.render()
    }

    render() {
        this.shadow.querySelector('#pill-options').innerHTML = `
            ${this.config.options
                .map(
                    (item) => `
                <div class="pill-option" value="${item.label}" style="background-color: ${item.color};">
                    ${item.label}
                </div>
            `
                )
                .join('')}
        `

        // Assuming your options have the class "option"
        const options = this.shadow.querySelectorAll('.pill-option')

        options.forEach((option) => {
            option.addEventListener('click', () => {
                const optionValue = option.innerHTML
                this.setAttribute('cellValue', optionValue)
                this.setAttribute('onStopEdit', true)
            })
        })
    }

    // This function is called when the UI is made available into the DOM. Put any
    // logic that you want to run when the element is first stood up here, such as
    // event listeners, default values to display, etc.
    connectedCallback() {}
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-editor-$PLUGIN_ID', OuterbasePluginEditor_$PLUGIN_ID)