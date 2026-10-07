# Wilmer Pocaterra — Developer Portfolio

Responsive portfolio frontend built with React. It presents Wilmer Pocaterra's background and projects, and connects to a separate Express API for project data and administration.

## Features

- Animated home and about pages with responsive navigation.
- Public project gallery loaded from the portfolio API.
- Admin dashboard with email/password sign-in, project listing, image upload, create, edit, and delete actions.
- EmailJS contact form with success/error feedback, contact details, and an OpenStreetMap map.

## Stack

- React 17, Create React App, and React Router 6
- Sass, Animate.css, and React Loaders
- Express API with MongoDB/Mongoose, JWT authentication, and Cloudinary image storage (backend project)
- React Leaflet with OpenStreetMap tiles
- EmailJS for contact form delivery

## Run locally

### Requirements

- Node.js and npm
- The companion `portfolio-backend` project running locally
- A configured MongoDB database and Cloudinary account for the backend
- An EmailJS service and template configured to receive contact form submissions

### Start the backend

Set up and run the backend by following the README in the companion `portfolio-backend` repository. By default, the API listens at `http://localhost:5000`. Create the administrator account using the backend's `npm run create-admin` command.

### Start this frontend

```bash
npm install
cp .env.example .env
npm start
```

Set `REACT_APP_API_URL` in `.env` to the API base URL, including `/api` (for example, `http://localhost:5000/api`). The React development server runs at [http://localhost:3000](http://localhost:3000). Restart it after changing environment variables.

The contact form sends the `name`, `email`, `subject`, and `message` fields through EmailJS. Its service ID, template ID, and public key are configured in `src/components/Contact/index.js`; the public key is also initialized in `public/index.html`. Replace these values with your EmailJS project settings and allow your deployed domain in EmailJS.

## API integration

The frontend uses the following backend routes:

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/projects` | Public | Load the project gallery and dashboard list. |
| `POST` | `/api/auth/login` | Public | Sign in with the admin email and password. |
| `GET` | `/api/auth/me` | JWT | Restore and verify an existing admin session. |
| `POST` | `/api/projects` | Admin JWT, multipart | Create a project and upload its image. |
| `PATCH` | `/api/projects/:id` | Admin JWT, multipart | Edit project details and optionally replace its image. |
| `DELETE` | `/api/projects/:id` | Admin JWT | Delete a project. |

Project requests use the backend's `name`, `description`, `url`, `code`, and `image` fields. The backend stores image URLs in Cloudinary and returns project records with MongoDB `_id` values. The API client is in `src/services/api.js`; project browsing is in `src/components/Portfolio/`, and administration is in `src/components/Dashboard/`.

The JWT is stored in browser `localStorage` for this portfolio dashboard. The API remains responsible for checking authorization on every write request. For a higher-risk deployment, consider moving the session to secure, `httpOnly`, `sameSite` cookies.

## Configuration and deployment

- Set `REACT_APP_API_URL` to the deployed backend API base URL before building the frontend.
- Set the backend's `CLIENT_URL` to the exact deployed frontend origin so its CORS policy accepts browser requests.
- Deploy the frontend and backend as separate services, or use a platform that supports both. The frontend can be built with `npm run build`; publish the resulting `build/` directory and configure SPA route fallback to `index.html`.
- Keep MongoDB, JWT, and Cloudinary secrets only in the backend environment. Do not commit either project's `.env` files.

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Starts the frontend development server. |
| `npm run build` | Creates the production frontend in `build/`. |
| `npm test` | Starts the Create React App test runner. |

## Structure

```text
public/                      HTML template, icons, manifest, and public assets
src/
  assets/                    Fonts and image assets
  components/                Pages and shared UI
    Contact/                 EmailJS contact form and map
    Dashboard/                Protected project administration
    Portfolio/                API-backed public project gallery
  services/api.js            API client and request helpers
  App.js                     Application routes
  index.js                   React entry point
```

## Current integration note

The React app now targets the companion backend API. Its project controller uploads images through Cloudinary, saves the live project URL, and applies URL changes when editing. Creating and managing records still requires the companion backend, MongoDB, and Cloudinary to be configured and running.
