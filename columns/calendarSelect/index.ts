const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

type SendToOuterbaseParams = {
    outerbaseElement: HTMLElement
    outerbaseEvent: Event
}

const createOuterbaseEvent = (data: any) => new CustomEvent('custom-change', {
    detail: data,
    bubbles: true,
    composed: true
})

const sendToOuterbase = ({ outerbaseElement, outerbaseEvent }: SendToOuterbaseParams) => {
    outerbaseElement.dispatchEvent(outerbaseEvent)
}

const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

var templateCell_$PLUGIN_ID = document.createElement('template')
templateCell_$PLUGIN_ID.innerHTML = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200&display=swap" rel="stylesheet">
<style>
input {
    font-family: var(--ob-font-family), sans-serif;
    height: 100%;
    flex: 1;
    background-color: transparent;
    border: 0;
    min-width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

</style>
<div id="container">
    <input type="text" id="dateDisplay" />
</div>
`

var templateEditor_$PLUGIN_ID = document.createElement('template')
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
#calendar-container {
    font-family: 'Inter', sans-serif;
    width: 430px;
    height: 585px;
    color: var(--ob-text-color);
    border-radius: 20px;
    border: 1px solid var(--ob-border-color);
    background: var(--ob-background-color);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);  
}
#top-calendar {
    max-height: 72px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid var(--neutral-800, #262626);
}
#mid-calendar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 46px;
}
#mid-calendar > div {
    display: flex;
}
#bottom-calendar {
    height: 336px;
}
ul, ol {
    display: grid;
    grid-template-columns: repeat(7, 56px);
    justify-content: space-between;
    padding: 0;
}
  
li {
    display: flex;
    align-items: center;
    justify-content: center;
    list-style: none;
    width: 56px;
    height: 56px;
}
#days > li:hover {
    border-radius: 32px;
    background: var(--neutral-50, #FAFAFA);
}
#close-editor {
    width: 24px;
    height: 24px;
    cursor: pointer;
}
#close-editor:hover {
    opacity: .5;
}
.active {
    border-radius: 32px;
    background: var(--neutral-50, #FAFAFA);
    color: black;
}
.navigation-arrows:hover {
    opacity: .5;
}
.navigation-arrows {
    width: 14px;
    height: 14px;
    padding: 16px;
    cursor: pointer;
}
#date-container {
    width: 68px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 24px;
    align-items: center;
}
</style>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200&display=swap" rel="stylesheet">
<div id="calendar-container">
    <div id="top-calendar">
        <div id="column-name">Column_Name</div>
        <div id="close-editor">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="m8.464 15.535l7.072-7.07m-7.072 0l7.072 7.07"/></svg>
        </div>
    </div>
    <div id="mid-calendar">
        <div id="date-container">
            <div id="month"></div>
            &nbsp;
            <div id="year"></div>
        </div>
        <div>
        <div id="back" class="navigation-arrows">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="currentColor" d="M164.24 203.76a6 6 0 1 1-8.48 8.48l-80-80a6 6 0 0 1 0-8.48l80-80a6 6 0 0 1 8.48 8.48L88.49 128Z"/></svg>
        </div>
        <div id="forward" class="navigation-arrows">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="currentColor" d="m180.24 132.24l-80 80a6 6 0 0 1-8.48-8.48L167.51 128L91.76 52.24a6 6 0 0 1 8.48-8.48l80 80a6 6 0 0 1 0 8.48Z"/></svg>
        </div>
        </div>
    </div>
    <div id="bottom-calendar">
       <ul class="day-names">
            <li class="ob-secondary-button">Mo</li>
            <li>Tu</li>
            <li>We</li>
            <li>Th</li>
            <li>Fr</li>
            <li>Sa</li>
            <li>Su</li>
        </ul>
        <ol id="days">
        </ol>
    </div>
</div>
`
class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes(): Array<string> {
        return ['cellValue']
    }

    shadow: ShadowRoot
    DAYS_IN_WEEK = 7

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateCell_$PLUGIN_ID.content.cloneNode(true))

    }
    connectedCallback() {
        const cellValue = this.getAttribute('cellvalue')
        const cell = this.shadow.getElementById('dateDisplay') as HTMLInputElement
        cell.value = cellValue


        cell.addEventListener("focus", () => {
            const ev = createOuterbaseEvent({ action: 'onedit', value: true })
            sendToOuterbase({ outerbaseElement: this, outerbaseEvent: ev })
        });
    }
}
class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
    shadow: ShadowRoot

    static get observedAttributes(): Array<string> {
        return ['cellValue']
    }

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateEditor_$PLUGIN_ID.content.cloneNode(true))
    }
    connectedCallback() {
        FUNCTIONALITIES.forEach(func => func(this))
        const cellValue = this.getAttribute('cellvalue')
        const cellAsDate = new Date(cellValue)

        const yearElement = this.shadow.getElementById('year')
        yearElement.innerHTML = cellAsDate.getFullYear().toString()

        const monthElement = this.shadow.getElementById('month')
        monthElement.innerHTML = MONTHS[cellAsDate.getMonth()]

        this.render()
    }
    render() {
        const year = parseInt(this.shadow.getElementById('year').innerHTML)
        const month = MONTHS.indexOf(this.shadow.getElementById('month').innerHTML)
        const yearElement = this.shadow.getElementById('year')
        yearElement.innerHTML = year.toString()
        const monthElement = this.shadow.getElementById('month')
        monthElement.innerHTML = MONTHS[month]

        // Handle filling in the calendar
        const daysElement = this.shadow.getElementById('days')
        daysElement.innerHTML = ""
        const totalDays = daysInMonth(month, year)

        const daysTillFirstOfMonth = new Date(year, month, 1).getDay()
        let previousYear: number
        let previousMonth: number
        if (month - 1 < 0) {
            previousYear = year - 1
            previousMonth = 12
        } else {
            previousYear = year
            previousMonth = month - 1
        }

        const daysOfPreviousMonth = daysInMonth(previousMonth, previousYear)
        for (let fillDay = 1; fillDay < daysTillFirstOfMonth; fillDay++) {
            const displayDay = daysOfPreviousMonth - daysTillFirstOfMonth + fillDay
            const monthFormatted = (previousMonth + 1).toString().padStart(2, '0')
            const dayFormatted = displayDay.toString().padStart(2, '0')

            const dateFormat = `${previousYear}-${monthFormatted}-${dayFormatted}`
            const dayElement = dayElementMaker(displayDay.toString(), false, dateFormat, this.shadow, false)
            daysElement.appendChild(dayElement)
        }

        for (let day = 1; day <= totalDays; day++) {

            const monthFormatted = (month + 1).toString().padStart(2, '0')
            const dayFormatted = day.toString().padStart(2, '0')
            const dateFormat = `${year}-${monthFormatted}-${dayFormatted}`
            const cellValue = this.getAttribute('cellvalue')
            const cellAsDate = new Date(cellValue)
            const isActive = day === cellAsDate.getDate()
            const dayElement = dayElementMaker(day.toString(), true, dateFormat, this.shadow, isActive)
            daysElement.appendChild(dayElement)
        }

        const DAYS_IN_WEEK = 7
        const daysAfter = DAYS_IN_WEEK - (totalDays + (daysTillFirstOfMonth - 1)) % DAYS_IN_WEEK
        for (let monthAfterDay = 1; monthAfterDay <= daysAfter; monthAfterDay++) {
            const monthFormatted = (month + 2).toString().padStart(2, '0')
            const dayFormatted = monthAfterDay.toString().padStart(2, '0')
            const dateFormat = `${year}-${monthFormatted}-${dayFormatted}`
            const dayElement = dayElementMaker(monthAfterDay.toString(), false, dateFormat, this.shadow, false)
            daysElement.appendChild(dayElement)
        }

    }

}

const dayElementMaker = (display: string, focus: boolean, value: any, shadow: ShadowRoot, isActive: boolean) => {
    const dayElement = document.createElement('li')
    dayElement.innerHTML = display
    dayElement.style.opacity = focus ? '1' : '.5'
    dayElement.style.cursor = 'pointer'
    dayElement.className = isActive ? "active" : ""
    dayElement.onclick = (event) => {
        const updateCellEvent = createOuterbaseEvent({ action: 'updatecell', value })
        sendToOuterbase({ outerbaseElement: shadow.getElementById('close-editor'), outerbaseEvent: updateCellEvent })

        const stopEditingEvent = createOuterbaseEvent({ action: 'onstopedit', value: true })
        sendToOuterbase({ outerbaseElement: shadow.getElementById('close-editor'), outerbaseEvent: stopEditingEvent })
    }
    return dayElement
}

const addBackButtonFunctionality = (outerbasePluginEditor: OuterbasePluginEditor_$PLUGIN_ID) => {
    const retreatDateElement = outerbasePluginEditor.shadow.getElementById('back')
    retreatDateElement.onclick = () => {
        const monthElement = outerbasePluginEditor.shadow.getElementById('month')
        const yearElement = outerbasePluginEditor.shadow.getElementById('year')

        const monthIndex = MONTHS.indexOf(monthElement.innerHTML)

        const wrapToLastMonth = monthIndex - 1 < 0
        if (wrapToLastMonth) {
            monthElement.innerHTML = MONTHS[MONTHS.length - 1]
            const year = parseInt(yearElement.innerHTML) - 1
            yearElement.innerHTML = year.toString()
            return
        } else {
            monthElement.innerHTML = MONTHS[monthIndex - 1]
        }
        outerbasePluginEditor.render()
    }

}
const addForwardButtonFunctionality = (outerbasePluginEditor: OuterbasePluginEditor_$PLUGIN_ID) => {
    const advanceDateElement = outerbasePluginEditor.shadow.getElementById('forward')
    advanceDateElement.onclick = () => {
        const monthElement = outerbasePluginEditor.shadow.getElementById('month')
        const yearElement = outerbasePluginEditor.shadow.getElementById('year')

        const monthIndex = MONTHS.indexOf(monthElement.innerHTML)

        const wrapToFirstMonth = monthIndex + 1 >= MONTHS.length
        if (wrapToFirstMonth) {
            monthElement.innerHTML = MONTHS[0]
            const year = parseInt(yearElement.innerHTML) + 1
            yearElement.innerHTML = year.toString()
        } else {
            monthElement.innerHTML = MONTHS[monthIndex + 1]
        }
        outerbasePluginEditor.render()
    }

}
const addCloseButtonFunctionality = (outerbasePluginEditor: OuterbasePluginEditor_$PLUGIN_ID) => {
    const closeEditorElement = outerbasePluginEditor.shadow.getElementById('close-editor')
    closeEditorElement.onclick = () => {
        const ev = createOuterbaseEvent({ action: 'onstopedit', value: true })
        sendToOuterbase({ outerbaseElement: closeEditorElement, outerbaseEvent: ev })
    }
}

const FUNCTIONALITIES = [
    addBackButtonFunctionality,
    addForwardButtonFunctionality,
    addCloseButtonFunctionality
]

window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-editor-$PLUGIN_ID', OuterbasePluginEditor_$PLUGIN_ID)