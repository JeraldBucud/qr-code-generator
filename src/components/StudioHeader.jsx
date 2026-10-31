
function StudioMark() {
  return (
    <svg
      viewBox="0 0 40 40"
      width="25"
      height="25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect
        x="7.5"
        y="7.5"
        width="5"
        height="5"
        fill="currentColor"
      />

      <rect
        x="23"
        y="3"
        width="14"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect
        x="27.5"
        y="7.5"
        width="5"
        height="5"
        fill="currentColor"
      />

      <rect
        x="3"
        y="23"
        width="14"
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect
        x="7.5"
        y="27.5"
        width="5"
        height="5"
        fill="currentColor"
      />

      <path
        d="M23 23H28V28H23V23Z"
        fill="currentColor"
      />
      <path
        d="M32 23H37V28H32V23Z"
        fill="currentColor"
      />
      <path
        d="M23 32H28V37H23V32Z"
        fill="currentColor"
      />
      <path
        d="M32 32H37V37H32V32Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function StudioHeader() {
  return (
    <>
      <header className="studio-header">
        <div className="studio-brand">
          <span className="studio-brand-icon">
            <StudioMark />
          </span>

          <span className="studio-brand-text">
            <strong>QR Studio</strong>
            <small>QR CODE GENERATOR</small>
          </span>
        </div>

        <div className="studio-header-links">
          <span className="studio-private-indicator">
            Free to use
          </span>

          <a
            className="studio-source-link"
            href="https://github.com/JeraldBucud/qr-code-generator"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source code
            <span aria-hidden="true"> ↗</span>
          </a>
        </div>
      </header>

      <section
        className="studio-hero"
        aria-labelledby="studio-heading"
      >
        <div className="studio-hero-main">
          <p className="studio-eyebrow">
            QR GENERATOR / WORKSPACE
          </p>

          <h1 id="studio-heading">
            Create a QR code
          </h1>

          <p className="studio-hero-description">
            Add your content, adjust the design,
            and export a QR code ready to use.
          </p>
        </div>

        <div className="studio-workspace-note">
          <span className="studio-workspace-dot" />
          Generated in your browser
        </div>
      </section>
    </>
  )
}
