"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { FileText, Eye } from "lucide-react";

export default function CoachLibrary() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teacher/library", { credentials: "include" })
      .then(res => res.json())
      .then(json => {
        setFiles(json.data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Academy Curriculum</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(null).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : files.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((f, i) => (
            <Card key={f.id} className="hover:shadow-md transition">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium">Coach curriculum document - {i + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded resource
                    </p>
                  </div>
                </div>

                <a
                  href={f.file_url}
                  target="_blank"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <Eye className="h-4 w-4" />
                  View
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No files assigned to you yet
          </CardContent>
        </Card>
      )}
    </div>
  );
}
