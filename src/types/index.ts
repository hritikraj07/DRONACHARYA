// Dronacharya Platform Domain Types

export type LanguagePreference = 'en' | 'hi' | 'hinglish';
export type LearnerRole = 'student' | 'mentor' | 'admin';
export type RankTier = 'Sadhaka' | 'Abhyasi' | 'Vidvan' | 'Acharya';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  role: LearnerRole;
  preferredLanguage: LanguagePreference;
  totalXp: number;
  currentStreak: number;
  graceFreezesAvailable: number;
  lastActiveDate: string;
  rank: RankTier;
  targetTrack: string;
}

export interface SkillNode {
  id: string;
  name: string;
  domain: string;
  description: string;
  masteryProbability: number; // 0.0 to 1.0 (BKT)
  attemptsCount: number;
  lastPracticedAt?: string;
}

export interface LearningMission {
  id: string;
  pathId: string;
  sequenceOrder: number;
  title: string;
  subtitle: string;
  narrativeContext: string;
  conceptBriefing: string;
  conceptVisualType?: 'call-tree' | 'hash-map' | 'memory-stack';
  primarySkillId: string;
  xpReward: number;
  estTimeMinutes: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  initialCode: string;
  solutionPattern: string;
  visibleTests: TestCase[];
  hiddenTests: TestCase[];
}

export interface TestCase {
  id: string;
  inputDescription: string;
  expectedOutput: string;
  codeSnippet: string;
  isHidden?: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  category: 'systems' | 'algorithms' | 'ai-ml' | 'business';
  missions: LearningMission[];
}

export interface MasterySeal {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  requiredSkillId: string;
  verificationHash: string;
  awardedAt?: string;
  isUnlocked: boolean;
}

export interface XpTransaction {
  id: string;
  userId: string;
  amount: number;
  activityType: 'mission_pass' | 'capstone_eval' | 'peer_review' | 'diagnostic_complete' | 'daily_streak';
  description: string;
  timestamp: string;
}

export interface MentorMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  hintTier?: 1 | 2 | 3 | 4;
  socraticQuestion?: string;
  language: LanguagePreference;
  timestamp: string;
  isFallback?: boolean;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  testChecklist: string[];
  isCompleted: boolean;
}

export interface ProjectRubricScore {
  functionalityScore: number; // max 40
  edgeCasesScore: number;     // max 25
  complexityScore: number;    // max 20
  codeStyleScore: number;     // max 15
  totalScore: number;         // 0 - 100
  feedbackComments: string[];
}

export interface CapstoneProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  learningObjectives: string[];
  prerequisites: string[];
  milestones: ProjectMilestone[];
  starterFiles: { [filename: string]: string };
  rubricCriteria: {
    functionality: string;
    edgeCases: string;
    complexity: string;
    codeStyle: string;
  };
  isSubmitted: boolean;
  isVerified: boolean;
  submissionScore?: ProjectRubricScore;
  submittedCode?: { [filename: string]: string };
  verificationHash?: string;
}

export interface SquadMember {
  userId: string;
  username: string;
  fullName: string;
  role: 'leader' | 'member';
  contributionXp: number;
}

export interface GurukulSquad {
  id: string;
  name: string;
  joinCode: string;
  description: string;
  members: SquadMember[];
  collectiveXp: number;
  weeklyGoal: string;
  activeChallenge: string;
  progressPercentage: number;
}
