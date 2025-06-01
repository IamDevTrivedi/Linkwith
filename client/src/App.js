import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './components/Home'
import GenerateURL from './components/GenerateURL'
import GenerateQRCode from './components/GenerateQRCode'
import Footer from './components/Footer'
import About from './components/About'
import Privacy from './components/Privacy'
import Analytics from './components/Analytics'
import NotFound from './components/NotFound'
import Redirect from './components/Redirect'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import VerifyEmail from './components/VerifyEmail'
import ForgetPassword from './components/ForgetPassword'
import Dashboard from './components/Dashboard'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditProfile from './components/EditProfile'

export default function App() {
  return (
    <div className='font-sans'>
      <ToastContainer />
      <Router>
        <div className='bg-black min-h-screen text-sky-400'>
          <NavBar />
          <main className='pt-16'>
            <Routes>

              <Route path="/" element={<Home />} />

              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forget-password" element={<ForgetPassword />} />

              <Route path="/generate-url" element={<GenerateURL />} />
              <Route path="/generate-qr" element={<GenerateQRCode />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/analytics/:shortURL" element={<Analytics />} />
              <Route path="/s/:shortURL" element={<Redirect />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/edit-profile" element={<EditProfile />} />

              <Route path="*" element={<NotFound />} />

            </Routes>
          </main>

          <Footer />

        </div>
      </Router>
    </div>
  )
}