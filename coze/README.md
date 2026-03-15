# gamil41309.github.io

Static GitHub Pages frontend for your Coze-based "道德批判思维激发助手".

Published from the repository root for GitHub Pages branch deployment.

## What this does

- Runs entirely as static files: `index.html`, `styles.css`, `app.js`
- Sends browser-side `fetch()` requests to a Cloudflare Worker proxy instead of calling Coze directly
- Parses SSE-style `data:` blocks and renders the response incrementally
- Keeps `session_id`, `project_id`, Worker URL, and prompt in `localStorage`
- Includes preset classroom scenarios so users can select a case and start interacting immediately

## Proxy design

This version is intended to call a Cloudflare Worker proxy. The Worker should hold the upstream Coze bearer token as a secret, so the browser never sends or stores that token.

## Local preview

Open `index.html` in a browser, or run a static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages deploy

This repo includes `.github/workflows/pages.yml`, so the recommended path is GitHub Actions deployment:

1. Push these files to the `main` branch.
2. In GitHub, open `Settings -> Pages`.
3. Under `Source`, choose `GitHub Actions`.
4. The `Deploy GitHub Pages` workflow will publish the site automatically on push to `main`.

## If the request fails

- Confirm the Worker endpoint allows browser-origin requests from GitHub Pages or your custom domain.
- Confirm the Worker secret token is valid.
- Confirm `project_id` and `session_id` are correct.
- Check the browser devtools `Network` tab for CORS or auth errors.
