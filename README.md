# Sunran Estate Backend

## Requirements
- Node.js 18 or newer
- Internet connection for the first install

## Run the project
1. Open this `backend` folder in VS Code.
2. Open Terminal > New Terminal.
3. Run `npm install`.
4. Run `npm start`.
5. Open http://localhost:3000 in your browser.

The server hosts the existing website and its API.

## API endpoints
- `GET /api/health` — check that the server is running
- `GET /api/properties` — list properties (supports location, type, maxPrice, bedrooms, featured, sort)
- `GET /api/properties/:id` — one property
- `POST /api/enquiries` — save a contact enquiry
- `GET /api/admin/enquiries` — list enquiries (admin key required)
- `POST /api/admin/properties` — add a property (admin key required)
- `PUT /api/admin/properties/:id` — update a property (admin key required)
- `DELETE /api/admin/properties/:id` — delete a property (admin key required)

## Admin key
For local practice, the default key is `change-this-admin-key`.
Before deployment, set a strong secret using the `ADMIN_KEY` environment variable. Do not expose it in frontend JavaScript or commit it to a public repository.

Property records are stored in `backend/data/properties.json`; enquiries are stored in `backend/data/enquiries.json`. Back up these files. For a production business site, use a managed database, HTTPS, stronger admin authentication, rate limiting, validation, and email notifications.
