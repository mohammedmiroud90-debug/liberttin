export type ImageEffects = {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: boolean;
  rotation: number;
  scale: number;
};

export const DEFAULT_IMAGE_EFFECTS: ImageEffects = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: false,
  rotation: 0,
  scale: 1,
};

export function buildImageFilter(effects: ImageEffects): string {
  const parts = [
    `brightness(${effects.brightness}%)`,
    `contrast(${effects.contrast}%)`,
    `saturate(${effects.saturation}%)`,
  ];
  if (effects.grayscale) parts.push('grayscale(100%)');
  return parts.join(' ');
}

export async function loadImageSource(src: string | File): Promise<HTMLImageElement> {
  const url = typeof src === 'string' ? src : URL.createObjectURL(src);
  const image = new Image();
  if (typeof src === 'string') image.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Could not load that image.'));
    image.src = url;
  });

  return image;
}

/** Renders the edited avatar to a square PNG blob for upload. */
export async function exportEditedAvatar(
  source: HTMLImageElement,
  effects: ImageEffects,
  outputSize = 512
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available.');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, outputSize, outputSize);

  const rotation = ((effects.rotation % 360) + 360) % 360;
  const swap = rotation === 90 || rotation === 270;
  const baseWidth = swap ? source.naturalHeight : source.naturalWidth;
  const baseHeight = swap ? source.naturalWidth : source.naturalHeight;
  const coverScale =
    (Math.max(outputSize / baseWidth, outputSize / baseHeight) * effects.scale) || 1;

  ctx.save();
  ctx.translate(outputSize / 2, outputSize / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.filter = buildImageFilter(effects);
  ctx.drawImage(
    source,
    (-source.naturalWidth * coverScale) / 2,
    (-source.naturalHeight * coverScale) / 2,
    source.naturalWidth * coverScale,
    source.naturalHeight * coverScale
  );
  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not export image.'))),
      'image/png',
      0.92
    );
  });
}
