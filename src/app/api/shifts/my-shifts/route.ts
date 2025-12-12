import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'

    // Mock data for different shift statuses
    const allShifts = [
      {
        id: 1,
        date: "15-12-2025",
        from: "08:00",
        to: "16:00",
        hours: 8,
        pharmacy_name: "HealthCare Pharmacy",
        pharmacy_address: "123 Main Street, Edmonton",
        city: "Edmonton",
        district: "Alberta",
        total: 480,
        earning: 400,
        status: "assigned"
      },
      {
        id: 2,
        date: "16-12-2025",
        from: "09:00",
        to: "17:00",
        hours: 8,
        pharmacy_name: "Wellness Pharmacy",
        pharmacy_address: "456 Oak Avenue, Calgary",
        city: "Calgary",
        district: "Alberta",
        total: 520,
        earning: 440,
        status: "assigned"
      },
      {
        id: 3,
        date: "20-12-2025",
        from: "10:00",
        to: "18:00",
        hours: 8,
        pharmacy_name: "MediCare Center",
        pharmacy_address: "789 Pine Road, Toronto",
        city: "Toronto",
        district: "Ontario",
        total: 500,
        earning: 420,
        status: "upcoming"
      },
      {
        id: 4,
        date: "22-12-2025",
        from: "07:00",
        to: "15:00",
        hours: 8,
        pharmacy_name: "City Pharmacy",
        pharmacy_address: "321 Maple Street, Vancouver",
        city: "Vancouver",
        district: "British Columbia",
        total: 490,
        earning: 410,
        status: "upcoming"
      },
      {
        id: 5,
        date: "25-12-2025",
        from: "12:00",
        to: "20:00",
        hours: 8,
        pharmacy_name: "Quick Care Pharmacy",
        pharmacy_address: "654 Birch Lane, Montreal",
        city: "Montreal",
        district: "Quebec",
        total: 510,
        earning: 430,
        status: "upcoming"
      },
      {
        id: 6,
        date: "10-12-2025",
        from: "08:00",
        to: "16:00",
        hours: 8,
        pharmacy_name: "Sunrise Pharmacy",
        pharmacy_address: "987 Cedar Drive, Ottawa",
        city: "Ottawa",
        district: "Ontario",
        total: 470,
        earning: 390,
        status: "cancel"
      },
      {
        id: 7,
        date: "11-12-2025",
        from: "13:00",
        to: "21:00",
        hours: 8,
        pharmacy_name: "Downtown Pharmacy",
        pharmacy_address: "147 Elm Street, Winnipeg",
        city: "Winnipeg",
        district: "Manitoba",
        total: 460,
        earning: 380,
        status: "cancel"
      }
    ]

    // Filter shifts based on status
    let filteredShifts = allShifts
    if (status !== 'all') {
      filteredShifts = allShifts.filter(shift => shift.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredShifts,
      count: filteredShifts.length
    })

  } catch (error) {
    console.error('Error fetching shifts by status:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
