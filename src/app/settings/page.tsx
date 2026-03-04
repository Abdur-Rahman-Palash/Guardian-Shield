import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Database, Palette, Globe } from "lucide-react"

const settingsSections = [
  {
    title: "Profile",
    description: "Manage your account settings and profile information",
    icon: User,
    items: [
      { label: "Full Name", value: "John Doe", type: "text" },
      { label: "Email", value: "john.doe@example.com", type: "email" },
      { label: "Role", value: "Administrator", type: "badge" },
    ],
  },
  {
    title: "Notifications",
    description: "Configure how you receive notifications",
    icon: Bell,
    items: [
      { label: "Email Notifications", value: "Enabled", type: "toggle" },
      { label: "Push Notifications", value: "Enabled", type: "toggle" },
      { label: "SMS Alerts", value: "Disabled", type: "toggle" },
    ],
  },
  {
    title: "Security",
    description: "Manage your security settings and preferences",
    icon: Shield,
    items: [
      { label: "Two-Factor Authentication", value: "Enabled", type: "badge" },
      { label: "Last Password Change", value: "30 days ago", type: "text" },
      { label: "Active Sessions", value: "3 devices", type: "text" },
    ],
  },
  {
    title: "System",
    description: "System-wide configuration and preferences",
    icon: Database,
    items: [
      { label: "Database Status", value: "Connected", type: "badge" },
      { label: "API Version", value: "v2.1.0", type: "text" },
      { label: "System Uptime", value: "99.9%", type: "text" },
    ],
  },
  {
    title: "Appearance",
    description: "Customize the look and feel of the application",
    icon: Palette,
    items: [
      { label: "Theme", value: "System", type: "text" },
      { label: "Language", value: "English", type: "text" },
      { label: "Timezone", value: "UTC-5", type: "text" },
    ],
  },
  {
    title: "Regional",
    description: "Regional settings and localization",
    icon: Globe,
    items: [
      { label: "Country", value: "United States", type: "text" },
      { label: "Currency", value: "USD", type: "text" },
      { label: "Date Format", value: "MM/DD/YYYY", type: "text" },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and application preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.title}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <label className="text-sm font-medium">{item.label}</label>
                    {item.type === "text" && (
                      <Input
                        value={item.value}
                        readOnly
                        className="w-32 h-8 text-xs"
                      />
                    )}
                    {item.type === "email" && (
                      <Input
                        type="email"
                        value={item.value}
                        readOnly
                        className="w-40 h-8 text-xs"
                      />
                    )}
                    {item.type === "badge" && (
                      <Badge
                        variant={item.value === "Enabled" || item.value === "Connected" ? "default" : "secondary"}
                      >
                        {item.value}
                      </Badge>
                    )}
                    {item.type === "toggle" && (
                      <Button
                        variant={item.value === "Enabled" ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-16 p-0"
                      >
                        {item.value === "Enabled" ? "On" : "Off"}
                      </Button>
                    )}
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
