# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal portfolio site for `adityaranjansingh.github.io`. Static Jekyll site, built and deployed natively by GitHub Pages (Settings → Pages → source = branch `master`, root). No CI/Actions workflow — push to `master` and GitHub rebuilds it.

## Commands

```bash
bundle install         # first time / after Gemfile changes
bundle exec jekyll serve   # local dev server (http://localhost:4000), live reload
bundle exec jekyll build   # production build to _site/, used as a "does it build" check
```

The `github-pages` gem (not a bare `jekyll` gem) pins Jekyll and plugin versions to exactly what GitHub Pages runs in production — always use `bundle exec`, don't install Jekyll globally, and don't add plugins outside GitHub Pages' whitelisted set (currently `jekyll-feed`, `jekyll-seo-tag`).

There is no test suite. Verification is: `bundle exec jekyll build` succeeds, then `bundle exec jekyll serve` and manually check the changed page(s) in a browser.

## Architecture: content lives in YAML, not templates

The core design rule of this repo: **adding or editing content (a job, project, skill, hobby, contact link) means editing one file in `_data/*.yml` — never touching HTML.** Each top-level page (`experience.html`, `projects.html`, `skills.html`, `hobbies.html`, `contact.html`) is a thin Liquid template that loops over its matching `_data/*.yml` file:

| Page | Data file | Fields |
|---|---|---|
| `experience.html` | `_data/experience.yml` | title, company, dates, bullets |
| `projects.html` | `_data/projects.yml` | name, description, link, tags |
| `skills.html` | `_data/skills.yml` | category, items (grouped) |
| `hobbies.html` | `_data/hobbies.yml` | title, description, media (image path or embed URL), link |
| `contact.html` | `_data/links.yml` | label, url |

Only touch the page's HTML when the *shape* of the section changes (e.g. adding a new field that every entry needs) — otherwise the fix belongs in the YAML file.

`index.md` (Home) is the exception: it's freeform bio content, not a data-driven loop.

All pages use `layout: default` (`_layouts/default.html`), which pulls in `_includes/nav.html` and `_includes/footer.html`. Nav links are hardcoded in `nav.html` (not generated from a data file) — adding a new top-level page means adding both the page file and a link in `nav.html`.

## Styling / JS

- `assets/css/main.css` — single hand-written stylesheet, dark cinematic theme, no framework, no preprocessor. A couple of media queries handle responsiveness.
- `assets/js/main.js` — one small IntersectionObserver-based scroll-reveal effect for any element with `data-reveal`, with a no-JS/no-IntersectionObserver fallback that just shows the element immediately.

## Repo history note

The repo previously held only compiled Angular build output (no source) plus a duplicate `adityaranjansingh/` folder; both were deleted when this Jekyll site replaced them (see `docs/superpowers/specs/2026-08-30-jekyll-portfolio-design.md` and the matching plan doc for the full rationale).
