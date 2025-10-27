export async function compressImageToTarget(
  file: File,
  targetBytes = 10 * 1024 * 1024,
  opts?: {
    maxWidth?: number;
    maxHeight?: number;
    minQuality?: number;
    maxQuality?: number;
    preferMime?: "image/webp" | "image/jpeg" | "image/png";
  }
): Promise<File> {
  if (file.type.includes("gif")) return file;
  if (file.size <= targetBytes) return file;

  const maxW = opts?.maxWidth ?? 8000;
  const maxH = opts?.maxHeight ?? 8000;
  const minQ = opts?.minQuality ?? 0.6;
  const maxQ = opts?.maxQuality ?? 0.95;
  const outType = opts?.preferMime ?? "image/webp";

  const imgBitmap = await (async () => {
    try {
      return await createImageBitmap(file);
    } catch {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject as any;
        i.src = URL.createObjectURL(file);
      });
      return img as unknown as ImageBitmap;
    }
  })();

  let width = (imgBitmap as any).width as number;
  let height = (imgBitmap as any).height as number;

  const scale = Math.min(1, maxW / width, maxH / height);
  if (scale < 1) {
    width = Math.max(1, Math.floor(width * scale));
    height = Math.max(1, Math.floor(height * scale));
  }

  const makeCanvas = (w: number, h: number) => {
    const hasOffscreen = typeof (globalThis as any).OffscreenCanvas !== "undefined";
    const offscreen = hasOffscreen
      ? new (globalThis as any).OffscreenCanvas(w, h)
      : (() => {
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          return c;
        })();
    const ctx = (offscreen as any).getContext("2d", { alpha: true });
    ctx.drawImage(imgBitmap as any, 0, 0, w, h);
    return { canvas: offscreen as any };
  };

  const { canvas } = makeCanvas(width, height);

  const toBlob = (q: number) =>
    new Promise<Blob>((resolve, reject) => {
      const onBlob = (b: Blob | null) => (b ? resolve(b) : reject(new Error("toBlob failed")));
      if ((canvas as any).convertToBlob) {
        (canvas as any)
          .convertToBlob({ type: outType, quality: q })
          .then((b: Blob) => resolve(b))
          .catch(reject);
      } else {
        (canvas as HTMLCanvasElement).toBlob(onBlob, outType, q);
      }
    });

  let lo = minQ;
  let hi = maxQ;
  let bestBlob: Blob | null = null;
  for (let i = 0; i < 8; i++) {
    const mid = (lo + hi) / 2;
    const blob = await toBlob(mid);
    if (!bestBlob || blob.size <= targetBytes) bestBlob = blob;
    if (blob.size > targetBytes) hi = mid; else lo = mid;
  }

  if (bestBlob && bestBlob.size > targetBytes) {
    const factor = Math.sqrt(targetBytes / bestBlob.size);
    const newW = Math.max(1, Math.floor(width * Math.min(0.95, factor)));
    const newH = Math.max(1, Math.floor(height * Math.min(0.95, factor)));
    const { canvas: c2 } = makeCanvas(newW, newH);
    const toBlob2 = (q: number) =>
      (c2 as any).convertToBlob
        ? (c2 as any).convertToBlob({ type: outType, quality: q })
        : new Promise<Blob>((resolve, reject) =>
            (c2 as HTMLCanvasElement).toBlob(
              (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
              outType,
              q,
            ),
          );
    let lo2 = minQ, hi2 = maxQ, best2: Blob | null = null;
    for (let i = 0; i < 8; i++) {
      const mid = (lo2 + hi2) / 2;
      const b = await toBlob2(mid);
      if (!best2 || b.size <= targetBytes) best2 = b;
      if (b.size > targetBytes) hi2 = mid; else lo2 = mid;
    }
    bestBlob = best2;
  }

  const ext = outType === "image/jpeg" ? ".jpg" : outType === "image/png" ? ".png" : ".webp";
  const outName = file.name.replace(/\.(\w+)$/, "") + "-compressed" + ext;
  return new File([bestBlob!], outName, { type: outType, lastModified: Date.now() });
}


