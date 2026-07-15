"use client";

import { useState, useEffect } from "react";
import { Modal } from "../../_components/Modal";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  author: string | null;
  categoryId: number | null;
  publishedAt: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  blogCategories?: { id: number; name: string; slug: string } | null;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  author: "Admin",
  categoryId: "",
  isFeatured: false,
  isPublished: false,
  publishedAt: "",
  metaTitle: "",
  metaDescription: "",
};

export default function AdminBlogPostsPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState<{ open: boolean; message: string; variant: "success" | "error" }>({
    open: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/blog/posts");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.posts ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/blog/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.categories ?? []);
    } catch {
      // ignore
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(item: BlogPost) {
    setEditing(item);
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt ?? "",
      content: item.content,
      imageUrl: item.imageUrl ?? "",
      author: item.author ?? "Admin",
      categoryId: item.categoryId?.toString() ?? "",
      isFeatured: item.isFeatured,
      isPublished: item.isPublished,
      publishedAt: item.publishedAt ? item.publishedAt.split("T")[0] : "",
      metaTitle: item.metaTitle ?? "",
      metaDescription: item.metaDescription ?? "",
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        ...form,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        publishedAt: form.isPublished && form.publishedAt ? form.publishedAt : null,
      };

      const url = editing ? `/api/admin/blog/posts/${editing.id}` : "/api/admin/blog/posts";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save");
      setToast({ open: true, message: editing ? "Post updated" : "Post created", variant: "success" });
      setShowForm(false);
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to save post", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/blog/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setToast({ open: true, message: "Post deleted", variant: "success" });
      fetchItems();
    } catch {
      setToast({ open: true, message: "Failed to delete post", variant: "error" });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getCategoryName = (item: BlogPost) => {
    const cat = (item as unknown as Record<string, unknown>).blogCategories as BlogCategory | undefined;
    return cat?.name ?? categories.find(c => c.id === item.categoryId)?.name ?? "—";
  };

  const filtered = items.filter(item => {
    const matchesSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase()) || item.slug?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (statusFilter === "published" ? item.isPublished : !item.isPublished);
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Blog Posts</h1>
        <Button onClick={openCreate}>Add Post</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput
          placeholder="Search by title or slug..."
          onSearch={setSearch}
          className="w-full sm:max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-40"
          options={[
            { value: "all", label: "All" },
            { value: "published", label: "Published" },
            { value: "draft", label: "Draft" },
          ]}
        />
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-ink-muted">ID</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Title</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Category</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Author</th>
                <th className="text-center px-4 py-3 font-medium text-ink-muted">Published</th>
                <th className="text-center px-4 py-3 font-medium text-ink-muted">Featured</th>
                <th className="text-right px-4 py-3 font-medium text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink-muted">
                    No blog posts found
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-cream/50"}>
                    <td className="px-4 py-3 text-ink-muted">{item.id}</td>
                    <td className="px-4 py-3 font-medium text-ink max-w-xs truncate">{item.title}</td>
                    <td className="px-4 py-3 text-ink-muted">{getCategoryName(item)}</td>
                    <td className="px-4 py-3 text-ink-muted">{item.author ?? "Admin"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-cream text-ink-muted"
                      }`}>
                        {item.isPublished ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.isFeatured ? (
                        <span className="text-orange">★</span>
                      ) : (
                        <span className="text-ink-muted">☆</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                          <span className="text-red-500">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? "Edit Post" : "Add Post"}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange bg-white"
            >
              <option value="">— No category —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Content (HTML) *</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={8}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Image URL</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-1">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-muted mb-1">Publish Date</label>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="rounded border-border text-orange focus:ring-orange/50"
              />
              <span className="text-sm font-medium text-ink-muted">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="rounded border-border text-orange focus:ring-orange/50"
              />
              <span className="text-sm font-medium text-ink-muted">Featured</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Meta Title</label>
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              className="w-full h-10 rounded-lg border border-border px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-muted mb-1">Meta Description</label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        variant={toast.variant}
      />
    </div>
  );
}
