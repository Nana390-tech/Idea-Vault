/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppData, Idea, Category } from './types';
import { SEED_DATA, DEFAULT_CATEGORIES } from './constants';

const STORAGE_KEY = 'pd_idea_vault_data';

export const storage = {
  getData: (): AppData => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored data', e);
      }
    }
    
    // Initial data if none exists
    const initialData: AppData = {
      ideas: SEED_DATA,
      categories: DEFAULT_CATEGORIES,
      tags: Array.from(new Set(SEED_DATA.flatMap(i => i.tags)))
    };
    storage.saveData(initialData);
    return initialData;
  },

  saveData: (data: AppData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  addIdea: (idea: Idea) => {
    const data = storage.getData();
    data.ideas.unshift(idea);
    // Update tags
    const allTags = new Set([...data.tags, ...idea.tags]);
    data.tags = Array.from(allTags);
    storage.saveData(data);
  },

  updateIdea: (updatedIdea: Idea) => {
    const data = storage.getData();
    data.ideas = data.ideas.map(i => i.id === updatedIdea.id ? updatedIdea : i);
    // Update tags
    const allTags = new Set([...data.tags, ...updatedIdea.tags]);
    data.tags = Array.from(allTags);
    storage.saveData(data);
  },

  deleteIdea: (id: string) => {
    const data = storage.getData();
    data.ideas = data.ideas.filter(i => i.id !== id);
    storage.saveData(data);
  },

  addCategory: (category: Category) => {
    const data = storage.getData();
    data.categories.push(category);
    storage.saveData(data);
  },

  deleteCategory: (id: string) => {
    const data = storage.getData();
    data.categories = data.categories.filter(c => c.id !== id);
    storage.saveData(data);
  },

  exportData: () => {
    const data = storage.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pd-idea-vault-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importData: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.ideas && data.categories && data.tags) {
        storage.saveData(data);
        return true;
      }
    } catch (e) {
      console.error('Failed to import data', e);
    }
    return false;
  }
};
