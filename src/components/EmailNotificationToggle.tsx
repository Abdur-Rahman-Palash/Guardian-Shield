"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  MessageCircle, 
  Bell, 
  BellOff,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react'

interface NotificationSettings {
  emailAlerts: boolean
  dailyDigest: boolean
  paymentNotifications: boolean
  language: 'en' | 'bn'
  whatsappFallback: boolean
}

export default function EmailNotificationToggle() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailAlerts: true,
    dailyDigest: true,
    paymentNotifications: true,
    language: 'en',
    whatsappFallback: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testEmailSent, setTestEmailSent] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchNotificationSettings()
  }, [])

  const fetchNotificationSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('email_alerts, daily_digest_enabled, payment_notifications, language, whatsapp_fallback')
        .eq('id', user.id)
        .single()

      if (profile) {
        setSettings({
          emailAlerts: profile.email_alerts ?? true,
          dailyDigest: profile.daily_digest_enabled ?? true,
          paymentNotifications: profile.payment_notifications ?? true,
          language: profile.language || 'en',
          whatsappFallback: profile.whatsapp_fallback ?? true
        })
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({
          email_alerts: newSettings.emailAlerts ?? settings.emailAlerts,
          daily_digest_enabled: newSettings.dailyDigest ?? settings.dailyDigest,
          payment_notifications: newSettings.paymentNotifications ?? settings.paymentNotifications,
          language: newSettings.language ?? settings.language,
          whatsapp_fallback: newSettings.whatsappFallback ?? settings.whatsappFallback
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating settings:', error)
        return
      }

      setSettings(prev => ({ ...prev, ...newSettings }))
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const sendTestEmail = async () => {
    try {
      const response = await fetch('/api/alerts/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setTestEmailSent(true)
        setTimeout(() => setTestEmailSent(false), 3000)
      }
    } catch (error) {
      console.error('Error sending test email:', error)
    }
  }

  const CustomSwitch = ({ checked, onCheckedChange, disabled }: { 
    checked: boolean; 
    onCheckedChange: (checked: boolean) => void; 
    disabled?: boolean 
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${checked ? 'bg-blue-600' : 'bg-gray-200'}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 
          transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive alerts and updates
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={sendTestEmail}
            disabled={saving}
          >
            {testEmailSent ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Sent!
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Test Email
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Alerts */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Security Alerts</span>
            </div>
            <p className="text-sm text-gray-600">
              Get instant emails when new security alerts are detected
            </p>
          </div>
          <CustomSwitch
            checked={settings.emailAlerts}
            onCheckedChange={(checked: boolean) => updateSettings({ emailAlerts: checked })}
            disabled={saving}
          />
        </div>

        {/* Daily Digest */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="font-medium">Daily Digest</span>
            </div>
            <p className="text-sm text-gray-600">
              Receive a daily summary of all alerts at 6 PM
            </p>
          </div>
          <CustomSwitch
            checked={settings.dailyDigest}
            onCheckedChange={(checked: boolean) => updateSettings({ dailyDigest: checked })}
            disabled={saving}
          />
        </div>

        {/* Payment Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Payment Updates</span>
            </div>
            <p className="text-sm text-gray-600">
              Get confirmations for payments and subscription changes
            </p>
          </div>
          <CustomSwitch
            checked={settings.paymentNotifications}
            onCheckedChange={(checked: boolean) => updateSettings({ paymentNotifications: checked })}
            disabled={saving}
          />
        </div>

        {/* WhatsApp Fallback */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium">WhatsApp Fallback</span>
            </div>
            <p className="text-sm text-gray-600">
              Use WhatsApp if email delivery fails
            </p>
          </div>
          <CustomSwitch
            checked={settings.whatsappFallback}
            onCheckedChange={(checked: boolean) => updateSettings({ whatsappFallback: checked })}
            disabled={saving}
          />
        </div>

        {/* Language Preference */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Email Language</span>
            </div>
            <p className="text-sm text-gray-600">
              Choose your preferred language for notifications
            </p>
          </div>
          <select
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value as 'en' | 'bn' })}
            className="px-3 py-2 border rounded-md"
            disabled={saving}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা (Bangla)</option>
          </select>
        </div>

        {/* Status Indicators */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Notification Status</span>
            <div className="flex items-center gap-2">
              {settings.emailAlerts && settings.dailyDigest ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <BellOff className="w-3 h-3 mr-1" />
                  Partial
                </Badge>
              )}
            </div>
          </div>
          
          {settings.whatsappFallback && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp fallback enabled</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
