
import { useRef, useState } from 'react'

import {
  DEFAULT_DESIGN,
  DOT_STYLES,
  CORNER_STYLES,
  getContrastInfo,
} from '../qrDesign'

/**
 * QR Designer
 *
 * Allows users to customise:
 * - Foreground colour
 * - Background colour
 * - QR dot patterns
 * - QR corner styles
 * - Centre logo
 * - Logo size
 */
function QRDesigner({
  design,
  setDesign,
  logo,
  setLogo,
}) {
  const [logoError, setLogoError] = useState('')

  const fileInputRef = useRef(null)
  const uploadId = useRef(0)

  // Check colour contrast
  const { ratio, safe } = getContrastInfo(design)

  // Update individual design settings
  function updateDesign(name, value) {
    setDesign((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  /**
   * Handle logo upload.
   * Logo images are processed locally in the browser.
   */
  function handleLogoUpload(event) {
    const file = event.target.files?.[0]

    if (!file) return

    // Invalidate any previous pending upload
    const requestId = ++uploadId.current

    setLogoError('')

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
    ]

    if (!allowedTypes.includes(file.type)) {
      setLogoError(
        'Please upload a PNG, JPG, or WebP image.'
      )
      event.target.value = ''
      return
    }

    // Maximum file size: 2 MB
    const maxSize = 2 * 1024 * 1024

    if (file.size > maxSize) {
      setLogoError(
        'Logo size must not exceed 2 MB.'
      )
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (requestId !== uploadId.current) return

      if (typeof reader.result !== 'string') {
        setLogoError('Unable to read the selected image.')
        return
      }

      const imageData = reader.result
      const image = new Image()

      // Check that the selected image is readable
      image.onload = () => {
        if (requestId !== uploadId.current) return

        setLogo(imageData)
        setLogoError('')
      }

      image.onerror = () => {
        if (requestId !== uploadId.current) return

        setLogoError(
          'The selected file is not a valid image.'
        )
      }

      image.src = imageData
    }

    reader.onerror = () => {
      if (requestId !== uploadId.current) return

      setLogoError(
        'Something went wrong while reading the image.'
      )
    }

    reader.readAsDataURL(file)
  }

  // Remove the current logo
  function removeLogo() {
    uploadId.current += 1

    setLogo('')
    setLogoError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Restore default appearance
  function resetDesign() {
    setDesign({ ...DEFAULT_DESIGN })
    removeLogo()
  }

  return (
    <div className="qr-designer">

      {/* COLOUR CUSTOMISATION */}

      <div className="design-grid">

        <div className="form-field">
          <label htmlFor="qr-foreground">
            QR Pattern Colour
          </label>

          <div className="color-row">
            <input
              id="qr-foreground"
              type="color"
              value={design.foreground}
              onChange={(event) =>
                updateDesign(
                  'foreground',
                  event.target.value
                )
              }
            />

            <span>
              {design.foreground.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="qr-background">
            Background Colour
          </label>

          <div className="color-row">
            <input
              id="qr-background"
              type="color"
              value={design.background}
              onChange={(event) =>
                updateDesign(
                  'background',
                  event.target.value
                )
              }
            />

            <span>
              {design.background.toUpperCase()}
            </span>
          </div>
        </div>

      </div>

      {/* QR PATTERNS */}

      <div className="design-grid">

        <div className="form-field">
          <label htmlFor="qr-pattern">
            QR Dot Pattern
          </label>

          <select
            id="qr-pattern"
            value={design.dots}
            onChange={(event) =>
              updateDesign(
                'dots',
                event.target.value
              )
            }
          >
            {DOT_STYLES.map((style) => (
              <option
                key={style.value}
                value={style.value}
              >
                {style.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="qr-corners">
            QR Corner Style
          </label>

          <select
            id="qr-corners"
            value={design.corners}
            onChange={(event) =>
              updateDesign(
                'corners',
                event.target.value
              )
            }
          >
            {CORNER_STYLES.map((style) => (
              <option
                key={style.value}
                value={style.value}
              >
                {style.label}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* COLOUR CONTRAST */}

      <p className="field-hint">
        Colour contrast: {ratio.toFixed(1)}:1
      </p>

      {!safe && (
        <p
          className="error-message"
          role="alert"
        >
          Low contrast detected. Choose a darker
          QR pattern and a lighter background.
          Downloads will be disabled until
          contrast improves.
        </p>
      )}

      <div className="section-divider" />

      {/* LOGO UPLOAD */}

      <h3 className="design-subheading">
        Centre Logo (Optional)
      </h3>

      <div className="form-field">
        <label htmlFor="qr-logo">
          Upload Your Logo
        </label>

        <input
          id="qr-logo"
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleLogoUpload}
        />

        <p className="field-hint">
          Supported formats: PNG, JPG, WebP.
          Maximum file size: 2 MB.
        </p>
      </div>

      {logoError && (
        <p
          className="error-message"
          role="alert"
        >
          {logoError}
        </p>
      )}

      {/* LOGO CONTROLS */}

      {logo && (
        <div className="logo-controls">

          <img
            className="logo-thumbnail"
            src={logo}
            alt="Uploaded company logo"
          />

          <div className="logo-sizing">
            <label htmlFor="qr-logo-size">
              Logo Size: {design.logoSize}%
            </label>

            <input
              id="qr-logo-size"
              type="range"
              min="12"
              max="22"
              step="1"
              value={design.logoSize}
              onChange={(event) =>
                updateDesign(
                  'logoSize',
                  Number(event.target.value)
                )
              }
            />
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={removeLogo}
          >
            Remove Logo
          </button>

        </div>
      )}

      <p className="help-message">
        Logos can affect QR code readability.
        Always scan your downloaded QR code
        before printing or distributing it.
      </p>

      {/* RESET BUTTON */}

      <button
        type="button"
        className="reset-button"
        onClick={resetDesign}
      >
        Reset Design to Defaults
      </button>

    </div>
  )
}

export default QRDesigner
