"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Trial } from "@/types/createTrial"

export const columns: ColumnDef<Trial>[] = [
  {
    accessorKey: "name",
    header: "Trial Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
]