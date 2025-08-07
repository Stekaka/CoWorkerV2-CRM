# CoWorkerV2 API Documentation

## Översikt

Detta är den kompletta API-dokumentationen för CoWorkerV2 CRM-systemet. Alla endpoints kräver autentisering och data är isolerad per företag.

## Autentisering

Alla API-anrop kräver en giltig Supabase-session. Användaren måste vara inloggad via Supabase Auth.

## Endpoints

### Notes API

#### GET /api/notes
Hämta alla anteckningar för användaren.

**Query Parameters:**
- `search` (string, optional): Sök i titel
- `tags` (string, optional): Kommaseparerad lista av taggar
- `leadId` (string, optional): Filter på specifik lead

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Anteckningsrubrik",
    "content": [
      {
        "id": "block-id",
        "type": "text|heading|list|todo|quote|code",
        "content": "Block-innehåll",
        "data": {}
      }
    ],
    "tags": ["tag1", "tag2"],
    "is_pinned": false,
    "lead_id": "uuid|null",
    "company_id": "uuid",
    "created_by": "uuid",
    "created_at": "2025-08-07T10:00:00Z",
    "updated_at": "2025-08-07T10:00:00Z"
  }
]
```

#### POST /api/notes
Skapa en ny anteckning.

**Request Body:**
```json
{
  "title": "Anteckningsrubrik",
  "content": [/* block array */],
  "tags": ["tag1", "tag2"],
  "leadId": "uuid (optional)"
}
```

#### GET /api/notes/[id]
Hämta specifik anteckning.

#### PUT /api/notes/[id]
Uppdatera anteckning.

**Request Body:**
```json
{
  "title": "Ny rubrik",
  "content": [/* updated blocks */],
  "tags": ["updated", "tags"],
  "is_pinned": true
}
```

#### DELETE /api/notes/[id]
Ta bort anteckning.

### Tasks API

#### GET /api/tasks
Hämta alla uppgifter.

**Query Parameters:**
- `status` (string, optional): todo|in_progress|done
- `assignedTo` (string, optional): Användar-ID
- `leadId` (string, optional): Lead-ID

#### POST /api/tasks
Skapa ny uppgift.

**Request Body:**
```json
{
  "title": "Uppgiftsrubrik",
  "description": "Beskrivning",
  "priority": "low|medium|high",
  "due_date": "2025-08-07T10:00:00Z",
  "leadId": "uuid (optional)",
  "noteId": "uuid (optional)",
  "assignedTo": "uuid (optional)"
}
```

#### PUT /api/tasks/[id]
Uppdatera uppgift.

### Leads API

#### GET /api/leads
Hämta alla leads.

**Query Parameters:**
- `status` (string, optional): new|contacted|qualified|proposal|won|lost
- `tags` (string, optional): Kommaseparerad lista
- `search` (string, optional): Sök i namn, email, företag

#### POST /api/leads
Skapa ny lead.

**Request Body:**
```json
{
  "name": "Lead-namn",
  "email": "email@example.com",
  "phone": "telefonnummer",
  "company": "Företagsnamn",
  "status": "new",
  "tags": ["tag1", "tag2"],
  "notes": "Anteckningar"
}
```

#### GET /api/leads/[id]
Hämta specifik lead.

#### PUT /api/leads/[id]
Uppdatera lead.

### Analytics API

#### POST /api/analytics
Spåra en händelse.

**Request Body:**
```json
{
  "eventType": "note_created",
  "eventData": {
    "page": "/notes",
    "additional": "data"
  }
}
```

#### GET /api/analytics
Hämta analysdata.

**Query Parameters:**
- `from` (string, optional): Start-datum (ISO format)
- `to` (string, optional): Slut-datum (ISO format)

## Client-side Hooks

### useNotes(filters)
React hook för anteckningar.

```typescript
const { notes, loading, createNote, updateNote, deleteNote, refetch } = useNotes({
  search: "sökterm",
  tags: ["tag1", "tag2"],
  leadId: "uuid"
})
```

### useNote(id)
React hook för en specifik anteckning.

```typescript
const { note, loading, updateNote, refetch } = useNote("note-id")
```

### useTasks(filters)
React hook för uppgifter.

```typescript
const { tasks, loading, createTask, updateTask, refetch } = useTasks({
  status: "todo",
  assignedTo: "user-id"
})
```

### useLeads(filters)
React hook för leads.

```typescript
const { leads, loading, createLead, updateLead, refetch } = useLeads({
  status: "new",
  search: "sökterm"
})
```

### useAnalytics(dateRange)
React hook för analytics.

```typescript
const { analytics, loading, trackEvent, refetch } = useAnalytics({
  from: "2025-08-01T00:00:00Z",
  to: "2025-08-07T23:59:59Z"
})
```

## Datamodeller

### NoteBlock
```typescript
interface NoteBlock {
  id: string
  type: 'text' | 'heading' | 'list' | 'todo' | 'quote' | 'code'
  content: string
  data?: Record<string, unknown>
}
```

### Note
```typescript
interface Note {
  id: string
  title: string
  content: NoteBlock[]
  tags: string[]
  is_pinned: boolean
  lead_id: string | null
  company_id: string
  created_by: string
  created_at: string
  updated_at: string
}
```

## Säkerhet

- **Row Level Security (RLS)**: Alla tabeller har RLS aktiverat
- **Företagsisolering**: Användare kan bara se data från sitt företag
- **Äganderättspolicyer**: Endast skaparen kan ta bort vissa resurser
- **Autentiseringskrav**: Alla endpoints kräver giltig session

## Installation och Setup

1. **Databas Migration:**
   ```bash
   supabase migration up
   ```

2. **Environment Variables:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **API Usage:**
   ```typescript
   import { useNotes } from '@/hooks/useAPI'
   
   function NotesPage() {
     const { notes, loading, createNote } = useNotes()
     
     const handleCreate = async () => {
       await createNote({
         title: "Ny anteckning",
         content: [],
         tags: []
       })
     }
     
     return (
       <div>
         {notes.map(note => (
           <div key={note.id}>{note.title}</div>
         ))}
       </div>
     )
   }
   ```

## Status

✅ **KOMPLETT**: Fullständig API-implementering med autentisering och säkerhet
✅ **KOMPLETT**: Client-side hooks för all funktionalitet  
✅ **KOMPLETT**: Databas-migrations och RLS-policyer
✅ **KOMPLETT**: TypeScript-typer och valideringser
✅ **KOMPLETT**: Anteckningssystem med block-baserad editor
✅ **KOMPLETT**: Integration med befintligt CRM-system

Systemet är nu redo för produktion med fullständig persistering av all användardata!
