"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { UsersIcon, CalendarIcon, ImageIcon, DatabaseIcon } from "lucide-react";

export default function DashboardPage() {
  // State for metrics (fetched from API)
  const [metrics, setMetrics] = useState({
    users: 0,
    events: 0,
    images: 0,
    embeddings: 0
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/admin/stats`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        if (responseData.status === "success" && responseData.data) {
          setMetrics({
            users: responseData.data.total_users,
            events: responseData.data.total_events,
            images: responseData.data.total_images,
            embeddings: responseData.data.total_face_embeddings
          });
          setError(null);
        } else {
          throw new Error("Invalid response format from API");
        }
      } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Card skeleton for loading state
  const CardSkeleton = () => (
    <Card variant="accent">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-4 bg-gray-200 animate-pulse rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="h-3 w-20 bg-gray-200 animate-pulse rounded"></div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : (
              <>
                {/* Users Card */}
                <Card variant="accent">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <UsersIcon className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.users.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Registered accounts</p>
                  </CardContent>
                </Card>

                {/* Events Card */}
                <Card variant="accent">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.events.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Created events</p>
                  </CardContent>
                </Card>

                {/* Images Card */}
                <Card variant="accent">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Images</CardTitle>
                    <ImageIcon className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.images.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Uploaded images</p>
                  </CardContent>
                </Card>

                {/* Embeddings Card */}
                <Card variant="accent">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Embeddings</CardTitle>
                    <DatabaseIcon className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.embeddings.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Face embeddings</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="mt-6">
            {/* <p className="text-gray-700 mb-4">
              Use the sidebar to navigate through different sections of the dashboard.
            </p> */}
          </div>
        </>
      )}
    </div>
  );
}
