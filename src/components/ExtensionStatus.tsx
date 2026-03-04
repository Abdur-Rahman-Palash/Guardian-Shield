"use client"

import { useState } from 'react'
import { useExtensionStatus } from '@/hooks/useExtensionStatus'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  ShieldOff, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Bell,
  Camera,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react'

interface ExtensionStatusProps {
  className?: string
  compact?: boolean
}

export function ExtensionStatus({ className, compact = false }: ExtensionStatusProps) {
  const { status, isLoading, installExtension, sendManualAlert, refreshStatus } = useExtensionStatus()
  const [alertMessage, setAlertMessage] = useState('')
  const [childName, setChildName] = useState('')
  const [showAlertForm, setShowAlertForm] = useState(false)
  const [isSendingAlert, setIsSendingAlert] = useState(false)

  const handleSendAlert = async () => {
    if (!childName.trim() || !alertMessage.trim()) {
      alert('Please enter both child name and alert message')
      return
    }

    setIsSendingAlert(true)
    try {
      const result = await sendManualAlert(childName.trim(), alertMessage.trim())
      
      if (result.success) {
        setAlertMessage('')
        setChildName('')
        setShowAlertForm(false)
        alert('Alert sent successfully!')
      } else {
        alert(`Failed to send alert: ${result.error}`)
      }
    } catch (error) {
      console.error('Error sending alert:', error)
      alert('Failed to send alert. Please try again.')
    } finally {
      setIsSendingAlert(false)
    }
  }

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="w-5 h-5 animate-spin" />
    if (status.isInstalled && status.isEnabled) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (status.isInstalled && !status.isEnabled) return <EyeOff className="w-5 h-5 text-yellow-600" />
    return <ShieldOff className="w-5 h-5 text-red-600" />
  }

  const getStatusText = () => {
    if (isLoading) return 'Checking...'
    if (status.isInstalled && status.isEnabled) return 'Extension Active'
    if (status.isInstalled && !status.isEnabled) return 'Extension Disabled'
    return 'Extension Not Installed'
  }

  const getStatusColor = () => {
    if (isLoading) return 'text-blue-600'
    if (status.isInstalled && status.isEnabled) return 'text-green-600'
    if (status.isInstalled && !status.isEnabled) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRiskySiteBadge = () => {
    if (!status.isRiskySite) return null
    
    const colors = {
      porn: 'destructive',
      gambling: 'secondary',
      other: 'outline'
    } as const

    return (
      <Badge variant={colors[status.riskyCategory!] || 'outline'} className="ml-2">
        {status.riskyCategory?.toUpperCase()} - BLOCKED
      </Badge>
    )
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {getRiskySiteBadge()}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-lg">Browser Extension</CardTitle>
              <CardDescription>
                Guardian Shield protection status
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshStatus}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Display */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            {status.version && (
              <Badge variant="outline" className="text-xs">
                v{status.version}
              </Badge>
            )}
          </div>
          {getRiskySiteBadge()}
        </div>

        {/* Current Site Info */}
        {status.tabUrl && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-1">Current Site:</div>
            <div className="text-xs text-muted-foreground break-all">
              {status.tabUrl}
            </div>
          </div>
        )}

        {/* Install Extension */}
        {!status.isInstalled && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <AlertTriangle className="w-4 h-4" />
              <span>Extension not installed - Protection limited</span>
            </div>
            <Button
              onClick={installExtension}
              className="w-full"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Install Extension
            </Button>
          </div>
        )}

        {/* Extension Disabled */}
        {status.isInstalled && !status.isEnabled && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <EyeOff className="w-4 h-4" />
              <span>Extension is disabled in browser settings</span>
            </div>
            <Button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open('chrome://extensions/', '_blank')
                }
              }}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Enable Extension
            </Button>
          </div>
        )}

        {/* Manual Alert */}
        {(status.isInstalled && status.isEnabled) && (
          <div className="space-y-3">
            {!showAlertForm ? (
              <Button
                onClick={() => setShowAlertForm(true)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Bell className="w-4 h-4 mr-2" />
                Send Manual Alert
              </Button>
            ) : (
              <div className="space-y-3 p-3 border rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Child Name
                  </label>
                  <Input
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Enter child's name"
                    disabled={isSendingAlert}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Alert Message
                  </label>
                  <textarea
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    placeholder="Describe the concern or issue..."
                    className="w-full p-2 border rounded-md text-sm"
                    rows={3}
                    disabled={isSendingAlert}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSendAlert}
                    disabled={isSendingAlert}
                    className="flex-1"
                    size="sm"
                  >
                    {isSendingAlert ? 'Sending...' : 'Send Alert'}
                  </Button>
                  <Button
                    onClick={() => setShowAlertForm(false)}
                    variant="outline"
                    disabled={isSendingAlert}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Screenshot Feature */}
        {status.isInstalled && status.isEnabled && (
          <div className="space-y-2">
            <Button
              onClick={() => {
                // This would trigger screenshot functionality
                if (typeof window !== 'undefined') {
                  window.postMessage({
                    type: 'GUARDIAN_SHIELD_CAPTURE_SCREENSHOT'
                  }, '*')
                }
              }}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture Screenshot
            </Button>
          </div>
        )}

        {/* Last Checked */}
        <div className="text-xs text-muted-foreground">
          Last checked: {status.lastChecked.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
