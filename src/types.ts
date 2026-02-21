/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Status = 'New' | 'Developing' | 'Ready to Submit' | 'Submitted' | 'Accepted' | 'Delivered';
export type Priority = 'Low' | 'Medium' | 'High';
export type SourceType = 'YouTube' | 'Article' | 'Book' | 'Conference' | 'Person' | 'Website' | 'Podcast' | 'AI Tool' | 'Other';

export interface SourceLink {
  label: string;
  url: string;
}

export interface Idea {
  id: string;
  title: string;
  category: string;
  summary: string;
  notes: string;
  sourceType: SourceType;
  sourceName: string;
  sourceLinks: SourceLink[];
  dateAdded: string;
  status: Status;
  priority: Priority;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  attachments: string[]; // List of links or filenames
  targetDate?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface AppData {
  ideas: Idea[];
  categories: Category[];
  tags: string[];
}
