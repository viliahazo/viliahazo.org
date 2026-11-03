# SEO.md - Viliahazo Municipal Website

**Role:** You are an expert Full-Stack Web Developer and Technical SEO Specialist.

**Task:** Build, refactor, or optimize the official municipal website for Kaominina Viliahazo (viliahazo.org), a rural municipality in the Analamanga Region of Madagascar.

**Tech Stack Preference:** Next.js (App Router) for Server-Side Rendering (SSR) and optimal SEO, Tailwind CSS for mobile-first styling, and TypeScript.

---

## Verified Content to Inject (Do NOT use placeholder data for these)

### Municipality Information

- **Municipality Name:** Kaominina Viliahazo (Commune Rurale de Viliahazo)
- **Location:** District Antananarivo-Avaradrano, Faritra Analamanga, Madagascar
- **Mayor (Ben'ny tanana):** Gabriel Rolland Randriamanantena
- **The 8 Fokontany (Neighborhoods):** Anjomakely, Anjoma Betoho, Ambodivoara, Antsahamalaza, Manakana, Ambatoharanana, Soavinarivo, Antanambao
- **Languages:** Primary: Malagasy (mg). Secondary: French (fr). Implement proper next-intl or similar i18n routing with hreflang tags.

---

## Critical Technical SEO and GEO Fixes Required

### 404 Routing Fix

Ensure all dynamic routes (e.g., /vaovao, /taratasy, /fokontany/[id]) are properly server-rendered or have fallback static generation to prevent crawl errors. Next.js middleware or dynamic SSG with ISR should be used to handle missing routes gracefully.

### Meta Tags

Generate unique, dynamic `<title>` and `<meta name="description">` for every page. Example:

```html
<title>Kaominina Viliahazo | Site Officiel de la Mairie - Antananarivo Avaradrano</title>
```

### Local SEO Schema (JSON-LD)

Inject a LocalGovernment schema on the homepage. Use this exact structure:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalGovernment",
  "name": "Kaominina Viliahazo",
  "alternateName": "Mairie de Viliahazo",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Viliahazo",
    "addressRegion": "Analamanga",
    "addressCountry": "MG"
  },
  "url": "https://www.viliahazo.org",
  "telephone": "+261-XX-XX-XXX-XX",
  "openingHours": "Mo-Fr 07:30-16:00"
}
```

**Note to AI:** Add a prominent code comment `// TODO: DEV MUST REPLACE WITH REAL PHONE NUMBER` next to the telephone field.

### Sitemap

Ensure sitemap.ts dynamically generates URLs for both /mg and /fr locales with correct `<changefreq>` and `<priority>` values.

---

## Page Structure and Features to Build

### Homepage (`/`)

- Hero section with a welcome message ("Tongasoa eto Viliahazo")
- Quick links to 6 core services
- "Latest News/Alerts" (Vaovao farany) section

### Services (`/taratasy`)

- A clear, accessible table or card layout detailing administrative documents (e.g., Birth certificates, Proof of residency)
- Required documents, processing time, and fees in Ariary (Ar)

### Neighborhoods (`/fokontany`)

- A grid displaying the 8 Fokontany, each with the name of the local leader (Chef Fokontany) and a contact button

### Transportation (`/fitaterana`)

- A schedule table for taxi-brousse routes (e.g., Viliahazo to Fianarantsoa, Ambositra, Antsirabe)
- Departure times, duration, and estimated fare

### Contact (`/contact`)

- A functional contact form
- Official municipal address
- Embedded Google Maps iframe pointing to Viliahazo, Analamanga

---

## Performance and Accessibility (Crucial for Madagascar)

### Mobile-First

- 90%+ of local users will access this via low-end Android devices on 3G/4G networks
- Optimize images (use next/image with WebP)
- Minimize JavaScript bundle size
- Ensure tap targets are at least 44x44px

### Offline/Low-Bandwidth Fallback

- Ensure core text content is readable even if CSS fails to load
- Use system fonts or highly optimized variable fonts

### Accessibility

- Proper ARIA labels
- Semantic HTML (`<header>`, `<main>`, `<nav>`, `<article>`)
- High color contrast

---

## i18n Routing Configuration

Implement proper next-intl or similar i18n routing with hreflang tags for:

- `/mg` - Malagasy language version
- `/fr` - French language version

Ensure each page has appropriate hreflang annotations in the `<head>` and that the sitemap includes URLs for both locales with proper priority and changefreq values.

---

## TODO Checklist for Developer

- [ ] Replace placeholder phone number with real municipal contact number
- [ ] Fix client-side routing 404 errors for dynamic routes
- [ ] Implement LocalGovernment JSON-LD schema on homepage
- [ ] Create dynamic sitemap with /mg and /fr locale URLs
- [ ] Build homepage with hero, quick links, and news section
- [ ] Build Services page with administrative document table
- [ ] Build Neighborhoods page with 8 Fokontany grid
- [ ] Build Transportation page with taxi-brousse schedule
- [ ] Build Contact page with form and Google Maps
- [ ] Implement i18n routing for Malagasy and French
- [ ] Optimize images and minimize JS for 3G/4G performance
- [ ] Add ARIA labels and semantic HTML structure
- [ ] Test offline/low-bandwidth fallback behavior
