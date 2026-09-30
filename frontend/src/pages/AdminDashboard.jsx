import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { pickupService } from '../services/pickupService';
import { complaintService } from '../services/complaintService';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RecyclingIcon from '@mui/icons-material/Recycling';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('recycling'); // 'recycling' | 'complaints'
  const [pickups, setPickups] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recycling Dialog state
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [recyclingNotes, setRecyclingNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Complaint Response Dialog state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintStatus, setComplaintStatus] = useState('RESOLVED');
  const [adminResponse, setAdminResponse] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pickupData, complaintData] = await Promise.all([
        pickupService.getAllAdminPickups(),
        complaintService.adminUpdateComplaint ? complaintService.getMyComplaints() : Promise.resolve([])
      ]);
      setPickups(pickupData);
      setComplaints(complaintData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmRecycle = async () => {
    if (!selectedPickup) return;
    try {
      setActionLoading(true);
      await pickupService.recyclePickup(selectedPickup.id, { recyclingNotes });
      setSelectedPickup(null);
      setRecyclingNotes('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to recycle pickup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;
    try {
      setActionLoading(true);
      await complaintService.adminUpdateComplaint(selectedComplaint.id, {
        status: complaintStatus,
        adminResponse,
      });
      setSelectedComplaint(null);
      setAdminResponse('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update complaint');
    } finally {
      setActionLoading(false);
    }
  };

  const collectedPickups = pickups.filter((p) => p.status === 'COLLECTED');

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <header className="dashboard-navbar admin" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: '#0F172A', color: '#FFF' }}>
        <div className="dashboard-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AutorenewIcon fontSize="medium" style={{ color: '#10B981' }} />
          <span className="dashboard-logo-title" style={{ fontWeight: 800, fontSize: '1.2rem' }}>WasteZero | Admin Management</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.875rem', color: '#94A3B8' }}>{user?.email}</span>
          <button className="btn-logout" onClick={logout} style={{ backgroundColor: '#DC2626', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content" style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('recycling')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'recycling' ? '#395F51' : '#FFFFFF',
              color: activeTab === 'recycling' ? '#FFFFFF' : '#475569',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <RecyclingIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Recycling Confirmation ({collectedPickups.length} Collected)
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'complaints' ? '#395F51' : '#FFFFFF',
              color: activeTab === 'complaints' ? '#FFFFFF' : '#475569',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <ReportProblemIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Complaints Management ({complaints.length})
          </button>
        </div>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <CircularProgress style={{ color: '#395F51' }} />
          </div>
        ) : activeTab === 'recycling' ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1.5px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0F172A' }}>Collected Pickups Ready for Recycling Confirmation</h3>
            {collectedPickups.length === 0 ? (
              <p style={{ color: '#64748B' }}>No pickups are currently in COLLECTED status awaiting recycling confirmation.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '12px' }}>ID</th>
                      <th style={{ padding: '12px' }}>Customer</th>
                      <th style={{ padding: '12px' }}>Category</th>
                      <th style={{ padding: '12px' }}>Actual Weight</th>
                      <th style={{ padding: '12px' }}>Collector</th>
                      <th style={{ padding: '12px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectedPickups.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px', fontWeight: 700 }}>#{p.id}</td>
                        <td style={{ padding: '12px' }}>{p.customerName}</td>
                        <td style={{ padding: '12px' }}>{p.wasteCategory}</td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#395F51' }}>{p.actualWeight} kg</td>
                        <td style={{ padding: '12px' }}>{p.collectorName || 'Unassigned'}</td>
                        <td style={{ padding: '12px' }}>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' }, fontWeight: 700 }}
                            onClick={() => {
                              setSelectedPickup(p);
                              setRecyclingNotes('');
                            }}
                          >
                            Confirm RECYCLED
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1.5px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0F172A' }}>Customer Complaints & Support Overview</h3>
            {complaints.length === 0 ? (
              <p style={{ color: '#64748B' }}>No complaints filed.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '12px' }}>ID</th>
                      <th style={{ padding: '12px' }}>Subject</th>
                      <th style={{ padding: '12px' }}>Customer</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Filed Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px', fontWeight: 700 }}>#{c.id}</td>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{c.subject}</td>
                        <td style={{ padding: '12px' }}>{c.customerName || c.customerEmail}</td>
                        <td style={{ padding: '12px', fontWeight: 700 }}>{c.status}</td>
                        <td style={{ padding: '12px', color: '#64748B' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Recycle Confirmation Dialog */}
      <Dialog open={Boolean(selectedPickup)} onClose={() => setSelectedPickup(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A' }}>
          Recycling Confirmation - Pickup #{selectedPickup?.id}
        </DialogTitle>
        <DialogContent dividers>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#475569' }}>
            Category: <strong>{selectedPickup?.wasteCategory}</strong> | Actual Weight: <strong>{selectedPickup?.actualWeight} kg</strong>
          </p>
          <TextField
            label="Recycling Notes"
            fullWidth
            multiline
            rows={3}
            value={recyclingNotes}
            onChange={(e) => setRecyclingNotes(e.target.value)}
            placeholder="Add facility details or notes..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedPickup(null)} disabled={actionLoading}>Cancel</Button>
          <Button onClick={handleConfirmRecycle} variant="contained" disabled={actionLoading} sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' } }}>
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirm RECYCLED'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
