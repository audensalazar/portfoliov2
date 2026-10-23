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

## Project cards and case-study layout
- Project cards show **role tags** (from each entry’s `role` field in `projects.json`) instead of a single category label. Separate each role with a comma.
- Project detail pages use this order: **Title → Featured photo → About → My Role / Timeline / Tools**. The optional selected-work gallery and links appear afterward.
- To add the featured photo, upload it to `assets/images/` and set its relative path in that project’s `cover` field (example: `assets/images/panther-tracks.jpg`). An intentional placeholder displays if `cover` is empty.
- Tags are text labels styled like buttons, not links; clicking the image or title opens the case study.

## Role tags update
Role labels now appear as filled blue chips immediately below each project image and above the project title. They come from the `role` field in `projects.json`. Replace both `script.js` and `style.css` when updating an existing deployment.

## This update (images + tag visibility)
- Three photos are bundled in `assets/images/` and assigned in `projects.json`: Alumni Week, Panther Tracks, and Prep Post.
- Role tags are **directly underneath each project image** on all project cards. They are pre-rendered in HTML, so they stay visible even when the browser cannot fetch JSON.
- Replace **all** files at the repository root, including `index.html`, `design.html`, `writing.html`, `photography-videography.html`, `script.js`, `style.css`, `projects.json`, and `assets/images/`. The HTML has pre-rendered tags and cache-busting resource URLs.
- To update role labels later, edit `projects.json`. For changes to also appear in the static fallback, rebuild the page HTML or ask for a regenerated package.
- Project pages follow Title → Photo → About → Role / Timeline / Tools.


## Framer source fidelity update (v6)
- Uses exact *remote* Geist Pixel, IBM Plex Serif and General Sans URLs from the provided Framer homepage HTML.
- Applies Framer yellow `#FFE500`, cobalt `#2449E8`, and a 1120px-wide navigation bar.
- **Removes CSS black backgrounds** behind transparent cover images and case-study hero images.
- Keeps five featured projects, role-tag pills, linked project details and the three PNG assets.
- Note: if an image itself contains opaque dark pixels, CSS cannot remove those pixels; the PNG needs editing.
- To deploy, upload the **contents** of this ZIP to the repository root, replacing matching files.
- Content remains editable in `projects.json`; image paths use `assets/images/`.


## v7 project-grid updates
- Cards now show images, titles, descriptions, and then role tags (in that order).
- Cards subtly lift and images scale on mouse hover; reduced-motion preferences are respected.
- A responsive 3/2/1 column grid keeps cards aligned.
- Replace or upload images to `assets/images/` and update each entry's `cover` in `projects.json`. The newer images sent inline in chat were not available for inclusion in this ZIP; current images are retained.
- Upload **all** extracted files to GitHub since HTML, JavaScript and CSS changed.
