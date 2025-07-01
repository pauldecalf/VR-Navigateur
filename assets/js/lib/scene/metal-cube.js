// threejs imports
import * as THREE from 'three';

export default function metalCube (renderer) {
// loader de fichier 3D


      // on récupere deux images sur le web
      const defaultTexture = 'https://images.unsplash.com/photo-1502030818212-8601501607a6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80';

      const activeTexture = 'https://images.unsplash.com/photo-1577137957776-37612370d243?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80';

      // on cree une fonction qui va charger l'image utilisée et la transformer en texture exploitable dans threejs.
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

      // une forme de cube basique avec en argument les dimensions
      // coté x, coté y , hauteur, z
      // une texture constituée d'une simple couleur
      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );


      // material élaborée à partie de la texture crée 
      // depuis l'image chargée
      const material = new THREE.MeshStandardMaterial( { 
        color: 0x0F0F0F,
        flatShading: false,
        roughness: 5,
        metalness: 3,
        opacity: 0.8,
        aoMapIntensity: 0,
        transparent: true,
        metalnessMap: e_map(),
			  roughnessMap: e_map(),
        aoMap: e_map(activeTexture),
        emissive: 0x111111
      } );


      // on instancie le Mesh cube
      // on l'ajoute à la scene
      return new THREE.Mesh( geometry, material );
}
