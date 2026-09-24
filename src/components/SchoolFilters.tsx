import React from 'react';
import { 
  Search, 
  X, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon, 
  Layers, 
  ArrowUpDown, 
  RotateCcw 
} from 'lucide-react';
import { useSchools } from '../context/SchoolContext';

export const SchoolFilters: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    filteredSchools, 
    schools, 
    viewMode, 
    setViewMode 
  } = useSchools();

  const uniqueClusters = Array.from(new Set(schools.map(s => s.cluster))).filter(Boolean);

  const isFiltered = 
    filters.search.trim() !== '' ||
    filters.cluster !== 'All' ||
    filters.category !== 'All' ||
    filters.level !== 'All' ||
    filters.inspectionStatus !== 'All';

  const resetFilters = () => {
    setFilters({
      search: '',
      cluster: 'All',
      category: 'All',
      level: 'All',
      inspectionStatus: 'All',
      sortBy: 'name-asc'
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
      {/* Top row: Search + View Mode Switch */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="school-search-input"
            type="text"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search by school name, registration code (e.g. ZN-N-001), principal, or address..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center self-end sm:self-auto gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
          <button
            id="view-grid-btn"
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            id="view-table-btn"
            onClick={() => setViewMode('table')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Dense Table View"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            id="view-cluster-btn"
            onClick={() => setViewMode('cluster')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'cluster'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Cluster Grouped View"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clusters</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Category, Level, Status, Sort */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-1 text-slate-500 font-medium mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Cluster */}
        <select
          id="filter-cluster-select"
          value={filters.cluster}
          onChange={e => setFilters(prev => ({ ...prev, cluster: e.target.value }))}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
        >
          <option value="All">All Clusters ({uniqueClusters.length})</option>
          {uniqueClusters.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Level */}
        <select
          id="filter-level-select"
          value={filters.level}
          onChange={e => setFilters(prev => ({ ...prev, level: e.target.value }))}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
        >
          <option value="All">All School Levels</option>
          <option value="Primary (Grades 1-5)">Primary (Grades 1-5)</option>
          <option value="Upper Primary (Grades 6-8)">Upper Primary (Grades 6-8)</option>
          <option value="Secondary (Grades 9-10)">Secondary (Grades 9-10)</option>
          <option value="Higher Secondary (Grades 11-12)">Higher Secondary (Grades 11-12)</option>
          <option value="Composite (K-12)">Composite (K-12)</option>
        </select>

        {/* Category */}
        <select
          id="filter-category-select"
          value={filters.category}
          onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
        >
          <option value="All">All Categories</option>
          <option value="Government / Public">Government / Public</option>
          <option value="Government Aided">Government Aided</option>
          <option value="Private Unaided">Private Unaided</option>
          <option value="Special Needs / Inclusive">Special Needs / Inclusive</option>
        </select>

        {/* Inspection Status */}
        <select
          id="filter-status-select"
          value={filters.inspectionStatus}
          onChange={e => setFilters(prev => ({ ...prev, inspectionStatus: e.target.value }))}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
        >
          <option value="All">All Inspection Status</option>
          <option value="Compliant">Compliant</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Action Required">Action Required</option>
        </select>

        {/* Sort By */}
        <div className="flex items-center gap-1.5 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            id="filter-sort-select"
            value={filters.sortBy}
            onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="name-asc">Sort: School Name (A-Z)</option>
            <option value="name-desc">Sort: School Name (Z-A)</option>
            <option value="students-desc">Sort: Enrollment (Highest First)</option>
            <option value="students-asc">Sort: Enrollment (Lowest First)</option>
            <option value="ptr-desc">Sort: PTR Ratio (Highest First)</option>
            <option value="rating-desc">Sort: Performance Rating</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Results counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredSchools.length}</span> of{' '}
          <span className="font-bold text-slate-800">{schools.length}</span> total schools in zone
          {filters.cluster !== 'All' && ` (${filters.cluster})`}
        </div>

        {filteredSchools.length === 0 && (
          <div className="text-amber-600 font-medium">
            No schools matched the applied filters.
          </div>
        )}
      </div>
    </div>
  );
};
