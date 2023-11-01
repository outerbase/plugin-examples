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
    console.log('Dispatching', outerbaseEvent)
    outerbaseElement.dispatchEvent(outerbaseEvent)
}

const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

var templateCell_$PLUGIN_ID = document.createElement('template')
templateCell_$PLUGIN_ID.innerHTML = `
<style>
input {
    background-color: transparent;
    border: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: var(--ob-font-family);
    line-height: 36px;
    font-size: 12px;
    font-family: var(--ob-font-family);
    font-weight: 400;
    font-style: normal;

}
input:focus {
    outline: none;
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
    margin-top: 4px 
    display: flex;
    font-family: var(--ob-font-family);
    width: 314px;
    color: var(--ob-text-color);
    border-radius: 20px;
    border: 1px solid var(--ob-border-color);
    background-color: var(--ob-background-color);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    flex-direction: column;
    align-items: center;
}
#mid-calendar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 42px;
    padding: 16px 24px 0px 24px;
    font-weight: 600;
}
#mid-calendar > div {
    display: flex;
}
#bottom-calendar {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 280px;
    padding: 12px 0px;
}

svg {
    fill: var(--ob-text-color);
}

ul, ol {
    display: grid;
    grid-template-columns: repeat(7, 40px);
    text-align: center;
    justify-items: center;
    padding: 0;
    text-align: center;

    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}
  
li {
    display: flex;
    align-items: center;
    justify-content: center;
    list-style: none;
    width: 40px;
    height: 40px;
}
#days {
    margin: 0px;
    
}
#days > li:hover {
    border-radius: 14px;
    background-color: var(--ob-background-color);
    color: var(--ob-text-color);
    filter: invert(100%);
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
    border-radius: 14px;
    color: var(--ob-text-color);
    border-radius: 14px;
    background: var(--ob-background-color, #FAFAFA);
    box-shadow: 0px 6px 16px 0px rgba(255, 255, 255, 0.25);
    filter: invert(100%);
}
.day-names {
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
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
.day-names  {
    margin: 0px;
}
#date-container {
    width: 174px;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 21px;
}
</style>
<div id="calendar-container">
    <div id="mid-calendar">
        <div id="date-container">
            <div id="month"></div>
            &nbsp;
            <div id="year"></div>
        </div>
        <div>
        <div id="back" class="navigation-arrows">
            <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                <g id="Frame 10">
                <path id="Vector 2 (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M9.00163 0.71811C9.37537 0.32692 10 0.32692 10.3738 0.71811C10.7242 1.08485 10.7242 1.6623 10.3738 2.02904L5.62459 7L10.3738 11.971C10.7242 12.3377 10.7242 12.9152 10.3738 13.2819C10 13.6731 9.37537 13.6731 9.00163 13.2819L3 7L9.00163 0.71811Z" />
                </g>
            </svg>
        </div>
        <div id="forward" class="navigation-arrows">
            <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                <g id="Frame 10">
                <path id="Vector 2 (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M4.99837 0.71811C4.62463 0.32692 3.99996 0.32692 3.62622 0.71811C3.27584 1.08485 3.27584 1.6623 3.62622 2.02904L8.37541 7L3.62622 11.971C3.27584 12.3377 3.27584 12.9152 3.62622 13.2819C3.99996 13.6731 4.62463 13.6731 4.99837 13.2819L11 7L4.99837 0.71811Z" />
                </g>
            </svg>
        </div>
        </div>
    </div>
    <div id="bottom-calendar">
       <ul class="day-names">
            <li>Su</li>
            <li>Mo</li>
            <li>Tu</li>
            <li>We</li>
            <li>Th</li>
            <li>Fr</li>
            <li>Sa</li>
        </ul>
        <ol id="days">
        </ol>
    </div>
</div>
`
const getDateFromCell = (cell: string) => {
    const splitCell = cell.split('-').map(value => parseInt(value))

    // Month is 0 indexed. Day is 1 indexed so no need to alter.
    return {
        day: splitCell[2],
        month: splitCell[1] - 1,
        year: splitCell[0]
    }
}
class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes(): Array<string> {
        return ['cellValue']
    }

    shadow: ShadowRoot

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateCell_$PLUGIN_ID.content.cloneNode(true))

    }
    connectedCallback() {
        const cellValue = this.getAttribute('cellvalue')
        const cell = this.shadow.getElementById('dateDisplay') as HTMLInputElement
        const validDate = !isNaN(new Date(cellValue).getTime()) ? cellValue : ""
        cell.value = validDate

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
    dayElementMaker = (display: string, focus: boolean, value: any, shadow: ShadowRoot, isActive: boolean) => {
        const dayElement = document.createElement('li')
        dayElement.innerHTML = display
        dayElement.style.opacity = focus ? '1' : '.5'
        dayElement.style.cursor = 'pointer'
        dayElement.className = isActive ? "active" : ""
        dayElement.onclick = (event) => {
            const updateCellEvent = createOuterbaseEvent({ action: 'updatecell', value })
            sendToOuterbase({ outerbaseElement: this, outerbaseEvent: updateCellEvent })
    
            const stopEditingEvent = createOuterbaseEvent({ action: 'onstopedit', value: true })
            sendToOuterbase({ outerbaseElement: this, outerbaseEvent: stopEditingEvent })
        }
        return dayElement
    }

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: 'open' })
        this.shadow.appendChild(templateEditor_$PLUGIN_ID.content.cloneNode(true))
    }
    connectedCallback() {
        FUNCTIONALITIES.forEach(func => func(this))
        const cellValue = this.getAttribute('cellvalue')
        const validDate = !isNaN(new Date(cellValue).getTime()) ? cellValue : new Date().toISOString().split('T')[0]
        
        const {year, month, day} = getDateFromCell(validDate)
        const cellAsDate = new Date(year, month, day)

        const yearElement = this.shadow.getElementById('year')
        yearElement.innerHTML = cellAsDate.getFullYear().toString()

        const monthElement = this.shadow.getElementById('month')
        monthElement.innerHTML = MONTHS[cellAsDate.getMonth()]

        this.render()
    }
    render() {
        const year = parseInt(this.shadow.getElementById('year').innerHTML)
        const month = MONTHS.indexOf(this.shadow.getElementById('month').innerHTML)
        const cellValue = this.getAttribute('cellvalue')
        const validDate = !isNaN(new Date(cellValue).getTime()) ? cellValue : new Date().toISOString().split('T')[0]

        const yearElement = this.shadow.getElementById('year')
        yearElement.innerHTML = year.toString()
        const monthElement = this.shadow.getElementById('month')
        monthElement.innerHTML = MONTHS[month]

        // Handle filling in the calendar
        const daysElement = this.shadow.getElementById('days')
        daysElement.innerHTML = ""
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        const lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay();
        const lastDayOfPreviousMonth = new Date(year, month, 0).getDate();

        for (let day = firstDayOfMonth; day > 0; day--) {
            let monthHandleRollover = month
            let yearHandleRollover = year
            if (month === 0) {
                monthHandleRollover = 12
                yearHandleRollover -= 1
            }


            const monthFormatted = (monthHandleRollover).toString().padStart(2, '0')
            const fixedDay = lastDayOfPreviousMonth - day + 1
            const dayFormatted = fixedDay.toString().padStart(2, '0')

            const dateFormat = `${yearHandleRollover}-${monthFormatted}-${dayFormatted}`
            const dayElement = this.dayElementMaker(fixedDay.toString(), false, dateFormat, this.shadow, false)
            daysElement.appendChild(dayElement)
        }

        for (let day = 1; day <= lastDateOfMonth; day++) {
            const {
                day: selectedDay,
                month: selectedMonth,
                year: selectedYear
            } = getDateFromCell(validDate)
            const isToday = day === selectedDay
                && month === selectedMonth
                && year === selectedYear

            const monthFormatted = (month + 1).toString().padStart(2, '0')
            const dayFormatted = day.toString().padStart(2, '0')
            const dateFormat = `${year}-${monthFormatted}-${dayFormatted}`

            const dayElement = this.dayElementMaker(day.toString(), true, `${dateFormat}`, this.shadow, isToday)
            daysElement.appendChild(dayElement)
        }

        for (let monthAfterDay = lastDayOfMonth; monthAfterDay < 6; monthAfterDay++) {
            let monthHandleRollover = month + 2
            let yearHandleRollover = year
            if (monthHandleRollover === 13) {
                monthHandleRollover = 1
                yearHandleRollover += 1
            }
            const monthFormatted = (monthHandleRollover).toString().padStart(2, '0')
            const fixedDay = monthAfterDay - lastDayOfMonth + 1
            const dayFormatted = fixedDay.toString().padStart(2, '0')
            const dateFormat = `${yearHandleRollover}-${monthFormatted}-${dayFormatted}`

            const dayElement = this.dayElementMaker(fixedDay.toString(), false, dateFormat, this.shadow, false)
            daysElement.appendChild(dayElement)
        }
    }

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

const FUNCTIONALITIES = [
    addBackButtonFunctionality,
    addForwardButtonFunctionality
]

window.customElements.define("outerbase-plugin-cell-$PLUGIN_ID", OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define("outerbase-plugin-editor-$PLUGIN_ID", OuterbasePluginEditor_$PLUGIN_ID)