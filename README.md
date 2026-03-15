# gamil41309.github.io

Static GitHub Pages frontend for your Coze-based "道德批判思维激发助手".

## What this does

- Runs entirely as static files: `index.html`, `styles.css`, `app.js`
- Sends browser-side `fetch()` requests to your Coze `stream_run` endpoint
- Parses SSE-style `data:` blocks and renders the response incrementally
- Keeps `Bearer Token`, `session_id`, `project_id`, and prompt in `localStorage`
- Includes preset classroom scenarios so users can select a case and start interacting immediately

## Important constraint

If you publish this on GitHub Pages, do **not** hardcode a production bearer token into the repo. Anyone can read client-side code and extract it.

Safer options:

1. Enter the token manually in the UI each time, or let the browser remember it locally.
2. Put a tiny proxy on your own server or Cloudflare Worker and keep the token there.

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

- Confirm the Coze endpoint allows browser-origin requests from GitHub Pages or localhost.
- Confirm the token is valid.
- Confirm `project_id` and `session_id` are correct.
- Check the browser devtools `Network` tab for CORS or auth errors.
