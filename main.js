//Yes I used replit copilot because im lazy

// Create Command DevTools container

let cmdDevTools = document.createElement("div");
cmdDevTools.innerHTML = `
    <div id="cmd-devtools" class="cmd-devtools">
        <div class="cmd-devtools-header">
            <div class="cmd-devtools-title"><b>Perc30</b> | Modder</div>
            <div class="cmd-devtools-buttons">
                <button class="cmd-devtools-close">&#x2716;</button>
            </div>
        </div>
        <div class="cmd-devtools-content">
            <div id="cmd-output" class="cmd-output"></div>
        </div>
        <textarea id="cmd-input" class="cmd-input" placeholder="Enter commands here..."></textarea>
    </div>
    <style>
        .cmd-devtools {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 500px; /* Initial width */
            height: 400px; /* Initial height */
            background-color: #2d2d2d; /* Dark background color */
            color: #ddd; /* Light text color */
            border: 1px solid #444; /* Dark border color */
            border-radius: 6px;
            z-index: 9999;
            overflow: hidden;
            resize: both; /* Allow resizing */
        }

        .cmd-devtools-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            background-color: #3a3a3a; /* Darker header background color */
            border-bottom: 1px solid #444; /* Dark border color */
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            cursor: move; /* Show move cursor */
        }

        .cmd-devtools-buttons {
            display: flex;
        }

        .cmd-devtools-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
        }

        .cmd-devtools-close:hover {
            background:red
        }

        .cmd-devtools-content {
            overflow: auto;
            height: calc(100% - 90px); /* Adjust height for header, input, and output */
        }

        .cmd-input {
            width: 100%;
            height: 50px;
            background-color: #272822; /* Dark background color */
            color: #f8f8f2; /* Light text color */
            font-family: 'Courier New', Courier, monospace;
            font-size: 14px;
            padding: 10px;
            border: none;
            resize: none;
        }

        .cmd-output {
            padding: 10px;
            background-color: #272822; /* Dark background color */
            color: #f8f8f2; /* Light text color */
            font-family: 'Courier New', Courier, monospace;
            font-size: 14px;
            overflow: auto; /* Ensure scrollbars appear when needed */
            max-height: 300px; /* Limit max height to prevent excessive growth */
        }
    </style>
`;

// Make Command DevTools draggable
let dragItem = cmdDevTools.querySelector(".cmd-devtools-header");
let cmdDevToolsElement = cmdDevTools.querySelector(".cmd-devtools");
let offsetX, offsetY;

dragItem.addEventListener("mousedown", startDrag);

function startDrag(e) {
    offsetX = e.clientX - cmdDevToolsElement.getBoundingClientRect().left;
    offsetY = e.clientY - cmdDevToolsElement.getBoundingClientRect().top;

    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", stopDrag);
}

function drag(e) {
    cmdDevToolsElement.style.left = e.clientX - offsetX + "px";
    cmdDevToolsElement.style.top = e.clientY - offsetY + "px";
}

function stopDrag(e) {
    window.removeEventListener("mousemove", drag);
}

// Append Command DevTools to the body
document.body.appendChild(cmdDevTools);


// Override console.log, console.error, and console.warn to redirect output to cmd-output
(function() {
    let oldLog = console.log;
    console.log = function(...args) {
        oldLog.apply(console, args);
        document.getElementById("cmd-output").innerText += args.join(" ") + "\n";
    };

    let oldError = console.error;
    console.error = function(...args) {
        oldError.apply(console, args);
        document.getElementById("cmd-output").innerText += "ERROR: " + args.join(" ") + "\n";
    };

    let oldWarn = console.warn;
    console.warn = function(...args) {
        oldWarn.apply(console, args);
        document.getElementById("cmd-output").innerText += "WARNING: " + args.join(" ") + "\n";
    };
})();

// send cmd
document.getElementById("cmd-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // stop newline
        let inputCommand = this.value.trim(); // remove space
        if (inputCommand !== "") {
            executeCommand(inputCommand);
        }
        // clear it after sending
        this.value = "";
    }
});
var con=false // defaults
// exe cmd
function executeCommand(command) {
    switch (command) {
        case "help":
            console.log("List of available commands:");
            console.log("1. help - Display this help message.");
            console.log("2. version - Gets the Perc30 verision.")
            console.log("2. disabler - Disables chrome extensions.");
            break;
        case "disabler":
            if (location.protocol === "chrome-extension:") {
                if(/\bCrOS\b/.test(navigator.userAgent) && con===false){
                    console.log("On most ChromeOS devices this method doesn't work so please enter your id manually into the URL bar (chrome-extension://{ID}/manifest.json) then rerun this! IF YOU WANNA TRY THE METHOD EVEN THOUGH IT PROBABLY DOESNT WORK PLEASE TYPE 'continue'. ") 
                    return;
                }
                if (location.pathname === "/manifest.json") {
                    console.log("Please run this same command on the window that just opened!")
                    window.open(location.origin + "/" + JSON.parse(document.getElementsByTagName("pre")[0].textContent).browser_action.default_popup)
                } else if (location.pathname.includes("popup.html")) {
                    console.log("Attempting to shut off the extention...")
                    setInterval(chrome.browserAction.disable, 1)
                } else {
                    console.log("I don't recognise this link!")
                }

            } else {
                console.log("You cannot use this command, you aren't inside of a extention link")
            }
            break;
        case "version":
            console.log("Your current version is 1.0")
            break;
        case "continue":
            con=true
            executeCommand("disabler")
            break;
        default:
            console.error("Invalid command. Type 'help' for a list of available commands.");
    }
}

// Add event listener to close button
document.querySelector(".cmd-devtools-close").addEventListener("click", function() {
    document.getElementById("cmd-devtools").remove();
});
console.log("This tool was made by Tobias")

if(/\bCrOS\b/.test(navigator.userAgent)===false){
    console.log("This tool is intended for ChromeOS devices.")
}

