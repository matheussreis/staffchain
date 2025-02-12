# StaffChain

StaffChain is a flow management tool that allows users to set up form templates and define a hierarchy of approvers. Each instance of a template follows the same approval structure as its parent template. The application gives users full control over their requests, enabling them to track all changes, add information during the approval process, and provide or receive feedback throughout the workflow.

## Table of Contents

- [StaffChain](#staffchain)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Getting Started](#getting-started)
    - [Backend Setup](#backend-setup)
      - [MongoDB](#mongodb)
      - [EmailJS](#emailjs)
        - [Setup Email Service](#setup-email-service)
        - [Setup Email Templates](#setup-email-templates)
      - [File Upload](#file-upload)
      - [JWT](#jwt)
      - [CORS](#cors)
      - [System User](#system-user)
    - [Frontend Setup](#frontend-setup)
      - [App Name](#app-name)
      - [API URL (Backend)](#api-url-backend)
      - [JWT Token Duration](#jwt-token-duration)
    - [Start the Project](#start-the-project)

## Project Overview

The project consists of two main parts: a frontend application built with React.js (using Create React App) and a backend application developed with Node.js and Express.js. The backend exposes a comprehensive set of API endpoints that the frontend uses to send and retrieve data. Data is stored in MongoDB, and all interactions with the database are managed through Mongoose (ORM). The frontend connects to these endpoints, providing users with a fully responsive interface to interact with the data. In addition to MongoDB integration, the backend handles file uploads via a dedicated endpoint and sends notification emails to users after specific actions are performed.

## Getting Started

### Backend Setup

To setup the backend, start by opening your terminal and moving into the `server` directory. 

```bash
cd server
```

After that, run the following command to install all the dependencies:

```bash
npm install
```

Once the dependencies are all installed, run the following command to create a `.env` file.

```bash
cp .env.example .env
```

Then, follow the next steps to fill out the variables correctly.

#### MongoDB

To allow the backend to connect to the database, add the connection string of your MongoDB instance. This instance can be locally installed or on the cloud (e.g. MongoDB Atlas). For more information on connection strings, please refer to MongoDB documentation.

```bash
MONGO_CONNECTION_STRING='mongodb://<USER>:<PASSWORD>@<SERVER_IP>:<SERVER_PORT>/?authSource=admin'
```

#### EmailJS

To enable the backend to send email notifications, an EmailJS account is required, which is used to send the emails. Once you create the account, you'll need to complete the following steps:

##### Setup Email Service

In the EmailJS dashboard, go to the general section within the account details page. Copy the public and private keys for the EmailJS API and set them as follows:

```bash
EMAILJS_PUBLIC_KEY=''
EMAILJS_PRIVATE_KEY=''
```

After that, go back to the home page, add a new email service, and copy its ID in the following variable:

```bash
EMAIL_JS_SERVICE_ID=''
```

##### Setup Email Templates

Create two new Email Templates, one the **status change of a request** and the other for the **review of a request**.

**Request Status Change (Suggested Template):**

```html
<p>Dear {{to_name}},</p>
<p>{{message}}</p>
<p>Please, check it out <a href="{{request_url}}" target="_blank" rel="noopener">here</a>.</p>
<p>Best wishes,<br>StaffChain team<br><br></p>
```

**Request to Review (Suggested Template):**

```html
<p style="text-align: justify;">Hello {{to_name}},</p>
<p style="text-align: justify;">A new request has been assigned to you!</p>
<p style="text-align: justify;">You can check it out <a href="{{request_url}}" target="_blank" rel="noopener">here.</a></p>
<p style="text-align: justify;">Best wishes,<br>StaffChain team</p>
```

Once both email templates are setup, copy their Template IDs in the following variables:

```bash
EMAIL_JS_REQUEST_TO_REVIEW_TEMPLATE_ID=''
EMAIL_JS_REQUEST_STATUS_CHANGE_TEMPLATE_ID=''
```

#### File Upload

As the application handles file uploads, it needs a path to an upload folder so it can store the files there. Set the following variable with the path to your upload folder:

```bash
UPLOAD_DIR_PATH='uploads'
```

#### JWT

The backend uses JWT for the authentication. To set it up, add a secret and duration for the JWT tokens that the server will generate:

```bash
JWT_SECRET='secret-token-123'
JWT_TOKEN_DURATION='5'
```

**_NOTE:_** The duration is in hours.

#### CORS

The API uses CORS to only allow requests from a certain origin, which should be the frontend. In this case, set the following variable to the frontend URL. Locally this should be http://localhost:3000.

```bash
CLIENT_URL='http://localhost:3000'
```

#### System User

When initialising the system, a default user called "System Administrator" is created to manage users and setup processes. However, before using this account, you must configure an email address and password by replacing the variables below with your desired credentials:

```bash
ADMIN_EMAIL=''
ADMIN_PASSWORD=''
```

**_NOTE:_** During API initialisation, the system checks whether a system administrator already exists. If not, a new one is created. Changing the `ADMIN_EMAIL` and restarting the server may result in a new administrator account being created. Additionally, if `ADMIN_PASSWORD` is not set, the system defaults the password to `admin`.

### Frontend Setup

To setup the frontend, go back to your terminal and move back into the project's root directory. Once in that folder, run the following commands to install all the dependencies:

```bash
npm install
```

Once the dependencies are all installed, run the following command to create a `.env` file.

```bash
cp .env.example .env
```

Once you have created the file, follow the next steps to fill out the variables correctly.

#### App Name

The app uses this variable to set the title of the `index.html` with the system name.

```bash
REACT_APP_NAME='StaffChain'
```

#### API URL (Backend)

To access the Node.js backend, the front end needs to know the URL to the API service. Locally this URL should be http://localhost:3001.

```bash
REACT_APP_SERVER_API_URL="http://localhost:3001"
```

#### JWT Token Duration

As defined in the backend, the frontend also uses a variable for the token duration so it can revalidate the token once it has expired.

```bash
REACT_APP_TOKEN_DURATION_HOURS='10'
```

### Start the Project

To get the project running in your development environment you'll need to get the both applications running (the frontend & backend).

To start the backend, move into the `server` directory, and run the following:

```bash
npm start
```

After that, open a new terminal tab or window, and run the same command but in the project's root directory:

```bash
npm start
```

Once both apps are running, open your browser and go to [http://localhost:3000](http://localhost:3000) to view the website.

