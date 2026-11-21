# Contributing to makitdev

Thanks for helping build makitdev. This project is open source — your ideas,
reports, and contributions are welcome.

## Ground rules

- Be respectful. This is a small, community-oriented organization.
- Keep changes small, focused, and easy to review.
- Keep the site lightweight: HTML, CSS, and vanilla JavaScript only.
  No build step, no frameworks, no new dependencies unless discussed first.

## How to contribute

1. Fork the repository.
2. Create a branch: `git checkout -b my-change`.
3. Make your changes.
4. Test locally: open `index.html` or run `python3 -m http.server 8080`.
5. Commit with a clear, concise message.
6. Open a pull request against `main`.

## What to look out for

- **Copy**: page text lives in `index.html`, `contributors.html`,
  `privacy.html`, and `terms.html`. Contributor cards read from
  `assets/data/contributors.js`.

## Build steps

The pages load the minified stylesheets, so regenerate after editing anything
under `assets/css/`:

```bash
node scripts/minify.js            # assets/css/*.css -> assets/css/*.min.css
```

## Adding a contributor

To add or update a contributor in the organization roster across all data files:

### Automated (recommended)

Run the helper script with the contributor's GitHub username:

```bash
node scripts/add-contributor.js <github-username> --name "Full Name" --role "Role" --contribution "Description"
```

This automatically queries the GitHub profile and updates `assets/data/contributors.js`.

`assets/data/contributors.js` is the **single source of truth** for the roster.
`assets/js/contributors.js` deliberately holds no hardcoded copy of it — an
earlier "fallback" array silently drifted out of sync, hiding contributors
added through the script. Don't reintroduce one; the renderer shows a message
if the data file fails to load.

### Manual

Add the contributor object to `assets/data/contributors.js`:

```json
{
  "name": "Contributor Name",
  "username": "github-username",
  "role": "Core Contributor",
  "contribution": "Description of contributions.",
  "category": "Contributors",
  "github": "https://github.com/github-username",
  "avatar": "https://avatars.githubusercontent.com/u/..."
}
```

Keep the JSON strictly valid. `scripts/add-contributor.js` re-parses this file
to append new entries, and it **refuses to write** if it cannot read the array
back — so a syntax error here will block the script rather than silently
overwrite the roster. After a manual edit, re-run the script for the same username to regenerate the
roster consistently.

- **Accessibility**: semantic HTML, keyboard support, visible focus, and
  `prefers-reduced-motion` support must be preserved.
- **Design language**: minimal, editorial, typography-led. No neon colors,
  heavy effects, or stock visuals.

## Reporting issues

Open an issue describing what you saw, what you expected, and how to
reproduce it. Screenshots and browser details help a lot.

## License

By contributing you agree that your contributions are licensed under the
[MIT License](LICENSE).