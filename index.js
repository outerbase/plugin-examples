var page = 0;
var size = 13;

const allowedScripts = ['column', 'table', 'configuration']

const refreshPage = (index) => {
    localStorage.setItem('selectedViewIndex', index);
    // You're not allowed to window.customElements.define the same value
    // So we refresh the page after setting selectedViewIndex
    // To make sure the customElement is undefined
    const isNotConfiguration = index <= 1
    if (isNotConfiguration) {
        window.location.reload()
    }
}
function selectViewTabIndex(index) {
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
    // Get the script elements by their IDs
    const script1 = document.getElementById('script-column');
    const script2 = document.getElementById('script-table');
    console.log(script1)
    console.log(script2)
    
    if (script1) script1.remove();
    if (script2) script2.remove();
    console.log(script1,' after')
    console.log(script2, 'after')
    // Check which script is currently in the DOM
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
    console.log('An action!', action)
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