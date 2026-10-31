
import { useEffect, useMemo, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import './App.css'

const MAIN_TYPES = [
  { id: 'link', label: 'Link / Text', icon: '🔗' },
  { id: 'wifi', label: 'Wi-Fi', icon: '📶' },
  { id: 'contact', label: 'Contact', icon: '👤' },
]

const MORE_TYPES = [
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'sms', label: 'SMS' },
  { id: 'location', label: 'Location' },
  { id: 'event', label: 'Event' },
]

const initialFields = {
  linkText: '',
  ssid: '',
  wifiPassword: '',
  wifiSecurity: 'WPA',
  wifiHidden: false,
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  contactCompany: '',
  emailAddress: '',
  emailSubject: '',
  emailBody: '',
  phoneNumber: '',
  smsNumber: '',
  smsMessage: '',
  location: '',
  eventTitle: '',
  eventStart: '',
  eventEnd: '',
  eventPlace: '',
  eventDescription: '',
}

// Escape characters reserved by Wi-Fi QR codes
function escapeWifi(value) {
  return value.replace(/([\\;,:"])/g, '\\$1')
}

// Escape characters reserved by vCard and calendar data
function escapeStructuredText(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function cleanPhone(value) {
  const number = value.trim()

  if (!/^\+?[\d\s().-]{5,30}$/.test(number)) {
    return ''
  }

  return number.replace(/[^\d+]/g, '')
}

// Turn local date/time into UTC calendar format
function calendarDate(value) {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
}

// Convert the selected form into actual QR code data
function createQRData(type, fields) {
  switch (type) {
    case 'link': {
      const value = fields.linkText.trim()
      if (!value) return ''

      const hasProtocol = /^https?:\/\//i.test(value)
      const looksLikeDomain =
        /^(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:[/?#][^\s]*)?$/i.test(value)

      if (hasProtocol || looksLikeDomain) {
        try {
          const url = new URL(
            hasProtocol ? value : `https://${value}`
          )

          if (
            ['http:', 'https:'].includes(url.protocol) &&
            url.hostname
          ) {
            return url.href
          }
        } catch {
          return ''
        }

        return ''
      }

      // Anything else is treated as plain text
      return value
    }

    case 'wifi': {
      if (!fields.ssid.trim()) return ''

      if (
        fields.wifiSecurity !== 'nopass' &&
        !fields.wifiPassword
      ) {
        return ''
      }

      const password =
        fields.wifiSecurity === 'nopass'
          ? ''
          : `P:${escapeWifi(fields.wifiPassword)};`

      return (
        `WIFI:T:${fields.wifiSecurity};` +
        `S:${escapeWifi(fields.ssid)};` +
        password +
        `H:${fields.wifiHidden ? 'true' : 'false'};;`
      )
    }

    case 'contact': {
      const name = fields.contactName.trim()
      if (!name) return ''

      const parts = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${escapeStructuredText(name)}`,
        `N:;${escapeStructuredText(name)};;;`,
      ]

      if (fields.contactPhone.trim()) {
        parts.push(
          `TEL;TYPE=CELL:${fields.contactPhone.trim()}`
        )
      }

      if (validEmail(fields.contactEmail.trim())) {
        parts.push(
          `EMAIL:${fields.contactEmail.trim()}`
        )
      }

      if (fields.contactCompany.trim()) {
        parts.push(
          `ORG:${escapeStructuredText(fields.contactCompany.trim())}`
        )
      }

      parts.push('END:VCARD')
      return parts.join('\r\n')
    }

    case 'email': {
      const address = fields.emailAddress.trim()
      if (!validEmail(address)) return ''

      const params = []

      if (fields.emailSubject) {
        params.push(
          `subject=${encodeURIComponent(fields.emailSubject)}`
        )
      }

      if (fields.emailBody) {
        params.push(
          `body=${encodeURIComponent(fields.emailBody)}`
        )
      }

      return `mailto:${address}${params.length ? `?${params.join('&')}` : ''}`
    }

    case 'phone': {
      const number = cleanPhone(fields.phoneNumber)
      return number ? `tel:${number}` : ''
    }

    case 'sms': {
      const number = cleanPhone(fields.smsNumber)
      if (!number) return ''

      return (
        `sms:${number}` +
        (fields.smsMessage
          ? `?body=${encodeURIComponent(fields.smsMessage)}`
          : '')
      )
    }

    case 'location': {
      const location = fields.location.trim()
      if (!location) return ''

      return (
        'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(location)
      )
    }

    case 'event': {
      const title = fields.eventTitle.trim()
      const start = new Date(fields.eventStart)
      const end = new Date(fields.eventEnd)

      if (
        !title ||
        !fields.eventStart ||
        !fields.eventEnd ||
        !Number.isFinite(start.getTime()) ||
        !Number.isFinite(end.getTime()) ||
        end <= start
      ) {
        return ''
      }

      const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Free QR Generator//EN',
        'BEGIN:VEVENT',
        `UID:qr-${start.getTime()}@qr-generator.local`,
        `DTSTAMP:${calendarDate(new Date())}`,
        `DTSTART:${calendarDate(fields.eventStart)}`,
        `DTEND:${calendarDate(fields.eventEnd)}`,
        `SUMMARY:${escapeStructuredText(title)}`,
      ]

      if (fields.eventPlace.trim()) {
        lines.push(
          `LOCATION:${escapeStructuredText(fields.eventPlace.trim())}`
        )
      }

      if (fields.eventDescription.trim()) {
        lines.push(
          `DESCRIPTION:${escapeStructuredText(fields.eventDescription.trim())}`
        )
      }

      lines.push('END:VEVENT', 'END:VCALENDAR')

      return lines.join('\r\n')
    }

    default:
      return ''
  }
}

// Reusable input component
function FormField({
  id,
  label,
  hint,
  multiline = false,
  ...props
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>

      {multiline ? (
        <textarea id={id} rows={3} {...props} />
      ) : (
        <input id={id} type="text" {...props} />
      )}

      {hint && <p className="field-hint">{hint}</p>}
    </div>
  )
}

function App() {
  const [qrType, setQrType] = useState('link')
  const [fields, setFields] = useState(initialFields)

  const qrContainer = useRef(null)
  const qrCode = useRef(null)

  // Update an individual form field
  const updateField = (name) => (event) => {
    setFields((previous) => ({
      ...previous,
      [name]: event.target.value,
    }))
  }

  // Build QR data based on the currently selected type
  const qrData = useMemo(
    () => createQRData(qrType, fields),
    [qrType, fields]
  )

  // Render the QR code
  useEffect(() => {
    const container = qrContainer.current
    if (!container) return

    container.replaceChildren()
    qrCode.current = null

    if (!qrData) return

    const instance = new QRCodeStyling({
      width: 280,
      height: 280,
      type: 'svg',
      data: qrData,
      margin: 12,
      qrOptions: {
        errorCorrectionLevel: 'Q',
      },
      dotsOptions: {
        color: '#111827',
        type: 'square',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
    })

    instance.append(container)
    qrCode.current = instance

    return () => {
      qrCode.current = null
      container.replaceChildren()
    }
  }, [qrData])

  const downloadQR = async (format) => {
    if (!qrCode.current || !qrData) return

    try {
      await qrCode.current.download({
        name: `qr-${qrType}`,
        extension: format,
      })
    } catch (error) {
      console.error('Download error:', error)
      window.alert('Unable to download the QR code.')
    }
  }

  const eventEndInvalid =
    qrType === 'event' &&
    fields.eventStart &&
    fields.eventEnd &&
    new Date(fields.eventEnd) <= new Date(fields.eventStart)

  return (
    <main className="app">
      <div className="page-heading">
        <h1>Free QR Code Generator</h1>
        <p>
          Create, customise and download QR codes.
          No registration required.
        </p>
      </div>

      <div className="workspace">
        {/* Left side: content forms */}
        <section className="editor-panel">
          <h2>1. Choose QR type</h2>

          <div className="main-types">
            {MAIN_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`type-button ${
                  qrType === type.id ? 'selected' : ''
                }`}
                aria-pressed={qrType === type.id}
                onClick={() => setQrType(type.id)}
              >
                <span aria-hidden="true">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>

          <h3 className="more-heading">More QR types</h3>

          <div className="more-types">
            {MORE_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`more-button ${
                  qrType === type.id ? 'selected' : ''
                }`}
                aria-pressed={qrType === type.id}
                onClick={() => setQrType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="section-divider" />

          <h2>2. Enter your information</h2>

          {/* Link or text */}
          {qrType === 'link' && (
            <>
              <FormField
                id="link-text"
                label="Website URL or text"
                placeholder="https://example.com or any message"
                value={fields.linkText}
                onChange={updateField('linkText')}
                maxLength={1200}
                multiline
                hint="Website addresses without https:// are automatically recognised. Other content is encoded as text."
              />
            </>
          )}

          {/* Wi-Fi */}
          {qrType === 'wifi' && (
            <>
              <FormField
                id="ssid"
                label="Wi-Fi network name (SSID)"
                placeholder="Guest Wi-Fi"
                value={fields.ssid}
                onChange={updateField('ssid')}
                maxLength={100}
              />

              <div className="form-field">
                <label htmlFor="wifi-security">
                  Security type
                </label>
                <select
                  id="wifi-security"
                  value={fields.wifiSecurity}
                  onChange={updateField('wifiSecurity')}
                >
                  <option value="WPA">WPA / WPA2 / WPA3 Personal</option>
                  <option value="WEP">WEP (legacy)</option>
                  <option value="nopass">Open network</option>
                </select>
              </div>

              {fields.wifiSecurity !== 'nopass' && (
                <FormField
                  id="wifi-password"
                  label="Wi-Fi password"
                  type="password"
                  placeholder="Enter network password"
                  value={fields.wifiPassword}
                  onChange={updateField('wifiPassword')}
                  maxLength={128}
                />
              )}

              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={fields.wifiHidden}
                  onChange={(event) =>
                    setFields((previous) => ({
                      ...previous,
                      wifiHidden: event.target.checked,
                    }))
                  }
                />
                Hidden Wi-Fi network
              </label>

              <p className="help-message">
                Wi-Fi QR codes contain your network credentials.
                Use a guest network for public sharing.
              </p>
            </>
          )}

          {/* Contact */}
          {qrType === 'contact' && (
            <>
              <FormField
                id="contact-name"
                label="Full name"
                placeholder="Jane Smith"
                value={fields.contactName}
                onChange={updateField('contactName')}
                maxLength={100}
              />
              <FormField
                id="contact-phone"
                label="Phone number"
                placeholder="+61 400 000 000"
                value={fields.contactPhone}
                onChange={updateField('contactPhone')}
                maxLength={30}
              />
              <FormField
                id="contact-email"
                label="Email address"
                type="email"
                placeholder="jane@example.com"
                value={fields.contactEmail}
                onChange={updateField('contactEmail')}
                maxLength={150}
              />
              <FormField
                id="contact-company"
                label="Company (optional)"
                placeholder="Company name"
                value={fields.contactCompany}
                onChange={updateField('contactCompany')}
                maxLength={100}
              />
            </>
          )}

          {/* Email */}
          {qrType === 'email' && (
            <>
              <FormField
                id="email-address"
                label="Recipient email"
                type="email"
                placeholder="hello@example.com"
                value={fields.emailAddress}
                onChange={updateField('emailAddress')}
                maxLength={150}
              />
              <FormField
                id="email-subject"
                label="Subject (optional)"
                value={fields.emailSubject}
                onChange={updateField('emailSubject')}
                maxLength={150}
              />
              <FormField
                id="email-body"
                label="Message (optional)"
                value={fields.emailBody}
                onChange={updateField('emailBody')}
                maxLength={500}
                multiline
              />
            </>
          )}

          {/* Phone */}
          {qrType === 'phone' && (
            <FormField
              id="phone"
              label="Phone number"
              placeholder="+61 400 000 000"
              value={fields.phoneNumber}
              onChange={updateField('phoneNumber')}
              maxLength={30}
            />
          )}

          {/* SMS */}
          {qrType === 'sms' && (
            <>
              <FormField
                id="sms-number"
                label="Recipient phone number"
                placeholder="+61 400 000 000"
                value={fields.smsNumber}
                onChange={updateField('smsNumber')}
                maxLength={30}
              />
              <FormField
                id="sms-message"
                label="Message (optional)"
                placeholder="Your message..."
                value={fields.smsMessage}
                onChange={updateField('smsMessage')}
                maxLength={500}
                multiline
              />
            </>
          )}

          {/* Location */}
          {qrType === 'location' && (
            <FormField
              id="location"
              label="Address or coordinates"
              placeholder="Brisbane, Queensland, Australia"
              value={fields.location}
              onChange={updateField('location')}
              maxLength={250}
              hint="Generates a Google Maps search link."
            />
          )}

          {/* Calendar event */}
          {qrType === 'event' && (
            <>
              <FormField
                id="event-title"
                label="Event title"
                placeholder="Team meeting"
                value={fields.eventTitle}
                onChange={updateField('eventTitle')}
                maxLength={100}
              />

              <FormField
                id="event-start"
                label="Start date and time"
                type="datetime-local"
                value={fields.eventStart}
                onChange={updateField('eventStart')}
              />

              <FormField
                id="event-end"
                label="End date and time"
                type="datetime-local"
                value={fields.eventEnd}
                onChange={updateField('eventEnd')}
              />

              {eventEndInvalid && (
                <p className="error-message">
                  End time must be later than start time.
                </p>
              )}

              <FormField
                id="event-place"
                label="Location (optional)"
                value={fields.eventPlace}
                onChange={updateField('eventPlace')}
                maxLength={120}
              />

              <FormField
                id="event-description"
                label="Description (optional)"
                value={fields.eventDescription}
                onChange={updateField('eventDescription')}
                maxLength={200}
                multiline
              />

              <p className="help-message">
                Event QR codes use calendar data.
                Some camera apps may require a compatible QR scanner
                or calendar importer.
              </p>
            </>
          )}
        </section>

        {/* Right side: QR preview */}
        <section className="preview-panel">
          <h2>3. Your QR code</h2>
          <p className="preview-description">
            Your QR code updates automatically.
          </p>

          <div className="preview-area">
            <div
              ref={qrContainer}
              className="qr-output"
              hidden={!qrData}
            />

            {!qrData && (
              <div className="empty-state">
                <div className="empty-icon" aria-hidden="true">
                  ▦
                </div>
                <p>Your QR code will appear here</p>
                <span>
                  Complete the fields to generate a code.
                </span>
              </div>
            )}
          </div>

          <div className="download-buttons">
            <button
              type="button"
              disabled={!qrData}
              onClick={() => downloadQR('png')}
            >
              Download PNG
            </button>

            <button
              type="button"
              disabled={!qrData}
              onClick={() => downloadQR('svg')}
            >
              Download SVG
            </button>
          </div>

          <div className="preview-note">
            <p>
              Static QR code • No expiration imposed by us
            </p>
            <p>
              Generated locally in your browser
            </p>
          </div>
        </section>
      </div>

      <footer className="site-footer">
        Free QR Code Generator • Built with React and JavaScript
      </footer>
    </main>
  )
}

export default App
