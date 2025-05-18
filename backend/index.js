// === server/index.js ===
const express = require("express")
const passport = require("passport")
const SamlStrategy = require("passport-saml").Strategy
const session = require("express-session")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()

const app = express()

// Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// CORS to allow frontend to communicate
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set true in production with HTTPS
  })
)

// Passport setup
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  console.log("serializeUser:", user)
  done(null, user)
})

passport.deserializeUser((user, done) => {
  console.log("deserializeUser:", user)
  done(null, user)
})

passport.use(
  new SamlStrategy(
    {
      entryPoint: process.env.SAML_ENTRYPOINT,
      issuer: process.env.SAML_ISSUER,
      cert: process.env.SAML_CERT,
      callbackUrl: "http://localhost:3001/login/callback",
      disableRequestedAuthnContext: true,
      identifierFormat: null,
      passReqToCallback: true,
    },
    (req, profile, done) => {
      console.log("SAML profile:", profile)
      return done(null, profile)
    }
  )
)

// Routes
app.get("/login", (req, res, next) => {
  passport.authenticate("saml")(req, res, next)
})

app.post("/login/callback", (req, res, next) => {
  passport.authenticate("saml", (err, user) => {
    if (err || !user) {
      console.error("SAML authentication error:", err)
      return res.redirect("/")
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Session save error:", err)
        return res.status(500).send("Login failed")
      }
      return res.redirect("http://localhost:3000/logged-in")
    })
  })(req, res, next)
})

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000")
  })
})

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

// Favicon fix
app.get("/favicon.ico", (req, res) => res.status(204).end())

// Start
const PORT = process.env.PORT || 3001
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)
