const MONTHS_$PLUGIN_ID = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type SendToOuterbaseParams_$PLUGIN_ID = {
  outerbaseElement: HTMLElement;
  outerbaseEvent: Event;
};

const createOuterbaseEvent_$PLUGIN_ID = (data: any) =>
  new CustomEvent("custom-change", {
    detail: data,
    bubbles: true,
    composed: true,
  });

const sendToOuterbase_$PLUGIN_ID = ({
  outerbaseElement,
  outerbaseEvent,
}: SendToOuterbaseParams_$PLUGIN_ID) => {
  outerbaseElement.dispatchEvent(outerbaseEvent);
};

const daysInMonth_$PLUGIN_ID = (month: number, year: number) =>
  new Date(year, month + 1, 0).getDate();

var templateCell_$PLUGIN_ID = document.createElement("template");
templateCell_$PLUGIN_ID.innerHTML = `
<style>
#container { 
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
    height: 100%;
    width: calc(100% - 36px);
    padding: 0 18px;
}
input {
    height: 100%;
    flex: 1;
    background-color: transparent;
    border: 0;
    min-width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: var(--ob-cell-font-family);
    font-size: 12px;
    color: var(--ob-text-color);
}

input:focus {
    outline: none;
}
#action-button {
position: relative;
width: 24px;
height: 24px;
border-radius: 6px;
border: 1px solid var(--ob-border-color);
cursor: pointer;
}

#action-button:hover {
opacity: 0.5;
}

#action-button > svg {
width: 13px;
height: 13px;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}

#action-button > svg > path {
fill: black;
}

.dark #action-button > svg > path {
fill: white;
}

</style>
<div id="container" class="theme-container">
<input type="text" id="dateDisplay" />
<div id="action-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 256 256">
        <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"/>
    </svg>
</div>

</div>
`;

var templateEditor_$PLUGIN_ID = document.createElement("template");
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
#calendar-container {
margin-top: 4px;
display: flex;
font-family: var(--ob-cell-font-family);
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
`;
const getDateFromCell_$PLUGIN_ID = (cell: string) => {
  const splitCell = cell.split("-").map((value) => parseInt(value));

  // Month is 0 indexed. Day is 1 indexed so no need to alter.
  return {
    day: splitCell[2],
    month: splitCell[1] - 1,
    year: splitCell[0],
  };
};
class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes(): Array<string> {
    return ["cellValue", "configuration"];
  }

  shadow: ShadowRoot;
  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateCell_$PLUGIN_ID.content.cloneNode(true));
  }
  decodeAttributeByName = (name: string) => {
    const encodedJSON = this.getAttribute(name);
    const decodedJSON = encodedJSON
      ?.replace(/&quot;/g, '"')
      ?.replace(/&#39;/g, "'");
    return decodedJSON ? JSON.parse(decodedJSON) : {};
  };

  attributeChangedCallback(name: any, oldValue: any, newValue: any) {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      this.decodeAttributeByName("configuration")
    );

    let metadata = this.decodeAttributeByName("metadata");
    this.config.theme = metadata?.theme;

    var element = this.shadow.querySelector(".theme-container");
    element.classList.remove("dark");
    element.classList.add(this.config.theme);
  }
  connectedCallback() {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      JSON.parse(this.getAttribute("configuration"))
    );

    const cellValue = this.getAttribute("cellvalue");
    const calendarButton = this.shadow.getElementById(
      "action-button"
    ) as HTMLElement;
    const cell = this.shadow.getElementById("dateDisplay") as HTMLInputElement;
    cell.value = cellValue;
    calendarButton.onclick = () => {
      const ev = createOuterbaseEvent_$PLUGIN_ID({
        action: "onedit",
        value: true,
      });
      sendToOuterbase_$PLUGIN_ID({
        outerbaseElement: this,
        outerbaseEvent: ev,
      });
    };
  }
}
class OuterbasePluginConfig_$PLUGIN_ID {
  theme = "light";

  constructor(object: any) {
    this.theme = object?.theme ? object.theme : "light";
  }
}

class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
  shadow: ShadowRoot;

  static get observedAttributes(): Array<string> {
    return ["cellValue", "configuration"];
  }
  dayElementMaker = (
    display: string,
    focus: boolean,
    value: any,
    shadow: ShadowRoot,
    isActive: boolean
  ) => {
    const dayElement = document.createElement("li");
    dayElement.innerHTML = display;
    dayElement.style.opacity = focus ? "1" : ".5";
    dayElement.style.cursor = "pointer";
    dayElement.className = isActive ? "active" : "";
    dayElement.onclick = (event) => {
      const updateCellEvent = createOuterbaseEvent_$PLUGIN_ID({
        action: "updatecell",
        value,
      });
      sendToOuterbase_$PLUGIN_ID({
        outerbaseElement: this,
        outerbaseEvent: updateCellEvent,
      });

      const stopEditingEvent = createOuterbaseEvent_$PLUGIN_ID({
        action: "onstopedit",
        value: true,
      });
      sendToOuterbase_$PLUGIN_ID({
        outerbaseElement: this,
        outerbaseEvent: stopEditingEvent,
      });
    };
    return dayElement;
  };

  timeZone: string;

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateEditor_$PLUGIN_ID.content.cloneNode(true));
  }
  connectedCallback() {
    FUNCTIONALITIES_$PLUGIN_ID.forEach((func) => func(this));
    const cellValue = this.getAttribute("cellvalue");

    const sanitizedInput = cellValue.split('"').join("");
    let inputWithoutTime;
    if (sanitizedInput.includes("T")) {
      const splitCellValue = sanitizedInput.split("T");
      inputWithoutTime = splitCellValue[0];
      this.timeZone = splitCellValue[1];
    } else {
      inputWithoutTime = sanitizedInput;
    }
    const validDate = !isNaN(new Date(inputWithoutTime).getTime())
      ? inputWithoutTime
      : new Date().toISOString().split("T")[0];

    const { year, month, day } = getDateFromCell_$PLUGIN_ID(validDate);

    const cellAsDate = new Date(year, month, day);

    const yearElement = this.shadow.getElementById("year");
    yearElement.innerHTML = cellAsDate.getFullYear().toString();

    const monthElement = this.shadow.getElementById("month");
    monthElement.innerHTML = MONTHS_$PLUGIN_ID[cellAsDate.getMonth()];

    this.render();
  }
  render() {
    const year = parseInt(this.shadow.getElementById("year").innerHTML);
    const month = MONTHS_$PLUGIN_ID.indexOf(
      this.shadow.getElementById("month").innerHTML
    );
    const cellValue = this.getAttribute("cellvalue");
    const sanitizedInput = cellValue.split('"').join("");
    let inputWithoutTime;
    if (sanitizedInput.includes("T")) {
      const splitCellValue = sanitizedInput.split("T");
      inputWithoutTime = splitCellValue[0];
      this.timeZone = splitCellValue[1];
    } else {
      inputWithoutTime = sanitizedInput;
    }
    const validDate = !isNaN(new Date(inputWithoutTime).getTime())
      ? inputWithoutTime
      : new Date().toISOString().split("T")[0];

    const yearElement = this.shadow.getElementById("year");
    yearElement.innerHTML = year.toString();
    const monthElement = this.shadow.getElementById("month");
    monthElement.innerHTML = MONTHS_$PLUGIN_ID[month];

    // Handle filling in the calendar
    const daysElement = this.shadow.getElementById("days");
    daysElement.innerHTML = "";
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay();
    const lastDayOfPreviousMonth = new Date(year, month, 0).getDate();

    for (let day = firstDayOfMonth; day > 0; day--) {
      let monthHandleRollover = month;
      let yearHandleRollover = year;
      if (month === 0) {
        monthHandleRollover = 12;
        yearHandleRollover -= 1;
      }

      const monthFormatted = monthHandleRollover.toString().padStart(2, "0");
      const fixedDay = lastDayOfPreviousMonth - day + 1;
      const dayFormatted = fixedDay.toString().padStart(2, "0");
      const timeZone = this.timeZone ? "T" + this.timeZone : "";
      const dateFormat = `${yearHandleRollover}-${monthFormatted}-${dayFormatted}`;
      const dayElement = this.dayElementMaker(
        fixedDay.toString(),
        false,
        `${dateFormat}${timeZone}`,
        this.shadow,
        false
      );
      daysElement.appendChild(dayElement);
    }

    for (let day = 1; day <= lastDateOfMonth; day++) {
      const {
        day: selectedDay,
        month: selectedMonth,
        year: selectedYear,
      } = getDateFromCell_$PLUGIN_ID(validDate);
      const isToday =
        day === selectedDay && month === selectedMonth && year === selectedYear;

      const monthFormatted = (month + 1).toString().padStart(2, "0");
      const dayFormatted = day.toString().padStart(2, "0");
      const dateFormat = `${year}-${monthFormatted}-${dayFormatted}`;
      const timeZone = this.timeZone ? "T" + this.timeZone : "";
      const dayElement = this.dayElementMaker(
        day.toString(),
        true,
        `${dateFormat}${timeZone}`,
        this.shadow,
        isToday
      );
      daysElement.appendChild(dayElement);
    }

    for (
      let monthAfterDay = lastDayOfMonth;
      monthAfterDay < 6;
      monthAfterDay++
    ) {
      let monthHandleRollover = month + 2;
      let yearHandleRollover = year;
      if (monthHandleRollover === 13) {
        monthHandleRollover = 1;
        yearHandleRollover += 1;
      }
      const monthFormatted = monthHandleRollover.toString().padStart(2, "0");
      const fixedDay = monthAfterDay - lastDayOfMonth + 1;
      const dayFormatted = fixedDay.toString().padStart(2, "0");
      const dateFormat = `${yearHandleRollover}-${monthFormatted}-${dayFormatted}`;
      const timeZone = this.timeZone ? "T" + this.timeZone : "";
      const dayElement = this.dayElementMaker(
        fixedDay.toString(),
        false,
        `${dateFormat}${timeZone}`,
        this.shadow,
        false
      );
      daysElement.appendChild(dayElement);
    }
  }
}

const addBackButtonFunctionality_$PLUGIN_ID = (
  outerbasePluginEditor: OuterbasePluginEditor_$PLUGIN_ID
) => {
  const retreatDateElement =
    outerbasePluginEditor.shadow.getElementById("back");
  retreatDateElement.onclick = () => {
    const monthElement = outerbasePluginEditor.shadow.getElementById("month");
    const yearElement = outerbasePluginEditor.shadow.getElementById("year");

    const monthIndex = MONTHS_$PLUGIN_ID.indexOf(monthElement.innerHTML);

    const wrapToLastMonth = monthIndex - 1 < 0;
    if (wrapToLastMonth) {
      monthElement.innerHTML = MONTHS_$PLUGIN_ID[MONTHS_$PLUGIN_ID.length - 1];
      const year = parseInt(yearElement.innerHTML) - 1;
      yearElement.innerHTML = year.toString();
    } else {
      monthElement.innerHTML = MONTHS_$PLUGIN_ID[monthIndex - 1];
    }
    outerbasePluginEditor.render();
  };
};
const addForwardButtonFunctionality_$PLUGIN_ID = (
  outerbasePluginEditor: OuterbasePluginEditor_$PLUGIN_ID
) => {
  const advanceDateElement =
    outerbasePluginEditor.shadow.getElementById("forward");
  advanceDateElement.onclick = () => {
    const monthElement = outerbasePluginEditor.shadow.getElementById("month");
    const yearElement = outerbasePluginEditor.shadow.getElementById("year");

    const monthIndex = MONTHS_$PLUGIN_ID.indexOf(monthElement.innerHTML);

    const wrapToFirstMonth = monthIndex + 1 >= MONTHS_$PLUGIN_ID.length;
    if (wrapToFirstMonth) {
      monthElement.innerHTML = MONTHS_$PLUGIN_ID[0];
      const year = parseInt(yearElement.innerHTML) + 1;
      yearElement.innerHTML = year.toString();
    } else {
      monthElement.innerHTML = MONTHS_$PLUGIN_ID[monthIndex + 1];
    }
    outerbasePluginEditor.render();
  };
};

const FUNCTIONALITIES_$PLUGIN_ID = [
  addBackButtonFunctionality_$PLUGIN_ID,
  addForwardButtonFunctionality_$PLUGIN_ID,
];

window.customElements.define(
  "outerbase-plugin-cell-$PLUGIN_ID",
  OuterbasePluginCell_$PLUGIN_ID
);
window.customElements.define(
  "outerbase-plugin-editor-$PLUGIN_ID",
  OuterbasePluginEditor_$PLUGIN_ID
);
