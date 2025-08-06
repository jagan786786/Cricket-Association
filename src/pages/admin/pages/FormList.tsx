import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SidebarInset } from "@/components/ui/sidebar";
import { Eye, Plus, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FormList() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  const fetchForms = async () => {
    try {
      const res = await axios.get(
        "https://cricket-association-backend.onrender.com/api/forms"
      );
      setForms(res.data);
    } catch (err) {
      console.error("Failed to fetch forms:", err);
    }
  };

  const handleToggle = async (formId, currentStatus) => {
    try {
      await axios.patch(
        `https://cricket-association-backend.onrender.com/api/form/${formId}/activate`,
        {
          isActive: !currentStatus,
        }
      );
      fetchForms(); // Refresh state
    } catch (err) {
      console.error("Failed to toggle form:", err);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      <SidebarInset className="flex-1">
        <div className="flex flex-col">
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Forms</h2>
                  <p className="text-muted-foreground">
                    Manage your custom forms and view submissions
                  </p>
                </div>
                <Button
                  className="bg-green-900 hover:bg-green-700"
                  onClick={() => navigate("/admin/createform")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Form
                </Button>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>All Forms</CardTitle>
                  <CardDescription>
                    {forms.length} form(s) created
                  </CardDescription>
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
                      {forms.map((form) => (
                        <TableRow key={form._id}>
                          <TableCell className="font-medium">
                            {form.formId?.name}
                          </TableCell>
                          <TableCell>{form.formId?.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={form.isActive}
                                onCheckedChange={() =>
                                  handleToggle(form.formId._id, form.isActive)
                                }
                              />
                              <Badge
                                variant="secondary"
                                className={`${
                                  form.isActive
                                    ? "bg-slate-900 text-white"
                                    : "bg-gray-300 text-gray-800"
                                }`}
                              >
                                {form.isActive ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(form.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/form/${form.formId._id}`)
                              }
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/admin/form/${form.formId._id}?edit=true`
                                )
                              }
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Button> */}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
