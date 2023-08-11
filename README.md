# E-Commerce-Store Backend

This repository contains the backend application for an e-commerce furniture store, built using Node.js, Express.js, MongoDB, and Mongoose.js. The application provides a robust foundation for managing products, user authentication, registration verification, role-based authorization, and seamless payment processing through Stripe.

## Table of Contents

- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Technologies Used](#technologies-used)

## Key Features

- **Authentication with JSON Web Tokens**: Secure user authentication using JSON Web Tokens (JWT) to ensure a seamless and safe login process.

- **Email Registration Verification**: Implementing email verification during registration to enhance account security and legitimacy.

- **Role Based Authorization**: Fine-tuned role-based authorization system that allows for different access levels and permissions based on user roles.

- **Stripe Payment Integration**: Seamlessly accept payments through Stripe, a popular and trusted online payment processing platform.

- **Product Management**: Users have the ability to create and manage products, enabling you to effortlessly showcase your merchandise.

- **Product Reviews**: Users can leave reviews for products, fostering customer interaction and aiding potential buyers in their decisions.

- **Order Handling**: Streamlined routes for order processing, ensuring efficient management of customer orders.

- **User Shopping Cart**: Dedicated routes for managing user shopping carts, enhancing the shopping experience and simplifying purchases.

## Prerequisites

Before running the application, make sure you have the following prerequisites:

- Node.js (>=12.0.0)
- MongoDB server
- Stripe account for payment processing

## Getting Started

1. Clone this repository to your local machine:

```bash
git clone https://github.com/mahsoodebrahim/e-commerce-backend.git
```

2. Install dependencies:

```bash
cd e-commerce-backend
npm install
```

3. Set up your environment variables. Rename .env.example to .env and update the variables according to your configuration.

4. Start the server:

```bash
npm start
```

## Configuration

You can configure the application using the .env file. Here are the important variables you need to set:

    MONGO_DB_CONNECTION_STRING: MongoDB connection string
    JWT_SECRET: Secret key for JWT
    JWT_LIFETIME: How long the JWT is valid for
    SALT_ROUNDS: For bcrypt hashing
    STRIPE_SECRET_KEY: Stripe secret key for payment processing
    MAILTRAP_USERNAME: mailtrap username for sending verification emails
    MAILTRAP_PASSWORD: mailtrap password for sending verification emails
    FROM_EMAIL: Email notifiations are sent from

## API Documentation

For detailed information about the available routes and their usage, refer to the [API documentation](https://documenter.getpostman.com/view/20359081/2s9Xy5KpzT).

## Technologies Used

- Backend: Node.js with Express.js
- Database: MongoDB with Mongoose.js
- Authentication: JSON Web Tokens (JWT)
- Payment Integration: Stripe
- Testing: Jest
- Email Sending: Nodemailer with Mailtrap
