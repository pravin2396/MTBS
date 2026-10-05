import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import TheatreList from './pages/TheatreList';
import TheatreDetail from './pages/TheatreDetail';
import SeatSelection from './pages/SeatSelection';
import TicketBooking from './pages/TicketBooking';
import PaymentPage from './pages/PaymentPage';
import BookingHistory from './pages/BookingHistory';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <MovieList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies/:id"
            element={
              <ProtectedRoute>
                <MovieDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/theatres"
            element={
              <ProtectedRoute>
                <TheatreList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/theatres/:id"
            element={
              <ProtectedRoute>
                <TheatreDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <TicketBooking />
              </ProtectedRoute>
            }
          />
          <Route path="/booking/ticket" element={<Navigate to="/booking" replace />} />
          <Route
            path="/booking/seats"
            element={
              <ProtectedRoute>
                <SeatSelection />
              </ProtectedRoute>
            }
          />
          <Route path="/seats" element={<Navigate to="/booking/seats" replace />} />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout" element={<Navigate to="/payment" replace />} />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />
          <Route path="/bookings" element={<Navigate to="/history" replace />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Router>
  );
}

export default App;
