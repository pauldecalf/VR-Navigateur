import { ready } from "./lib/utils.js";
import * as Init from "./lib/init.js";
import metalCube from "./lib/scene/metal-cube.js"
// threejs imports
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// globals
let XRSession = null;
const IMMERSIVE_VR = "immersive-vr";
const IMMERSIVE_AR = "immersive-ar"
const INLINE = "inline";


/**
 * click sur le bouton de demarrage
 * 
 * @param string sessionMode 
 */
async function onStartButtonClicked(sessionMode, button) {
  if (!XRSession) {
    const session = await Init.getXRSession(sessionMode);
    XRSession = session;
    console.log(`XR - ${session} Session Started`);
    button.textContent = "Exit XR";
    await onSessionStarted(XRSession);
  } else {
    
    XRSession.end();
    XRSession = null;
    button.textContent = "Enter XR";
    console.log(`XR - ${sessionMode} Session Ended`);
  }
}

/**
 * fonction d'initalisation principale
 * 
 * @returns 
 */
async function init() {
  // definition du type de session
  let sessionMode = null;

  // selection du bouton de demarrage
  const vrSwitch = document.querySelector("#vr-switch");

  // vérifie si l'api XR est presente dans le navigateur
  const navigatorOk = Init.checkXRinNavigator();
  if(!navigatorOk) {
    console.log("Your navigator does nort support XR");
    return;
  }

  // on fait un checkup complet sur les modes disponibles
  const modeList = document.querySelector('.sess-modes');
  const modeLabel = document.querySelector('.mode-label');
  const modeInUse = document.querySelector('.mode-in-use');
  const modal = document.querySelector('.modal');

  for(const mode of [IMMERSIVE_VR, IMMERSIVE_AR, INLINE]) {
    if(await Init.checkXRSession(mode)) {
      modeList.innerHTML += `<li data-mode="${mode}" class="active-mode cursor-pointer" style="color: lightgreen;"> mode <span style="text-transform: uppercase;; font-weight: bold;">${mode}</span> possible</li>`;
      
    } else {
      modeList.innerHTML += `<li data-mode="${mode}" style="color: red;"> mode <span style="text-transform: uppercase;; font-weight: bold;">${mode}</span> non supporté</li>`;
    }
  }
  
  const activeBtns = document.querySelectorAll('.active-mode'); 
  activeBtns.forEach((li) => {
    li.addEventListener('click', async function(){
      const mode = li.getAttribute('data-mode');
      console.log("mode: ", mode);
      sessionMode = mode;
      modeLabel.classList.add('d-none');
      modeList.classList.add('d-none');
      modeInUse.classList.remove('d-none');
      modeInUse.innerHTML = `XR Mode in use: <span style="text-transform: uppercase; color: lightgreen; font-weight: bold;">${mode}</span>`;
      vrSwitch.classList.remove('d-none');
      modal.classList.add('d-none');

      // vérifie si une session est supportée
      const XRSessionOk = await Init.checkXRSession(sessionMode);
      if(!XRSessionOk) {
        vrSwitch.textContent = "XR NOT SUPPORTED !";
        vrSwitch.disabled = true;
      } else {
        vrSwitch.addEventListener("click", () => {
          onStartButtonClicked(sessionMode, vrSwitch);
        });
        vrSwitch.textContent = "Enter XR";
        vrSwitch.disabled = false;
      }
    })
  })
  
  console.log(activeBtns);
  
}

/**
 * Gestionnaire exécuté dès que la session démarre
 * 
 * @param {XRSession} session 
 */
async function onSessionStarted(session) {
  console.log("session: ", session);
}


/**
 * Appel principal
 */
ready(function() {
  

  // main call
  init()
    .then(() => {
      console.log("three Object: ", THREE);
      console.log("OrbitControls: ", OrbitControls);
      console.log("GLTFLoader: ", GLTFLoader);
    
      // le container de notre scene
      const container = document.getElementById('scene-container');
      container.style.width = "100%";
      container.style.height = "90vh";

      // le renderer contient le moteur et la zone de rendu pour notre scene.
      // threejs utilisera automatiquement un élément <canvas>
      // on definit son aspect ratio
      // sa taille (de manière a s'integrer parfaitement dans son container)
      // puis on place la zone dans le container
      const renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( container.offsetWidth-6 , container.offsetHeight-6);
			container.appendChild( renderer.domElement );

      // on instancie un générateur de Mipmap radiance Environement
      const pmremGenerator = new THREE.PMREMGenerator( renderer );

      // on créé la scene
      // on donne une couleur de fond à la scene
      // on crée un éclairage ambiant à partir d'un Mipmap radiance
      // environnemetn généré à partir de l'environnement natif 
      // ''RoomEnvironement'' de threejs
			const scene = new THREE.Scene();
			scene.background = new THREE.Color( "rgba(20,20,20,0.3)" );
      scene.environment = pmremGenerator.fromScene( new RoomEnvironment( renderer ), 0.04 ).texture;


      // la caméra.
      // on utilise ici une PerspectiveCamera avec les arguments suivants:
      // fov (field of vision) =  angle d'ouvertur champ de la caméra
      // l'aspect ratio
      // les limites near  et far
      // les objets plus proches que la limite near ne seront pas rendus
      // les objet plus éloigné que la limite far ne seront pas rendus
      //
      // puis la position de la caméra (x, y, z)
      
      const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
			camera.position.set( 5, 2, 8 );

      // control de la caméra
      // on définit la cible de visée
      // on interdit la rotation a droite ou gauche de la caméra (panning)
      // on autorise l'inertie dans le mouvement de la caméra.
      // on met à jour

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set( 0, 0, 0 );
      controls.rotateSpeed = 0.8;
			controls.enablePan = false;
			controls.enableDamping = true;
      controls.dampingFactor = .05;
	    controls.update();

              // on le charge au cas ou nous en aurions besoin
      const loader = new GLTFLoader();

      const cube = metalCube(renderer);
      scene.add( cube );


      // fonction de rendu
      // elle chage la prochaine frame avec elle-même
      // puis elle appelle le rendu de la scene
      function animate() {
        requestAnimationFrame( animate );
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.02;
        rotateCamera(0.02);
        renderer.render( scene, camera );
      }

      // on lance animate().
      // une fois cela fait ce sont les frames
      // du moteur de rendu du navigateur qui
      // l'apelleront.
      animate();

      // utils functions
      window.onresize = function () {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( container.offsetWidth-6 , container.offsetHeight-6 );
			};

      function rotateCamera(rotSpeed) {
        const x = camera.position.x;
        const z = camera.position.z;

        camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
        camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);

        camera.lookAt(scene.position);
      }


    })
});