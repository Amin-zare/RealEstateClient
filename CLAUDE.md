# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Real Estate Client is a React TypeScript application for managing real estate company data and apartment listings. The app features two portal views:
- **Fastighet Portalen**: View all apartments or filter for expiring lease contracts
- **Bygg AB**: Manage apartment renovation status with checkbox toggles and webhook-based persistence

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Environment Configuration

Required environment variables in `.env`:

```env
REACT_APP_AUTHORIZATION_TOKEN=YOUR_TOKEN_HERE
REACT_APP_COMPANIES_URL=https://localhost:7055/companies
REACT_APP_WEBHOOK_SECRET=YOUR_SECRET_HERE
REACT_APP_WEBHOOK_URL=https://localhost:7055/webhook/apartment-updated
```

**Critical**: Never commit `.env` files. All services expect these variables to be present and will throw errors if missing or empty.

## Architecture

### Routing Structure
The app uses React Router with three main routes ([App.tsx](src/App.tsx)):
- `/` - Home page with portal selection buttons
- `/portalen` - Fastighet Portalen view (read-only apartment browsing)
- `/byggab` - Bygg AB view (apartment renovation management)

### Data Flow Pattern

Both portal pages follow the same pattern:

1. **Company Selection**: On mount, fetch companies via `fetchCompanies()`
2. **Apartment Loading**: When a company is selected, fetch apartments via `fetchApartments(companyId, expiring)`
3. **State Management**: Use local React state with separate loading/error states for companies and apartments
4. **Abort Controllers**: Always use AbortController for cleanup on unmount to prevent memory leaks

### Service Layer

All API calls go through the service layer in [src/services/](src/services/):

- **companyService.ts**: Fetches company list from `REACT_APP_COMPANIES_URL`
- **apartmentService.ts**: Fetches apartments for a company (supports `expiring` parameter for filtering)
- **saveRenovatedApartments.ts**: Sends renovation status updates to webhook endpoint

All services:
- Validate environment variables before making requests
- Use Bearer token authentication from `REACT_APP_AUTHORIZATION_TOKEN`
- Return typed promises (Company[], Apartment[], etc.)
- Throw descriptive errors that components catch and display

### Key Implementation Details

**Bygg AB Renovation Workflow** ([ByggAbList.tsx](src/components/ByggAbList.tsx)):
- Checkbox state is initialized from `apartment.isRenovated` property
- Local state tracks changes via `renovatedState` object mapping `{[id: number]: boolean}`
- On save, `saveRenovatedApartments()` compares current vs initial state, sends only changed apartments to webhook
- Webhook failures are logged but don't block the save operation (resilient design)
- Function returns count of changed apartments (number, not boolean)

**Portalen Expiring Contracts** ([PortalPage.tsx](src/components/PortalPage.tsx)):
- Toggle between all apartments and expiring contracts via `showExpiring` state
- Changing the toggle re-fetches from API with different endpoint
- Two separate useEffect hooks: one for companies (runs once), one for apartments (depends on `selectedCompany` and `showExpiring`)

### Type Definitions

Located in [src/types/](src/types/):

```typescript
// Company.ts
type Company = {
  readonly id: number;
  readonly name: string;
}

// Apartment.ts
type Apartment = {
  id: number;
  address: string;
  leaseEnd: string;
  isRenovated: boolean;
  companyId: number;
  company: string;
}
```

### Text Constants

All user-facing text is in Swedish and stored in [src/constants/text.json](src/constants/text.json). Import as `text` and reference via dot notation (e.g., `text.welcomeTitle`).

## Important Notes

- Backend API must be running and accessible at URLs in `.env`
- Backend must have CORS enabled for localhost during development
- The webhook endpoint expects JSON: `{apartmentId: number, isRenovated: boolean}`
- Webhook authentication uses `X-Webhook-Secret` header
- Date formatting uses browser locale via `toLocaleDateString()`
