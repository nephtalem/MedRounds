import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Round, Patient } from "@/types";

/**
 * Export patients to Excel format
 */
export function exportPatientsToExcel(
  patients: Patient[],
  roundName: string,
  fileName?: string
) {
  // Prepare data for Excel
  const data = patients.map((patient, index) => ({
    "#": index + 1,
    "Patient Name": patient.name,
    "Brief History": patient.brief_history || "",
    Diagnosis: patient.diagnosis || "",
    "Physical Examination": patient.physical_examination || "",
    Imaging: patient.imaging || "",
    "Lab Results": patient.lab_result || "",
    Incident: patient.incident || "",
    Medications: patient.medications || "",
    Plan: patient.plan || "",
    Round: patient.round || "",
  }));

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // Set column widths
  ws["!cols"] = [
    { wch: 5 }, // #
    { wch: 20 }, // Patient Name
    { wch: 30 }, // Brief History
    { wch: 25 }, // Diagnosis
    { wch: 30 }, // Physical Examination
    { wch: 25 }, // Imaging
    { wch: 25 }, // Lab Results
    { wch: 25 }, // Incident
    { wch: 30 }, // Medications
    { wch: 30 }, // Plan
    { wch: 15 }, // Round
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Patients");

  // Generate file name
  const defaultFileName = `${roundName}_patients_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;

  // Download file
  XLSX.writeFile(wb, fileName || defaultFileName);
}

/**
 * Export patients to PDF format
 */
export function exportPatientsToPDF(
  patients: Patient[],
  roundName: string,
  roundDate: string,
  printHeader?: string,
  printSubheader?: string,
  doctorName?: string,
  fileName?: string
) {
  // Create new PDF document in landscape mode
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  let startY = 15;

  // Add custom header (or default)
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(printHeader || "Patient Round Report", 148, startY, {
    align: "center",
  });
  startY += 6;

  // Add subheader if provided
  if (printSubheader) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(printSubheader, 148, startY, { align: "center" });
    startY += 6;
  }

  // Add doctor name if provided
  if (doctorName) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Dr. ${doctorName}`, 148, startY, { align: "center" });
    startY += 6;
  }

  // Add round info
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Date: ${roundDate} | Round: ${roundName} | Total Patients: ${patients.length}`,
    148,
    startY,
    { align: "center" }
  );
  startY += 2;

  // Add separator line
  doc.setLineWidth(0.5);
  doc.line(10, startY, 287, startY);
  startY += 5;

  // Prepare table data with ALL columns
  const tableData = patients.map((patient, index) => [
    index + 1,
    patient.name,
    patient.brief_history || "-",
    patient.diagnosis || "-",
    patient.physical_examination || "-",
    patient.imaging || "-",
    patient.lab_result || "-",
    patient.incident || "-",
    patient.medications || "-",
    patient.plan || "-",
    patient.round || "-",
  ]);

  // Add table
  autoTable(doc, {
    startY: startY,
    head: [
      [
        "#",
        "Patient Name",
        "Brief History",
        "Diagnosis",
        "Physical Exam",
        "Imaging",
        "Lab Results",
        "Incident",
        "Medications",
        "Plan",
        "Round",
      ],
    ],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 8 }, // #
      1: { cellWidth: 25 }, // Patient Name
      2: { cellWidth: 30 }, // Brief History
      3: { cellWidth: 25 }, // Diagnosis
      4: { cellWidth: 30 }, // Physical Exam
      5: { cellWidth: 25 }, // Imaging
      6: { cellWidth: 25 }, // Lab Results
      7: { cellWidth: 20 }, // Incident
      8: { cellWidth: 30 }, // Medications
      9: { cellWidth: 30 }, // Plan
      10: { cellWidth: 17 }, // Round
    },
    styles: {
      overflow: "linebreak",
      cellPadding: 1.5,
      fontSize: 7,
      valign: "top",
    },
    margin: { top: 40, left: 5, right: 5 },
  });

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${pageCount}`,
      148,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Generate file name
  const defaultFileName = `${roundName}_patients_${
    new Date().toISOString().split("T")[0]
  }.pdf`;

  // Save PDF
  doc.save(fileName || defaultFileName);
}

/**
 * Export patients to CSV format
 */
export function exportPatientsToCSV(
  patients: Patient[],
  roundName: string,
  fileName?: string
) {
  // Prepare CSV headers
  const headers = [
    "#",
    "Patient Name",
    "Brief History",
    "Diagnosis",
    "Physical Examination",
    "Imaging",
    "Lab Results",
    "Incident",
    "Medications",
    "Plan",
    "Round",
  ];

  // Prepare CSV rows
  const rows = patients.map((patient, index) => [
    index + 1,
    patient.name,
    patient.brief_history || "",
    patient.diagnosis || "",
    patient.physical_examination || "",
    patient.imaging || "",
    patient.lab_result || "",
    patient.incident || "",
    patient.medications || "",
    patient.plan || "",
    patient.round || "",
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma/newline
          const cellStr = String(cell).replace(/"/g, '""');
          return cellStr.includes(",") || cellStr.includes("\n")
            ? `"${cellStr}"`
            : cellStr;
        })
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  const defaultFileName = `${roundName}_patients_${
    new Date().toISOString().split("T")[0]
  }.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", fileName || defaultFileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export rounds to Excel format
 */
export function exportRoundsToExcel(
  rounds: (Round & { patient_count?: number })[],
  fileName?: string
) {
  // Prepare data for Excel
  const data = rounds.map((round, index) => ({
    "#": index + 1,
    Date: new Date(round.date).toLocaleDateString(),
    "Round Number": round.round_number || "N/A",
    Status: round.status,
    "Total Patients": round.patient_count || 0,
    "Created At": new Date(round.created_at).toLocaleString(),
  }));

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // Set column widths
  ws["!cols"] = [
    { wch: 5 }, // #
    { wch: 15 }, // Date
    { wch: 20 }, // Round Number
    { wch: 12 }, // Status
    { wch: 15 }, // Total Patients
    { wch: 20 }, // Created At
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Rounds");

  // Generate file name
  const defaultFileName = `rounds_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;

  // Download file
  XLSX.writeFile(wb, fileName || defaultFileName);
}

/**
 * Export rounds to CSV format
 */
export function exportRoundsToCSV(
  rounds: (Round & { patient_count?: number })[],
  fileName?: string
) {
  // Prepare CSV headers
  const headers = [
    "#",
    "Date",
    "Round Number",
    "Status",
    "Total Patients",
    "Created At",
  ];

  // Prepare CSV rows
  const rows = rounds.map((round, index) => [
    index + 1,
    new Date(round.date).toLocaleDateString(),
    round.round_number || "N/A",
    round.status,
    round.patient_count || 0,
    new Date(round.created_at).toLocaleString(),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const cellStr = String(cell).replace(/"/g, '""');
          return cellStr.includes(",") || cellStr.includes("\n")
            ? `"${cellStr}"`
            : cellStr;
        })
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  const defaultFileName = `rounds_${
    new Date().toISOString().split("T")[0]
  }.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", fileName || defaultFileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
