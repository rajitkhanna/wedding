"use client";

import { useState, useRef } from "react";
import { db } from "@/lib/instant/db";

interface StoredFile {
  id: string;
  path: string;
  url: string;
}

const PATH_PREFIXES = [
  { value: "story", label: "Story" },
  { value: "ceremony", label: "Ceremony" },
  { value: "reception", label: "Reception" },
  { value: "venue", label: "Venue" },
  { value: "details", label: "Details" },
  { value: "guests", label: "Guests" },
];

export function PhotosTab() {
  const { isLoading, data } = db.useQuery({ $files: {} });
  const files: StoredFile[] = data?.$files ?? [];

  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prefix, setPrefix] = useState("ceremony");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError("");

    const path = `${prefix}/${selectedFile.name}`;

    try {
      await db.storage.uploadFile(path, selectedFile, {
        contentType: selectedFile.type,
      });

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(file: StoredFile) {
    if (!confirm(`Delete "${file.path}"?`)) return;
    try {
      db.transact(db.tx.$files[file.id].delete());
    } catch (err) {
      console.error(err);
      setError("Failed to delete file.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p
          className="text-sm tracking-widest uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2
        className="text-3xl mb-8"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-gold)",
          fontWeight: 400,
        }}
      >
        Photos
      </h2>

      <div
        className="mb-8 rounded-lg p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border-gold)",
        }}
      >
        <h3
          className="text-xl mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-gold)",
            fontWeight: 400,
          }}
        >
          Upload Photo
        </h3>

        <form
          onSubmit={handleUpload}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-end"
        >
          <div className="flex-1 w-full">
            <label
              className="block text-sm mb-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              Select File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              className="w-full rounded px-4 py-2.5 text-sm"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border-gold)",
                color: "var(--color-text)",
              }}
            />
          </div>

          <div className="w-full sm:w-40">
            <label
              className="block text-sm mb-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              Folder
            </label>
            <select
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full rounded px-4 py-2.5 text-sm"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border-gold)",
                color: "var(--color-text)",
              }}
            >
              {PATH_PREFIXES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className="rounded px-6 py-2.5 text-sm tracking-wide transition-opacity hover:opacity-80 disabled:opacity-50 w-full sm:w-auto"
            style={{
              backgroundColor: "var(--color-gold)",
              color: "var(--color-bg)",
            }}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </form>

        {uploading && (
          <p
            className="mt-4 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Uploading…
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm" style={{ color: "var(--color-red)" }}>
            {error}
          </p>
        )}
      </div>

      <div>
        <h3
          className="text-xl mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-gold)",
            fontWeight: 400,
          }}
        >
          Uploaded Photos ({files.length})
        </h3>

        {files.length === 0 ? (
          <p
            className="text-sm py-12 text-center rounded-lg"
            style={{
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text-muted)",
            }}
          >
            No photos uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="group relative rounded-lg overflow-hidden"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <img
                  src={file.url}
                  alt={file.path}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <p
                    className="text-xs text-center px-2 truncate w-full"
                    style={{ color: "var(--color-text)" }}
                  >
                    {file.path.split("/").pop()}
                  </p>
                  <button
                    onClick={() => handleDelete(file)}
                    className="rounded px-3 py-1.5 text-xs transition-opacity hover:opacity-70"
                    style={{
                      backgroundColor: "var(--color-red)",
                      color: "var(--color-text)",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
