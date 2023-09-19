import { carDealership, carDealershipConfiguration } from './sample-data/car-dealership';

import('./sample-data/car-dealership')
import('./styles.css');

var page = 0;
var size = 13;

const allowedScripts = ['column', 'table', 'configuration']

window.refreshPage = (index) => {
    localStorage.setItem('selectedViewIndex', index);
    // You're not allowed to window.customElements.define the same value
    // So we refresh the page after setting selectedViewIndex
    // To make sure the customElement is undefined
    const isNotConfiguration = index <= 1
    if (isNotConfiguration) {
        window.location.reload()
    }
}
window.selectViewTabIndex = (index) => {
    index = Number(index)
    
    toggleScripts(index <= allowedScripts.length ? allowedScripts[index] : allowedScripts[allowedScripts.length])

    var cellSwitchboard = document.getElementsByClassName("cell-switchboard")[0];
    var tableSwitchboard = document.getElementsByClassName("table-switchboard")[0];
    var configurationSwitchboard = document.getElementsByClassName("configuration-switchboard")[0];

    cellSwitchboard.style.display = index === 0 ? 'grid' : 'none' ;
    tableSwitchboard.style.display = index === 1 ? 'grid' : 'none';
    configurationSwitchboard.style.display = index === 2 ? 'grid' : 'none';

    var cellView = document.getElementsByClassName("column_container")[0];
    var tablePreview = document.getElementsByClassName("table_container")[0];
    var configurationView = document.getElementsByClassName("configuration_container")[0];

    cellView.style.display = index === 0 ? 'block' : 'none';
    tablePreview.style.display = index === 1 ? 'block' : 'none';
    configurationView.style.display = index === 2 ? 'block' : 'none';
}

function toggleScripts(type) {
    if (type === 'column') {
        import('./_playground/column.js')
    } else if (type === 'table') {
        import('./_playground/table.js')
    }
}

function flashIndicatorColor(element) {
    element.style.backgroundColor = 'green';

    setTimeout(() => {
        element.style.backgroundColor = 'red';
    }, 2000)
}

document.addEventListener('custom-change', function(event) {
    let action = event.detail.action.toLowerCase()
    if (action === "getpreviouspage") {
        var getPreviousPageIndicator = document.getElementById("getPreviousPageIndicator");
        flashIndicatorColor(getPreviousPageIndicator)

        if (page >= 1) {
            page--
            updateRows()
        }
    }
    else if (action === "getnextpage") {
        var getNextPageIndicator = document.getElementById("getNextPageIndicator");
        flashIndicatorColor(getNextPageIndicator)

        if (page < 100) {
            page++
            updateRows()
        }
    }
    else if (action === "createrow") {
        var createRowPageIndicator = document.getElementById("createRowPageIndicator");
        flashIndicatorColor(createRowPageIndicator)
    }
    else if (action === "updaterow") {
        var updateRowPageIndicator = document.getElementById("updateRowPageIndicator");
        flashIndicatorColor(updateRowPageIndicator)
    }
    else if (action === "deleterow") {
        var deleteRowPageIndicator = document.getElementById("deleteRowPageIndicator");
        flashIndicatorColor(deleteRowPageIndicator)
    }
    else if (action === "onsave") {
        var configurationOnSavePageIndicator = document.getElementById("configOnSavePageIndicator");
        flashIndicatorColor(configurationOnSavePageIndicator)
    }
    else if (action === "updatecell") {
        var configurationOnSavePageIndicator = document.getElementById("cellUpdateCellPageIndicator");
        flashIndicatorColor(configurationOnSavePageIndicator)
    }
});

function updateRows() {
    var tableElement = document.querySelector("outerbase-plugin-table");
    var configurationElement = document.querySelector("outerbase-plugin-configuration");

    const start = page * size;
    const end = start + size;
    let rowsCopy = carDealership.response.items.slice(start, end);
    let table = JSON.stringify(rowsCopy)?.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    
    if (tableElement) {
        tableElement.setAttribute("tableValue", table);
    }

    if (configurationElement) {
        configurationElement.setAttribute("tableValue", table);
    }
}

function toggleTheme(theme) {
    localStorage.setItem("selectedTheme", theme)
    var tableElement = document.querySelector("outerbase-plugin-table");
    var configurationElement = document.querySelector("outerbase-plugin-configuration");

    if (tableElement) {
        let options = {
            theme: theme
        }
        let metadata = JSON.stringify(options)?.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
        tableElement.setAttribute("metadata", metadata);
        configurationElement.setAttribute("metadata", metadata);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let savedViewIndex = localStorage.getItem("selectedViewIndex") ? localStorage.getItem("selectedViewIndex") : 0;
    selectViewTabIndex(savedViewIndex);

    let savedTheme = localStorage.getItem("selectedTheme") ? localStorage.getItem("selectedTheme") : "light";
    toggleTheme(savedTheme)

    var tableElement = document.querySelector("outerbase-plugin-table");
    var configurationElement = document.querySelector("outerbase-plugin-configuration");

    if (tableElement) {
        let config = JSON.stringify(carDealershipConfiguration)?.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
        tableElement.setAttribute("configuration", config)
        configurationElement.setAttribute("configuration", config)
        configurationElement.setAttribute("configuration", config)
        
        updateRows()
    }
});

// These need to be defered because it needs to wait for the document to be loaded
// document.getElementById("lightThemeButton").addEventListener("click", function() {
//     toggleTheme("light")
// })

// document.getElementById("darkThemeButton").addEventListener("click", function() {
//     toggleTheme("dark")
// })  