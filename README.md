# Simple Copy of MESSENGER
This project is an implementation of a simplified version of a Messenger-like application, created from scratch using the latest web technologies.

## Technology:
* Frontend: React with Typescript provides a dynamic and scalable user interface. The react-router-dom library enables easy navigation between different views of the application, such as the login screen, chats, and user profile.
* Backend: Express with Typescript serves as the application server, handling HTTP requests and communicating with the database. Libraries such as bcrypt (password hashing), cors (cross-origin requests), helmet (protection against various types of attacks), and jsonwebtoken (authentication) ensure the application's security.
* Database: MongoDB, as a NoSQL database, was chosen for its flexibility in storing various types of data, such as users, messages, and chats.
  
## Features:
* Authentication: Ability to register new users and log in existing ones.
* Chats: Displaying a list of chats, creating new chats, and participating in existing ones.
* Messages: Sending text messages, reacting to messages with a single emoji, editing, and deleting messages.
* User search: Filtering the list of users by name.
  
## Project Goal:

The main goal of this project was to gain practical skills in creating full-fledged web applications using modern technologies such as React, Typescript, and Node.js. The project allowed for a deep understanding of the mechanisms of real-time applications, application state management, and the implementation of various security strategies.

## Additional Information:

First project using Typescript in React and Express projects: This repository is an excellent starting point for those who want to begin their journey with Typescript in web development projects.

## Setup
### Clone the repo
```
git clone https://github.com/NikodemMlynski/MESSENGER
```
### Install NPM packages 
```
npm install
```
### Create .env file with theese variables: <br/>
```
NODE_ENV=development
DATABASE_URL=your_mongodb_database_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
```
### Create mongodb databse and paste it's url into .env file
### Run backend by going to the backend directory and typing: 
```
npm run dev
```
### Similarly with frontend go to the frontend directory and type: 
```
npm run dev
```
