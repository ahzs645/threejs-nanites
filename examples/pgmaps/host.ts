// Where the PGMaps scene runs. The same scene code (examples/pgmaps-scene.ts) runs in two hosts:
//   - its own page (examples/pgmaps-scene.html): opened alone, or in a frame PGMaps lays over its road view, the
//     messages through window.parent;
//   - a worker PGMaps starts itself (examples/pgmaps-worker.ts, built by `npm run build:pgmaps-worker`), drawing into
//     the OffscreenCanvas PGMaps hands it, the messages through the worker's own port. A worker has no window, no
//     document and no DOM events: PGMaps sends its size ({ type: 'pgmaps-worker-viewport' }) and places the canvas
//     where the scene asks ({ type: 'pgmaps-engine-viewport' }), and the scene's page-only parts (the info line, the
//     orbit controls, the file picker) stand down.
// Every message the scene sends goes through `post`, so the protocol is the same in both hosts.

/** The size to draw at, in CSS pixels, and the device's pixels per CSS pixel. */
export type Viewport = { width: number; height: number; pixelRatio: number };
/** Where the drawing sits in its host's box (the lens kept: fitCameraViewport letterboxes it), CSS pixels. */
export type Placement = { left: number; top: number; width: number; height: number };

/** The first message PGMaps sends a worker: the canvas to draw into, handed over, and its size. */
export type WorkerInit = { type: 'pgmaps-worker-init'; canvas: OffscreenCanvas; viewport: Viewport };

export interface SceneHost {
  /** Running in a worker PGMaps started (no DOM). */
  readonly worker: boolean;
  /** Driven by a parent (PGMaps): a frame, or a worker, which always is. */
  readonly embedded: boolean;
  /** What relative addresses (the bark and leaf images) are read against. */
  readonly baseUrl: string;
  /** A message to PGMaps, its buffers handed over. Nothing when the page is opened alone. */
  post(message: Record<string, unknown>, transfer?: Transferable[]): void;
  /** A line for whoever looks at the page (its info box); a worker has none. */
  status(text: string): void;
  /** The canvas the renderer draws into: the worker's OffscreenCanvas, or undefined for one the renderer makes. */
  canvas(): OffscreenCanvas | undefined;
  viewport(): Viewport;
  /** Called when the viewport changes; returns the unsubscribe. */
  onResize(listener: () => void): () => void;
  /** Shows the renderer's canvas at `view`. */
  place(canvas: HTMLCanvasElement | OffscreenCanvas, view: Placement): void;
  /** Puts the renderer's canvas on the page, and takes it off again. */
  mount(canvas: HTMLCanvasElement | OffscreenCanvas): void;
  unmount(canvas: HTMLCanvasElement | OffscreenCanvas): void;
  /** Names on the global object, for the trial (`pgmaps`, `pgmapsTrees`). */
  expose(values: Record<string, unknown>): void;
}

const params = new URLSearchParams(location.search);
const expose = (values: Record<string, unknown>): void => void Object.assign(globalThis, values);

function pageHost(): SceneHost {
  const info = document.getElementById('info');
  const embedded = window.parent !== window;
  const asked = embedded || params.has('embed');
  if (params.has('embed') && info) info.hidden = true;
  const viewport = (): Viewport => ({ width: innerWidth, height: innerHeight, pixelRatio: devicePixelRatio });
  return {
    worker: false,
    embedded,
    baseUrl: document.baseURI,
    post: (message, transfer = []) => {
      if (embedded) window.parent.postMessage(message, { targetOrigin: '*', transfer });
    },
    status: (text) => {
      if (info) info.textContent = text;
    },
    canvas: () => undefined,
    viewport,
    onResize: (listener) => {
      addEventListener('resize', listener);
      return () => removeEventListener('resize', listener);
    },
    place: (canvas, view) => {
      Object.assign((canvas as HTMLCanvasElement).style, { position: 'absolute', left: `${view.left}px`, top: `${view.top}px` });
    },
    mount: (canvas) => {
      document.body.appendChild(canvas as HTMLCanvasElement);
      if (asked) (canvas as HTMLCanvasElement).style.pointerEvents = 'none';
    },
    unmount: (canvas) => (canvas as HTMLCanvasElement).remove(),
    expose,
  };
}

function workerHost(): SceneHost {
  let canvas: OffscreenCanvas | undefined;
  let size: Viewport = { width: 1, height: 1, pixelRatio: 1 };
  const listeners = new Set<() => void>();
  const send = (message: Record<string, unknown>, transfer: Transferable[] = []): void =>
    (globalThis as unknown as { postMessage: (data: unknown, options: StructuredSerializeOptions) => void }).postMessage(message, { transfer });
  const viewportOf = (raw: unknown): Viewport | null => {
    const v = raw as Partial<Viewport> | null;
    if (!v || !(Number(v.width) > 0) || !(Number(v.height) > 0)) return null;
    return { width: Math.round(Number(v.width)), height: Math.round(Number(v.height)), pixelRatio: Number(v.pixelRatio) > 0 ? Number(v.pixelRatio) : 1 };
  };
  addEventListener('message', (event: MessageEvent) => {
    const data = event.data as { type?: string; canvas?: unknown; viewport?: unknown } | null;
    if (data?.type === 'pgmaps-worker-init' && data.canvas instanceof OffscreenCanvas) {
      canvas = data.canvas;
      size = viewportOf(data.viewport) ?? size;
    } else if (data?.type === 'pgmaps-worker-viewport') {
      const next = viewportOf(data.viewport);
      if (!next || (next.width === size.width && next.height === size.height && next.pixelRatio === size.pixelRatio)) return;
      size = next;
      for (const listener of listeners) listener();
    }
  });
  return {
    worker: true,
    embedded: true,
    baseUrl: location.href,
    post: send,
    status: () => {},
    canvas: () => {
      if (!canvas) throw new Error('PGMaps has not handed this worker its canvas (pgmaps-worker-init).');
      return canvas;
    },
    viewport: () => size,
    onResize: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    place: (_canvas, view) => send({ type: 'pgmaps-engine-viewport', ...view }),
    mount: () => {},
    unmount: () => {},
    expose,
  };
}

/** This scene's host: a worker's when there is no document, else the page's. */
export const host: SceneHost = typeof document === 'undefined' ? workerHost() : pageHost();
