'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

interface FilterBarProps {
  shiftsPerPage: number
  onItemsPerPageChange: (value: number) => void
  dateFrom: Date | undefined
  dateTo: Date | undefined
  onDateChange: (from: Date | undefined, to: Date | undefined) => void
  onClearFilters: () => void
}

export function FilterBar({
  shiftsPerPage,
  onItemsPerPageChange,
  dateFrom,
  dateTo,
  onDateChange,
  onClearFilters
}: FilterBarProps) {
  const [tempDateFrom, setTempDateFrom] = useState<Date | undefined>(dateFrom)
  const [tempDateTo, setTempDateTo] = useState<Date | undefined>(dateTo)

  const handleDateSelect = (from: Date | undefined, to: Date | undefined) => {
    setTempDateFrom(from)
    setTempDateTo(to)
    onDateChange(from, to)
  }

  const formatDateRange = () => {
    if (!dateFrom && !dateTo) return 'Select date range'
    if (dateFrom && dateTo) {
      return `${format(dateFrom, 'dd-MM-yyyy')} to ${format(dateTo, 'dd-MM-yyyy')}`
    }
    if (dateFrom) return `From ${format(dateFrom, 'dd-MM-yyyy')}`
    if (dateTo) return `To ${format(dateTo, 'dd-MM-yyyy')}`
    return 'Select date range'
  }

  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left side - Items per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Show</span>
          <Select 
            value={shiftsPerPage.toString()} 
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700">per page</span>
        </div>

        {/* Center - Date range picker */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left font-normal"
              onClick={() => {
                // For now, we'll just set a default range
                const fromDate = new Date()
                const toDate = new Date()
                toDate.setDate(toDate.getDate() + 2)
                handleDateSelect(fromDate, toDate)
              }}
            >
              {formatDateRange()}
            </Button>
          </div>
        </div>

        {/* Right side - Clear filters */}
        <Button 
          variant="outline" 
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {/* Date range info */}
      <div className="mt-4 text-sm text-gray-600">
        Showing results from {dateFrom ? format(dateFrom, 'dd-MM-yyyy') : '...'} to {dateTo ? format(dateTo, 'dd-MM-yyyy') : '...'}
      </div>
    </div>
  )
}