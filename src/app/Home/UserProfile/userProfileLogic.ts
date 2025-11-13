// /app/Home/UserProfile/userProfileLogic.ts
import { EDIT } from "./components/Edit";
import { PROFILE_MAIN_WRAPPER_START, PROFILE, PROFILE_MAIN_WRAPPER_END } from "./components/Profile";
import { CROP} from "./components/Crop";
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
  if (document.getElementById("userProfileRoot")) return;

  const container = document.createElement("div");
  container.id = "userProfileRoot";
  container.innerHTML = PROFILE_MAIN_WRAPPER_START + "\n" + EDIT + "\n" + PROFILE + "\n" + PROFILE_MAIN_WRAPPER_END;
  document.body.appendChild(container);
  if (!document.getElementById("cropModal")) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = CROP;
    document.body.appendChild(wrapper.firstElementChild as HTMLElement);
  }
}

export function initUserProfileLogic(): void {
  if (typeof window === "undefined") return;
  injectUserProfileHTMLIfNeeded();

  // -------------------- device id --------------------
  const deviceIdKey = "booka_device_id";
  let deviceId = localStorage.getItem(deviceIdKey);
  if (!deviceId) {
    deviceId = "dev-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(deviceIdKey, deviceId);
  }
  window.deviceId = deviceId;

  // -------------------- users store helpers --------------------
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

  // Inicializar usersStore y sesión si no existe
  usersStore = loadUsersStore();
  if (!usersStore.sessions) usersStore.sessions = {};

  const existingSession = usersStore.sessions[deviceId];
  const isEmptySession = existingSession && Object.keys(existingSession).length === 0;

  if (!existingSession || isEmptySession) {
    const savedUser = JSON.parse(localStorage.getItem("booka_user") || "null");
    const isMock =
      savedUser && savedUser.email && savedUser.email.includes("ejemplo.com");

    usersStore.sessions[deviceId] =
      savedUser && !isMock
        ? savedUser
        : { ...mockUser, loggedIn: false };

    saveUsersStore();
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

  // -------------------- referencias DOM (seguras) --------------------
  const editModal = document.getElementById("editModal") as HTMLElement | null;
  const profileModal = document.getElementById("profileModal") as HTMLElement | null;

  const nameInput = document.getElementById("nameInput") as HTMLInputElement | null;
  const emailInput = document.getElementById("emailInput") as HTMLInputElement | null;
  const phoneInput = document.getElementById("phoneInput") as HTMLInputElement | null;
  const photoInput = document.getElementById("photoInput") as HTMLInputElement | null;

  const photoPreviewImg = document.getElementById("photoPreviewImg") as HTMLImageElement | null;
  const photoPreviewContainer = document.getElementById("photoPreviewContainer") as HTMLElement | null;

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

  // -------------------- inactivity timer --------------------
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

  // -------------------- RENDER UI --------------------
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
  // -------------------- login / logout --------------------
  function login() {
    const usersStoreRaw = localStorage.getItem("booka_users");
    const storeObj = usersStoreRaw ? JSON.parse(usersStoreRaw) : { sessions: {} };
    const devId = localStorage.getItem("booka_device_id");
    const existing = devId && storeObj.sessions ? storeObj.sessions[devId] : null;

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

        // Aseguramos que el menú no quede con display:none inline tras re-login
    const profileMenu = document.getElementById("profileMenu");
    if (profileMenu) {
      profileMenu.setAttribute("aria-hidden", "true");
      profileMenu.style.display = ""; // limpiar cualquier inline style previo
    }


    alert(
      "Bienvenido a Servineo\n\nPara acceder a la opción \"Ayuda\", inicia sesión o crea una cuenta."
    );

    window.dispatchEvent(new CustomEvent("booka-auth-updated", { detail: user }));
    console.info("[userProfileLogic] Login completado con usuario:", user);
  }

  function logout() {
    const u = getUser();
    if (!u) return;

    const updated = { ...u, loggedIn: false };
    try {
      const storeRaw = localStorage.getItem("booka_users");
      const store = storeRaw ? JSON.parse(storeRaw) : { sessions: {} };
      const devId = localStorage.getItem("booka_device_id");
      if (devId) {
        store.sessions = store.sessions || {};
        const existing = store.sessions[devId] || {};
        store.sessions[devId] = { ...existing, ...updated, loggedIn: false };
        localStorage.setItem("booka_users", JSON.stringify(store));
      }
    } catch (err) {
      console.warn("[logout] error sincronizando store:", err);
    }

    localStorage.setItem("booka_user", JSON.stringify(updated));
    window.userProfile = updated;
    window.isAuthenticated = false;
 try { (window as any).closeMenu?.(); } catch {}
 const profileMenu = document.getElementById("profileMenu");
 if (profileMenu) {
   profileMenu.classList.remove("show");
   profileMenu.setAttribute("aria-hidden", "true");
   profileMenu.style.display = "";
 }
    renderUI();
    window.dispatchEvent(new CustomEvent("booka-auth-updated", { detail: updated }));
    window.dispatchEvent(new Event("booka-logout"));
  }
  // -------------------- utilidades --------------------
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
          let w = img.width, h = img.height;
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

  // -------------------- estado imagen / crop placeholders --------------------
  let isCropping = false;
  let _pendingCroppedDataUrl: string | null = null;
  let _originalPhotoBeforeEdit: string | null = null;
let _cropImage = new Image();
let _cropScale = 1;
let _cropOffset = { x: 0, y: 0 };
let _isDragging = false;
let _minScale = 1;

let _lastPointer = { x: 0, y: 0 };
const _naturalSize = { w: 0, h: 0 };
// soporte multi-touch para pinch-to-zoom
const _touches: Map<number, { x: number; y: number }> = new Map();
let _initialPinchDist = 0;
let _initialScale = 1;

// --- abrir crop modal con file ---
function openCropModal(file: File) {
  try { (window as any).closeMenu?.(); } catch {}
  try { closeEdit(); } catch {}

  _pendingCroppedDataUrl = null;
  _cropScale = 1;
  _cropOffset = { x: 0, y: 0 };

  const cropModal = document.getElementById("cropModal") as HTMLElement | null;
  const cropCanvas = document.getElementById("cropCanvas") as HTMLCanvasElement | null;
  const zoomRange = document.getElementById("zoomRange") as HTMLInputElement | null;

  if (!cropModal || !cropCanvas) return;

  // Mostrar/ocultar slider según dispositivo
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (zoomRange) zoomRange.style.display = isTouchDevice || window.innerWidth < 768 ? "none" : "block";

  cropModal.style.display = "flex";
  cropModal.setAttribute("aria-hidden", "false");

  const reader = new FileReader();
  reader.onload = (ev) => {
    _cropImage = new Image();
    _cropImage.onload = () => {
      _naturalSize.w = _cropImage.naturalWidth;
      _naturalSize.h = _cropImage.naturalHeight;
      const canvasSize = Math.min(420, Math.max(280, Math.min(window.innerWidth * 0.9, 420)));
      cropCanvas.width = canvasSize;
      cropCanvas.height = canvasSize;

      const fitScale = Math.max(canvasSize / _naturalSize.w, canvasSize / _naturalSize.h);
      _minScale = fitScale; 
      _cropScale = fitScale;
      _cropOffset = { x: 0, y: 0 };
      drawCropCanvas();

      if (zoomRange) {
        const minScale = Math.min(1, fitScale * 1.0);
        const maxScale = Math.max(3, fitScale * 1.5);
        zoomRange.min = minScale.toFixed(2);
        zoomRange.max = maxScale.toFixed(2);
        zoomRange.step = "0.01";
        zoomRange.value = fitScale.toFixed(2);
        zoomRange.oninput = () => {
          _cropScale = parseFloat(zoomRange.value);
          drawCropCanvas();
        };
      }
    };
    _cropImage.src = ev.target?.result as string;
  };
  reader.readAsDataURL(file);

  // pointer handlers
const onPointerDown = (ev: PointerEvent) => {
  _isDragging = true;
  _lastPointer = { x: ev.clientX, y: ev.clientY };

  // registrar toque
  _touches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });

  // si hay dos dedos, iniciar pinch
  if (_touches.size === 2) {
    const t = Array.from(_touches.values());
    const dx = t[0].x - t[1].x;
    const dy = t[0].y - t[1].y;
    _initialPinchDist = Math.sqrt(dx * dx + dy * dy);
    _initialScale = _cropScale;
  }

  try { (ev.target as Element).setPointerCapture?.((ev as any).pointerId); } catch {}
};

  const onPointerMove = (ev: PointerEvent) => {
  if (!_isDragging) return;

  // actualizar el toque actual
  if (_touches.has(ev.pointerId)) {
    _touches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
  }

  if (_touches.size === 2) {
    const t = Array.from(_touches.values());
    const dx = t[0].x - t[1].x;
    const dy = t[0].y - t[1].y;

    const newDist = Math.sqrt(dx * dx + dy * dy);
    if (_initialPinchDist > 0) {
      const scaleFactor = newDist / _initialPinchDist;
      _cropScale = Math.min(3, Math.max(_minScale, _initialScale * scaleFactor));
      drawCropCanvas();
    }

    return; // <- no mover si estamos haciendo pinch
  }

  // ✅ Si solo hay un dedo → mover imagen normal
  const dx = ev.clientX - _lastPointer.x;
  const dy = ev.clientY - _lastPointer.y;
  _cropOffset.x += dx / _cropScale;
  _cropOffset.y += dy / _cropScale;
  _lastPointer = { x: ev.clientX, y: ev.clientY };

  const viewW = cropCanvas.width;
  const viewH = cropCanvas.height;
  const drawW = _naturalSize.w * _cropScale;
  const drawH = _naturalSize.h * _cropScale;
  const maxX = (drawW - viewW) / 2 / _cropScale;
  const maxY = (drawH - viewH) / 2 / _cropScale;
  _cropOffset.x = Math.max(-maxX, Math.min(maxX, _cropOffset.x));
  _cropOffset.y = Math.max(-maxY, Math.min(maxY, _cropOffset.y));

  drawCropCanvas();
};
const onPointerUp = (ev: PointerEvent) => {
  _isDragging = false;

  _touches.delete(ev.pointerId);

  if (_touches.size < 2) {
    _initialPinchDist = 0;
  }

  try { (ev.target as Element).releasePointerCapture?.((ev as any).pointerId); } catch {}
};
  cropCanvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  const zoomInBtn = document.getElementById("zoomInBtn") as HTMLButtonElement | null;
  const zoomOutBtn = document.getElementById("zoomOutBtn") as HTMLButtonElement | null;
  if (zoomInBtn) zoomInBtn.onclick = () => { _cropScale = Math.min(3, _cropScale + 0.05); if (zoomRange) zoomRange.value = String(_cropScale.toFixed(2)); drawCropCanvas(); };
  if (zoomOutBtn) zoomOutBtn.onclick = () => { _cropScale = Math.max(0.6, _cropScale - 0.05); if (zoomRange) zoomRange.value = String(_cropScale.toFixed(2)); drawCropCanvas(); };
  const saveBtn = document.getElementById("saveCropBtn") as HTMLButtonElement | null;
  const cancelBtn = document.getElementById("cancelCropBtn") as HTMLButtonElement | null;

  if (saveBtn) saveBtn.onclick = () => {
    try {
      const dataUrl = exportCroppedCircle(cropCanvas);
      _pendingCroppedDataUrl = dataUrl;
      if (photoPreviewImg) photoPreviewImg.src = dataUrl;
      closeCropModal(true);
    } catch (err) {
      console.error("Error guardando recorte:", err);
      alert("Error al guardar el recorte.");
    }
  };

  if (cancelBtn) cancelBtn.onclick = () => {
    isCropping = true;
    _pendingCroppedDataUrl = null;
    const current = getUser();
    if (photoPreviewImg) photoPreviewImg.src = (current && current.photo) ? current.photo : "/avatar.png";
    closeCropModal();
  };

  function drawCropCanvas() {
    const ctx = cropCanvas.getContext("2d");
    if (!ctx) return;
    const w = cropCanvas.width;
    const h = cropCanvas.height;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.restore();
    const drawW = _naturalSize.w * _cropScale;
    const drawH = _naturalSize.h * _cropScale;
    const dx = -_cropOffset.x * _cropScale + (w - drawW) / 2;
    const dy = -_cropOffset.y * _cropScale + (h - drawH) / 2;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(_cropImage, dx, dy, drawW, drawH);
  }

  function exportCroppedCircle(canvasEl: HTMLCanvasElement) {
    const size = Math.min(canvasEl.width, canvasEl.height);
    const tmp = document.createElement("canvas");
    tmp.width = size;
    tmp.height = size;
    const tctx = tmp.getContext("2d");
    if (!tctx) throw new Error("No canvas context");
    tctx.drawImage(canvasEl, 0, 0, size, size);
    const out = document.createElement("canvas");
    out.width = size;
    out.height = size;
    const outCtx = out.getContext("2d");
    if (!outCtx) throw new Error("No out context");
    outCtx.clearRect(0, 0, size, size);
    outCtx.beginPath();
    outCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    outCtx.closePath();
    outCtx.clip();
    outCtx.drawImage(tmp, 0, 0);
    return out.toDataURL("image/png");
  }

  function closeCropModal(saved = false) {
    const cropModal = document.getElementById("cropModal") as HTMLElement | null;
    const cropCanvas = document.getElementById("cropCanvas") as HTMLCanvasElement | null;
    if (!cropModal || !cropCanvas) return;

    cropModal.style.display = "none";
    cropModal.setAttribute("aria-hidden", "true");

    cropCanvas.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);

    isCropping = false;

    try { openEdit(); } catch (err) { console.warn("No se pudo reabrir el modal de editar:", err); }
  }
}


  // --- saveProfile: validación y guardado ---
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
    if (nameErr) { nameErr.textContent = "El nombre es obligatorio."; nameErr.style.display = "block"; }
    valid = false;
  }

// --- Validación avanzada de correo electrónico ---
const email = emailInput.value.trim();
const emailPattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,63})@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/;
if (!emailPattern.test(email)) {
  if (emailErr) {
    emailErr.textContent = "correo inválido.";
    emailErr.style.display = "block";
  }
  valid = false;
} else {
  const domain = email.split("@")[1].toLowerCase();
  const [provider, ...rest] = domain.split(".");
  const tld = rest.join(".");
  const strictDomains: Record<string, string[]> = {
    gmail: ["com"],
    outlook: ["com", "es"],
    hotmail: ["com", "es"],
    yahoo: ["com", "es"],
    icloud: ["com"],
    protonmail: ["com"],
  };

  const similarToKnown = Object.keys(strictDomains).find(d =>
    provider.length >= 3 &&
    (
      provider.includes(d.slice(0, 3)) ||
      d.includes(provider) ||
      Math.abs(provider.length - d.length) <= 1
    )
  );

  if (similarToKnown && !strictDomains[provider]) {
    if (emailErr) {
      emailErr.textContent = `correo inválido.`;
      emailErr.style.display = "block";
    }
    valid = false;
    return;
  }

  if (strictDomains[provider]) {
    const validEndings = strictDomains[provider];
    const validMatch = validEndings.some(end => tld === end);

    if (!validMatch) {
      if (emailErr) {
        emailErr.textContent = "correo inválido.";
        emailErr.style.display = "block";
      }
      valid = false;
      return;
    }
  }
  if (domain.includes(".edu.com")) {
    if (emailErr) {
      emailErr.textContent = "correo inválido.";
      emailErr.style.display = "block";
    }
    valid = false;
    return;
  }
  if (domain.includes("..") || domain.endsWith(".")) {
    if (emailErr) {
      emailErr.textContent = "correo inválido.";
      emailErr.style.display = "block";
    }
    valid = false;
    return;
  }
}

  if (phoneInput && !/^[0-9+\s()-]{6,20}$/.test(phoneInput.value) && phoneInput.value.trim() !== "") {
    if (phoneErr) { phoneErr.textContent = "Teléfono inválido."; phoneErr.style.display = "block"; }
    valid = false;
  }

  if (!valid) return;
  const updated: User = Object.assign({}, u);
  updated.name = nameInput.value.trim();
  updated.email = emailInput.value.trim();
  updated.phone = phoneInput.value.trim();
  updated.notif = !!(notifToggle && notifToggle.checked);
  const file = photoInput && photoInput.files && photoInput.files[0];

  if (_pendingCroppedDataUrl) {
    updated.photo = _pendingCroppedDataUrl;
    _pendingCroppedDataUrl = null;
  } else if (file) {
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

  // --- password change ---
 function savePasswordChange(): void {
  if (!currentPassword || !newPassword || !pwErr) return;

  const u = getUser();
  const current = currentPassword.value.trim();
  const newPw = newPassword.value.trim();

  pwErr.style.display = "none";

  if (!current) {
    pwErr.textContent = "Debes ingresar tu contraseña actual.";
    pwErr.style.display = "block";
    return;
  }

  if (u.password && current !== u.password) {
    pwErr.textContent = "Contraseña actual incorrecta.";
    pwErr.style.display = "block";
    return;
  }

  if (!newPw) {
    pwErr.textContent = "La nueva contraseña no puede estar vacía.";
    pwErr.style.display = "block";
    return;
  }

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

  u.password = newPw;
  setUserForDevice(u);
  localStorage.setItem("booka_user", JSON.stringify(u));
  updateMaskedPassword();

  try {
    const storeRaw = localStorage.getItem("booka_users");
    const store = storeRaw ? JSON.parse(storeRaw) : { sessions: {} };
    const devId = localStorage.getItem("booka_device_id");
    if (devId) {
      store.sessions[devId] = u;
      localStorage.setItem("booka_users", JSON.stringify(store));
    }
  } catch (err) {
    console.warn("[savePasswordChange] error sincronizando:", err);
  }

  alert("Contraseña cambiada correctamente.\n\nTu sesión se cerrará por seguridad.");

  if (currentPassword) currentPassword.value = "";
  if (newPassword) newPassword.value = "";

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
  if (pwErr) pwErr.style.display = "none";

  logout();
  setTimeout(() => {
    window.location.href = "/";
  }, 400);
}

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
  // --- open / close edit modal ---
  function openEdit(): void {
    const u = (() => {
      try {
        const usersStore = JSON.parse(localStorage.getItem("booka_users") || "{}");
        const dId = localStorage.getItem("booka_device_id");
        if (usersStore?.sessions && dId && usersStore.sessions[dId]) {
          return usersStore.sessions[dId];
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

    _originalPhotoBeforeEdit = u.photo || "/avatar.png";

    if (pwBar) {
      const barInner = pwBar.querySelector("i") as HTMLElement | null;
      if (barInner) { barInner.style.width = "0%"; barInner.className = ""; }
    }
    updateMaskedPassword();

    if (editModal) {
      const mainContainer = editModal.closest("main") as HTMLElement | null;
      if (mainContainer) {
        mainContainer.style.display = "flex";
        mainContainer.style.position = "fixed";
        mainContainer.style.inset = "0";
        mainContainer.style.width = "100%";
        mainContainer.style.height = "100vh";
        mainContainer.style.justifyContent = "center";
        mainContainer.style.alignItems = "center";
        mainContainer.style.background = "rgba(0,0,0,0.35)";
        mainContainer.style.zIndex = "300";
        mainContainer.style.overflow = "auto";
        mainContainer.style.paddingTop = "0";
      }

      editModal.classList.add("show");
      editModal.setAttribute("aria-hidden", "false");
      editModal.style.display = "flex";
      try { editModal.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {}
    } else {
      console.error("[userProfileLogic] No se encontró el #editModal en el DOM.");
    }

    if (nameErr) nameErr.style.display = "none";
    if (emailErr) emailErr.style.display = "none";
    if (phoneErr) phoneErr.style.display = "none";
    if (pwErr) pwErr.style.display = "none";
  }
  
  function closeEdit(): void {
    const root = document.getElementById("userProfileRoot") as HTMLElement | null;
    const mainContainer = root?.querySelector("main") as HTMLElement | null;
    const editModalEl = document.getElementById("editModal") as HTMLElement | null;
    resetPasswordChangeUI();
    if (photoPreviewImg && _originalPhotoBeforeEdit) {
      photoPreviewImg.src = _originalPhotoBeforeEdit;
    }

    if (mainContainer) {
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
      mainContainer.style.paddingTop = "";
    }

    if (editModalEl) {
      editModalEl.classList.remove("show");
      editModalEl.removeAttribute("aria-hidden");
      editModalEl.style.display = "none";
    }
  }

  // --- convert fixer ---
  function convertFixer(): void {
    const u = (window.userProfile as User) || getUser() || mockUser;
    if (confirm(`¿Deseas convertirte en Fixer, ${u.name || "usuario"}?`)) {
      window.location.href = "registroFixer.html";
    }
  }

  // --- toggle password UI ---
 function togglePasswordChange(): void {
  const pwSection = document.getElementById("passwordSection");
  const pwFields = document.getElementById("passwordChangeFields");
  if (pwSection) (pwSection as HTMLElement).style.display = "none";
  if (pwFields) (pwFields as HTMLElement).style.display = "flex";
}
function cancelPasswordChange(): void {
  const pwSection = document.getElementById("passwordSection");
  const pwFields = document.getElementById("passwordChangeFields");

  if (pwSection) pwSection.style.display = "block";
  if (pwFields) pwFields.style.display = "none";
  if (currentPassword) currentPassword.value = "";
  if (newPassword) newPassword.value = "";
  const inputs = [
    { id: "currentPassword", btnId: "toggleCurrentPwd" },
    { id: "newPassword", btnId: "toggleNewPwd" },
  ];

const eyeOpen = `
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" 
          stroke="currentColor" stroke-width="2" fill="none"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
  </svg>
`;


  inputs.forEach(({ id, btnId }) => {
    const input = document.getElementById(id) as HTMLInputElement | null;
    const btn = document.getElementById(btnId) as HTMLElement | null;

    if (input) input.type = "password";
    if (btn) btn.innerHTML = eyeOpen;
  });
  if (pwBar) {
    const barInner = pwBar.querySelector("i") as HTMLElement | null;
    if (barInner) { barInner.style.width = "0%"; barInner.className = ""; }
  }

  if (pwErr) pwErr.style.display = "none";
}

function resetPasswordChangeUI(): void {
  const pwSection = document.getElementById("passwordSection");
  const pwFields = document.getElementById("passwordChangeFields");
  const currentPassword = document.getElementById("currentPassword") as HTMLInputElement | null;
  const newPassword = document.getElementById("newPassword") as HTMLInputElement | null;
  const pwBar = document.getElementById("pwBar");
  const pwErr = document.getElementById("pwErr");

  // Mostrar sección normal, ocultar campos de cambio
  if (pwSection) pwSection.style.display = "block";
  if (pwFields) pwFields.style.display = "none";

  // Limpiar valores
  if (currentPassword) currentPassword.value = "";
  if (newPassword) newPassword.value = "";

  // Restaurar tipo de input y los íconos de ojos
  const eyeOpen = `
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
            stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
    </svg>
  `;

  const toggleCurrentPwd = document.getElementById("toggleCurrentPwd");
  const toggleNewPwd = document.getElementById("toggleNewPwd");
  if (toggleCurrentPwd) toggleCurrentPwd.innerHTML = eyeOpen;
  if (toggleNewPwd) toggleNewPwd.innerHTML = eyeOpen;

  if (currentPassword) currentPassword.type = "password";
  if (newPassword) newPassword.type = "password";

  // Reiniciar barra de fuerza y error
  if (pwBar) {
    const barInner = pwBar.querySelector("i") as HTMLElement | null;
    if (barInner) {
      barInner.style.width = "0%";
      barInner.className = "";
    }
  }
  if (pwErr) (pwErr as HTMLElement).style.display = "none";
}


function togglePasswordVisibility(inputId: string, btn?: HTMLElement): void {
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  if (!input || !btn) return;

const eyeOpen = `
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" 
          stroke="currentColor" stroke-width="2" fill="none"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
  </svg>
`;

  const eyeClosed = `
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="2"/>
    </svg>
  `;

  if (input.type === "password") {
    input.type = "text";
    btn.innerHTML = eyeClosed;
  } else {
    input.type = "password";
    btn.innerHTML = eyeOpen;
  }
}
  // --- eventos y bindings finales (listeners) ---
  if (photoInput && photoPreviewImg && photoPreviewContainer) {
    const openFilePicker = () => photoInput.click();
    photoPreviewImg.addEventListener("click", openFilePicker);
    photoPreviewContainer.addEventListener("click", openFilePicker);

    const u = JSON.parse(localStorage.getItem("booka_user") || "null");
    if (u && u.photo) photoPreviewImg.src = u.photo;
    else photoPreviewImg.src = "/avatar.png";

    photoInput.addEventListener("change", (e: any) => {
      const file = e.target.files?.[0];
      if (file) openCropModal(file);
      e.target.value = "";
    });
  }

  // password strength visual
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

  // tecla ESC para cerrar edit
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeEdit();
  });

  // storage event para sincronizar UI entre pestañas
  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === "booka_users" || e.key === "booka_broadcast" || e.key === "booka_user") {
      renderUI();
    }
  });

  // inicializar estado y listeners de botones
  const session = usersStore.sessions[deviceId!] || null;
  window.userProfile = session;
  window.isAuthenticated = !!(session && session.loggedIn);
  renderUI();
  updateMaskedPassword();

  if (saveProfileBtn) saveProfileBtn.addEventListener("click", saveProfile);
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", closeEdit);
  if (saveNewPwBtn) saveNewPwBtn.addEventListener("click", savePasswordChange);
  if (cancelNewPwBtn) cancelNewPwBtn.addEventListener("click", cancelPasswordChange);
  if (changePasswordBtn) changePasswordBtn.addEventListener("click", togglePasswordChange);
  if (toggleCurrentPwd)
    toggleCurrentPwd.addEventListener("click", (e) =>
      togglePasswordVisibility("currentPassword", e.currentTarget as HTMLElement)
    );

  if (toggleNewPwd)
    toggleNewPwd.addEventListener("click", (e) =>
      togglePasswordVisibility("newPassword", e.currentTarget as HTMLElement)
    );

  if (closeProfileViewBtn)
    closeProfileViewBtn.addEventListener("click", () => {
      if (profileModal) {
        profileModal.style.display = "none";
        profileModal.setAttribute("aria-hidden", "true");
      }
    });

  // profile updated event handler
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

  // exponer funciones en window (misma API pública)
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
