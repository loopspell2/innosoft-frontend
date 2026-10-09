# Meeting Room Booking: Backend

A REST API built with Express, TypeScript and MongoDB (Mongoose) for managing meeting rooms and bookings.

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose

## Features

- List meeting rooms
- Create bookings with validation (required fields, valid time range, existing room)
- List bookings, optionally filtered by room
- Delete a booking
- Check room availability for a date and time range, with an optional minimum capacity

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB instance (local or MongoDB Atlas)

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env` file in the project root:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### Seed the rooms

```bash
npx tsx src/config/seed.ts
```

This clears the rooms collection and inserts 5 sample rooms (Atlas, Borealis, Cascade, Delta, Ember).

### Run the server

```bash
npm run dev
```

The API runs at `http://localhost:5000` by default.

## Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the server in dev mode     |
| `npm run build` | Compile TypeScript (`tsc -b`)    |
| `npm run seed`  | Seed sample rooms                |

## Environment Variables

| Variable    | Description                   |
| ----------- | ----------------------------- |
| `MONGO_URI` | MongoDB connection string     |
| `PORT`      | Port the API listens on       |

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint                                                  | Description                              |
| ------ | --------------------------------------------------------- | ---------------------------------------- |
| GET    | `/room`                                                   | List all rooms                           |
| GET    | `/booking?roomId=`                                        | List bookings, optionally by room        |
| POST   | `/booking`                                                | Create a booking                         |
| DELETE | `/booking/:id`                                            | Delete a booking                         |
| GET    | `/booking/availability?date=&start=&end=&minCapacity=`    | List rooms free for the given time range |

### Create a booking

`POST /api/booking`

```json
{
  "roomId": "<room id>",
  "title": "Sprint planning",
  "organizerEmail": "organizer@example.com",
  "attendees": ["a@example.com", "b@example.com"],
  "start": "2026-10-12T10:00:00",
  "end": "2026-10-12T11:00:00"
}
```

Responses:

- `201`: booking created
- `400`: missing fields, invalid time range, room not found, or time slot already booked
- `500`: server error

### Check availability

`GET /api/booking/availability?date=2026-10-12&start=10:00&end=11:00&minCapacity=8`

Returns the rooms that have no overlapping booking in that time range.

## Data Models

**Room**

| Field       | Type     |
| ----------- | -------- |
| `name`      | string   |
| `capacity`  | number   |
| `floor`     | number   |
| `Amenities` | string[] |

**Booking**

| Field            | Type     |
| ---------------- | -------- |
| `roomId`         | ObjectId (ref Room) |
| `title`          | string   |
| `organizerEmail` | string   |
| `attendees`      | string[] |
| `start`          | Date     |
| `end`            | Date     |

## Project Structure

```
src/
├── config/       # DB connection and seed script
├── controller/   # Route handlers (rooms, bookings)
├── model/        # Mongoose models (Room, Bookings)
├── routes/       # Express routes
└── index.ts      # App entry point
```