import { logger } from './logger'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly context?: string

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: string
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.context = context

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: string) {
    super(message, 400, true, context)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, true, 'auth')
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, true, 'auth')
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', context?: string) {
    super(message, 404, true, context)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context?: string) {
    super(message, 500, true, context || 'database')
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string, service: string) {
    super(message, 502, true, `external:${service}`)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, true, 'rate-limit')
  }
}

export function handleApiError(error: Error, context?: string) {
  logger.error('API Error occurred', context, {
    name: error.name,
    message: error.message,
    stack: error.stack,
  })

  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      context: error.context,
    }
  }

  logger.error('Unexpected error', context, { error: error.message })
  return {
    error: 'Internal server error',
    statusCode: 500,
    context: 'internal',
  }
}

export function withErrorHandler(
  handler: (req: any, res: any) => Promise<any>,
  context?: string
) {
  return async (req: any, res: any) => {
    try {
      return await handler(req, res)
    } catch (error) {
      const errorResponse = handleApiError(error as Error, context)
      return res.status(errorResponse.statusCode).json(errorResponse)
    }
  }
}

export function handleClientError(error: Error, context?: string) {
  logger.error('Client error occurred', context, {
    name: error.name,
    message: error.message,
    stack: error.stack,
  })

  if (process.env.NODE_ENV === 'development') {
    console.error('Client Error:', error)
  }
}

export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  context?: string
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        logger.error(`Operation failed after ${maxRetries} attempts`, context, {
          error: lastError.message,
          attempts: maxRetries,
        })
        throw lastError
      }

      logger.warn(`Operation failed, retrying (${attempt}/${maxRetries})`, context, {
        error: lastError.message,
        attempt,
      })

      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }

  throw lastError!
}
