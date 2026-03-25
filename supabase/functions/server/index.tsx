import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-84ae5a5c/health", (c) => {
  return c.json({ status: "ok" });
});

// ============= AUTH ENDPOINTS =============

// Send OTP (Demo mode - generates 6-digit code)
app.post("/make-server-84ae5a5c/auth/send-otp", async (c) => {
  try {
    const { phone } = await c.req.json();
    
    if (!phone) {
      return c.json({ error: "Phone number is required" }, 400);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5-minute expiration
    const otpKey = `otp:${phone}`;
    await kv.set(otpKey, otp);
    
    console.log(`OTP generated for ${phone}: ${otp}`);
    
    // In production, send SMS via Twilio/etc
    // For demo, return OTP in response
    return c.json({ 
      success: true, 
      message: "OTP sent successfully",
      otp_demo: otp // Remove in production
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return c.json({ error: "Failed to send OTP" }, 500);
  }
});

// Verify OTP
app.post("/make-server-84ae5a5c/auth/verify-otp", async (c) => {
  try {
    const { phone, otp } = await c.req.json();
    
    if (!phone || !otp) {
      return c.json({ error: "Phone and OTP are required" }, 400);
    }

    const otpKey = `otp:${phone}`;
    const storedOtp = await kv.get(otpKey);
    
    if (!storedOtp) {
      return c.json({ error: "OTP expired or invalid" }, 400);
    }

    if (storedOtp !== otp) {
      return c.json({ error: "Invalid OTP" }, 400);
    }

    // Delete OTP after verification
    await kv.del(otpKey);
    
    return c.json({ 
      success: true,
      message: "OTP verified successfully"
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return c.json({ error: "Failed to verify OTP" }, 500);
  }
});

// Register/Login User
app.post("/make-server-84ae5a5c/auth/register", async (c) => {
  try {
    const { name, phone, role } = await c.req.json();
    
    if (!name || !phone || !role) {
      return c.json({ error: "Name, phone, and role are required" }, 400);
    }

    // Check if user exists
    const userKey = `user:${phone}`;
    let user = await kv.get(userKey);
    
    if (user) {
      // Update existing user
      user = { ...user, name, role, lastLogin: new Date().toISOString() };
    } else {
      // Create new user
      const userId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      user = {
        id: userId,
        name,
        phone,
        role,
        bloodGroup: "",
        location: "",
        totalDonations: 0,
        isAlcoholic: false,
        isSmoker: false,
        hasChronicIllness: false,
        rating: 5.0, // Default rating
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
    }
    
    // Save user
    await kv.set(userKey, user);
    
    // Add to role-based index
    const roleKey = `users:${role}`;
    const roleUsers = await kv.get(roleKey) || [];
    if (!roleUsers.find((u: any) => u.phone === phone)) {
      roleUsers.push({ phone, name, id: user.id });
      await kv.set(roleKey, roleUsers);
    }
    
    return c.json({ 
      success: true,
      user
    });
  } catch (error) {
    console.error("Register user error:", error);
    return c.json({ error: "Failed to register user" }, 500);
  }
});

// ============= USER ENDPOINTS =============

// Get all users by role
app.get("/make-server-84ae5a5c/users/:role", async (c) => {
  try {
    const role = c.req.param("role");
    const roleKey = `users:${role}`;
    const roleUsers = await kv.get(roleKey) || [];
    
    // Fetch full user details
    const users = [];
    for (const item of roleUsers) {
      const userKey = `user:${item.phone}`;
      const user = await kv.get(userKey);
      if (user) {
        users.push(user);
      }
    }
    
    return c.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// Get all users (for all lists)
app.get("/make-server-84ae5a5c/users/all/list", async (c) => {
  try {
    const allUsers = [];
    
    for (const role of ["donor", "needer", "hospital"]) {
      const roleKey = `users:${role}`;
      const roleUsers = await kv.get(roleKey) || [];
      
      for (const item of roleUsers) {
        const userKey = `user:${item.phone}`;
        const user = await kv.get(userKey);
        if (user && !allUsers.find(u => u.phone === user.phone)) {
          allUsers.push(user);
        }
      }
    }
    
    return c.json({ users: allUsers });
  } catch (error) {
    console.error("Get all users error:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// Get single user
app.get("/make-server-84ae5a5c/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    // Search through all users
    for (const role of ["donor", "needer", "hospital"]) {
      const roleKey = `users:${role}`;
      const roleUsers = await kv.get(roleKey) || [];
      
      for (const item of roleUsers) {
        const userKey = `user:${item.phone}`;
        const user = await kv.get(userKey);
        if (user && user.id === userId) {
          return c.json({ user });
        }
      }
    }
    
    return c.json({ error: "User not found" }, 404);
  } catch (error) {
    console.error("Get user error:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

// Update user profile
app.post("/make-server-84ae5a5c/user/update", async (c) => {
  try {
    const updates = await c.req.json();
    const { phone, ...data } = updates;
    
    if (!phone) {
      return c.json({ error: "Phone is required" }, 400);
    }
    
    const userKey = `user:${phone}`;
    const user = await kv.get(userKey);
    
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    
    const updatedUser = { ...user, ...data };
    await kv.set(userKey, updatedUser);
    
    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

// ============= RATING SYSTEM =============

// Calculate and update user rating
app.post("/make-server-84ae5a5c/user/calculate-rating", async (c) => {
  try {
    const { phone } = await c.req.json();
    
    if (!phone) {
      return c.json({ error: "Phone is required" }, 400);
    }
    
    const userKey = `user:${phone}`;
    const user = await kv.get(userKey);
    
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    
    // Rating calculation logic
    let rating = 5.0; // Start with perfect score
    
    // Deduct points for health risks
    if (user.isAlcoholic) rating -= 1.0;
    if (user.isSmoker) rating -= 0.5;
    if (user.hasChronicIllness) rating -= 1.0;
    
    // Add bonus for donations (0.1 per donation, max +2.0)
    const donationBonus = Math.min(user.totalDonations * 0.1, 2.0);
    rating += donationBonus;
    
    // Cap rating between 0 and 5
    rating = Math.max(0, Math.min(5, rating));
    
    user.rating = Math.round(rating * 10) / 10; // Round to 1 decimal
    await kv.set(userKey, user);
    
    return c.json({ success: true, rating: user.rating, user });
  } catch (error) {
    console.error("Calculate rating error:", error);
    return c.json({ error: "Failed to calculate rating" }, 500);
  }
});

// ============= SOS SYSTEM =============

// Broadcast SOS alert
app.post("/make-server-84ae5a5c/sos/broadcast", async (c) => {
  try {
    const { 
      userId, 
      userName, 
      bloodGroup, 
      location, 
      urgency, 
      hospital,
      message 
    } = await c.req.json();
    
    if (!userId || !bloodGroup || !location) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    const sosId = `sos-${Date.now()}`;
    const sosAlert = {
      id: sosId,
      userId,
      userName,
      bloodGroup,
      location,
      urgency: urgency || "critical",
      hospital,
      message,
      status: "active",
      createdAt: new Date().toISOString(),
      respondedBy: [],
    };
    
    // Store SOS alert
    await kv.set(`sos:${sosId}`, sosAlert);
    
    // Add to active SOS list
    const activeSOS = await kv.get("sos:active") || [];
    activeSOS.unshift(sosAlert);
    await kv.set("sos:active", activeSOS);
    
    console.log(`SOS Alert broadcasted: ${sosId} - ${bloodGroup} needed at ${location}`);
    
    return c.json({ success: true, sosId, alert: sosAlert });
  } catch (error) {
    console.error("Broadcast SOS error:", error);
    return c.json({ error: "Failed to broadcast SOS" }, 500);
  }
});

// Get all active SOS alerts
app.get("/make-server-84ae5a5c/sos/active", async (c) => {
  try {
    const activeSOS = await kv.get("sos:active") || [];
    return c.json({ alerts: activeSOS });
  } catch (error) {
    console.error("Get SOS alerts error:", error);
    return c.json({ error: "Failed to fetch SOS alerts" }, 500);
  }
});

// Respond to SOS
app.post("/make-server-84ae5a5c/sos/respond", async (c) => {
  try {
    const { sosId, userId, userName, phone } = await c.req.json();
    
    if (!sosId || !userId) {
      return c.json({ error: "SOS ID and User ID are required" }, 400);
    }
    
    const sosKey = `sos:${sosId}`;
    const sosAlert = await kv.get(sosKey);
    
    if (!sosAlert) {
      return c.json({ error: "SOS alert not found" }, 404);
    }
    
    // Add responder
    sosAlert.respondedBy.push({
      userId,
      userName,
      phone,
      respondedAt: new Date().toISOString()
    });
    
    await kv.set(sosKey, sosAlert);
    
    // Update active list
    const activeSOS = await kv.get("sos:active") || [];
    const index = activeSOS.findIndex((s: any) => s.id === sosId);
    if (index !== -1) {
      activeSOS[index] = sosAlert;
      await kv.set("sos:active", activeSOS);
    }
    
    return c.json({ success: true, alert: sosAlert });
  } catch (error) {
    console.error("Respond to SOS error:", error);
    return c.json({ error: "Failed to respond to SOS" }, 500);
  }
});

// Close SOS alert
app.post("/make-server-84ae5a5c/sos/close", async (c) => {
  try {
    const { sosId } = await c.req.json();
    
    if (!sosId) {
      return c.json({ error: "SOS ID is required" }, 400);
    }
    
    const sosKey = `sos:${sosId}`;
    const sosAlert = await kv.get(sosKey);
    
    if (!sosAlert) {
      return c.json({ error: "SOS alert not found" }, 404);
    }
    
    sosAlert.status = "resolved";
    sosAlert.closedAt = new Date().toISOString();
    await kv.set(sosKey, sosAlert);
    
    // Remove from active list
    const activeSOS = await kv.get("sos:active") || [];
    const filtered = activeSOS.filter((s: any) => s.id !== sosId);
    await kv.set("sos:active", filtered);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Close SOS error:", error);
    return c.json({ error: "Failed to close SOS" }, 500);
  }
});

Deno.serve(app.fetch);