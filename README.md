

![alt text](<Adobe Express - file.png>)

# EquityExplorer

EquityExplorer is a modern, high-performance financial analysis platform built to help traders and investors monitor stock movements, set price alerts, and manage their watchlists with ease.

## 🚀 Features

- **Real-time Market Data**: Track stocks with live updates and interactive charts.
- **Multi-Provider OAuth**: Secure login via Google, GitHub, and Discord.
- **Advanced Price Alerts**: Set custom alerts to get notified when stocks hit your target prices.
- **Personalized Watchlist**: Manage and monitor your favorite symbols in one place.
- **Stock Screener**: Discover new opportunities with a powerful, real-time screener.
- **Mobile Responsive**: Fully optimized for desktop and mobile, including specialized UI for keyboard interactions.

## 🛠️ Tech Stack

### Frontend
- **React + Vite**: High-performance single-page application.
- **Tailwind CSS**: Modern, utility-first styling.
- **Shadcn UI**: Premium, accessible components.
- **GSAP & Framer Motion**: Smooth, high-end animations.
- **Lucide React**: Clean, consistent iconography.

### Backend
- **PHP (FPM)**: Robust and scalable backend logic.
- **FastAPI (Python)**: Specialized endpoints for high-speed financial data processing.
- **PostgreSQL**: Reliable, relational data storage.
- **Nginx**: High-performance web server and reverse proxy.

## 📦 Setup & Installation

### Prerequisites
- PHP 8.1+
- Node.js & npm
- PostgreSQL
- XAMPP (for local PHP development)

### Frontend Setup
1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   VITE_API_BASE_URL= (Leave empty for production proxy)
   VITE_GOOGLE_CLIENT_ID=your_id
   VITE_GITHUB_CLIENT_ID=your_id
   VITE_DISCORD_CLIENT_ID=your_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Configure your PHP environment in XAMPP.
2. Add your database and OAuth credentials to `Backend/PHP/.env`.
3. Ensure the `pdo_pgsql` extension is enabled in your `php.ini`.

## 🌐 Deployment

The platform is optimized for deployment on:
- **Vercel**: (Frontend) with built-in proxying for API requests.
- **Render**: (Backend) for PHP and Python services.

## 📄 License

This project is proprietary and confidential.
