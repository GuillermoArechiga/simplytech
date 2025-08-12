# SimplyTech Challenge

This is a REST API for managing events and reservations, built with Node.js, Express, MongoDB, and Docker.

---

## Prerequisites

- Docker and Docker Compose installed on your machine
- (Optional) Postman or any API client for testing endpoints

---

## Rules

Users
- Users must register with a unique email.
- Passwords are securely hashed using bcrypt.
- Users must authenticate via JWT to access protected routes.
- Users can only view and edit their own profile.

Events
- Events must have a name, future date, location, and capacity.
- Users can create events and become the event's owner.
- Only the event creator can edit or delete their event.
- Event date must be validated to ensure it is set in the future.
- Event capacity is tracked as total and current available spots.

Reservations
- Users can book a spot only if there are available spots (currentCapacity > 0).
- Duplicate reservations for the same user and event are prevented.
- When a reservation is made, the event's current capacity decreases by 1.
- Users can cancel their own reservations, which restores the capacity by 1.
- Only the user who created a reservation can cancel it.

---

## How to Run the Application Using Docker

1. Clone the repository

```
git clone https://github.com/GuillermoArechiga/simplytech.git
cd simplytech
```

2. Build and start the containers

   This will start the MongoDB database and your Express app.

```
docker compose up --build
```

3. Access the app

   The API server will be running on:  
   http://localhost:3000

4. Seed the database (for challenge)

   The app is configured to run the seed script automatically on startup, populating initial data.

---

## How to Run Tests

1. Access the running app container

   Open a terminal session inside the Express app container:

   docker exec -it express_app sh

2. Run the tests

   Inside the container, run:

   npm test

   This will execute Jest tests and show results in the terminal.

---

## Environment Variables

- MONGO_URI: MongoDB connection string for production
- MONGO_URI_TEST: MongoDB connection string for testing
- JWT_SECRET: Secret key for JWT authentication
- PORT: Server port (default: 3000)

These are set in the docker-compose.yml file for convenience.

---

## Pictures & Diagrams: How the Backend Works

https://docs.google.com/document/d/1Mbj7tTxFkO_-y8Aw2DluLjrhomhpcUXztQpwXl3kFA8/edit?usp=sharing

---

## API Endpoints (Summary)

- POST /users/register - Register a new user  
- POST /users/login - Login and receive JWT token  
- POST /events - Create a new event (auth required)  
- GET /events - List all events  (auth required)  
- GET /events/mine - List events created by the logged-in user (auth required)  
- PUT /events/:id/edit - Edit an event you created (auth required)  
- DELETE /events/:id - Delete an event you created (auth required)  
- POST /reservations - Create a reservation for an event (auth required)  
- DELETE /reservations/:id - Cancel a reservation (auth required)  

---

## Notes

- Use a tool like Postman to interact with the API endpoints.
- Remember to include the JWT token in the Authorization header as Bearer <token> for protected routes.

---

## Created By:
Jesus Guillermo Arechiga Avila
