// Framework-neutral image math, kept as plain .ts.
export const GREEN_SHADOW: number[] = [22, 80, 39];
export const PINK_HIGHLIGHT: number[] = [249, 159, 210];

/**
 * Generates Look-Up Tables (LUTs) for color mapping based on shadow and highlight colors.
 */
export function generateLUTs(shadowColor: number[], highlightColor: number[]) {
  const rLUT = new Uint8ClampedArray(256);
  const gLUT = new Uint8ClampedArray(256);
  const bLUT = new Uint8ClampedArray(256);

  for (let i = 0; i < 256; i++) {
    const luminance = i / 255.0;
    const invLuminance = 1.0 - luminance;
    rLUT[i] = shadowColor[0] * invLuminance + highlightColor[0] * luminance;
    gLUT[i] = shadowColor[1] * invLuminance + highlightColor[1] * luminance;
    bLUT[i] = shadowColor[2] * invLuminance + highlightColor[2] * luminance;
  }
  return { rLUT, gLUT, bLUT };
}

export type LUTs = ReturnType<typeof generateLUTs>;

/**
 * Applies the duotone filter to an image's data using the provided LUTs.
 */
export function filtering(
  imageData: ImageData,
  luts: { rLUT: Uint8ClampedArray; gLUT: Uint8ClampedArray; bLUT: Uint8ClampedArray },
): ImageData {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminanceInt = Math.round(r * 0.2126 + g * 0.7152 + b * 0.0722);
    data[i] = luts.rLUT[luminanceInt];
    data[i + 1] = luts.gLUT[luminanceInt];
    data[i + 2] = luts.bLUT[luminanceInt];
  }
  return imageData;
}
