import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shiftId = params.id

    // Mock API response for a single shift
    const mockShift = {
      id: parseInt(shiftId),
      date: "29-07-2026",
      from: "19:12",
      to: "23:12",
      hours: 4,
      address: "10903 103 Avenue Northwest, Edmonton, Alberta, Canada",
      lat: "53.544489",
      lng: "-113.5090085",
      city: "Edmonton",
      district_id: 4,
      district: {
        id: 4,
        name: "Alberta",
        tax: 5,
        created_at: "2023-06-12T20:18:44.000000Z",
        updated_at: "2023-06-12T20:18:44.000000Z"
      },
      pharmacy_id: 7,
      pharmacy: {
        id: 7,
        title: "HHHH",
        content: null,
        email: "s@d.com",
        phone: "5678909999",
        lat: "53.544489",
        lng: "-113.5090085",
        address: "10903 103 Avenue Northwest, Edmonton, Alberta, Canada",
        logo: "https://pharmacy.nour-projects.tech/images/jxqXu3wdcmi2dEAxNoPR.png",
        cover: "https://pharmacy.nour-projects.tech/images/GQ8sQzLM2SV9LR1AXSXH.png",
        district_id: 4,
        city: "Edmonton",
        status: 0,
        email_verified_at: null,
        client_id: "notConnected",
        created_at: "2023-07-11T17:41:49.000000Z",
        updated_at: "2024-07-24T00:53:35.000000Z",
        stripe_id: null
      },
      hour_rate: 55,
      mileage: 0,
      house: 0,
      earning: 220,
      profit: 55,
      tax: 11,
      assistant: 0,
      rxcount: 0,
      tech: 0,
      overlab: 0,
      total: 286,
      created_at: "2023-07-11T18:12:23.000000Z",
      comments: null,
      applied: false,
      applied_at: null,
      applied_msg: "Assigned By The Admin",
      distance: 0,
      languages: [
        { id: 1, title: "English", selected: false },
        { id: 2, title: "French", selected: false },
        { id: 3, title: "Hindi", selected: false },
        { id: 4, title: "Pakistani", selected: false }
      ],
      skills: [
        { id: 4, title: "Blister pack", selected: false },
        { id: 5, title: "Additional Prescribing Authorization", selected: false },
        { id: 6, title: "Cash Trained", selected: false },
        { id: 7, title: "Diabetes Education", selected: false },
        { id: 8, title: "Injection Certified", selected: false },
        { id: 9, title: "Medication Review", selected: false },
        { id: 10, title: "Methadone/Suboxone", selected: false },
        { id: 11, title: "Minor Ailment Prescribing", selected: false },
        { id: 12, title: "Smoking Cessation", selected: false },
        { id: 13, title: "Travel Health Education", selected: false }
      ],
      softwares: [
        { id: 1, title: "Kroll", selected: false },
        { id: 2, title: "Propel", selected: false },
        { id: 3, title: "HealthWatch", selected: false }
      ],
      faved: false,
      addres: {
        id: 11,
        title: "ABCDEFG",
        phone: "4564564564",
        lat: "53.544489",
        lng: "-113.5090085",
        address: "10903 103 Avenue Northwest, Edmonton, Alberta, Canada",
        city: "Edmonton",
        postcode: "T6X 2C6",
        district_id: 4,
        pharmacy_id: 7,
        created_at: "2023-07-11T17:41:49.000000Z",
        updated_at: "2023-07-11T17:41:49.000000Z"
      }
    }

    return NextResponse.json({
      success: true,
      data: mockShift
    })

  } catch (error) {
    console.error('Error fetching shift:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
