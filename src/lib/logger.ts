export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  userId?: string
  metadata?: Record<string, any>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logLevel = process.env.LOG_LEVEL || LogLevel.INFO

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG]
    const currentLevelIndex = levels.indexOf(this.logLevel as LogLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex <= currentLevelIndex
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, userId, metadata } = entry
    let logString = `[${timestamp}] ${level.toUpperCase()}: ${message}`
    
    if (context) {
      logString += ` [${context}]`
    }
    
    if (userId) {
      logString += ` [user: ${userId}]`
    }
    
    if (metadata && Object.keys(metadata).length > 0) {
      logString += ` ${JSON.stringify(metadata)}`
    }
    
    return logString
  }

  private log(entry: LogEntry) {
    if (!this.shouldLog(entry.level)) return

    const formattedLog = this.formatLog(entry)

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(formattedLog)
        break
      case LogLevel.WARN:
        console.warn(formattedLog)
        break
      case LogLevel.INFO:
        console.info(formattedLog)
        break
      case LogLevel.DEBUG:
        console.debug(formattedLog)
        break
    }

    // In production, you might want to send logs to a service
    if (!this.isDevelopment && entry.level === LogLevel.ERROR) {
      this.sendToExternalService(entry)
    }
  }

  private async sendToExternalService(entry: LogEntry) {
    try {
      // Example: Send to error tracking service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // })
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }

  error(message: string, context?: string, metadata?: Record<string, any>) {
    this.log({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata,
    })
  }

  warn(message: string, context?: string, metadata?: Record<string, any>) {
    this.log({
      level: LogLevel.WARN,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata,
    })
  }

  info(message: string, context?: string, metadata?: Record<string, any>) {
    this.log({
      level: LogLevel.INFO,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata,
    })
  }

  debug(message: string, context?: string, metadata?: Record<string, any>) {
    this.log({
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata,
    })
  }

  // Method to set user context for logging
  setUserId(userId: string) {
    this.userId = userId
  }

  private userId?: string
}

export const logger = new Logger()

// Export a function to create context-specific loggers
export function createLogger(context: string) {
  return {
    error: (message: string, metadata?: Record<string, any>) => 
      logger.error(message, context, metadata),
    warn: (message: string, metadata?: Record<string, any>) => 
      logger.warn(message, context, metadata),
    info: (message: string, metadata?: Record<string, any>) => 
      logger.info(message, context, metadata),
    debug: (message: string, metadata?: Record<string, any>) => 
      logger.debug(message, context, metadata),
  }
}
