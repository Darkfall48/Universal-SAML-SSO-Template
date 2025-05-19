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

Create a `.env` file in the `backend` folder with the following variables:

```bash
# Backend server port (default: 3001)
# This is the port where your Express backend server will run
PORT=3001

# SAML Identity Provider (IdP) Entry Point URL
# This is the URL where users will be redirected to authenticate
# For Azure AD, it's typically like: https://login.microsoftonline.com/{tenant-id}/saml2
# For other IdPs, use their specific SSO URL
SAML_ENTRYPOINT=<your_entrypoint_url>

# SAML Service Provider (SP) Entity ID/Issuer
# This is a unique identifier for your application
# Must match exactly what you configured in your IdP settings
# Example: 'my-app' or 'https://my-app.com'
SAML_ISSUER=<your_issuer>

# X.509 Certificate from your Identity Provider
# This is the public certificate used to verify SAML responses
# Must be in base64 format and all on one line with \n for newlines
# Typically obtained from your IdP's SAML configuration
SAML_CERT=<your_x509_certificate>
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
   - Set this to: `http://localhost:<BACKEND_PORT>/login/callback`
   - The BACKEND_PORT should match the PORT value in your `.env` file (default: 3001)
   - Example with default port: `http://localhost:3001/login/callback`
   - In production, replace with your actual domain: `https://your-domain.com/login/callback`
2. **Entity ID / Issuer**:

   - Must match the `SAML_ISSUER` value in your `.env` file
   - Example: `my-app` or `https://my-app.com`

3. **Name ID Format**:
   - Recommended: `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress`

Note: The exact configuration steps and terminology may vary depending on your IdP (Azure AD, Okta, Auth0, etc.).

## Credits

This project was created by [@darkfall48](https://github.com/Darkfall48).
