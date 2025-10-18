# TIPEC EXAM TEST

## TECH

- React with vite
- Bootstrap
- SCSS
- supabase (later)

---

## DATABASE SCHEMA (Supabase)

### Current Tables

#### visitors

- `id` (BIGSERIAL PRIMARY KEY)
- `uuid` (TEXT UNIQUE NOT NULL) - Unique visitor identifier
- `role` (TEXT) - 'admin', 'member', or NULL for anonymous visitors
- `username` (TEXT) - Username if logged in
- `created_at` (TIMESTAMPTZ DEFAULT NOW())

#### users

- `id` (BIGSERIAL PRIMARY KEY)
- `uuid` (TEXT UNIQUE NOT NULL) - Links to visitors.uuid
- `username` (TEXT UNIQUE NOT NULL)
- `password_hash` (TEXT NOT NULL) - Bcrypt hashed password
- `email` (TEXT UNIQUE)
- `full_name` (TEXT)
- `role` (TEXT NOT NULL) - 'admin' or 'member'
- `created_at` (TIMESTAMPTZ DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ DEFAULT NOW())

### Authentication Utilities

- `src/utils/auth.js` - Password hashing and comparison functions using bcrypt
- Default admin user: username `admin`, password `admin123` (properly hashed)

---

## PROJECT STRUCTURE

- member can exam test

- Categories (IT, PROGRAMMING, ...)
- Exams (ITPEC, ..) [NOTE: related with category]
  - ITPEC
    - IP
    - FE
    - AP

NOTE: user can choose exam with limit questions and then show result(later: sent email) - admin can check users, exams, ..... use with supabase db

---

```
src
|__ assets
|   |__ data
|   |   |__ dummy.json
|   |__ icons
|   |__ images
|   |__ files
|__ context
|   |__ commonContext.js
|__ config
|   |__ .
|__ components
|   |__ common
|   |   |__ input.jsx
|   |   |__ select.jsx
|   |   |__ .
|   |   |__ .
|   |   |__ .
|   |   |__ index.js
|   |__ layout
|   |   |__ header.jsx
|   |   |__ layout.jsx
|   |   |__ footer.jsx
|   |   |__ .
|   |   |__ .
|   |   |__ .
|__ pages
|   |__ 404.jsx
|   |__ 500.jsx
|   |__ home.jsx
|   |__ admin
|   |   |__ dashboard.jsx
|   |__ member
|   |   |__ dashboard.jsx
|__ utils
|__ scss
|__ services
|   |__ http.js
|   |__ localStorage.js
|   |__ .
|   |__ .
|   |__ .
```

---
