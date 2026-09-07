import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { X, Lock, Phone, Trash2, ShieldAlert, Check, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function AccountSettingsModal({ isOpen, onClose, onUpdated }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(auth.getCurrentUser());

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Phone state
  const [phone, setPhone] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Delete state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const user = auth.getCurrentUser();
      setCurrentUser(user);
      setPasswordMsg('');
      setPasswordError('');
      setPhoneMsg('');
      setPhoneError('');
      setConfirmDelete(false);
      setDeleteError('');

      if (user) {
        // Fetch latest phone from profile or user
        db.getProfile(user.uid)
          .then(p => {
            if (p && p.phone) setPhone(p.phone);
            else if (user.phone) setPhone(user.phone);
          })
          .catch(() => {
            if (user.phone) setPhone(user.phone);
          });
      }
    }
  }, [isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      await auth.changePassword(currentUser.uid, oldPassword, newPassword);
      setPasswordMsg('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    setPhoneMsg('');
    setPhoneError('');

    if (!phone.trim()) {
      setPhoneError('Please enter a valid phone number.');
      return;
    }

    setPhoneLoading(true);
    try {
      await auth.updatePhone(currentUser.uid, phone.trim());
      setPhoneMsg('Phone number updated successfully!');
      if (onUpdated) onUpdated({ phone: phone.trim() });
    } catch (err) {
      setPhoneError(err.message || 'Failed to update phone number.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError('');

    try {
      await auth.deleteAccount(currentUser.uid);
      onClose();
      navigate('/', { replace: true });
      window.location.reload();
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account.');
      setDeleteLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass"
        style={{
          maxWidth: '560px',
          width: '100%',
          borderRadius: '20px',
          padding: 'clamp(20px, 4vw, 32px)',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-color)',
          color: '#0f172a'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px',
          marginBottom: '24px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Account Settings
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {currentUser.email} • <strong style={{ textTransform: 'capitalize', color: 'var(--primary-green)' }}>{currentUser.role}</strong>
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Change Phone Number */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={18} color="var(--primary-green)" /> Phone Number
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
            Direct contact phone number used for confidential inquiries and account notifications.
          </p>

          {phoneMsg && (
            <div style={{ background: 'rgba(0, 209, 108, 0.15)', border: '1px solid var(--primary-green)', color: '#008744', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', fontWeight: 600 }}>
              {phoneMsg}
            </div>
          )}
          {phoneError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', fontWeight: 600 }}>
              {phoneError}
            </div>
          )}

          <form onSubmit={handleUpdatePhone} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="tel"
              className="form-input"
              style={{ background: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1' }}
              placeholder="e.g. +234 803 123 4567 or +33 6 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              type="submit"
              disabled={phoneLoading}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.88rem', width: 'fit-content' }}
            >
              {phoneLoading ? 'Saving...' : 'Update Phone Number'}
            </button>
          </form>
        </div>

        {/* Section 2: Change Password */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} color="var(--secondary-orange)" /> Change Password
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
            Update your account login password. Must be at least 6 characters.
          </p>

          {passwordMsg && (
            <div style={{ background: 'rgba(0, 209, 108, 0.15)', border: '1px solid var(--primary-green)', color: '#008744', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', fontWeight: 600 }}>
              {passwordMsg}
            </div>
          )}
          {passwordError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', fontWeight: 600 }}>
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Current Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  style={{ background: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1', width: '100%', paddingRight: '40px' }}
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '4px' }}>New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                style={{ background: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1' }}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                style={{ background: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1' }}
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.88rem', width: 'fit-content' }}
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Section 3: Delete Account (Danger Zone) */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#dc2626', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#dc2626" /> Delete Account
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
            Permanently delete your account and all associated profile information, metrics, and media. This action cannot be undone.
          </p>

          {deleteError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', fontWeight: 600 }}>
              {deleteError}
            </div>
          )}

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              style={{
                background: '#ffffff',
                border: '1px solid #ef4444',
                color: '#dc2626',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Trash2 size={16} /> Delete Account
            </button>
          ) : (
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #fca5a5' }}>
              <p style={{ fontSize: '0.9rem', color: '#b91c1c', fontWeight: 700, marginBottom: '12px' }}>
                Are you absolutely sure? This action is permanent!
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleDeleteAccount}
                  style={{
                    background: '#dc2626',
                    border: 'none',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
