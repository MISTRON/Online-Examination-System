# Online Examination System

A full-stack web application for managing online exams, with separate admin and student flows.

## Features
- Admin: Create, edit, delete, and schedule exams
- Student: View, take, and submit exams
- Real-time notifications for new/scheduled exams
- Exam results and analytics
- Secure authentication (with optional Google OAuth)
- Responsive, modern UI

## Tech Stack
- **Frontend:** React (Vite, Tailwind CSS)
- **Backend:** Node.js, Express, MongoDB (Mongoose)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)

### Setup
1. **Clone the repo:**
   ```sh
   git clone https://github.com/yourusername/online-examination-system.git
   cd online-examination-system
   ```
2. **Install dependencies:**
   ```sh
   cd backend && npm install
   cd ../ && npm install
   ```
3. **Configure environment variables:**
   - Create a `.env` file in `backend/` with:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
   - (Optional) Add Google OAuth credentials if using Google login.

4. **Run the backend:**
   ```sh
   cd backend
   npm start
   ```
5. **Run the frontend:**
   ```sh
   npm run dev
   ```

## Deployment
- Deploy the backend to Heroku, Render, Railway, or similar.
- Deploy the frontend to Vercel, Netlify, or similar.
- Set environment variables in your deployment platform.

## License
MIT

## 🚀 Features

### For Students
- **User Authentication**: Secure login and registration system
- **Exam Dashboard**: View available exams, upcoming tests, and recent results
- **Real-time Exam Taking**: Interactive exam interface with timer and auto-submission
- **Multiple Question Types**: Support for multiple choice, true/false, and essay questions
- **Progress Tracking**: Visual progress indicators and question navigation
- **Results & Analytics**: Detailed performance analysis with score breakdowns
- **Achievement System**: Gamified learning with badges and milestones

### For Administrators
- **Admin Dashboard**: Comprehensive overview of system statistics
- **Exam Management**: Create, edit, and delete examinations
- **Question Builder**: Dynamic question creation with multiple formats
- **User Management**: View and manage student accounts
- **Performance Analytics**: Detailed insights into student performance
- **System Monitoring**: Real-time statistics and activity tracking

### Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI/UX**: Beautiful interface with smooth animations
- **Real-time Updates**: Live notifications and status updates
- **Secure Authentication**: Role-based access control
- **Performance Optimized**: Fast loading and smooth interactions

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Countdown Timer**: react-countdown

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-examination-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Getting Started

1. **Register/Login**: Create an account or use demo credentials
   - Student: `student@example.com` (any password)
   - Admin: `admin@example.com` (any password)

2. **Student Experience**:
   - Browse available exams from the dashboard
   - Click "Start" on an active exam
   - Answer questions within the time limit
   - Submit and view results immediately

3. **Admin Experience**:
   - Access admin dashboard for system overview
   - Create new exams with custom questions
   - Manage existing exams and user accounts
   - Monitor student performance and analytics

### Demo Accounts

The system includes pre-configured demo accounts for testing:

- **Student Account**: `student@example.com` (any password)
- **Admin Account**: `admin@example.com` (any password)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Application header
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── Layout.jsx      # Main layout wrapper
│   └── PrivateRoute.jsx # Route protection
├── contexts/           # React context providers
│   ├── AuthContext.jsx # Authentication state
│   └── ExamContext.jsx # Exam and results state
├── pages/              # Application pages
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Dashboard.jsx   # Student dashboard
│   ├── ExamList.jsx    # Available exams
│   ├── TakeExam.jsx    # Exam taking interface
│   ├── ExamResults.jsx # Results and analytics
│   ├── AdminDashboard.jsx # Admin overview
│   ├── CreateExam.jsx  # Exam creation form
│   ├── ManageExams.jsx # Exam management
│   └── ManageUsers.jsx # User management
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by modifying:

- `tailwind.config.js` - Theme configuration
- `src/index.css` - Global styles and custom components
- Individual component files for specific styling

### Adding Features
To extend the functionality:

1. **New Pages**: Add components to `src/pages/`
2. **New Components**: Add reusable components to `