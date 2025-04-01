import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

// Define the Event type
interface Event {
  id: string;
  name: string;
  date: string;
  description?: string;
  created_at?: string;
}

interface EventsTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean; // Add isLoading prop
}

export function EventsTable({ events, onEdit, onDelete, isLoading = false }: EventsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust based on your needs
  
  // Calculate pagination
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);
  
  // Generate page number array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
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
        <div className="flex space-x-2">
          <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-8 w-12 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="p-3 bg-white rounded-lg shadow-md flex flex-col h-full">
      <div className="overflow-auto flex-1">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Event Name</TableHead>
              <TableHead className="w-[15%]">Date</TableHead>
              <TableHead className="w-[30%]">Description</TableHead>
              <TableHead className="w-[20%]">Created At</TableHead>
              <TableHead className="w-[15%]">Actions</TableHead>
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
                <TableRowSkeleton />
              </>
            ) : currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <TableRow key={event.id} className="h-[60px]">
                  <TableCell className="truncate">{event.name}</TableCell>
                  <TableCell>{format(new Date(event.date), "PPP")}</TableCell>
                  <TableCell className="truncate">{event.description || "N/A"}</TableCell>
                  <TableCell>
                    {event.created_at
                      ? format(new Date(event.created_at), "PPP p")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(event)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(event.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination UI - only show when not loading and there are multiple pages */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => changePage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {getPageNumbers().map((pageNum, index) => (
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
              ))}
              
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
