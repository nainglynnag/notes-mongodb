# Notes-mongodb

A simple **note-taking app** built with **Express, EJS, MongoDB, and TailwindCSS**, bundled with **Bun**.  
Currently supports **CRUD operations for text notes** and **user authentication (sign up, sign in, sign out)**.  
More features (checklist, images, reminders, archive, account settings, etc.) are planned for future updates.

---

## Tech Stack

- [Express.js](https://expressjs.com/) – Backend framework
- [EJS](https://ejs.co/) – Template engine for server-side rendering
- [MongoDB](https://www.mongodb.com/) – NoSQL database for storing notes & user data
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- [Bun](https://bun.sh/) – Fast bundler & runtime

---

## 📌 Features (so far)

- Create, read, update, and delete **text notes**
- User authentication
- Sign up
- Sign in
- Sign out
- Create, read, update, and delete **user data**

---

## 🛠️ Planned Features

- ☑️ Checklist notes
- 🖼️ Image attachments
- ⏰ Reminders & notifications
- 📦 Archive & restore notes
- ⚙️ Account settings
- 🎨 Better UI improvements

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nainglynnag/notes-mongodb.git
cd notes-mongodb
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

### 4. Start the server

```bash
bun start
```

## Project Structure

```
│── app.js            # Entry point
│── routes/           # Express route handlers
│── controllers/      # Controller logic
│── models/           # Mongoose models
│── config/           # Mongoose database connection
│── views/            # EJS templates
│── public/           # Static files (CSS, JS, images)
│── src/              # Tailwind CSS styles
│── .env              # Environment variables
│── package.json      # Dependencies
```

This project was created using bun init in bun v1.2.22. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
