"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  Trash2,
  Search,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  ChevronLeft,
  GripVertical,
} from "lucide-react";
import type { Patient } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
  onReorder: (orderedPatientIds: string[]) => void;
}

// Sortable table row component
function SortablePatientRow({
  patient,
  isExpanded,
  onToggle,
  onRowClick,
  onEdit,
  onDelete,
}: {
  patient: Patient;
  isExpanded: boolean;
  onToggle: () => void;
  onRowClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: patient.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      onClick={onRowClick}
      className={`transition-all duration-200 border-b cursor-pointer ${
        isDragging
          ? "bg-blue-100 dark:bg-blue-900/30 shadow-lg z-50"
          : isExpanded
          ? "bg-blue-50/30 border-blue-200 shadow-sm"
          : "border-gray-100 hover:bg-blue-50/50 hover:shadow-sm"
      }`}
    >
      <TableCell className="w-8 p-2">
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
      </TableCell>
      <TableCell className="w-12 text-sm text-gray-600 dark:text-gray-300 text-center">
        {patient.bed_number || "-"}
      </TableCell>
      <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`print-hide rounded-full p-1.5 transition-all duration-200 ${
              isExpanded
                ? "bg-blue-500 hover:bg-blue-600 shadow-sm"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-white" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            )}
          </button>
          <span className="text-sm">{patient.name || "-"}</span>
        </div>
      </TableCell>
      <TableCell>
        <div
          className={`${
            isExpanded ? "" : "line-clamp-3"
          } print:line-clamp-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed`}
        >
          {patient.brief_history || "-"}
        </div>
        {!isExpanded &&
          patient.brief_history &&
          patient.brief_history.length > 100 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold mt-2 px-2.5 py-1 rounded-md hover:bg-blue-100 transition-all duration-200 print-hide"
            >
              Show more
              <ChevronDown className="h-3 w-3" />
            </button>
          )}
      </TableCell>
      <TableCell>
        <div
          className={`${
            isExpanded ? "" : "line-clamp-2"
          } print:line-clamp-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed`}
        >
          {patient.diagnosis || "-"}
        </div>
      </TableCell>
      <TableCell>
        <div
          className={`${
            isExpanded ? "" : "line-clamp-3"
          } print:line-clamp-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed`}
        >
          {patient.physical_examination || "-"}
        </div>
      </TableCell>
      <TableCell>
        <div
          className={`${
            isExpanded ? "" : "line-clamp-2"
          } print:line-clamp-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed`}
        >
          {patient.imaging || "-"}
        </div>
      </TableCell>
      <TableCell>
        <div
          className={`${
            isExpanded ? "" : "line-clamp-2"
          } print:line-clamp-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed`}
        >
          {patient.lab_result || "-"}
        </div>
      </TableCell>
      <TableCell>
        <div
          className={`${
            isExpanded ? "" : "line-clamp-2"
          } print:line-clamp-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed`}
        >
          {patient.incident || "-"}
        </div>
      </TableCell>
      <TableCell>
        <div
          className={`${
            isExpanded ? "" : "line-clamp-3"
          } print:line-clamp-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed`}
        >
          {patient.medications || "-"}
        </div>
      </TableCell>
      <TableCell>
        <div
          className={`${
            isExpanded ? "" : "line-clamp-3"
          } print:line-clamp-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed`}
        >
          {patient.plan || "-"}
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-600 dark:text-gray-300">
        {patient.round || "-"}
      </TableCell>
      <TableCell className="print-hide">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="hover:bg-blue-50 hover:text-blue-700"
            title="Edit patient"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="hover:bg-red-50 hover:text-red-700"
            title="Delete patient"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function PatientTable({
  patients,
  onEdit,
  onDelete,
  onReorder,
}: PatientTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end - work with full patient list
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find positions in the FULL patient list (from props)
      const oldIndex = patients.findIndex((p) => p.id === active.id);
      const newIndex = patients.findIndex((p) => p.id === over.id);
      
      console.log("Drag end:", { oldIndex, newIndex, activeId: active.id, overId: over.id });
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedPatients = arrayMove([...patients], oldIndex, newIndex);
        console.log("New order:", reorderedPatients.map(p => ({ id: p.id, name: p.name, serial_no: p.serial_no })));
        onReorder(reorderedPatients.map((p) => p.id));
      }
    }
  }

  // Filter patients based on search term
  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.toLowerCase();
    return (
      patient.name.toLowerCase().includes(search) ||
      patient.diagnosis?.toLowerCase().includes(search) ||
      patient.medications?.toLowerCase().includes(search) ||
      patient.plan?.toLowerCase().includes(search)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPatients.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const toggleRow = (patientId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(patientId)) {
      newExpanded.delete(patientId);
    } else {
      newExpanded.add(patientId);
    }
    setExpandedRows(newExpanded);
  };

  const handleRowClick = (patientId: string) => {
    router.push(`/patients/${patientId}`);
  };

  const openDeleteDialog = (patient: Patient) => {
    setPatientToDelete({ id: patient.id, name: patient.name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (patientToDelete) {
      onDelete(patientToDelete.id);
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar and Page Size */}
      <div className="flex items-center gap-3 print-hide">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search patients by name, diagnosis, medications..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-12 border-2 focus:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-gray-200 dark:placeholder:text-gray-500"
          />
        </div>
        {searchTerm && (
          <Button
            variant="outline"
            onClick={() => handleSearchChange("")}
            className="border-2"
          >
            Clear
          </Button>
        )}
        <Select
          value={pageSize.toString()}
          onValueChange={handlePageSizeChange}
          
        >
          <SelectTrigger className="w-32 h-12 border-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 / page</SelectItem>
            <SelectItem value="10" >10 / page</SelectItem>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="100">100 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between print-hide">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Showing{" "}
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {startIndex + 1}-{Math.min(endIndex, filteredPatients.length)}
          </span>{" "}
          of{" "}
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {filteredPatients.length}
          </span>{" "}
          patients
          {searchTerm && ` (filtered from ${patients.length} total)`}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
          <ChevronRight className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>
            Click <span className="font-semibold">chevron icons</span> to
            expand/collapse
          </span>
        </div>
      </div>

      {/* Screen View Table (with pagination) */}
      <Card className="border-0 shadow-lg overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
          <Table className="patient-table">
            <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 border-b-2 border-blue-200 dark:border-slate-600">
                  <TableHead className="w-8 font-bold text-gray-900 dark:text-gray-100 text-xs print-hide"></TableHead>
                  <TableHead className="w-12 font-bold text-gray-900 dark:text-gray-100 text-xs text-center">Bed No.</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Name</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Brief History</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Diagnosis</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Physical Exam</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Imaging</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Lab Result</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Incident</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Medications</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Plan</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Round</TableHead>
                  <TableHead className="print-hide font-bold text-gray-900 dark:text-gray-100 text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPatients.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={13} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {searchTerm
                            ? "No patients found"
                            : "No patients added yet"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "Add your first patient to get started"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                  <SortableContext
                    items={paginatedPatients.map((p) => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {paginatedPatients.map((patient) => (
                      <SortablePatientRow
                      key={patient.id}
                        patient={patient}
                        isExpanded={expandedRows.has(patient.id)}
                        onToggle={() => toggleRow(patient.id)}
                        onRowClick={() => handleRowClick(patient.id)}
                        onEdit={() => onEdit(patient)}
                        onDelete={() => openDeleteDialog(patient)}
                      />
                    ))}
                  </SortableContext>
              )}
            </TableBody>
          </Table>
          </DndContext>
        </div>
      </Card>

      {/* Print View Table (shows ALL patients) */}
      <div className="hidden print:block">
        <Table className="patient-table">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 border-b-2 border-blue-200 dark:border-slate-600">
              <TableHead className="w-12 font-bold text-gray-900 dark:text-gray-100 text-xs text-center">Bed No.</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Name</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Brief History</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Diagnosis</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Physical Exam</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Imaging</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Lab Result</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Incident</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Medications</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Plan</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-xs">Round</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id} className="border-b border-gray-100">
                <TableCell className="w-12 text-sm text-gray-600 dark:text-gray-300 text-center">
                  {patient.bed_number || "-"}
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {patient.name || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {patient.brief_history || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {patient.diagnosis || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {patient.physical_examination || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {patient.imaging || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {patient.lab_result || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {patient.incident || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {patient.medications || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {patient.plan || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                  {patient.round || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {filteredPatients.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between print-hide">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="border-2"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Page{" "}
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {totalPages}
              </span>
            </span>
            {totalPages <= 10 && (
              <div className="flex gap-1 ml-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 ${
                        page === currentPage
                          ? "bg-blue-600 hover:bg-blue-700 border-0"
                          : "border-2"
                      }`}
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Print Info */}
      <div className="print-hide text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
          📄 Print Tips:
        </p>
        <ul className="space-y-1 text-xs">
          <li>
            • When printing, ALL patients will be shown (pagination is only for
            screen view)
          </li>
          <li>
            • All content will be fully visible when printed (no truncation)
          </li>
          <li>• Table will auto-fit to page width with proper text wrapping</li>
          <li>• Best printed in landscape orientation (A4)</li>
        </ul>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl">
                Delete Patient
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete{" "}
              <strong>{patientToDelete?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
