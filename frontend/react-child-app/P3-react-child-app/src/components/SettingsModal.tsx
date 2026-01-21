import { useState, useEffect } from "react";
import { updateUserProfile } from "../api/userProfile";
import type { User } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdate: (updatedUser: User) => void;
}

const SettingsModal = ({ isOpen, onClose, user, onUserUpdate }: SettingsModalProps) => {
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    displayImage: user.displayImage || "",
    level: user.level,
    canSell: user.canSell,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"account" | "privacy" | "security" | "billing">("account");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        displayName: user.displayName,
        displayImage: user.displayImage || "",
        level: user.level,
        canSell: user.canSell,
      });
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updates: any = {};
      if (formData.displayName !== user.displayName) updates.displayName = formData.displayName;
      if (formData.displayImage !== user.displayImage) updates.displayImage = formData.displayImage;
      if (formData.level !== user.level) updates.level = formData.level;
      if (formData.canSell !== user.canSell) updates.canSell = formData.canSell;

      if (Object.keys(updates).length === 0) {
        setSuccessMessage("No changes to save");
        setIsLoading(false);
        return;
      }

      const updatedUser = await updateUserProfile(user.id, updates);
      onUserUpdate(updatedUser);
      setSuccessMessage("Profile updated successfully!");
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-black uppercase tracking-wider text-[#822C2C]">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-[#0a0a0a] px-6">
          {(["account", "privacy", "security", "billing"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? "text-[#822C2C] border-b-2 border-[#822C2C]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Account Tab */}
          {activeTab === "account" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Display Name */}
              <div>
                <label htmlFor="displayName" className="block text-sm font-bold uppercase tracking-wider mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#822C2C] focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Display Image URL */}
              <div>
                <label htmlFor="displayImage" className="block text-sm font-bold uppercase tracking-wider mb-2">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  id="displayImage"
                  name="displayImage"
                  value={formData.displayImage}
                  onChange={handleChange}
                  placeholder="https://api.dicebear.com/7.x/avataaars/svg?seed=YourName"
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#822C2C] focus:outline-none transition-colors"
                />
                {formData.displayImage && (
                  <div className="mt-3 flex items-center space-x-3">
                    <img
                      src={formData.displayImage}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg border-2 border-white/10"
                    />
                    <span className="text-xs text-gray-500">Preview</span>
                  </div>
                )}
              </div>

              {/* User Level */}
              <div>
                <label htmlFor="level" className="block text-sm font-bold uppercase tracking-wider mb-2">
                  Account Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#822C2C] focus:outline-none transition-colors"
                >
                  <option value="USER">User</option>
                  <option value="DEVELOPER">Developer</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  Developers can upload and sell games
                </p>
              </div>

              {/* Can Sell Toggle */}
              <div className="flex items-center justify-between bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
                <div>
                  <label htmlFor="canSell" className="block text-sm font-bold uppercase tracking-wider">
                    Enable Selling
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Allow selling games on the marketplace
                  </p>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    id="canSell"
                    name="canSell"
                    checked={formData.canSell}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-full h-full bg-gray-700 rounded-full peer-checked:bg-[#822C2C] transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                </label>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}
              {successMessage && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                  <p className="text-green-500 text-sm">{successMessage}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#822C2C] hover:bg-[#a13737] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold uppercase text-sm py-3 rounded-lg transition-all"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-sm py-3 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Privacy settings coming soon...</p>
              <div className="space-y-3">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-bold uppercase mb-2">Profile Visibility</h3>
                  <p className="text-xs text-gray-500">Control who can see your profile and gaming activity</p>
                </div>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-bold uppercase mb-2">Friends List</h3>
                  <p className="text-xs text-gray-500">Manage who can see your friends list</p>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Security settings are managed in the main application.</p>
              <div className="space-y-3">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-bold uppercase mb-2">Session Management</h3>
                  <p className="text-xs text-gray-500">View active sessions and device logins</p>
                </div>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-bold uppercase mb-2">Activity Log</h3>
                  <p className="text-xs text-gray-500">Review recent account activity and changes</p>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">Billing settings coming soon...</p>
              <div className="space-y-3">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-bold uppercase mb-2">Payment Methods</h3>
                  <p className="text-xs text-gray-500">Manage your payment methods and billing info</p>
                </div>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-bold uppercase mb-2">Transaction History</h3>
                  <p className="text-xs text-gray-500">View your purchase history and invoices</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
