import { Shield, Eye, AlertTriangle, Activity, Clock, TrendingUp, Users, Monitor } from 'lucide-react'

export default function MonitoringPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Real-Time Monitoring</h2>
          </div>
        </div>

        <div className="p-6">
          {/* Monitoring Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
              <div className="text-2xl font-bold text-green-700">3</div>
              <div className="text-sm text-green-600">Devices Protected</div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-600 font-medium">Today</span>
              </div>
              <div className="text-2xl font-bold text-red-700">12</div>
              <div className="text-sm text-red-600">Sites Blocked</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-600 font-medium">Live</span>
              </div>
              <div className="text-2xl font-bold text-yellow-700">245</div>
              <div className="text-sm text-yellow-600">Minutes Active</div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">Today</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">8</div>
              <div className="text-sm text-blue-600">Alerts Sent</div>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Activity Feed
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-900">Content Blocked</span>
                    <span className="text-sm text-red-600">• Just now</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Sarah's Laptop - Blocked access to gambling site: bet365.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Alert Triggered</span>
                    <span className="text-sm text-yellow-600">• 2 minutes ago</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    John's Phone - Unusual activity detected: Late night browsing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">Safe Browsing</span>
                    <span className="text-sm text-green-600">• 5 minutes ago</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Emma's Tablet - Safe activity: Educational content on YouTube Kids
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Device Connected</span>
                    <span className="text-sm text-blue-600">• 10 minutes ago</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Sarah's Laptop - Device came online and started monitoring
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Device Status */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Device Status
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Sarah's Laptop</span>
                  </div>
                  <span className="text-sm text-green-600">Online</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Child:</span>
                    <span className="font-medium">Sarah</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Site:</span>
                    <span className="font-medium text-green-600">google.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usage Today:</span>
                    <span className="font-medium">245 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blocked:</span>
                    <span className="font-medium text-red-600">12</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">John's Phone</span>
                  </div>
                  <span className="text-sm text-green-600">Online</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Child:</span>
                    <span className="font-medium">John</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Site:</span>
                    <span className="font-medium text-yellow-600">instagram.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usage Today:</span>
                    <span className="font-medium">180 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blocked:</span>
                    <span className="font-medium text-red-600">8</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="font-medium text-gray-900">Emma's Tablet</span>
                  </div>
                  <span className="text-sm text-gray-600">Offline</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Child:</span>
                    <span className="font-medium">Emma</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Seen:</span>
                    <span className="font-medium">30 min ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usage Today:</span>
                    <span className="font-medium">120 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blocked:</span>
                    <span className="font-medium text-red-600">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Statistics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Real-Time Statistics
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Today's Activity</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Safe Browsing</span>
                      <span className="font-medium text-green-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Blocked Content</span>
                      <span className="font-medium text-red-600">12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Alerts Triggered</span>
                      <span className="font-medium text-yellow-600">3%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Top Blocked Categories</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Adult Content</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-red-600">8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Gambling</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-red-600">4</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Social Media</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-yellow-600">2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
