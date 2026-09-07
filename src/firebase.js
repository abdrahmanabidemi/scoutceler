// Mock Firebase Service using localStorage for persistence and zero setup
// Mimics Firebase Auth, Firestore, and Storage interfaces for easy future migration.

const STORAGE_KEYS = {
  USERS: 'scoutceler_users',
  PROFILES: 'scoutceler_profiles',
  CURRENT_USER: 'scoutceler_current_user',
};

// Helper: Get data from localStorage
const getLocalData = (key, defaultVal = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch (e) {
    console.error('Error reading localStorage', e);
    return defaultVal;
  }
};

// Helper: Set data to localStorage
const setLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error writing localStorage', e);
  }
};

// Seed mock database if empty
const seedDatabase = () => {
  const existingProfiles = getLocalData(STORAGE_KEYS.PROFILES, null);
  if (!existingProfiles) {
    const mockProfiles = [
      {
        uid: 'p1',
        email: 'mbappe@scoutceler.com',
        fullName: 'Kylian Mbappé',
        nickname: 'Donatello',
        role: 'player',
        gender: 'Male',
        nationality: 'France',
        state: 'Île-de-France',
        city: 'Paris',
        age: 25,
        height: 178,
        weight: 75,
        preferredFoot: 'Right',
        primaryPosition: 'Forward',
        secondaryPosition: 'Winger',
        marketValue: '180,000,000',
        currentClub: 'Real Madrid',
        previousClubs: 'PSG, Monaco',
        academy: 'Clairefontaine',
        jerseyNumber: '9',
        playingStyle: 'Inside Forward / Speedster',
        strongFoot: 'Right',
        weakFootRating: '4/5',
        marketAvailability: 'Not Available',
        
        // Physical
        speed: 97, strength: 78, balance: 85, jump: 76, acceleration: 98, agility: 92, stamina: 89,
        // Technical
        passing: 80, shooting: 90, crossing: 78, tackling: 35, ballControl: 91, dribbling: 93, finishing: 92,
        // Mental
        leadership: 82, vision: 85, composure: 89, decisionMaking: 84, positioning: 88, aggression: 65, teamwork: 80,
        
        bio: 'French professional footballer who plays as a forward. Known for his speed, dribbling, and finishing.',
        achievements: 'World Cup Winner 2018, Golden Boot Winner 2022',
        awards: 'Ligue 1 Player of the Year (x4)',
        profilePic: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        verification: 'Elite', // Basic, Professional, Elite, none
        rating: 91,
        potential: 95,
        scoutConfidence: 98,
        viewCount: 184,
        views: [
          { id: 'v1', viewerName: 'John Scout', viewerRole: 'scout', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
          { id: 'v2', viewerName: 'Real Madrid Recruiter', viewerRole: 'scout', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
          { id: 'v3', viewerName: 'Scoutceler Admin', viewerRole: 'admin', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString() }
        ]
      },
      {
        uid: 'p2',
        email: 'bukayo@scoutceler.com',
        fullName: 'Bukayo Saka',
        nickname: 'Starboy',
        role: 'player',
        gender: 'Male',
        nationality: 'England',
        state: 'London',
        city: 'London',
        age: 22,
        height: 178,
        weight: 72,
        preferredFoot: 'Left',
        primaryPosition: 'Winger',
        secondaryPosition: 'Midfielder',
        marketValue: '140,000,000',
        currentClub: 'Arsenal',
        previousClubs: 'Arsenal Academy',
        academy: 'Hale End',
        jerseyNumber: '7',
        playingStyle: 'Winger / Playmaker',
        strongFoot: 'Left',
        weakFootRating: '3/5',
        marketAvailability: 'Not Available',
        
        // Physical
        speed: 86, strength: 74, balance: 88, jump: 68, acceleration: 89, agility: 91, stamina: 88,
        // Technical
        passing: 84, shooting: 82, crossing: 86, tackling: 55, ballControl: 89, dribbling: 90, finishing: 81,
        // Mental
        leadership: 80, vision: 87, composure: 85, decisionMaking: 88, positioning: 86, aggression: 58, teamwork: 90,
        
        bio: 'English professional footballer who plays as a right winger. Renowned for his attacking intelligence, consistency, and work rate.',
        achievements: 'FA Cup Winner, Community Shield Winner',
        awards: 'England Men\'s Player of the Year (2021-22, 2022-23)',
        profilePic: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=60',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        verification: 'Professional',
        rating: 87,
        potential: 92,
        scoutConfidence: 94,
        viewCount: 96,
        views: [
          { id: 'v4', viewerName: 'Premier League Scout', viewerRole: 'scout', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
          { id: 'v5', viewerName: 'John Scout', viewerRole: 'scout', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() }
        ]
      },
      {
        uid: 'p3',
        email: 'junior@scoutceler.com',
        fullName: 'Sunday Junior',
        nickname: 'Sunny',
        role: 'player',
        gender: 'Male',
        nationality: 'Nigeria',
        state: 'Lagos',
        city: 'Surulere',
        age: 18,
        height: 175,
        weight: 68,
        preferredFoot: 'Right',
        primaryPosition: 'Midfielder',
        secondaryPosition: 'Winger',
        marketValue: '500,000',
        currentClub: 'Valiant FC',
        previousClubs: 'Local Academy',
        academy: 'Lagos Youth Academy',
        jerseyNumber: '10',
        playingStyle: 'Box to Box / Creative Engine',
        strongFoot: 'Right',
        weakFootRating: '4/5',
        marketAvailability: 'Available',
        
        // Physical
        speed: 89, strength: 72, balance: 82, jump: 70, acceleration: 91, agility: 88, stamina: 92,
        // Technical
        passing: 85, shooting: 78, crossing: 80, tackling: 62, ballControl: 84, dribbling: 86, finishing: 74,
        // Mental
        leadership: 75, vision: 88, composure: 80, decisionMaking: 82, positioning: 79, aggression: 70, teamwork: 85,
        
        bio: 'Rising midfielder from Lagos. High stamina and elite vision. Ready for European trials.',
        achievements: 'Lagos State Youth Tournament Top Assist Provider (2025)',
        awards: 'Academy MVP 2025',
        profilePic: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&auto=format&fit=crop&q=60',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        verification: 'Basic',
        rating: 74,
        potential: 89,
        scoutConfidence: 85,
        viewCount: 42,
        views: [
          { id: 'v6', viewerName: 'European Academy Scout', viewerRole: 'scout', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
          { id: 'v7', viewerName: 'John Scout', viewerRole: 'scout', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }
        ]
      }
    ];

    const mockUsers = [
      { uid: 'admin1', email: 'admin@scoutceler.com', password: 'password', role: 'admin', fullName: 'Scoutceler Admin' },
      { uid: 'scout1', email: 'scout@scoutceler.com', password: 'password', role: 'scout', fullName: 'John Scout' },
      { uid: 'p1', email: 'mbappe@scoutceler.com', password: 'password', role: 'player', fullName: 'Kylian Mbappé' },
      { uid: 'p2', email: 'bukayo@scoutceler.com', password: 'password', role: 'player', fullName: 'Bukayo Saka' },
      { uid: 'p3', email: 'junior@scoutceler.com', password: 'password', role: 'player', fullName: 'Sunday Junior' }
    ];

    setLocalData(STORAGE_KEYS.PROFILES, mockProfiles);
    setLocalData(STORAGE_KEYS.USERS, mockUsers);
  }
};

seedDatabase();

// Auth Namespace
export const auth = {
  // Sign Up
  signUp: async (email, password, role, fullName) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getLocalData(STORAGE_KEYS.USERS);
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          return reject(new Error('Email already registered!'));
        }

        const uid = 'u_' + Math.random().toString(36).substr(2, 9);
        const newUser = { uid, email, password, role, fullName };
        users.push(newUser);
        setLocalData(STORAGE_KEYS.USERS, users);

        // If player, create an empty profile
        if (role === 'player') {
          const profiles = getLocalData(STORAGE_KEYS.PROFILES);
          const newProfile = {
            uid,
            email,
            fullName,
            role: 'player',
            gender: 'Male', // Default gender
            verification: 'none',
            rating: 50,
            potential: 65,
            scoutConfidence: 50,
            profilePic: '',
            videoUrl: '',
            nationality: '',
            state: '',
            city: '',
            age: '',
            height: '',
            weight: '',
            preferredFoot: 'Right',
            primaryPosition: 'Forward',
            secondaryPosition: '',
            marketValue: '0',
            currentClub: '',
            previousClubs: '',
            academy: '',
            jerseyNumber: '',
            playingStyle: '',
            strongFoot: 'Right',
            weakFootRating: '3/5',
            marketAvailability: 'Available',
            bio: '',
            achievements: '',
            awards: '',
            viewCount: 0,
            views: [],
            // Attributes default
            speed: 50, strength: 50, balance: 50, jump: 50, acceleration: 50, agility: 50, stamina: 50,
            passing: 50, shooting: 50, crossing: 50, tackling: 50, ballControl: 50, dribbling: 50, finishing: 50,
            leadership: 50, vision: 50, composure: 50, decisionMaking: 50, positioning: 50, aggression: 50, teamwork: 50,
          };
          profiles.push(newProfile);
          setLocalData(STORAGE_KEYS.PROFILES, profiles);
        }

        setLocalData(STORAGE_KEYS.CURRENT_USER, newUser);
        resolve(newUser);
      }, 500);
    });
  },

  // Login
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getLocalData(STORAGE_KEYS.USERS);
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!user) {
          return reject(new Error('Invalid email or password!'));
        }
        setLocalData(STORAGE_KEYS.CURRENT_USER, user);
        resolve(user);
      }, 500);
    });
  },

  // Logout
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        resolve(true);
      }, 300);
    });
  },

  // Reset Password
  resetPassword: async (email, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getLocalData(STORAGE_KEYS.USERS);
        const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
        if (index === -1) {
          return reject(new Error('No account found with this email address.'));
        }
        users[index].password = newPassword;
        setLocalData(STORAGE_KEYS.USERS, users);
        resolve(users[index]);
      }, 500);
    });
  },

  // Get Current Logged In User
  getCurrentUser: () => {
    return getLocalData(STORAGE_KEYS.CURRENT_USER, null);
  }
};

// Database Namespace
export const db = {
  // Save or Update Player Profile
  saveProfile: async (uid, profileData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const profiles = getLocalData(STORAGE_KEYS.PROFILES);
        const index = profiles.findIndex(p => p.uid === uid);
        
        if (index === -1) {
          return reject(new Error('Profile not found!'));
        }

        // Keep existing read-only metadata (ratings, verification, email, role, etc)
        const updatedProfile = {
          ...profiles[index],
          ...profileData,
          // Calculate a mock overall rating based on average of physical/technical/mental attributes
          rating: Math.round(
            ((Number(profileData.speed || 50) + 
              Number(profileData.strength || 50) + 
              Number(profileData.stamina || 50) + 
              Number(profileData.passing || 50) + 
              Number(profileData.shooting || 50) + 
              Number(profileData.ballControl || 50) + 
              Number(profileData.vision || 50) + 
              Number(profileData.composure || 50)) / 8)
          )
        };

        profiles[index] = updatedProfile;
        setLocalData(STORAGE_KEYS.PROFILES, profiles);
        resolve(updatedProfile);
      }, 500);
    });
  },

  // Get single profile
  getProfile: async (uid) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const profiles = getLocalData(STORAGE_KEYS.PROFILES);
        const profile = profiles.find(p => p.uid === uid);
        if (!profile) {
          return reject(new Error('Profile not found!'));
        }
        resolve(profile);
      }, 200);
    });
  },

  // Get all profiles
  getAllProfiles: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const profiles = getLocalData(STORAGE_KEYS.PROFILES);
        resolve(profiles);
      }, 300);
    });
  },

  // Admin updates verification status
  updateVerification: async (uid, verificationStatus) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const profiles = getLocalData(STORAGE_KEYS.PROFILES);
        const index = profiles.findIndex(p => p.uid === uid);
        if (index === -1) {
          return reject(new Error('Profile not found!'));
        }
        profiles[index].verification = verificationStatus;
        setLocalData(STORAGE_KEYS.PROFILES, profiles);
        resolve(profiles[index]);
      }, 400);
    });
  },

  // Record a profile view from another user/guest
  recordProfileView: async (targetUid, viewerUser) => {
    return new Promise((resolve) => {
      const profiles = getLocalData(STORAGE_KEYS.PROFILES);
      const index = profiles.findIndex(p => p.uid === targetUid);
      if (index === -1) return resolve(null);

      // Do not count viewing own profile
      if (viewerUser && viewerUser.uid === targetUid) {
        return resolve(profiles[index]);
      }

      const profile = profiles[index];
      const currentCount = Number(profile.viewCount || 0) + 1;
      const currentViews = Array.isArray(profile.views) ? [...profile.views] : [];

      const newViewEntry = {
        id: 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        viewerName: viewerUser ? viewerUser.fullName : 'Verified Football Scout',
        viewerRole: viewerUser ? viewerUser.role : 'Scout',
        viewerEmail: viewerUser ? viewerUser.email : null,
        timestamp: new Date().toISOString()
      };

      // Keep most recent 30 views
      const updatedViews = [newViewEntry, ...currentViews].slice(0, 30);

      profile.viewCount = currentCount;
      profile.views = updatedViews;

      profiles[index] = profile;
      setLocalData(STORAGE_KEYS.PROFILES, profiles);
      resolve(profile);
    });
  }
};

// Storage Namespace (Mock)
export const storage = {
  uploadFile: async (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file selected!'));
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Return the Data URL (base64) so it can be previewed/saved locally
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
};
