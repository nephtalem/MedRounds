"use client";

import { useState } from "react";
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
} from "lucide-react";
import type { Patient } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
}

export function PatientTable({
  patients,
  onEdit,
  onDelete,
}: PatientTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search patients by name, diagnosis, medications..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-12 border-2 focus:border-blue-500"
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
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="100">100 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between print-hide">
        <p className="text-sm font-medium text-gray-600">
          Showing{" "}
          <span className="font-bold text-gray-900">
            {startIndex + 1}-{Math.min(endIndex, filteredPatients.length)}
          </span>{" "}
          of{" "}
          <span className="font-bold text-gray-900">
            {filteredPatients.length}
          </span>{" "}
          patients
          {searchTerm && ` (filtered from ${patients.length} total)`}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
          <ChevronRight className="h-3.5 w-3.5 text-blue-600" />
          <span>
            Click <span className="font-semibold">chevron icons</span> to
            expand/collapse
          </span>
        </div>
      </div>

      {/* Screen View Table (with pagination) */}
      <Card className="border-0 shadow-lg overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <Table className="patient-table">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
                <TableHead className="font-bold text-gray-900 text-xs">
                  #
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-xs">
                  Name
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-xs">
                  Brief History
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-xs">
                  Diagnosis
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-xs">
                  Physical Exam
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-xs">
                  Imaging
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-xs">
                  Lab Result
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-xs">
                  Incident
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-xs">
                  Medications
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-xs">
                  Plan
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-xs">
                  Round
                </TableHead>
                <TableHead className="print-hide font-bold text-gray-900 text-xs">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          {searchTerm
                            ? "No patients found"
                            : "No patients added yet"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "Add your first patient to get started"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPatients.map((patient, index) => {
                  const isExpanded = expandedRows.has(patient.id);
                  const actualIndex = startIndex + index + 1;
                  return (
                    <TableRow
                      key={patient.id}
                      className={`transition-all duration-200 border-b ${
                        isExpanded
                          ? "bg-blue-50/30 border-blue-200 shadow-sm"
                          : "border-gray-100 hover:bg-blue-50/50"
                      }`}
                    >
                      <TableCell className="font-semibold text-gray-700 text-sm">
                        {actualIndex}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleRow(patient.id)}
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
                          } print:line-clamp-none text-sm text-gray-700 leading-relaxed`}
                        >
                          {patient.brief_history || "-"}
                        </div>
                        {!isExpanded &&
                          patient.brief_history &&
                          patient.brief_history.length > 100 && (
                            <button
                              onClick={() => toggleRow(patient.id)}
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
                          } print:line-clamp-none text-sm text-gray-700 leading-relaxed`}
                        >
                          {patient.diagnosis || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`${
                            isExpanded ? "" : "line-clamp-3"
                          } print:line-clamp-none text-sm text-gray-700 leading-relaxed`}
                        >
                          {patient.physical_examination || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`${
                            isExpanded ? "" : "line-clamp-2"
                          } print:line-clamp-none text-sm text-gray-700 leading-relaxed`}
                        >
                          {patient.imaging || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`${
                            isExpanded ? "" : "line-clamp-2"
                          } print:line-clamp-none text-sm text-gray-700 leading-relaxed`}
                        >
                          {patient.lab_result || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`${
                            isExpanded ? "" : "line-clamp-2"
                          } print:line-clamp-none text-sm text-gray-700 leading-relaxed`}
                        >
                          {patient.incident || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`${
                            isExpanded ? "" : "line-clamp-3"
                          } print:line-clamp-none text-sm text-gray-700 leading-relaxed`}
                        >
                          {patient.medications || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`${
                            isExpanded ? "" : "line-clamp-3"
                          } print:line-clamp-none text-sm text-gray-700 leading-relaxed`}
                        >
                          {patient.plan || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {patient.round || "-"}
                      </TableCell>
                      <TableCell className="print-hide">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(patient)}
                            className="hover:bg-blue-50 hover:text-blue-700"
                            title="Edit patient"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(patient)}
                            className="hover:bg-red-50 hover:text-red-700"
                            title="Delete patient"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Print View Table (shows ALL patients) */}
      <div className="hidden print:block">
        <Table className="patient-table">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
              <TableHead className="font-bold text-gray-900 text-xs">
                #
              </TableHead>
              <TableHead className="font-bold text-gray-900 text-xs">
                Name
              </TableHead>
              <TableHead className="font-bold text-gray-900 text-xs">
                Brief History
              </TableHead>
              <TableHead className="font-bold text-gray-900 text-xs">
                Diagnosis
              </TableHead>
              <TableHead className="font-bold text-gray-900 text-xs">
                Physical Exam
              </TableHead>
              <TableHead className="font-bold text-gray-900 text-xs">
                Imaging
              </TableHead>
              <TableHead className="font-bold text-gray-900 text-xs">
                Lab Result
              </TableHead>
              <TableHead className="font-bold text-gray-900 text-xs">
                Incident
              </TableHead>
              <TableHead className="font-bold text-gray-900 text-xs">
                Medications
              </TableHead>
              <TableHead className="font-bold text-gray-900 text-xs">
                Plan
              </TableHead>
              <TableHead className="font-bold text-gray-900 text-xs">
                Round
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient, index) => (
              <TableRow key={patient.id} className="border-b border-gray-100">
                <TableCell className="font-semibold text-gray-700 text-sm">
                  {index + 1}
                </TableCell>
                <TableCell className="font-semibold text-gray-900 text-sm">
                  {patient.name || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 leading-relaxed">
                  {patient.brief_history || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 leading-relaxed">
                  {patient.diagnosis || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 leading-relaxed">
                  {patient.physical_examination || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 leading-relaxed">
                  {patient.imaging || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 leading-relaxed">
                  {patient.lab_result || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 leading-relaxed">
                  {patient.incident || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 leading-relaxed">
                  {patient.medications || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-700 leading-relaxed">
                  {patient.plan || "-"}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
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
            <span className="text-sm text-gray-600">
              Page{" "}
              <span className="font-bold text-gray-900">{currentPage}</span> of{" "}
              <span className="font-bold text-gray-900">{totalPages}</span>
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
      <div className="print-hide text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
        <p className="font-semibold text-gray-900 mb-1">📄 Print Tips:</p>
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
