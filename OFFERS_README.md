# Premium Offert-modul för CRM

En kraftfull och flexibel offertbyggare med drag & drop funktionalitet, mallhantering och professionell design.

## 🎯 Funktionalitet

### ✅ Implementerat
- **Offertbyggare med modulära sektioner** - Lägg till, ta bort, dölj/visa sektioner
- **Drag handle UI** - Visuell indikation för flyttbara sektioner (drag & drop klar för implementering)
- **Live förhandsvisning** - Växla mellan edit och preview mode
- **Autosave indikation** - Loading states och användarfeedback
- **Responsiv design** - Fungerar på alla skärmstorlekar
- **Minimalistisk UI** - Inspirerad av Upsales/Notyfile med clean design
- **Sektionstyper**: Försättsblad, Introduktion, Prissättning, Villkor, Signering, Bilagor, Text, Bild

### 🔄 Planerat
- **Fullständig drag & drop** - Med react-dnd (dependencies installerade)
- **Mallhantering** - Spara och använda offertmallar
- **Rik innehållsredigering** - Rich text editor för sektioner
- **E-post integration** - Skicka offerter via e-post
- **Digital signering** - Signering direkt i browser
- **PDF export** - Generera PDF:er av offerter

## 🏗️ Arkitektur

### Komponentstruktur
```
/src/components/offers/
├── OfferBuilder.tsx          # Huvudkomponent med sidebar och editor
├── OfferSectionCard.tsx      # Redigerbar sektion med drag handle
├── OfferPreview.tsx          # Förhandsvisning (planerad)
├── OfferTemplateSelector.tsx # Mallväljare (planerad)
└── OfferSendModal.tsx        # E-post modal (planerad)
```

### Hooks & Logic
```
/src/hooks/offers/
└── useOfferSections.ts       # State management för sektioner

/src/types/offers/
└── index.ts                  # TypeScript types för offert-systemet
```

## 🎨 Design Principles

### Premium UX
- **Minimalistisk** - Clean, luftig design utan plottrigt
- **Intuitiv** - Drag handles, hover states, tydliga knappar
- **Responsiv** - Grid layout som fungerar på alla enheter
- **Animerad** - Smooth transitions på hover/drag
- **Snabb feedback** - Loading states, autosave indikation

### Färgschema
- **Neutral bas** - Grå toner för bakgrund och ramar
- **Blue accent** - #2563eb för primära knappar och fokus
- **Semantic colors** - Röd för delete, grön för success
- **Soft shadows** - Subtila skuggor för djup

## 🚀 Användning

### Grundläggande
```tsx
import { OfferBuilder } from '@/components/offers/OfferBuilder';

function MyPage() {
  return (
    <OfferBuilder 
      onSave={handleSave}
      onSend={handleSend}
    />
  );
}
```

### Med befintlig offert
```tsx
<OfferBuilder 
  offer={existingOffer}
  onSave={handleSave}
  onSend={handleSend}
/>
```

## 💡 Varför denna design är kraftfull

### 1. Modulär Arkitektur
- **Flexibel** - Enkelt att lägga till nya sektionstyper
- **Återanvändbar** - Komponenter kan användas i andra sammanhang
- **Testbar** - Isolerade komponenter med tydliga interfaces

### 2. Skalbar State Management
- **useOfferSections hook** - Centraliserad logik för sektionshantering
- **Optimistic updates** - Direkt feedback för användaren
- **Undo/Redo ready** - State structure förberedd för history

### 3. TypeScript First
- **Type safety** - Fångar fel vid compile-time
- **IntelliSense** - Bättre developer experience
- **Maintainable** - Tydliga interfaces och contracts

### 4. Performance Optimized
- **React.memo ready** - Komponenter förberedda för memoization
- **Lazy loading** - Components kan lazy-loadas vid behov
- **Virtual scrolling ready** - För stora offert-listor

## 🛠️ Nästa Steg

### 1. Aktivera Drag & Drop
```bash
# Dependencies redan installerade
npm install react-dnd react-dnd-html5-backend
```

Uncomment drag & drop kod i `OfferSectionCard.tsx` och `OfferBuilder.tsx`

### 2. Rich Text Editor
```bash
npm install @tiptap/react @tiptap/starter-kit
```

### 3. PDF Generation
```bash
npm install @react-pdf/renderer
```

### 4. E-post Integration
Integrera med din befintliga e-post service

## 📱 Demo
Besök `/offers` för att testa offertbyggaren!

---

**Design Inspiration**: Upsales, Notion, Linear - minimalistiska, kraftfulla B2B-verktyg med fokus på användarvänlighet och effektivitet.
