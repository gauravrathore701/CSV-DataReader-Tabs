const uploadContainer = document.querySelector("#upload-container");
const addTabs = document.querySelector("#add-tabs");
const tabList = document.querySelector(".tab-list");
const tabItems = document.querySelectorAll(".tab-item");
const tabContent = document.querySelector(".tab-content");
const fileInput = document.querySelector("#file-input");
const cross = document.querySelectorAll(".cross");
const searchPopup = document.getElementById("searchPopup");
const closePopup = document.getElementById("closePopup");
const speakButton = document.querySelector(".speakButton");
const searchBox = document.querySelector(".searchBox");

//Additional Variable

function changeTab(index) {
  const tabItems = document.querySelectorAll(".tab-item");
  const tabPanes = document.querySelectorAll(".tab-pane");

  // Resetting tabs and content
  tabItems.forEach((item) => item.classList.remove("active"));
  tabPanes.forEach((pane) => pane.classList.remove("active"));

  // Activating the selected tab and its content
  tabItems[index].classList.add("active");
  tabPanes[index].classList.add("active");
}

function addTabFucntion() {
  let tabItems = document.querySelectorAll(".tab-item");

  let index = tabItems.length;

  let newTab = document.createElement("li");
  let textNode = document.createTextNode(`Tab ${index + 1}`);
  let newTabContent = document.createElement("div");
  let closeButton = document.createElement("span");

  closeButton.innerHTML = "&times;";

  tabContent.appendChild(newTabContent);
  newTab.appendChild(textNode);
  newTab.appendChild(closeButton);
  tabList.insertBefore(newTab, tabList.children[index]);

  newTabContent.textContent = `Content for tab ${
    index + 1
  } will be visible here...`;

  closeButton.classList.add("close-tab");
  newTab.classList.add("tab-item");
  newTabContent.classList.add("tab-pane");

  changeTab(index);
}

function displayCSV(data) {
  const newTabContent = document.querySelector(".tab-pane.active");
  newTabContent.innerHTML = "";
  const table = document.createElement("table");

  data.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  newTabContent.appendChild(table);
}

function tabContentTable(files) {
  let tabItems = document.querySelectorAll(".tab-item");

  let index = tabItems.length;

  let newTab = document.createElement("li");
  let textNode = document.createTextNode(`${files[0].name}`);
  let newTabContent = document.createElement("div");
  let closeButton = document.createElement("span");

  closeButton.innerHTML = "&times;";

  tabContent.appendChild(newTabContent);
  newTab.appendChild(textNode);
  newTab.appendChild(closeButton);
  tabList.insertBefore(newTab, tabList.children[index]);

  closeButton.classList.add("close-tab");
  newTab.classList.add("tab-item");
  newTabContent.classList.add("tab-pane");

  window.electron.parseCSV(files[0], displayCSV);

  changeTab(index);
}

function shellCommands() {
  window.shell.exec(`meshio -v`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

tabList.addEventListener("click", function (event) {
  const tabItems = document.querySelectorAll(".tab-item");

  tabItems.forEach((item, index) => {
    if (item === event.target) {
      changeTab(index);
    }
  });
});
// Highlight the drop area when a file is dragged over it
uploadContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadContainer.classList.add("active");
});

// Reset the drop area when the file is dragged out
uploadContainer.addEventListener("dragleave", () => {
  uploadContainer.classList.remove("active");
});

uploadContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files;
  tabContentTable(file);
});

uploadContainer.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  e.preventDefault();
  const file = e.target.files;
  tabContentTable(file);
});

tabList.addEventListener("click", function (event) {
  const tabItems = document.querySelectorAll(".tab-item");
  const tabPanes = document.querySelectorAll(".tab-pane");

  // Check if the close button was clicked
  if (event.target.classList.contains("close-tab")) {
    const parentTab = event.target.closest(".tab-item");
    const tabIndex = Array.from(tabItems).indexOf(parentTab);

    // Remove the associated content pane and tab
    tabPanes[tabIndex].remove();
    parentTab.remove();
    return; // Exit to prevent further handling
  }

  tabItems.forEach((item, index) => {
    if (item === event.target || item.contains(event.target)) {
      changeTab(index);
    }
  });
});

addTabs.addEventListener("click", () => {
  addTabFucntion();
});

// Speak Button Code Toggle Method
let sr = window.webkitSpeechRecognition || window.SpeechRecognition;
let spRec = new sr();
spRec.continuous = true;
spRec.interimResults = true;
spRec.onresult = (res) => {
  let text = Array.from(res.results)
    .map((r) => r[0])
    .map((txt) => txt.transcript)
    .join("");
  searchBox.value = text;
  console.log(text);
};
let c = 0;
speakButton.addEventListener("click", () => {
  if (c == 0) {
    spRec.start();
    console.log("test-0");
    c = 1;
  } else {
    spRec.stop();
    console.log("test-1");
    c = 0;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Your code to run once the DOM is ready
  shellCommands();
});

closePopup.addEventListener("click", () => {
  searchPopup.style.display = "none";
});

document.addEventListener("keydown", (event) => {
  if (
    (event.ctrlKey && event.key === "K") ||
    (event.ctrlKey && event.key === "k")
  ) {
    searchPopup.style.display = "block";
  }
});
