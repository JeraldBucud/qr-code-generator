
/**
 * QR Code Generator - Design Configuration
 */

// Default appearance
export const DEFAULT_DESIGN = {
  foreground: '#111827',
  background: '#ffffff',
  dots: 'square',
  corners: 'square',
  logoSize: 18,
}

// QR dot patterns
export const DOT_STYLES = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' },
]

// QR corner patterns
export const CORNER_STYLES = [
  { value: 'square', label: 'Square' },
  { value: 'extra-rounded', label: 'Rounded' },
  { value: 'dot', label: 'Dot' },
]

// Calculate relative colour luminance
function getLuminance(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    return null
  }

  const channels = [1, 3, 5].map((index) => {
    const value =
      parseInt(hex.slice(index, index + 2), 16) / 255

    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4
  })

  return (
    channels[0] * 0.2126 +
    channels[1] * 0.7152 +
    channels[2] * 0.0722
  )
}

// Check colour contrast
export function getContrastInfo(design) {
  const foreground = getLuminance(design.foreground)
  const background = getLuminance(design.background)

  if (foreground === null || background === null) {
    return {
      ratio: 0,
      safe: false,
    }
  }

  const ratio =
    (Math.max(foreground, background) + 0.05) /
    (Math.min(foreground, background) + 0.05)

  return {
    ratio,
    safe: foreground < background && ratio >= 4.5,
  }
}

// Generate the QR styling options
export function makeQROptions(data, design, logo = '') {
  return {
    width: 800,
    height: 800,
    type: 'svg',
    data,
    margin: 48,

    image: logo || undefined,

    qrOptions: {
      errorCorrectionLevel: 'H',
    },

    dotsOptions: {
      color: design.foreground,
      type: design.dots,
    },

    cornersSquareOptions: {
      color: design.foreground,
      type: design.corners,
    },

    cornersDotOptions: {
      color: design.foreground,
      type: 'square',
    },

    backgroundOptions: {
      color: design.background,
    },

    imageOptions: {
      hideBackgroundDots: true,
      imageSize: design.logoSize / 100,
      margin: 8,
      saveAsBlob: true,
    },
  }
}
