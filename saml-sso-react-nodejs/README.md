# Universal SAML SSO Template

A template for implementing SAML SSO authentication with a React frontend and Node.js/Express backend.

## Architecture

- **Frontend**: React application built with Create React App
- **Backend**: Node.js/Express server using Passport.js for SAML authentication

## Features

- SAML SSO Authentication
- Session Management
- Protected Routes
- User Profile Retrieval
- Logout Functionality

## Security Considerations

For production deployment:

- Enable HTTPS
- Change session secret
- Configure CORS properly
- Enable helmet and other security middlewares

## Prerequisites

- Node.js 14+
- npm 6+

## Installation

1. Clone the repository:

```bash
gh repo clone Darkfall48/Universal-SAML-SSO-Template
cd Universal-SAML-SSO-Template
```

2. Install dependencies:

For backend:

```bash
cd backend
npm install
```

For frontend:

```bash
cd frontend
npm install
```

3. Configure environment variables:

Create a `.env` file in the root folder with the following variables:

```bash
#---Backend Configuration---
BACKEND_PORT=3001
BACKEND_URL=http://localhost:3001

#---Frontend Configuration---
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000

#---SAML Configuration---
# Azure AD SAML entry point (from "Login URL" in Azure's SAML setup)
SAML_ENTRYPOINT=<your_entrypoint_url>
# Issuer name — must match what you put in Azure under "Identifier (Entity ID)"
SAML_ISSUER=<your_issuer>
# Azure AD X.509 certificate (from "SAML Signing Certificate" > Base64 download)
# Must be a single-line string with newline characters escaped as \n
SAML_CERT=<your_x509_certificate>
```

## Environment Variables

The application uses environment variables for configuration, which can be set in two ways:

1. Through the `.env` file (recommended for development)
2. Through Docker environment variables (recommended for production)

### Available Environment Variables:

| Variable        | Description                     | Default               |
| --------------- | ------------------------------- | --------------------- |
| BACKEND_PORT    | Port for the backend server     | 3001                  |
| BACKEND_URL     | URL for the backend server      | http://localhost:3001 |
| FRONTEND_PORT   | Port for the frontend server    | 3000                  |
| FRONTEND_URL    | URL for the frontend server     | http://localhost:3000 |
| SAML_ENTRYPOINT | SAML Identity Provider URL      | Required              |
| SAML_ISSUER     | SAML Service Provider Entity ID | Required              |
| SAML_CERT       | X.509 Certificate from IdP      | Required              |

### Docker Configuration

When using Docker, the environment variables can be overridden in the `docker-compose.yml` file or through command line:

```bash
docker-compose up -d --env-file .env.production
```

## Getting Started

1. Start the backend:

```bash
cd backend
npm start
```

2. Start the frontend:

```bash
cd frontend
npm start
```

The application will be accessible at:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## IdP Configuration

When configuring your Identity Provider (IdP), you need to set up the following:

1. **Callback URL / Assert URL / ACS URL**:

   - Set this to: `${BACKEND_URL}/login/callback`
   - The URL is configured through the BACKEND_URL environment variable
   - Example with default settings: `http://localhost:3001/login/callback`
   - In production, replace with your actual domain: `https://your-domain.com/login/callback`

2. **Entity ID / Issuer**:

   - Must match the `SAML_ISSUER` value in your `.env` file
   - Configurable through the SAML_ISSUER environment variable
   - Example: `my-app` or `https://my-app.com`

3. **Name ID Format**:

   - Recommended: `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress`

4. **Response URL**:

   - The application expects responses at: `${BACKEND_URL}/login/callback`
   - This URL should match your Callback URL setting

5. **Sign-on URL**:
   - Your application will initiate login at: `${BACKEND_URL}/login`
   - This endpoint triggers the SAML authentication flow

Note: The exact configuration steps and terminology may vary depending on your IdP (Azure AD, Okta, Auth0, etc.). All URLs are configurable through environment variables to support different deployment environments.

## Credits

This project was created by [@darkfall48](https://github.com/Darkfall48).
