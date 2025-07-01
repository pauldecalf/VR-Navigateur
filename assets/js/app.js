import { ready } from "./lib/utils.js";
import * as Init from "./lib/init.js";

// globals
let XRSession = null;
const IMMERSIVE_VR = "immersive-vr";
const IMMERSIVE_AR = "immersive-ar";
const INLINE = "inline";


async function init() {

    // on definit le mode désiré
    const sessionMode = INLINE;
    // on selectionne le bouton dans le DOM
    const vrSwitch = document.querySelector("#vr-switch");

    const navigatorOK = Init.checkXRinNavigator();
    if(!navigatorOK) {
        console.log("Navigator does not support XR...");
        return;
    }

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