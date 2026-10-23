# Portfolio — Version 11

Upload all files and folders from the extracted ZIP to the **root** of your GitHub Pages repository.

## New in v11
- Social Media Strategy now uses `assets/images/social-media-strategy.png` for its cover and detail page.
- The Photography / Videography page has a custom editorial masonry-like mosaic with 11 photographs.
- Click a photograph to enlarge it; use the **Escape** key or the Close button to exit, and arrow keys to browse.
- Photographs live in `assets/images/photography/`. Update the gallery HTML if you add more pictures.
- Your five existing case studies, role tags, typography, and hover style remain.

## Editing
- Project copy, cover images and role tags: `projects.json`.
- Gallery layout: `style.css` under V11 photography exhibition.
- Gallery content: `photography-videography.html` in `.photo-mosaic`.
- Images: `assets/images/`.

## Publishing
1. Unzip. 2. Upload **contents** (not the parent directory) to GitHub. 3. Commit to your published branch. 4. Wait for GitHub Pages deployment and hard-refresh.


## Version 12
- Photography / Videography page updated to an interactive Photo Stack layout.
- Uses all 11 uploaded photography images from `assets/images/photography/`.
- Includes sidebar controls and a keyboard-accessible lightbox.


## Video showcase (version 13)

The Photography/Videography page contains a new **In motion** grid below the photo stack. No placeholder videos appear until you add entries to `videos.json`.

Paste items as a JSON array using the format below (remove the comments; JSON does not support them):

```json
[
  {
    "title": "Your video title",
    "platform": "youtube",
    "url": "https://www.youtube.com/watch?v=REPLACE_WITH_REAL_ID",
    "description": "Optional short context",
    "thumbnail": "assets/images/video-covers/your-cover.jpg"
  }
]
```

Supported `platform` values: `youtube`, `vimeo`, `instagram`. Use real public video URLs and optionally upload thumbnail images to the matching repository paths. The responsive gallery will show a Play button even without thumbnail images. Embeds load only after click. Instagram may restrict embedding for some posts, so the modal also includes an external watch link. Keep content publicly accessible for visitors.

The photo stack has no visible descriptive captions; concise `alt` values remain in its manifest for accessibility.

## V16: Video showcase
Five videos are configured in `videos.json`: one YouTube video, two Vimeo videos (privacy hashes retained), and two Instagram Reels. The Reel labels are temporary because no titles were supplied. Instagram may restrict third-party embeds; the lightbox has a link to watch directly on Instagram. Updating a video requires editing only `videos.json`.


## Version 17 — Vimeo thumbnails + native Instagram embeds
- Vimeo acceptance video cover: `assets/images/video-covers/accepted.jpg`.
- Vimeo computer science video cover: `assets/images/video-covers/computerscience.jpg`.
- Instagram Reels render as native Instagram iframe embeds and retain a link to Instagram as a fallback if third-party embeds are blocked. Instagram controls the content and availability of embeds.
- Edit video entries in `videos.json`.
- When deploying, upload `videos.json`, `script.js`, `style.css`, `photography-videography.html`, and the complete `assets/images/video-covers/` folder.
