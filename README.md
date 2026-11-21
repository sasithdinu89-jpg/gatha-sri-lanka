# ☸ සිංහල බෞද්ධ ගාථා සංග්‍රහය (Sinhala Buddhist Gatha Collection)

A serene, elegant, and fully responsive static website designed for hosting on **GitHub Pages**. This digital sanctuary showcases high-quality Sinhala Buddhist Gathas, Pirith, and Vandana cards for daily chanting, contemplation, and peaceful reflection.

---

## 🌿 Design & Aesthetic Philosophy

- **Visual Blending:** Evokes a calm, respectful temple atmosphere inspired by traditional Sri Lankan monastic aesthetics and modern minimalism.
- **Palette:** Soft parchment and cream foundations (`#FAF7F2`), warm antique gold accents (`#C5A059`, `#8C6D37`), and deep charcoal text (`#201C17`).
- **Twilight Meditation Mode:** Seamless toggle between daytime warm parchment and nighttime dark temple twilight mode.
- **Temple Singing Bowl Chime:** Synthesizes a soothing 432Hz harmonic bronze singing bowl chime natively via the browser's Web Audio API (zero external audio files required).
- **Typography:** Built for clarity with Google Fonts **Noto Serif Sinhala**, **Noto Sans Sinhala**, **Cinzel**, and **Plus Jakarta Sans**.

---

## 📂 Project Directory Structure

```text
sinhala-gatha-web/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated pre-flight validation & GitHub Pages deployment
├── .gitignore                  # Git ignore rules for OS & temporary files
├── index.html                  # Main landing page & gallery
├── CNAME.example               # Template for optional custom domain setup
├── assets/
│   ├── css/
│   │   └── style.css           # Custom styling & serene visual blending
│   ├── js/
│   │   └── app.js              # Client-side filtering, modal viewer, & theme adjustments
│   └── data/
│       └── gathas.json         # Metadata registry (titles, categories, descriptions, filenames)
├── images/
│   └── gathas/
│       ├── vandana/
│       │   ├── 01-namaskaram.jpg
│       │   └── 02-buddha-vandana.jpg
│       ├── pirith/
│       │   ├── maha-mangala-suthraya.png
│       │   ├── rathana-suthraya.png
│       │   ├── karaneeya-metta.jpg
│       │   ├── jaya-piritha.png
│       │   └── nawa-graha-piritha-sinhala.png
│       └── bhavana/
│           └── 01-maithri-bhavana.jpg
└── README.md                   # Documentation & deployment guide
```

---

## 🚀 Quick Start & Local Preview

Because this is a pure static website (HTML5, CSS, and Vanilla JavaScript), it requires no build steps or bundlers.

To run locally:

### Option 1: Using Python (Recommended)
```bash
# In the project root directory:
python3 -m http.server 8080
```
Open your browser and navigate to: [http://localhost:8080](http://localhost:8080)

### Option 2: Using Node.js / npx
```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click on `index.html` and click **"Open with Live Server"**.

---

## 📝 How to Add New Gatha Images

Adding new Gathas is completely JSON-driven. You never need to touch the HTML or JavaScript.

### Step 1: Save the Gatha Image
1. Prepare your high-resolution card image (portrait ratio `3:4` or `1200x1600` is recommended).
2. Place the image in the appropriate folder under `images/gathas/`:
   - `images/gathas/vandana/` (for Vandana & homage)
   - `images/gathas/pirith/` (for Pirith suttas)
   - `images/gathas/bhavana/` (for meditation verses)
   - Or create a new category subfolder (e.g., `images/gathas/special/`)

*Example:* `images/gathas/vandana/03-dhamma-vandana.jpg`

### Step 2: Register in `assets/data/gathas.json`
Open `assets/data/gathas.json` and append a new JSON object to the array:

```json
{
  "id": "vandana-03",
  "titleSinhala": "ධම්ම වන්දනාව (ස්වාක්ඛාතෝ...)",
  "titleEnglish": "Dhamma Vandanā (Virtues of the Dhamma)",
  "category": "vandana",
  "categoryNameSinhala": "වන්දනා",
  "categoryNameEnglish": "Vandana",
  "image": "images/gathas/vandana/03-dhamma-vandana.jpg",
  "summary": "ස්වාක්ඛාතෝ භගවතා ධම්මෝ ආදී සය වැදෑරුම් ධර්ම ගුණ සිහිපත් කිරීම.",
  "versePali": "ස්වාක්ඛාතෝ භගවතා ධම්මෝ, සන්දිට්ඨිකෝ, අකාලිකෝ, ඒහිපස්සිකෝ, ඕපනයිකෝ, පච්චත්තං වේදිතබ්බෝ විඤ්ඤූහී’ති.",
  "meaningSinhala": "භාග්‍යවතුන් වහන්සේ විසින් මනා කොට දේශනා කරන ලද, තමා විසින්ම දැක්ක යුතු, කල් නොයවා ඵල දෙන, එව බලවයි කීමට සුදුසු, තම සිත් තුළට පමුණුවාගත යුතු, නුවණැත්තන් විසින් තම තමන්ගේ නැණ පමණින් දැකගත යුතු වූ ශ්‍රී සද්ධර්මයට මාගේ නමස්කාරය වේවා!",
  "meaningEnglish": "Well proclaimed is the Dhamma by the Blessed One, to be seen for oneself, timeless, inviting inspection, leading onward, to be realized by the wise for themselves.",
  "blessing": "උතුම් ශ්‍රී සද්ධර්මයට මම නමස්කාර කරමි!",
  "tags": ["dhamma", "swakkhato", "ධම්ම වන්දනා", "ධර්ම ගුණ", "vandana"]
}
```

#### JSON Field Reference:
| Field | Description | Example |
|---|---|---|
| `id` | Unique slug used for deep-linking (`#vandana-03`) | `"vandana-03"` |
| `titleSinhala` | Main heading in Sinhala script | `"ධම්ම වන්දනාව"` |
| `titleEnglish` | Transliterated or English title | `"Dhamma Vandanā"` |
| `category` | Filter key (`vandana`, `pirith`, `bhavana`, etc.) | `"vandana"` |
| `categoryNameSinhala` | Display label in Sinhala | `"වන්දනා"` |
| `categoryNameEnglish` | Display label in English | `"Vandana"` |
| `image` | Relative path to the image file | `"images/gathas/vandana/03-dhamma-vandana.jpg"` |
| `summary` | Short card description (1-2 sentences) | `"ස්වාක්ඛාතෝ භගවතා ධම්මෝ..."` |
| `versePali` | Complete Pali verse in Sinhala script | `"ස්වාක්ඛාතෝ භගවතා ධම්මෝ..."` |
| `meaningSinhala` | Full Sinhala explanation | `"භාග්‍යවතුන් වහන්සේ විසින්..."` |
| `meaningEnglish` | English translation | `"Well proclaimed is the Dhamma..."` |
| `blessing` | Reverent closing line | `"සාදු! සාදු! සාදු!"` |
| `tags` | Array of search keywords | `["dhamma", "ධර්මය", "vandana"]` |

---

## 🌐 Deploying to GitHub Pages

### 🏆 Which Deployment Method is Better?

| Feature | 🥇 GitHub Actions (Recommended) | 🥈 Deploy from a Branch |
| :--- | :--- | :--- |
| **Official Recommendation** | **Yes (Current GitHub Pages standard)** | Legacy method |
| **Automated Data Validation** | **Yes:** Checks JSON syntax & verifies all images exist before publishing | **No:** Publishes blindly even if images/JSON are broken |
| **Build & Deploy Logs** | **Yes:** Detailed step-by-step logs in the Actions tab | **No:** Opaque background process |
| **Safe CNAME Handling** | **Yes:** Automatically removes placeholder comments to avoid DNS errors | **No:** Fails if CNAME contains comments |
| **Manual Re-deploy** | **Yes:** One-click re-run (`workflow_dispatch`) | **No:** Requires pushing dummy commits |
| **Future Extensibility** | Easy to add image compression, linting, sitemap generation | None |

> **Verdict:** **GitHub Actions** is the strongly recommended modern way. It ensures that any changes to `gathas.json` or image files are automatically verified before going live, preventing broken links and publishing errors.

---

### 🚀 Recommended Setup: Using GitHub Actions

#### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "feat: complete Sinhala Buddhist Gatha collection with automated deployment"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

#### Step 2: Switch Pages Source to GitHub Actions
1. Open your repository on GitHub.
2. Navigate to **Settings** > **Pages** (in the left sidebar).
3. Under **"Build and deployment"** > **Source**, choose **GitHub Actions**.
4. That's it! The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) will trigger automatically on every push to `main`, run pre-flight integrity tests, and publish your website.

Your website will be live at:
`https://<your-username>.github.io/<your-repo-name>/`

---

### 🥈 Alternative Setup: Deploy from a Branch (Legacy)
If you prefer not to use Actions:
1. Go to **Settings** > **Pages**.
2. Under **"Build and deployment"** > **Source**, select **Deploy from a branch**.
3. Under **Branch**, select **`main`** and **`/ (root)`**, then click **Save**.

---

## 🏷️ Custom Domain Setup (Optional)

If you have a custom domain (e.g., `gathas.lk` or `gatha.mydomain.com`):

1. Copy `CNAME.example` to `CNAME`:
   ```bash
   cp CNAME.example CNAME
   ```
2. Put **only** your naked domain name on a single line (no comments, no `https://`):
   ```text
   gathas.lk
   ```
3. In your DNS provider (e.g., Cloudflare, Namecheap, GoDaddy):
   - For a subdomain (`gatha.mydomain.com`): add a `CNAME` record pointing to `<your-username>.github.io`
   - For an apex domain (`mydomain.com`): add `A` records pointing to GitHub's IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`)
4. In GitHub Repository > **Settings** > **Pages**, enter your custom domain and enable **"Enforce HTTPS"**.

---

## ✨ Features Checklist

- [x] **Responsive CSS Grid:** Adapts seamlessly across mobile, tablet, desktop, and ultra-wide screens.
- [x] **Category Filtering:** Filter Gathas by category (*Vandana*, *Pirith*, *Bhavana*, etc.) with instant results count.
- [x] **Live Instant Search:** Search across Sinhala titles, English transliterations, verses, meanings, and tags.
- [x] **Immersive Lightbox Modal:** Fullscreen view, interactive zoom toggle (1x / 1.75x), prev/next controls, and keyboard navigation (`Left`, `Right`, `Esc`, `Z`).
- [x] **One-Click Download:** Download pristine high-resolution JPEG files.
- [x] **Native Sharing & Deep-Linking:** Uses the Web Share API with clipboard copy fallback and direct anchor hash links (e.g., `#vandana-01`).
- [x] **Web Audio API Singing Bowl:** Serene 432Hz bronze bowl chime synthesized without external dependencies.
- [x] **Day Parchment & Twilight Themes:** Persistent dark mode toggle saved in `localStorage`.
- [x] **Printer-Friendly:** Printable cards designed for altar and shrine-room use.

---

## 🙏 Dedication & Merits (පුණ්‍යානුමෝදනාව)

May this digital collection bring serenity, mindfulness, and the light of Dhamma to all who visit.

> **සබ්බදානං ධම්මදානං ජිනාති**  
> *"The gift of Dhamma excels all other gifts."*
# gatha-sri-lanka
