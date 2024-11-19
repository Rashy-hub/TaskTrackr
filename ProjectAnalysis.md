# SaaS Project Plan: Task Manager with Pomodoro Feature

## 1. Objectives

-   **Primary Goal:** Help users efficiently organize their tasks using productivity methods like the Pomodoro technique.
-   **Target Audience:** Students, professionals, and anyone seeking better task management.
-   **Unique Selling Point:** Simplify task organization with predefined categories and a built-in Pomodoro tracker with session statistics.

---

## 2. Key Features

### **Landing Page (`myapp/`)**

-   A simple landing page with:
    -   **Hero Section:** A clear tagline (e.g., _"Boost your productivity with a modern task manager."_).
    -   A **Login/Register** button.
    -   Optional: Include a short demo (video or screenshots).

### **Dashboard After Login (`myapp/topics`)**

1. **Topic Management (CRUD)**

    - **Read:** Display topics as **cards** in a grid.
    - **Create:** Add new topics with a title and description.
    - **Update:** Edit a topic using a pre-filled form.
    - **Delete:** Remove a topic with a confirmation dialog.

2. **Todos Associated with Topics (`myapp/topics/:id/todos`)**

    - **Read:** List todos under the selected topic.
    - **Create:** Add a new todo with:
        - Title.
        - Description.
        - Predefined category: _Interpersonal, Learning, Review, Chores, Sports, Work, Social Duties_.
    - **Update:** Edit a todo through a form.
    - **Delete:** Remove a todo.
    - **Category System:** Predefined categories for easier organization.

3. **Pomodoro Feature**
    - **Pomodoro Button:** Triggers a popup with a configurable timer (default: 25 minutes).
    - **Screen Freeze:** Disables interactions until the timer ends.
    - **Logs/Stats:** Record Pomodoro sessions with:
        - Todo name.
        - Topic name.
        - Duration of the session.

---

## 3. Technical Details

### **Recommended Tech Stack**

-   **Frontend:** React.js, TailwindCSS (for modern styling).
-   **Backend:** Node.js with Express.js.
-   **Database:** MongoDB or PostgreSQL (to store users, topics, todos, and stats).
-   **Authentication:** Auth0 or JWT for user sessions.
-   **WebSocket (Optional):** For real-time Pomodoro timer updates.

### **Database Schema**

1. **Users**
    - `id`, `email`, `password`, `name`.
2. **Topics**
    - `id`, `userId`, `title`, `description`.
3. **Todos**
    - `id`, `topicId`, `title`, `description`, `category`, `completed`.
4. **Stats**
    - `id`, `todoId`, `duration`, `timestamp`.

### **API Endpoints**

1. **Topics**
    - `GET /topics`: Fetch all topics.
    - `POST /topics`: Add a new topic.
    - `PUT /topics/:id`: Edit a topic.
    - `DELETE /topics/:id`: Delete a topic.
2. **Todos**
    - `GET /topics/:id/todos`: Fetch todos for a specific topic.
    - `POST /topics/:id/todos`: Add a new todo.
    - `PUT /todos/:id`: Edit a todo.
    - `DELETE /todos/:id`: Delete a todo.
3. **Stats**
    - `GET /stats`: Retrieve Pomodoro logs.

---

## 4. Suggestions and Improvements

1. **Customizable Categories:** Allow users to add their own categories.
2. **Tag System:** Use multiple tags instead of single categories for more flexibility.
3. **Task Prioritization:** Add a priority level (e.g., Low, Medium, High).
4. **Advanced Statistics:** Include graphs and charts for:
    - Most used categories.
    - Number of completed todos.
    - Time spent in Pomodoro sessions.
5. **Pomodoro Notifications:** Add visual or audio alerts when the timer ends.

---

## 5. Development Phases

### **Phase 1: Core Features**

-   Landing page.
-   CRUD system for topics.
-   CRUD system for todos.
-   Basic Pomodoro popup with logs.

### **Phase 2: Enhancements**

-   Robust authentication (register/login).
-   Improved Pomodoro statistics.
-   Better UI/UX with Tailwind or Material UI.

### **Phase 3: Optional Additions**

-   Customizable categories.
-   Offline mode with data sync.
-   Multi-user support for collaboration.

---

## 6. UX/UI Design Suggestions

-   **Topics Page:** Display topics as a **grid** with distinct colors for categories or tags.
-   **Todos Page:** List todos with icons for _Edit_, _Delete_, and a Pomodoro button.
-   **Pomodoro Popup:** Minimalist design with a clear timer, a cancel button, and configuration options.

---

## 7. Useful Notes

-   Start with a **mobile-first approach** to ensure usability on all devices.
-   Implement **dark mode** to enhance user experience.
-   Use tools like **Postman** or **Insomnia** to test your API endpoints.
-   Ensure accessibility (ARIA labels, keyboard navigation).

---
