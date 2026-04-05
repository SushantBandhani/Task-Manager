"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Task, FilterStatus, CreateTaskPayload, UpdateTaskPayload } from "@/types";
import { tasksApi } from "@/lib/tasksApi";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { TaskCard } from "@/components/TaskCard";
import { TaskList } from "@/components/TaskList";
import { TaskModal } from "@/components/TaskModal";
import { DeleteDialog } from "@/components/DeleteDialog";
import { StatsBar } from "@/components/StatsBar";
import { TaskSkeleton } from "@/components/TaskSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Pagination } from "@/components/Pagination";



export default function DashboardPage() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchTasks = useCallback(async () => {
  setLoading(true);
  try {
    const data = await tasksApi.getAll({ 
      page: currentPage, 
      limit: pageSize,
      status: filterStatus !== "all" ? filterStatus : undefined,
      search: search.trim() || undefined,
    });

    setTasks(data.tasks);
    setTotalPages(data.pagination.totalPages);
    setTotalTasks(data.pagination.total);
  } catch (err) {
    const msg = (err as AxiosError<{ message: string }>)?.response?.data?.message;
    toast.error(msg || "Failed to load tasks");
  } finally {
    setLoading(false);
  }
}, [currentPage, pageSize, filterStatus, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filterStatus !== "all") {
      result = result.filter((t) => t.status === filterStatus);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tasks, filterStatus, search]);

  const isFiltered = filterStatus !== "all" || search.trim() !== "";


  const handleCreate = async (payload: CreateTaskPayload) => {
  try {
    await tasksApi.create(payload);
    await fetchTasks();
    setModalOpen(false);
    toast.success("Task created!");
  } catch (err) {
    const msg = (err as AxiosError<{ message: string }>)?.response?.data?.message;
    toast.error(msg || "Failed to create task");
    throw err; 
  }
};

  const handleUpdate = async (payload: UpdateTaskPayload) => {
    if (!editingTask) return;

    try {
      await tasksApi.update(editingTask.id, payload);

      await fetchTasks();

      setEditingTask(null);
      setModalOpen(false);
      toast.success("Task updated!");
    } catch (err) {
      const msg = (err as AxiosError<{ message: string }>)?.response?.data?.message;
      toast.error(msg || "Failed to update task");
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteTask) return;
    setDeleteLoading(true);

    try {
      await tasksApi.delete(deleteTask.id);

      const isLastItemOnPage = tasks.length === 1;
      if (isLastItemOnPage && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      await fetchTasks(); 

      setDeleteTask(null);
      toast.success("Task deleted");
    } catch (err) {
      const msg = (err as AxiosError<{ message: string }>)?.response?.data?.message;
      toast.error(msg || "Failed to delete task");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggle = async (task: Task) => {
    if (togglingId === task.id) return;
    setTogglingId(task.id);

    try {
      await tasksApi.toggleStatus(task);

      const isLastItemOnPage = tasks.length === 1;
      if (isLastItemOnPage && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

    await fetchTasks(); 

      toast.success(
        `Task marked as ${
          task.status === "completed"
            ? "pending"
            : task.status === "pending"
            ? "in_progress"
            : "completed"
        }`
      );
    } catch {
      toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("all");
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar onNewTask={openCreate} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        <div className="animate-slide-up" style={{ animationDelay: "0.05s", opacity: 0, animationFillMode: "forwards" }}>
          <h1 className="font-display text-2xl sm:text-3xl font-700" style={{ color: "var(--text-primary)" }}>
            {greeting()},{" "}
            <span className="text-gradient">{user?.firstName ?? "there"}</span> ✦
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {loading
              ? "Loading your tasks…"
              : tasks.length === 0
              ? "You have no tasks yet. Start by creating one!"
              : `You have ${tasks.filter((t) => t.status !== "completed").length} active task${tasks.filter((t) => t.status !== "completed").length !== 1 ? "s" : ""} to work on.`}
          </p>
        </div>


        {!loading && tasks.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}>
            <StatsBar tasks={tasks} />
          </div>
        )}


        <div className="animate-slide-up" style={{ animationDelay: "0.15s", opacity: 0, animationFillMode: "forwards" }}>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            view={view}
            onViewChange={setView}
            resultCount={filteredTasks.length}
          />
        </div>


        {isFiltered && !loading && (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {filteredTasks.length} result{filteredTasks.length !== 1 ? "s" : ""}
              {search && ` for "${search}"`}
              {filterStatus !== "all" && ` · ${filterStatus.replace("_", " ")}`}
            </span>
            <button
              onClick={clearFilters}
              className="text-xs px-2.5 py-1 rounded-lg transition-all"
              style={{ color: "var(--accent)", background: "var(--accent-glow)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
            >
              Clear
            </button>
          </div>
        )}


        {loading ? (
          <TaskSkeleton count={6} />
        ) : filteredTasks.length === 0 ? (
          <EmptyState isFiltered={isFiltered} onClear={clearFilters} onCreate={openCreate} />
        ) : view === "grid" ? (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                index={i}
                onEdit={openEdit}
                onDelete={(t) => setDeleteTask(t)}
                onToggle={handleToggle}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalTasks={totalTasks}
            onPageChange={setCurrentPage}
          />
          </>
        ) : (
          <>
          <TaskList
            tasks={filteredTasks}
            onEdit={openEdit}
            onDelete={(t) => setDeleteTask(t)}
            onToggle={handleToggle}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalTasks={totalTasks}
            onPageChange={setCurrentPage}
          />
          </>
        )}
      </main>

      <TaskModal
        open={modalOpen}
        task={editingTask}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleUpdate : handleCreate}
      />

      <DeleteDialog
        open={!!deleteTask}
        task={deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
