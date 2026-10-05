import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export interface ReportExportColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

interface ExportReportOptions<T> {
  title: string;
  fileName: string;
  columns: ReportExportColumn<T>[];
  rows: T[];
  summary?: {
    label: string;
    value: string | number;
  }[];
}

function safeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/[<>:"/\\|?*]+/g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export function exportReportToPDF<T>({
  title,
  fileName,
  columns,
  rows,
  summary = [],
}: ExportReportOptions<T>) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  doc.setFontSize(18);
  doc.text(title, 14, 16);

  doc.setFontSize(9);
  doc.setTextColor(100);

  doc.text(
    `Generated: ${new Date().toLocaleString("en-PK")}`,
    14,
    23
  );

  let tableStartY = 30;

  if (summary.length > 0) {
    doc.setFontSize(10);
    doc.setTextColor(30);

    summary.forEach((item, index) => {
      const column = index % 4;
      const row = Math.floor(index / 4);

      const x = 14 + column * 68;
      const y = 31 + row * 8;

      doc.text(
        `${item.label}: ${String(item.value)}`,
        x,
        y
      );
    });

    tableStartY =
      38 +
      Math.max(
        0,
        Math.ceil(summary.length / 4) - 1
      ) *
        8;
  }

  autoTable(doc, {
    startY: tableStartY,

    head: [
      columns.map((column) => column.header),
    ],

    body: rows.map((row) =>
      columns.map((column) =>
        String(column.value(row) ?? "")
      )
    ),

    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      overflow: "linebreak",
    },

    headStyles: {
      fontStyle: "bold",
    },

    margin: {
      left: 14,
      right: 14,
    },

    didDrawPage: (data) => {
      const pageCount =
        doc.getNumberOfPages();

      doc.setFontSize(8);
      doc.setTextColor(120);

      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 14,
        doc.internal.pageSize.getHeight() - 7,
        {
          align: "right",
        }
      );
    },
  });

  doc.save(`${safeFileName(fileName)}.pdf`);
}

export function exportReportToExcel<T>({
  title,
  fileName,
  columns,
  rows,
  summary = [],
}: ExportReportOptions<T>) {
  const workbook = XLSX.utils.book_new();

  const reportData = rows.map((row) => {
    const record: Record<
      string,
      string | number
    > = {};

    columns.forEach((column) => {
      record[column.header] =
        column.value(row);
    });

    return record;
  });

  const reportSheet =
    XLSX.utils.json_to_sheet(reportData);

  const columnWidths = columns.map(
    (column) => ({
      wch: Math.max(
        15,
        column.header.length + 3
      ),
    })
  );

  reportSheet["!cols"] = columnWidths;

  XLSX.utils.book_append_sheet(
    workbook,
    reportSheet,
    "Report"
  );

  if (summary.length > 0) {
    const summaryData = [
      ["Report", title],
      [
        "Generated",
        new Date().toLocaleString("en-PK"),
      ],
      [],
      ["Summary", "Value"],
      ...summary.map((item) => [
        item.label,
        item.value,
      ]),
    ];

    const summarySheet =
      XLSX.utils.aoa_to_sheet(summaryData);

    summarySheet["!cols"] = [
      { wch: 25 },
      { wch: 30 },
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      summarySheet,
      "Summary"
    );
  }

  XLSX.writeFile(
    workbook,
    `${safeFileName(fileName)}.xlsx`
  );
}