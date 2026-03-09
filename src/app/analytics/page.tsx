import { BarChart3, TrendingUp, Users, Shield, Clock, AlertTriangle, Activity, Eye } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
          </div>
        </div>

        <div className="p-6">
          {/* Analytics Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-600 font-medium">Total</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">3</div>
              <div className="text-sm text-blue-600">Children Monitored</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Protected</span>
              </div>
              <div className="text-2xl font-bold text-green-700">156</div>
              <div className="text-sm text-green-600">Sites This Week</div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-600 font-medium">Blocked</span>
              </div>
              <div className="text-2xl font-bold text-red-700">47</div>
              <div className="text-sm text-red-600">Harmful Sites</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-600 font-medium">Active</span>
              </div>
              <div className="text-2xl font-bold text-yellow-700">24.5</div>
              <div className="text-sm text-yellow-600">Hours Today</div>
            </div>
          </div>

          {/* Usage Analytics */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Usage by Time of Day
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16">6AM-9AM</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-blue-600 h-4 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">45m</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16">9AM-12PM</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-green-600 h-4 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">2.5h</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16">12PM-3PM</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-yellow-600 h-4 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">3.2h</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16">3PM-6PM</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-purple-600 h-4 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">4.1h</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16">6PM-9PM</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-red-600 h-4 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">2.8h</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16">9PM-12AM</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div className="bg-orange-600 h-4 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">1.5h</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Category Distribution
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Educational</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Entertainment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Social Media</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">20%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Blocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Child-Specific Analytics */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Child-Specific Analytics
            </h3>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Sarah</h4>
                  <span className="text-sm text-green-600">12 years</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Average:</span>
                    <span className="font-medium">4.2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sites Visited:</span>
                    <span className="font-medium">67</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blocked:</span>
                    <span className="font-medium text-red-600">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className="font-medium text-yellow-600">Medium</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600">Top Categories:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Educational</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Social</span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Blocked</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">John</h4>
                  <span className="text-sm text-green-600">10 years</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Average:</span>
                    <span className="font-medium">3.8 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sites Visited:</span>
                    <span className="font-medium">52</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blocked:</span>
                    <span className="font-medium text-red-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className="font-medium text-green-600">Low</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600">Top Categories:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Games</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Videos</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Social</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Emma</h4>
                  <span className="text-sm text-green-600">8 years</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Average:</span>
                    <span className="font-medium">2.5 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sites Visited:</span>
                    <span className="font-medium">37</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blocked:</span>
                    <span className="font-medium text-red-600">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className="font-medium text-green-600">Low</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600">Top Categories:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Kids Content</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Educational</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Games</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Trends */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Weekly Trends
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Monday</span>
                    <span className="font-medium">3.2h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tuesday</span>
                    <span className="font-medium">4.1h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Wednesday</span>
                    <span className="font-medium">3.8h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Thursday</span>
                    <span className="font-medium">4.5h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Friday</span>
                    <span className="font-medium">5.2h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Analysis
              </h3>
              
              <div className="space-y-4">
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-red-900">High Risk</span>
                    <span className="text-sm text-red-600">2 alerts</span>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Late night browsing detected</li>
                    <li>• Attempted access to adult content</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-yellow-900">Medium Risk</span>
                    <span className="text-sm text-yellow-600">5 alerts</span>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Excessive social media usage</li>
                    <li>• Gaming during study hours</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-900">Low Risk</span>
                    <span className="text-sm text-green-600">Normal</span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Healthy browsing habits</li>
                    <li>• Educational content focus</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
