# Riverside Community Hub

Riverside Community Hub is a full-stack community management platform built for a fictional non-profit organisation.

The platform allows members to manage their account, view community facilities, make facility bookings and contribute to the Riverside food parcel donation drive. Staff and administrators can manage bookings and view member information through the admin dashboard.

The project was built as part of Melsoft Academy Company Project 3.

## Live Application

Frontend: https://riverside-community-hub.vercel.app

Backend API: https://riverside-community-hub-api.onrender.com

GitHub: https://github.com/GarethMalekaMotloutsi/Riverside-Community-Hub

## Main Features

### Authentication

- Member registration and login
- Email and password authentication
- Supabase Authentication
- Email verification
- User profile information

### Member Dashboard

Members can:

- View their dashboard
- Access their profile
- View membership information
- Make facility bookings
- Manage their existing bookings
- Cancel bookings
- View donation information

### Facility Bookings

The system includes:

- Community Hall
- Meeting Room
- Training Room
- Gym Equipment
- Audio & Projector Equipment

Members can select a resource, choose a start and end time and submit a booking.

Bookings have different statuses:

- Pending
- Approved
- Rejected
- Cancelled

The database also prevents overlapping bookings for the same resource.

### Membership Profile

The profile page displays:

- Full name
- Email address
- Membership tier
- Join date

Membership tiers include:

- Free
- Standard
- Family

### Donations

The donation section includes:

- Food Parcel Donation Drive
- Donation goal
- Current amount raised
- Progress bar
- Donation amount
- Recurring donation pledge option

Donation records are stored in Supabase. A database trigger updates the campaign total when a new donation is recorded.

### Admin Dashboard

Staff and administrators can access an admin dashboard where they can:

- View pending bookings
- Approve bookings
- Reject bookings
- View members
- Search members
- View basic booking and donation statistics

The application checks the user's role before providing access to the admin dashboard.

## User Roles

The system uses different roles to control access.

### Member

Members can manage their own account and bookings and make donations.

### Staff

Staff members can manage bookings and view member information.

### Admin

Administrators have the same management capabilities as staff, with additional administrative access.

User roles are stored in the profiles table in Supabase.

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Supabase JavaScript Client

### Backend

- Node.js
- Express
- TypeScript
- CORS
- dotenv
- Zod

### Database and Authentication

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

### Deployment

- Vercel for the frontend
- Render for the backend

## Database

The main database tables are:

- profiles
- resources
- bookings
- donations
- campaigns
- notifications

The database uses relationships between users, profiles, resources and bookings.

Row Level Security is enabled to help control access to data based on the authenticated user and their role.

For example, members should only be able to access their own booking records, while staff and administrators have additional permissions.

## Backend API

The backend is built using Express and TypeScript.

The current API includes a health endpoint:

GET /api/health

It returns a simple response confirming that the Riverside Community Hub API is running.

The backend is deployed separately from the React frontend using Render.

## Running the Project Locally

### Frontend

Open a terminal and move into the client folder:

cd client

Install the dependencies:

npm install

Create a .env file inside the client folder and add:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

Start the development server:

npm run dev

### Backend

Open another terminal and move into the server folder:

cd server

Install the dependencies:

npm install

Build the TypeScript project:

npm run build

Start the server:

npm start

The backend uses the PORT environment variable when provided and falls back to port 5000 locally.

## Security

The project uses Supabase Row Level Security to protect database records.

Authentication is handled by Supabase Auth and the application uses the authenticated user's ID when working with member-specific data.

Environment variables are used for Supabase configuration and sensitive keys are not included directly in the source code.

The Supabase service role key is not used on the frontend.

## Booking Conflict Prevention

Booking conflicts are handled at database level rather than relying only on the frontend.

This helps prevent two users from booking the same resource for overlapping times.

The application also handles booking errors and displays an appropriate message to the user.

## Development Approach

The project was developed in stages, starting with the database structure and authentication before adding the booking, membership, donation and administration features.

The frontend was kept component-based using React pages and React Router, while Supabase handles authentication and database functionality.

The backend provides a separate Express API service and is deployed independently from the frontend.

## Deployment

The frontend is deployed through Vercel using the client directory as the root directory.

The production frontend is built using:

npm run build

The backend is deployed through Render using the server directory as the root directory.

The backend build command is:

npm install && npm run build

The backend start command is:

npm start

## Project Purpose

The purpose of Riverside Community Hub is to demonstrate how a full-stack application can be used to solve a practical community organisation problem.

The project brings together authentication, database design, role-based access, facility bookings, membership information, donations and administration into one application.