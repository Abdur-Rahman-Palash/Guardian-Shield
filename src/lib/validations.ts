import { z } from 'zod'

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Profile Schemas
export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
  language: z.enum(['en', 'bn'], {
    errorMap: () => ({ message: 'Please select a language' }),
  }),
  emailAlerts: z.boolean(),
  dailyDigest: z.boolean(),
  paymentNotifications: z.boolean(),
  whatsappFallback: z.boolean(),
})

// Child Management Schemas
export const addChildSchema = z.object({
  name: z.string().min(2, 'Child name must be at least 2 characters'),
  age: z.number().min(1, 'Age must be at least 1').max(18, 'Age must be 18 or less'),
  grade: z.string().optional(),
  school: z.string().optional(),
  deviceLimit: z.number().min(1).max(10).default(3),
  screenTimeLimit: z.number().min(0).max(24).default(2),
  bedTime: z.string().optional(),
  wakeTime: z.string().optional(),
})

export const updateChildSchema = addChildSchema.partial()

// Payment Schemas
export const paymentSchema = z.object({
  plan: z.enum(['free', 'family', 'school'], {
    errorMap: () => ({ message: 'Please select a plan' }),
  }),
  paymentMethod: z.enum(['nagad', 'bkash', 'rocket', 'bank'], {
    errorMap: () => ({ message: 'Please select a payment method' }),
  }),
  transactionId: z.string().min(6, 'Transaction ID must be at least 6 characters'),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'Please enter a valid Bangladeshi phone number'),
  screenshot: z.string().url('Please provide a valid screenshot URL').optional(),
})

// Admin Schemas
export const adminUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'moderator', 'user'], {
    errorMap: () => ({ message: 'Please select a role' }),
  }),
  plan: z.enum(['free', 'family', 'school'], {
    errorMap: () => ({ message: 'Please select a plan' }),
  }),
  status: z.enum(['active', 'inactive', 'suspended'], {
    errorMap: () => ({ message: 'Please select a status' }),
  }),
})

export const riskySiteSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  category: z.enum(['porn', 'gambling', 'social', 'other'], {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  severity: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Please select a severity level' }),
  }),
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters)'),
  status: z.enum(['active', 'inactive']).default('active'),
})

// Settings Schemas
export const notificationSettingsSchema = z.object({
  emailAlerts: z.boolean(),
  dailyDigest: z.boolean(),
  paymentNotifications: z.boolean(),
  whatsappFallback: z.boolean(),
  language: z.enum(['en', 'bn']),
})

export const privacySettingsSchema = z.object({
  dataSharing: z.boolean(),
  analyticsTracking: z.boolean(),
  marketingEmails: z.boolean(),
  thirdPartyIntegrations: z.boolean(),
})

export const securitySettingsSchema = z.object({
  twoFactorAuth: z.boolean(),
  sessionTimeout: z.number().min(5).max(1440).default(30),
  loginNotifications: z.boolean(),
  passwordChangeRequired: z.boolean().default(false),
})

// Contact/Support Schemas
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  category: z.enum(['technical', 'billing', 'feature', 'bug', 'other'], {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
})

export const supportTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: 'Please select a priority' }),
  }),
  category: z.enum(['technical', 'billing', 'feature', 'bug', 'other'], {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  attachments: z.array(z.string().url()).optional(),
})

// Report Schemas
export const reportGenerationSchema = z.object({
  type: z.enum(['alerts', 'usage', 'payments', 'children'], {
    errorMap: () => ({ message: 'Please select a report type' }),
  }),
  startDate: z.string().datetime('Please select a valid start date'),
  endDate: z.string().datetime('Please select a valid end date'),
  format: z.enum(['pdf', 'csv', 'excel'], {
    errorMap: () => ({ message: 'Please select a format' }),
  }),
  includeCharts: z.boolean().default(false),
})

export const alertReportSchema = z.object({
  childId: z.string().optional(),
  category: z.enum(['porn', 'gambling', 'social', 'other']).optional(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
})

// Extension Schemas
export const extensionSettingsSchema = z.object({
  enabled: z.boolean(),
  blockAdultContent: z.boolean().default(true),
  blockGambling: z.boolean().default(true),
  blockSocialMedia: z.boolean().default(false),
  screenTimeLimit: z.number().min(0).max(24).default(2),
  allowedSites: z.array(z.string().url()).default([]),
  blockedSites: z.array(z.string().url()).default([]),
  reportFrequency: z.enum(['immediate', 'hourly', 'daily']).default('immediate'),
})

// API Response Schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
})

export const paginatedResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
})

// Type Exports
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type AddChildInput = z.infer<typeof addChildSchema>
export type UpdateChildInput = z.infer<typeof updateChildSchema>
export type PaymentInput = z.infer<typeof paymentSchema>
export type AdminUserInput = z.infer<typeof adminUserSchema>
export type RiskySiteInput = z.infer<typeof riskySiteSchema>
export type NotificationSettingsInput = z.infer<typeof notificationSettingsSchema>
export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>
export type SecuritySettingsInput = z.infer<typeof securitySettingsSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type SupportTicketInput = z.infer<typeof supportTicketSchema>
export type ReportGenerationInput = z.infer<typeof reportGenerationSchema>
export type AlertReportInput = z.infer<typeof alertReportSchema>
export type ExtensionSettingsInput = z.infer<typeof extensionSettingsSchema>

// Validation Helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^01[3-9]\d{8}$/
  return phoneRegex.test(phone.replace(/[\s-]/g, ''))
}

export const validateURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Form Validation Messages
export const validationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  passwordMin: 'Password must be at least 6 characters',
  passwordMatch: 'Passwords do not match',
  nameMin: 'Name must be at least 2 characters',
  ageRange: 'Age must be between 1 and 18',
  selectOption: 'Please select an option',
  uploadFile: 'Please upload a file',
  acceptTerms: 'You must accept the terms and conditions',
}

// Error Formatting
export const formatZodError = (error: z.ZodError): string => {
  return error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ')
}

export const getValidationError = (field: string, error: z.ZodError): string | undefined => {
  const fieldError = error.issues.find((err: any) => err.path.includes(field))
  return fieldError?.message
}
