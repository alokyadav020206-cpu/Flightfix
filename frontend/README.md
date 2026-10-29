# FlightFix frontend

React (Vite) frontend for the FlightFix aircraft maintenance app. It runs on dummy data
held in `src/data.js`, so no backend is needed to start.

## Run

    npm install
    npm run dev

Open http://localhost:5173 (home page), click Sign in, and use with any email and password.

## Connect Django later

1. Start Django on port 8000 (the Vite dev server already proxies `/api` to it).
2. Use the helpers in `src/api.js`, for example `api.get("/aircraft/")`.
3. In `src/context/DataContext.jsx`, replace the initial dummy data with a `useEffect`
   that loads each list from the API.
