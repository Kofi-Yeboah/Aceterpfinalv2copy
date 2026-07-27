// ──────────────────────────────────────────────────────────────────────────────
// Report export.
//
// "Reports exportable to Excel, PDF" appears throughout the requirements, and
// every export button in the app was previously inert. These implementations
// use only browser primitives so no new dependency is needed: CSV and
// SpreadsheetML for Excel, and a print-to-PDF window for PDF.
// ──────────────────────────────────────────────────────────────────────────────

export interface ExportColumn<T = Record<string, unknown>> {
  /** Key into the row object. */
  key: keyof T & string;
  header: string;
  /** Optional formatter; falls back to String(value). */
  format?: (value: unknown, row: T) => string;
}

function cellValue<T extends Record<string, unknown>>(row: T, col: ExportColumn<T>): string {
  const raw = row[col.key];
  if (col.format) return col.format(raw, row);
  if (raw === null || raw === undefined) return "";
  if (Array.isArray(raw)) return raw.join("; ");
  if (typeof raw === "object") return JSON.stringify(raw);
  return String(raw);
}

function timestampSuffix(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function safeFilename(name: string): string {
  return name.replace(/[^a-z0-9-_]+/gi, "_").replace(/_+/g, "_");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick so the download has taken the handle.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── CSV ─────────────────────────────────────────────────────────────────────

export function exportToCSV<T extends Record<string, unknown>>(
  title: string,
  columns: ExportColumn<T>[],
  rows: T[]
) {
  const escapeCsv = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [
    columns.map((c) => escapeCsv(c.header)).join(","),
    ...rows.map((row) => columns.map((c) => escapeCsv(cellValue(row, c))).join(",")),
  ];
  // The BOM keeps Excel from mangling non-ASCII names on open.
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${safeFilename(title)}_${timestampSuffix()}.csv`);
}

// ── Excel ───────────────────────────────────────────────────────────────────

/**
 * Writes a SpreadsheetML workbook (.xls). Excel, LibreOffice and Numbers all
 * open it natively, and unlike CSV it keeps the header styling and column
 * widths, and will not reinterpret reference numbers as dates.
 */
export function exportToExcel<T extends Record<string, unknown>>(
  title: string,
  columns: ExportColumn<T>[],
  rows: T[],
  meta?: { subtitle?: string; generatedBy?: string }
) {
  const headerRow = columns
    .map((c) => `<Cell ss:StyleID="hdr"><Data ss:Type="String">${escapeHtml(c.header)}</Data></Cell>`)
    .join("");

  const bodyRows = rows
    .map((row) => {
      const cells = columns
        .map((c) => {
          const value = cellValue(row, c);
          const raw = row[c.key];
          const isNumber = typeof raw === "number" && Number.isFinite(raw) && !c.format;
          return isNumber
            ? `<Cell><Data ss:Type="Number">${raw}</Data></Cell>`
            : `<Cell><Data ss:Type="String">${escapeHtml(value)}</Data></Cell>`;
        })
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("");

  const metaRows = [
    `<Row><Cell ss:StyleID="title"><Data ss:Type="String">${escapeHtml(title)}</Data></Cell></Row>`,
    meta?.subtitle
      ? `<Row><Cell ss:StyleID="meta"><Data ss:Type="String">${escapeHtml(meta.subtitle)}</Data></Cell></Row>`
      : "",
    `<Row><Cell ss:StyleID="meta"><Data ss:Type="String">Generated ${new Date().toLocaleString()}${
      meta?.generatedBy ? ` by ${escapeHtml(meta.generatedBy)}` : ""
    }</Data></Cell></Row>`,
    `<Row></Row>`,
  ].join("");

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="title"><Font ss:Bold="1" ss:Size="14"/></Style>
  <Style ss:ID="meta"><Font ss:Italic="1" ss:Size="9" ss:Color="#666666"/></Style>
  <Style ss:ID="hdr">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1F4E79" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeHtml(title.slice(0, 28) || "Report")}">
  <Table>
   ${columns.map(() => `<Column ss:AutoFitWidth="1" ss:Width="130"/>`).join("")}
   ${metaRows}
   <Row>${headerRow}</Row>
   ${bodyRows}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" });
  triggerDownload(blob, `${safeFilename(title)}_${timestampSuffix()}.xls`);
}

// ── PDF ─────────────────────────────────────────────────────────────────────

/**
 * Renders the table into a hidden iframe and opens the print dialog, where the
 * user chooses "Save as PDF". This is the dependency-free route to a PDF that
 * still respects the browser's own pagination and margins.
 */
export function exportToPDF<T extends Record<string, unknown>>(
  title: string,
  columns: ExportColumn<T>[],
  rows: T[],
  meta?: { subtitle?: string; generatedBy?: string; orientation?: "portrait" | "landscape" }
) {
  const orientation = meta?.orientation ?? (columns.length > 6 ? "landscape" : "portrait");

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4 ${orientation}; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111; margin: 0; }
  h1 { font-size: 17px; margin: 0 0 2px; }
  .sub { font-size: 11px; color: #555; margin: 0 0 2px; }
  .meta { font-size: 10px; color: #777; margin: 0 0 14px; }
  table { width: 100%; border-collapse: collapse; font-size: 10px; }
  thead { display: table-header-group; }
  th { background: #1F4E79; color: #fff; text-align: left; padding: 6px 7px; font-weight: 600; }
  td { padding: 5px 7px; border-bottom: 1px solid #e2e2e2; vertical-align: top; }
  tr { page-break-inside: avoid; }
  tbody tr:nth-child(even) { background: #f6f8fa; }
  .empty { padding: 24px; text-align: center; color: #777; font-size: 12px; }
  footer { margin-top: 14px; font-size: 9px; color: #888; border-top: 1px solid #ddd; padding-top: 6px; }
</style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${meta?.subtitle ? `<p class="sub">${escapeHtml(meta.subtitle)}</p>` : ""}
  <p class="meta">Generated ${new Date().toLocaleString()}${
    meta?.generatedBy ? ` by ${escapeHtml(meta.generatedBy)}` : ""
  } &middot; ${rows.length} record${rows.length === 1 ? "" : "s"}</p>
  ${
    rows.length === 0
      ? `<p class="empty">No records match the current filters.</p>`
      : `<table>
    <thead><tr>${columns.map((c) => `<th>${escapeHtml(c.header)}</th>`).join("")}</tr></thead>
    <tbody>
      ${rows
        .map(
          (row) =>
            `<tr>${columns.map((c) => `<td>${escapeHtml(cellValue(row, c))}</td>`).join("")}</tr>`
        )
        .join("")}
    </tbody>
  </table>`
  }
  <footer>ACET ERP &mdash; Procurement Module. This report reflects system data at the time of generation.</footer>
</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    iframe.remove();
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();

  // Give the iframe a beat to lay out before printing, then tear it down.
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => iframe.remove(), 1500);
  }, 250);
}

// ── Print an arbitrary document (certificates, closure reports) ─────────────

export function printDocument(title: string, bodyHtml: string) {
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  @page { size: A4 portrait; margin: 18mm; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 12px; line-height: 1.55; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2 { font-size: 14px; margin: 18px 0 6px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 11px; }
  th, td { text-align: left; padding: 5px 7px; border-bottom: 1px solid #e2e2e2; }
  th { background: #f0f3f6; font-weight: 600; }
  .muted { color: #666; }
</style></head><body>${bodyHtml}</body></html>`;

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (!doc) {
    iframe.remove();
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => iframe.remove(), 1500);
  }, 250);
}
