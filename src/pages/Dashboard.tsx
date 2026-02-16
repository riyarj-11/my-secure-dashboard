import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks, Task, NewTask } from "@/hooks/useTasks";
import TaskCard from "@/components/dashboard/TaskCard";
import TaskDialog from "@/components/dashboard/TaskDialog";
import ProfileSection from "@/components/dashboard/ProfileSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, LogOut, Plus, Search } from "lucide-react";

export default function Dashboard() {
  const { signOut } = useAuth();
  const { tasks, isLoading, create, update, remove } = useTasks();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const handleSubmit = (data: NewTask) => {
    if (editingTask) {
      update.mutate({ id: editingTask.id, ...data }, {
        onSuccess: () => { setDialogOpen(false); setEditingTask(null); },
        onError: () => toast({ title: "Update failed", variant: "destructive" }),
      });
    } else {
      create.mutate(data, {
        onSuccess: () => setDialogOpen(false),
        onError: () => toast({ title: "Create failed", variant: "destructive" }),
      });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    remove.mutate(id, {
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });
  };

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    done: tasks.filter(t => t.status === "done").length,
  }), [tasks]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-accent" />
            <span className="text-xl font-display font-bold">TaskFlow</span>
          </div>
          <Button variant="ghost" onClick={signOut} className="text-muted-foreground">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: stats.total, color: "text-foreground" },
            { label: "To Do", value: stats.todo, color: "text-muted-foreground" },
            { label: "In Progress", value: stats.inProgress, color: "text-warning" },
            { label: "Done", value: stats.done, color: "text-success" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Tasks */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => { setEditingTask(null); setDialogOpen(true); }} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" /> New Task
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="font-display text-lg">No tasks found</p>
                <p className="text-sm mt-1">Create your first task to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProfileSection />
          </div>
        </div>
      </main>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSubmit={handleSubmit}
        submitting={create.isPending || update.isPending}
      />
    </div>
  );
}
