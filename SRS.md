# **FINAL SOFTWARE REQUIREMENTS SPECIFICATION**
**Project:** Constructief / Конструктив - Bilingual Construction Recruitment Platform  
**Version:** Final 3.0  
**Prepared For:** Google Antigravity Development Team

## **EXECUTIVE SUMMARY**

Build a modern, professional bilingual (Dutch/Russian) construction recruitment website using Next.js 15+, designed for 2026 aesthetics with subtle animations. The architecture must support future backend integration for candidate profiles and employer job postings.

---

## **1. PROJECT OVERVIEW**

### **Brand Identity**
- **Name:** Constructief / Конструктив
- **Tagline Concept:** "Your constructive partner in construction recruitment"
- **Languages:** Dutch (primary) and Russian (secondary)
- **Industry:** Construction Recruitment & Staffing
- **Target Markets:** Belgium (Dutch-speaking) and Russian-speaking construction professionals

### **Core Objectives**
1. Establish dominant online presence in both language markets
2. Generate qualified leads from candidates and employers
3. Build trust through professional design and industry expertise
4. Create scalable foundation for future platform features
5. Achieve excellent SEO performance in both languages

### **Target Audience**
- **Candidates:** Skilled construction workers, project managers, engineers, foremen
- **Employers:** Construction companies, contractors, developers in target markets
- **Language Groups:** Dutch-speaking (Belgium) and Russian-speaking professionals

---

## **2. TECHNICAL ARCHITECTURE**

### **Core Stack**
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animations:** Framer Motion
- **Internationalization:** next-intl (App Router compatible)
- **CMS:** Payload CMS 2.0+ (self-hosted with localization)
- **Deployment:** Vercel (optimized for Next.js)
- **Analytics:** Google Analytics 4 + Yandex.Metrika (Russian)

### **Project Structure**

src/
├── app/[locale]/ # All routes with locale prefix
├── components/ # Reusable UI components
│ ├── layout/ # Header, Footer, Navigation
│ ├── sections/ # Page sections
│ ├── ui/ # shadcn/ui components
│ └── shared/ # Cross-project components
├── i18n/ # Internationalization
│ ├── dictionaries/ # Translation files
│ ├── middleware.ts # Language routing
│ └── config.ts # i18n configuration
├── lib/ # Utilities, API clients
├── hooks/ # Custom React hooks
├── types/ # TypeScript definitions
└── styles/ # Global styles


### **Internationalization Strategy**
- **Routing:** URL-based (`/nl` and `/ru`)
- **Language Detection:** Automatic via browser settings + manual switcher
- **Content Management:** Payload CMS with built-in localization fields
- **SEO:** Proper hreflang tags, separate sitemaps, locale-specific metadata

### **Future-Ready Architecture**
- API routes structure prepared for backend integration
- Database schema designed for user accounts and job listings
- Component architecture supports dynamic data loading
- Environment variables configured for future services

---

## **3. DESIGN SYSTEM**

### **Color Palette**
- **Primary Blue:** `#1E40AF` (Trust, professionalism)
- **Accent Orange:** `#F97316` (Construction industry, energy)
- **Neutral Gray:** `#374151` (Professional, clean)
- **Background:** `#F9FAFB` (Modern, light)
- **Success Green:** `#10B981` (Positive actions)

### **Typography**
- **Primary Font:** Manrope (supports Latin & Cyrillic)
- **Font Weights:** 300, 400, 500, 600, 700
- **Scale:** Modern, generous line heights
- **Fallbacks:** System fonts with Cyrillic support

### **Animation Principles**
1. **Subtle Entrances:** Fade-up animations with staggered delays
2. **Interactive Feedback:** Smooth hover states, button transitions
3. **Navigation Flow:** Seamless page transitions, animated mobile menu
4. **Visual Interest:** Geometric construction-inspired animations
5. **Performance:** All animations GPU-accelerated, respect prefers-reduced-motion

### **Imagery Guidelines**
- **Quality:** High-resolution, professionally shot
- **Dutch Version:** Modern European construction sites
- **Russian Version:** Similar quality with cultural considerations
- **People:** Diverse, professional, authentic
- **Brand Elements:** Abstract architectural patterns in brand colors

---

## **4. CORE PAGES & FUNCTIONALITY**

### **Homepage (`/[locale]/`)**
- **Hero Section:** Bold headline, bilingual tagline, dual CTAs (Candidate/Employer)
- **Value Propositions:** 3-4 animated cards highlighting key advantages
- **How It Works:** Dual-column process visualization for both user types
- **Featured Opportunities:** Job/professional teasers (static → dynamic)
- **Testimonials:** Client quotes with optional video testimonials
- **Trust Signals:** Partner logos, certifications, stats

### **For Candidates (`/[locale]/kandidaten` / `/[locale]/кандидаты`)**
- Benefits of registration with Constructief
- Industry specializations and roles
- Step-by-step application process
- Featured opportunities section
- CTA to register/contact (Phase 1: contact form)

### **For Employers (`/[locale]/werkgevers` / `/[locale]/работодатели`)**
- Services offered (temporary, permanent, project-based)
- Sector expertise and niche coverage
- Candidate vetting process visualization
- Success metrics and case studies
- CTA to post jobs/contact

### **Vacancies (`/[locale]/vacatures` / `/[locale]/вакансии`)**
- **Phase 1:** Static shell with modern job card design
- Filter/sort UI (non-functional initially, designed for Phase 2)
- Search functionality placeholder
- Empty state with encouraging message
- Pagination-ready structure

### **About Us (`/[locale]/over-ons` / `/[locale]/о-нас`)**
- Company story and mission
- Team introduction with photos/bios
- Core values and philosophy
- Certifications and partnerships
- Office locations (locale-specific)

### **News/Blog (`/[locale]/nieuws` / `/[locale]/новости`)**
- SEO-focused industry content
- Category filtering
- Related articles suggestions
- Newsletter signup integration
- Social sharing capabilities

### **Contact (`/[locale]/contact` / `/[locale]/контакты`)**
- Contact form with candidate/employer selector
- Google Maps integration with office locations
- Contact details (phone, email, address)
- Response time expectations
- FAQ section for common inquiries

### **Legal Pages**
- Privacy Policy (locale-specific compliance)
- Terms of Use
- Cookie Policy
- Accessibility Statement

---

## **5. DEVELOPMENT PHASES**

### **Phase 1: Bilingual Corporate Website**
**Goal:** Launch professional, high-performing website with all core pages

**Implementation Steps:**

1. **Project Foundation**
   - Initialize Next.js 15 with TypeScript
   - Configure Tailwind CSS and shadcn/ui
   - Set up next-intl for internationalization
   - Create middleware for language routing
   - Implement base layout components

2. **Design System Implementation**
   - Create color palette and design tokens
   - Set up typography scale
   - Build core UI components (buttons, cards, forms)
   - Implement language switcher component
   - Create animation utility functions

3. **Page Development**
   - Build homepage with all sections
   - Create candidate/employer pages
   - Implement vacancies page shell
   - Build about us and news/blog pages
   - Create contact page with functional form

4. **Internationalization & Content**
   - Set up translation dictionaries
   - Implement professional translations
   - Configure locale-specific SEO
   - Create content management structure
   - Implement legal pages in both languages

5. **Polish & Optimization**
   - Performance optimization (images, fonts, bundles)
   - Cross-browser and device testing
   - Animation fine-tuning
   - Accessibility audit (WCAG AA)
   - SEO implementation (metadata, sitemaps, structured data)

6. **Deployment & Launch**
   - Production deployment on Vercel
   - Domain configuration and SSL
   - Analytics setup (GA4, Yandex)
   - Final testing and quality assurance
   - Launch and monitoring

### **Phase 2: Platform Features (Future)**
**Goal:** Add backend functionality for user accounts and job management

**Planned Features:**
- User authentication (candidates & employers)
- Candidate profile management with CV upload
- Job posting and management system
- Application tracking system
- Search and filtering functionality
- Notification system (email, in-app)
- Admin dashboard for management
- Payment processing for premium services

---

## **6. CONTENT STRATEGY**

### **Translation Management**
1. **Professional Translation:** Native speakers with construction industry knowledge
2. **Terminology Consistency:** Bilingual glossary of industry terms
3. **Cultural Adaptation:** Content tailored for each market's expectations
4. **Legal Compliance:** Region-specific privacy policies and terms

### **Content Types**
- **Core Pages:** Professional services content
- **Blog Articles:** Industry insights, tips, news
- **Case Studies:** Success stories (anonymized)
- **Testimonials:** Client and candidate quotes
- **FAQs:** Common questions per user type
- **Legal Documents:** Compliant with local regulations

### **SEO Content Plan**
- Keyword research for both language markets
- Locale-specific metadata optimization
- Regular blog updates for organic growth
- Structured data implementation (JobPosting, LocalBusiness)
- Backlink strategy with industry partners

---

## **7. QUALITY ASSURANCE CHECKLIST**

### **Functionality**
- [ ] All navigation links work correctly
- [ ] Forms submit and validate properly
- [ ] Language switcher functions on all pages
- [ ] Contact form sends emails successfully
- [ ] Mobile menu works on all devices
- [ ] Animations work smoothly and respect reduced-motion preferences

### **Internationalization**
- [ ] All text appears in correct language
- [ ] URLs update properly when switching language
- [ ] No mixed language content
- [ ] Date/number formatting per locale
- [ ] Language persistence across sessions
- [ ] hreflang tags correctly implemented

### **Performance**
- [ ] Lighthouse scores >90 (Performance, Accessibility, SEO, Best Practices)
- [ ] Images optimized with next/image
- [ ] Fonts load efficiently (subset if necessary)
- [ ] Bundle size optimized
- [ ] Page transitions are smooth
- [ ] No layout shift (CLS < 0.1)

### **Compatibility**
- [ ] Works on latest Chrome, Firefox, Safari, Edge
- [ ] Responsive on mobile (iPhone, Android), tablet, desktop
- [ ] Touch interactions work correctly
- [ ] Keyboard navigation fully functional
- [ ] Screen reader testing passed

### **SEO**
- [ ] Metadata unique per page and language
- [ ] Structured data implemented and validated
- [ ] XML sitemaps generated for both languages
- [ ] robots.txt properly configured
- [ ] Canonical URLs correct
- [ ] Page speed optimized

---

## **8. DEPLOYMENT & HOSTING**

### **Vercel Configuration**
- Environment variables for API keys
- i18n routing configuration
- Caching headers for static assets
- Deployment previews for PRs
- Custom domain configuration
- SSL/TLS certification

### **Domain Strategy**
- **Primary:** `constructief.be` (redirects based on language)
- **Email:** Professional email addresses (`@constructief.be`)
- **Subdomains:** Optional for language-specific versions
- **Backup:** Configure 404 pages and error handling

### **Analytics Setup**
- Google Analytics 4 with separate data streams
- Yandex.Metrika for Russian audience
- Event tracking for key conversions
- Heatmaps for UX analysis
- Performance monitoring

---

## **9. MAINTENANCE & SCALABILITY**

### **Content Management**
- Payload CMS admin interface for non-technical staff
- Regular content updates schedule
- Translation workflow for new content
- Image optimization pipeline
- Backup and recovery procedures

### **Performance Monitoring**
- Regular Lighthouse audits
- Core Web Vitals monitoring
- Uptime monitoring
- Error tracking (Sentry or similar)
- User feedback collection

### **Future Scalability**
- Architecture supports adding new languages
- Component library can be extended
- API structure ready for backend services
- Database schema designed for growth
- Can scale to separate services if needed

### **Security Considerations**
- Regular dependency updates
- Security headers implementation
- Form validation and sanitization
- Rate limiting for API routes
- GDPR/Privacy compliance per region

---

## **10. DELIVERABLES**

### **Upon Completion**
1. Fully functional bilingual website deployed to production
2. Complete source code with documentation
3. CMS setup with admin training materials
4. SEO audit report and recommendations
5. Performance optimization report
6. Analytics configuration and reporting setup
7. Maintenance and update guidelines
8. Future development roadmap for Phase 2

### **Technical Documentation**
- Architecture overview
- Component library documentation
- Internationalization implementation guide
- Deployment procedures
- Troubleshooting guide
- API documentation (for future integration)

---

## **SUCCESS METRICS**

1. **Performance:** >90 Lighthouse scores
2. **SEO:** First-page rankings for target keywords in both languages
3. **Conversion:** Contact form submission rate >5%
4. **User Engagement:** Average session duration >2 minutes
5. **Mobile Traffic:** >50% of total traffic
6. **International Reach:** Significant traffic from both language groups
7. **Future Ready:** Architecture passes technical review for Phase 2 development

---

*This document serves as the complete guide for building the Constructief / Конструктив bilingual construction recruitment platform. All specifications are final and approved for implementation.*