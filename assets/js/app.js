import { ready } from "./lib/utils.js";
import * as Init from "./lib/init.js";

import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// import three JS
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'


// globals
let XRSession = null;
const IMMERSIVE_VR = "immersive-vr";
const IMMERSIVE_AR = "immersive-ar";
const INLINE = "inline";


async function init() {

    // on definit le mode désiré
    let sessionMode = null;
    // on selectionne le bouton dans le DOM
    const vrSwitch = document.querySelector("#vr-switch");

    const navigatorOK = Init.checkXRinNavigator();
    if(!navigatorOK) {
        console.log("Navigator does not support XR...");
        return;
    }

    // on fait un checkup complet sur les modes disponibles
    const modeList = document.querySelector('.sess-modes');
    const modeLabel = document.querySelector('.mode-label');
    const modeInUse = document.querySelector('.mode-in-use');

    for(const mode of [IMMERSIVE_VR, IMMERSIVE_AR, INLINE ]) {
        if(await Init.checkXRSession(mode)) {
            modeList.innerHTML += `<li data-mode="${mode}" class="active-mode cursor-pointer" style="color: lightgreen">
                mode <span style="text-transform: uppercase; font-weight: bold;">${mode}</span> possible
            </li>`
        } else {
            modeList.innerHTML += `<li data-mode="${mode}" style="color: red;">
            mod <span style="text-transform: uppercase; font-weight: bold;">${mode}</span> non supporté
            </li>`
        }
    }

    const activeBtns = document.querySelectorAll('.active-mode');
    activeBtns.forEach((li) => {
        li.addEventListener("click", async function() {
            const mode = li.getAttribute("data-mode");
            console.log("mode ", mode);
            sessionMode = mode;
            modeLabel.classList.add("d-none");
            modeList.classList.add('d-none');
            modeInUse.classList.remove('d-none');
            modeInUse.innerHTML = `Mode in use: <span style="text-transform: uppercase; fontweight: bold">${mode}</span>`;
            vrSwitch.classList.remove('d-none');

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
        })
    })



    
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

    init().then(() => {
        console.log("threeJS Object: ", THREE);
        console.log("OrbitControls", OrbitControls);
        console.log("GLTFLoader: ", GLTFLoader);

        // le container de la scene:
        const container = document.getElementById('scene-container');
        container.style.width = "100%";
        container.style.height = "90vh";

        // parametrage du renderer
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.offsetWidth - 6, container.offsetHeight - 6);
        container.appendChild(renderer.domElement);







        // parametrage de la scene

        const pmremGenerator = new THREE.PMREMGenerator(renderer);

        // parametrage de la scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("rgba(20, 20, 20, 0.3)");
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

        // parametrage de la camera
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 100);
        camera.position.set(5, 2, 8);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0,0,0);
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.5;
        controls.update();
        const loader = new GLTFLoader();


        const defaultTexture = 'https://images.unsplash.com/photo-1502030818212-8601501607a6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80';

        const activeTexture = 'https://images.unsplash.com/photo-1577137957776-37612370d243?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80';

        const e_map = ( value ) => {
            const texture = ( value == undefined ) ? defaultTexture : value;
            const matTexture = new THREE.TextureLoader().load( texture );
            matTexture.wrapS = matTexture.wrapT = THREE.MirroredRepeatWrapping;
            matTexture.repeat.set( 1, 1 );
            matTexture.generateMinmaps = false;
            matTexture.minFilter = THREE.NearestFilter;
            matTexture.magFilter = THREE.NearestFilter;
            matTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            return matTexture;
        }

        // creation de notre mesh
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x0f0f0f, flatShading: false, roughness: 2.2, metalness: 0.8, aoMapIntensity: 0, transparent: true, metalssMap: e_map(), roughnessMap: e_map(), emissive: 0x111111 })

        // creation de notre cube
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        //animate
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera)
        }

        animate();

        window.onresize = function() {
            camera.aspect = window.innerWidth/window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth - 6, container.offsetHeight - 6);
        }

    })



    

    
})