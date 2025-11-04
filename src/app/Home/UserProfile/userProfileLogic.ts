// /app/Home/UserProfile/userProfileLogic.ts
import { mockUser } from "@/app/Home/UserProfile/UI/mockUser";

type User = {
  loggedIn?: boolean;
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  notif?: boolean;
  password?: string;
  [k: string]: any;
};

type UsersStore = {
  sessions: Record<string, User>;
  lastUpdated?: number;
  [k: string]: any;
};

declare global {
  interface Window {
    deviceId?: string;
    userProfile?: User | null;
    isAuthenticated?: boolean;
    login?: () => void;
    logout?: () => void;
    openEdit?: () => void;
    convertFixer?: () => void;
    saveProfile?: () => void;
    savePasswordChange?: () => void;
    cancelPasswordChange?: () => void;
    togglePasswordChange?: () => void;
    togglePasswordVisibility?: (id: string, target?: any) => void;
    closeEdit?: () => void;
    closeProfileModal?: () => void;
  }
}

function injectUserProfileHTMLIfNeeded(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById("userProfileRoot")) return; // ya inyectado

  const container = document.createElement("div");
  container.id = "userProfileRoot";
  container.innerHTML = `
  <main aria-hidden="true" style="display:none">
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
            <button type="button" class="togglePw" id="toggleCurrentPwd" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);border:none;background:none;cursor:pointer">👁</button>
          </div>

          <label for="newPassword">Nueva contraseña</label>
          <div style="position:relative">
            <input type="password" id="newPassword" style="width:100%;padding-right:35px" />
            <button type="button" class="togglePw" id="toggleNewPwd" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);border:none;background:none;cursor:pointer">👁</button>
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

      <div id="profileModal" class="modal" aria-hidden="true" style="display:none">
      <h2>Mi perfil</h2>
      <img id="profileViewPhoto" src="https://i.pravatar.cc/100?u=default" alt="Foto de perfil" style="width:120px;height:120px;border-radius:50%;margin:auto;object-fit:cover;border:3px solid #2B6AF0" />
      <p><strong>Nombre:</strong> <span id="profileViewName"></span></p>
      <p><strong>Correo:</strong> <span id="profileViewEmail"></span></p>
      <p><strong>Teléfono:</strong> <span id="profileViewPhone"></span></p>
      <button class="btn" id="closeProfileViewBtn">Cerrar</button>
    </div>
  </main>
  `;
  document.body.appendChild(container);
}

export function initUserProfileLogic(): void {
  if (typeof window === "undefined") return;
  injectUserProfileHTMLIfNeeded();

 // ================== IDENTIFICADOR DE DISPOSITIVO ==================
  const deviceIdKey = "booka_device_id";
  let deviceId = localStorage.getItem(deviceIdKey);
  if (!deviceId) {
    deviceId = "dev-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(deviceIdKey, deviceId);
  }
  window.deviceId = deviceId;

  // ================== ALMACENAMIENTO LOCAL ==================
  let usersStore: UsersStore = { sessions: {}, lastUpdated: Date.now() };

function loadUsersStore(): UsersStore {
  try {
    const raw = localStorage.getItem("booka_users");
    if (!raw) return { sessions: {}, lastUpdated: Date.now() };
    return JSON.parse(raw) as UsersStore;
  } catch {
    return { sessions: {}, lastUpdated: Date.now() };
  }
}

usersStore = loadUsersStore();
if (!usersStore.sessions) usersStore.sessions = {};

const existingSession = usersStore.sessions[deviceId];
const isEmptySession = existingSession && Object.keys(existingSession).length === 0;

if (!existingSession || isEmptySession) {
  const savedUser = JSON.parse(localStorage.getItem("booka_user") || "null");
  const isMock =
    savedUser &&
    savedUser.email &&
    savedUser.email.includes("ejemplo.com");

  usersStore.sessions[deviceId] =
    savedUser && !isMock
      ? savedUser
      : { ...mockUser, loggedIn: false };

  localStorage.setItem("booka_users", JSON.stringify(usersStore));
}


  function saveUsersStore() {
  try {
    localStorage.setItem("booka_users", JSON.stringify(usersStore));
    const sessionForDevice = usersStore.sessions[deviceId!] || {};
    localStorage.setItem("booka_user", JSON.stringify(sessionForDevice));
    localStorage.setItem(
      "booka_broadcast",
      JSON.stringify({ ts: Date.now(), sender: deviceId })
    );
    setTimeout(() => localStorage.removeItem("booka_broadcast"), 50);
  } catch (err) {
    console.warn("[userProfileLogic] Error guardando en localStorage:", err);
  }
}

 function getUser(): User {
  const latest = loadUsersStore();
  return latest.sessions[deviceId!] || { loggedIn: false };
}

  function setUserForDevice(u: User) {
  const current = (JSON.parse(localStorage.getItem("booka_users") || "{}") as UsersStore) || {
    sessions: {},
    lastUpdated: Date.now(),
  };
  current.sessions = current.sessions || {};
  const previous = current.sessions[deviceId!] || {};
  const merged = { ...previous, ...u };

  current.sessions[deviceId!] = merged;
  current.lastUpdated = Date.now();
  usersStore = current;
  saveUsersStore();

  try {
    (window as any).userProfile = merged;
  } catch (err) {
    console.warn("[userProfileLogic] No se pudo asignar a window.userProfile:", err);
  }

  console.debug("[userProfileLogic] setUserForDevice -> merged and saved", {
    deviceId,
    previous,
    incoming: u,
    merged,
  });
}

  // ================== ELEMENTOS DEL DOM (seguro) ==================
  const editModal = document.getElementById("editModal") as HTMLElement | null;
  const profileModal = document.getElementById("profileModal") as HTMLElement | null;

  const nameInput = document.getElementById("nameInput") as HTMLInputElement | null;
  const emailInput = document.getElementById("emailInput") as HTMLInputElement | null;
  const phoneInput = document.getElementById("phoneInput") as HTMLInputElement | null;
  const photoInput = document.getElementById("photoInput") as HTMLInputElement | null;
  
  const photoPreviewImg = document.getElementById("photoPreviewImg") as HTMLImageElement | null;
const photoPreviewContainer = document.getElementById("photoPreviewContainer") as HTMLElement | null;

if (photoInput && photoPreviewImg && photoPreviewContainer) {
  const openFilePicker = () => photoInput.click();
  photoPreviewImg.addEventListener("click", openFilePicker);
  photoPreviewContainer.addEventListener("click", openFilePicker);

  // Mostrar la foto actual guardada del usuario
  const u = JSON.parse(localStorage.getItem("booka_user") || "null");
  if (u && u.photo) {
    photoPreviewImg.src = u.photo;
  } else {
    photoPreviewImg.src = "/avatar.png"; // avatar por defecto
  }

  // Actualizar vista previa al seleccionar nueva imagen
  photoInput.addEventListener("change", (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (photoPreviewImg) photoPreviewImg.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  });
}


  const nameErr = document.getElementById("nameErr") as HTMLElement | null;
  const emailErr = document.getElementById("emailErr") as HTMLElement | null;
  const phoneErr = document.getElementById("phoneErr") as HTMLElement | null;
  const pwErr = document.getElementById("pwErr") as HTMLElement | null;
  const pwHint = document.getElementById("pwHint") as HTMLElement | null;

  const currentPassword = document.getElementById("currentPassword") as HTMLInputElement | null;
  const newPassword = document.getElementById("newPassword") as HTMLInputElement | null;
  const pwBar = document.getElementById("pwBar") as HTMLElement | null;
  const notifToggle = document.getElementById("notifToggle") as HTMLInputElement | null;

  const saveProfileBtn = document.getElementById("saveProfileBtn") as HTMLButtonElement | null;
  const cancelEditBtn = document.getElementById("cancelEditBtn") as HTMLButtonElement | null;
  const saveNewPwBtn = document.getElementById("saveNewPwBtn") as HTMLButtonElement | null;
  const cancelNewPwBtn = document.getElementById("cancelNewPwBtn") as HTMLButtonElement | null;
  const changePasswordBtn = document.getElementById("changePasswordBtn") as HTMLButtonElement | null;
  const toggleCurrentPwd = document.getElementById("toggleCurrentPwd") as HTMLButtonElement | null;
  const toggleNewPwd = document.getElementById("toggleNewPwd") as HTMLButtonElement | null;
  const profileViewPhoto = document.getElementById("profileViewPhoto") as HTMLImageElement | null;
  const profileViewName = document.getElementById("profileViewName") as HTMLElement | null;
  const profileViewEmail = document.getElementById("profileViewEmail") as HTMLElement | null;
  const profileViewPhone = document.getElementById("profileViewPhone") as HTMLElement | null;
  const closeProfileViewBtn = document.getElementById("closeProfileViewBtn") as HTMLButtonElement | null;

  // ================== TEMPORIZADOR DE INACTIVIDAD ==================
  let inactivityTimer: number | undefined = undefined;
  function resetInactivityTimer() {
    if (inactivityTimer) window.clearTimeout(inactivityTimer);
    inactivityTimer = window.setTimeout(() => {
      const u = getUser();
      if (u && u.loggedIn) {
        alert("Tu sesión ha expirado por inactividad.");
        logout();
      }
    }, 10 * 60 * 1000);
  }
  ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach((evt) => {
    document.addEventListener(evt, resetInactivityTimer, { passive: true });
  });
  resetInactivityTimer();

  // ================== RENDER UI  ==================
  function renderUI() {
    const user = getUser();
    const profileIcon = document.getElementById("profileIcon") as HTMLImageElement | null;
    const menuPhotoEl = document.getElementById("menuPhoto") as HTMLImageElement | null;
    const menuNameEl = document.getElementById("menuName") as HTMLElement | null;
    const menuEmailEl = document.getElementById("menuEmail") as HTMLElement | null;

    if (user && user.loggedIn) {
      if (profileIcon) profileIcon.src = user.photo || "/avatar.png";
      if (menuPhotoEl) menuPhotoEl.src = user.photo || "/avatar.png";
      if (menuNameEl) menuNameEl.textContent = user.name || "Sin nombre";
      if (menuEmailEl) menuEmailEl.textContent = user.email || "";
    } else {
      if (profileIcon) profileIcon.src = "/avatar.png";
      if (menuPhotoEl) menuPhotoEl.src = "/avatar.png";
      if (menuNameEl) menuNameEl.textContent = "Invitado";
      if (menuEmailEl) menuEmailEl.textContent = "";
    }
    if (profileViewPhoto) profileViewPhoto.src = (user && user.photo) ? user.photo : "https://i.pravatar.cc/100?u=default";
    if (profileViewName) profileViewName.textContent = user?.name || "";
    if (profileViewEmail) profileViewEmail.textContent = user?.email || "";
    if (profileViewPhone) profileViewPhone.textContent = user?.phone || "";
  }

  // ================== LOGIN DEMO ==================
  function login() {
  const usersStoreRaw = localStorage.getItem("booka_users");
  const usersStore = usersStoreRaw ? JSON.parse(usersStoreRaw) : { sessions: {} };
  const deviceId = localStorage.getItem("booka_device_id");
  const existing = deviceId && usersStore.sessions ? usersStore.sessions[deviceId] : null;

  const hasRealData =
    existing &&
    (existing.name || existing.email || existing.phone || existing.photo);

  const user: User = hasRealData
    ? { ...existing, loggedIn: true }
    : { ...mockUser, loggedIn: true };

  setUserForDevice(user);
  window.userProfile = user;
  window.isAuthenticated = true;
  renderUI();
  updateMaskedPassword();

  alert(
    "Bienvenido a Servineo\n\nPara acceder a la opción \"Ayuda\", inicia sesión o crea una cuenta."
  );

  window.dispatchEvent(new CustomEvent("booka-auth-updated", { detail: user }));
  console.info("[userProfileLogic] Login completado con usuario:", user);
}

  // ================== LOGOUT ==================
  function logout() {
  const u = getUser();
  if (u) {
    const updated = { ...u, loggedIn: false };
    const storeRaw = localStorage.getItem("booka_users");
    const store = storeRaw ? JSON.parse(storeRaw) : { sessions: {} };
    const devId = localStorage.getItem("booka_device_id");
    if (devId) {
      store.sessions = store.sessions || {};
      const existing = store.sessions[devId] || {};
      store.sessions[devId] = { ...existing, ...updated, loggedIn: false };
      localStorage.setItem("booka_users", JSON.stringify(store));
    }

    localStorage.setItem("booka_user", JSON.stringify(updated));
    window.userProfile = updated;
    window.isAuthenticated = false;
    renderUI();

    window.dispatchEvent(new CustomEvent("booka-auth-updated", { detail: updated }));
    window.dispatchEvent(new Event("booka-logout"));
  }
}

  // ================== UTILIDADES ==================
  function passwordStrength(pw: string | undefined): number {
    let score = 0;
    if (!pw) return 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }
  function processImageFile(file: File, maxSize = 400): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          let w = img.width,
            h = img.height;
          const ratio = w / h;
          if (w > maxSize || h > maxSize) {
            if (ratio > 1) {
              w = maxSize;
              h = Math.round(maxSize / ratio);
            } else {
              h = maxSize;
              w = Math.round(maxSize * ratio);
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("No se pudo obtener el contexto del canvas"));
            return;
          }
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        };
        img.onerror = (err) => reject(err);
        // @ts-ignore
        img.src = (e.target as FileReader).result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
  // ================== GUARDAR / ACTUALIZAR PERFIL ==================
  async function saveProfile(): Promise<void> {
  const u = getUser();
  if (!nameInput || !emailInput || !phoneInput) {
    console.warn("Campos de edición no encontrados");
    return;
  }

  if (nameErr) nameErr.style.display = "none";
  if (emailErr) emailErr.style.display = "none";
  if (phoneErr) phoneErr.style.display = "none";

  let valid = true;
  if (!nameInput.value.trim()) {
    if (nameErr) {
      nameErr.textContent = "El nombre es obligatorio.";
      nameErr.style.display = "block";
    }
    valid = false;
  }
  if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
    if (emailErr) {
      emailErr.textContent = "Correo inválido.";
      emailErr.style.display = "block";
    }
    valid = false;
  }
  if (
    phoneInput &&
    !/^[0-9+\s()-]{6,20}$/.test(phoneInput.value) &&
    phoneInput.value.trim() !== ""
  ) {
    if (phoneErr) {
      phoneErr.textContent = "Teléfono inválido.";
      phoneErr.style.display = "block";
    }
    valid = false;
  }

  if (!valid) return;
  const updated: User = Object.assign({}, u);
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
  localStorage.setItem("booka_user", JSON.stringify(updated));

  try {
    const storeRaw = localStorage.getItem("booka_users");
    const store = storeRaw ? JSON.parse(storeRaw) : { sessions: {} };
    const devId = localStorage.getItem("booka_device_id");
    if (devId) {
      store.sessions = store.sessions || {};
      store.sessions[devId] = updated;
      store.lastUpdated = Date.now();
      localStorage.setItem("booka_users", JSON.stringify(store));
    }
  } catch (err) {
    console.error("❌ error al sincronizar usuarios:", err);
  }

  window.userProfile = updated;
  window.isAuthenticated = true;
  renderUI();

  window.dispatchEvent(new CustomEvent("booka-profile-updated", { detail: updated }));
  window.dispatchEvent(new CustomEvent("booka-auth-updated", { detail: updated }));
  localStorage.setItem(
    "booka_broadcast",
    JSON.stringify({ ts: Date.now(), sender: localStorage.getItem("booka_device_id") })
  );
  setTimeout(() => localStorage.removeItem("booka_broadcast"), 50);

  if (editModal) {
    const mainContainer = editModal.closest("main") as HTMLElement | null;
    if (mainContainer) mainContainer.style.display = "none";
    editModal.classList.remove("show");
    editModal.removeAttribute("aria-hidden");
    editModal.style.display = "none";
  }

  alert("Perfil guardado correctamente.");
}

  // ================== CAMBIO DE CONTRASEÑA ==================
  function savePasswordChange(): void {
  if (!currentPassword || !newPassword || !pwErr) return;

  const u = getUser();
  const current = currentPassword.value.trim();
  const newPw = newPassword.value.trim();

  pwErr.style.display = "none"; // ocultar errores previos

  // === Validar contraseña actual ===
  if (!current) {
    pwErr.textContent = "Debes ingresar tu contraseña actual.";
    pwErr.style.display = "block";
    return;
  }
  if (u.password) {
  if (!current) {
    pwErr.textContent = "Debes ingresar tu contraseña actual.";
    pwErr.style.display = "block";
    return;
  }
  if (current !== u.password) {
    pwErr.textContent = "Contraseña actual incorrecta.";
    pwErr.style.display = "block";
    return;
  }
}

  // === Validar nueva contraseña ===
  if (!newPw) {
    pwErr.textContent = "La nueva contraseña no puede estar vacía.";
    pwErr.style.display = "block";
    return;
  }
  
  // 🚫 No permitir reutilizar la misma contraseña actual
  if (u.password && newPw === u.password) {
    pwErr.textContent = "La nueva contraseña no puede ser igual a la actual.";
    pwErr.style.display = "block";
    return;
  }

  const s = passwordStrength(newPw);
  if (s < 4) {
    pwErr.textContent = "Contraseña muy débil. Usa mayúsculas, números y símbolos.";
    pwErr.style.display = "block";
    return;
  }

  // === Guardar contraseña nueva ===
  u.password = newPw;
  setUserForDevice(u);
  localStorage.setItem("booka_user", JSON.stringify(u));
  const masked = document.getElementById("maskedPassword") as HTMLElement | null;
  updateMaskedPassword();


  const storeRaw = localStorage.getItem("booka_users");
  const store = storeRaw ? JSON.parse(storeRaw) : { sessions: {} };
  const devId = localStorage.getItem("booka_device_id");
  if (devId) {
    store.sessions[devId] = u;
    localStorage.setItem("booka_users", JSON.stringify(store));
  }

  alert("Contraseña cambiada correctamente.");
  currentPassword.value = "";
  newPassword.value = "";

  const pwFields = document.getElementById("passwordChangeFields");
  const pwSection = document.getElementById("passwordSection");
  if (pwSection) pwSection.style.display = "block";
  if (pwFields) pwFields.style.display = "none";
  if (pwBar) {
    const barInner = pwBar.querySelector("i") as HTMLElement | null;
    if (barInner) {
      barInner.style.width = "0%";
      barInner.className = "";
    }
  }
  pwErr.style.display = "none";
}

// --- Inserta esta función cerca de renderUI ---
function updateMaskedPassword(): void {
  try {
    const masked = document.getElementById("maskedPassword") as HTMLElement | null;
    const u = getUser(); 
    if (!masked) return;

    if (u && u.password && typeof u.password === "string" && u.password.length > 0) {
      masked.textContent = "•".repeat(u.password.length);
    } else {
      masked.textContent = "•".repeat(6);
    }
  } catch (err) {
    console.warn("[userProfileLogic] updateMaskedPassword error:", err);
  }
}

   // ================== EDITAR Y CONVERTIR ==================
  function openEdit(): void {
  
  const u = (() => {
    try {
      const usersStore = JSON.parse(localStorage.getItem("booka_users") || "{}");
      const deviceId = localStorage.getItem("booka_device_id");
      if (usersStore?.sessions && deviceId && usersStore.sessions[deviceId]) {
        return usersStore.sessions[deviceId];
      }
    } catch (err) {
      console.warn("[openEdit] Error leyendo usuarios del almacenamiento:", err);
    }
    return (window.userProfile as User) || mockUser;
  })();

  if (nameInput) nameInput.value = u.name || "";
  if (emailInput) emailInput.value = u.email || "";
  if (phoneInput) phoneInput.value = u.phone || "";
  if (notifToggle) notifToggle.checked = !!u.notif;

  if (pwBar) {
    const barInner = pwBar.querySelector("i") as HTMLElement | null;
    if (barInner) {
      barInner.style.width = "0%";
      barInner.className = "";
    }
  }
  updateMaskedPassword();
  const editModal = document.getElementById("editModal") as HTMLElement | null;
  if (editModal) {
    const mainContainer = editModal.closest("main") as HTMLElement | null;
    if (mainContainer) {
      // Mostrar como overlay fijo para no alterar el flujo del documento
      mainContainer.style.display = "flex";
      mainContainer.style.position = "fixed";
      mainContainer.style.inset = "0";             // top:0; right:0; bottom:0; left:0
      mainContainer.style.width = "100%";
      mainContainer.style.height = "100vh";
      mainContainer.style.justifyContent = "center";
      mainContainer.style.alignItems = "center";
      mainContainer.style.background = "rgba(0,0,0,0.35)"; // overlay suave
      mainContainer.style.zIndex = "300";         // por encima del footer
      mainContainer.style.overflow = "auto";

      // Si tu CSS global aplica padding-top:92px a main, anularlo cuando modal abierto:
      mainContainer.style.paddingTop = "0";
    }

    // Mostrar el modal (el modal ya es position: fixed en CSS)
    editModal.classList.add("show");
    editModal.setAttribute("aria-hidden", "false");
    editModal.style.display = "flex";
    // Centrar en viewport
    try { editModal.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {}
  } else {
    console.error("[userProfileLogic] No se encontró el #editModal en el DOM.");
  }

  // esconder mensajes de error previos
  if (nameErr) nameErr.style.display = "none";
  if (emailErr) emailErr.style.display = "none";
  if (phoneErr) phoneErr.style.display = "none";
  if (pwErr) pwErr.style.display = "none";

}

function closeEdit(): void {
  const root = document.getElementById("userProfileRoot") as HTMLElement | null;
  const mainContainer = root?.querySelector("main") as HTMLElement | null;
  const editModal = document.getElementById("editModal") as HTMLElement | null;

  if (mainContainer) {
    // Revertir los cambios hechos al main
    mainContainer.style.display = "none";
    mainContainer.style.position = "";
    mainContainer.style.inset = "";
    mainContainer.style.width = "";
    mainContainer.style.height = "";
    mainContainer.style.justifyContent = "";
    mainContainer.style.alignItems = "";
    mainContainer.style.background = "";
    mainContainer.style.zIndex = "";
    mainContainer.style.overflow = "";
    mainContainer.style.paddingTop = ""; // vuelve al estilo del sitio
  }

  if (editModal) {
    editModal.classList.remove("show");
    editModal.removeAttribute("aria-hidden");
    editModal.style.display = "none";
  }

}
  function convertFixer(): void {
    const u = (window.userProfile as User) || getUser() || mockUser;
    if (confirm(`¿Deseas convertirte en Fixer, ${u.name || "usuario"}?`)) {
      window.location.href = "registroFixer.html";
    }
  }
  // ================== OTROS CONTROLES ==================
  function togglePasswordChange(): void {
    const pwSection = document.getElementById("passwordSection");
    const pwFields = document.getElementById("passwordChangeFields");
    if (pwSection) (pwSection as HTMLElement).style.display = "none";
    if (pwFields) (pwFields as HTMLElement).style.display = "flex";
  }
  function cancelPasswordChange(): void {
    const pwSection = document.getElementById("passwordSection");
    const pwFields = document.getElementById("passwordChangeFields");
    if (pwSection) (pwSection as HTMLElement).style.display = "block";
    if (pwFields) (pwFields as HTMLElement).style.display = "none";
    if (currentPassword) currentPassword.value = "";
    if (newPassword) newPassword.value = "";
    if (pwBar) {
      const barInner = pwBar.querySelector("i") as HTMLElement | null;
      if (barInner) {
        barInner.style.width = "0%";
        barInner.className = "";
      }
    }
    if (pwErr) pwErr.style.display = "none";
  }
  function togglePasswordVisibility(inputId: string, btn?: any): void {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      if (btn) btn.textContent = "🙈";
    } else {
      input.type = "password";
      if (btn) btn.textContent = "👁";
    }
  }
  // ================== EVENTOS ==================
  if (newPassword && pwBar && pwErr) {
  newPassword.addEventListener("input", () => {
    const value = newPassword.value;
    const s = passwordStrength(value);
    const percent = (s / 4) * 100;
    const barInner = pwBar.querySelector("i") as HTMLElement | null;

    if (barInner) {
      barInner.style.width = percent + "%";
      barInner.className =
        s <= 1 ? "strength-weak" : s <= 2 ? "strength-medium" : "strength-strong";
    }

     if (value.trim() === "") {
      pwErr.style.display = "none";
      if (pwHint) pwHint.style.color = "#666";
    } else if (s < 4) {
      pwErr.textContent = "Contraseña muy débil. Usa mayúsculas, números y símbolos.";
      pwErr.style.display = "block";
      if (pwHint) pwHint.style.color = "red";
    } else {
      pwErr.style.display = "none";
      if (pwHint) pwHint.style.color = "green";
    }
  });
}
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeEdit();
  });

    window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === "booka_users" || e.key === "booka_broadcast" || e.key === "booka_user") {
      renderUI();
    }
  });
  // ================== INICIALIZAR ==================
  const session = usersStore.sessions[deviceId!] || null;
  window.userProfile = session; 
  window.isAuthenticated = !!(session && session.loggedIn);
  renderUI();
  updateMaskedPassword();
  // ================== LISTENERS DE BOTONES ==================
  if (saveProfileBtn) saveProfileBtn.addEventListener("click", saveProfile);
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", closeEdit);
  if (saveNewPwBtn) saveNewPwBtn.addEventListener("click", savePasswordChange);
  if (cancelNewPwBtn) cancelNewPwBtn.addEventListener("click", cancelPasswordChange);
  if (changePasswordBtn) changePasswordBtn.addEventListener("click", togglePasswordChange);
  if (toggleCurrentPwd)
    toggleCurrentPwd.addEventListener("click", (e) =>
      togglePasswordVisibility("currentPassword", e.currentTarget)
    );
  if (toggleNewPwd)
    toggleNewPwd.addEventListener("click", (e) =>
      togglePasswordVisibility("newPassword", e.currentTarget)
    );
  if (closeProfileViewBtn)
    closeProfileViewBtn.addEventListener("click", () => {
      if (profileModal) {
        profileModal.style.display = "none";
        profileModal.setAttribute("aria-hidden", "true");
      }
    });
  // ================== EVENTO DE PERFIL ACTUALIZADO ==================
  const handleProfileUpdated = (e: Event) => {
    try {
      const updated = (e as CustomEvent).detail;
      if (updated) {
        setUserForDevice(updated);
        window.userProfile = updated;
        renderUI();
      } else {
        renderUI();
      }
    } catch (err) {
      console.warn("Error procesando booka-profile-updated", err);
    }
  };

  window.addEventListener("booka-profile-updated", handleProfileUpdated);

  // ================== EXPONER FUNCIONES A WINDOW ==================
  window.closeEdit = closeEdit;
  window.login = login;
  window.logout = logout;
  window.openEdit = openEdit;
  window.convertFixer = convertFixer;
  window.saveProfile = saveProfile;
  window.savePasswordChange = savePasswordChange;
  window.togglePasswordVisibility = togglePasswordVisibility;
  window.cancelPasswordChange = cancelPasswordChange;
  window.togglePasswordChange = togglePasswordChange;
  window.closeProfileModal = closeEdit;
}
