# Jekyll Portfolio Site — Design

Date: 2026-08-30

## Goal

Replace the current repo contents (compiled Angular build output with no
retained source, plus a duplicate `adityaranjansingh/` folder holding the
same artifacts) with a maintainable personal portfolio site for
`adityaranjansingh.github.io`.

Primary success criterion: adding or editing a piece of content (a job, a
project, a skill, a hobby entry) should require editing one YAML file, never
HTML/CSS/templates.

## Current state

- Repo root contains only a compiled Angular production build: minified JS
  bundles, hashed font files, a generated `index.html`/`404.html`, and
  `3rdpartylicenses.txt`. No Angular source is present in the repo.
- `adityaranjansingh/` is a byte-for-byte duplicate of the same build
  output. Its purpose (old GH Pages project-page path?) is unclear and it is
  not needed going forward.
- No CLAUDE.md, README, or other project documentation exists.

## Approach

Static site via Jekyll, using GitHub Pages' native Jekyll build (Settings →
Pages → source = branch, root) — no GitHub Actions workflow needed to build
or deploy.

No third-party theme gem. A custom `_layouts`/`_includes` structure plus one
hand-written CSS file, to avoid GH Pages' whitelisted-gem version lock and
keep the dependency surface at zero beyond the `github-pages` gem itself
(which pins Jekyll + plugin versions to match what GitHub actually runs).

### Why Jekyll over plain HTML or Eleventy

- Plain HTML/CSS/JS has zero build step, but every new project/job entry
  means hand-editing markup — fails the "easy to maintain" requirement as
  soon as content grows past a couple of items.
- Eleventy is more flexible but GitHub Pages does not build it natively;
  it would require a GitHub Actions workflow to build and deploy, which is
  more moving parts than Jekyll needs.
- Jekyll is natively built by GitHub Pages on every push — push markdown/YAML,
  the site rebuilds itself. No CI to maintain.

## Content model

Structured content lives in `_data/*.yml`, not in page templates:

- `_data/experience.yml` — list of roles (title, company, dates, bullets)
- `_data/projects.yml` — list of projects (name, description, link, tags)
- `_data/skills.yml` — list/grouped skills
- `_data/hobbies.yml` — list of hobby entries, including filmmaking (title,
  description, media: image path or YouTube/Vimeo embed URL, link)
- `_data/links.yml` — contact links (email, LinkedIn, GitHub, etc.)

Each page is a thin template that loops over its corresponding data file.
Editing content means editing YAML; the HTML template only changes when the
*shape* of a section changes (e.g. adding a new field to every project).

## Pages (separate pages, shared nav)

- `index.html` — About/Intro (bio, photo, tagline) — Home
- `experience.html` — loops `_data/experience.yml`
- `projects.html` — loops `_data/projects.yml`
- `skills.html` — loops `_data/skills.yml`
- `hobbies.html` — loops `_data/hobbies.yml` (filmmaking and other hobbies)
- `contact.html` — loops `_data/links.yml`

All pages share `_layouts/default.html`, which includes `_includes/nav.html`
and `_includes/footer.html`.

## Assets

- `assets/css/main.css` — single hand-written stylesheet, plain CSS, no
  framework. Responsive via a couple of media queries.
- `assets/img/` — profile photo, project thumbnails, hobby images.
- `favicon.ico` — reuse the existing one at repo root.

## Site config

- `_config.yml`: title, description, plugins limited to
  `jekyll-feed` and `jekyll-seo-tag` (both in the GitHub Pages gem
  whitelist).
- `Gemfile`: pins the `github-pages` gem so `bundle exec jekyll serve`
  locally matches GitHub's build environment exactly.

## Migration / cleanup

Delete, from repo root:
- All compiled Angular artifacts: `index.html`, `404.html`,
  `3rdpartylicenses.txt`, `main.*.js`, `polyfills*.js`, `runtime.*.js`,
  `styles.*.css`, `fa-*` font files (woff/woff2/ttf/eot/svg).
- The entire duplicate `adityaranjansingh/` folder.

Keep `favicon.ico` (reused by the new site).

This is destructive (removes the only copy of the current build output) —
confirmed with the user before implementation proceeds.

## Testing

Static site — the test surface is "does it build and render correctly":

- `bundle exec jekyll build` succeeds with no errors.
- `bundle exec jekyll serve` locally; manually check each page renders,
  nav links work, and content pulled from each `_data/*.yml` file displays
  correctly.

No unit tests are warranted for a content-driven static site.

## Deployment

GitHub Pages settings must be set to Settings → Pages → Source = branch
(root) for the push-to-build Jekyll pipeline to run. No Actions workflow
required.

## Out of scope

- Blog/posts collection (not requested; add a `_posts` collection later if
  wanted).
- Analytics, comments, or any dynamic/server-side feature.
- Automated tests beyond a manual local `jekyll serve` check.
