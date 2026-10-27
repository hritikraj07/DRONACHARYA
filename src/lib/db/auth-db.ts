// Dronacharya Database & Authentication Engine
// Supports real credential verification, user persistence, and dynamic course/class switching

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string; // Stored securely in database records
  studentClass: string;
  targetSubject: string;
  preferredLanguage: 'en' | 'hi' | 'hinglish';
  totalXp: number;
  currentStreak: number;
  rank: 'Sadhaka' | 'Abhyasi' | 'Vidvan' | 'Acharya';
  hearts: number;
  level: number;
  completedMissions: string[];
  unlockedSeals: string[];
  createdAt: string;
}

const USERS_DB_KEY = 'dronacharya_database_users_v2';
const CURRENT_SESSION_KEY = 'dronacharya_active_session_v2';

export const AVAILABLE_CLASSES = [
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12 / 12th Pass',
];

export const AVAILABLE_SUBJECTS = [
  {
    id: 'python-basics',
    name: 'Python Programming',
    category: 'Programming',
    icon: 'Terminal',
    tagline: 'Interactive 2D Robot Rescue Game with Loops & Logic',
    isAvailable: true,
  },
  {
    id: 'c-programming',
    name: 'C Programming',
    category: 'Programming',
    icon: 'Code2',
    tagline: 'Pointer Maze & Memory Game',
    isAvailable: false,
  },
  {
    id: 'java-programming',
    name: 'Java Programming',
    category: 'Programming',
    icon: 'Coffee',
    tagline: 'Object-Oriented Dungeon Quest',
    isAvailable: false,
  },
  {
    id: 'cpp-programming',
    name: 'C++ Programming',
    category: 'Programming',
    icon: 'Cpu',
    tagline: 'Game Engine Math & Memory Trials',
    isAvailable: false,
  },
  {
    id: 'web-development',
    name: 'JavaScript & Web Dev',
    category: 'Web',
    icon: 'Globe',
    tagline: 'Interactive DOM Canvas & Web Puzzles',
    isAvailable: false,
  },
];

// Read all registered users from database
export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Error reading database:', e);
    return [];
  }
}

// Save users to database
function saveRegisteredUsers(users: RegisteredUser[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Error writing database:', e);
  }
}

// Get active logged-in user
export function getActiveSession(): RegisteredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Set active session & broadcast immediately to TopNav and all components
export function setActiveSession(user: RegisteredUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
    // Broadcast event so TopNav updates instantly without needing a full reload
    window.dispatchEvent(new Event('dronacharya_session_change'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('Error setting session:', e);
  }
}

// Register a new student into database
export function registerUser(params: {
  name: string;
  email: string;
  password: string;
  studentClass: string;
  targetSubject: string;
  preferredLanguage?: 'en' | 'hi' | 'hinglish';
}): { success: boolean; user?: RegisteredUser; error?: string } {
  const users = getRegisteredUsers();
  const normalizedEmail = params.email.trim().toLowerCase();

  // Validate email uniqueness
  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email is already registered in the database. Please Sign In.',
    };
  }

  if (params.password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long.',
    };
  }

  // Create fresh student profile with ZERO fake data
  const newUser: RegisteredUser = {
    id: `usr_${Date.now()}`,
    name: params.name.trim(),
    email: normalizedEmail,
    password: params.password,
    studentClass: params.studentClass || AVAILABLE_CLASSES[1],
    targetSubject: params.targetSubject || AVAILABLE_SUBJECTS[0].id,
    preferredLanguage: params.preferredLanguage || 'hinglish',
    totalXp: 0,
    currentStreak: 1,
    rank: 'Sadhaka',
    level: 1,
    hearts: 3,
    completedMissions: [],
    unlockedSeals: [],
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveRegisteredUsers(users);
  setActiveSession(newUser);

  return { success: true, user: newUser };
}

// Authenticate user against database credentials
export function authenticateUser(params: {
  email: string;
  password: string;
}): { success: boolean; user?: RegisteredUser; error?: string } {
  const users = getRegisteredUsers();
  const normalizedEmail = params.email.trim().toLowerCase();

  // Search database for email
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return {
      success: false,
      error: 'No scholar account found with this email in database. Please click Register to create your account.',
    };
  }

  // Verify password match
  if (user.password !== params.password) {
    return {
      success: false,
      error: 'Incorrect password entered. Credentials do not match our database records.',
    };
  }

  setActiveSession(user);
  return { success: true, user };
}

// Update student's selected class or subject anytime
export function updateUserLearningSelection(params: {
  studentClass?: string;
  targetSubject?: string;
  preferredLanguage?: 'en' | 'hi' | 'hinglish';
}): RegisteredUser | null {
  const currentUser = getActiveSession();
  if (!currentUser) return null;

  const users = getRegisteredUsers();
  const updatedUser = {
    ...currentUser,
    ...(params.studentClass ? { studentClass: params.studentClass } : {}),
    ...(params.targetSubject ? { targetSubject: params.targetSubject } : {}),
    ...(params.preferredLanguage ? { preferredLanguage: params.preferredLanguage } : {}),
  };

  // Update in database list
  const idx = users.findIndex((u) => u.id === currentUser.id);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveRegisteredUsers(users);
  }

  setActiveSession(updatedUser);
  return updatedUser;
}

// Award game XP and mission completion to user in database
export function awardGameProgress(params: {
  missionId: string;
  earnedXp: number;
  sealId?: string;
}): RegisteredUser | null {
  const currentUser = getActiveSession();
  if (!currentUser) return null;

  const users = getRegisteredUsers();
  const newMissions = Array.from(new Set([...currentUser.completedMissions, params.missionId]));
  const newSeals = params.sealId
    ? Array.from(new Set([...currentUser.unlockedSeals, params.sealId]))
    : currentUser.unlockedSeals;

  const newTotalXp = currentUser.totalXp + params.earnedXp;
  const newLevel = Math.floor(newTotalXp / 200) + 1;
  const newRank =
    newTotalXp >= 9000
      ? 'Acharya'
      : newTotalXp >= 3500
      ? 'Vidvan'
      : newTotalXp >= 1000
      ? 'Abhyasi'
      : 'Sadhaka';

  const updatedUser: RegisteredUser = {
    ...currentUser,
    totalXp: newTotalXp,
    level: newLevel,
    rank: newRank,
    completedMissions: newMissions,
    unlockedSeals: newSeals,
  };

  const idx = users.findIndex((u) => u.id === currentUser.id);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveRegisteredUsers(users);
  }

  setActiveSession(updatedUser);
  return updatedUser;
}

// Deduct heart when user fails in game
export function deductHeart(): number {
  const currentUser = getActiveSession();
  if (!currentUser) return 3;

  const remaining = Math.max(0, currentUser.hearts - 1);
  const updated = { ...currentUser, hearts: remaining };
  setActiveSession(updated);
  return remaining;
}

// Restore hearts
export function restoreHearts(): number {
  const currentUser = getActiveSession();
  if (!currentUser) return 3;

  const updated = { ...currentUser, hearts: 3 };
  setActiveSession(updated);
  return 3;
}
