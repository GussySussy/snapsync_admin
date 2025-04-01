"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function LogsPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [logType, setLogType] = useState<string>("app");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [filter, setFilter] = useState("");
  const logContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const endpoint =
        logType === "app"
          ? `${baseUrl}/api/logs/download`
          : `${baseUrl}/api/logs/access`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const logLines = text.split("\n").filter((line) => line.trim() !== "");
      setLogs(logLines);
    } catch (error) {
      console.error("Error fetching logs:", error);

    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = async () => {
    setIsClearing(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/logs/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logType }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setLogs([]);
  
    } catch (error) {
      console.error("Error clearing logs:", error);

    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [logType]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchLogs, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, logType]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (line: string) => {
    if (line.includes("ERROR") || line.includes("error")) {
      return "text-red-500";
    } else if (line.includes("WARNING") || line.includes("warning")) {
      return "text-orange-500";
    } else if (line.includes("INFO") || line.includes("info")) {
      return "text-blue-500";
    }
    return "";
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">System Logs</h1>

      <div className="flex flex-wrap mb-4 gap-4 items-center">
        <Select
          value={logType}
          onValueChange={(value: string) => setLogType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select log type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="app">Application Logs</SelectItem>
            <SelectItem value="access">Access Logs</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() => setAutoRefresh(!autoRefresh)}
          variant={autoRefresh ? "default" : "outline"}
          className="hover:bg-primary/90"
        >
          {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
        </Button>
        
        <Button 
          onClick={fetchLogs} 
          disabled={isLoading}
          className="hover:bg-primary/90"
          variant="outline"
        >
          {isLoading ? "Loading..." : "Refresh Now"}
        </Button>
        
        <Button 
          onClick={clearLogs} 
          variant="destructive"
          disabled={isClearing}
        >
          {isClearing ? "Clearing..." : "Clear Logs"}
        </Button>
      </div>

      <Input
        placeholder="Filter logs..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 w-full border-primary/30 focus:border-primary"
      />

      <div
        ref={logContainerRef}
        className="bg-card border border-primary/10 rounded-lg p-4 h-[70vh] overflow-y-auto font-mono text-sm whitespace-pre shadow-sm"
      >
        {logs.length === 0 ? (
          <p className="text-muted-foreground">No logs available</p>
        ) : (
          logs
            .filter(
              (line) =>
                !filter || line.toLowerCase().includes(filter.toLowerCase())
            )
            .map((line, index) => (
              <p key={index} className={getLogColor(line)}>
                {line}
              </p>
            ))
        )}
      </div>
    </div>
  );
}