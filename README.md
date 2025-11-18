# 🚀 Gustave 3D Interactive Resume

A stunning 3D interactive portfolio website built with Three.js, combining cyberpunk aesthetics, rock & roll vibes, and cartoon elements. Navigate through different scenes to explore my skills, projects, and experience in an immersive way.

## ✨ Features

### 🎬 Interactive 3D Scenes
- **Home Scene**: Welcome area with floating neon elements and particles
- **Cyberpunk City**: About me section with neon skyline and holographic business card
- **Rock Stage**: Skills showcase with interactive instruments
- **Arcade**: Projects displayed as retro arcade machines
- **Timeline**: Work experience in a sci-fi time tunnel (coming soon)
- **Galaxy**: Education background as planetary system (coming soon)
- **Cartoon Park**: Hobbies and interests (coming soon)
- **Network Node**: Contact information (coming soon)

### 🎨 Visual Effects
- Neon glow materials
- Particle systems
- Dynamic lighting
- Smooth scene transitions with GSAP
- Post-processing effects
- Cyberpunk glitch aesthetics

### 🎮 User Interaction
- Mouse/touch controls for camera rotation
- Keyboard navigation (WASD)
- Click-to-interact objects
- Responsive design for all devices
- Quality settings (High/Medium/Low)
- Multi-language support (EN/ZH/FR)

### 🔊 Audio System
- Background music
- UI sound effects
- 3D spatial audio
- Volume controls

## 🛠 Tech Stack

- **3D Engine**: Three.js
- **Animation**: GSAP
- **Build Tool**: Webpack 5
- **Transpiler**: Babel
- **Languages**: JavaScript (ES6+), HTML5, CSS3

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd 3D_Resume_2

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🚀 Development

### Project Structure
```
3D_Resume_2/
├── src/
│   ├── index.js              # Entry point
│   ├── index.html            # HTML template
│   ├── components/           # Core components
│   │   ├── Application.js    # Main app logic
│   │   ├── SceneManager.js   # Scene switching system
│   │   ├── InputController.js# Input handling
│   │   └── AudioManager.js   # Audio system
│   ├── scenes/              # 3D scenes
│   │   ├── BaseScene.js     # Base scene class
│   │   ├── HomeScene.js
│   │   ├── CyberpunkCityScene.js
│   │   ├── RockStageScene.js
│   │   └── ArcadeScene.js
│   ├── utils/               # Utilities
│   │   └── helpers.js
│   ├── styles/              # CSS styles
│   │   └── main.css
│   └── assets/              # Assets
│       ├── models/          # 3D models
│       ├── textures/        # Textures
│       ├── audio/           # Audio files
│       └── fonts/           # Fonts
├── public/                  # Static files
├── webpack.config.js        # Webpack configuration
├── package.json
└── README.md
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Alias for dev

### Performance Optimization

- Lazy loading of 3D assets
- Level of Detail (LOD) for complex models
- Efficient material reuse
- Geometry instancing
- Texture atlasing
- Code splitting

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Webpack configuration
- [x] Basic 3D scene architecture
- [x] Scene switching system

### Phase 2: Core Scenes (In Progress)
- [x] Home scene
- [x] Cyberpunk City scene
- [x] Rock Stage scene
- [x] Arcade scene
- [ ] Timeline scene
- [ ] Galaxy scene
- [ ] Cartoon Park scene
- [ ] Network Node scene

### Phase 3: Interactivity
- [ ] Click interactions
- [ ] Keyboard navigation
- [ ] Touch gestures
- [ ] Camera controls
- [ ] Mini-map

### Phase 4: Audio & Effects
- [ ] Background music
- [ ] Sound effects
- [ ] Post-processing
- [ ] Particle effects
- [ ] Glitch effects

### Phase 5: Content
- [ ] Add actual resume content
- [ ] Project showcases
- [ ] Skill details
- [ ] Contact form

### Phase 6: Polish & Deploy
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Mobile optimization
- [ ] Deployment to Vercel/Netlify

## 🎨 Design Philosophy

This project combines three distinct visual styles:

1. **Cyberpunk**: Neon lights, holographic elements, dystopian city
2. **Rock & Roll**: Stage setup, instruments, concert lighting
3. **Cartoon**: Bright colors, playful elements, friendly aesthetics

The goal is to create an unforgettable experience that showcases technical skills while being fun to explore.

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

WebGL 2.0 support required.

## 📝 License

MIT License - feel free to use this project as inspiration for your own portfolio!

## 👨‍💻 Author

**Gustave**
- Portfolio: [Coming Soon]
- GitHub: [@cake11298](https://github.com/cake11298)

## 🙏 Acknowledgments

- Three.js community
- GSAP for amazing animations
- All the awesome open-source contributors

---

**Made with ❤️ and Three.js**

🎸🤘 Rock on! 🤘🎸
