import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, Eye, Plus, BarChart3, FileText, FormInput } from "lucide-react"

export default function FormList() {
  return (
      <div className="flex min-h-screen w-full">
        

        <SidebarInset className="flex-1">
          <div className="flex flex-col">
            {/* Header */}
            <div className="border-b bg-background px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-foreground rounded-sm"></div>
                </div>
                <h1 className="text-lg font-semibold">Task Management Tool</h1>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                {/* Forms Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Forms</h2>
                    <p className="text-muted-foreground">Manage your custom forms and view submissions</p>
                  </div>
                  <Button className="bg-slate-900 hover:bg-slate-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Form
                  </Button>
                </div>

                {/* All Forms Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>All Forms</CardTitle>
                    <CardDescription>1 form created</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Indian Premier league</TableCell>
                          <TableCell>A New Tournamenet for cricket</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch defaultChecked />
                              <Badge variant="secondary" className="bg-slate-900 text-white hover:bg-slate-800">
                                Enabled
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>7/26/2025</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
  )
}
