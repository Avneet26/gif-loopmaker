# 🎵 LooperVid — Create Looping Videos with Music

> The fastest way to turn GIFs and images into YouTube-ready looping videos with audio.

**LooperVid** is a free, browser-based video creation tool designed for creators who need seamless looping videos — perfect for slowed+reverb edits, lo-fi visualizers, aesthetic compilations, and ambient music videos. No downloads, no sign-ups, no file uploads to servers. Everything runs locally in your browser, powered by multi-threaded WebAssembly.

🔗 **[Start Creating → loopervid.com](https://www.loopervid.com/)**

![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)
![FFmpeg.wasm](https://img.shields.io/badge/Powered%20by-FFmpeg.wasm-007808?style=flat-square)
![Version](https://img.shields.io/badge/Version-2.0-blueviolet?style=flat-square)
![License MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## ⚡ What's New in V2.0

LooperVid V2.0 is a ground-up performance and experience overhaul:

- 🚀 **Multi-Threaded WASM Engine** — Processing is now up to 15x faster using `ffmpeg-core-mt` with `SharedArrayBuffer` workers, enabled via a `coi-serviceworker` bypass for cross-origin isolation
- 🎛️ **Granular Export Controls** — Choose your exact **video resolution** (720p, 1080p, 2K, 4K) and **audio bitrate** (128, 192, 256, 320 kbps)
- 🌗 **Light & Dark Theme** — System-aware theme switching with persistent preference
- 🎨 **Glassmorphism UI** — Entirely redesigned interface with frosted-glass panels, gradient accents, and smooth micro-animations
- 🎯 **Mouse-Reactive Grid Background** — Subtle animated canvas grid with a radial spotlight that follows your cursor
- ⏱️ **Smart Progress Tracking** — Real-time percentage, elapsed time, and estimated time remaining
- 🎵 **Custom Audio Player** — Minimal, theme-aware player with seek, play/pause, and track info — replaces the ugly browser default
- 📦 **50MB File Support** — Increased from 30MB, taking advantage of the faster multi-threaded engine
- ♿ **Full Accessibility** — Skip-nav links, ARIA landmarks, semantic HTML, keyboard-navigable accordions

---

## 🎬 Perfect For

| Use Case | Description |
|----------|-------------|
| 🎧 **Slowed + Reverb** | Create those viral music videos with aesthetic GIF loops |
| 🌃 **Lo-fi / Chill Beats** | Background visuals for relaxing music |
| ✨ **Aesthetic Edits** | Anime, nature, or art GIFs with music |
| 🎵 **Music Visualizers** | Simple looping visuals for your tracks |
| 📱 **Social Content** | Quick video creation for YouTube, Instagram, TikTok |

---

## 📖 How It Works

1. **Upload your visual** — Drag & drop or browse. Supports GIF, JPG, PNG, and WebP.
2. **Upload your audio** — Add your track in MP3, M4A, WAV, or OGG format.
3. **Choose export settings** — Pick your video resolution (720p → 4K) and audio bitrate (128 → 320 kbps).
4. **Hit "Process & Render Video"** — Watch the multi-threaded engine work with real-time progress and ETA.
5. **Download** — Your high-quality MP4 is ready for any platform.

---

## 🔒 Privacy First

**Your files never leave your device.**

LooperVid uses [FFmpeg.wasm](https://ffmpegwasm.netlify.app/) to process everything locally in your browser using WebAssembly. Zero server uploads. Zero tracking. Zero data collection.

- ✅ No file uploads to any server
- ✅ No user accounts or sign-ups
- ✅ 100% client-side processing
- ✅ Works offline after first load

---

## 🔃 V1.0 → V2.0 Changelog

| Area | V1.0 | V2.0 |
|------|------|------|
| **Processing Engine** | Single-threaded `ffmpeg-core` | Multi-threaded `ffmpeg-core-mt` with web workers |
| **Speed** | Standard WASM encoding | Up to 15x faster with `SharedArrayBuffer` + `coi-serviceworker` |
| **Quality Controls** | 3 presets: Fast, Balanced, High | Granular resolution (720p/1080p/2K/4K) + bitrate (128–320 kbps) |
| **Max File Size** | 30MB | 50MB |
| **Theme** | Light only | System-aware Light & Dark with persistent toggle |
| **UI Design** | Basic flat cards | Glassmorphism panels with backdrop-blur and gradients |
| **Audio Player** | Browser default `<audio>` element | Custom minimal player with seek, timers, and theme awareness |
| **Progress** | Simple text status | Numbered percentage bar + elapsed time + ETA |
| **Accessibility** | Minimal | Full ARIA landmarks, skip-nav, `aria-expanded` accordions |
| **Security Headers** | HSTS only | HSTS + X-Frame-Options + Referrer-Policy + Permissions-Policy |
| **Content Protection** | None | AI training bots blocked (GPTBot, CCBot, etc.) |

---

## ⚙️ Technical Details

- All processing happens client-side using WebAssembly (multi-threaded)
- Output format: MP4 (H.264 video + AAC audio)
- Optimized for YouTube with `-movflags +faststart`
- Maximum file size: 50MB per file
- Cross-origin isolation via `coi-serviceworker` for `SharedArrayBuffer` support

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome / Edge | ✅ Full support (multi-threaded) |
| Firefox | ✅ Full support (multi-threaded) |
| Safari 16.4+ | ✅ Supported |
| Mobile browsers | ✅ Supported (processing may be slower) |

---

## 🔧 Troubleshooting

<details>
<summary><strong>⚠️ "Failed to load FFmpeg"</strong></summary>

- Check your internet connection (FFmpeg loads from CDN on first use)
- Hard-refresh the page (Ctrl+Shift+R / Cmd+Shift+R)
- Ensure your browser supports SharedArrayBuffer
</details>

<details>
<summary><strong>🐌 Processing is slow</strong></summary>

- Lower the resolution to 720p and audio bitrate to 128 kbps
- 2K and 4K exports require significantly more time and memory
- Close other browser tabs to free resources
</details>

<details>
<summary><strong>💥 Browser crashes or freezes</strong></summary>

- Reduce resolution to 1080p and use files under 30MB
- Close other browser tabs to free memory
- Try on a desktop/laptop instead of mobile
</details>

<details>
<summary><strong>🎬 Output looks blurry</strong></summary>

- Increase the video resolution in Export Settings
- Match the export resolution to your source image quality — upscaling a low-res image to 4K won't improve clarity
</details>

<details>
<summary><strong>🔊 Audio quality is poor</strong></summary>

- Increase the audio bitrate to 256 or 320 kbps
- Use a high-quality source file (MP3 at 320 kbps or WAV)
</details>

---

## 📄 License

MIT © 2024 [Avneet Virdi](https://github.com/Avneet26)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Avneet26"><strong>Avneet Virdi</strong></a>
  <br><br>
  <a href="https://www.loopervid.com/"><strong>🎵 Start Creating → loopervid.com</strong></a>
</p>
