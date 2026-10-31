
# QR Studio

**A free, browser-based QR code generator with customisation and export tools.**

QR Studio allows users to create static QR codes for websites, Wi-Fi networks, contact details, emails, phone numbers, messages, locations, and calendar events.

Design your QR code with custom colours, patterns, corner styles, and a centre logo. Preview changes in real time and download your finished QR code as PNG or SVG.

**Live Website:** https://qr.jeraldbucud.com

**Source Code:** https://github.com/JeraldBucud/qr-code-generator

## Features

### QR Code Generation

Create QR codes for:

- Website URLs and plain text
- Wi-Fi network credentials
- Contact information (vCard)
- Email messages
- Phone numbers
- SMS messages
- Locations and Google Maps searches
- Calendar events

### Design Customisation

- Custom foreground and background colours
- Six QR dot patterns
- Three QR corner styles
- Colour contrast validation
- Optional centre logo
- PNG, JPG, and WebP logo uploads (up to 2 MB)
- Adjustable logo size
- Reset design to defaults

### Preview and Export

- Live QR code preview
- PNG downloads
- SVG downloads
- Responsive workspace
- Separate Content and Design tabs
- Client-side QR code generation

## Technology Stack

| Technology | Purpose |
|------------|---------|
| React | User interface |
| Vite | Development and build tooling |
| JavaScript | Application logic |
| CSS | Styling and responsive layout |
| qr-code-styling | QR code generation and customisation |
| Cloudflare Pages | Static website hosting |
| GitHub Actions | Continuous integration |

## Getting Started

### Prerequisites

Install a Node.js version compatible with the project's Vite version and npm.

### Installation

Clone the repository:

```bash
git clone https://github.com/JeraldBucud/qr-code-generator.git
```

Navigate to the project:

```bash
cd qr-code-generator
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed in your terminal.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the local development server |
| `npm run build` | Create the production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Privacy and Data Processing

QR Studio generates QR codes locally in your browser.

- No user account is required.
- No backend or database is used for QR generation.
- Entered QR content is processed in the browser.
- Uploaded logos are processed locally.
- QR Studio does not require users to submit their QR content to an application server.

Standard website hosting and browser operations may still involve network requests.

**Security reminder:** QR codes can contain readable information. Avoid publicly sharing private Wi-Fi credentials or sensitive personal information.

## Static QR Codes

QR Studio generates static QR codes.

The encoded content is stored directly in the QR pattern. QR Studio does not impose an expiration date or provide a redirect-management service.

QR codes containing website links depend on those destination websites remaining accessible.

## QR Code Readability

Custom colours, unusual patterns, and centre logos can affect readability.

For best results:

- Use dark QR patterns on a light background.
- Maintain strong foreground/background contrast.
- Avoid oversized logos.
- Download and test your QR code before printing.
- Check that your intended scanner can decode the content.

## Deployment

QR Studio is deployed using Cloudflare Pages.

Production configuration:

| Setting | Value |
|---------|-------|
| Framework | React + Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Production branch | `main` |
| Custom domain | `qr.jeraldbucud.com` |

Updates merged into the production branch can be deployed through the connected Cloudflare Pages Git integration.

## Project Development

QR Studio was developed in stages:

| Version | Milestone |
|---------|-----------|
| v0.1.0 | Initial QR code generation features |
| v0.2.0 | QR code design customisation |
| v0.3.0 | QR Studio branding and UI/UX redesign |
| v1.0.0 | First stable production release |

## Author

**Jerald Christopher Bucud**

Software development portfolio:
https://jeraldbucud.com

GitHub:
https://github.com/JeraldBucud

---

QR Studio is a personal software development project designed to provide an accessible, free QR code creation tool.
