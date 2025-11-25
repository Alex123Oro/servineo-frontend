'use client';

export const PROFILE_MAIN_WRAPPER_START = `<main aria-hidden="true" style="display:none">`;
export const PROFILE = `
  <div id="profileModal" class="modal" aria-hidden="true" style="display:none">
    <h2>Mi perfil</h2>
    <img id="profileViewPhoto" src="https://i.pravatar.cc/100?u=default" alt="Foto de perfil" style="width:120px;height:120px;border-radius:50%;margin:auto;object-fit:cover;border:3px solid #2B6AF0" />
    <p><strong>Nombre:</strong> <span id="profileViewName"></span></p>
    <p><strong>Correo:</strong> <span id="profileViewEmail"></span></p>
    <p><strong>Teléfono:</strong> <span id="profileViewPhone"></span></p>
    <button class="btn" id="closeProfileViewBtn">Cerrar</button>
  </div>
`;
export const PROFILE_MAIN_WRAPPER_END = `</main>`;
