var observableAttributes = [
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

var OuterbaseEvent = {
    // The user has triggered an action to save updates
    onSave: "onSave",
    // The user has triggered an action to configure the plugin
    configurePlugin: "configurePlugin",
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

var OuterbaseTableEvent = {
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

    // Variables for us to hold state of user actions
    deletedRows = []

    constructor(object) {
        
    }

    toJSON() {
        return {
            
        }
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

var decodeAttributeByName = (fromClass, name) => {
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
    #theme-container {
        height: 100%;
    }

    .kanban-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .grid-container {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 12px;
        padding: 12px;
        height: 100%;
        overflow: hidden;
    }

    .create-ticket-button {
        background: #0052CC;
        padding: 0 12px;
        line-height: 32px;
        border: 0;
        border-radius: 4px;
        cursor: pointer;
        color: white;
        font-size: 14px;
        font-weight: 500;
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    }

    .toggle-ticket-type {
        background: #E4E5E7;
        padding: 0 12px;
        line-height: 32px;
        border: 0;
        cursor: pointer;
        color: black;
        font-size: 14px;
        font-weight: 500;
        color: #5e6c84;
    }

    .toggle-ticket-type-unselected {
        opacity: 0.5;
    }
    
    .column {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .column-title {
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
        width: 100%;
        margin-bottom: 8px;
    }

    .grid-item {
        flex: 1;
        position: relative;
        background-color: transparent;
        overflow-y: scroll;
        height: calc(100% - 16px);
        background-color: #F4F5F7;
        border-radius: 8px;
        padding: 8px;
    }

    .card {
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        padding: 8px;
        display: flex;
        flex-direction: column;
        row-gap: 8px;
        color: black;
        margin-bottom: 4px;
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-size: 14px;
        line-height: 21px;
        cursor: grab;
        border: 1px solid #edeef1;
        box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.1);
        transition: all 0.15s ease-in-out;
    }

    .card:hover {
        background: #ebebeb;
    }

    .card-title {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
                line-clamp: 3; 
        -webkit-box-orient: vertical;
        margin-bottom: 4px;
    }

    .priority-container {
        display: flex;
        gap: 2px;
    }

    .priority-indicator {
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background-color: #b4b9c4;
    }

    .priority-indicator-medium {
        background-color: #e5bb68 !important;
    }

    .priority-indicator-high {
        background-color: #e62910 !important;
    }

    .card-bottom {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .bug-square {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        background-color: red;
    }

    .task-square {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        background-color: #66aae3;
    }
    .avatar-large {
        width: 32px;
        height: 32px;
        border-radius: 9999px;
        background-color: #5144a4;
        color: white;
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        cursor: pointer;
        opacity: 0.5;
        margin-right: 2px;
    }
    .avatar-large-selected {
        ring: 2;
        ring-color: #2152c5;
        opacity: 1;
    }

    .card-bottom-avatar {
        width: 24px;
        height: 24px;
        border-radius: 9999px;
        background-color: #5144a4;
        color: white;
        line-height: 24px;
        text-align: center;
        font-size: 10px;
    }

    .is-dragging {
        scale: 1.05;
        opacity: 0.5;
    }

    .dark {
        .kanban-container {
            background-color: black;
            color: white;
        }
    }

    .ticket-detail-modal {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .ticket-detail-container {
        display: flex;
        flex-direction: column;
        padding: 24px 32px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        height: 90%;
        background: white;
        border-radius: 8px;
        box-shadow: rgba(9, 30, 66, 0.03) 0px 8px 12px 0px, rgba(9, 30, 66, 0.1) 0px 0px 1px 0px;
        background-clip: border-box;
    }

    .modal-header-title {
        color: #6B778C;
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-family: 14px;
    }

    .modal-header-button {
        position: relative;
        width: 32px;
        height: 32px;
        cursor: pointer;
    }

    .modal-header-button:hover {
        background-color: #ebebeb;
        border-radius: 4px;
    }

    .modal-header-button > svg {
        width: 24px;
        height: 24px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    #task-details-title-input {
        font-size: 24px; 
        font-weight: 500; 
        width: 100%; 
        margin-top: 8px; 
        margin-bottom: 16px; 
        border: 0; 
        outline: 0;
        padding: 8px;
        transition: all 0.15s ease-in-out;
        border-radius: 4px;
    }

    #task-details-title-input:focus {
        outline: 2px solid #2152c5;
    }

    #task-details-title-input::placeholder {
        color: #6B778C;
    }

    #task-details-title-input::-webkit-input-placeholder {
        color: #6B778C;
    }

    #task-details-title-input::-moz-placeholder {
        color: #6B778C;
    }

    #task-details-title-input:-ms-input-placeholder {
        color: #6B778C;
    }

    #task-details-title-input:hover {
        background-color: #ebebeb;
    }

    #task-details-description-title {
        margin-left: 8px; 
        margin-bottom: 8px; 
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-family: 14px;
        font-weight: 600;
    }

    #environment-details {
        font-size: 14px;
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        margin-left: 8px;
    }

    #task-details-description-input {
        width: 100%; 
        height: 240px;
        margin-bottom: 16px; 
        border: 0; 
        outline: 0;
        padding: 8px;
        transition: all 0.15s ease-in-out;
        border-radius: 4px;
        font-size: 14px;
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        resize: none;
    }

    #task-details-description-input:hover {
        background-color: #ebebeb;
    }

    #modal-right {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 400px; 
        margin-top: 8px;
    }

    .modal-right-item-title {
        width: 150px;
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-size: 12px;
        font-weight: 600;
    }

    .modal-right-item-description {
        display: flex;
        gap: 8px;
        align-items: center;
        flex: 1;
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-size: 14px;
        font-weight: 400;
    }

    .modal-right-subtitle {
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-size: 12px;
        font-weight: 400;
        color: #6B778C;
    }

    #modal-status-button {
        display: flex;
        gap: 8px;
        align-items: center;
        line-height: 32px;
        padding: 0 10px 0 16px;
        background: #00875a;
        font-weight: 600;
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-size: 14px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        color: white;
    }

    #modal-save-action-button {
        display: flex;
        align-items: center;
        line-height: 32px;
        padding: 0 16px;
        background: #0052CC;
        font-weight: 600;
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-size: 14px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        color: white;
    }

    #recent-errors-title:hover {
        background: #ebebeb;
        cursor: pointer;
    }

    #recent-errors {
        font-size: 12px;
        font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    }
</style>

<div id="theme-container">
    <div class="kanban-container">
    
    </div>

    <div class="ticket-detail-modal">
        <div class="ticket-detail-container">

            
        </div>
    </div>
</div>
`

class OuterbasePluginTable_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    people = []
    selectedPeople = []

    showBugs = true
    showFeatures = true
    showSupport = true

    backlog = []
    progress = []
    blocked = []
    qa = []
    done = []

    showDetailsModalRecentErrors = false

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateTable.content.cloneNode(true))

        this.getAllPeople()
        this.getAllTasks()
    }

    connectedCallback() {
        this.render()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.config.tableValue = decodeAttributeByName(this, "tableValue")

        var element = this.shadow.getElementById("theme-container");
        element.classList.remove("dark")
        element.classList.add(this.config.theme);

        this.render()
    }

    async getAllPeople() {
        let response = await fetch("https://absolute-teal.cmd.outerbase.io/people", {
            method: "GET"
        })

        let json = await response.json()
        this.people = json.response.items
        this.selectedPeople = Object.assign([], json.response.items)

        this.render()
    }

    async getAllTasks() {
        let response = await fetch("https://absolute-teal.cmd.outerbase.io/tasks", {
            method: "GET"
        })

        let json = await response.json()
        this.config.tableValue = json.response.items

        this.render()
    }

    async updateTask(id, status) {
        fetch("https://absolute-teal.cmd.outerbase.io/task/status", {
            method: "PUT",
            body: JSON.stringify({
                id: id,
                status: status,
            })
        })
    }

    setupCheck() {
        this.shadow.appendChild(templateTable.content.cloneNode(true))
    }

    render() {
        this.setupCheck()

        this.backlog = this.config.tableValue?.filter((item) => { return item.status?.toLowerCase() === "backlog" })
        this.progress = this.config.tableValue?.filter((item) => { return item.status?.toLowerCase() === "in progress" })
        this.blocked = this.config.tableValue?.filter((item) => { return item.status?.toLowerCase() === "blocked" })
        this.qa = this.config.tableValue?.filter((item) => { return item.status?.toLowerCase() === "qa" })
        this.done = this.config.tableValue?.filter((item) => { return item.status?.toLowerCase() === "done" })

        const selectedPeopleIds = new Set(this.selectedPeople.map(person => person.id));
        const supportedTypes = new Set([this.showBugs ? "bug" : undefined, this.showFeatures ? "task" : undefined, this.showSupport ? "support" : undefined]);
        
        this.shadow.querySelector(".kanban-container").innerHTML = `
            <div style="padding: 12px; display: flex; gap: 0px; align-items: center;">
                <!-- People -->
                ` + this.people?.map((person, index) =>
                    `<div data-person-id="${person.id}" class="avatar-large ${selectedPeopleIds.has(person.id) ? 'avatar-large-selected' : ''}" style="background-color: ${person.color};">
                        ${person.first_name[0] + person.last_name[0]}
                    </div>`
                ).join("") + `

                <div style="flex: 1;"></div>

                <!-- Filter based on type (e.g. Bug, Feature, Support) -->
                <button id="show-bugs-button" class="toggle-ticket-type ${this.showBugs ? '' : 'toggle-ticket-type-unselected'}" style="border-top-left-radius: 6px; border-bottom-left-radius: 6px;">Bug</button>
                <button id="show-features-button" class="toggle-ticket-type ${this.showFeatures ? '' : 'toggle-ticket-type-unselected'}">Feature</button>
                <button id="show-supports-button" class="toggle-ticket-type ${this.showSupport ? '' : 'toggle-ticket-type-unselected'}" style="border-top-right-radius: 6px; border-bottom-right-radius: 6px;">Support</button>

                <div style="width: 24px;"></div>

                <!-- Create ticket button -->
                <div style="text-align: right;">
                    <button class="create-ticket-button">Create</button>
                </div>
            </div>
        
            <div class="grid-container">
                <div class="column">
                    <div class="column-title column-title-backlog">Backlog (${this.backlog.filter((item) => { 
                        return item.status?.toLowerCase() === "backlog" && 
                        supportedTypes.has(item.type?.toLowerCase()) &&
                        this.selectedPeople?.find((person) => person.first_name + " " + person.last_name === item.assignee)
                    }).length})</div>

                    <div class="grid-item" data-column="backlog">
                        ` + this.config.tableValue?.filter((item) => { 
                                return item.status?.toLowerCase() === "backlog" && 
                                    supportedTypes.has(item.type?.toLowerCase()) &&
                                    this.selectedPeople?.find((person) => person.first_name + " " + person.last_name === item.assignee)
                            }).map((row) => {
                            return this.createCardElement({
                                title: row.title,
                                priority: row.priority,
                                type: row.type,
                                id: row.id,
                                assignee: row.assignee,
                                status: row.status
                            })
                        }).join("") + `
                    </div>
                </div>

                <div class="column">
                    <div class="column-title column-title-backlog">In Progress (${this.progress.filter((item) => { 
                        return item.status?.toLowerCase() === "in progress" && 
                        supportedTypes.has(item.type?.toLowerCase()) &&
                        this.selectedPeople?.find((person) => person.first_name + " " + person.last_name === item.assignee)
                    }).length})</div>

                    <div class="grid-item" data-column="in-progress">
                        ` + this.config.tableValue?.filter((item) => { 
                                return item.status?.toLowerCase() === "in progress" && 
                                    supportedTypes.has(item.type?.toLowerCase()) &&
                                    this.selectedPeople?.find((person) => person.first_name + " " + person.last_name === item.assignee)
                            }).map((row) => {
                            return this.createCardElement({
                                title: row.title,
                                priority: row.priority,
                                type: row.type,
                                id: row.id,
                                assignee: row.assignee,
                                status: row.status
                            })
                        }).join("") + `
                    </div>
                </div>

                <div class="column">
                    <div class="column-title column-title-backlog">Blocked (${this.blocked.filter((item) => { 
                        return item.status?.toLowerCase() === "blocked" && 
                        supportedTypes.has(item.type?.toLowerCase()) &&
                        this.selectedPeople?.find((person) => person.first_name + " " + person.last_name === item.assignee)
                    }).length})</div>

                    <div class="grid-item" data-column="blocked">
                        ` + this.config.tableValue?.filter((item) => { 
                                return item.status?.toLowerCase() === "blocked" && 
                                    supportedTypes.has(item.type?.toLowerCase()) &&
                                    this.selectedPeople?.find((person) => person.first_name + " " + person.last_name === item.assignee)
                            }).map((row) => {
                            return this.createCardElement({
                                title: row.title,
                                priority: row.priority,
                                type: row.type,
                                id: row.id,
                                assignee: row.assignee,
                                status: row.status
                            })
                        }).join("") + `
                    </div>
                </div>

                <div class="column">
                    <div class="column-title column-title-backlog">QA (${this.qa.filter((item) => { 
                        return item.status?.toLowerCase() === "qa" && 
                        supportedTypes.has(item.type?.toLowerCase()) &&
                        this.selectedPeople?.find((person) => person.first_name + " " + person.last_name === item.assignee)
                    }).length})</div>

                    <div class="grid-item" data-column="qa">
                        ` + this.config.tableValue?.filter((item) => { 
                                return item.status?.toLowerCase() === "qa" && 
                                    supportedTypes.has(item.type?.toLowerCase()) &&
                                    this.selectedPeople?.find((person) => person.first_name + " " + person.last_name === item.assignee)
                            }).map((row) => {
                            return this.createCardElement({
                                title: row.title,
                                priority: row.priority,
                                type: row.type,
                                id: row.id,
                                assignee: row.assignee,
                                status: row.status
                            })
                        }).join("") + `
                    </div>
                </div>

                <div class="column">
                    <div class="column-title column-title-backlog">Done (${this.done.filter((item) => { 
                        return item.status?.toLowerCase() === "done" && 
                        supportedTypes.has(item.type?.toLowerCase()) &&
                        this.selectedPeople?.find((person) => person.first_name + " " + person.last_name === item.assignee)
                    }).length})</div>

                    <div class="grid-item" data-column="done">
                        ` + this.config.tableValue?.filter((item) => { 
                                return item.status?.toLowerCase() === "done" && 
                                    supportedTypes.has(item.type?.toLowerCase()) &&
                                    this.selectedPeople?.find((person) => person.first_name + " " + person.last_name === item.assignee)
                            }).map((row) => {
                            return this.createCardElement({
                                title: row.title,
                                priority: row.priority,
                                type: row.type,
                                id: row.id,
                                assignee: row.assignee,
                                status: row.status
                            })
                        }).join("") + `
                    </div>
                </div>
            </div>
        `

        // When a card item is clicked then show the modal with details at `createDetailsModal(task)`
        this.shadow.querySelectorAll(".card").forEach((element) => {
            element.addEventListener("click", () => {
                // Get data-ticket-id
                let taskId = element.getAttribute("data-ticket-id")

                // Find task in `tableValue` array
                let task = this.config.tableValue?.find((row) => row.id + "" === taskId)

                this.createDetailsModal(task)
            })
        })

        // Find the class with ID of `create-ticket-button` and add an onClick event listener to it
        this.shadow.querySelector(".create-ticket-button").addEventListener("click", () => {
            // Unhide the modal
            this.createDetailsModal()
        })

        // Find the button with ID of `show-bugs-button` and add an onClick event listener to it
        this.shadow.getElementById("show-bugs-button").addEventListener("click", () => {
            this.showBugs = !this.showBugs
            this.render()
        })

        // Find the button with ID of `show-features-button` and add an onClick event listener to it
        this.shadow.getElementById("show-features-button").addEventListener("click", () => {
            this.showFeatures = !this.showFeatures
            this.render()
        })

        // Find the button with ID of `show-supports-button` and add an onClick event listener to it
        this.shadow.getElementById("show-supports-button").addEventListener("click", () => {
            this.showSupport = !this.showSupport
            this.render()
        })

        // Find all DOM elements that have `data-person-id` attribute and add an onClick event listener to them
        this.shadow.querySelectorAll("[data-person-id]").forEach((element) => {
            element.addEventListener("click", () => {
                let personId = element.getAttribute("data-person-id")
                let person = this.people?.find((person) => person.id + "" === personId)

                // If person exists in `selectedPeople` array, remove them
                let selectedPersonIndex = this.selectedPeople.findIndex((person) => person.id + "" === personId)
                
                if (selectedPersonIndex > -1) {
                    this.selectedPeople.splice(selectedPersonIndex, 1)
                } else {
                    this.selectedPeople.push(person)
                }

                this.render()
            })
        });

        var draggables = this.shadow.querySelectorAll(".card");
        var droppables = this.shadow.querySelectorAll(".grid-item");

        draggables.forEach((task) => {
            task.addEventListener("dragstart", () => {
                task.classList.add("is-dragging");
            });
    
            task.addEventListener("dragend", () => {
                task.classList.remove("is-dragging");

                console.log('taskId: ', task.getAttribute("data-ticket-id"))
                console.log('columnId: ', task.parentElement.getAttribute("data-column"))

                let taskId = task.getAttribute("data-ticket-id")
                let columnId = task.parentElement.getAttribute("data-column")
                let currentTask = this.config.tableValue?.find((row) => row.id + "" === taskId)
                var status;

                // See if task exists in `backlog` array and if so, remove it
                let index = this.backlog.findIndex((row) => row.id + "" === taskId)
                if (index > -1) {
                    this.backlog.splice(index, 1)
                }

                // See if task exists in `progress` array and if so, remove it
                index = this.progress.findIndex((row) => row.id + "" === taskId)
                if (index > -1) {
                    this.progress.splice(index, 1)
                }

                // See if task exists in `blocked` array and if so, remove it
                index = this.blocked.findIndex((row) => row.id + "" === taskId)
                if (index > -1) {
                    this.blocked.splice(index, 1)
                }

                // See if task exists in `qa` array and if so, remove it
                index = this.qa.findIndex((row) => row.id + "" === taskId)
                if (index > -1) {
                    this.qa.splice(index, 1)
                }

                // See if task exists in `done` array and if so, remove it
                index = this.done.findIndex((row) => row.id + "" === taskId)
                if (index > -1) {
                    this.done.splice(index, 1)
                }

                switch (columnId) {
                    case "backlog":
                        status = "Backlog"
                        this.backlog.push(currentTask)
                        break;
                    case "in-progress":
                        status = "In Progress"
                        this.progress.push(currentTask)
                        break;
                    case "blocked":
                        status = "Blocked"
                        this.blocked.push(currentTask)
                        break;
                    case "qa":
                        status = "QA"
                        this.qa.push(currentTask)
                        break;
                    case "done":
                        status = "Done"
                        this.done.push(currentTask)
                        break;
                    default:
                        status = "Backlog"
                        this.backlog.push(currentTask)
                        break;
                }

                // Find titles of columns and update the count
                let backlogCount = this.shadow.querySelector(".column-title-backlog")
                let progressCount = this.shadow.querySelector(".column-title-progress")
                let blockedCount = this.shadow.querySelector(".column-title-blocked")
                let qaCount = this.shadow.querySelector(".column-title-qa")
                let doneCount = this.shadow.querySelector(".column-title-done")

                backlogCount.innerHTML = `Backlog (${this.backlog.length})`
                progressCount.innerHTML = `In Progress (${this.progress.length})`
                blockedCount.innerHTML = `Blocked (${this.blocked.length})`
                qaCount.innerHTML = `QA (${this.qa.length})`
                doneCount.innerHTML = `Done (${this.done.length})`

                // console.log('Table: ', this.config.tableValue)
                // let row = this.config.tableValue?.find((row) => row.id + "" === taskId)
                // console.log('Row: ', row)

                // if (row) {
                //     row.status = status

                //     triggerEvent(this, {
                //         action: OuterbaseTableEvent.updateRow,
                //         value: row
                //     })
                // }

                // Call API to update task
                this.updateTask(currentTask.id, status)
            });
        });

        droppables.forEach((zone) => {
            zone.addEventListener("dragover", (e) => {
                e.preventDefault();
        
                const bottomTask = insertAboveTask(zone, e.clientY);
                const curTask = this.shadow.querySelector(".is-dragging");
        
                if (!bottomTask) {
                    zone.appendChild(curTask);
                } else {
                    zone.insertBefore(curTask, bottomTask);
                }
            });
        });

        const insertAboveTask = (zone, mouseY) => {
            const els = zone.querySelectorAll(".card:not(.is-dragging)");
      
            let closestTask = null;
            let closestOffset = Number.NEGATIVE_INFINITY;
      
            els.forEach((task) => {
                const { top } = task.getBoundingClientRect();
                const offset = mouseY - top;
        
                if (offset < 0 && offset > closestOffset) {
                    closestOffset = offset;
                    closestTask = task;
                }
            });
      
            return closestTask;
        };
    }

    createCardElement({ title, priority, type, id, assignee, status }) {
        let person = this.people?.find((person) => person.first_name + " " + person.last_name === assignee)        
        let initials = assignee.split(" ").map((name) => name[0]).join("")
        initials = initials.length > 2 ? initials.slice(0, 2) : initials

        return (`
            <div class="card" draggable="true" data-ticket-id="${id}">
                <div class="card-title">
                    ${title}
                </div>

                <div class="priority-container" title="${priority} priority">
                    <div class="priority-indicator ${priority <= 2 ? "priority-indicator-high" : priority <= 5 ? "priority-indicator-medium" : ""}"></div>
                    <div class="priority-indicator ${priority <= 2 ? "priority-indicator-high" : priority <= 4 ? "priority-indicator-medium" : ""}"></div>
                    <div class="priority-indicator ${priority <= 2 ? "priority-indicator-high" : priority <= 3 ? "priority-indicator-medium" : ""}"></div>
                    <div class="priority-indicator ${priority <= 2 ? "priority-indicator-high" : ""}"></div>
                    <div class="priority-indicator ${priority === 1 ? "priority-indicator-high" : ""}"></div>
                </div>

                <div class="card-bottom">
                    <div class="${type?.toLowerCase() === "bug" ? "bug-square" : "task-square"}"></div>
                    <div style="font-size: 12px; flex: 1; font-weight: 500; 
                    ` + (status?.toLowerCase() === 'done' ? 'text-decoration: line-through' : '') + `
                    ">OUT-${id}</div>
                    <div class="card-bottom-avatar" style="background-color: ${person?.color};">${initials}</div>
                </div>
            </div>
        `)
    }

    createDetailsModal(task) {
        console.log('Task: ', task)

        // Find the element identified by `ticket-detail-modal` and change it's display to `block`
        this.shadow.querySelector(".ticket-detail-modal").style.display = "block"

        var priority = 2;

        this.shadow.querySelector(".ticket-detail-container").innerHTML = `
            <!-- Header -->
            <div style="display: flex; align-items: center; gap: 4px;">
                <div class="${true ? "bug-square" : "task-square"}" style="margin-right: 4px;"></div>
                <div class="modal-header-title">OUT-001</div>

                <div style="flex: 1;"></div>

                <div class="modal-header-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor" fill-rule="evenodd"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></g></svg>
                </div>

                <div class="modal-header-button" id="close-modal">
                    <svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M12 10.586L6.707 5.293a1 1 0 00-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 001.414 1.414L12 13.414l5.293 5.293a1 1 0 001.414-1.414L13.414 12l5.293-5.293a1 1 0 10-1.414-1.414L12 10.586z" fill="currentColor"></path></svg>
                </div>
            </div>

            <div style="display: flex; flex-direction: row; gap: 24px; flex: 1; overflow: scroll; padding: 0 4px;">
                <div id="modal-left" style="flex: 1;">
                    <!-- Title -->
                    <input id="task-details-title-input" type="text" placeholder="Title" value="${task?.title}" />

                    <!-- Description -->
                    <div id="task-details-description-title">Description</div>
                    <textarea id="task-details-description-input" placeholder="Description">${task?.description}</textarea>
                    
                    <!-- Environment -->
                    <div id="task-details-description-title">Environment</div>
                    <div id="environment-details">None</div>
                </div>

                <div id="modal-right">
                    <div>
                        <button id="modal-status-button">
                            Done

                            <svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M8.292 10.293a1.009 1.009 0 000 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 000-1.419.987.987 0 00-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 00-1.406 0z" fill="currentColor" fill-rule="evenodd"></path></svg>
                        </button>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 16px; border: 1px solid #cbcbCb; border-radius: 4px; padding: 12px; margin-bottom: 8px;">
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div class="modal-right-item-title">Assignee</div>
                            <div class="modal-right-item-description">
                                <div class="card-bottom-avatar" style="background-color: red;">BW</div>
                                Test
                            </div>
                        </div>

                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div class="modal-right-item-title">Reporter</div>
                            <div class="modal-right-item-description">
                                <div class="card-bottom-avatar" style="background-color: red;">BW</div>
                                Test
                            </div>
                        </div>

                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div class="modal-right-item-title">Priority</div>
                            <div class="modal-right-item-description">
                                <div class="priority-container" title="${task?.priority} priority">
                                    <div class="priority-indicator ${task?.priority <= 2 ? "priority-indicator-high" : task?.priority <= 5 ? "priority-indicator-medium" : ""}"></div>
                                    <div class="priority-indicator ${task?.priority <= 2 ? "priority-indicator-high" : task?.priority <= 4 ? "priority-indicator-medium" : ""}"></div>
                                    <div class="priority-indicator ${task?.priority <= 2 ? "priority-indicator-high" : task?.priority <= 3 ? "priority-indicator-medium" : ""}"></div>
                                    <div class="priority-indicator ${task?.priority <= 2 ? "priority-indicator-high" : ""}"></div>
                                    <div class="priority-indicator ${task?.priority === 1 ? "priority-indicator-high" : ""}"></div>
                                </div>

                                High
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 16px; border: 1px solid #cbcbCb; border-radius: 4px; padding: 12px; margin-bottom: 8px;">
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div class="modal-right-item-title">User ID</div>
                            <div class="modal-right-item-description">Test</div>
                        </div>

                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div class="modal-right-item-title">Session ID</div>
                            <div class="modal-right-item-description">Test</div>
                        </div>

                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div class="modal-right-item-title">Workspace ID</div>
                            <div class="modal-right-item-description">Test</div>
                        </div>

                        <div style="display: flex; gap: 8px; align-items: center;">
                            <div class="modal-right-item-title">Base ID</div>
                            <div class="modal-right-item-description">Test</div>
                        </div>
                    </div>

                    <div>
                        <div id="recent-errors-title" style="display: flex; flex-direction: column; gap: 16px; border: 1px solid #cbcbCb; border-radius: 4px; padding: 12px; ${this.showDetailsModalRecentErrors ? 'border-bottom-left-radius: 0px;' : ''} ${this.showDetailsModalRecentErrors ? 'border-bottom-right-radius: 0px;' : ''}">
                            <div style="display: flex; gap: 8px; align-items: center;">
                                <div class="modal-right-item-title" style="font-size: 14px;">Recent Errors</div>
                                <div class="modal-right-item-description" style="color: #6B778C; font-size: 12px;">15 Errors Occurred</div>

                                ` + (this.showDetailsModalRecentErrors ? `
                                    <svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M11.221 9.322l-2.929 2.955a1.009 1.009 0 000 1.419.986.986 0 001.405 0l2.298-2.317 2.307 2.327a.989.989 0 001.407 0 1.01 1.01 0 000-1.419l-2.94-2.965A1.106 1.106 0 0011.991 9c-.279 0-.557.107-.77.322z" fill="currentColor" fill-rule="evenodd"></path></svg>
                                ` : `
                                    <svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M8.292 10.293a1.009 1.009 0 000 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 000-1.419.987.987 0 00-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 00-1.406 0z" fill="currentColor" fill-rule="evenodd"></path></svg>
                                `) + `
                            </div>
                        </div>

                        ` + (this.showDetailsModalRecentErrors ? `
                            <div id="recent-errors" style="display: flex; flex-direction: column; gap: 12px; border: 1px solid #cbcbCb; border-top: none; padding: 12px; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;">
                                <div style="display: flex; align-items: center;">
                                    <div style="display: flex; align-items: center; gap: 8px; width: 150px; font-weight: 600;">
                                        <div style="font-size: 8px; border-radius: 4px; padding: 4px; background: rgb(59, 130, 246); color: white; display: inline-block;">GET</div>
                                        503
                                    </div>
                                    <div style="flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                        /api/v1/organizations/1/teams/1/members
                                    </div>
                                    
                                    <div style="cursor: pointer;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path></svg>
                                    </div>
                                </div>

                                <div style="display: flex; align-items: center;">
                                    <div style="display: flex; align-items: center; gap: 8px; width: 150px; font-weight: 600;">
                                        <div style="font-size: 8px; border-radius: 4px; padding: 4px; background: rgb(59, 130, 246); color: white; display: inline-block;">GET</div>
                                        503
                                    </div>
                                    <div style="flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                        /api/v1/organizations/1/teams/1/members
                                    </div>
                                    
                                    <div style="cursor: pointer;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path></svg>
                                    </div>
                                </div>

                                <div style="display: flex; align-items: center;">
                                    <div style="display: flex; align-items: center; gap: 8px; width: 150px; font-weight: 600;">
                                        <div style="font-size: 8px; border-radius: 4px; padding: 4px; background: rgb(59, 130, 246); color: white; display: inline-block;">GET</div>
                                        503
                                    </div>
                                    <div style="flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                        /api/v1/organizations/1/teams/1/members
                                    </div>
                                    
                                    <div style="cursor: pointer;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path></svg>
                                    </div>
                                </div>
                            </div>
                        ` : `

                        `) + `
                        
                    </div>

                    <div class="modal-right-subtitle">
                        Created October 26, 2023 at 8:57 AM
                    </div>

                    <div class="modal-right-subtitle">
                        Updated at October 26, 2023 at 8:57 AM
                    </div>
                </div>
            </div>

            <div style="display: flex;">
                <div style="flex: 1;"></div>
                <button id="modal-save-action-button">
                    Save
                </button>
            </div>
        `

        // Find `recent-errors-title` by ID and add an onClick event listener to it
        this.shadow.getElementById("recent-errors-title").addEventListener("click", () => {
            this.showDetailsModalRecentErrors = !this.showDetailsModalRecentErrors
            this.createDetailsModal(task)
        })

        // Find button with id `close-modal` and add an onClick event listener to it
        this.shadow.getElementById("close-modal").addEventListener("click", () => {
            // Find the element identified by `ticket-detail-modal` and change it's display to `none`
            this.shadow.querySelector(".ticket-detail-modal").style.display = "none"
        })
    }
}

window.customElements.define('outerbase-plugin-table', OuterbasePluginTable_$PLUGIN_ID)
// window.customElements.define('outerbase-plugin-table-$PLUGIN_ID', OuterbasePluginTable_$PLUGIN_ID)
