# Backend Implementation Plan: Concierge Recruitment Model

This document outlines the technical strategy for building a high-touch, low-friction backend for a construction recruitment business.

## 1. Strategy: The Internal CRM (Airtable)
Instead of building a public dashboard, we use **Airtable** as the centralized "brain" of the operation.

- **Candidates Table**: Name, Trade, Experience, Certifications (attachments), Recruiter Notes, Status (Vetted, Placed, etc.).
- **Employers Table**: Company Name, Contact Person, Hiring History, Requirements.
- **Job Requests Table**: Linked to Employers, specifies personnel needs.
- **Placements Table**: Tracks matches and commissions.

## 2. Intake Funnels (The "Input")
We use simple, high-conversion forms on the Next.js site that POST to Airtable via Route Handlers.

### Candidate Intake
- **Fields**: Name, WhatsApp/Phone, Trade (Dropdown), Years of Exp, Availability.
- **Workflow**: No password required. Recruiter gets a notification, calls the candidate to vet them, and updates Airtable manually.

### Employer Request
- **Fields**: Name, Company, "What do you need?", Urgency.
- **Workflow**: Direct notification to the recruiter.

## 3. The Product: Blind Profiles (The "Output")
When an employer needs personnel, the recruiter sends them a unique **Blind Profile** link.

- **Tech**: A dynamic Next.js route `/profiles/[candidate-id]`.
- **Security**: Password protected (shared via WhatsApp/Email) or signed URL.
- **Content**:
    - Skill matrix and certifications.
    - Recruiter's "Vetting Note" (The value add).
    - **HIDDEN**: Last name, phone number, social links (Prevents bypassing).
- **CTA**: A "Request Interview" button that pings the recruiter.

## 4. Tech Stack
- **Frontend/API**: Next.js (Existing).
- **Database/CRM**: Airtable (API-driven).
- **Serverless Functions**: Next.js Route Handlers (App Router).
- **Notifications**: Zapier or Twilio (WhatsApp notifications).

## 5. Implementation Steps
1. **CRM Setup**: Create Airtable base with 4 key tables.
2. **API Integration**: Create `/api/apply` and `/api/request` handlers in Next.js.
3. **Frontend Forms**: Replace mock forms with live POST actions to internal APIs.
4. **Blind Profile Template**: Build the `/[locale]/candidates/[id]` page that fetches from Airtable.
5. **Automation**: Set up a simple Zapier flow: *Airtable New Entry -> Recruiter WhatsApp Notification*.

---

## Detailed Step-by-Step Guide

### Step 1: CRM Setup (Airtable)
1.  **Create a Base**: Name it "Constructief Recruitment".
2.  **Candidates Table**:
    *   `Name` (Single line text)
    *   `Trade` (Single select: Electrician, Bricklayer, etc.)
    *   `Experience` (Number)
    *   `Status` (Single select: New, Vetted, Interviewing, Placed)
    *   `CV/Certs` (Attachment)
    *   `Recruiter Note` (Long text)
3.  **Employers Table**:
    *   `Company Name`, `Main Contact`, `Phone/Email`.
4.  **Generate API Key**: Go to Airtable Developer Hub and create a Personal Access Token with `data.records:write` and `data.records:read` scopes for this base.

### Step 2: Next.js API Routes (The Bridge)
1.  **Install Airtable SDK**: `npm install airtable`
2.  **Environment Variables**: Add `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` to `.env.local`.
3.  **Create Candidate Route**: Create `src/app/api/candidates/route.ts`.
    *   Implement a `POST` handler that takes form data and uses `base('Candidates').create()` to push to Airtable.
4.  **Create Request Route**: Create `src/app/api/requests/route.ts` for employer personnel requests.

### Step 3: Connect Frontend Forms
1.  **Candidate Form**: Update the `Candidates` page form.
    *   Use `handleSubmit` to fetch requests to `/api/candidates`.
    *   Show a "Success! We will call you within 24 hours" message (High trust).
2.  **Employer Form**: Update the `Employers` page form to POST to `/api/requests`.

### Step 4: Build the "Blind Profile" Page
1.  **Dynamic Route**: Create `src/app/[locale]/profiles/[id]/page.tsx`.
2.  **Data Fetching**:
    *   In the Server Component, fetch the record from Airtable using the `id` from params.
    *   **CRITICAL**: Map the data to a local object that *omits* the `Name` and `Contact` fields. Use `Trade` and `Recruiter Note` instead.
3.  **UI Construction**:
    *   Display a professional "Candidate Overview".
    *   Add a "Request Interview for this Candidate" button.

### Step 5: Automation (The Glue)
1.  **Zapier Setup**:
    *   **Trigger**: New Record in Airtable "Candidates" table.
    *   **Action**: Send SMS or WhatsApp (via Twilio/Zapier SMS) to *your* phone.
    *   **Result**: You get a text the second a bricklayer applies, allowing you to call them immediately.
