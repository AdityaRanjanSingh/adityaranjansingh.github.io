# Jekyll Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the compiled-Angular-only repo contents with a maintainable, data-driven Jekyll portfolio site (About, Experience, Projects, Skills, Hobbies, Contact) built natively by GitHub Pages.

**Architecture:** Static Jekyll site at repo root. Content pages are thin Liquid templates that loop over `_data/*.yml` files, so adding a job/project/skill/hobby entry means editing YAML, never HTML. One shared `_layouts/default.html` layout with nav/footer includes. No theme gem — plain hand-written CSS. `github-pages` gem pins the build to match GitHub's actual Jekyll build environment.

**Tech Stack:** Jekyll (via the `github-pages` gem), Liquid templates, YAML data files, plain CSS. No JS framework, no build tooling beyond Jekyll/Bundler.

**Spec:** `docs/superpowers/specs/2026-08-30-jekyll-portfolio-design.md`

## Global Constraints

- No theme gem — custom `_layouts`/`_includes` + hand-written CSS only (spec: "Approach").
- Jekyll plugins limited to `jekyll-feed` and `jekyll-seo-tag` — both on the GitHub Pages gem whitelist (spec: "Site config").
- All list content (experience, projects, skills, hobbies, contact links) lives in `_data/*.yml`, never hardcoded in page templates (spec: "Content model").
- `Gemfile` pins the `github-pages` gem so local `bundle exec jekyll serve`/`build` matches GitHub's build exactly (spec: "Site config").
- Separate pages per section, sharing one layout (spec: "Pages").
- Old compiled Angular output and the duplicate `adityaranjansingh/` folder are deleted; `favicon.ico` is kept and reused (spec: "Migration / cleanup").

---

### Task 1: Repo cleanup — remove old build output

**Files:**
- Delete: `index.html`, `404.html`, `3rdpartylicenses.txt`, `main.*.js`, `polyfills*.js`, `runtime.*.js`, `styles.*.css`, all `fa-*` font files (root)
- Delete: `adityaranjansingh/` (entire directory, duplicate of the above)
- Keep: `favicon.ico`, `assets/` (will be repurposed for new site assets in Task 3+), `docs/`

**Interfaces:**
- Produces: a clean repo root containing only `favicon.ico`, `assets/`, `docs/`, and `.git` — the base every later task builds on.

- [ ] **Step 1: Confirm what's about to be deleted**

Run: `git status` (should be clean) then list root:
```bash
ls -la /Users/aditya.singh/personal/adityaranjansingh.github.io
```
Expected: only the compiled Angular artifacts, `adityaranjansingh/`, `favicon.ico`, and `assets/` are present — matches the spec's "Current state" section. If anything unexpected is present, stop and ask before deleting.

- [ ] **Step 2: Delete the old build output and duplicate folder**

```bash
cd /Users/aditya.singh/personal/adityaranjansingh.github.io
git rm -r --cached . -q 2>/dev/null || true
git rm -f index.html 404.html 3rdpartylicenses.txt \
  main.*.js polyfills*.js runtime.*.js styles.*.css fa-*.* 
git rm -r adityaranjansingh
```
(If `git rm --cached .` errors because nothing is tracked yet under that pattern, ignore — the explicit `git rm` calls below are what matter.)

- [ ] **Step 3: Verify only the kept files remain**

```bash
ls -la /Users/aditya.singh/personal/adityaranjansingh.github.io
```
Expected: `favicon.ico`, `assets/`, `docs/`, `.git` only (plus whatever new files later tasks add).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Remove old compiled Angular build output and duplicate folder"
```

---

### Task 2: Jekyll scaffold (Gemfile, config, gitignore)

**Files:**
- Create: `Gemfile`
- Create: `_config.yml`
- Create: `.gitignore`
- Create: `index.md` (temporary minimal placeholder content — replaced with real About content in Task 4)

**Interfaces:**
- Produces: a `bundle exec jekyll build` command that succeeds and produces `_site/index.html`. Every later task's "build and check" step depends on this working.

- [ ] **Step 1: Write the Gemfile**

```ruby
source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
```

- [ ] **Step 2: Write the Jekyll config**

```yaml
title: Aditya Ranjan Singh
description: "Portfolio of Aditya Ranjan Singh — software engineer and filmmaker."
url: "https://adityaranjansingh.github.io"
permalink: pretty
markdown: kramdown

plugins:
  - jekyll-feed
  - jekyll-seo-tag

exclude:
  - docs/
  - Gemfile
  - Gemfile.lock
  - vendor/
```

`permalink: pretty` makes a page file like `experience.html` build to
`_site/experience/index.html`, servable at `/experience/` — this is what
later nav links (`/experience/`, `/projects/`, etc.) assume.

`exclude: [docs/, ...]` keeps Jekyll from trying to process
`docs/superpowers/plans/*.md` as site content — those files contain Liquid
tag examples in fenced code blocks that Jekyll's Liquid parser otherwise
tries to render literally, breaking the build. (Discovered during
implementation of this task; not in the original spec.)

- [ ] **Step 3: Write .gitignore**

```
_site/
.sass-cache/
.jekyll-cache/
.bundle/
vendor/
Gemfile.lock
```

- [ ] **Step 4: Write a minimal index.md so the build has something to render**

```markdown
---
layout: null
title: Home
---
Placeholder — replaced with real About content in Task 4.
```

- [ ] **Step 5: Install gems and build**

```bash
cd /Users/aditya.singh/personal/adityaranjansingh.github.io
bundle install
bundle exec jekyll build
```
Expected: no errors, `_site/index.html` exists.

```bash
test -f _site/index.html && echo BUILD_OK
```
Expected output: `BUILD_OK`

- [ ] **Step 6: Commit**

```bash
git add Gemfile _config.yml .gitignore index.md
git commit -m "Add Jekyll scaffold: Gemfile, config, gitignore"
```

---

### Task 3: Shared layout, nav, footer, base CSS

**Files:**
- Create: `_layouts/default.html`
- Create: `_includes/nav.html`
- Create: `_includes/footer.html`
- Create: `assets/css/main.css`
- Modify: `index.md` (use `layout: default` instead of `layout: null`)

**Interfaces:**
- Consumes: `site.title` (from `_config.yml`, Task 2).
- Produces: `_layouts/default.html` (used by every page in Tasks 4-9), CSS classes `site-nav`, `site-nav__brand`, `site-footer`, `page` used by nav/footer/pages.

- [ ] **Step 1: Write the default layout**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ page.title }} | {{ site.title }}</title>
  <link rel="icon" href="{{ '/favicon.ico' | relative_url }}">
  <link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">
  {% seo %}
</head>
<body>
  {% include nav.html %}
  <main class="page">
    {{ content }}
  </main>
  {% include footer.html %}
</body>
</html>
```

- [ ] **Step 2: Write the nav include**

```html
<nav class="site-nav">
  <a class="site-nav__brand" href="{{ '/' | relative_url }}">{{ site.title }}</a>
  <div class="site-nav__links">
    <a href="{{ '/experience/' | relative_url }}">Experience</a>
    <a href="{{ '/projects/' | relative_url }}">Projects</a>
    <a href="{{ '/skills/' | relative_url }}">Skills</a>
    <a href="{{ '/hobbies/' | relative_url }}">Hobbies</a>
    <a href="{{ '/contact/' | relative_url }}">Contact</a>
  </div>
</nav>
```

- [ ] **Step 3: Write the footer include**

```html
<footer class="site-footer">
  <p>&copy; {{ 'now' | date: "%Y" }} {{ site.title }}</p>
</footer>
```

- [ ] **Step 4: Write the base stylesheet**

```css
:root {
  --max-width: 760px;
  --fg: #1a1a1a;
  --bg: #ffffff;
  --accent: #2454ff;
  --muted: #666666;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: var(--fg);
  background: var(--bg);
  line-height: 1.6;
}

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

.site-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 1rem 1.25rem;
  gap: 0.75rem;
}

.site-nav__brand { font-weight: 600; }

.site-nav__links a { margin-left: 1rem; }
.site-nav__links a:first-child { margin-left: 0; }

.page {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 1rem 1.25rem 3rem;
}

.site-footer {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 1rem 1.25rem 2rem;
  color: var(--muted);
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .site-nav { flex-direction: column; align-items: flex-start; }
  .site-nav__links a { margin-left: 0; margin-right: 1rem; }
}
```

- [ ] **Step 5: Point index.md at the real layout**

Edit `index.md` front matter: change `layout: null` to `layout: default`.

- [ ] **Step 6: Build and check nav renders**

```bash
bundle exec jekyll build
grep -q 'site-nav__brand' _site/index.html && echo NAV_OK
grep -q 'href="/experience/"' _site/index.html && echo LINK_OK
```
Expected: `NAV_OK` and `LINK_OK` both print.

- [ ] **Step 7: Commit**

```bash
git add _layouts _includes assets/css/main.css index.md
git commit -m "Add shared layout, nav, footer, and base stylesheet"
```

---

### Task 4: About/Home page

**Files:**
- Modify: `index.md` (replace placeholder body with real About content)

**Interfaces:**
- Consumes: `_layouts/default.html` (Task 3).

- [ ] **Step 1: Write the About content**

```markdown
---
layout: default
title: Home
---

# Hi, I'm Aditya Ranjan Singh

Software engineer and filmmaker. This is a starter bio — edit this
paragraph directly in `index.md` with your real tagline and background.

![Profile photo](/assets/img/profile.jpg)
```

- [ ] **Step 2: Add a placeholder profile image**

```bash
mkdir -p /Users/aditya.singh/personal/adityaranjansingh.github.io/assets/img
```
Note: no real photo is generated by this plan — drop a real `profile.jpg`
into `assets/img/` after implementation. Until then the broken image icon
is expected and harmless.

- [ ] **Step 3: Build and check**

```bash
bundle exec jekyll build
grep -q 'Hi, I'"'"'m Aditya Ranjan Singh' _site/index.html && echo ABOUT_OK
```
Expected: `ABOUT_OK` prints.

- [ ] **Step 4: Commit**

```bash
git add index.md
git commit -m "Add About/Home page content"
```

---

### Task 5: Experience page + data

**Files:**
- Create: `_data/experience.yml`
- Create: `experience.html`

**Interfaces:**
- Consumes: `site.data.experience` (list of `{title, company, dates, bullets}`), `_layouts/default.html`.
- Produces: `_data/experience.yml` schema (`title`, `company`, `dates`, `bullets: []`) — the shape anyone edits later to add a job.

- [ ] **Step 1: Write starter experience data**

```yaml
- title: "Software Engineer"
  company: "Example Company"
  dates: "2022 – Present"
  bullets:
    - "Describe a key responsibility or achievement here."
    - "Add another bullet point describing impact."
```

- [ ] **Step 2: Write the experience page template**

```html
---
layout: default
title: Experience
---
<h1>Experience</h1>
<ul class="experience-list">
  {% for job in site.data.experience %}
  <li class="experience-item">
    <h2>{{ job.title }} — {{ job.company }}</h2>
    <p class="dates">{{ job.dates }}</p>
    <ul>
      {% for bullet in job.bullets %}
      <li>{{ bullet }}</li>
      {% endfor %}
    </ul>
  </li>
  {% endfor %}
</ul>
```

- [ ] **Step 3: Build and check**

```bash
bundle exec jekyll build
grep -q 'Example Company' _site/experience/index.html && echo EXPERIENCE_OK
```
Expected: `EXPERIENCE_OK` prints.

- [ ] **Step 4: Commit**

```bash
git add _data/experience.yml experience.html
git commit -m "Add Experience page and data"
```

---

### Task 6: Projects page + data

**Files:**
- Create: `_data/projects.yml`
- Create: `projects.html`

**Interfaces:**
- Consumes: `site.data.projects` (list of `{name, description, link, tags}`), `_layouts/default.html`.
- Produces: `_data/projects.yml` schema (`name`, `description`, `link`, `tags: []`).

- [ ] **Step 1: Write starter project data**

```yaml
- name: "Sample Project"
  description: "One or two sentences describing what it does and your role."
  link: "https://github.com/AdityaRanjanSingh/sample-project"
  tags: ["JavaScript", "Angular"]
```

- [ ] **Step 2: Write the projects page template**

```html
---
layout: default
title: Projects
---
<h1>Projects</h1>
<ul class="project-list">
  {% for project in site.data.projects %}
  <li class="project-item">
    <h2><a href="{{ project.link }}">{{ project.name }}</a></h2>
    <p>{{ project.description }}</p>
    <p class="tags">
      {% for tag in project.tags %}<span class="tag">{{ tag }}</span>{% endfor %}
    </p>
  </li>
  {% endfor %}
</ul>
```

- [ ] **Step 3: Build and check**

```bash
bundle exec jekyll build
grep -q 'Sample Project' _site/projects/index.html && echo PROJECTS_OK
```
Expected: `PROJECTS_OK` prints.

- [ ] **Step 4: Commit**

```bash
git add _data/projects.yml projects.html
git commit -m "Add Projects page and data"
```

---

### Task 7: Skills page + data

**Files:**
- Create: `_data/skills.yml`
- Create: `skills.html`

**Interfaces:**
- Consumes: `site.data.skills` (list of `{category, items: []}`), `_layouts/default.html`.
- Produces: `_data/skills.yml` schema (`category`, `items: []`).

- [ ] **Step 1: Write starter skills data**

```yaml
- category: "Languages"
  items: ["JavaScript", "TypeScript", "Python"]
- category: "Tools"
  items: ["Git", "Docker"]
```

- [ ] **Step 2: Write the skills page template**

```html
---
layout: default
title: Skills
---
<h1>Skills</h1>
{% for group in site.data.skills %}
<section class="skill-group">
  <h2>{{ group.category }}</h2>
  <ul>
    {% for item in group.items %}
    <li>{{ item }}</li>
    {% endfor %}
  </ul>
</section>
{% endfor %}
```

- [ ] **Step 3: Build and check**

```bash
bundle exec jekyll build
grep -q 'Languages' _site/skills/index.html && echo SKILLS_OK
```
Expected: `SKILLS_OK` prints.

- [ ] **Step 4: Commit**

```bash
git add _data/skills.yml skills.html
git commit -m "Add Skills page and data"
```

---

### Task 8: Hobbies page + data (including filmmaking)

**Files:**
- Create: `_data/hobbies.yml`
- Create: `hobbies.html`

**Interfaces:**
- Consumes: `site.data.hobbies` (list of `{title, description, media, link}`, where `media` is either a YouTube/Vimeo embed URL or empty), `_layouts/default.html`.
- Produces: `_data/hobbies.yml` schema (`title`, `description`, `media`, `link`).

- [ ] **Step 1: Write starter hobbies data**

```yaml
- title: "Filmmaking"
  description: "Short films and video projects. Replace with a real description of your work."
  media: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  link: ""
- title: "Photography"
  description: "Another hobby entry — add as many as you like."
  media: ""
  link: ""
```

- [ ] **Step 2: Write the hobbies page template**

```html
---
layout: default
title: Hobbies
---
<h1>Hobbies</h1>
<ul class="hobby-list">
  {% for hobby in site.data.hobbies %}
  <li class="hobby-item">
    <h2>{{ hobby.title }}</h2>
    <p>{{ hobby.description }}</p>
    {% if hobby.media != "" %}
    <div class="hobby-media">
      <iframe src="{{ hobby.media }}" frameborder="0" allowfullscreen></iframe>
    </div>
    {% endif %}
    {% if hobby.link != "" %}
    <p><a href="{{ hobby.link }}">More</a></p>
    {% endif %}
  </li>
  {% endfor %}
</ul>
```

- [ ] **Step 3: Add responsive embed CSS**

Append to `assets/css/main.css`:

```css
.hobby-media {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  margin: 0.75rem 0;
}

.hobby-media iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  border: 0;
}
```

- [ ] **Step 4: Build and check**

```bash
bundle exec jekyll build
grep -q 'Filmmaking' _site/hobbies/index.html && echo HOBBIES_OK
```
Expected: `HOBBIES_OK` prints.

- [ ] **Step 5: Commit**

```bash
git add _data/hobbies.yml hobbies.html assets/css/main.css
git commit -m "Add Hobbies page and data, including filmmaking"
```

---

### Task 9: Contact page + links data

**Files:**
- Create: `_data/links.yml`
- Create: `contact.html`

**Interfaces:**
- Consumes: `site.data.links` (list of `{label, url}`), `_layouts/default.html`.
- Produces: `_data/links.yml` schema (`label`, `url`).

- [ ] **Step 1: Write starter links data**

```yaml
- label: "Email"
  url: "mailto:you@example.com"
- label: "LinkedIn"
  url: "https://www.linkedin.com/in/yourprofile"
- label: "GitHub"
  url: "https://github.com/AdityaRanjanSingh"
```

- [ ] **Step 2: Write the contact page template**

```html
---
layout: default
title: Contact
---
<h1>Contact</h1>
<ul class="contact-list">
  {% for link in site.data.links %}
  <li><a href="{{ link.url }}">{{ link.label }}</a></li>
  {% endfor %}
</ul>
```

- [ ] **Step 3: Build and check**

```bash
bundle exec jekyll build
grep -q 'LinkedIn' _site/contact/index.html && echo CONTACT_OK
```
Expected: `CONTACT_OK` prints.

- [ ] **Step 4: Commit**

```bash
git add _data/links.yml contact.html
git commit -m "Add Contact page and links data"
```

---

### Task 10: Full-site verification

**Files:** none (verification only)

**Interfaces:** none — this task checks the integration of Tasks 1-9.

- [ ] **Step 1: Full clean build**

```bash
rm -rf _site
bundle exec jekyll build
```
Expected: no errors.

- [ ] **Step 2: Check every page built**

```bash
for f in index experience projects skills hobbies contact; do
  test -f "_site/${f}.html" -o -f "_site/${f}/index.html" && echo "${f}_OK" || echo "${f}_MISSING"
done
```
Expected: all six lines print `*_OK`, none print `*_MISSING`.

- [ ] **Step 3: Serve locally and manually click through**

```bash
bundle exec jekyll serve
```
Open `http://127.0.0.1:4000/` and click every nav link (Experience,
Projects, Skills, Hobbies, Contact) plus the brand link back to Home.
Confirm each page renders its data-driven content and no link 404s.
Stop the server (Ctrl-C) when done.

- [ ] **Step 4: Verify GitHub Pages settings**

In the repo's GitHub Settings → Pages, confirm the source is set to
"Deploy from a branch" with branch `master` (or `main`) and folder `/(root)`.
This is what makes GitHub build the Jekyll site natively on every push —
no Actions workflow needed. Note this as a manual one-time check; it isn't
something this plan's commits can enforce.

- [ ] **Step 5: Final commit (if anything changed during verification)**

```bash
git status
```
If verification only (no file changes), no commit is needed — the plan is
complete as of Task 9's commit. If any fix was made while verifying,
commit it with a message describing the fix.
