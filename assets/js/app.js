import { ready } from "./lib/utils.js";
import * as Init from "./lib/init.js";

// globals
let XRSession = null;
const IMMERSIVE_VR = "immersive-vr";
const IMMERSIVE_AR = "immersive-ar";
const INLINE = "inline";


async function init() {

    // on definit le mode désiré
    let sessionMode = INLINE;
    // on selectionne le bouton dans le DOM
    const vrSwitch = document.querySelector("#vr-switch");

    const navigatorOK = Init.checkXRinNavigator();
    if(!navigatorOK) {
        console.log("Navigator does not support XR...");
        return;
    }


// On fait le checkup complet sur les modes desponibles
const modeList = document.querySelector(".sess-modes");
const modeLabel = document.querySelector(".mode-label");
const modeInUse = document.querySelector(".mode-in-use");

for( const mode of [IMMERSIVE_VR, IMMERSIVE_AR, INLINE]) {
    if(await Init.checkXRSession(mode)){
        modeList.innerHTML = `<li data-mode="${mode}" class="active-mode cursor-pointer" style="color: lightgreen">
            mode <span style="text-transform: uppercase">${mode}</span> possible
        </li>`
    } else {
        modeList.innerHTML = `<li data-mode="${mode}" style="color: red;">
        mod <span style="text-transform: uppercase">${mode}</span> non supporté
        </li>`
    }
}

const activeBtn = document.querySelectorAll('.active-mode');
activeBtn.forEach((li) => {
    li.addEventListener("click", async function () {
        const mode = li.getAttribute("data-mode");
        console.log("mode:", mode);
        sessionMode = mode;
        modeLabel.classList.add('d-none');
        modeList.classList.add('d-none');
        modeInUse.classList.remove('d-none');
        modeInUse.innerHTML = `Mode in use : <span style="text-transform: ussercase; fontweight: bold;>${mode}</span>`;
        vrSwitch.classList.remove('d-none');
    })
})


    const XRSessionOK = await Init.checkXRSession(sessionMode);
    if(!XRSessionOK) {
        vrSwitch.textContent = "XR NOT SUPPORTED !";
        vrSwitch.disabled = true;
    } else {
        // inserer ici le gestionnaire de l'evènement click
        vrSwitch.addEventListener("click", () => {
            onStartButtonClicked(sessionMode, vrSwitch);
        });
        vrSwitch.textContent = "XR SUPPORTED !";
        vrSwitch.disabled = false;
    }
}

async function onStartButtonClicked(sessionMode, button) {
    if(!XRSession) {
        const session = await Init.getXRSession(sessionMode);
        XRSession = session;
        console.log(`XR - ${session} session started`);
        button.textContent = "EXIT VR";
        await onSessionStarted(XRSession);
    } else {
        XRSession.end();
        XRSession = null;
        button.textContent = "ENTER VR";
        console.log(`XR - ${sessionMode} session Ended`);
    }
}

async function onSessionStarted (session) {
    console.log("session: ", session);
}

ready(function() {
    console.log('DOM correctly loaded...'); 
    init();
})