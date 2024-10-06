# Messaging App
Full Stack messaging application made with Python + Javascript

# How to run the project
Run frontend:
cd frontend
npm run dev

Run backend:
cd backend
source venv/bin/activate
python3 main.py 






# Project Recap

## Why I made this application
This was my first full-stack application that I built from the ground up. While I have worked on multiple full-stack applications before, from debugging to adding features to refactoring, I have never had the opportunity to build an entire full-stack application from nothing. This was an important but intimidating goal for me. I chose to do a messaging app because it seemed fun, and could be accomplished on a small scale with a relatively small amount of code. As my full-stack experience progresses, I intend to rebuild this app with improved scalability and security. For now, this project serves to demonstrate that I am capable of working with different technologies to build a full stack application.

## Framework and Library Decisions
### Why did you choose React for the frontend?
Discuss the benefits of React, such as component-based architecture, virtual DOM for efficient UI updates, and its ecosystem with a variety of libraries.

### Why did you choose Flask for the backend?
I chose Flask due to its simplicity to learn and get set up. It is a micro web framework that is good to learn for newer developers such as myself, as I implemented this while still an undergraduate student. It also is good for small projects such as this one.

### Why did you choose Flask_SQLAlchemy over a different ORM (Object-Relational Mapper) or directly using SQL queries?
Consider reasons like SQLAlchemy’s support for database abstraction, ease of use with Python, and how it integrates seamlessly with Flask to handle complex queries with a simpler syntax.

### Why did you include Flask_CORS in your stack?
Mention how Flask_CORS simplifies handling cross-origin resource sharing issues, which is essential when your frontend and backend are hosted separately (e.g., different domains or ports).

## Structural and Design Decisions
### How do you manage state in your React application?
Explain your state management strategy (e.g., using useState, useContext, or a library like Redux) and why it suits your application's requirements.


## Technology Choices
### Why did you choose Flask_SQLAlchemy instead of another Python ORM like Django ORM?
Compare the lightweight, modular approach of Flask_SQLAlchemy with the monolithic nature of Django’s ORM, and how Flask_SQLAlchemy offers more control and customization.

### Why did you use SQLAlchemy instead of a NoSQL database like MongoDB?
Highlight how SQLAlchemy and relational databases are better for handling structured data and complex relationships, which might suit a messenger app better.

### Why did you choose to implement user authentication in the way you did?
Discuss your authentication approach (e.g., JWT, session-based, OAuth) and why it aligns with your project’s requirements for security, scalability, and user experience.

## Project Implementation and Design Patterns
### Why did you use Flask’s blueprint structure for your APIs?
Explain how blueprints help you modularize your app, making it easier to manage routes and separate concerns.

### Why did you choose the RESTful API architecture for communication between frontend and backend?
Discuss the advantages of REST for stateless communication, consistency, and separation of client/server implementations.

## Security and Optimization
### How did you handle CORS, and why did you take this approach?
Explain the use of Flask_CORS and how you configured it to allow secure communication between the frontend and backend while protecting against 

## CORS-related security issues.
### What steps did you take to ensure the security of your app?
Talk about any security measures you implemented, like input validation, error handling, or protection against common vulnerabilities (e.g., SQL injection, XSS).

### Why did you use certain optimization techniques for your database queries?
Discuss how you optimized database access with SQLAlchemy, e.g., using joins, eager loading, or caching strategies.

## User Experience and UI/UX

### Why I choose this particular UI/UX design for the chat interface?
I intentionally chose a very familiar messaging app design for the UI. Apple users will recognize that a blue chat bubble on the right hand side means that you sent the message, whereas a gray bubble from the left hand side means that you received the message. My goal for keeping the overall design of the app simple was because this project was intended to be a learning experience and to showcase my ability to build a full-stack web application from the ground up. Keeping it simple makes it easier to navigate and use at a small scale. However, I acknowledge that this simple and minimalistic design would not scale well to a larger user base.

## Scalability and Future Considerations
### How does your app handle multiple concurrent users?
Describe how you structured your app to support multiple users, like using WebSockets for real-time communication or how Flask can handle requests concurrently.

### What considerations did you have for scalability when designing your app?
Mention your thoughts on load balancing, database optimization, or how your tech stack supports horizontal or vertical scaling.
