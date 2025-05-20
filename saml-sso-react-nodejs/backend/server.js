// === Core Dependencies ===
const express = require("express")
const passport = require("passport")
const SamlStrategy = require("passport-saml").Strategy
const session = require("express-session")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()

const app = express()

// === Environment Variables ===
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001"
const BACKEND_PORT = process.env.BACKEND_PORT || 3001

// === Middleware Configuration ===
// Body parser middleware to handle URL-encoded bodies (HTML forms) and JSON payloads
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// CORS middleware configuration
// Allows requests from the React frontend and enables credentials
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
)

// Session middleware configuration
// Manages user sessions with cookies
// Note: In production, 'secure' should be true and use a proper secret
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set true in production with HTTPS
  })
)

// === Passport Authentication Setup ===
// Initialize Passport and restore authentication state from session
app.use(passport.initialize())
app.use(passport.session())

// Serialize user for the session
// Determines which data of the user object should be stored in the session
passport.serializeUser((user, done) => {
  console.log("serializeUser:", user)
  done(null, user)
})

// Deserialize user from the session
// Retrieves user data from session data
passport.deserializeUser((user, done) => {
  console.log("deserializeUser:", user)
  done(null, user)
})

// === SAML Strategy Configuration ===
// Sets up SAML authentication with the Identity Provider (IdP)
passport.use(
  new SamlStrategy(
    {
      entryPoint: process.env.SAML_ENTRYPOINT, // URL where users will be redirected to login
      issuer: process.env.SAML_ISSUER, // Your application's identifier
      cert: process.env.SAML_CERT, // IdP's public certificate
      callbackUrl: `${BACKEND_URL}/login/callback`, // URL where IdP will return the user
      disableRequestedAuthnContext: true, // Disable authentication context requirements
      identifierFormat: null, // Don't enforce identifier format
      passReqToCallback: true, // Pass request object to callback
    },
    // Callback function executed when SAML response is received
    (req, profile, done) => {
      console.log("SAML profile:", profile)
      return done(null, profile)
    }
  )
)

// === Authentication Routes ===
// Initiates SAML login process
// Redirects user to IdP login page
app.get("/login", (req, res, next) => {
  passport.authenticate("saml")(req, res, next)
})

// Handles SAML response from IdP
// Processes the authentication response and creates user session
app.post("/login/callback", (req, res, next) => {
  passport.authenticate("saml", (err, user) => {
    if (err || !user) {
      console.error("SAML authentication error:", err)
      return res.redirect(FRONTEND_URL)
    }
    // Create user session
    req.logIn(user, (err) => {
      if (err) {
        console.error("Session save error:", err)
        return res.status(500).send("Login failed")
      }
      return res.redirect(`${FRONTEND_URL}/logged-in`)
    })
  })(req, res, next)
})

// Handles user logout
// Destroys the session and redirects to home page
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(FRONTEND_URL)
  })
})

// Protected profile route
// Returns user profile information if authenticated
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" })
  }
  const user = req.user
  res.json({
    email:
      user[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ],
    displayName:
      user["http://schemas.microsoft.com/identity/claims/displayname"],
    nameID: user.nameID,
  })
})

// Prevent favicon.ico requests from generating 404 errors
app.get("/favicon.ico", (req, res) => res.status(204).end())

// === Server Initialization ===
// Start the Express server on specified port
app.listen(BACKEND_PORT, () => console.log(`Server running on ${BACKEND_URL}`))
