# Skinsify

Skinsify is a MERN stack marketplace for buying and selling in-game skins from games like PUBG/BGMI, Valorant, and CS:GO. Users can upload skins, set prices, and purchase skins securely.

## Features

- **User Authentication**: Secure sign-up and login using JWT.
- **Buy & Sell Skins**: Users can list in-game skins for sale or purchase them.
- **Payment Integration**: Secure transactions via Razorpay.
- **Profile Management**: Users can manage their listed skins and purchase history.
- **Search & Filter**: Browse skins by game, price, and rarity.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Payments**: Razorpay Integration
- **Deployment**: Render

## Installation

### Prerequisites
- Node.js & npm installed
- MongoDB instance running (local or cloud)
- Razorpay API credentials

### Steps to Run

1. **Clone the repository:**
   ```sh
   git clone https://github.com/sujalmendhe02/Skinsify.git
   cd Skinsify
2. **Install dependencies:**
   
sh
   npm install
   cd client && npm install


3. **Set up environment variables:**
   Create a .env file in the root directory and add the following:
   
env
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_secret_key
  RAZORPAY_KEY_ID=your_razorpay_key
  RAZORPAY_SECRET=your_razorpay_secret
  CLIENT_URL=http://localhost:5173



4. **Start the backend server:**
   
sh
   npm run dev


5. **Start the frontend:**
   
sh
   cd client
   npm run dev

## API Endpoints

| Method | Endpoint            | Description                   |
|--------|---------------------|-------------------------------|
| POST   | /api/auth/register  | Register a new user           |
| POST   | /api/auth/login     | Login user                    |
| POST   | /api/skins          | Upload a new skin             |
| GET    | /api/skins          | Get all listed skins          |
| GET    | /api/skins/:id      | Get details of a specific skin|
| POST   | /api/checkout       | Process payment via Razorpay  |

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## Screenshots

![Screenshot](https://drive.google.com/file/d/1rS03Twt-U3LePUuoSlV953LutPHQ4MBW/view?usp=drivesdk)
