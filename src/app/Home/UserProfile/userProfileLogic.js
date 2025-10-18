import { mockUser } from "@/app/UI/mockUser";
export function initUserProfileLogic() {
  // 🚫 Evitar ejecución en el servidor (Next.js)
  if (typeof window === "undefined") return;

  const deviceIdKey = 'booka_device_id';
  let deviceId;

  // ================== IDENTIFICADOR DE DISPOSITIVO ==================
  deviceId = sessionStorage.getItem(deviceIdKey);
  if (!deviceId) {
    deviceId = 'dev-' + Math.random().toString(36).slice(2, 10);
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

  // ================== ELEMENTOS DEL DOM ==================
  const authButtons = document.getElementById("authButtons");
  const profileIcon = document.getElementById("profileIcon");
  const profileMenu = document.getElementById("profileMenu");
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

  // ================== RENDER UI ==================
  function renderUI() {
    const user = getUser();
    if (user.loggedIn) {
      authButtons.style.display = "none";
      profileIcon.style.display = "block";
      profileIcon.src = user.photo || "/avatar.png";
      menuPhoto.src = user.photo || "/avatar.png";
      menuName.textContent = user.name || "Sin nombre";
      menuEmail.textContent = user.email || "";
      profileIcon.setAttribute('aria-expanded', profileMenu.classList.contains('show'));
    } else {
      authButtons.style.display = "flex";
      profileIcon.style.display = "none";
      closeMenu();
    }
  }

  // ================== LOGIN DEMO ==================

function login() {
  setUserForDevice(mockUser);
  renderUI();
}


  // ================== LOGOUT ==================
  function logout() {
    const u = getUser();
    if (u && u.loggedIn) {
      usersStore = JSON.parse(localStorage.getItem('booka_users')) || { sessions: {}, lastUpdated: Date.now() };
      delete usersStore.sessions[deviceId];
      usersStore.sessions[deviceId] = { loggedIn: false };
      usersStore.lastUpdated = Date.now();
      localStorage.setItem('booka_users', JSON.stringify(usersStore));
      localStorage.setItem('booka_broadcast', JSON.stringify({ ts: Date.now(), sender: deviceId, action: 'logout', device: deviceId }));
      setTimeout(() => localStorage.removeItem('booka_broadcast'), 50);
      renderUI();
    }
  }

  // ================== MENÚ PERFIL ==================
  function toggleMenu(e) {
    e.stopPropagation();
    profileMenu.classList.toggle("show");
    profileMenu.setAttribute('aria-hidden', profileMenu.classList.contains('show') ? 'false' : 'true');
    profileIcon.setAttribute('aria-expanded', profileMenu.classList.contains('show'));
  }
  function closeMenu() {
    profileMenu.classList.remove("show");
    profileMenu.setAttribute('aria-hidden', 'true');
    profileIcon.setAttribute('aria-expanded', 'false');
  }
  document.addEventListener("click", e => {
    if (!profileMenu.contains(e.target) && e.target !== profileIcon) closeMenu();
  });

  // ================== EDITAR PERFIL ==================
  function openEdit() {
    const u = getUser();
    nameInput.value = u.name || "";
    emailInput.value = u.email || "";
    phoneInput.value = u.phone || "";
    notifToggle.checked = !!u.notif;
    const barInner = pwBar.querySelector('i');
    if (barInner) { barInner.style.width = "0%"; barInner.className = ""; }
    document.getElementById("passwordSection").style.display = "block";
    document.getElementById("passwordChangeFields").style.display = "none";
    nameErr.style.display = emailErr.style.display = phoneErr.style.display = pwErr.style.display = 'none';
    editModal.classList.add("show");
    closeMenu();
  }
  function closeEdit() { editModal.classList.remove("show"); }

  // ================== CAMBIO DE CONTRASEÑA ==================
  function togglePasswordChange() {
    document.getElementById("passwordSection").style.display = "none";
    document.getElementById("passwordChangeFields").style.display = "flex";
  }
  function cancelPasswordChange() {
    document.getElementById("passwordSection").style.display = "block";
    document.getElementById("passwordChangeFields").style.display = "none";
    currentPassword.value = "";
    newPassword.value = "";
    const barInner = pwBar.querySelector('i');
    if (barInner) { barInner.style.width = "0%"; barInner.className = ""; }
    pwErr.style.display = 'none';
  }

  function passwordStrength(pw) {
    let score = 0;
    if (!pw) return 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === "password") { input.type = "text"; btn.textContent = "🙈"; }
    else { input.type = "password"; btn.textContent = "👁"; }
  }

  function savePasswordChange() {
    const u = getUser();
    const current = currentPassword.value.trim();
    const newPw = newPassword.value.trim();
    pwErr.style.display = "none";
    if (!current || current !== u.password) {
      pwErr.textContent = "Contraseña actual incorrecta.";
      pwErr.style.display = "block";
      return;
    }
    const s = passwordStrength(newPw);
    if (s < 2) {
      pwErr.textContent = "Contraseña demasiado débil. Usa mayúsculas, números o símbolos.";
      pwErr.style.display = "block";
      return;
    }
    u.password = newPw;
    setUserForDevice(u);
    alert("Contraseña cambiada correctamente.");
    cancelPasswordChange();
    editModal.classList.remove("show");
  }

  // ================== VER PERFIL ==================
  function goToProfile() {
    const u = getUser();
    if (!u || !u.loggedIn) { alert("Primero inicia sesión para ver tu perfil."); return; }

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
    closeMenu();
  }

  // ================== CONVERTIR EN FIXER ==================
  function convertFixer() {
    if (confirm("¿Deseas convertirte en Fixer?")) {
      window.location.href = "registroFixer.html";
    }
  }

  // ================== VALIDACIONES ==================
  function validateEmail(v) { return /\S+@\S+\.\S+/.test(v); }
  function validatePhone(v) { return !v || /^[0-9+\s()-]{6,20}$/.test(v); }

  // ================== PROCESADO DE IMAGEN ==================
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
        img.src = e.target.result;
      };
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // ================== GUARDAR PERFIL ==================
  async function saveProfile() {
    let valid = true;
    nameErr.style.display = emailErr.style.display = phoneErr.style.display = pwErr.style.display = 'none';
    const u = getUser();

    if (!nameInput.value.trim()) { nameErr.textContent = "El nombre es obligatorio."; nameErr.style.display = 'block'; valid = false; }
    if (!validateEmail(emailInput.value)) { emailErr.textContent = "Correo inválido."; emailErr.style.display = 'block'; valid = false; }
    if (!validatePhone(phoneInput.value)) { phoneErr.textContent = "Teléfono inválido."; phoneErr.style.display = 'block'; valid = false; }

    if (document.getElementById("passwordChangeFields").style.display !== "none" && newPassword.value) {
      if (!currentPassword.value || currentPassword.value !== u.password) {
        pwErr.textContent = "Contraseña actual incorrecta."; pwErr.style.display = 'block'; valid = false;
      } else {
        const s = passwordStrength(newPassword.value);
        if (s < 2) { pwErr.textContent = "Contraseña demasiado débil."; pwErr.style.display = 'block'; valid = false; }
        else u.password = newPassword.value;
      }
    }

    if (!valid) return;

    const updated = Object.assign({}, u);
    updated.name = nameInput.value.trim();
    updated.email = emailInput.value.trim();
    updated.phone = phoneInput.value.trim();
    updated.notif = notifToggle.checked;

    const file = photoInput.files[0];
    if (file) {
      try {
        const dataUrl = await processImageFile(file, 400);
        updated.photo = dataUrl;
      } catch (err) {
        console.error(err);
        alert("No se pudo procesar la imagen.");
        return;
      }
    }

    setUserForDevice(updated);
    renderUI();
    editModal.classList.remove("show");
    alert("Perfil guardado correctamente.");
  }

  // ================== SINCRONIZACIÓN ENTRE PESTAÑAS ==================
  window.addEventListener('storage', (e) => {
    if (e.key === 'booka_users' || e.key === 'booka_broadcast') { renderUI(); }
  });

  // ================== INICIALIZAR ==================
  renderUI();
  if (newPassword) {
    newPassword.addEventListener('input', () => {
      const s = passwordStrength(newPassword.value);
      const percent = (s / 4) * 100;
      const barInner = pwBar.querySelector('i');
      if (barInner) { barInner.style.width = percent + '%'; barInner.className = s <= 1 ? 'strength-weak' : (s <= 2 ? 'strength-medium' : 'strength-strong'); }
    });
  }

  // ================== ACCESIBILIDAD ==================
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeEdit(); closeMenu(); } });
  document.querySelectorAll('.menu-item').forEach(mi => { mi.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mi.click(); } }); });

  // ================== EXPONER FUNCIONES A WINDOW ==================
  window.login = login;
  window.logout = logout;
  window.toggleMenu = toggleMenu;
  window.closeMenu = closeMenu;
  window.openEdit = openEdit;
  window.closeEdit = closeEdit;
  window.saveProfile = saveProfile;
  window.goToProfile = goToProfile;
  window.convertFixer = convertFixer;
  window.togglePasswordChange = togglePasswordChange;
  window.cancelPasswordChange = cancelPasswordChange;
  window.savePasswordChange = savePasswordChange;
  window.togglePasswordVisibility = togglePasswordVisibility;
  window.closeProfileModal = closeEdit;
}


