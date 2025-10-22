// /app/Home/UserProfile/userProfileLogic.js
import { mockUser } from "@/app/Home/UserProfile/UI/mockUser";

export function initUserProfileLogic() {
  if (typeof window === "undefined") return;
const deviceIdKey = 'booka_device_id';
  let deviceId;
  
// ================== IDENTIFICADOR DE DISPOSITIVO ==================
  deviceId = sessionStorage.getItem(deviceIdKey);
if (!deviceId) {
    deviceId = "dev-" + Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem(deviceIdKey, deviceId);
  }
  window.deviceId = deviceId;

  // ================== ALMACENAMIENTO LOCAL ==================
  let usersStore = JSON.parse(localStorage.getItem('booka_users')) || { sessions: {}, lastUpdated: Date.now() };
  if (!usersStore.sessions[deviceId]) usersStore.sessions[deviceId] = { loggedIn: false };

  function saveUsersStore() {
    localStorage.setItem('booka_users', JSON.stringify(usersStore));
    localStorage.setItem('booka_broadcast', JSON.stringify({ ts: Date.now(), sender: deviceId }));
    setTimeout(() => localStorage.removeItem('booka_broadcast'), 50);
  }

  function getUser() {
    usersStore = JSON.parse(localStorage.getItem('booka_users')) || { sessions: {}, lastUpdated: Date.now() };
    return usersStore.sessions[deviceId] || { loggedIn: false };
  }

  function setUserForDevice(u) {
    usersStore.sessions[deviceId] = u;
    usersStore.lastUpdated = Date.now();
    saveUsersStore();
  }

  // ================== ELEMENTOS DEL DOM (sólo donde se necesite y con seguridad) ==================
  const authButtons = document.getElementById("authButtons");
  const editModal = document.getElementById("editModal");

  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const phoneInput = document.getElementById("phoneInput");
  const photoInput = document.getElementById("photoInput");
  const menuPhoto = document.getElementById("menuPhoto");
  const menuName = document.getElementById("menuName");
  const menuEmail = document.getElementById("menuEmail");

  const nameErr = document.getElementById("nameErr");
  const emailErr = document.getElementById("emailErr");
  const phoneErr = document.getElementById("phoneErr");
  const pwErr = document.getElementById("pwErr");
  const currentPassword = document.getElementById("currentPassword");
  const newPassword = document.getElementById("newPassword");
  const pwBar = document.getElementById("pwBar");
  const notifToggle = document.getElementById("notifToggle");

  // ================== TEMPORIZADOR DE INACTIVIDAD ==================
  let inactivityTimer = null;
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      const u = getUser();
      if (u && u.loggedIn) {
        alert("Tu sesión ha expirado por inactividad.");
        logout();
      }
    }, 10 * 60 * 1000);
  }
  ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(evt => {
    document.addEventListener(evt, resetInactivityTimer, { passive: true });
  });
  resetInactivityTimer();
  // ================== RENDER UI  ==================
function renderUI() {
  const user = getUser();
  const profileIcon = document.getElementById("profileIcon");
  const menuPhotoEl = document.getElementById("menuPhoto");
  const menuNameEl = document.getElementById("menuName");
  const menuEmailEl = document.getElementById("menuEmail");


  if (user.loggedIn) {
    if (profileIcon) profileIcon.src = user.photo || "/avatar.png";
    if (menuPhotoEl) menuPhotoEl.src = user.photo || "/avatar.png";
    if (menuNameEl) menuNameEl.textContent = user.name || "Sin nombre";
    if (menuEmailEl) menuEmailEl.textContent = user.email || "";
  }
}

  // ================== LOGIN DEMO ==================
  function login() {
    const u = Object.assign({}, mockUser);
    u.loggedIn = true;
    setUserForDevice(u);
    
    window.userProfile = u;
    window.isAuthenticated = true;
    renderUI();
  }

  // ================== LOGOUT ==================
  function logout() {
    const u = getUser();
    if (u && u.loggedIn) {
      usersStore = JSON.parse(localStorage.getItem("booka_users")) || { sessions: {}, lastUpdated: Date.now() };
      usersStore.sessions[deviceId] = { loggedIn: false };
      usersStore.lastUpdated = Date.now();
      localStorage.setItem("booka_users", JSON.stringify(usersStore));
      localStorage.setItem("booka_broadcast", JSON.stringify({ ts: Date.now(), sender: deviceId, action: 'logout', device: deviceId }));
      setTimeout(() => localStorage.removeItem('booka_broadcast'), 50);
      window.userProfile = null;
      window.isAuthenticated = false;
      renderUI();

      // 🔔 Notificar al Header (evento global para React)
      window.dispatchEvent(new Event("booka-logout"));
    }
  }

  // ================== UTILIDADES ==================
  function passwordStrength(pw) {
    let score = 0;
    if (!pw) return 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  function processImageFile(file, maxSize = 400) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = e => {
        img.onload = () => {
          let w = img.width, h = img.height;
          const ratio = w / h;
          if (w > maxSize || h > maxSize) {
            if (ratio > 1) { w = maxSize; h = Math.round(maxSize / ratio); }
            else { h = maxSize; w = Math.round(maxSize * ratio); }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = err => reject(err);
        // @ts-ignore
        img.src = e.target.result;
      };
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // ================== GUARDAR / ACTUALIZAR PERFIL ==================
  async function saveProfile() {
    const u = getUser();
    if (!nameInput || !emailInput || !phoneInput) {
      console.warn("Campos de edición no encontrados");
      return;
    }

    let valid = true;
    if (!nameInput.value.trim()) { if (nameErr) { nameErr.textContent = "El nombre es obligatorio."; nameErr.style.display = 'block'; } valid = false; }
    if (!/\S+@\S+\.\S+/.test(emailInput.value)) { if (emailErr) { emailErr.textContent = "Correo inválido."; emailErr.style.display = 'block'; } valid = false; }
    if (phoneInput && !/^[0-9+\s()-]{6,20}$/.test(phoneInput.value) && phoneInput.value.trim() !== "") { if (phoneErr) { phoneErr.textContent = "Teléfono inválido."; phoneErr.style.display = 'block'; } valid = false; }

    if (!valid) return;

    const updated = Object.assign({}, u);
    updated.name = nameInput.value.trim();
    updated.email = emailInput.value.trim();
    updated.phone = phoneInput.value.trim();
    updated.notif = !!(notifToggle && notifToggle.checked);

    const file = photoInput && photoInput.files && photoInput.files[0];
    if (file) {
      try {
        const dataUrl = await processImageFile(file, 400);
        updated.photo = dataUrl;
      } catch (err) {
        console.error(err);
        alert("No se pudo procesar la imagen.");
        return;
      }
} else if (!file && u.photo && !updated.photo) {
  updated.photo = u.photo;
}

    updated.loggedIn = true;
    
    setUserForDevice(updated);
    window.userProfile = updated;
     window.dispatchEvent(new CustomEvent("booka-profile-updated", { detail: updated }));
    renderUI();

  

    if (editModal) editModal.classList.remove("show");
    alert("Perfil guardado correctamente.");
  }

  // ================== CAMBIO DE CONTRASEÑA ==================
  function savePasswordChange() {
    if (!currentPassword || !newPassword) return;
    const u = getUser();
    const current = currentPassword.value.trim();
    const newPw = newPassword.value.trim();
    if (!current || current !== u.password) {
      if (pwErr) { pwErr.textContent = "Contraseña actual incorrecta."; pwErr.style.display = 'block'; }
      return;
    }
    const s = passwordStrength(newPw);
    if (s < 2) {
      if (pwErr) { pwErr.textContent = "Contraseña demasiado débil."; pwErr.style.display = 'block'; }
      return;
    }
    u.password = newPw;
    setUserForDevice(u);
    alert("Contraseña cambiada correctamente.");
    if (editModal) editModal.classList.remove("show");
  }

  // ================== VER PERFIL, EDITAR Y CONVERTIR ==================
  function goToProfile() {
    const u = window.userProfile || getUser() || mockUser;
    // no bloquear por login: si u existe, usamos sus datos (mockUser será fallback)
    const nuevaVentana = window.open("", "_blank");
    if (!nuevaVentana) { alert("Permite las ventanas emergentes para ver tu perfil."); return; }
    const contenido = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <title>Perfil - Booka</title>
        <style>
          body{font-family:Roboto,Arial;padding:20px;background:#f7f7f7;}
          .card{max-width:520px;margin:40px auto;padding:20px;border-radius:12px;background:#fff;box-shadow:0 6px 20px rgba(0,0,0,.08);text-align:center;}
          img{width:140px;height:140px;border-radius:50%;object-fit:cover;border:4px solid #2B6AF0;margin-bottom:15px;}
          h2{color:#2B6AF0;margin-bottom:10px;}
          p{font-size:16px;margin:6px 0;color:#333;}
          .btn{background:#2B6AF0;color:#fff;border:none;padding:8px 14px;border-radius:8px;cursor:pointer;transition:.2s;font-weight:600;margin-top:10px;}
          .btn:hover{background:#2BDDE0;color:#000;}
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Mi perfil</h2>
          <img src="${u.photo || '/avatar.png'}" alt="Foto de perfil">
          <p><strong>Nombre:</strong> ${u.name || 'Sin nombre'}</p>
          <p><strong>Correo:</strong> ${u.email || ''}</p>
          <p><strong>Teléfono:</strong> ${u.phone || ''}</p>
          <button class="btn" onclick="window.close()">Cerrar</button>
        </div>
      </body>
      </html>`;
    nuevaVentana.document.open();
    nuevaVentana.document.write(contenido);
    nuevaVentana.document.close();
  }

  function openEdit() {
    const u = window.userProfile || getUser() || mockUser;
    if (nameInput) nameInput.value = u.name || "";
    if (emailInput) emailInput.value = u.email || "";
    if (phoneInput) phoneInput.value = u.phone || "";
    if (notifToggle) notifToggle.checked = !!u.notif;
    if (pwBar) {
      const barInner = pwBar.querySelector('i');
      if (barInner) { barInner.style.width = "0%"; barInner.className = ""; }
    }
    if (editModal) {
      editModal.classList.add("show");
      // ensure password section default
      const pwSection = document.getElementById("passwordSection");
      const pwFields = document.getElementById("passwordChangeFields");
      nameErr.style.display = emailErr.style.display = phoneErr.style.display = pwErr.style.display = 'none';
    editModal.classList.add("show");
    }
  }

  function closeEdit() { editModal.classList.remove("show"); }


  function convertFixer() {
    const u = window.userProfile || getUser() || mockUser;
    if (confirm(`¿Deseas convertirte en Fixer, ${u.name || 'usuario'}?`)) {
      window.location.href = "registroFixer.html";
    }
  }

  // ================== OTROS CONTROLES ==================
  function togglePasswordChange() {
    const pwSection = document.getElementById("passwordSection");
    const pwFields = document.getElementById("passwordChangeFields");
    if (pwSection) pwSection.style.display = "none";
    if (pwFields) pwFields.style.display = "flex";
  }
  function cancelPasswordChange() {
    const pwSection = document.getElementById("passwordSection");
    const pwFields = document.getElementById("passwordChangeFields");
    if (pwSection) pwSection.style.display = "block";
    if (pwFields) pwFields.style.display = "none";
    if (currentPassword) currentPassword.value = "";
    if (newPassword) newPassword.value = "";
    if (pwBar) {
      const barInner = pwBar.querySelector('i');
      if (barInner) { barInner.style.width = "0%"; barInner.className = ""; }
    }
    if (pwErr) pwErr.style.display = "none";
  }
  function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === "password") { input.type = "text"; if (btn) btn.textContent = "🙈"; }
    else { input.type = "password"; if (btn) btn.textContent = "👁"; }
  }

  // ================== EVENTOS ==================
  if (newPassword && pwBar) {
    newPassword.addEventListener('input', () => {
      const s = passwordStrength(newPassword.value);
      const percent = (s / 4) * 100;
      const barInner = pwBar.querySelector('i');
      if (barInner) { barInner.style.width = percent + '%'; barInner.className = s <= 1 ? 'strength-weak' : (s <= 2 ? 'strength-medium' : 'strength-strong'); }
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      // cerrar modal si está abierto
      if (editModal) editModal.classList.remove("show");
    }
  });


  window.addEventListener('storage', (e) => {
    if (e.key === 'booka_users' || e.key === 'booka_broadcast') { renderUI(); }
  });

  // ================== INICIALIZAR ==================
const existing = getUser();

if (existing && existing.loggedIn) {
  window.userProfile = existing;
  window.isAuthenticated = true;
} else {
  window.userProfile = mockUser;
  window.isAuthenticated = false;
}

renderUI();


  // ================== EXPONER FUNCIONES A WINDOW ==================
  
  window.login = login;
  window.logout = logout;
  window.goToProfile = goToProfile;
  window.openEdit = openEdit;
  window.convertFixer = convertFixer;
  window.saveProfile = saveProfile;
  window.savePasswordChange = savePasswordChange;
  window.togglePasswordVisibility = togglePasswordVisibility;
  window.cancelPasswordChange = cancelPasswordChange;
  window.togglePasswordChange = togglePasswordChange;
  window.closeProfileModal = () => { if (editModal) editModal.classList.remove("show"); };
  window.closeEdit = closeEdit;

}
