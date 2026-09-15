# Play and Learn SQL - Project Report

## 1. Project Overview

Play and Learn SQL is an interactive web application for learning SQL. It combines short lessons, SQL practice questions, a live query editor, quiz questions, progress tracking, and a database schema reference.

The application is designed for beginners. A learner reads a lesson, writes a query, sends it to the backend database, views the result, and answers a quiz.

## 2. Technology Stack

### Frontend

- Angular 22 standalone component architecture
- TypeScript for application logic
- HTML for the user interface
- CSS for layout, colors, responsive design, and feedback states
- Angular FormsModule for two-way binding in the SQL editor
- Angular CommonModule for conditional rendering and loops
- Fetch API for communication with the backend

### Backend

- Node.js runtime
- Express.js web framework
- CORS middleware so the Angular development server can call the backend
- Express JSON middleware for reading request bodies
- sqlite3 Node.js package for database access
- SQLite database stored in `backend/playandlearn.db`

The current application uses a real backend API with SQLite. `sql.js` is still present in the frontend package file from an earlier experiment, but it is not used by the current query-execution flow.

## 3. Project Structure

```text
Ply_and_learn/
|-- backend/
|   |-- server.js
|   |-- package.json
|   `-- playandlearn.db
`-- bunnywithlife.github.io/
    |-- package.json
    |-- angular.json
    |-- public/
    `-- src/app/
        |-- app.ts
        |-- app.html
        |-- app.css
        |-- app.config.ts
        |-- app.routes.ts
        `-- app.spec.ts
```

## 4. How the Application Works

1. Angular starts the frontend application.
2. The user selects Home, Lessons, or Roadmap.
3. A lesson displays SQL concepts, syntax, examples, hints, and practice questions.
4. The user writes a query in the SQL editor.
5. Angular sends the query using `POST /api/query`.
6. Express receives the request and executes the SQL using SQLite.
7. The backend returns rows or an SQL error as JSON.
8. Angular displays the result in the query result area.
9. The app compares the normalized query with the expected practice answer.
10. A correct practice query awards 50 XP. A correct quiz answer awards 30 XP.
11. Level is calculated from XP, and the streak increases after a successful activity.

## 5. Backend API Endpoints

### GET /api/health

Checks whether the backend is running.

Example response:

```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### POST /api/query

Executes a SQL query against the SQLite database.

Request body:

```json
{
  "query": "SELECT * FROM users LIMIT 2;"
}
```

Successful response:

```json
{
  "rows": [
    { "id": 1, "name": "John Doe", "email": "john@example.com", "age": 28 }
  ]
}
```

If SQLite rejects the query, the endpoint returns an HTTP 400 response containing the database error.

### POST /api/progress

Receives learning progress information.

Request body:

```json
{
  "username": "demoUser",
  "exerciseId": 1,
  "completed": true
}
```

The current endpoint confirms that progress was received. The frontend keeps the visible XP, level, and streak in memory during the session.

## 6. Database Design

The backend creates and seeds these SQLite tables:

- `users`: id, name, email, age
- `products`: id, name, price, stock
- `employees`: id, name, department, salary
- `orders`: id, customer_id, order_date, status
- `customers`: id, name, email, is_active

The seed data gives learners safe sample records for SELECT, filtering, sorting, aggregate, and join exercises.

## 7. Important Frontend Features

- Lesson roadmap with all available lessons
- Lesson navigation using Previous and Next buttons
- Practice question selector
- SQL query editor
- Query execution feedback
- Query result display
- Quiz answer selection and explanations
- Hint system with an XP cost
- Database schema reference cards
- Level, XP, and streak summary
- Responsive layout for desktop and mobile screens

## 8. XP and Progress Logic

- Starting level: 1
- Starting XP: 0
- Starting streak: 0
- Correct practice query: 50 XP
- Correct quiz answer: 30 XP
- Level formula: `floor(total XP / 100) + 1`
- Re-running an already completed practice query does not award duplicate XP

The current progress values are session-only. Refreshing the browser resets them because the backend progress endpoint currently acknowledges progress but does not store user accounts or totals.

## 9. Exam Explanation

This project is a full-stack educational web application. The frontend is built with Angular and TypeScript. The backend is a Node.js Express REST API. SQLite is used as the relational database, and the `sqlite3` package connects the backend to that database.

The frontend and backend communicate through HTTP requests. When a learner executes SQL, Angular sends the query to the Express API. Express passes it to SQLite, receives the rows, and sends JSON back to Angular. This is better than only checking the query text because the SQL is actually executed against a real database.

The project follows a simple client-server architecture:

```text
User -> Angular UI -> Express REST API -> SQLite database
User <- Angular UI <- JSON response <- Express REST API
```

## 10. Running the Project

Start the backend:

```text
cd backend
npm install
npm start
```

Start the frontend in a second terminal:

```text
cd bunnywithlife.github.io
npm install
npm start
```

The default addresses are:

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`

## 11. Future Improvements

- Store users, XP, levels, and streaks permanently in SQLite
- Add authentication and separate learner accounts
- Restrict destructive SQL statements in a public deployment
- Add automated backend API tests
- Add more detailed query result tables and schema relationships
- Remove the unused `sql.js` dependency from the frontend package
