"use client"

import { ColumnDef } from "@tanstack/react-table"
import { OrgTrial } from "@/app/service/orgTrials"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<OrgTrial>[] = [
  {
    accessorKey: "shared_trial_id",
    header: "Trial ID",
    enableColumnFilter: true,
  },
  {
    accessorKey: "custom_description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "risk_factor",
    header: "Risk Factor",
    enableColumnFilter: true,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    enableColumnFilter: true,
  },
  {
    accessorKey: "outcome",
    header: "Outcome",
    enableColumnFilter: true,
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("start_date"))
      return date.toLocaleDateString()
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("end_date"))
      return date.toLocaleDateString()
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "trial_status",
    header: "Status",
    cell: ({ row }) => {
      return row.getValue("trial_status") ? "Active" : "Inactive"
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "state",
    header: "State",
    filterFn: "equals",
  },
  {
    accessorKey: "courthouse",
    header: "Courthouse",
    filterFn: "equals",
  },
  {
    accessorKey: "customer",
    header: "Customer",
    filterFn: "equals",
  },
  {
    accessorKey: "corporation",
    header: "Corporation",
    filterFn: "equals",
  },
]