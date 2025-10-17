# TIPEC EXAM TEST

## TECH

- React with vite
- Bootstrap
- SCSS
- supabase (later)

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
