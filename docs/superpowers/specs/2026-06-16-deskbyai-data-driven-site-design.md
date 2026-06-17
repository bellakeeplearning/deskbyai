# DeskByAI — Data-Driven Site Architecture

## 1. Goal

Eliminate manual HTML editing for adding new desk setup schemes. Move all content into a JSON data file, then auto-generate both the gallery page and detail pages with a Node.js script.

## 2. Architecture

```
site/
├── data.json              ← new: all content lives here
├── generate.js            ← new: reads data.json, writes HTML
├── index.html             ← generated
├── css/style.css          ← unchanged (already optimized)
├── images/*.png           ← unchanged
└── schemes/*.html         ← generated
```

## 3. Data Model (`data.json`)

```json
[
  {
    "id": "minimalist-designer-desk",
    "title": "Minimalist Designer Desk",
    "tags": ["Minimalist", "Designer", "Mid-Range"],
    "budget": 689,
    "desc": ["A clean, distraction-free workspace...", "The palette is warm neutrals..."],
    "img": "images/minimalist-designer.png",
    "products": [
      {
        "name": "Jarvis Bamboo Standing Desk",
        "note": "The foundation — warm bamboo top...",
        "price": null,
        "color": "#e0ddd8",
        "link": "https://amazon.com/dp/EXAMPLE?tag=deskbyai-20"
      }
    ]
  }
]
```

Key decisions:
- `budget` is a number (null if unset), formatted at render time
- `price` per product is a string or null (allows "$39 - $59" ranges later)
- `desc` is an array of paragraphs
- `products.link` is a full URL so future scripts can swap the tag

## 4. Generator (`generate.js`)

Side-effect-free script: reads `data.json`, writes all `.html` files.

### Template system
Use plain string interpolation (no framework — this is a build-time, not runtime). Templates embedded in the script as backtick strings.

### Output files

**`index.html` — Gallery page:**
- HTML skeleton (header, hero, filter bar, footer)
- JS `const schemes = [...]` embedded with all scheme metadata (id, title, tags, budget, img, desc)
- Same `renderCards()` function as current — keeps filter working client-side

**`schemes/{id}.html` — Detail pages:**
- HTML skeleton (header, breadcrumb, hero image, desc, product list)
- Product items rendered from data

### Migration Concern: Existing Content
The existing scheme detail pages have detailed product descriptions that were hand-written. The generator must preserve these verbatim when porting them to the new data model.

## 5. Workflow

```
node generate.js
```

Output: `index.html` + all `schemes/*.html` overwritten with current data.

No server, no watcher, no dev dependencies. Run on demand before deploy.

## 6. Adding a New Scheme

1. Paste a new entry at the end of `data.json`
2. Drop the image into `images/`
3. Run `node generate.js`
4. Deploy

~30 seconds per new scheme.

## 7. What Doesn't Change

- `css/style.css` — untouched
- `images/*` — untouched
- `schemes/` — files are regenerated, same URLs
- `index.html` — regenerated, same URLs
- All URLs, anchor IDs, class names — stable

## 8. Non-Goals (for this iteration)

- No build tooling (Vite, Webpack, etc.)
- No framework (React, etc.)
- No CMS
- No blog/article system
- No runtime JS framework — still pure static HTML
- No price scraping or Amazon API integration

