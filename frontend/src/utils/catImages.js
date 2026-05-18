import siamezaAlbastri from '../assets/cats/Siameza_ochi_albastri.png';
import siamezaGalbeni from '../assets/cats/Siameza_ochi_galbeni.png';
import siamezaNegri from '../assets/cats/Siameza_ochi_negri.png';
import siamezaVerzi from '../assets/cats/Siameza_ochi_verzi.png';

import albaAlbastri from '../assets/cats/Alba_ochi_albastri.png';
import albaGalbeni from '../assets/cats/Alba_ochi_galbeni.png';
import albaNegri from '../assets/cats/Alba_ochi_negri.png';
import albaVerzi from '../assets/cats/Alba_ochi_verzi.png';

import neagraAlbastri from '../assets/cats/Neagra_ochi_albastri.png';
import neagraGalbeni from '../assets/cats/Neagra_ochi_galbeni.png';
import neagraNegri from '../assets/cats/Neagra_ochi_negri.png';
import neagraVerzi from '../assets/cats/Neagra_ochi_verzi.png';

import orangeAlbastri from '../assets/cats/Orange_ochi_albastri.png';
import orangeGalbeni from '../assets/cats/Orange_ochi_galbeni.png';
import orangeNegri from '../assets/cats/Orange_ochi_negri.png';
import orangeVerzi from '../assets/cats/Orange_ochi_verzi.png';

import tuxedoAlbastri from '../assets/cats/Tuxedo_ochi_albastri.png';
import tuxedoGalbeni from '../assets/cats/Tuxedo_ochi_galbeni.png';
import tuxedoNegri from '../assets/cats/Tuxedo_ochi_negri.png';
import tuxedoVerzi from '../assets/cats/Tuxedo_ochi_verzi.png';

const catImages = {
  siameza: {
    albastri: siamezaAlbastri,
    galbeni: siamezaGalbeni,
    negri: siamezaNegri,
    verzi: siamezaVerzi,
  },
  orange: {
    albastri: orangeAlbastri,
    galbeni: orangeGalbeni,
    negri: orangeNegri,
    verzi: orangeVerzi,
  },
  tuxedo: {
    albastri: tuxedoAlbastri,
    galbeni: tuxedoGalbeni,
    negri: tuxedoNegri,
    verzi: tuxedoVerzi,
  },
  alba: {
    albastri: albaAlbastri,
    galbeni: albaGalbeni,
    negri: albaNegri,
    verzi: albaVerzi,
  },
  neagra: {
    albastri: neagraAlbastri,
    galbeni: neagraGalbeni,
    negri: neagraNegri,
    verzi: neagraVerzi,
  },
};

<<<<<<< HEAD

=======
/**
 * Returnează calea către imaginea pisicii selectate, cu valori default sigure
 */
>>>>>>> origin/feature/update
export const getCatImage = (coat, eyes) => {
  const safeCoat = coat && catImages[coat] ? coat : 'siameza';
  const safeEyes = eyes && catImages[safeCoat][eyes] ? eyes : 'albastri';
  return catImages[safeCoat][safeEyes];
};