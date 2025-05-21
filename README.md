# SyriaMarket

SyriaMarket is a fully functional online marketplace web application designed for users in Syria. It allows users to register, log in, and post listings for items such as electronics, clothes, furniture, and homes. Visitors can browse, search, and filter listings by various criteria.

## Features

- **User Authentication**: Register, login, and user profile management
- **Home Page**: Search functionality, featured categories, and recent listings
- **Listings**: Browse, filter, and search listings by category, location, price, and condition
- **Item Details**: View full item information with seller contact options
- **Create Listings**: Post new items with images and details
- **Admin Panel**: Manage users and listings
- **Responsive Design**: Mobile and desktop optimized layouts
- **Multilingual Support**: Ready for Arabic and English content

## Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templating engine, vanilla JavaScript
- **CSS**: Custom CSS with responsive design
- **Authentication**: Passport.js with local strategy
- **File Uploads**: Multer for image handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or MongoDB Atlas)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/SyriaMarket.git
cd SyriaMarket
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/syriamarket
SESSION_SECRET=your_secret_key
```

4. Seed the database with sample data (optional):

```bash
node seeds/seed.js
```

5. Start the application:

```bash
npm start
```

For development:

```bash
npm run dev
```

## Usage

After installation, the application will be available at `http://localhost:3000`.

### Default Admin Credentials

If you seed the database, you can use these credentials to access the admin panel:

- Email: admin@syriamarket.com
- Password: admin123

### User Roles

- **Regular User**: Can post and manage listings, update profile
- **Admin**: Can manage all listings and users

## Project Structure

```
SyriaMarket/
├── config/                 # Configuration files
├── controllers/            # Route controllers
├── middleware/             # Custom middleware
├── models/                 # MongoDB models
├── public/                 # Static assets (CSS, JS, images)
│   ├── css/
│   ├── js/
│   └── uploads/           # Uploaded images
├── routes/                 # Express routes
├── seeds/                  # Database seed files
├── views/                  # EJS templates
│   ├── admin/
│   ├── layouts/
│   ├── listings/
│   ├── partials/
│   └── users/
├── .env                    # Environment variables
├── app.js                  # Main application file
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.