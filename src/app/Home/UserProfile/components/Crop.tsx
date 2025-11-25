'use client';

export const CROP = `
  <div id="cropModal" class="modal" role="dialog" aria-modal="true" aria-hidden="true" style="display:none; position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); width: min(520px, 92%); max-width: 520px;">
    <h3 id="cropTitle">Recortar foto</h3>
    <div style="display:flex;gap:12px;flex-direction:column;align-items:center">
      <div id="cropArea" style="position:relative; width:420px; height:420px; max-width:90vw; background:transparent; border-radius:8px; overflow:hidden; touch-action:none;">
        <canvas id="cropCanvas" width="420" height="420" style="width:100%;height:100%;display:block;"></canvas>
        <div id="cropOverlay" aria-hidden="true" style="position:absolute; inset:0; pointer-events:none;">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="display:block;">
            <rect x="0" y="0" width="100" height="100" fill="rgba(0,0,0,0.45)"></rect>
            <mask id="hole">
              <rect x="0" y="0" width="100" height="100" fill="white" />
              <circle cx="50" cy="50" r="49" fill="black" />
            </mask>
            <rect x="0" y="0" width="100" height="100" fill="rgba(0,0,0,0.45)" mask="url(#hole)"></rect>
            <circle cx="50" cy="50" r="49" fill="none" stroke="#fff" stroke-width="1.2" />
          </svg>
        </div>
      </div>

      <div style="display:flex;width:100%;justify-content:center;align-items:center;margin-top:8px">
        <input id="zoomRange" type="range" min="0.5" max="3" step="0.01" value="1" style="width:90%" aria-label="Zoom"/>
      </div>

      <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end;width:100%">
        <button id="cancelCropBtn" type="button" class="btn" style="background:#ccc;color:#000">Cancelar</button>
        <button id="saveCropBtn" type="button" class="btn">Guardar</button>
      </div>
    </div>
  </div>
`;
