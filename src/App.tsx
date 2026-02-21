/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Tags, 
  Layers, 
  Star, 
  Archive, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Menu, 
  X,
  Link as LinkIcon,
  Calendar,
  MoreVertical,
  Trash2,
  Edit3,
  ExternalLink,
  Share2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Download,
  Upload,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Idea, Category, AppData, Status, Priority, SourceType } from './types';
import { storage } from './store';
import { SOURCE_TYPES, STATUSES, PRIORITIES } from './constants';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  count 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void,
  count?: number
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group relative",
      active 
        ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200" 
        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
    )}
  >
    <div className="flex items-center gap-3">
      <div className={cn(
        "p-1.5 rounded-lg transition-colors",
        active ? "bg-white/10" : "bg-transparent group-hover:bg-zinc-200/50"
      )}>
        <Icon size={18} className={cn(active ? "text-white" : "text-zinc-400 group-hover:text-zinc-900")} />
      </div>
      <span className="font-semibold text-sm tracking-tight">{label}</span>
    </div>
    {count !== undefined && (
      <span className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded-lg tabular-nums",
        active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
      )}>
        {count}
      </span>
    )}
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        className="absolute left-0 w-1 h-4 bg-white rounded-r-full"
      />
    )}
  </button>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error' | 'info' }) => {
  const variants = {
    default: "bg-zinc-100 text-zinc-600 border-zinc-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    error: "bg-rose-50 text-rose-700 border-rose-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border", variants[variant])}>
      {children}
    </span>
  );
};

interface IdeaCardProps {
  key?: React.Key;
  idea: Idea;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onToggleArchive: (e: React.MouseEvent) => void;
}

const IdeaCard = ({ 
  idea, 
  onClick, 
  onToggleFavorite,
  onToggleArchive 
}: IdeaCardProps) => {
  const priorityColor = {
    Low: 'info',
    Medium: 'warning',
    High: 'error'
  }[idea.priority] as any;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      onClick={onClick}
      className="bg-white border border-zinc-200/60 rounded-3xl p-6 cursor-pointer transition-all group relative overflow-hidden shadow-sm hover:border-zinc-300"
    >
      <div className="flex justify-between items-start mb-4">
        <Badge variant={priorityColor}>{idea.priority}</Badge>
        <div className="flex gap-1">
          <button 
            onClick={onToggleFavorite}
            className={cn(
              "p-2 rounded-xl transition-all",
              idea.isFavorite ? "text-amber-500 bg-amber-50" : "text-zinc-300 hover:bg-zinc-100 hover:text-zinc-500"
            )}
          >
            <Star size={16} fill={idea.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-zinc-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors tracking-tight">
        {idea.title}
      </h3>
      
      <p className="text-zinc-500 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
        {idea.summary}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {idea.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] text-zinc-500 font-bold px-2 py-1 bg-zinc-50 rounded-lg border border-zinc-100">
            {tag.toUpperCase()}
          </span>
        ))}
      </div>

      <div className="pt-5 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400">
          <div className="p-1.5 bg-zinc-50 rounded-lg">
            <Globe size={12} />
          </div>
          <span className="text-[11px] font-bold truncate max-w-[120px] uppercase tracking-wider">{idea.sourceName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full",
            idea.status === 'Delivered' ? "bg-emerald-500" : "bg-amber-500"
          )} />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{idea.status}</span>
        </div>
      </div>
    </motion.div>
  );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20"
        >
          <div className="px-10 py-8 border-b border-zinc-100 flex items-center justify-between shrink-0">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{title}</h2>
            <button onClick={onClose} className="p-3 hover:bg-zinc-100 rounded-2xl transition-all text-zinc-400 hover:text-zinc-900">
              <X size={20} />
            </button>
          </div>
          <div className="p-10 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Main App ---

export default function App() {
  const [data, setData] = useState<AppData>(storage.getData());
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // Filters
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    setData(storage.getData());
  }, []);

  const refreshData = () => setData(storage.getData());

  const filteredIdeas = useMemo(() => {
    let result = data.ideas;

    // Tab filtering
    if (activeTab === 'Favorites') result = result.filter(i => i.isFavorite);
    if (activeTab === 'Archive') result = result.filter(i => i.isArchived);
    else result = result.filter(i => !i.isArchived);

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.title.toLowerCase().includes(q) || 
        i.summary.toLowerCase().includes(q) || 
        i.notes.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q)) ||
        i.sourceName.toLowerCase().includes(q)
      );
    }

    // Filters
    if (filterCategory !== 'All') result = result.filter(i => i.category === filterCategory);
    if (filterStatus !== 'All') result = result.filter(i => i.status === filterStatus);
    if (filterPriority !== 'All') result = result.filter(i => i.priority === filterPriority);

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      if (sortBy === 'Oldest') return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      if (sortBy === 'Title A-Z') return a.title.localeCompare(b.title);
      if (sortBy === 'Priority') {
        const pMap = { High: 3, Medium: 2, Low: 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      return 0;
    });

    return result;
  }, [data.ideas, activeTab, searchQuery, filterCategory, filterStatus, filterPriority, sortBy]);

  const handleToggleFavorite = (e: React.MouseEvent, idea: Idea) => {
    e.stopPropagation();
    const updated = { ...idea, isFavorite: !idea.isFavorite };
    storage.updateIdea(updated);
    refreshData();
  };

  const handleToggleArchive = (e: React.MouseEvent, idea: Idea) => {
    e.stopPropagation();
    const updated = { ...idea, isArchived: !idea.isArchived };
    storage.updateIdea(updated);
    refreshData();
  };

  const handleDeleteIdea = (id: string) => {
    if (confirm('Are you sure you want to delete this idea?')) {
      storage.deleteIdea(id);
      setSelectedIdea(null);
      refreshData();
    }
  };

  const handleSaveIdea = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newIdea: Idea = {
      id: selectedIdea?.id || crypto.randomUUID(),
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      summary: formData.get('summary') as string,
      notes: formData.get('notes') as string,
      sourceType: formData.get('sourceType') as SourceType,
      sourceName: formData.get('sourceName') as string,
      sourceLinks: JSON.parse(formData.get('sourceLinks') as string || '[]'),
      dateAdded: selectedIdea?.dateAdded || new Date().toISOString(),
      status: formData.get('status') as Status,
      priority: formData.get('priority') as Priority,
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
      isFavorite: selectedIdea?.isFavorite || false,
      isArchived: selectedIdea?.isArchived || false,
      attachments: [],
    };

    if (selectedIdea) {
      storage.updateIdea(newIdea);
    } else {
      storage.addIdea(newIdea);
    }
    
    setIsQuickAddOpen(false);
    setSelectedIdea(null);
    refreshData();
  };

  const handleExport = () => storage.exportData();
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (storage.importData(content)) {
          alert('Data imported successfully!');
          refreshData();
        } else {
          alert('Failed to import data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  // --- Render Sections ---

  const renderDashboard = () => {
    const stats = {
      total: data.ideas.length,
      favorites: data.ideas.filter(i => i.isFavorite).length,
      developing: data.ideas.filter(i => i.status === 'Developing').length,
      ready: data.ideas.filter(i => i.status === 'Ready to Submit').length,
    };

    return (
      <div className="space-y-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Ideas', value: stats.total, icon: Lightbulb, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Favorites', value: stats.favorites, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Developing', value: stats.developing, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Ready', value: stats.ready, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2rem] border border-zinc-200/60 shadow-sm flex flex-col gap-4 group hover:border-zinc-300 transition-all"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-zinc-900 tracking-tight">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-zinc-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500">
                  <Clock size={18} />
                </div>
                Recent Activity
              </h3>
              <button 
                onClick={() => setActiveTab('Ideas')}
                className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {data.ideas.slice(0, 4).map((idea, i) => (
                <motion.div 
                  key={idea.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.05) }}
                  onClick={() => setSelectedIdea(idea)}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 cursor-pointer transition-all border border-transparent hover:border-zinc-100 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 font-black text-sm group-hover:bg-zinc-900 group-hover:text-white transition-all">
                      {idea.title.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 group-hover:text-brand-600 transition-colors">{idea.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{idea.category}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-200" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{format(new Date(idea.dateAdded), 'MMM d')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={idea.priority === 'High' ? 'error' : 'default'}>{idea.priority}</Badge>
                    <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-zinc-200 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/60">
                  <Layers size={18} />
                </div>
                Categories
              </h3>
              <div className="space-y-6">
                {data.categories.slice(0, 5).map((cat, i) => {
                  const count = data.ideas.filter(i => i.category === cat.name).length;
                  const percentage = Math.max(5, (count / Math.max(1, data.ideas.length)) * 100);
                  return (
                    <div key={cat.id} className="space-y-2">
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/50">
                        <span>{cat.name}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                          className="h-full bg-white rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={() => setActiveTab('Categories')}
                className="mt-10 w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all"
              >
                Manage All
              </button>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-500/20 rounded-full blur-[100px]" />
          </div>
        </div>
      </div>
    );
  };

  const renderIdeaList = () => (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white p-6 rounded-[2rem] border border-zinc-200/60 shadow-sm">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search titles, tags, or sources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-zinc-50 p-1.5 rounded-2xl border border-zinc-100">
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest py-2 px-3 focus:ring-0 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {data.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <div className="w-px h-4 bg-zinc-200" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest py-2 px-3 focus:ring-0 cursor-pointer"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Title A-Z">Alphabetical</option>
              <option value="Priority">By Priority</option>
            </select>
          </div>
          
          <div className="flex bg-zinc-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-xl transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400 hover:text-zinc-600")}
            >
              <LayoutDashboard size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-xl transition-all", viewMode === 'list' ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400 hover:text-zinc-600")}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>

      {filteredIdeas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-zinc-100 border-dashed">
          <div className="w-24 h-24 bg-zinc-50 rounded-[2rem] flex items-center justify-center text-zinc-200 mb-8">
            <Search size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">No results found</h3>
          <p className="text-zinc-400 max-w-sm mb-10 font-medium">We couldn't find any ideas matching your current search or filters. Try a different query or reset your filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setFilterCategory('All'); }}
            className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-zinc-200"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className={cn(
          "grid gap-8",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          <AnimatePresence mode="popLayout">
            {filteredIdeas.map(idea => (
              <IdeaCard 
                key={idea.id} 
                idea={idea} 
                onClick={() => setSelectedIdea(idea)}
                onToggleFavorite={(e) => handleToggleFavorite(e, idea)}
                onToggleArchive={(e) => handleToggleArchive(e, idea)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );

  const renderIdeaDetail = (idea: Idea) => (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Badge variant={idea.priority === 'High' ? 'error' : idea.priority === 'Medium' ? 'warning' : 'info'}>
            {idea.priority} Priority
          </Badge>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{idea.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => handleToggleFavorite(e, idea)}
            className={cn("p-3 rounded-2xl border transition-all", idea.isFavorite ? "bg-amber-50 border-amber-200 text-amber-500 shadow-lg shadow-amber-100" : "bg-white border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300")}
          >
            <Star size={20} fill={idea.isFavorite ? "currentColor" : "none"} />
          </button>
          <div className="h-8 w-px bg-zinc-200 mx-2" />
          <button 
            onClick={() => setIsQuickAddOpen(true)}
            className="p-3 rounded-2xl border bg-white border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-all"
          >
            <Edit3 size={20} />
          </button>
          <button 
            onClick={() => handleDeleteIdea(idea.id)}
            className="p-3 rounded-2xl border bg-white border-zinc-200 text-zinc-400 hover:text-rose-500 hover:border-rose-200 transition-all"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={() => {
              const text = `${idea.title}\n\n${idea.summary}\n\nRead more: ${window.location.href}`;
              navigator.clipboard.writeText(text);
              alert('Idea summary copied to clipboard!');
            }}
            className="p-3 rounded-2xl bg-zinc-900 text-white hover:bg-black transition-all shadow-xl shadow-zinc-200 flex items-center gap-2 px-6"
          >
            <Share2 size={18} />
            <span className="text-sm font-bold">Share</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl sm:text-6xl font-black text-zinc-900 leading-[1.1] tracking-tight max-w-4xl"
        >
          {idea.title}
        </motion.h1>
        <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-[11px] text-zinc-400 font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
              <Layers size={12} />
            </div>
            {idea.category}
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
              <Calendar size={12} />
            </div>
            {format(new Date(idea.dateAdded), 'MMMM d, yyyy')}
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
              <Globe size={12} />
            </div>
            {idea.sourceName}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          <section className="relative">
            <div className="absolute -left-8 top-0 bottom-0 w-1 bg-brand-500/20 rounded-full hidden sm:block" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-600 mb-6">Executive Summary</h3>
            <p className="text-2xl text-zinc-600 leading-relaxed font-medium italic">
              "{idea.summary}"
            </p>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Deep Dive & Notes</h3>
            <div className="bg-white p-10 rounded-[2.5rem] text-zinc-700 leading-relaxed whitespace-pre-wrap border border-zinc-200/60 shadow-sm font-medium text-lg">
              {idea.notes || "No detailed notes provided."}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Taxonomy</h3>
            <div className="flex flex-wrap gap-3">
              {idea.tags.map(tag => (
                <span key={tag} className="px-5 py-2.5 bg-zinc-100 text-zinc-600 rounded-2xl text-xs font-bold hover:bg-zinc-900 hover:text-white transition-all cursor-default">
                  #{tag.toUpperCase()}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">References</h3>
            <div className="space-y-4">
              {idea.sourceLinks.length > 0 ? idea.sourceLinks.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 bg-white border border-zinc-200/60 rounded-[1.5rem] hover:border-zinc-900 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                      <LinkIcon size={18} />
                    </div>
                    <span className="font-bold text-sm text-zinc-900">{link.label}</span>
                  </div>
                  <ExternalLink size={14} className="text-zinc-300 group-hover:text-zinc-900" />
                </a>
              )) : (
                <div className="p-8 border-2 border-dashed border-zinc-100 rounded-[1.5rem] text-center">
                  <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">No links attached</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-zinc-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-zinc-200 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">Workflow</h3>
              <div className="space-y-4">
                <button 
                  onClick={(e) => handleToggleArchive(e, idea)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-sm font-bold group"
                >
                  <div className="flex items-center gap-3">
                    <Archive size={18} className="text-white/60 group-hover:text-white" />
                    {idea.isArchived ? 'Restore' : 'Archive'}
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-white" />
                </button>
                <button className="w-full flex items-center justify-between px-5 py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-sm font-bold group">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-white/60 group-hover:text-white" />
                    Reminder
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-white" />
                </button>
              </div>
            </div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          </section>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-2xl space-y-12">
      <section>
        <h3 className="text-2xl font-black text-zinc-900 mb-6">App Settings</h3>
        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-zinc-900">Install Offline App</h4>
              <p className="text-sm text-zinc-500">Download the vault to your device for offline access.</p>
            </div>
            <button 
              disabled={!deferredPrompt}
              onClick={handleInstallApp}
              className={cn(
                "px-6 py-3 rounded-xl font-bold transition-all",
                deferredPrompt 
                  ? "bg-black text-white hover:scale-105" 
                  : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              )}
            >
              {deferredPrompt ? 'Install Now' : 'Already Installed'}
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-black text-zinc-900 mb-6">Data Management</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <Download size={24} />
            </div>
            <h4 className="font-bold text-zinc-900">Export Library</h4>
            <p className="text-sm text-zinc-500">Download your entire vault as a JSON file for backup or migration.</p>
            <button 
              onClick={handleExport}
              className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-black transition-all"
            >
              Export Data
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
              <Upload size={24} />
            </div>
            <h4 className="font-bold text-zinc-900">Import Library</h4>
            <p className="text-sm text-zinc-500">Restore your vault from a previously exported JSON file.</p>
            <label className="block w-full py-3 bg-zinc-100 text-zinc-900 rounded-xl font-bold hover:bg-zinc-200 transition-all text-center cursor-pointer">
              Import Data
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-black text-zinc-900 mb-6">Categories</h3>
        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
          <div className="flex flex-wrap gap-3">
            {data.categories.map(cat => (
              <div key={cat.id} className="group flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl">
                <span className="font-bold text-sm text-zinc-700">{cat.name}</span>
                <button 
                  onClick={() => {
                    if (confirm(`Delete category "${cat.name}"?`)) {
                      storage.deleteCategory(cat.id);
                      refreshData();
                    }
                  }}
                  className="text-zinc-300 hover:text-rose-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              id="new-category"
              type="text" 
              placeholder="New category name..." 
              className="flex-1 px-4 py-3 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black"
            />
            <button 
              onClick={() => {
                const input = document.getElementById('new-category') as HTMLInputElement;
                if (input.value) {
                  storage.addCategory({ id: crypto.randomUUID(), name: input.value });
                  input.value = '';
                  refreshData();
                }
              }}
              className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Add
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans text-zinc-900">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-zinc-200 transition-transform duration-300 lg:translate-x-0 lg:static lg:block",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center gap-4 mb-16 px-2">
            <div className="w-12 h-12 bg-zinc-900 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-zinc-200">
              <Lightbulb size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter leading-none">IDEA VAULT</h1>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">Professional Dev</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={activeTab === 'Dashboard'} 
              onClick={() => { setActiveTab('Dashboard'); setSelectedIdea(null); setIsSidebarOpen(false); }} 
            />
            <SidebarItem 
              icon={Lightbulb} 
              label="All Ideas" 
              active={activeTab === 'Ideas'} 
              onClick={() => { setActiveTab('Ideas'); setSelectedIdea(null); setIsSidebarOpen(false); }} 
              count={data.ideas.filter(i => !i.isArchived).length}
            />
            <SidebarItem 
              icon={Star} 
              label="Favorites" 
              active={activeTab === 'Favorites'} 
              onClick={() => { setActiveTab('Favorites'); setSelectedIdea(null); setIsSidebarOpen(false); }} 
              count={data.ideas.filter(i => i.isFavorite).length}
            />
            <SidebarItem 
              icon={Archive} 
              label="Archive" 
              active={activeTab === 'Archive'} 
              onClick={() => { setActiveTab('Archive'); setSelectedIdea(null); setIsSidebarOpen(false); }} 
              count={data.ideas.filter(i => i.isArchived).length}
            />
            <div className="pt-10 pb-4 px-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Management</span>
            </div>
            <SidebarItem 
              icon={Layers} 
              label="Categories" 
              active={activeTab === 'Categories'} 
              onClick={() => { setActiveTab('Categories'); setSelectedIdea(null); setIsSidebarOpen(false); }} 
            />
            <SidebarItem 
              icon={Settings} 
              label="Settings" 
              active={activeTab === 'Settings'} 
              onClick={() => { setActiveTab('Settings'); setSelectedIdea(null); setIsSidebarOpen(false); }} 
            />
          </nav>

          <div className="mt-auto pt-8">
            <div className="bg-zinc-50 rounded-[2rem] p-8 border border-zinc-100 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Quick Tip</p>
                <p className="text-xs font-bold text-zinc-600 leading-relaxed mb-6">Export your data regularly to keep your ideas safe.</p>
                <button 
                  onClick={handleExport}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-900 flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  Backup Now
                  <ChevronRight size={12} />
                </button>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-zinc-200/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-zinc-200 px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-3 hover:bg-zinc-100 rounded-2xl text-zinc-500 transition-all"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                {selectedIdea ? 'Idea Details' : activeTab}
              </h2>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">
                {selectedIdea ? 'Refining your vision' : 'Manage your repository'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setSelectedIdea(null);
                setIsQuickAddOpen(true);
              }}
              className="bg-zinc-900 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-zinc-200 active:scale-95"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">New Idea</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIdea ? `detail-${selectedIdea.id}` : activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {selectedIdea ? (
                <div className="max-w-5xl mx-auto">
                  <button 
                    onClick={() => setSelectedIdea(null)}
                    className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-zinc-900 font-bold text-sm transition-colors"
                  >
                    <ChevronRight size={16} className="rotate-180" />
                    Back to {activeTab}
                  </button>
                  {renderIdeaDetail(selectedIdea)}
                </div>
              ) : (
                <div className="max-w-7xl mx-auto">
                  {activeTab === 'Dashboard' && renderDashboard()}
                  {(activeTab === 'Ideas' || activeTab === 'Favorites' || activeTab === 'Archive') && renderIdeaList()}
                  {activeTab === 'Categories' && renderSettings()}
                  {activeTab === 'Settings' && renderSettings()}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Quick Add Modal */}
      <Modal 
        isOpen={isQuickAddOpen} 
        onClose={() => {
          setIsQuickAddOpen(false);
          setSelectedIdea(null);
        }} 
        title={selectedIdea ? "Edit Idea" : "Quick Add Idea"}
      >
        <form onSubmit={handleSaveIdea} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="sm:col-span-2 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Title</label>
              <input 
                name="title"
                required
                defaultValue={selectedIdea?.title}
                placeholder="Enter a catchy title..."
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all placeholder:text-zinc-300"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Category</label>
              <select 
                name="category"
                required
                defaultValue={selectedIdea?.category || data.categories[0]?.name}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all appearance-none"
              >
                {data.categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Priority</label>
              <select 
                name="priority"
                defaultValue={selectedIdea?.priority || 'Medium'}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all appearance-none"
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Summary</label>
              <textarea 
                name="summary"
                required
                defaultValue={selectedIdea?.summary}
                placeholder="A short 1-2 line summary for the card view..."
                rows={2}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all resize-none placeholder:text-zinc-300"
              />
            </div>

            <div className="sm:col-span-2 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Full Notes</label>
              <textarea 
                name="notes"
                defaultValue={selectedIdea?.notes}
                placeholder="Detailed explanation, thoughts, and next steps..."
                rows={5}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all resize-none placeholder:text-zinc-300"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Source Type</label>
              <select 
                name="sourceType"
                defaultValue={selectedIdea?.sourceType || 'Other'}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all appearance-none"
              >
                {SOURCE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Source Name</label>
              <input 
                name="sourceName"
                defaultValue={selectedIdea?.sourceName}
                placeholder="e.g. YouTube, Book Title..."
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all placeholder:text-zinc-300"
              />
            </div>

            <div className="sm:col-span-2 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Status</label>
              <select 
                name="status"
                defaultValue={selectedIdea?.status || 'New'}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all appearance-none"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Tags (comma separated)</label>
              <input 
                name="tags"
                defaultValue={selectedIdea?.tags.join(', ')}
                placeholder="AI, Education, Innovation..."
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all placeholder:text-zinc-300"
              />
            </div>

            <input type="hidden" name="sourceLinks" value={JSON.stringify(selectedIdea?.sourceLinks || [])} />
          </div>

          <div className="pt-8 flex gap-4">
            <button 
              type="button"
              onClick={() => setIsQuickAddOpen(false)}
              className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-zinc-200 active:scale-95"
            >
              {selectedIdea ? 'Update Idea' : 'Save Idea'}
            </button>
          </div>
        </form>
      </Modal>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
