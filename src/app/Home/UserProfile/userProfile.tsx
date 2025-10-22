"use client";
import { JSX } from "react";
import { useEffect } from "react";
import "@/app/Home/UserProfile/userProfile.css";
import Header from "@/app/Home/Header/header";
import { initUserProfileLogic } from "./userProfileLogic";

// Tipado global para evitar errores TS en propiedades dinámicas de window
declare global {
  interface Window {
    openEdit?: () => void;
    saveProfile?: () => void;
    savePasswordChange?: () => void;
    cancelPasswordChange?: () => void;
    togglePasswordChange?: () => void;
    togglePasswordVisibility?: (id: string, target?: any) => void;
    closeEdit?: () => void;
    closeProfileModal?: () => void;
  }
}


export default function UserProfile(): JSX.Element {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkReady = setInterval(() => {
      const profileIcon = document.getElementById("profileIcon");
      const profileMenu = document.getElementById("profileMenu");
      const authButtons = document.getElementById("authButtons");

      if (profileIcon && profileMenu && authButtons) {
        console.log("✅ Header cargado, inicializando lógica del perfil...");
        clearInterval(checkReady);

        try {
          initUserProfileLogic();
        } catch (err) {
          console.error("Error en initUserProfileLogic:", err);
        }

        setTimeout(() => {
          const params = new URLSearchParams(window.location.search);
          if (params.get("edit") === "1" && typeof (window as any).openEdit === "function") {
            (window as any).openEdit();
            const url = new URL(window.location.href);
            url.searchParams.delete("edit");
            window.history.replaceState({}, "", url.toString());
          }
        }, 200);
      }
    }, 200);
    return () => clearInterval(checkReady);
  }, []);

  return (
    <main>
      <Header />
      <div id="editModal" className="modal" role="dialog" aria-modal="true" aria-labelledby="editTitle">
        <h2 id="editTitle">Editar perfil</h2>
        <label htmlFor="nameInput">Nombre completo</label>
        <input id="nameInput" type="text" placeholder="Nombre y apellidos" aria-required="true" />
        <small id="nameErr" className="error" style={{ display: "none" }}></small>
        <label htmlFor="emailInput">Correo electrónico</label>
        <input id="emailInput" type="email" placeholder="correo@ejemplo.com" aria-required="true" />
        <small id="emailErr" className="error" style={{ display: "none" }}></small>
        <label htmlFor="phoneInput">Teléfono</label>
        <input id="phoneInput" type="tel" placeholder="71234567" aria-required="false" />
        <small id="phoneErr" className="error" style={{ display: "none" }}></small>
        <label htmlFor="photoInput">Cambiar foto de perfil</label>
        <input id="photoInput" type="file" accept="image/*" aria-label="Cambiar foto de perfil" />
        <div id="passwordSection">
          <label>Contraseña</label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span id="maskedPassword">••••••••</span>
            <button type="button" className="btn" style={{ padding: "6px 10px", fontSize: "13px" }} onClick={() => (window as any).togglePasswordChange?.()}>Cambiar contraseña</button>
          </div>
        </div>
        <label className="toggle" style={{ marginTop: "8px" }}>
          <input type="checkbox" id="notifToggle" /> Notificaciones activadas
        </label>
        <div id="passwordChangeFields" style={{ display: "none", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
          <label htmlFor="currentPassword">Contraseña actual</label>
          <div style={{ position: "relative" }}>
            <input type="password" id="currentPassword" style={{ width: "100%", paddingRight: "35px" }} />
            <button type="button" className="togglePw" style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer" }} onClick={(e) => (window as any).togglePasswordVisibility?.("currentPassword", e.target)}>
              👁
            </button>
          </div>
          <label htmlFor="newPassword">Nueva contraseña</label>
          <div style={{ position: "relative" }}>
            <input type="password" id="newPassword" style={{ width: "100%", paddingRight: "35px" }} />
            <button type="button" className="togglePw" style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer" }} onClick={(e) => (window as any).togglePasswordVisibility?.("newPassword", e.target)}>
              👁
            </button>
          </div>
          <div id="pwBar" className="password-strength"><i></i></div>
          <small id="pwErr" className="error" style={{ display: "none" }}></small>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            <button type="button" className="btn" onClick={() => (window as any).savePasswordChange?.()}>Guardar nueva contraseña</button>
            <button type="button" className="btn" style={{ background: "#ccc", color: "#000" }} onClick={() => (window as any).cancelPasswordChange?.()}>Cancelar</button>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "15px" }}>
          <button type="button" className="btn" onClick={() => (window as any).saveProfile?.()}>Guardar</button>
          <button type="button" className="btn" style={{ background: "#ccc", color: "#000" }} onClick={() => (window as any).closeEdit?.()}>Cancelar</button>
        </div>
      </div>
      <div id="profileModal" className="modal" aria-hidden="true">
        <h2>Mi perfil</h2>
        <img id="profileViewPhoto" src="https://i.pravatar.cc/100?u=default" alt="Foto de perfil" style={{ width: "120px", height: "120px", borderRadius: "50%", margin: "auto", objectFit: "cover", border: "3px solid #2B6AF0" }} />
        <p><strong>Nombre:</strong> <span id="profileViewName"></span></p>
        <p><strong>Correo:</strong> <span id="profileViewEmail"></span></p>
        <p><strong>Teléfono:</strong> <span id="profileViewPhone"></span></p>
        <button className="btn" onClick={() => (window as any).closeProfileModal?.()}>Cerrar</button>
      </div>
    </main>
  );
}


