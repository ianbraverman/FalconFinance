
# Falcon Finance

# Project Description

Falcon Finance is a comprehensive financial goal planning app designed to help individuals understand their current financial situation and progress towards achieving both short-term and long-term financial goals.

## Key Features

1. **Personal Information Entry:**
   - Users create an account and input details about their assets, liabilities, income, expenses, and goals.

2. **Comprehensive Financial Overview:**
   - Receive a detailed statistical breakdown of your financial status, including:
     - Assets to liabilities ratio.
     - Income vs. expenses comparison.
     - Evaluation of your emergency fund adequacy.

3. **Goal Tracking and Analysis:**
   - Get an in-depth analysis of your progress towards financial goals with:
     - Written feedback on whether you are on track.
     - Year-by-year breakdowns showing if you are saving enough.
     - Projections on how long your money will last for each goal.

4. **Personalized Recommendations:**
   - Leverage ChatGPT to receive tailored advice on improving both current financial health and long-term financial prospects.

## Objective

Falcon Finance aims to empower users by providing a clear understanding of their current financial standing and future financial trajectory. Our goal is to help users make informed decisions, adopt better saving and spending habits, and ultimately achieve their financial dreams.

## Architecture

### Backend

This project is based off of the [Full-stack Template](https://github.com/lester-lee/fullstack-template)

The backend of this project consists of an [Express](https://expressjs.com/) server with a [PostgreSQL](https://www.postgresql.org/) database and [Prisma](https://www.prisma.io/) as the ORM. 

Authentication is handled with [JWT](https://github.com/auth0/node-jsonwebtoken). User passwords are hashed with [bcrypt](https://github.com/kelektiv/node.bcrypt.js).

### Frontend

The frontend is a [React](https://react.dev/) app created with [Vite](https://vitejs.dev/).

Routing is handled with [React Router](https://reactrouter.com/en/main).

Application state is managed with [Redux Toolkit](https://redux-toolkit.js.org/).

[RTK Query](https://redux-toolkit.js.org/rtk-query/overview) is used to handle data fetching.

Charts are generated using [Chart.js](https://www.chartjs.org/).

AI Integration for user recommendation utilizes the [OpenAI API](https://platform.openai.com/docs/overview).

All images are generated using [ChatGPT](https://openai.com/index/chatgpt/) image generator. 

![Backend Schema Diagram](https://res.cloudinary.com/dzpne110u/image/upload/v1719249087/FalconFinancial/falconfinancebackend_bi7t3f.jpg)

![App Diagram](https://res.cloudinary.com/dzpne110u/image/upload/v1719249839/FalconFinancial/falconfinancewireframing_ftpqc1.png)

![InitialLoginLogoutWireframing](https://res.cloudinary.com/dzpne110u/image/upload/v1719250049/FalconFinancial/falconfinancewireframingloginlogout_k30mh2.png)

![InitialUserformWireframing](https://res.cloudinary.com/dzpne110u/image/upload/v1719250141/FalconFinancial/falconfinancewireframinguserform_vovup7.png)

![InitialStatisticsWireframing](https://res.cloudinary.com/dzpne110u/image/upload/v1719250510/FalconFinancial/falconfinancewireframingstatistics_zrw6rv.png)
