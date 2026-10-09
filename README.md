# Meeting Room Booking: Frontend

A React + TypeScript + Vite app for booking meeting rooms. It connects to a separate REST API for rooms and bookings.

## Tech Stack

- React + TypeScript
- Vite

## Features

- View all meeting rooms
- Check which rooms are available for a date and time range, with an optional minimum capacity
- Create a booking (title, organizer email, attendees, start and end time)
- View and delete bookings

## Getting Started

### Prerequisites

- Node.js 18 or newer
- The backend API running (default: `http://localhost:5000`)

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:5000/api
```

Restart the dev server after changing `.env`.

### Run the app

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the dev server                |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | Run ESLint                          |

## Environment Variables

| Variable       | Description                 |
| -------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the backend API |

Only variables starting with `VITE_` are exposed to the browser, so never put secrets here.

## API Used

The app calls these endpoints on `VITE_API_URL`:

| Method | Endpoint                                                  | Description                       |
| ------ | --------------------------------------------------------- | --------------------------------- |
| GET    | `/room`                                                   | List all rooms                    |
| GET    | `/booking`                                                | List all bookings                 |
| POST   | `/booking`                                                | Create a booking                  |
| DELETE | `/booking/:id`                                            | Delete a booking                  |
| GET    | `/booking/availability?date=&start=&end=&minCapacity=`    | List rooms free for a time range  |

The API client lives in `src/api.ts`.

## Project Structure

```
src/
├── api.ts        # API client (fetch wrapper and endpoints)
├── components/   # UI components
└── App.tsx       # Root component
```

## Deployment

Set `VITE_API_URL` in your hosting platform (for example Vercel or Netlify) to your deployed backend URL, then run:

```bash
npm run build
```

The production files are created in the `dist` folder.