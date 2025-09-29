import React, { useState } from "react";
import { signUp, signIn, sendPasswordResetEmail } from "../api/supabaseApi";
import logo from "../assets/logo1.png"; // Make sure your logo is here

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("login"); // 'login', 'signup', or 'resetPassword'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleAuthAction = async (e) => {
    e.preventDefault();
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage("");
    try {
      if (mode === "signup") {
        const { error } = await signUp(email, password, fullName, phone);
        if (error) throw error;
        setMessage("Success! Please check your email to confirm your account.");
      } else {
        // mode === 'login'
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage("");
    try {
      const { error } = await sendPasswordResetEmail(email);
      if (error) throw error;
      setMessage(
        "If an account exists, a password reset link has been sent to your email."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <>
      <form onSubmit={handleAuthAction} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-400"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-400"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
        </div>
        <div className="text-right text-sm">
          <button
            type="button"
            onClick={() => setMode("resetPassword")}
            className="font-medium text-indigo-400 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full nav-button bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
      <div className="text-sm text-center text-gray-400">
        Don't have an account?
        <button
          onClick={() => setMode("signup")}
          className="font-medium text-indigo-400 hover:underline ml-2"
        >
          Sign Up
        </button>
      </div>
    </>
  );

  const renderSignupForm = () => (
    <form onSubmit={handleAuthAction} className="space-y-6">
      <div>
        <label
          htmlFor="fullName"
          className="block mb-2 text-sm font-medium text-gray-400"
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block mb-2 text-sm font-medium text-gray-400"
        >
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., +919876543210"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-400"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-400"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
          className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="••••••••"
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block mb-2 text-sm font-medium text-gray-400"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength="6"
          className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full nav-button bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Sign Up"}
      </button>
      <div className="text-sm text-center text-gray-400">
        Already have an account?
        <button
          type="button"
          onClick={() => setMode("login")}
          className="font-medium text-indigo-400 hover:underline ml-2"
        >
          Login
        </button>
      </div>
    </form>
  );

  const renderResetPasswordForm = () => (
    <form onSubmit={handlePasswordReset} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-400"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="you@example.com"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full nav-button bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
      <div className="text-sm text-center text-gray-400">
        Remembered your password?
        <button
          type="button"
          onClick={() => setMode("login")}
          className="font-medium text-indigo-400 hover:underline ml-2"
        >
          Back to Login
        </button>
      </div>
    </form>
  );

  const getTitle = () => {
    if (mode === "signup") return "Create an Account";
    if (mode === "resetPassword") return "Reset Your Password";
    return "Welcome Back";
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl">
        <div className="flex justify-center">
          <img
            id="logo"
            src={logo}
            alt="Affairs Acumen Logo"
            className="h-24"
          />
        </div>
        <h1 className="text-3xl font-bold text-center text-white">
          {getTitle()}
        </h1>

        {mode === "login" && renderLoginForm()}
        {mode === "signup" && renderSignupForm()}
        {mode === "resetPassword" && renderResetPasswordForm()}

        {error && (
          <p className="text-sm text-center text-red-400 pt-4">{error}</p>
        )}
        {message && (
          <p className="text-sm text-center text-green-400 pt-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
