import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-84ae5a5c`;

// In-memory storage for demo mode (replace with real backend in production)
const demoStorage = {
  users: new Map<string, any>(),
  sosAlerts: [] as any[],
};

// Initialize with some demo users
if (typeof window !== 'undefined' && !localStorage.getItem('bloodbridge_demo_initialized')) {
  localStorage.setItem('bloodbridge_demo_initialized', 'true');
}

// API client for backend calls
export const api = {
  async registerUser(name: string, role: string) {
    // Demo mode: Store user in localStorage using name as key
    try {
      // Get existing users from localStorage
      const usersKey = 'bloodbridge_all_users';
      const existingUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
      
      // Check if user already exists (by name)
      let user = existingUsers.find((u: any) => u.name.toLowerCase() === name.toLowerCase());
      
      if (user) {
        // Update existing user
        user.role = role;
        user.lastLogin = new Date().toISOString();
      } else {
        // Create new user
        const userId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        user = {
          id: userId,
          name,
          phone: `+1-555-${Math.floor(1000 + Math.random() * 9000)}`, // Auto-generate dummy phone
          role,
          bloodGroup: '',
          location: '',
          totalDonations: 0,
          isAlcoholic: false,
          isSmoker: false,
          hasChronicIllness: false,
          rating: 5.0,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        existingUsers.push(user);
      }
      
      // Save back to localStorage
      localStorage.setItem(usersKey, JSON.stringify(existingUsers));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Register user error:', error);
      throw new Error('Failed to register user');
    }
  },

  async getUsersByRole(role: string) {
    try {
      const usersKey = 'bloodbridge_all_users';
      const allUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
      const users = allUsers.filter((u: any) => u.role === role);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { users };
    } catch (error) {
      console.error('Get users by role error:', error);
      throw new Error('Failed to fetch users');
    }
  },

  async getAllUsers() {
    try {
      const usersKey = 'bloodbridge_all_users';
      const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { users };
    } catch (error) {
      console.error('Get all users error:', error);
      throw new Error('Failed to fetch all users');
    }
  },

  async getUser(userId: string) {
    try {
      const usersKey = 'bloodbridge_all_users';
      const allUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
      const user = allUsers.find((u: any) => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { user };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user');
    }
  },

  async updateUser(userId: string, data: any) {
    try {
      const usersKey = 'bloodbridge_all_users';
      const allUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
      const userIndex = allUsers.findIndex((u: any) => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      allUsers[userIndex] = { ...allUsers[userIndex], ...data };
      localStorage.setItem(usersKey, JSON.stringify(allUsers));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { success: true, user: allUsers[userIndex] };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user');
    }
  },

  async calculateRating(userId: string) {
    try {
      const usersKey = 'bloodbridge_all_users';
      const allUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
      const userIndex = allUsers.findIndex((u: any) => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      const user = allUsers[userIndex];
      
      // Rating calculation logic
      let rating = 5.0;
      
      if (user.isAlcoholic) rating -= 1.0;
      if (user.isSmoker) rating -= 0.5;
      if (user.hasChronicIllness) rating -= 1.0;
      
      const donationBonus = Math.min(user.totalDonations * 0.1, 2.0);
      rating += donationBonus;
      
      rating = Math.max(0, Math.min(5, rating));
      rating = Math.round(rating * 10) / 10;
      
      allUsers[userIndex].rating = rating;
      localStorage.setItem(usersKey, JSON.stringify(allUsers));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { success: true, rating, user: allUsers[userIndex] };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to calculate rating');
    }
  },

  // SOS endpoints
  async broadcastSOS(data: any) {
    try {
      const sosId = `sos-${Date.now()}`;
      const sosAlert = {
        id: sosId,
        ...data,
        status: 'active',
        createdAt: new Date().toISOString(),
        respondedBy: [],
      };
      
      const sosKey = 'bloodbridge_sos_alerts';
      const allSOS = JSON.parse(localStorage.getItem(sosKey) || '[]');
      allSOS.unshift(sosAlert);
      localStorage.setItem(sosKey, JSON.stringify(allSOS));
      
      console.log(`[DEMO] SOS Alert broadcasted: ${sosId}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true, sosId, alert: sosAlert };
    } catch (error) {
      console.error('Broadcast SOS error:', error);
      throw new Error('Failed to broadcast SOS');
    }
  },

  async getActiveSOS() {
    try {
      const sosKey = 'bloodbridge_sos_alerts';
      const allSOS = JSON.parse(localStorage.getItem(sosKey) || '[]');
      const activeSOS = allSOS.filter((s: any) => s.status === 'active');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { alerts: activeSOS };
    } catch (error) {
      console.error('Get SOS alerts error:', error);
      throw new Error('Failed to fetch SOS alerts');
    }
  },

  async respondToSOS(sosId: string, userId: string, userName: string, phone: string) {
    try {
      const sosKey = 'bloodbridge_sos_alerts';
      const allSOS = JSON.parse(localStorage.getItem(sosKey) || '[]');
      const sosIndex = allSOS.findIndex((s: any) => s.id === sosId);
      
      if (sosIndex === -1) {
        throw new Error('SOS alert not found');
      }
      
      allSOS[sosIndex].respondedBy.push({
        userId,
        userName,
        phone,
        respondedAt: new Date().toISOString()
      });
      
      localStorage.setItem(sosKey, JSON.stringify(allSOS));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { success: true, alert: allSOS[sosIndex] };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to respond to SOS');
    }
  },

  async closeSOS(sosId: string) {
    try {
      const sosKey = 'bloodbridge_sos_alerts';
      const allSOS = JSON.parse(localStorage.getItem(sosKey) || '[]');
      const sosIndex = allSOS.findIndex((s: any) => s.id === sosId);
      
      if (sosIndex === -1) {
        throw new Error('SOS alert not found');
      }
      
      allSOS[sosIndex].status = 'resolved';
      allSOS[sosIndex].closedAt = new Date().toISOString();
      
      localStorage.setItem(sosKey, JSON.stringify(allSOS));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to close SOS');
    }
  },
};

// Local storage helpers for persistent auth
export const auth = {
  setUser(user: any) {
    localStorage.setItem('bloodbridge_user', JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem('bloodbridge_user');
    return user ? JSON.parse(user) : null;
  },

  clearUser() {
    localStorage.removeItem('bloodbridge_user');
  },

  isAuthenticated() {
    return !!this.getUser();
  },
};