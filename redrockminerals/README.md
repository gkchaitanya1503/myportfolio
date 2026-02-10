# Red Rock Minerals — Website

Professional website for Red Rock Minerals Pvt Ltd, a laterite mining company based in Andhra Pradesh, India.

## Quick Start
1. Clone this repository
2. Open `index.html` in a browser — the site works immediately
3. No build step required — all libraries loaded via CDN

## AI Chatbot Setup
1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Open `js/chatbot-config.js`
3. Replace `YOUR_ANTHROPIC_API_KEY_HERE` with your actual API key
4. The chatbot will start working immediately

**Note:** The API key is visible in client-side code. For production, consider migrating to a backend proxy (Cloudflare Worker, Vercel Edge Function).

## Contact Form Setup
1. Create a free account at [Formspree](https://formspree.io/) or [Web3Forms](https://web3forms.com/)
2. Create a new form and get your form endpoint URL
3. Update the `action` attribute in the contact form (`contact.html`) with your endpoint

## GitHub Pages Deployment
1. Push to the `main` branch
2. Go to **Settings > Pages > Source**: Deploy from branch (main, /root)
3. Site will be live at `https://<username>.github.io/redrockminerals/`

## Custom Domain (Later)
1. Register your domain (e.g., redrockminerals.in)
2. Add domain to the `CNAME` file
3. Update DNS to point to GitHub Pages
4. Enable HTTPS in Settings > Pages

## Customization
- **Content:** Edit HTML files directly
- **Colors:** Modify CSS variables in `css/styles.css`
- **Chatbot knowledge:** Update the system prompt in `js/chatbot-config.js`
- **Contact form:** Update Formspree/Web3Forms endpoint in `contact.html`
- **Images:** Replace placeholder areas in `images/` folder

## Tech Stack
- HTML5, CSS3, Vanilla JavaScript
- Tailwind CSS (CDN)
- Google Fonts (Orbitron, Rajdhani, Inter, JetBrains Mono)
- Font Awesome 6 (CDN)
- Particles.js (CDN)
- GSAP (CDN)
- Anthropic Claude API (chatbot)

## File Structure
```
redrockminerals/
├── index.html          # Home page
├── products.html       # Mineral products
├── industries.html     # Industries served
├── exports.html        # Export capabilities
├── about.html          # Company info
├── contact.html        # Contact form & map
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Search engine directives
├── CNAME               # Custom domain (future)
├── css/
│   ├── styles.css      # Main futuristic theme
│   └── chatbot.css     # Chat widget styles
├── js/
│   ├── main.js         # Navigation, scroll, counters, particles
│   ├── form.js         # Contact form validation
│   ├── chatbot.js      # Chat UI & API integration
│   └── chatbot-config.js  # API key & system prompt
└── images/             # Image assets (placeholders)
```
