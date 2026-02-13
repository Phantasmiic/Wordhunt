# Word Hunt Web App MVP

Mobile-first GamePigeon Word Hunt replica MVP with Dockerized React frontend and Django backend.

## Stack
- Frontend: React + Vite
- Backend: Django + Django REST Framework
- Database: Postgres
- Runtime: Docker Compose

## MVP Features
- Start screen with customizable background and game settings.
- Random `N x N` board generation.
- Swipe/drag letter selection with visual tile enlargement.
- Word validation via backend dictionary endpoint.
- Duplicate-word prevention.
- Score tracking with requested scoring table.
- Timer-based game end (`1:20` default) and optional target-word end condition.
- Popup feedback for valid words.

## Run
```bash
docker compose up --build
```

## URLs
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api`

## Backend Tests
```bash
docker compose run --rm backend python manage.py test
```

## Frontend Tests
```bash
docker compose run --rm frontend npm test
```

## API Endpoints
- `GET /api/health/`
- `GET /api/config/`
- `POST /api/validate-word/` with JSON body `{ "word": "example" }`

## Notes on Dictionary
Word validation now uses a single source only: `SCRABBLE_DICTIONARY_PATH` (default: `backend/dictionary/scrabble_words.txt`).
For official Scrabble behavior, place your licensed official lexicon in that file path (or set `SCRABBLE_DICTIONARY_PATH` to your file).
