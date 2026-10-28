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

## V18 video updates
- YouTube video renamed **For Others — The Seattle Prep Experience**.
- Removed all platform captions.
- Landscape films are displayed in a consistent two-column gallery.
- The two Instagram-native Reel players are displayed side-by-side in a dedicated section (single column on narrow phones).
- Edit video titles and links in `videos.json`. Instagram embeds may be blocked by browser privacy settings; direct links remain below each reel.


## Version 19 changes
- Photography headline and introduction revised; Photo Stack instructional text removed.
- Video heading and subtitle updated; three-across desktop video grid, descriptions for all three long-form videos and the short-form section.
- Project detail pages pair featured image on the left with About on the right at desktop widths, stacking on mobile.
- Site navigation uses the same content container edges as the page.
- Updated static pages and JSON loader version query strings to v19.


## v20 corrections
- Removed the photography “Through my lens” heading and caption entirely.
- Navbar now uses the same responsive left and right margins as `.wrap` content on every page.
- Bumped CSS/JS query versions to v20 to avoid stale browser CSS.


## Version 21 — Copy updates
Updated from the user's annotated copy worksheet. Fields left blank in the worksheet retain their prior text. Panther Tracks now includes two external article buttons; the Instagram Reels have descriptive titles. Edit `projects.json` and `videos.json` for future project and video changes.


## Version 22 exact copy update
Uses the user-edited October 25 PDF literally (including Dorthea Lange spelling and capitalization). Quote authors appear below quotes as General Sans captions. Blank replacement fields were not treated as requests to change text.


## Version 23 — copy and heading cleanup
- Homepage introduction: **who crafts** (per revised worksheet).
- Writing introduction: **Telling good stories with only 26 letters, genuine curiosity, and a few numbers.**
- Section subheads use title case, including **I’m Good Friends with a Lens**, **Mission in Motion**, and **Bite-Sized Stories**.
- Divider rules above section headings on the homepage, Design, Writing, and Photography/Videography pages removed. Navigation bottom rule also removed.
- Existing quote copy/attribution styling, all media, links, and project data retained.


## Version 24 updates
Section subheadings display in uppercase. The Reels section uses the latest editing sheet: “Bite-sized stories” and “Creating content that reaches”.


## Version 25 changes
- THINK PREP! is no longer listed on Writing; it remains on Design and Photography/Videography.
- Internal page navigation uses a quick cobalt-blue wipe. Reduced-motion preferences skip it.
- Update all HTML, `script.js`, `style.css`, and `projects.json` together.


## v26 navigation animation
A coordinated 450ms outbound blue wipe and 450ms inbound reveal. The arrival page is covered before paint to avoid a jump. Honors prefers-reduced-motion and resets on browser Back/Forward cache restores.


V27: Adds blue portrait to homepage; temporary blue portrait on About page until separately provided passport cutout becomes accessible. Replace about.html image src with passport image when received. Photography spacing tightened.
