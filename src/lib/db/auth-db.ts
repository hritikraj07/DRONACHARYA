// Dronacharya Database & Authentication Engine
// Connected directly to Supabase Database (profiles & game_progress) with synchronous local cache
import { supabase } from '@/lib/supabase';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
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

export function calculateRank(xp: number): 'Sadhaka' | 'Abhyasi' | 'Vidvan' | 'Acharya' {
  if (xp >= 9000) return 'Acharya';
  if (xp >= 3500) return 'Vidvan';
  if (xp >= 1000) return 'Abhyasi';
  return 'Sadhaka';
}

// Read all registered users from local cache
export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Error reading database cache:', e);
    return [];
  }
}

// Save users to local cache
function saveRegisteredUsers(users: RegisteredUser[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Error writing database cache:', e);
  }
}

// Get active logged-in user from session cache or cookie
export function getActiveSession(): RegisteredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (raw) return JSON.parse(raw);

    // Cookie fallback
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )dronacharya_session=([^;]*)/);
      if (match) {
        return JSON.parse(decodeURIComponent(match[1]));
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Set active session & broadcast immediately to TopNav and all components
export function setActiveSession(user: RegisteredUser | null, session?: any) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
      const maxAge = 60 * 60 * 24 * 7; // 7 days
      if (typeof document !== 'undefined') {
        document.cookie = `dronacharya_session=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
      }

      if (session?.access_token) {
        localStorage.setItem('sb_access_token', session.access_token);
        if (typeof document !== 'undefined') {
          document.cookie = `sb_access_token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
      }
      if (session?.refresh_token) {
        localStorage.setItem('sb_refresh_token', session.refresh_token);
        if (typeof document !== 'undefined') {
          document.cookie = `sb_refresh_token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
      }
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY);
      localStorage.removeItem('sb_access_token');
      localStorage.removeItem('sb_refresh_token');
      if (typeof document !== 'undefined') {
        document.cookie = 'dronacharya_session=; path=/; max-age=0; SameSite=Lax';
        document.cookie = 'sb_access_token=; path=/; max-age=0; SameSite=Lax';
        document.cookie = 'sb_refresh_token=; path=/; max-age=0; SameSite=Lax';
      }
      supabase.auth.signOut().catch(() => {});
    }
    // Broadcast event so TopNav and components update instantly
    window.dispatchEvent(new Event('dronacharya_session_change'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('Error setting session cache:', e);
  }
}

/**
 * Register a new student into Supabase Auth & public.profiles
 */
export async function registerUser(params: {
  name: string;
  email: string;
  password: string;
  studentClass: string;
  targetSubject: string;
  preferredLanguage?: 'en' | 'hi' | 'hinglish';
}): Promise<{ success: boolean; user?: RegisteredUser; session?: any; error?: string }> {
  const email = (params.email || '').trim();
  const normalizedEmail = email.toLowerCase();

  if (params.password.length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long.',
    };
  }

  try {
    // 1. Sign up user with Supabase Auth (passing full_name in metadata for auth trigger)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: params.password,
      options: {
        data: {
          full_name: params.name.trim(),
          selected_class: params.studentClass || AVAILABLE_CLASSES[1],
          selected_subjects: [params.targetSubject || AVAILABLE_SUBJECTS[0].id],
        },
      },
    });

    if (authError) {
      return {
        success: false,
        error: authError.message,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'Unable to create user account. Please check credentials.',
      };
    }

    const userId = authData.user.id;
    const targetSub = params.targetSubject || AVAILABLE_SUBJECTS[0].id;
    const studentCls = params.studentClass || AVAILABLE_CLASSES[1];

    // 2. Save selected_class / selected_subjects to public.profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        selected_class: studentCls,
        selected_subjects: [targetSub],
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) {
      console.warn('Supabase profile initial update notice:', profileError.message);
    }

    // 3. Construct clean RegisteredUser
    const newUser: RegisteredUser = {
      id: userId,
      name: params.name.trim(),
      email: normalizedEmail,
      password: params.password,
      studentClass: studentCls,
      targetSubject: targetSub,
      preferredLanguage: params.preferredLanguage || 'hinglish',
      totalXp: 0,
      currentStreak: 1,
      rank: 'Sadhaka',
      level: 1,
      hearts: 3,
      completedMissions: [],
      unlockedSeals: [],
      createdAt: authData.user.created_at || new Date().toISOString(),
    };

    // 4. Update local session & backup cache with session tokens and cookies
    const users = getRegisteredUsers();
    users.push(newUser);
    saveRegisteredUsers(users);
    setActiveSession(newUser, authData.session);

    return { success: true, user: newUser, session: authData.session };
  } catch (err: any) {
    console.error('Supabase registration error:', err);
    return {
      success: false,
      error: err.message || 'An unexpected registration error occurred.',
    };
  }
}

/**
 * Authenticate user with Supabase Auth & fetch from public.profiles + public.game_progress
 */
export async function authenticateUser(params: {
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: RegisteredUser; session?: any; error?: string }> {
  // Ensure .trim() is used on the email address so trailing spaces don't cause an invalid credentials error
  const email = (params.email || '').trim();
  const password = params.password;

  try {
    // 1. Direct call to Supabase Auth signInWithPassword
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 2. Log exact Supabase response in browser console
    console.log("Auth attempt:", email, error);

    if (error) {
      return {
        success: false,
        error: error.message || 'Invalid email or password entered.',
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'User not found in database.',
      };
    }

    const userId = authData.user.id;

    // 2. Fetch user's row from public.profiles
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileErr) {
      console.warn('Supabase profile fetch error:', profileErr.message);
    }

    // 3. Fetch user's progress from public.game_progress
    const { data: progressRows, error: progressErr } = await supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', userId);

    if (progressErr) {
      console.warn('Supabase game_progress fetch error:', progressErr.message);
    }

    const userXp = profile?.xp ?? 0;
    const completedMissions = progressRows
      ? progressRows.filter((r) => r.completed).map((r) => String(r.level_id || r.id))
      : [];

    const authenticatedUser: RegisteredUser = {
      id: userId,
      name: profile?.full_name || authData.user.user_metadata?.full_name || 'Scholar',
      email: authData.user.email || email,
      password: params.password,
      studentClass: profile?.selected_class || AVAILABLE_CLASSES[1],
      targetSubject:
        profile?.selected_subjects && profile.selected_subjects.length > 0
          ? profile.selected_subjects[0]
          : AVAILABLE_SUBJECTS[0].id,
      preferredLanguage: 'hinglish',
      totalXp: userXp,
      currentStreak: profile?.streak || 1,
      rank: calculateRank(userXp),
      level: Math.floor(userXp / 200) + 1,
      hearts: profile?.hearts ?? 3,
      completedMissions,
      unlockedSeals: [],
      createdAt: profile?.created_at || authData.user.created_at || new Date().toISOString(),
    };

    // 4. Update local session & backup cache
    const users = getRegisteredUsers();
    const existingIdx = users.findIndex(
      (u) => u.id === userId || u.email.toLowerCase() === email.toLowerCase()
    );
    if (existingIdx !== -1) {
      users[existingIdx] = authenticatedUser;
    } else {
      users.push(authenticatedUser);
    }
    saveRegisteredUsers(users);

    // Save user state and session tokens to app state & cookies
    setActiveSession(authenticatedUser, authData.session);

    return { success: true, user: authenticatedUser, session: authData.session };
  } catch (err: any) {
    console.error('Supabase authentication error:', err);
    return {
      success: false,
      error: err.message || 'Authentication failed. Please verify credentials.',
    };
  }
}

/**
 * Update student's selected class or subject anytime:
 * Syncs directly to Supabase public.profiles while updating local session cache synchronously
 */
export function updateUserLearningSelection(params: {
  studentClass?: string;
  targetSubject?: string;
  preferredLanguage?: 'en' | 'hi' | 'hinglish';
}): RegisteredUser | null {
  const currentUser = getActiveSession();
  if (!currentUser) return null;

  const updatedUser: RegisteredUser = {
    ...currentUser,
    ...(params.studentClass ? { studentClass: params.studentClass } : {}),
    ...(params.targetSubject ? { targetSubject: params.targetSubject } : {}),
    ...(params.preferredLanguage ? { preferredLanguage: params.preferredLanguage } : {}),
  };

  // Immediate synchronous session update for smooth UI
  setActiveSession(updatedUser);

  // Sync to local backup array
  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.id === currentUser.id);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveRegisteredUsers(users);
  }

  // Direct asynchronous sync to Supabase public.profiles
  supabase
    .from('profiles')
    .update({
      ...(params.studentClass ? { selected_class: params.studentClass } : {}),
      ...(params.targetSubject ? { selected_subjects: [params.targetSubject] } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentUser.id)
    .then(({ error }) => {
      if (error) console.warn('Supabase profile sync notice:', error.message);
    });

  return updatedUser;
}

/**
 * Record Game Progress & award XP:
 * Syncs directly to public.profiles (xp) and public.game_progress (level_id, score, completed)
 * while updating local session cache synchronously
 */
export function recordGameProgress(params: {
  missionId: string;
  earnedXp: number;
  levelId?: string;
  subject?: string;
  sealId?: string;
}): RegisteredUser | null {
  const currentUser = getActiveSession();
  if (!currentUser) return null;

  const newMissions = Array.from(new Set([...currentUser.completedMissions, params.missionId]));
  const newSeals = params.sealId
    ? Array.from(new Set([...currentUser.unlockedSeals, params.sealId]))
    : currentUser.unlockedSeals;

  const newTotalXp = currentUser.totalXp + params.earnedXp;
  const newLevel = Math.floor(newTotalXp / 200) + 1;
  const newRank = calculateRank(newTotalXp);

  const updatedUser: RegisteredUser = {
    ...currentUser,
    totalXp: newTotalXp,
    level: newLevel,
    rank: newRank,
    completedMissions: newMissions,
    unlockedSeals: newSeals,
  };

  // Immediate synchronous session update
  setActiveSession(updatedUser);

  // Sync to local backup array
  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.id === currentUser.id);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveRegisteredUsers(users);
  }

  // Direct asynchronous sync to Supabase public.profiles
  supabase
    .from('profiles')
    .update({
      xp: newTotalXp,
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentUser.id)
    .then(({ error }) => {
      if (error) console.warn('Supabase xp sync notice:', error.message);
    });

  // Direct asynchronous sync to Supabase public.game_progress
  supabase
    .from('game_progress')
    .upsert({
      user_id: currentUser.id,
      subject: params.subject || currentUser.targetSubject || 'python-basics',
      level_id: String(params.levelId || params.missionId || '1'),
      score: newTotalXp,
      completed: true,
      updated_at: new Date().toISOString(),
    })
    .then(({ error }) => {
      if (error) console.warn('Supabase game_progress upsert notice:', error.message);
    });

  return updatedUser;
}

// Backward-compatible alias for existing call sites
export const awardGameProgress = recordGameProgress;

/**
 * Deduct a heart upon game collision/failure:
 * Syncs directly to Supabase public.profiles while updating local session cache synchronously
 */
export function deductHeart(): number {
  const currentUser = getActiveSession();
  if (!currentUser) return 3;

  const remaining = Math.max(0, currentUser.hearts - 1);
  const updated = { ...currentUser, hearts: remaining };
  setActiveSession(updated);

  // Sync to Supabase public.profiles
  supabase
    .from('profiles')
    .update({
      hearts: remaining,
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentUser.id)
    .then(({ error }) => {
      if (error) console.warn('Supabase deductHeart notice:', error.message);
    });

  return remaining;
}

/**
 * Restore hearts:
 * Syncs directly to Supabase public.profiles while updating local session cache synchronously
 */
export function restoreHearts(): number {
  const currentUser = getActiveSession();
  if (!currentUser) return 3;

  const updated = { ...currentUser, hearts: 3 };
  setActiveSession(updated);

  // Sync to Supabase public.profiles
  supabase
    .from('profiles')
    .update({
      hearts: 3,
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentUser.id)
    .then(({ error }) => {
      if (error) console.warn('Supabase restoreHearts notice:', error.message);
    });

  return 3;
}
