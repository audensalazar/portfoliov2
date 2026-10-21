# Auden Salazar Portfolio — GitHub Pages

This static site includes the five featured projects from `Portfolio.pdf` (October 2026). It preserves the yellow/blue Framer-inspired design and original five-page navigation.

## Publish to GitHub Pages
1. Extract the ZIP and upload the **contents** (not the enclosing folder) to your repository root.
2. On GitHub go to Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
3. Open the GitHub Pages URL once deployment finishes.

## Edit projects in one place
`projects.json` is the single source for all featured cards and case studies. Each entry contains:
- `slug`: permanent project address, for example `project.html?slug=social-media-strategy`
- `title`, `summary`, `paragraphs`, `role`, `timeline`, `tools`
- `categories`: any combination of `design`, `writing`, `photography-videography`
- `primary`: label on the project card
- `featured`: true to show on the homepage
- `order`: lower numbers appear first
- `cover`: local photo path such as `assets/images/social-media-cover.jpg`
- `gallery`: image records such as `{ "src": "assets/images/social-post.jpg", "alt": "Social post", "caption": "Campaign graphic" }`
- `links`: records such as `{ "label": "Read article", "url": "https://example.com" }`

To add media, upload image files to `assets/images/`, then enter their relative paths in `projects.json`. Video can be added as a link in `gallery` with `{"type":"video","url":"https://vimeo.com/...","caption":"..."}` or in `links`. No original project photos were available in the PDF; image placeholders deliberately remain text-only until real images are added.

**Preview locally** using VS Code Live Server or `python3 -m http.server 8000`. Opening HTML directly as `file://` will not load JSON in most browsers.

**Note:** Descriptions were based on the supplied Portfolio PDF, with only short new card summaries. No external links were invented. Check the PDF's draft copy for any changes you want to make.
