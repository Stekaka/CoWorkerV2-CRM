# CoWorker CRM

Ett komplett CRM-system byggt med Next.js 14, Supabase och Cloudflare R2.

## Funktioner

- **Lead-hantering**: Organisera och spåra alla dina potentiella kunder
- **E-postutskick**: Skicka personliga e-postmeddelanden till leads och kunder
- **Påminnelser**: Håll koll på viktiga datum och uppföljningar
- **Filhantering**: Ladda upp och organisera dokument kopplade till leads
- **Multi-tenant support**: Flera användare inom samma företag med roller (admin/user)
- **Dashboard**: Översikt över leads, status och kommande påminnelser

## Teknisk stack

- **Frontend**: Next.js 14 med App Router
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Fillagring**: Cloudflare R2
- **Styling**: Tailwind CSS
- **UI-komponenter**: Radix UI
- **Formulär**: React Hook Form med Zod validation
- **Ikoner**: Lucide React

## Komma igång

### Förutsättningar

- Node.js 18+ 
- npm/yarn/pnpm
- Supabase-konto
- Cloudflare R2-konto (för filuppladdning)

### Installation

1. Klona projektet:
```bash
git clone <repository-url>
cd CoWorkerV2
```

2. Installera dependencies:
```bash
npm install
```

3. Konfigurera miljövariabler:
Kopiera `.env.local` och fyll i dina uppgifter:
```bash
cp .env.local.example .env.local
```

4. Kör Supabase-schemat:
   - Öppna Supabase Dashboard
   - Gå till SQL Editor
   - Kör innehållet från `supabase-schema.sql`

5. Starta utvecklingsservern:
```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Databas-schema

### Tabeller

- **companies**: Företagsinformation
- **users**: Användare kopplade till företag
- **leads**: Lead-/kontaktregister
- **reminders**: Påminnelser kopplade till leads
- **email_campaigns**: E-postkampanjer
- **files**: Filuppladdningar kopplade till leads

### Row Level Security (RLS)

Alla tabeller använder RLS för att säkerställa att användare bara kan se data från sitt eget företag.

## API-endpoints

- `GET /api/leads` - Hämta leads
- `POST /api/leads` - Skapa ny lead
- `PUT /api/leads/[id]` - Uppdatera lead
- `DELETE /api/leads/[id]` - Ta bort lead
- `POST /api/upload` - Ladda upp fil till Cloudflare R2
- `POST /api/email/send` - Skicka e-post till leads

## Deployment

### Vercel

1. Pusha koden till GitHub
2. Koppla repository till Vercel
3. Lägg till miljövariabler i Vercel Dashboard
4. Deploy!

### Andra plattformar

Applikationen kan köras på vilken plattform som helst som stöder Node.js.

## Utveckling

### Projektstruktur

```
src/
├── app/                    # App Router pages
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/           # React components
│   ├── ui/              # Base UI components
│   └── dashboard/       # Dashboard-specific components
└── lib/                 # Utilities and configurations
    ├── supabase.ts      # Supabase client
    ├── auth.ts          # Authentication helpers
    └── utils.ts         # General utilities
```

### Kommande funktioner

- [ ] E-postmallar
- [ ] Avancerad lead-filtering
- [ ] Export/import av data
- [ ] Integrationer med externa tjänster
- [ ] Rapporter och analyser
- [ ] Mobil app

## Support

För frågor eller problem, skapa ett issue i GitHub repository.

## Licens

MIT License
# Build Fix
# Build triggered Thu Aug  7 14:24:38 CEST 2025
