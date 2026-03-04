"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; errorInfo?: React.ErrorInfo; reset: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo })
    
    // Log error to monitoring service
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)
    
    // In production, you might want to send this to an error reporting service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry, LogRocket, etc.
      // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          reset={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ 
  error, 
  errorInfo, 
  reset 
}: { 
  error?: Error; 
  errorInfo?: React.ErrorInfo; 
  reset: () => void 
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-600">Something went wrong</CardTitle>
          <CardDescription>
            We're sorry, but something unexpected happened. Our team has been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error && (
            <div className="bg-gray-100 p-3 rounded-md text-xs">
              <p className="font-medium mb-2">Error Details (Development Only):</p>
              <p className="text-red-600 break-words">{error.message}</p>
              {errorInfo && (
                <details className="mt-2">
                  <summary className="cursor-pointer font-medium">Component Stack</summary>
                  <pre className="mt-2 whitespace-pre-wrap text-xs">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>If the problem persists, please contact our support team.</p>
            <p className="mt-1">
              <a 
                href="mailto:support@guardianshield.com" 
                className="text-blue-600 hover:underline"
              >
                support@guardianshield.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for handling errors in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo)
    
    // In production, send to error reporting service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Send to your error reporting service
    }
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

export default ErrorBoundary
