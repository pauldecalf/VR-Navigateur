/**
 * Vérifie la présence de l'api WebXR dan le navigateur
 * 
 * @returns boolean
 */
export function checkXRinNavigator () {
    if ("xr" in window.navigator) {
      console.log("Capacités XR ok");
      return true
    } 
    console.log("Capacités xr PAS ok");
    return false
  }
  
  /**
   * Vérifie si un mode de session est supporté
   * 
   * @param string sessionMode 
   * @returns boolean
   */
  export async function checkXRSession(sessionMode) {
    const sessionOk = await navigator.xr.isSessionSupported(sessionMode);
    if(sessionOk) {
      console.log(`XR - ${sessionMode} Session ok`);
      return true
    }
    console.log(`XR - ${sessionMode} Session PAS ok`);
    return false
  }
  
  /**
   * retourne une session XR
   * 
   * @param string sessionMode 
   * @returns 
   */
  export async function getXRSession(sessionMode) {
    if(await checkXRSession(sessionMode)){
      return await navigator.xr.requestSession(sessionMode);
    }
  }