# portfolio_F

Awono Fabien — Portfolio
Project Documentation
Full Stack Developer · AI Enthusiast · Designer

1. Project Overview
   A personal portfolio web application built with Node.js and Express on the backend, plain HTML/CSS/JavaScript on the frontend, and SQLite as the database. The site showcases Awono Fabien's skills, projects, and provides a working contact system backed by a private admin dashboard.

Developer
Awono Fabien
Type
Personal Portfolio Website
Stack
Node.js · Express · SQLite · HTML/CSS/JS
Email Service
Nodemailer via Gmail SMTP
Styling
Bootstrap 5 + custom CSS (4 files)
Icons
Bootstrap Icons v1.11

2. Folder Structure
   The project is split into focused files to keep the server clean and maintainable:

File / Folder
Purpose
server.js
Entry point — mounts routes, middleware, starts server
routes/contact.js
Saves contact form submissions to SQLite
routes/reply.js
Sends email reply via Nodemailer
routes/dashboard.js
Serves the admin dashboard with all messages
routes/auth.js
Login / logout session handling
config/db.js
SQLite connection exported as singleton
config/mailer.js
Nodemailer transporter exported as singleton
js/main.js
All frontend JS (theme, form, dashboard, scroll)
css/
Bootstrap + 4 custom stylesheets
index.html
Main public-facing portfolio page

3. Key Features
   3.1 Contact Form
   • Client-side validation — name, email format, and message checked before any fetch call
   • On submit: page stays locked to the #Contact section using getBoundingClientRect()
   • Success or error shown via a fixed bottom-right popup (green / red) that fades after 3 s
   • Form data POSTed as JSON to /contact and saved to SQLite

3.2 Admin Dashboard
• Protected route — redirects to login if session is not authenticated
• Messages loaded dynamically via fetch('/api/messages') — no page reload
• Each message card includes an inline reply textarea (no alert / prompt dialogs)
• Reply sends a POST to /reply; confirmation text appears inside the card in green
• Delete removes a single card from the DOM instantly via card.remove() — no full reload
• Scroll position is saved and restored around every async action

3.3 Email Reply System
• Backend route POST /reply uses Nodemailer with Gmail SMTP
• Credentials stored in .env (EMAIL_USER, EMAIL_PASS) — never hardcoded
• Response text 'Reply sent to {email} successfully' returned and displayed inline

3.4 Theme Toggle
• Single button switches data-bs-theme between 'light' and 'dark' on <body>
• Bootstrap icon swaps between bi-sun-fill and bi-moon-stars-fill
• Button outline class also swaps to maintain contrast in both modes

3.5 Scroll-Aware Navigation
• IntersectionObserver-style scroll listener marks the active nav link
• Active class updated on both scroll and direct nav-link click

4. Backend Routes Summary

Method
Route
Description
POST
/contact
Saves contact form data to SQLite
POST
/reply
Sends email reply via Nodemailer to visitor
POST
/delete
Deletes a message by ID from SQLite
GET
/api/messages
Returns all messages as JSON for dashboard
GET
/dashboard
Serves admin dashboard (auth-protected)

5. Frontend Behaviour
   5.1 No Page Reloads
   Every form and button uses fetch() with e.preventDefault(). The browser never navigates away. All feedback is rendered in the DOM.

5.2 Scroll Position Preservation
window.scrollY is captured before each async call and restored with window.scrollTo({ behavior: 'instant' }) after it resolves. For delete, the saved Y is passed into loadMessages() and applied after the DOM is rebuilt.

5.3 Inline Reply Status
Each message card contains its own .reply-status <span>. After a reply is sent the backend response string is injected into that span in green. On failure it turns red. The span clears automatically after 4 seconds.

6. Environment & Security
   • Credentials kept in .env — EMAIL_USER, EMAIL_PASS never committed to source control
   • Dashboard protected by session-based auth check (isLoggedIn flag)
   • express.json() middleware parses incoming JSON bodies
   • .env should be added to .gitignore before any public repository push

7. Portfolio Sections

Home
Hero with name, title, CV download, social links and orbiting skill icons
About
Profile photo, bio paragraph, education, certifications, software tools
Skills
Three cards — Languages, Frontend, Backend & Tools
Projects
Three project cards with image, description, tags and GitHub links
Contact
Contact info + live form wired to backend + inline popup feedback

8. Tech Stack

Runtime
Node.js
Framework
Express.js
Database
SQLite3 (via sqlite3 npm package)
Email
Nodemailer + Gmail SMTP
Frontend
Vanilla HTML / CSS / JavaScript
UI Library
Bootstrap 5 + Bootstrap Icons
Environment
dotenv (.env file)

Awono Fabien · Portfolio Documentation · 2025
