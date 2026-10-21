export type SceneId =
  | 'scene1_init'
  | 'scene2_heart'
  | 'scene3_quiz'
  | 'scene4_meter'
  | 'scene5_game'
  | 'scene6_secret'
  | 'scene7_glitch'
  | 'scene8_reveal';

export interface QuizOption {
  id: string;
  label: string;
  text: string;
  romanticScore: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  aiReaction: string;
}

export interface LoveMeterTier {
  min: number;
  max: number;
  message: string;
  badge: string;
}

export interface AppConfig {
  projectName: string;
  creatorTag: string;
  creatorHandle: string;
  openingText: {
    systemInit: string;
    coreQuestion: string;
    subHook: string;
    buttonLabel: string;
  };
  quizQuestions: QuizQuestion[];
  loveMeterTiers: LoveMeterTier[];
  secretMessageStages: string[];
  finalRevealText: {
    line1: string;
    line2: string;
    line3: string;
    title: string;
    subtitle: string;
    credit: string;
  };
  defaultShareMessage: string;
}
