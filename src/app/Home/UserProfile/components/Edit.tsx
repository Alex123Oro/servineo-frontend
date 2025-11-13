'use client';

export const EDIT = `
  <div id="editModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="editTitle" aria-hidden="true" style="display:none">
    <h2 id="editTitle">Editar perfil</h2>

    <div class="photo-container">
      <input id="photoInput" type="file" accept="image/*" aria-label="Cambiar foto de perfil" />
      <div class="photo-preview" id="photoPreviewContainer">
        <img id="photoPreviewImg" src="/avatar.png" alt="Foto de perfil" />
        <div class="photo-overlay">
          <span class="camera-icon">📷</span>
          <p>Cambiar foto</p>
        </div>
      </div>
    </div>

    <label for="nameInput">Nombre completo</label>
    <input id="nameInput" type="text" placeholder="Nombre y apellidos" aria-required="true" />
    <small id="nameErr" class="error" style="display:none"></small>

    <label for="emailInput">Correo electrónico</label>
    <input id="emailInput" type="email" placeholder="correo@ejemplo.com" aria-required="true" />
    <small id="emailErr" class="error" style="display:none"></small>

    <label for="phoneInput">Teléfono</label>
    <input id="phoneInput" type="tel" placeholder="71234567" aria-required="false" />
    <small id="phoneErr" class="error" style="display:none"></small>

    <label class="toggle" style="margin-top:8px">
      <input type="checkbox" id="notifToggle" /> Notificaciones
    </label>

    <div id="passwordSection">
      <label>Contraseña</label>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span id="maskedPassword">••••••••</span>
        <button type="button" class="btn" id="changePasswordBtn" style="padding:6px 10px;font-size:13px">Cambiar contraseña</button>
      </div>
    </div>

    <div id="passwordChangeFields" style="display:none;flex-direction:column;gap:12px;margin-top:10px">
      <label for="currentPassword">Contraseña actual</label>
      <div style="position:relative">
        <input type="password" id="currentPassword" style="width:100%;padding-right:35px" />
        <button type="button" class="togglePw" id="toggleCurrentPwd"
          style="position:absolute;right:8px;top:50%;transform:translateY(-50%);border:none;background:none;cursor:pointer;color:#000;">
          <!-- ICONO OJO NORMAL -->
<svg width="20" height="20" viewBox="0 0 24 24">
  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" stroke-width="2" fill="none"/>
  <circle cx="12" cy="12" r="3" fill="currentColor"/>
</svg>
        </button>
      </div>

      <label for="newPassword">Nueva contraseña</label>

      <div style="position:relative">
        <input type="password" id="newPassword" style="width:100%;padding-right:35px" />
        <button type="button" class="togglePw" id="toggleNewPwd"
          style="position:absolute;right:8px;top:50%;transform:translateY(-50%);border:none;background:none;cursor:pointer;color:#000;">
          <!-- ICONO OJO NORMAL -->
<svg width="20" height="20" viewBox="0 0 24 24">
  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" stroke-width="2" fill="none"/>
  <circle cx="12" cy="12" r="3" fill="currentColor"/>
</svg>
        </button>
      </div>

      <div id="pwBar" class="password-strength"><i></i></div>
      <small id="pwErr" class="error" style="display:none"></small>

      <div style="display:flex;gap:8px;margin-top:10px">
        <button type="button" class="btn" id="saveNewPwBtn">Guardar nueva contraseña</button>
        <button type="button" class="btn" id="cancelNewPwBtn" style="background:#ccc;color:#000">Cancelar</button>
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:15px">
      <button type="button" class="btn" id="saveProfileBtn">Guardar</button>
      <button type="button" class="btn" id="cancelEditBtn" style="background:#ccc;color:#000">Cancelar</button>
    </div>
  </div>
`;
