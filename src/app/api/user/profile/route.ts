import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET: Get current user profile
export async function GET() {
  try {
    console.log('🔄 API: Fetching user profile...')
    
    // For now, we'll return the first user as the current user
    // In a real app, you'd get the user ID from authentication session
    const professional = await db.healthcareProfessional.findFirst({
      include: {
        languages: true,
        skills: true,
        softwares: true
      }
    })

    console.log('📊 Database query result:', professional ? 'Found professional' : 'No professional found')

    if (!professional) {
      console.log('❌ No professional found in database')
      return NextResponse.json(
        { 
          success: false,
          error: 'No profile found. Please complete your registration first.' 
        },
        { status: 404 }
      )
    }

    // Transform data to match the expected format
    const transformedProfile = {
      id: professional.id,
      firstName: professional.firstName,
      lastName: professional.lastName,
      name: `${professional.firstName} ${professional.lastName}`,
      email: professional.email,
      phone: professional.phone,
      address: professional.address,
      city: professional.city,
      district: professional.districtId,
      postcode: professional.postcode,
      position: professional.position,
      licence: professional.licence,
      province: professional.province,
      licenceImage: professional.licenceImage,
      profileImage: professional.profileImage,
      lat: professional.lat,
      lng: professional.lng,
      businessName: professional.businessName,
      gst: professional.gst,
      businessType: professional.businessType,
      experience: professional.experience,
      fcmToken: professional.fcmToken,
      completed: professional.completed,
      hasBank: professional.hasBank,
      hasLanguages: professional.hasLanguages,
      hasSkills: professional.hasSkills,
      hasSoftwares: professional.hasSoftwares,
      status: professional.status,
      isVerified: professional.isVerified,
      phoneVerified: professional.phoneVerified,
      created_at: professional.createdAt,
      updated_at: professional.updatedAt,
      languages: professional.languages.map(lang => lang.name),
      skills: professional.skills.map(skill => skill.name),
      softwares: professional.softwares.map(software => software.name)
    }

    console.log('✅ API: Profile data prepared successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Profile loaded successfully',
      data: transformedProfile
    })

  } catch (error) {
    console.error('💥 API Error in GET /api/user/profile:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error while fetching profile' 
      },
      { status: 500 }
    )
  }
}

// PATCH: Update profile
export async function PATCH(request: NextRequest) {
  try {
    console.log('🔄 API: Updating user profile...')
    
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      postcode,
      position,
      licence,
      province,
      gst,
      businessName,
      businessType,
      experience
    } = body

    // For now, we'll update the first user as the current user
    // In a real app, you'd get the user ID from authentication session
    const existingProfessional = await db.healthcareProfessional.findFirst()

    if (!existingProfessional) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found' 
        },
        { status: 404 }
      )
    }

    // Check if email is already taken by another user
    if (email && email !== existingProfessional.email) {
      const emailExists = await db.healthcareProfessional.findFirst({
        where: {
          email,
          id: { not: existingProfessional.id }
        }
      })

      if (emailExists) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Email is already taken' 
          },
          { status: 409 }
        )
      }
    }

    // Check if phone is already taken by another user
    if (phone && phone !== existingProfessional.phone) {
      const phoneExists = await db.healthcareProfessional.findFirst({
        where: {
          phone,
          id: { not: existingProfessional.id }
        }
      })

      if (phoneExists) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Phone number is already taken' 
          },
          { status: 409 }
        )
      }
    }

    // Update profile
    const updatedProfessional = await db.healthcareProfessional.update({
      where: { id: existingProfessional.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(postcode && { postcode }),
        ...(position && { position }),
        ...(licence && { licence }),
        ...(province && { province }),
        ...(gst !== undefined && { gst }),
        ...(businessName !== undefined && { businessName }),
        ...(businessType !== undefined && { businessType }),
        ...(experience !== undefined && { experience }),
        updatedAt: new Date()
      }
    })

    // Transform data to match the expected format
    const transformedProfile = {
      id: updatedProfessional.id,
      firstName: updatedProfessional.firstName,
      lastName: updatedProfessional.lastName,
      name: `${updatedProfessional.firstName} ${updatedProfessional.lastName}`,
      email: updatedProfessional.email,
      phone: updatedProfessional.phone,
      address: updatedProfessional.address,
      city: updatedProfessional.city,
      district: updatedProfessional.districtId,
      postcode: updatedProfessional.postcode,
      position: updatedProfessional.position,
      licence: updatedProfessional.licence,
      province: updatedProfessional.province,
      licenceImage: updatedProfessional.licenceImage,
      profileImage: updatedProfessional.profileImage,
      lat: updatedProfessional.lat,
      lng: updatedProfessional.lng,
      businessName: updatedProfessional.businessName,
      gst: updatedProfessional.gst,
      businessType: updatedProfessional.businessType,
      experience: updatedProfessional.experience,
      fcmToken: updatedProfessional.fcmToken,
      completed: updatedProfessional.completed,
      hasBank: updatedProfessional.hasBank,
      hasLanguages: updatedProfessional.hasLanguages,
      hasSkills: updatedProfessional.hasSkills,
      hasSoftwares: updatedProfessional.hasSoftwares,
      status: updatedProfessional.status,
      isVerified: updatedProfessional.isVerified,
      phoneVerified: updatedProfessional.phoneVerified,
      created_at: updatedProfessional.createdAt,
      updated_at: updatedProfessional.updatedAt
    }

    console.log('✅ API: Profile updated successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: transformedProfile
    })

  } catch (error) {
    console.error('💥 API Error in PATCH /api/user/profile:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error while updating profile' 
      },
      { status: 500 }
    )
  }
}