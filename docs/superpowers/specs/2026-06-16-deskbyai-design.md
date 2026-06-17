# DeskByAI — Design Document

**Date**: 2026-06-16  
**Status**: Draft  
**Authors**: User + Codex  

---

## 1. Overview

DeskByAI is an English-language affiliate content site that sells desk setup solutions through AI-generated visual schemes. Instead of a traditional product review format, it presents complete "desk makeover plans" — a high-quality AI-generated room scene with a curated product list and Amazon affiliate links.

The core insight: users don't know what to buy, but they know what looks good. We show them a picture, they want it, and we give them a one-click shopping list.

## 2. Target Audience

- **Designers** looking for an aesthetically pleasing workspace
- **Remote workers / digital nomads** upgrading their home office
- **Desk enthusiasts** browsing for inspiration with intent to buy
- **Primary market**: US and English-speaking countries (Amazon.com)

## 3. Value Proposition

> "See a desk setup you love? Here's exactly what's in it, and you can buy it all right now."

## 4. Monetization

**Primary**: Amazon Associates affiliate program. Each product in a scheme links to Amazon.com with the user's affiliate tag.

**Secondary (future)**: 
- Sponsored schemes (desk brands pay for placement)
- Premium downloadable scheme blueprints (e.g., cable routing diagrams)
- Not in scope for MVP.

## 5. Content Model

Each **scheme** = one publishable page with:

1. **AI-generated hero image** — photorealistic room scene of the desk setup
2. **Scheme title & short description** — what vibe, who it's for
3. **Product list** — 5-15 items, each with:
   - Product name
   - Price
   - Amazon affiliate link
   - Brief why-it-works note
4. **Total price** of the full setup
5. **Tags** — style, budget tier, occupation

## 6. Site Structure (MVP)

`
Homepage
├── Featured schemes (hero carousel)
├── Scheme grid (filterable: style / budget / occupation)
│
├── Scheme Detail Page
│   ├── Hero image
│   ├── Description
│   ├── Product list with affiliate links
│   └── Tags
│
├── About Page
    └── Brief "what we do"
`

## 7. Technology Stack

- **Static site**: HTML + CSS + vanilla JS
- **Hosting**: GitHub Pages or Vercel (free tier)
- **Image generation**: GPT Image 2 (gpt-image-2) via built-in image_gen tool
- **Domain**: Free subdomain initially (e.g., deskbyai.pages.dev), custom domain later

## 8. Content Pipeline (how a scheme is made)

1. **User provides direction**: e.g. "try a warm cozy designer desk under "
2. **Codex writes the prompt** for GPT Image 2
3. **Image generated** and saved to workspace
4. **Codex writes the page** — HTML with the image, product list, affiliate links
5. **User reviews** — "这个味对不对"
6. **Deploy**

## 9. First Batch Schemes (MVP — 5 schemes)

| # | Title | Target Audience | Budget |
|---|-------|----------------|--------|
| 1 | Minimalist Designer Desk | Creative professionals | -900 |
| 2 | Cyberpunk Night Setup | Gamers / tech enthusiasts | -1200 |
| 3 | Warm Cozy Workspace | Remote workers | -700 |
| 4 | Budget Desk Upgrade | Students / first-timers | < |
| 5 | The Wireless Clean Setup | Minimalists / cable haters | -800 |

## 10. Success Criteria (First 3 Months)

- **Month 1**: Site live with 5-10 schemes. Content indexed by Google.
- **Month 2**: Organic traffic starts (50-200 visitors/day). First affiliate commissions.
- **Month 3**: 20-30 schemes online. Target -200/month in passive affiliate income.

## 11. Out of Scope (MVP)

- User accounts / login
- Custom AI scheme generator for users
- Paid consultations
- Email newsletter (add later)
- Analytics beyond basic Google Search Console

---

## 12. Update log

- 2026-06-16: Initial design draft
