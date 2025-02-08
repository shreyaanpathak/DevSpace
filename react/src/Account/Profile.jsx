import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import { setProfile, setError, setLoading } from "./accountReducer";
import * as client from "./client";
import Navbar from "../Navbar";
import Starfield from "../Home/Starfield";
import MatrixBackground from "../Home/MatrixBackground";
import CircuitBackground from "../Home/CircuitBackground";
import {
  FiEdit2,
  FiGithub,
  FiGlobe,
  FiLinkedin,
  FiTwitter,
  FiMapPin,
  FiMail,
  FiCpu,
  FiCode,
  FiActivity,
  FiStar,
  FiBox,
  FiTrello,
  FiUsers,
  FiCheckCircle,
  FiFolder,
  FiAward,
  FiClock,
  FiBriefcase,
  FiGitPullRequest,
  FiAlertCircle,
  FiTag,
  FiServer,
  FiMessageSquare,
  FiGitBranch,
  FiEye,
  FiPlus,
  FiTrash,
} from "react-icons/fi";

const StatCard = ({ title, value, Icon, change }) => {
  const { theme } = useTheme();

  if (!Icon) {
    console.warn(`StatCard: Icon prop is required for "${title}"`);
    return null;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${theme.panel} rounded-xl p-6 flex items-center gap-4`}
    >
      <div
        className={`p-3 rounded-lg bg-gradient-to-r ${theme.primary} bg-opacity-10`}
      >
        <Icon className="text-2xl text-blue-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-white">{value}</p>
          {change !== null && (
            <span
              className={`text-sm ${
                change > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectCard = ({ project }) => {
  const { theme } = useTheme();
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${theme.panel} rounded-xl p-6 space-y-4`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-white">{project.name}</h3>
            {project.featured && (
              <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                Featured
              </span>
            )}
          </div>
          <p className="text-gray-400 mt-1">{project.description}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            project.status === "Active"
              ? "bg-green-500/20 text-green-400"
              : project.status === "In Progress"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {project.status}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {project.technologies?.map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm
            hover:bg-blue-500/30 transition-colors cursor-default"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="flex items-center gap-2 text-gray-400">
          <FiStar className="text-yellow-400" />
          <span>{project.stars} stars</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <FiActivity className="text-green-400" />
          <span>{project.commits} commits</span>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <div className="flex -space-x-2">
          {project.team?.map((member, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
                flex items-center justify-center text-white text-sm border-2 border-gray-800
                hover:scale-110 transition-transform cursor-pointer"
              title={member}
            >
              {member.charAt(0)}
            </div>
          ))}
        </div>
        <div className="text-gray-400 text-sm flex items-center gap-2">
          <FiClock />
          Last updated {project.lastUpdated}
        </div>
      </div>
    </motion.div>
  );
};

const getActivityIcon = (type) => {
  const iconMap = {
    commit: FiGithub,
    pullRequest: FiGitPullRequest,
    issue: FiAlertCircle,
    review: FiCheckCircle,
    release: FiTag,
    deployment: FiServer,
    comment: FiMessageSquare,
    fork: FiGitBranch,
    watch: FiEye,
    star: FiStar,
    create: FiPlus,
    delete: FiTrash,
    default: FiActivity
  };

  return iconMap[type] || iconMap.default;
};

const ActivityItem = ({ activity }) => {
  const { theme } = useTheme();
  
  const Icon = getActivityIcon(activity.type);

  return (
    <div className="flex gap-4 group">
      <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.primary} bg-opacity-10 h-fit
        group-hover:scale-110 transition-transform`}>
        <Icon className="text-blue-400" />
      </div>
      <div>
        <p className="text-white group-hover:text-blue-400 transition-colors">
          {activity.description}
        </p>
        <p className="text-sm text-gray-400">{activity.time}</p>
      </div>
    </div>
  );
};

const Skill = ({ name, level }) => {
  const { theme } = useTheme();
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-200">{name}</span>
        <span className="text-gray-400">{level}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${theme.primary}`}
        />
      </div>
    </div>
  );
};

export default function Profile() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { currentUser, loading, error, profile } = useSelector(
    (state) => state.account
  );
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser?.id) return;
  
      // Only fetch if we don't already have profile data
      if (!loading && !profile && !error) {
        dispatch(setLoading(true));
        try {
          const profileData = await client.profile(currentUser.id);
          dispatch(setProfile(profileData));
        } catch (err) {
          dispatch(setError(err.message));
        } finally {
          dispatch(setLoading(false));
        }
      }
    };
  
    fetchProfileData();
  }, [currentUser?.id, dispatch, loading, profile, error]); // Add dependencies to prevent unnecessary re-renders
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !currentUser?.id) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await client.uploadProfileImage(currentUser.id, file);
      if (response?.avatarUrl) {
        dispatch(setProfile({ ...profile, avatarUrl: response.avatarUrl }));
      }
    } catch (error) {
      dispatch(setError("Failed to upload image"));
    }
  };

  if (error) {
    return (
      <div
        className={`min-h-screen ${theme.background} flex items-center justify-center`}
      >
        <div className="text-red-400">Error loading profile: {error}</div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-white">
                Featured Projects
              </h2>
              {profile?.projects
                ?.filter((p) => p.featured)
                .map((project, index) => (
                  <ProjectCard key={index} project={project} />
                ))}
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
              <div className={`${theme.panel} rounded-xl p-6 space-y-6`}>
                {profile?.activities?.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        );
      case "projects":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile?.projects?.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        );
      case "skills":
        return (
          <div className={`${theme.panel} rounded-xl p-8`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {profile?.skills?.map((skill, index) => (
                <Skill key={index} {...skill} />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${theme.background}`}>
      <Navbar />
      <Starfield />
      <MatrixBackground />
      <CircuitBackground />

      <div className="min-h-screen pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className={`${theme.panel} rounded-xl p-8`}>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Avatar */}
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`w-32 h-32 rounded-full bg-gradient-to-r ${theme.primary} 
                    flex items-center justify-center text-4xl text-white
                    border-4 border-gray-800 overflow-hidden`}
                >
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile?.username?.[0]?.toUpperCase()
                  )}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-500 
                    text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiEdit2 />
                </motion.button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {profile?.username || currentUser?.username}
                </h1>
                <p className="text-gray-400 mb-4">
                  {profile?.title || "Senior Developer"}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                    <FiMapPin />
                    <span>{profile?.location || "San Francisco, CA"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                    <FiMail />
                    <span>{profile?.email || currentUser?.email}</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-4 justify-center md:justify-start">
                  {profile?.socialLinks?.map((link, index) => (
                    <motion.a
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      className="p-2 rounded-lg bg-gray-800 text-blue-400
                        hover:bg-blue-500 hover:text-white transition-colors"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className={`px-6 py-2 rounded-lg bg-gradient-to-r ${theme.buttonGradient} 
                    text-white font-medium`}
                >
                  Edit Profile
                </motion.button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <StatCard
              title="Total Projects"
              value={profile?.stats?.totalProjects || 0}
              Icon={FiFolder}
              change={2}
            />
            <StatCard
              title="Contributions"
              value={profile?.stats?.contributions || 0}
              Icon={FiCode}
              change={5}
            />
            <StatCard
              title="Team Members"
              value={profile?.stats?.teamMembers || 0}
              Icon={FiUsers}
              change={3}
            />
            <StatCard
              title="Repositories"
              value={profile?.stats?.repositories || 0}
              Icon={FiGithub}
              change={1}
            />
            <StatCard
              title="Active Tasks"
              value={profile?.stats?.activeTasks || 0}
              Icon={FiTrello}
              change={-2}
            />
            <StatCard
              title="Experience"
              value={profile?.stats?.experience || "5 yrs"}
              Icon={FiBriefcase}
              change={null}
            />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700">
            <div className="flex gap-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "projects", label: "Projects" },
                { id: "skills", label: "Skills" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-lg relative ${
                    activeTab === tab.id ? "text-blue-400" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                      initial={false}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>

          {/* Edit Profile Modal */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                onClick={() => setIsEditing(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className={`${theme.panel} rounded-xl p-8 max-w-2xl w-full mx-4`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Edit Profile
                  </h2>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const formData = new FormData(e.target);
                        const updatedData = Object.fromEntries(
                          formData.entries()
                        );
                        const response = await client.updateProfile(
                          currentUser.id,
                          updatedData
                        );
                        dispatch(setProfile(response));
                        setIsEditing(false);
                      } catch (err) {
                        dispatch(setError("Failed to update profile"));
                      }
                    }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 block mb-2">
                          Username
                        </label>
                        <input
                          name="username"
                          type="text"
                          defaultValue={profile?.username}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-2">
                          Title
                        </label>
                        <input
                          name="title"
                          type="text"
                          defaultValue={profile?.title}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-2">
                          Location
                        </label>
                        <input
                          name="location"
                          type="text"
                          defaultValue={profile?.location}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-2">
                          Email
                        </label>
                        <input
                          name="email"
                          type="email"
                          defaultValue={profile?.email}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                        />
                      </div>
                      <div className="flex justify-end gap-4 mt-6">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 rounded-lg bg-gray-800 text-gray-400"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-6 py-2 rounded-lg bg-gradient-to-r ${theme.buttonGradient} 
                            text-white font-medium`}
                        >
                          Save Changes
                        </motion.button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
