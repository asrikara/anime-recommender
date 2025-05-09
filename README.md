# Anime Recommender

A modern web application that helps users discover anime based on their preferences and emotional content.

## Features

- Search anime by description
- Filter by genres
- View emotion analysis for each anime
- Modern, responsive UI
- Dark mode support

## Project Structure

```
anime-recommender/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   └── App.tsx    # Main application component
│   └── package.json   # Frontend dependencies
├── backend/           # FastAPI backend
│   ├── main.py       # API endpoints
│   └── requirements.txt # Backend dependencies
└── README.md         # This file
```

## Setup

### Backend Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Copy your `anime_with_emotions.csv` file to the backend directory.

4. Start the backend server:
   ```bash
   python main.py
   ```

The backend will run on http://localhost:8000

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on http://localhost:5173

## Usage

1. Open http://localhost:5173 in your browser
2. Enter a description of what kind of anime you want to watch
3. Use the genre filter to narrow down your search
4. Browse through the recommendations
5. Click on an anime card to see more details

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - Recharts
  - Axios

- Backend:
  - FastAPI
  - Pandas
  - Pydantic

Done