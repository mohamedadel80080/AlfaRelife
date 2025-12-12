'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp, Calendar as CalendarIcon, Filter, X } from 'lucide-react'
import { DateRange } from 'react-day-picker'

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
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: dateFrom,
    to: dateTo
  })

  const formatDateRange = () => {
    if (!dateFrom && !dateTo) return 'Select date range'
    if (dateFrom && dateTo) {
      return `${format(dateFrom, 'yyyy-MM-dd')} → ${format(dateTo, 'yyyy-MM-dd')}`
    }
    if (dateFrom) return `From ${format(dateFrom, 'yyyy-MM-dd')}`
    if (dateTo) return `To ${format(dateTo, 'yyyy-MM-dd')}`
    return 'Select date range'
  }

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    
    // If both dates are selected, apply the filter and close modal
    if (range?.from && range?.to) {
      onDateChange(range.from, range.to)
      setIsCalendarOpen(false)
    } else if (range?.from) {
      // Only from date selected, keep modal open for to date
      onDateChange(range.from, undefined)
    }
  }

  const hasActiveFilters = dateFrom || dateTo || shiftsPerPage !== 10

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
      {/* Filter Header - Always Visible */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <p className="text-sm text-gray-600">Refine your shift search</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                {[dateFrom && 'Date', shiftsPerPage !== 10 && 'Per Page'].filter(Boolean).length} active
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-white/50"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Hide
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Show
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Collapsible Filter Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="p-6 space-y-6">
          {/* Items Per Page - Pill Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
            <div className="flex gap-2">
              {[10, 20, 50].map((value) => (
                <button
                  key={value}
                  onClick={() => onItemsPerPageChange(value)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                    shiftsPerPage === value
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal h-11 hover:bg-gray-50 border-gray-300"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{formatDateRange()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0 bg-white rounded-2xl shadow-2xl border-gray-200" 
                align="start"
                side="bottom"
                sideOffset={8}
              >
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-1">Select Date Range</h3>
                    <p className="text-sm text-gray-600">Choose start and end dates for your search</p>
                  </div>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={2}
                    defaultMonth={dateFrom || new Date()}
                    disabled={(date) => date < new Date("1900-01-01")}
                    className="rounded-xl border-0"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-blue-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-50 rounded-md transition-colors",
                      day_range_start: "day-range-start bg-blue-600 text-white hover:bg-blue-700",
                      day_range_end: "day-range-end bg-blue-600 text-white hover:bg-blue-700",
                      day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white",
                      day_today: "bg-gray-100 text-gray-900 font-semibold",
                      day_outside: "day-outside text-gray-400 opacity-50 aria-selected:bg-gray-100/50 aria-selected:text-gray-500 aria-selected:opacity-30",
                      day_disabled: "text-gray-400 opacity-50",
                      day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-blue-900",
                      day_hidden: "invisible",
                    }}
                  />
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDateRange(undefined)
                        onDateChange(undefined, undefined)
                        setIsCalendarOpen(false)
                      }}
                      className="flex-1"
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={() => setIsCalendarOpen(false)}
                      disabled={!dateRange?.from || !dateRange?.to}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button 
              variant="outline"
              onClick={() => {
                setDateRange(undefined)
                onClearFilters()
              }}
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          )}
        </div>
      </div>

      {/* Date Range Info - Always Visible */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          {dateFrom && dateTo ? (
            <>
              Showing results from <span className="font-semibold text-gray-900">{format(dateFrom, 'yyyy-MM-dd')}</span> to <span className="font-semibold text-gray-900">{format(dateTo, 'yyyy-MM-dd')}</span>
            </>
          ) : (
            'No date range selected - showing all shifts'
          )}
        </p>
      </div>
    </div>
  )
}