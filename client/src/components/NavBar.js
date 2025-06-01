import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Link as LINK, useNavigate } from 'react-router-dom';
import { Link2, Menu, X, Home, Link, QrCode, LogIn, UserPlus, LogOut, UserCheck, AlertCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, userData, handleLogout, handleSendVerificationOtp } = useContext(AppContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    if (await handleLogout()) {
      closeMenu();
      navigate('/');
    }
  };

  const handleVerificationClick = async () => {
    if (await handleSendVerificationOtp()) {
      closeMenu();
      navigate("/verify-email");
    }
  };

  const navLinkStyles = ({ isActive }) =>
    `flex items-center text-white px-4 py-2 rounded-lg transition-all duration-300 
    ${isActive
      ? 'bg-gradient-to-r from-sky-600/20 to-sky-400/20 border border-sky-400/50 shadow-lg'
      : 'hover:bg-gradient-to-r hover:from-sky-600/10 hover:to-sky-400/10 border border-transparent hover:border-sky-400/30'
    }`;

  const mobileNavLinkStyles = ({ isActive }) =>
    `w-full flex items-center justify-center text-white px-4 py-3 rounded-lg transition-all duration-300 
    ${isActive
      ? 'bg-gradient-to-r from-sky-600/20 to-sky-400/20 border border-sky-400/50 shadow-lg'
      : 'hover:bg-gradient-to-r hover:from-sky-600/10 hover:to-sky-400/10 border border-transparent hover:border-sky-400/30'
    }`;

  const AuthButtons = () => {
    if (isLoggedIn) {
      return (
        <>
          {userData?.isAccountVerified ? (
            <LINK to="/dashboard" onClick={closeMenu} className="flex items-center px-4 py-2 rounded-lg border border-green-400/50 
              text-green-400 hover:text-green-300 transition-all duration-300 
              hover:bg-gradient-to-r hover:from-green-600/10 hover:to-green-400/10 
              hover:border-green-400/70 hover:shadow-lg">
              <UserCheck className="h-5 w-5 mr-2" />
              Dashboard
            </LINK>
          ) : (
            <button
              onClick={handleVerificationClick}
              className="flex items-center px-4 py-2 rounded-lg border border-yellow-400/50 
                text-yellow-400 hover:text-yellow-300 transition-all duration-300 
                hover:bg-gradient-to-r hover:from-yellow-600/10 hover:to-yellow-400/10 
                hover:border-yellow-400/70 hover:shadow-lg"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              Verify Account
            </button>
          )}
          <button
            onClick={handleLogoutClick}
            className="flex items-center px-4 py-2 rounded-lg 
              bg-gradient-to-r from-red-500 to-red-400 hover:from-red-400 hover:to-red-300
              text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </>
      );
    }

    return (
      <>
        <LINK to="/signin" onClick={closeMenu} className="flex items-center px-4 py-2 rounded-lg border border-sky-400/50 
          text-sky-400 hover:text-sky-300 transition-all duration-300 
          hover:bg-gradient-to-r hover:from-sky-600/10 hover:to-sky-400/10 
          hover:border-sky-400/70 hover:shadow-lg">
          <LogIn className="h-5 w-5 mr-2" />
          Sign In
        </LINK>
        <LINK to="/signup" onClick={closeMenu} className="flex items-center px-4 py-2 rounded-lg 
          bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300
          text-black transition-all duration-300 shadow-lg hover:shadow-xl">
          <UserPlus className="h-5 w-5 mr-2" />
          Sign Up
        </LINK>
      </>
    );
  };

  const MobileAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <>
          {userData?.isAccountVerified ? (
            <LINK to="/dashboard" onClick={closeMenu} className="flex items-center justify-center px-4 py-3 rounded-lg 
              border border-green-400/50 text-green-400 hover:text-green-300 
              transition-all duration-300 hover:bg-gradient-to-r 
              hover:from-green-600/10 hover:to-green-400/10 hover:border-green-400/70">
              <UserCheck className="h-5 w-5 mr-2" />
              Dashboard
            </LINK>
          ) : (
            <button
              onClick={handleVerificationClick}
              className="flex items-center justify-center px-4 py-3 rounded-lg 
                border border-yellow-400/50 text-yellow-400 hover:text-yellow-300 
                transition-all duration-300 hover:bg-gradient-to-r 
                hover:from-yellow-600/10 hover:to-yellow-400/10 hover:border-yellow-400/70"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              Verify Account
            </button>
          )}
          <button
            onClick={handleLogoutClick}
            className="flex items-center justify-center px-4 py-3 rounded-lg 
              bg-gradient-to-r from-red-500 to-red-400 hover:from-red-400 hover:to-red-300
              text-white transition-all duration-300 shadow-lg"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </>
      );
    }

    return (
      <>
        <LINK to="/signin" onClick={closeMenu} className="flex items-center justify-center px-4 py-3 rounded-lg 
          border border-sky-400/50 text-sky-400 hover:text-sky-300 
          transition-all duration-300 hover:bg-gradient-to-r 
          hover:from-sky-600/10 hover:to-sky-400/10 hover:border-sky-400/70">
          <LogIn className="h-5 w-5 mr-2" />
          Sign In
        </LINK>
        <LINK to="/signup" onClick={closeMenu} className="flex items-center justify-center px-4 py-3 rounded-lg 
          bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300
          text-black transition-all duration-300 shadow-lg">
          <UserPlus className="h-5 w-5 mr-2" />
          Sign Up
        </LINK>
      </>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 
      ${isScrolled
          ? 'bg-transparent backdrop-blur-lg shadow-xl'
          : 'bg-gradient-to-b from-gray-950 to-gray-900 backdrop-blur-lg'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 group">
            <div className="p-2 rounded-lg bg-gradient-to-r from-sky-600/10 to-sky-400/10 
              group-hover:from-sky-600/20 group-hover:to-sky-400/20 transition-all duration-300">
              <Link2 className="h-6 w-6 text-sky-400 group-hover:text-sky-300 transition-colors duration-300" />
            </div>
            <LINK to="/" onClick={closeMenu} className="text-2xl font-bold tracking-wide bg-gradient-to-r from-sky-400 to-sky-300 
              bg-clip-text text-transparent hover:from-sky-300 hover:to-sky-200 transition-all duration-300">
              Linkwith
            </LINK>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded-lg bg-gradient-to-r from-sky-600/10 to-sky-400/10 
                hover:from-sky-600/20 hover:to-sky-400/20 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-sky-400" />
              ) : (
                <Menu className="h-6 w-6 text-sky-400" />
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={navLinkStyles} end>
              <Home className="h-5 w-5 mr-2" />
              Home
            </NavLink>
            <NavLink to="/generate-url" className={navLinkStyles}>
              <Link className="h-5 w-5 mr-2" />
              Generate URL
            </NavLink>
            <NavLink to="/generate-qr" className={navLinkStyles}>
              <QrCode className="h-5 w-5 mr-2" />
              Generate QR Code
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <AuthButtons />
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full 
            bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl 
            shadow-xl border-t border-sky-400/10">
            <div className="p-4 space-y-3">
              <div className="flex flex-col space-y-2">
                <NavLink to="/" className={mobileNavLinkStyles} onClick={closeMenu} end>
                  <Home className="h-5 w-5 mr-2" />
                  Home
                </NavLink>
                <NavLink to="/generate-url" className={mobileNavLinkStyles} onClick={closeMenu}>
                  <Link className="h-5 w-5 mr-2" />
                  Generate URL
                </NavLink>
                <NavLink to="/generate-qr" className={mobileNavLinkStyles} onClick={closeMenu}>
                  <QrCode className="h-5 w-5 mr-2" />
                  Generate QR Code
                </NavLink>
              </div>

              <div className="flex flex-col space-y-3 pt-3 border-t border-sky-400/10">
                <MobileAuthButtons />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}