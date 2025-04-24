import Flat from "@/models/Flat";
import Message from "@/models/Message";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

type MonthlyRegistration = {
  total: number;
  buyers: number;
  owners: number;
};

export async function GET() {
  try {
    // Get existing data
    const flats = await Flat.find({}).populate("owner").populate("location");
    const users = await User.countDocuments({});
    const buyers = await User.countDocuments({ role: "buyer" });
    const owners = await User.countDocuments({ role: "owner" });
    const listings = await Flat.countDocuments({});
    const feedback = await Message.countDocuments({});
    
    // Get additional data for enhanced dashboard
    let recentBookings = [];
    let recentNotifications = [];

    try {
      recentBookings = await Booking.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user")
        .populate({
          path: "property",
          populate: {
            path: "location",
          },
        });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    
    try {
      recentNotifications = await Notification.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .populate({
          path: "property",
          model: "Flat"
        });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    
    // Get user registration data by month
    const allUsers = await User.find({}, { createdAt: 1, role: 1, isAdminApproved: 1 });
    
    // User registration by month
    const userRegistrationByMonth = allUsers.reduce((acc: Record<string, MonthlyRegistration>, user) => {
      const date = new Date(user.createdAt);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!acc[monthYear]) {
        acc[monthYear] = { total: 0, buyers: 0, owners: 0 };
      }
      
      acc[monthYear].total += 1;
      if (user.role === 'buyer') acc[monthYear].buyers += 1;
      if (user.role === 'owner') acc[monthYear].owners += 1;
      
      return acc;
    }, {});
    
    // User approval status
    const approvalStatus = {
      approved: allUsers.filter(user => user.isAdminApproved).length,
      pending: allUsers.filter(user => !user.isAdminApproved).length
    };
    
    // Collect amenities data
    const amenitiesDistribution = flats.reduce((acc: Record<string, number>, flat) => {
      if (flat.amenities && flat.amenities.length) {
        flat.amenities.forEach((amenity: string) => {
          if (!acc[amenity]) acc[amenity] = 0;
          acc[amenity] += 1;
        });
      }
      return acc;
    }, {});
    
    // Get price range distribution
    const priceRanges = {
      'Under 5000': 0,
      '5000-10000': 0,
      '10000-20000': 0,
      '20000-50000': 0,
      'Above 50000': 0
    };
    
    flats.forEach(flat => {
      const price = flat.price;
      if (price < 5000) priceRanges['Under 5000']++;
      else if (price < 10000) priceRanges['5000-10000']++;
      else if (price < 20000) priceRanges['10000-20000']++;
      else if (price < 50000) priceRanges['20000-50000']++;
      else priceRanges['Above 50000']++;
    });
    
    // Get bhk distribution
    const bhkDistribution = flats.reduce((acc: Record<string, number>, flat) => {
      const bhk = flat.bhks;
      if (!acc[bhk]) acc[bhk] = 0;
      acc[bhk] += 1;
      return acc;
    }, {});
    
    // Format monthly registration data for return
    const monthlyRegistrationData = Object.entries(userRegistrationByMonth).map(([name, data]) => ({
      name,
      total: data.total,
      buyers: data.buyers,
      owners: data.owners
    }));
    
    return NextResponse.json(
      { 
        // Basic data
        flats, 
        users, 
        buyers, 
        owners, 
        listings, 
        feedback,
        
        // Enhanced data
        recentBookings,
        recentNotifications, 
        userRegistrationByMonth: monthlyRegistrationData,
        approvalStatus,
        amenitiesDistribution: Object.entries(amenitiesDistribution).map(([name, count]) => ({
          name,
          count
        })),
        priceRanges: Object.entries(priceRanges).map(([range, count]) => ({
          name: range,
          count
        })),
        bhkDistribution: Object.entries(bhkDistribution).map(([bhk, count]) => ({
          name: `${bhk} BHK`,
          count
        }))
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
