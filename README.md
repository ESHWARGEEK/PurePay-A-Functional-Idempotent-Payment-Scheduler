# PurePay: Functional Payment Scheduler

A dashboard to visualize and manage a functional, idempotent payment scheduler for recurring subscriptions and one-time transactions. This project is a front-end simulation of a payment processing system, showcasing the logic behind handling recurring and one-time payments automatically.

<img width="633" height="706" alt="Screenshot 2025-08-25 104908" src="https://github.com/user-attachments/assets/9d646796-f3e2-4f4f-8e5c-596368a5d8ae" />
<img width="626" height="702" alt="Screenshot 2025-08-25 104922" src="https://github.com/user-attachments/assets/217b5311-e5ad-4025-accb-9625dd446750" />



## ✨ Features

- **Automated Payment Processing**: A scheduler runs every 5 seconds to automatically process due payments, simulating a real-world cron job.
- **Handles Subscriptions & One-Time Payments**: Manages both recurring monthly/yearly subscriptions and single, non-repeating transactions.
- **Realistic Payment Simulation**: Simulates an API call to a payment gateway with an 80% success rate and a 20% failure rate.
- **Smart Retry Logic**: If a payment fails, it automatically retries up to 3 times before marking the transaction as permanently failed.
- **Idempotent Subscription Renewal**: When a subscription payment succeeds, it correctly calculates the next billing date and queues up a new `Pending` transaction for that future date.
- **Interactive UI**: A clean dashboard to view all transactions and subscriptions in real-time. You can add new payments via a user-friendly modal form.

## 🛠️ Tech Stack

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: Adds static typing to JavaScript to improve code quality and developer experience.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development (loaded via CDN).
- **Vite**: Used as a high-performance development server.

## 🚀 Getting Started

This project is set up to run without a traditional build step or `npm install` for its dependencies. It uses a modern approach with ES Modules loaded directly from a CDN via an import map in `index.html`.

### Prerequisites

You need to have **Node.js** installed on your machine. This is only required to use `npx`, which is a tool that comes with Node's package manager (npm). It allows you to run command-line tools like Vite without installing them globally.

- We recommend using a Node version manager like [nvm](https://github.com/nvm-sh/nvm) (for macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage different Node versions.
- If you don't have Node.js, you can download it from the [official Node.js website](https://nodejs.org/).

### Running the Project

1.  **Navigate to the project directory** in your terminal:
    ```bash
    cd path/to/your-project
    ```

2.  **Start the development server** with a single command:
    ```bash
    npx vite
    ```

    `npx` will temporarily download and run Vite. Vite will start a local development server and provide you with a URL.

3.  **Open your browser** and go to the local URL provided in the terminal (usually `http://localhost:5173`).

You should now see the PurePay dashboard running! To stop the server, go back to your terminal and press `Ctrl + C`.
