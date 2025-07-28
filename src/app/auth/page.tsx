"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { authService, usePost } from '../../services';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  // API hooks for login and signup
  const loginApi = usePost(authService.login, {
    onSuccess: (data) => {
      console.log('data: ', data);
      // Update auth context with user data
      login({
        name: data.user.name,
        email: data.user.email,
      });
      router.push('/');
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // You can show error message to user here
    },
  });

  const signupApi = usePost(authService.signup, {
    onSuccess: (data) => {
      // Update auth context with user data
      login({
        name: data.user.name,
        email: data.user.email,
      });
      router.push('/');
    },
    onError: (error) => {
      console.error('Signup failed:', error);
      // You can show error message to user here
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      await loginApi.execute({ email, password });
    } else {
      await signupApi.execute({ name, email, password });
    }
  };

  const isLoading = loginApi.loading || signupApi.loading;
  const error = loginApi.error || signupApi.error;

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(35,36,74,0.8)',
        borderRadius: '1.5rem',
        padding: '3rem',
        width: '100%',
        maxWidth: '400px',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 8px 32px var(--color-shadow)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            ⚡
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--color-text)', 
            margin: '0 0 0.5rem 0' 
          }}>
            AI Hub
          </h1>
          <p style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: '1rem',
            margin: 0
          }}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            color: '#ef4444',
            fontSize: '0.9rem'
          }}>
            {error.message}
          </div>
        )}

        {/* Toggle */}
        <div style={{ 
          display: 'flex', 
          background: 'rgba(24,25,42,0.5)', 
          borderRadius: '0.75rem', 
          padding: '0.25rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: isLogin ? 'var(--color-primary)' : 'transparent',
              color: isLogin ? '#fff' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: !isLogin ? 'var(--color-primary)' : 'transparent',
              color: !isLogin ? '#fff' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                color: 'var(--color-text)', 
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 500
              }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required={!isLogin}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--color-border)',
                  background: 'rgba(24,25,42,0.9)',
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  opacity: isLoading ? 0.7 : 1
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              color: 'var(--color-text)', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-border)',
                background: 'rgba(24,25,42,0.9)',
                color: 'var(--color-text)',
                fontSize: '1rem',
                boxSizing: 'border-box',
                opacity: isLoading ? 0.7 : 1
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              color: 'var(--color-text)', 
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-border)',
                background: 'rgba(24,25,42,0.9)',
                color: 'var(--color-text)',
                fontSize: '1rem',
                boxSizing: 'border-box',
                opacity: isLoading ? 0.7 : 1
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: 'var(--color-primary)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem',
          color: 'var(--color-text-secondary)',
          fontSize: '0.9rem'
        }}>
          {isLogin ? (
            <p style={{ margin: 0 }}>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 