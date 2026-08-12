# 🌴 Hacker House Goa 2026 — Builder Identity & PFP Studio

An interactive web application for creating official **Builder ID Cards** and **Social Media Avatar Frames** for Hacker House Goa 2026. Generate your personalized identity badge with photo capture, real-time preview, and high-resolution PNG export.

**Live Studio:** [HHGOA ID Card Studio](https://github.com/its-Arpan007/HHGOA-ID-Card)

## ✨ Features

### 🎭 Dual Format Modes
- **Builder ID Card** — Official event identity badge with customized builder title, name & tech stack
- **PFP Frame** — Tropical cyber avatar frame for Twitter, LinkedIn & Farcaster with Hacker House branding

### 📸 Photo Capture & Management
- **Live Camera Capture** — Take photos directly using your device's webcam with face positioning guide
- **Photo Upload** — Drag & drop or browse files in JPG, PNG, HEIC (iPhone), or HEIF format
- **HEIC Conversion** — Automatic iPhone photo format conversion to JPEG for compatibility
- **Image Framing Tools** — Zoom, pan, and position your photo with real-time preview
- **Privacy First** — All photos stay on your device; nothing is uploaded to servers

### 🎨 Customization Options
- **Name Input** — Auto-uppercase text with dynamic font scaling for long names
- **Tech Stack / Role** — Quick-select preset chips (Solana/Rust, Full Stack/AI, Smart Contracts, Design & UX)
- **Builder Title Generator** — 30+ curated builder titles with randomize button (e.g., "🌴 GOA CODE CHAD", "⚡ SOLANA WIZARD")
- **Real-Time Preview** — Live updates as you customize your card

### 💾 Export & Sharing
- **HD PNG Export** — Download high-resolution graphics (3x scale via html2canvas)
- **Twitter/X Integration** — Share directly to X with #FrameInGoa hashtag
- **Smart Filenames** — Auto-generated download names with sanitized builder names

### 🎯 Developer Experience
- **Responsive Design** — Works on desktop, tablet, and mobile devices
- **Glassmorphic UI** — Modern semi-transparent cards with blur effects
- **Accessibility** — ARIA labels, keyboard navigation, focus management
- **Toast Notifications** — Lightweight feedback system for user actions

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Markup** | HTML5 with semantic structure |
| **Styling** | CSS3 with CSS custom properties (variables), glassmorphism effects |
| **JavaScript** | Vanilla JS (no frameworks) — camera API, file handling, canvas manipulation |
| **Libraries** | Lucide Icons, html2canvas, heic2any |
| **Fonts** | Google Fonts (Inter, Outfit, JetBrains Mono) |

## 📊 Language Composition
- **CSS:** 49.6%
- **JavaScript:** 27.8%
- **HTML:** 22.6%

## 🚀 Getting Started

### Prerequisites
- Modern web browser with support for:
  - HTML5 Canvas & Media APIs
  - CSS Grid & Flexbox
  - ES6+ JavaScript
  - Recommended: Chrome, Firefox, Safari, Edge (latest versions)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/its-Arpan007/HHGOA-ID-Card.git
   cd HHGOA-ID-Card
   ```

2. **Open in Browser**
   - Option A: Double-click `index.html`
   - Option B: Serve with a local server
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```
   - Open `http://localhost:8000` in your browser

3. **No Build Process Required!**
   This is a zero-dependency, static web application. All assets are included.

## 📖 Usage Guide

### Step 1: Choose Your Mode
- Click **Builder ID** (default) or **PFP Frame** card to select format
- See live preview updates as you switch modes

### Step 2: Add Your Photo
- **Camera:** Click "TAKE PHOTO" to capture live from your webcam
  - Position your face inside the guide oval
  - Click CAPTURE, review, and use photo
- **Upload:** Click "UPLOAD PHOTO" or drag & drop image files
  - Supports JPG, PNG, HEIC (auto-converted), HEIF formats

### Step 3: Customize Your Identity
1. **Full Name** — Enter your name (auto-converts to uppercase)
2. **Tech Stack / Role** — Click preset chips or type custom role
3. **Builder Title** — Enter custom title or click ✨ RANDOMIZE for suggestions

### Step 4: Frame & Adjust
- Use **Zoom** slider to scale photo (0.5x to 3x)
- Use **Pan X** & **Pan Y** sliders to position photo
- Click **Reset** to center photo

### Step 5: Export & Share
- **Download PNG** — Save high-res image to your device
- **Share on X** — Opens Twitter with pre-filled caption & #FrameInGoa hashtag

## 📁 Project Structure

```
HHGOA-ID-Card/
├── index.html          # Main HTML structure & DOM elements
├── app.js              # Core JavaScript logic (612 lines)
│   ├── Toast Notification System
│   ├── Camera Stream Lifecycle
│   ├── Text Binding & Auto-Scaling
│   ├── Format Switcher
│   ├── Photo Upload & HEIC Conversion
│   ├── Image Transform Controls
│   ├── HD PNG Export
│   └── X Sharing Integration
├── style.css           # Styling & component library (1000+ lines)
│   ├── CSS Custom Properties (Dark Theme)
│   ├── Header Navbar
│   ├── Hero Section & Mode Selector
│   ├── Control Panel
│   ├── Camera Modal
│   ├── Toast Notifications
│   └── Responsive Design
├── template.jpg        # ID Card background template
├── logo.png            # Hacker House Goa logo
└── assets/             # Additional assets folder
```

## 🎨 Design System

### Color Palette
```css
--primary-green: #0D5C3A        /* Main brand color */
--neon-green: #10B981           /* Accent & glow */
--hacker-yellow: #FACC15        /* Highlight color */
--accent-blue: #38BDF8          /* Secondary accent */
--bg-dark: #080D1A              /* Dark background */
```

### Component Library
- **Buttons** — Primary (green gradient), Secondary (transparent), Text, Icon, Camera triggers
- **Input Fields** — Text inputs with icons and focus states
- **Cards** — Glassmorphic panels with backdrop blur
- **Modal** — Camera capture interface with animations
- **Chips** — Quick-select tech stack buttons

## 🔧 Core Functionality

### Camera & Photo Handling
```javascript
// Dual photo input methods
- startCamera()          // Access device camera with face guide
- handleImageUpload()    // Process JPG/PNG/HEIC files
- HEIC2Any conversion   // Convert iPhone photos to JPEG
- Transform controls    // Zoom, pan, position image
```

### Format Switching
```javascript
// Dynamic mode switching
switchMode('idcard')    // Show Builder ID Card
switchMode('pfp')       // Show PFP Frame overlay
// Both formats share the same photo & text data
```

### Export Pipeline
```javascript
// High-resolution PNG generation
generateCanvasImage()   // html2canvas with 3x scale
downloadGraphic()       // Auto-download with smart filename
shareToX()             // Twitter share with caption
```

### Builder Titles (30 Options)
```javascript
🌴 GOA CODE CHAD        ⚡ SOLANA WIZARD
🧠 AI ARCHITECT         🔮 PROTOCOL SURFER
👑 FULLSTACK CHIEFTAIN  🚀 DEFI ARCHITECT
💻 PROMPT MAGICIAN      🏖️ BEACH BUILDER
// ... and 22 more creative titles
```

## 📱 Responsive Breakpoints

- **Desktop** (1200px+) — Full sidebar + preview side-by-side
- **Tablet** (768px-1199px) — Adjusted spacing & stacked layout
- **Mobile** (<768px) — Full-width form, stacked preview, mobile-optimized

## ♿ Accessibility Features

- ✅ ARIA labels on all interactive elements
- ✅ Semantic HTML (header, main, footer, aside)
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Focus management in modals
- ✅ Color contrast compliance
- ✅ Focus-visible outlines (green glow)

## 🐛 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Camera API | ✅ | ✅ | ✅ | ✅ |
| Canvas/html2canvas | ✅ | ✅ | ✅ | ✅ |
| CSS Grid/Flexbox | ✅ | ✅ | ✅ | ✅ |
| HEIC Conversion | ✅ | ✅ | ⚠️ Fallback | ✅ |

## 🛠️ Troubleshooting

### Camera Not Working?
- Grant camera permissions when prompted
- Check if browser supports getUserMedia API
- Fallback: Use photo upload instead

### HEIC Photos Not Converting?
- Browser will attempt conversion via heic2any
- If failed, try uploading as JPG/PNG instead

### Export Creating Blurry Image?
- Ensure good lighting for photo quality
- Try adjusting zoom/pan for better framing
- Use modern browser (Chrome/Firefox recommended)

## 📝 License

This project is open-source. See repository for license details.

## 🙌 Credits

**Created for:** Hacker House Goa 2026 Builder Community  
**Location:** Goa, India (15.2993° N, 74.1240° E)  
**Hashtag:** #FrameInGoa

---

**Ready to build your identity?** Start creating your Hacker House Goa 2026 badge now! 🚀

For updates & feature requests, visit the [GitHub repository](https://github.com/its-Arpan007/HHGOA-ID-Card).
