import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2, 
  LogOut, 
  ShieldCheck, 
  Edit3,
  Check,
  Keyboard
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import VirtualKeyboard from '../components/VirtualKeyboard';

export const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile'); // profile, addresses
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // Addresses state
  const [addresses, setAddresses] = useState(user?.addresses || [
    {
      _id: 'default_1',
      label: 'Home',
      fullAddress: '123, Palm Grove Avenue, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      landmark: 'Near Metro Station',
      isDefault: true
    }
  ]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    fullAddress: '',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '',
    landmark: ''
  });

  // Virtual keyboard state
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [activeInputName, setActiveInputName] = useState('name');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({ name, phone });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.fullAddress.trim() || !newAddress.pincode.trim()) {
      toast.error('Please enter full address and pincode.');
      return;
    }
    const updated = [...addresses, { ...newAddress, _id: Date.now().toString() }];
    setAddresses(updated);
    updateUser({ addresses: updated });
    setShowAddAddress(false);
    setNewAddress({ label: 'Home', fullAddress: '', city: 'Bangalore', state: 'Karnataka', pincode: '', landmark: '' });
    toast.success('Address added successfully!');
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(a => a._id !== id);
    setAddresses(updated);
    updateUser({ addresses: updated });
    toast.success('Address removed');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl text-dark-900 tracking-tight">
            Account Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your personal credentials, contact info, and delivery hubs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setKeyboardOpen(!keyboardOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-dark-800 hover:border-brand-400 shadow-xs transition-all"
            title="Toggle Virtual Keyboard for Hands-Free typing"
          >
            <Keyboard className="w-4 h-4 text-brand-500" />
            <span>Virtual Keyboard</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-brand-500 text-white shadow-brand'
              : 'text-dark-700 hover:bg-gray-100'
          }`}
        >
          Personal Details
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'addresses'
              ? 'bg-brand-500 text-white shadow-brand'
              : 'text-dark-700 hover:bg-gray-100'
          }`}
        >
          Saved Addresses ({addresses.length})
        </button>
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-card">
          <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-500 to-amber-400 text-white font-black text-2xl flex items-center justify-center shadow-brand">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-dark-900">{user?.name}</h3>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Member
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-dark-800 text-xs font-bold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel' : 'Edit Info'}</span>
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onFocus={() => setActiveInputName('name')}
                  onChange={(e) => setName(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onFocus={() => setActiveInputName('phone')}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="input text-xs"
                />
              </div>

              <button
                type="submit"
                className="btn-primary text-xs py-2.5 px-5"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-cream-50/80 rounded-2xl border border-gray-100">
                <span className="text-gray-400 font-bold block mb-1">EMAIL ADDRESS</span>
                <span className="font-bold text-dark-900">{user?.email}</span>
              </div>
              <div className="p-4 bg-cream-50/80 rounded-2xl border border-gray-100">
                <span className="text-gray-400 font-bold block mb-1">MOBILE CONTACT</span>
                <span className="font-bold text-dark-900">{user?.phone || 'Not provided'}</span>
              </div>
              <div className="p-4 bg-cream-50/80 rounded-2xl border border-gray-100">
                <span className="text-gray-400 font-bold block mb-1">ACCOUNT ROLE</span>
                <span className="font-bold text-dark-900 uppercase">{user?.role || 'user'}</span>
              </div>
              <div className="p-4 bg-cream-50/80 rounded-2xl border border-gray-100">
                <span className="text-gray-400 font-bold block mb-1">MEMBER SINCE</span>
                <span className="font-bold text-dark-900">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-brand transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* New address form */}
          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="bg-white rounded-3xl p-6 border border-brand-200 shadow-card space-y-4">
              <h3 className="font-display font-bold text-dark-900 text-base">New Delivery Address</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Address Label</label>
                  <select
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    className="input text-xs"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Landmark</label>
                  <input
                    type="text"
                    value={newAddress.landmark}
                    onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                    placeholder="Near Metro Station"
                    className="input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={newAddress.fullAddress}
                  onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                  placeholder="House No, Building, Street"
                  className="input text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="input text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary text-xs py-2 px-5">
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-dark-800 text-xs font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* List of addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-card flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-lg">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {addr.fullAddress}, {addr.landmark ? `Near ${addr.landmark}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
                </p>

                <div className="text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                  Ready for instant 1-click delivery
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Hands-Free Virtual Keyboard Drawer */}
      <VirtualKeyboard
        isOpen={keyboardOpen}
        onClose={() => setKeyboardOpen(false)}
        onKeyPress={(char) => {
          if (activeInputName === 'name') setName(prev => prev + char);
          if (activeInputName === 'phone') setPhone(prev => prev + char);
        }}
        onBackspace={() => {
          if (activeInputName === 'name') setName(prev => prev.slice(0, -1));
          if (activeInputName === 'phone') setPhone(prev => prev.slice(0, -1));
        }}
        onSubmit={() => setKeyboardOpen(false)}
      />

    </div>
  );
};

export default ProfilePage;
