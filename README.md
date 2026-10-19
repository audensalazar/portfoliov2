# Auden Salazar — GitHub Pages Portfolio

A lightweight, responsive static site based on the public navigation and homepage copy of https://technical-exceptions-780357.framer.app/.

## Important limitation

This is **a recreation/starter site, not a pixel-perfect Framer export**. The Framer subpages did not expose their original project content or images through the available retrieval. Placeholder projects appear in `projects.json`; import your own content and media before replacing your live portfolio.

## Publish on GitHub Pages

1. Unzip this download.
2. Create a new GitHub repository, for example `Portfolio`.
3. Upload **the files inside** `auden-portfolio-github` to the **root of the repository**, keeping `assets/` intact.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**, `main`, and `/ (root)`, then save.
6. Your homepage will be accessible at `https://YOUR-USERNAME.github.io/Portfolio/` after GitHub finishes deploying.

## Update your work

- Edit `projects.json` to add or remove portfolio cards, categories, descriptions, and URLs.
- Copy images into `assets/` and reference them as `"image": "assets/my-image.jpg"`.
- For YouTube/Vimeo projects, use the project's external `url`.
- Edit `about.html` to include your full biography.
- Customize layout and typography in `style.css`.

## Local preview

Run `python3 -m http.server 8000` from the project directory, then visit `http://localhost:8000`. Loading HTML from the filesystem directly may block `projects.json` due to browser security restrictions.

## Pages

- `index.html` homepage
- `design.html` design
- `writing.html` writing
- `photography-videography.html` photography/videography
- `about.html` about

No build step or dependencies are required.

## Typography

The typography in `style.css` uses **Geist Pixel** for headings, **IBM Plex Serif** for body copy, and **General Sans** for captions, navigation, and labels. Fonts load from Google Fonts and Fontshare. An internet connection is needed to load them; fallback fonts are provided. Geist Pixel has multiple shapes; this version uses the font provider's default variant until the specific Framer variant is confirmed.

## Screenshot-matched homepage

The homepage was restyled from the provided Framer reference screenshot (bright yellow background, cobalt Geist Pixel headline, IBM Plex Serif copy, General Sans links). Interior project pages remain an approximate recreation. The Geist Pixel Google Fonts variant uses `ELSH` Square; other pixel variants can be selected by adjusting this value.
