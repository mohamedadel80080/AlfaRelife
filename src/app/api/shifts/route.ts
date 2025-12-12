import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock API response for pharmacy shifts
    const mockShifts = [
      {
        id: 32,
        date: "29-07-2026",
        from: "19:12",
        to: "23:12",
        hours: 4,
        address: "10903 103 Avenue Northwest",
        pharmacy_id: 7,
        pharmacy_name: "ABC Pharmacy",
        pharmacy_phone: "780-555-0123",
        pharmacy_city: "Edmonton",
        pharmacy_province: "Alberta",
        pharmacy_postcode: "T6X 2C6",
        hour_rate: 55,
        total: 286,
        applied: false,
        applied_at: null,
        applied_msg: null,
        addres: {
          id: 11,
          title: "ABCDEFG",
          phone: "4564564564",
          city: "Edmonton",
          postcode: "T6X 2C6"
        }
      },
      {
        id: 33,
        date: "30-07-2026",
        from: "08:00",
        to: "16:00",
        hours: 8,
        address: "10204 102 Street NE",
        pharmacy_id: 8,
        pharmacy_name: "XYZ Pharmacy",
        pharmacy_phone: "780-555-0456",
        pharmacy_city: "Calgary",
        pharmacy_province: "Alberta",
        pharmacy_postcode: "T2N 0V1",
        hour_rate: 60,
        total: 480,
        applied: true,
        applied_at: "2026-07-15T10:30:00Z",
        applied_msg: "Application sent successfully",
        addres: {
          id: 12,
          title: "HIJKLMN",
          phone: "403-555-0789",
          city: "Calgary",
          postcode: "T2N 0V1"
        }
      }
    ]

    return NextResponse.json({
      success: true,
      data: mockShifts
    })

  } catch (error) {
    console.error('Error fetching shifts:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}