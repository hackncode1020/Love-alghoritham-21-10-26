import { AppConfig } from '../types';

export const initialLoveAlgorithmConfig: AppConfig = {
  projectName: 'THE LOVE ALGORITHM',
  creatorTag: 'Created with code by @hack.n.code',
  creatorHandle: '@hack.n.code',
  openingText: {
    systemInit: 'INITIALIZING LOVE ALGORITHM...',
    coreQuestion: 'CAN AN AI UNDERSTAND LOVE?',
    subHook: 'THERE IS ONLY ONE WAY TO FIND OUT.',
    buttonLabel: 'START THE EXPERIMENT ❤️',
  },
  quizQuestions: [
    {
      id: 1,
      question: 'What makes a moment unforgettable?',
      aiReaction: 'Processing temporal weight of memories...',
      options: [
        { id: '1a', label: 'A', text: 'Expensive gifts.', romanticScore: 16 },
        { id: '1b', label: 'B', text: 'Genuine feelings and thoughtful effort.', romanticScore: 20 },
        { id: '1c', label: 'C', text: 'Perfect photographs.', romanticScore: 17 },
      ],
    },
    {
      id: 2,
      question: 'What matters most in a relationship?',
      aiReaction: 'Analyzing relational stability matrices...',
      options: [
        { id: '2a', label: 'A', text: 'Trust.', romanticScore: 19 },
        { id: '2b', label: 'B', text: 'Respect.', romanticScore: 19 },
        { id: '2c', label: 'C', text: 'Honest communication.', romanticScore: 19 },
        { id: '2d', label: 'D', text: 'All of the above.', romanticScore: 20 },
      ],
    },
    {
      id: 3,
      question: 'Choose your ideal romantic moment.',
      aiReaction: 'Simulating emotional resonance coordinate...',
      options: [
        { id: '3a', label: 'A', text: 'Walking beneath the stars.', romanticScore: 20 },
        { id: '3b', label: 'B', text: 'A meaningful late-night conversation.', romanticScore: 20 },
        { id: '3c', label: 'C', text: 'A surprise made just for you.', romanticScore: 20 },
      ],
    },
    {
      id: 4,
      question: 'What would make you smile the most?',
      aiReaction: 'Measuring dopamine response vectors...',
      options: [
        { id: '4a', label: 'A', text: 'A heartfelt letter.', romanticScore: 20 },
        { id: '4b', label: 'B', text: 'An unexpected gift.', romanticScore: 18 },
        { id: '4c', label: 'C', text: 'A personalized interactive website.', romanticScore: 20 },
      ],
    },
    {
      id: 5,
      question: 'Can a small gesture make a big difference?',
      aiReaction: 'Quantifying butterfly effects of kindness...',
      options: [
        { id: '5a', label: 'A', text: 'Absolutely.', romanticScore: 20 },
        { id: '5b', label: 'B', text: 'Sometimes.', romanticScore: 18 },
        { id: '5c', label: 'C', text: 'It depends on the person.', romanticScore: 19 },
      ],
    },
  ],
  loveMeterTiers: [
    { min: 0, max: 30, message: 'THE SYSTEM IS STILL LEARNING. ❤️', badge: 'LOW FREQUENCY' },
    { min: 31, max: 60, message: 'INTERESTING CONNECTION DETECTED. 💗', badge: 'HARMONIC DETECTED' },
    { min: 61, max: 85, message: 'THE HEART IS GLOWING BRIGHTER. 💖', badge: 'ELEVATED RESONANCE' },
    { min: 86, max: 99, message: 'THE ALGORITHM IS GETTING CURIOUS. 💘', badge: 'CRITICAL CONVERGENCE' },
    { min: 100, max: 100, message: 'ERROR 100: TOO MUCH LOVE TO CALCULATE! ❤️🔥', badge: 'CAPACITY EXCEEDED' },
  ],
  secretMessageStages: [
    "LOVE ISN'T ALWAYS ABOUT GRAND GESTURES.",
    "SOMETIMES, IT'S A SMALL MESSAGE.",
    "A THOUGHTFUL SURPRISE.",
    "OR SOMETHING SOMEONE CREATED JUST TO MAKE YOU SMILE.",
    "SOME THINGS ARE VALUABLE BECAUSE OF THE FEELINGS AND EFFORT WE PUT INTO THEM. ❤️",
  ],
  finalRevealText: {
    line1: 'THE ALGORITHM TRIED TO EXPLAIN LOVE...',
    line2: "BUT SOME THINGS AREN'T MEANT TO BE CALCULATED.",
    line3: "THEY'RE MEANT TO BE FELT. ❤️",
    title: 'THE LOVE ALGORITHM',
    subtitle: 'FEELINGS, WRITTEN IN CODE.',
    credit: 'CREATED WITH CODE BY @hack.n.code',
  },
  defaultShareMessage:
    "The algorithm tried to explain love... but some things aren't meant to be calculated. They're meant to be felt. ❤️\n\nExperience 'The Love Algorithm — Can Code Understand Love?' by @hack.n.code",
};
