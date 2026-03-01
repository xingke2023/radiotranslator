# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RadioTranslator is a radio streaming platform with real-time transcription and translation capabilities. It consists of three main components:

1. **Node.js Backend** (Express + MySQL + Sequelize) - API server, authentication, subscriptions
2. **React Frontend** (Vite + Tailwind CSS) - User interface
3. **Python Radio Scraper** (Flask app in `radiobase/radionet/`) - Fetches radio station data from radio.net

## Architecture

### Multi-Server Setup

The application runs on specific ports configured in production:
- **Frontend (Vite dev server)**: Port 8400
- **Backend (Express API)**: Port 8401 (configured via PORT env variable)
- **Python Flask app**: Port 5000 (separate service)

The frontend proxies `/api` requests to the backend server (see `client/vite.config.js:10-13`).

### Database

Uses MySQL with Sequelize ORM. Key models:
- **User** - Authentication, subscription status, JWT tokens
- **Radio** - Station information, stream URLs, subscription requirements
- **Subscription** - User subscriptions, Stripe integration
- **Translation** - Translation history records

Database connection is initialized in `server/index.js:95-110` with `sequelize.sync({ alter: false })` - schema changes should use migrations, not auto-alter.

### Authentication & Authorization

JWT-based authentication implemented in `server/middleware/auth.js`:
- `authenticateToken` - Validates JWT from Authorization header
- `requireSubscription(tier)` - Enforces subscription tiers (basic/premium)

Routes use these middleware to protect endpoints. Tokens are issued on login/register via `server/routes/auth.js`.

### Real-time Features

Socket.io integration (server/index.js:11-58) supports:
- `join-radio` / `leave-radio` events for room-based broadcasting
- Socket.io instance accessible via `app.set('socketio', io)` for use in routes

### Payment Integration

Stripe is integrated for subscription payments:
- Checkout sessions: `POST /api/subscriptions/create-checkout-session`
- Webhook handler: `POST /api/subscriptions/webhook` (receives Stripe events)
- **Critical**: Webhook route uses raw body parsing (server/index.js:22) - must be registered BEFORE express.json()

See `STRIPE_INTEGRATION_SUMMARY.md` and `STRIPE_SETUP.md` for detailed setup instructions.

### Radio Station Data

The `radiobase/radionet/` directory contains a separate Python Flask application that scrapes radio station data from radio.net:
- Main scraper: `radio_scraper.py` - RadioNetScraper class
- Flask app: `app.py` - REST API for station data
- Pre-fetched data: `top_stations_with_streams.json` (also in `server/`)

The Python app runs independently and the Node.js backend can use either:
1. Direct API calls to the Python service
2. The static JSON file at `server/top_stations_with_streams.json`

## Development Commands

### Start Development Environment

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start separately:
npm run server:dev    # Backend only (nodemon)
npm run client:dev    # Frontend only (Vite)
```

### Production Build

```bash
# Build frontend for production
npm run build

# Start production server (serves built frontend + API)
npm start
```

### Python Radio Scraper

```bash
cd radiobase/radionet
pip install -r requirements.txt
python app.py  # Starts Flask server on port 5000
```

### Database

```bash
# Run migrations (if migration script exists)
npm run db:migrate
```

Database is auto-synced on server start, but `alter: false` prevents destructive changes in production.

### PM2 Deployment

Production deployment uses PM2:

```bash
# Start production backend (port 8401)
NODE_ENV=production PORT=8401 pm2 start server/index.js --name radiotranslator-api

# Or using pm2 start with env variables
pm2 start server/index.js --name radiotranslator-api -- --env production

# View logs
pm2 logs radiotranslator-api

# Restart
pm2 restart radiotranslator-api

# Save PM2 process list
pm2 save
```

The frontend is built and served as static files from `client/dist` by the Express server in production mode (see server/index.js:64-76).

## Environment Variables

### Backend (.env in root)

```
PORT=8401                # Production: 8401, Dev: 3000
NODE_ENV=production      # or development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=radiotranslator
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key
STRIPE_WEBHOOK_SECRET=whsec_webhook_secret
CLIENT_URL=http://localhost:8400  # For CORS and redirects
```

### Frontend (client/.env)

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key
VITE_API_URL=http://localhost:8401  # Backend API URL
```

## Key Technical Details

### Frontend Routing

React Router handles client-side routing. In production, Express serves `client/dist/index.html` for all non-API routes (server/index.js:69-75) to support SPA routing.

### Internationalization

The frontend uses i18next for multi-language support (see `client/src/i18n/`). Language detection is automatic via browser settings.

### Static Assets

- `ads.txt` is served from root via dedicated route (server/index.js:28-31)
- Production frontend assets served from `client/dist` (server/index.js:64-76)

### Stripe Webhook Testing

In development, use Stripe CLI to forward webhooks:

```bash
stripe listen --forward-to localhost:8401/api/subscriptions/webhook
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env`.

### API Structure

Routes are organized by feature in `server/routes/`:
- `auth.js` - Login, register
- `users.js` - User profile management
- `radio.js` - Radio station endpoints
- `stations.js` - Station data from scraper
- `subscriptions.js` - Stripe payment and subscription management
- `translations.js` - Translation history

## Important Patterns

### Error Handling

Global error handler in `server/index.js:84-90` catches all errors. In development mode, error details are exposed; in production, generic messages only.

### Database Connection

Server won't start until database connection is successful (server/index.js:95-110). Failed connection exits with code 1.

### Subscription Tiers

Two tiers exist: `basic` and `premium`. Tier levels are enforced via middleware (server/middleware/auth.js:38-40):
- basic = level 1
- premium = level 2

Higher tier users can access lower tier content.

### Socket.io Access in Routes

Routes can access the socket.io instance to broadcast real-time updates:

```javascript
const io = req.app.get('socketio');
io.to(`radio-${radioId}`).emit('event-name', data);
```

## Testing

```bash
npm test  # Runs Jest tests (if configured)
```

Test framework is set up (jest in package.json) but test files may need to be created.

## Common Issues

1. **Port conflicts**: Ensure ports 8400 (frontend) and 8401 (backend) are available in production
2. **Database sync**: If schema changes are needed, modify models and restart with caution - consider using migrations
3. **Stripe webhooks**: In production, configure webhook URL in Stripe Dashboard to point to your domain
4. **CORS issues**: Ensure CLIENT_URL in backend .env matches actual frontend URL

## Related Documentation

- `README.md` - Full project documentation (in Chinese)
- `STRIPE_SETUP.md` - Detailed Stripe integration guide
- `WEBHOOK_SETUP.md` - Webhook configuration instructions
- `radiobase/radionet/README.md` - Python radio scraper documentation
- `radiobase/radionet/API_DOCUMENTATION.md` - Radio scraper API reference
