/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Idea, Category, AppData } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Leadership' },
  { id: '2', name: 'Technology' },
  { id: '3', name: 'Pedagogy' },
  { id: '4', name: 'Soft Skills' },
  { id: '5', name: 'Innovation' },
];

export const SOURCE_TYPES = [
  'YouTube', 'Article', 'Book', 'Conference', 'Person', 'Website', 'Podcast', 'AI Tool', 'Other'
];

export const STATUSES = [
  'New', 'Developing', 'Ready to Submit', 'Submitted', 'Accepted', 'Delivered'
];

export const PRIORITIES = [
  'Low', 'Medium', 'High'
];

export const SEED_DATA: Idea[] = [
  {
    id: 'seed-1',
    title: 'The Future of AI in K-12 Education',
    category: 'Technology',
    summary: 'Exploring how generative AI can personalize learning paths for diverse student needs.',
    notes: 'Focus on prompt engineering for teachers and ethical considerations in the classroom.',
    sourceType: 'Conference',
    sourceName: 'ISTE 2024',
    sourceLinks: [{ label: 'Session Notes', url: 'https://example.com/iste2024' }],
    dateAdded: new Date().toISOString(),
    status: 'Developing',
    priority: 'High',
    tags: ['AI', 'EdTech', 'Personalization'],
    isFavorite: true,
    isArchived: false,
    attachments: []
  },
  {
    id: 'seed-2',
    title: 'Mindful Leadership for School Administrators',
    category: 'Leadership',
    summary: 'A framework for implementing mindfulness practices to reduce burnout in school leadership teams.',
    notes: 'Based on the book "Mindful Work". Need to adapt for educational settings.',
    sourceType: 'Book',
    sourceName: 'Mindful Work by David Gelles',
    sourceLinks: [{ label: 'Book Info', url: 'https://example.com/mindful-work' }],
    dateAdded: new Date().toISOString(),
    status: 'New',
    priority: 'Medium',
    tags: ['Mindfulness', 'Wellness', 'Leadership'],
    isFavorite: false,
    isArchived: false,
    attachments: []
  },
  {
    id: 'seed-3',
    title: 'Gamifying Professional Development',
    category: 'Pedagogy',
    summary: 'Using game mechanics like badges and leaderboards to increase teacher engagement in PD.',
    notes: 'Look into platforms like Badgr or custom Moodle plugins.',
    sourceType: 'YouTube',
    sourceName: 'Edutopia Channel',
    sourceLinks: [{ label: 'Video Link', url: 'https://youtube.com/example' }],
    dateAdded: new Date().toISOString(),
    status: 'Ready to Submit',
    priority: 'High',
    tags: ['Gamification', 'Engagement', 'PD'],
    isFavorite: true,
    isArchived: false,
    attachments: []
  },
  {
    id: 'seed-4',
    title: 'Active Listening Workshop for Mentors',
    category: 'Soft Skills',
    summary: 'Practical exercises for mentors to improve their active listening and feedback skills.',
    notes: 'Include role-playing scenarios and feedback loops.',
    sourceType: 'Podcast',
    sourceName: 'The Coaching Habit',
    sourceLinks: [{ label: 'Episode 42', url: 'https://podcast.com/42' }],
    dateAdded: new Date().toISOString(),
    status: 'Delivered',
    priority: 'Low',
    tags: ['Mentoring', 'Communication', 'Coaching'],
    isFavorite: false,
    isArchived: false,
    attachments: []
  },
  {
    id: 'seed-5',
    title: 'Design Thinking in Curriculum Design',
    category: 'Innovation',
    summary: 'Applying the 5 stages of design thinking to create more student-centered curricula.',
    notes: 'Empathize, Define, Ideate, Prototype, Test.',
    sourceType: 'Website',
    sourceName: 'IDEO U',
    sourceLinks: [{ label: 'Design Thinking Guide', url: 'https://ideou.com/guide' }],
    dateAdded: new Date().toISOString(),
    status: 'Submitted',
    priority: 'Medium',
    tags: ['Design Thinking', 'Curriculum', 'Innovation'],
    isFavorite: false,
    isArchived: false,
    attachments: []
  },
  {
    id: 'seed-6',
    title: 'Sustainable Tech Infrastructure',
    category: 'Technology',
    summary: 'Strategies for schools to reduce their carbon footprint through better IT management.',
    notes: 'Cloud migration vs. on-prem servers. Lifecycle management of devices.',
    sourceType: 'Article',
    sourceName: 'Tech & Learning Magazine',
    sourceLinks: [{ label: 'Article Link', url: 'https://techlearning.com/sustainability' }],
    dateAdded: new Date().toISOString(),
    status: 'New',
    priority: 'Low',
    tags: ['Sustainability', 'IT', 'GreenTech'],
    isFavorite: false,
    isArchived: true,
    attachments: []
  }
];
