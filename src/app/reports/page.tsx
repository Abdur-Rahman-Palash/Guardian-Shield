import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Filter } from "lucide-react"

const reports = [
  {
    id: "RPT-001",
    title: "Security Alert: Suspicious Login Activity",
    status: "open" as const,
    priority: "high" as const,
    assignedTo: "John Doe",
    createdAt: "2024-03-04",
    updatedAt: "2024-03-04",
  },
  {
    id: "RPT-002",
    title: "System Performance Degradation",
    status: "in-progress" as const,
    priority: "medium" as const,
    assignedTo: "Jane Smith",
    createdAt: "2024-03-03",
    updatedAt: "2024-03-04",
  },
  {
    id: "RPT-003",
    title: "User Access Request",
    status: "resolved" as const,
    priority: "low" as const,
    assignedTo: "Mike Johnson",
    createdAt: "2024-03-02",
    updatedAt: "2024-03-03",
  },
  {
    id: "RPT-004",
    title: "Database Connection Timeout",
    status: "open" as const,
    priority: "high" as const,
    assignedTo: "Sarah Wilson",
    createdAt: "2024-03-04",
    updatedAt: "2024-03-04",
  },
  {
    id: "RPT-005",
    title: "API Rate Limit Exceeded",
    status: "in-progress" as const,
    priority: "medium" as const,
    assignedTo: "Tom Brown",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-02",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return <Badge variant="destructive">Open</Badge>
    case "in-progress":
      return <Badge variant="secondary">In Progress</Badge>
    case "resolved":
      return <Badge variant="default">Resolved</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High</Badge>
    case "medium":
      return <Badge variant="secondary">Medium</Badge>
    case "low":
      return <Badge variant="outline">Low</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Manage and track all security and system reports
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
          <CardDescription>
            A comprehensive list of all reports in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                  <TableCell>{report.assignedTo}</TableCell>
                  <TableCell>{report.createdAt}</TableCell>
                  <TableCell>{report.updatedAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
