import React, { useState, useEffect } from 'react';
import {
  Users,
  FileCheck,
  Sparkles,
  Activity,
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Eye,
  ExternalLink,
  RefreshCw,
  Download,
  AlertTriangle,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { FitBuddyUserRecord, DashboardStats } from '../types/fitness';
import { FitBuddyAPI } from '../services/api';
import { UserDetailModal } from './UserDetailModal';

interface AdminDashboardProps {
  onSelectUserForMainView: (user: FitBuddyUserRecord) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectUserForMainView,
}) => {
  const [users, setUsers] = useState<FitBuddyUserRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPlansGenerated: 0,
    updatedPlans: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterGoal, setFilterGoal] = useState<string>('All');
  const [filterIntensity, setFilterIntensity] = useState<string>('All');
  const [filterExperience, setFilterExperience] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'goal'>('newest');

  // Modal inspection states
  const [selectedUser, setSelectedUser] = useState<FitBuddyUserRecord | null>(null);
  const [modalTab, setModalTab] = useState<'profile' | 'original' | 'updated' | 'feedback'>('profile');
  const [userToDelete, setUserToDelete] = useState<FitBuddyUserRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const data = await FitBuddyAPI.getAllUsers();
      setUsers(data.users || []);
      setStats(data.stats);
    } catch (err) {
      console.error('Error loading admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const handleDelete = async (userId: string) => {
    try {
      setIsDeleting(true);
      await FitBuddyAPI.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
      setUserToDelete(null);
      // Refresh stats
      fetchUsersData();
    } catch (err) {
      console.error('Error deleting user:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and sort logic
  const filteredUsers = users
    .filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        u.fullName.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q);
      const matchesGoal = filterGoal === 'All' || u.fitnessGoal === filterGoal;
      const matchesIntensity =
        filterIntensity === 'All' || u.workoutIntensity === filterIntensity;
      const matchesExperience =
        filterExperience === 'All' || u.experienceLevel === filterExperience;
      return matchesSearch && matchesGoal && matchesIntensity && matchesExperience;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'goal') {
        return a.fitnessGoal.localeCompare(b.fitnessGoal);
      }
      return 0;
    });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'fitbuddy_all_users_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <Activity className="w-4 h-4" />
            <span>Coach & Administration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Admin & Coach Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Monitor registered users, inspect generated plans, review feedback, and manage client records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsersData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Users
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {stats.totalUsers}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Registered in FitBuddy DB</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Plans Generated
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {stats.totalPlansGenerated}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">7-day splits via Gemini AI</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Updated Plans
            </span>
            <div className="w-8 h-8 rounded-xl bg-lime-500/10 text-lime-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {stats.updatedPlans}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Evolved through feedback</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Users
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {stats.activeUsers}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Actively training with routines</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search by Name or ID */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Name or User ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition"
            />
          </div>

          {/* Filter by Goal */}
          <div>
            <select
              value={filterGoal}
              onChange={(e) => setFilterGoal(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/80 transition cursor-pointer"
            >
              <option value="All">All Goals</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="General Wellness">General Wellness</option>
              <option value="Strength">Strength</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Endurance">Endurance</option>
            </select>
          </div>

          {/* Filter by Intensity */}
          <div>
            <select
              value={filterIntensity}
              onChange={(e) => setFilterIntensity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/80 transition cursor-pointer"
            >
              <option value="All">All Intensities</option>
              <option value="Low">Low Intensity</option>
              <option value="Medium">Medium Intensity</option>
              <option value="High">High Intensity</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/80 transition cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="goal">Sort: Goal</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase font-extrabold tracking-wider">
                <th className="py-4 px-5">User ID</th>
                <th className="py-4 px-5">Name</th>
                <th className="py-4 px-4">Age</th>
                <th className="py-4 px-4">Weight</th>
                <th className="py-4 px-5">Goal</th>
                <th className="py-4 px-4">Intensity</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-sm">
                    No matching users found. Try adjusting your search query or filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-slate-800/40 transition group text-slate-300"
                  >
                    {/* User ID */}
                    <td className="py-3.5 px-5 font-mono text-emerald-400 font-bold whitespace-nowrap">
                      {user.userId}
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-5 font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.fullName}</span>
                      </div>
                    </td>

                    {/* Age */}
                    <td className="py-3.5 px-4 whitespace-nowrap">{user.age} yrs</td>

                    {/* Weight */}
                    <td className="py-3.5 px-4 whitespace-nowrap">{user.weight} kg</td>

                    {/* Goal */}
                    <td className="py-3.5 px-5 whitespace-nowrap font-medium text-slate-200">
                      {user.fitnessGoal}
                    </td>

                    {/* Intensity */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.workoutIntensity === 'High'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : user.workoutIntensity === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {user.workoutIntensity}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          user.status === 'Updated'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setModalTab('profile');
                          }}
                          title="View Profile"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setModalTab('original');
                          }}
                          title="View Original Plan"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>

                        {user.updatedPlan && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setModalTab('updated');
                            }}
                            title="View Updated Plan"
                            className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {user.feedbackHistory.length > 0 && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setModalTab('feedback');
                            }}
                            title="View Feedback Logs"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onSelectUserForMainView(user)}
                          title="Open in Main Plan View"
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setUserToDelete(user)}
                          title="Delete User"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          initialTab={modalTab}
          onClose={() => setSelectedUser(null)}
          onSelectUserForMainView={onSelectUserForMainView}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">Delete User Record?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete user <span className="font-bold text-white">{userToDelete.fullName}</span> ({userToDelete.userId})? This will permanently remove their original plan and any feedback history.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(userToDelete.userId)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
