"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface ImageItem {
  id: string;
  name: string;
  imageUrl: string;
  eventName?: string;
  createdBy: string;
  createdAt?: string;
}

interface ImagesTableProps {
  images: ImageItem[];
  fetchImages: () => void;
  isLoading?: boolean;
}

export function ImagesTable({ images, fetchImages, isLoading = false }: ImagesTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Adjust based on your needs

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete image");
      fetchImages();
    } catch (error) {
      console.error(error);
    }
  }

  const filteredImages = images.filter(
    (img) =>
      img.name.toLowerCase().includes(search.toLowerCase()) ||
      (img.eventName &&
        img.eventName.toLowerCase().includes(search.toLowerCase()))
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = filteredImages.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Generate page number array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1); // Ellipsis marker
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(-1); // Ellipsis
        for (let i = totalPages - 3; i < totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(-1); // Ellipsis
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push(-1); // Ellipsis
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  // Table row skeleton for loading state
  const TableRowSkeleton = () => (
    <TableRow className="h-[60px]">
      <TableCell className="w-[80px] h-[60px] p-2">
        <div className="w-[40px] h-[40px] bg-gray-200 animate-pulse rounded-md mx-auto"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
      </TableCell>
      <TableCell>
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="p-2 bg-white rounded-lg shadow-md flex flex-col h-full">
      <div className="mb-2">
        <Input
          type="text"
          placeholder="Search images or events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
          disabled={isLoading}
        />
      </div>
      <div className="overflow-auto flex-1">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="w-[20%]">Name</TableHead>
              <TableHead className="w-[20%]">Event</TableHead>
              <TableHead className="w-[15%]">Uploaded By</TableHead>
              <TableHead className="w-[25%]">Uploaded At</TableHead>
              <TableHead className="w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Show skeleton rows while loading
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : currentImages.length > 0 ? (
              currentImages.map((image) => (
                <TableRow key={image.id}>
                  <TableCell className="w-[80px] h-[60px] p-2">
                    <div className="w-[40px] h-[40px] relative mx-auto">
                      <Image
                        src={image.imageUrl}
                        alt={image.name}
                        fill
                        sizes="40px"
                        priority
                        style={{ objectFit: "cover" }}
                        className="rounded-md"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="truncate">{image.name}</TableCell>
                  <TableCell className="truncate">
                    {image.eventName || "N/A"}
                  </TableCell>
                  <TableCell className="truncate">{image.createdBy}</TableCell>
                  <TableCell>
                    {image.createdAt
                      ? format(new Date(image.createdAt), "PPP p")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(image.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No images found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination UI - only show when not loading and there are multiple pages */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => changePage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {getPageNumbers().map((pageNum, index) =>
                pageNum === -1 ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={pageNum === currentPage}
                      onClick={() => changePage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
