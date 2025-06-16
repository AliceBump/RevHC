import { useState, useMemo } from "react";
import type { Concern } from "@/components/home-dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

interface Patient {
  id: number;
  name: string;
  concerns: Concern[];
}

const patients: Patient[] = [
  {
    id: 1,
    name: "John Doe",
    concerns: [
      { id: 1, title: "Cough", diagnosis: "Flu", date: "2024-06-01" },
      { id: 2, title: "Headache", diagnosis: "Migraine", date: "2024-06-03" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    concerns: [
      { id: 3, title: "Stomach Pain", diagnosis: "Indigestion", date: "2024-05-28" },
      { id: 4, title: "Back Pain", diagnosis: "Strain", date: "2024-06-02" },
    ],
  },
];

interface RowData extends Concern {
  patient: string;
}

export default function DoctorPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [patientFilter, setPatientFilter] = useState("all");

  const data = useMemo<RowData[]>(() => {
    return patients.flatMap((p) =>
      p.concerns.map((c) => ({ ...c, patient: p.name }))
    );
  }, []);

  const patientsList = useMemo(() => patients.map((p) => p.name), []);

  const columns = useMemo<ColumnDef<RowData>[]>(
    () => [
      {
        accessorKey: "patient",
        header: () => "Patient",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "title",
        header: () => "Concern",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "diagnosis",
        header: () => "Diagnosis",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "date",
        header: () => "Date",
        cell: (info) => info.getValue(),
      },
      {
        id: "actions",
        header: () => "",
        cell: () => (
          <Button variant="outline" size="sm" onClick={() => alert("View")}>View</Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters: [
        {
          id: "patient",
          value: patientFilter,
        },
      ],
    },
    globalFilterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId)).toLowerCase().includes(String(filterValue).toLowerCase());
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2 items-end">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={patientFilter}
          onChange={(e) => setPatientFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        >
          <option value="all">All patients</option>
          {patientsList.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setGlobalFilter("");
            setPatientFilter("all");
            table.resetSorting();
          }}
        >
          Clear
        </Button>
      </div>
      <table className="min-w-full border text-sm">
        <thead className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer px-2 py-1 text-left"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "asc" && " ↑"}
                  {header.column.getIsSorted() === "desc" && " ↓"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
