# MarketHub Pakistan

Pakistan's trusted online marketplace connecting buyers and sellers across the nation. Buy & sell everything from mobiles and cars to property and services — quickly, safely, and locally.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Database:** MongoDB with Mongoose ODM
- **Real-time:** Socket.IO for live messaging
- **Image Storage:** Cloudinary
- **Authentication:** JWT with bcryptjs

## Features

### For Buyers
- Browse & search listings with filters (category, location, price, condition)
- Save ads to wishlist
- Real-time chat with sellers
- Report suspicious listings

### For Sellers
- Post ads with up to 8 images (drag & drop upload)
- Edit and manage listings from dashboard
- Mark items as sold
- Track ad views and performance

### Admin Panel
- Analytics dashboard with category distribution
- User management (activate/deactivate, verify sellers)
- Ad moderation (approve/reject/delete)
- Abuse report handling

### Security
- JWT token-based auth with token versioning
- Account lockout after 5 failed login attempts
- Rate limiting on auth and API endpoints
- NoSQL injection prevention
- Input validation with express-validator
- Helmet.js security headers

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, categories, featured & recent listings |
| Search | `/search` | Advanced search with filters & sorting |
| Ad Detail | `/ad/[id]` | Image gallery, seller info, related ads |
| Post Ad | `/post-ad` | Create or edit listings |
| Dashboard | `/dashboard` | Manage ads, saved items, profile, settings |
| Messages | `/messages` | Real-time buyer-seller chat |
| Admin | `/admin` | Admin moderation panel |
| Login | `/login` | User sign in |
| Register | `/register` | Create account |
| Forgot Password | `/forgot-password` | Password reset |
| About | `/about` | About MarketHub |
| Contact | `/contact` | Contact form |
| Help | `/help` | Searchable FAQ |
| Terms | `/terms` | Terms of Service |
| Privacy | `/privacy` | Privacy Policy |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MuhammadSaqib399/markethub-pakistan.git
   cd markethub-pakistan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your MongoDB URI, JWT secret, and Cloudinary credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```
   This runs both the Next.js frontend (port 3000) and Express backend (port 5000) concurrently.

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend + backend concurrently |
| `npm run dev:next` | Run Next.js frontend only |
| `npm run dev:server` | Run Express backend only |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with sample data |

## Project Structure

```
markethub-pakistan/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable React components
│   ├── context/          # Auth context provider
│   └── lib/              # API client
├── server/
│   ├── config/           # Database & location config
│   ├── middleware/        # Auth, rate limiting, validation
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express API routes
│   └── utils/            # Cloudinary, seed utilities
├── public/               # Static assets
├── .env.example          # Environment variables template
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies & scripts
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/save-ad/:id` - Toggle save ad
- `DELETE /api/auth/delete-account` - Delete account

### Ads
- `GET /api/ads` - List ads (with search & filters)
- `GET /api/ads/featured` - Featured ads
- `GET /api/ads/recent` - Recent ads
- `GET /api/ads/saved` - User's saved ads
- `GET /api/ads/user/my-ads` - User's own ads
- `GET /api/ads/:id` - Single ad detail
- `POST /api/ads` - Create ad
- `PUT /api/ads/:id` - Update ad
- `DELETE /api/ads/:id` - Delete ad
- `PATCH /api/ads/:id/sold` - Mark as sold

### Messages
- `GET /api/messages/conversations` - List conversations
- `POST /api/messages/conversations` - Start conversation
- `GET /api/messages/conversations/:id` - Get messages
- `POST /api/messages/conversations/:id/messages` - Send message
- `PATCH /api/messages/conversations/:id/read` - Mark as read

### Admin
- `GET /api/admin/analytics` - Dashboard stats
- `GET /api/admin/users` - List users
- `PATCH /api/admin/users/:id/toggle-active` - Toggle user status
- `PATCH /api/admin/users/:id/verify-seller` - Verify seller
- `GET /api/admin/ads` - List all ads
- `PATCH /api/admin/ads/:id/approve` - Approve ad
- `PATCH /api/admin/ads/:id/reject` - Reject ad
- `DELETE /api/admin/ads/:id` - Remove ad
- `GET /api/admin/reports` - List reports
- `PATCH /api/admin/reports/:id` - Review report

## License

This project is private and proprietary.

---

Made with ❤️ in Pakistan
