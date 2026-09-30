import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyComplaints, createComplaint, clearComplaintError, clearComplaintSuccess } from '../../store/complaintSlice';
import { fetchMyPickups } from '../../store/pickupSlice';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { formatCategory, formatDateTime } from '../../utils/formatters';

const CustomerComplaintsPage = () => {
  const dispatch = useDispatch();
  const { complaints, loading, submitting, error, successMessage } = useSelector((state) => state.complaints || { complaints: [] });
  const { pickups } = useSelector((state) => state.pickups || { pickups: [] });

  const [openModal, setOpenModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [pickupId, setPickupId] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchMyComplaints());
    dispatch(fetchMyPickups());
  }, [dispatch]);

  const handleOpenModal = () => {
    setSubject('');
    setDescription('');
    setPickupId('');
    setFormError('');
    dispatch(clearComplaintError());
    dispatch(clearComplaintSuccess());
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || subject.trim().length < 3) {
      setFormError('Subject must be at least 3 characters long.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setFormError('Description must be at least 10 characters long.');
      return;
    }

    const payload = {
      subject: subject.trim(),
      description: description.trim(),
      pickupId: pickupId ? Number(pickupId) : null,
    };

    const res = await dispatch(createComplaint(payload));
    if (!res.error) {
      setOpenModal(false);
    }
  };

  const getStatusIconBox = (status) => {
    switch (status) {
      case 'OPEN':
        return (
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <HourglassEmptyIcon fontSize="small" />
          </div>
        );
      case 'UNDER_REVIEW':
        return (
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ReportProblemIcon fontSize="small" />
          </div>
        );
      case 'RESOLVED':
        return (
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircleOutlinedIcon fontSize="small" />
          </div>
        );
      default:
        return (
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ReportProblemIcon fontSize="small" />
          </div>
        );
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'OPEN':
        return <Chip label="OPEN" size="small" sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 800, borderRadius: '6px', fontSize: '0.725rem' }} />;
      case 'UNDER_REVIEW':
        return <Chip label="UNDER REVIEW" size="small" sx={{ bgcolor: '#DBEAFE', color: '#1D4ED8', fontWeight: 800, borderRadius: '6px', fontSize: '0.725rem' }} />;
      case 'RESOLVED':
        return <Chip label="RESOLVED" size="small" sx={{ bgcolor: '#ECFDF5', color: '#047857', fontWeight: 800, borderRadius: '6px', fontSize: '0.725rem' }} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Welcome & Action Banner */}
      <section style={{
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #CBD5E1',
        borderRadius: '12px',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
            Customer Support & Complaints
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: '#64748B' }}>
            Report service issues, missed collections, or collector feedback directly to administration.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="btn-primary-action"
        >
          <AddCircleOutlinedIcon fontSize="small" />
          File New Complaint
        </button>
      </section>

      {successMessage && (
        <Alert severity="success" onClose={() => dispatch(clearComplaintSuccess())}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearComplaintError())}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <CircularProgress style={{ color: '#395F51' }} />
        </div>
      ) : complaints.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1.5px solid #CBD5E1',
          padding: '50px 20px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          <ReportProblemIcon style={{ fontSize: '56px', color: '#94A3B8', marginBottom: '12px' }} />
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>No Complaints Recorded</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B' }}>
            You haven't filed any support issues or complaints yet.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {complaints.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedComplaint(item)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {getStatusIconBox(item.status)}
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                      Ticket #{item.id}
                    </span>
                  </div>
                  {getStatusChip(item.status)}
                </div>

                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                  {item.subject}
                </h4>

                <p style={{
                  margin: '0 0 12px 0',
                  fontSize: '0.875rem',
                  color: '#475569',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.description}
                </p>

                {item.pickupId && (
                  <div style={{ fontSize: '0.8rem', color: '#395F51', fontWeight: 700, marginBottom: '8px' }}>
                    Linked Pickup #{item.pickupId} {item.pickupCategory ? `(${formatCategory(item.pickupCategory)})` : ''}
                  </div>
                )}

                {item.adminResponse && (
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderLeft: '4px solid #395F51',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    marginTop: '8px',
                    fontSize: '0.825rem',
                    color: '#334155'
                  }}>
                    <strong style={{ color: '#0F172A' }}>Admin Response:</strong> {item.adminResponse}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', fontSize: '0.775rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                <span>Filed: {formatDateTime(item.createdAt)}</span>
                <span style={{ fontWeight: 700, color: '#395F51' }}>View Ticket →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Complaint Modal Dialog */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            borderRadius: '16px',
            border: '1.5px solid #CBD5E1',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 800,
          color: '#0F172A',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <ReportProblemIcon style={{ color: '#395F51' }} />
          <span>File a Complaint or Support Ticket</span>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ padding: '24px', fontFamily: "'Inter', sans-serif" }}>
            {formError && <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px', fontFamily: "'Inter', sans-serif" }}>{formError}</Alert>}

            <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
              Submit details regarding your service issue, missed schedule, or collector feedback. Our team will investigate promptly.
            </p>

            <TextField
              label="Subject / Issue Topic"
              fullWidth
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Missed pickup schedule, Collector feedback"
              sx={{
                mb: 2.5,
                '& .MuiInputBase-root': { fontFamily: "'Inter', sans-serif" },
                '& .MuiInputLabel-root': { fontFamily: "'Inter', sans-serif" },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&.Mui-focused fieldset': { borderColor: '#395F51' }
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#395F51' }
              }}
            />

            <TextField
              select
              label="Related Pickup Request (Optional)"
              fullWidth
              value={pickupId}
              onChange={(e) => setPickupId(e.target.value)}
              sx={{
                mb: 2.5,
                '& .MuiInputBase-root': { fontFamily: "'Inter', sans-serif" },
                '& .MuiInputLabel-root': { fontFamily: "'Inter', sans-serif" },
                '& .MuiFormHelperText-root': { fontFamily: "'Inter', sans-serif" },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&.Mui-focused fieldset': { borderColor: '#395F51' }
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#395F51' }
              }}
              helperText="Select a pickup if this complaint concerns a specific request"
            >
              <MenuItem value="" sx={{ fontFamily: "'Inter', sans-serif" }}>-- None / General Complaint --</MenuItem>
              {pickups.map((p) => (
                <MenuItem key={p.id} value={p.id} sx={{ fontFamily: "'Inter', sans-serif" }}>
                  Pickup #{p.id} ({formatCategory(p.wasteCategory)} - {p.status})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Detailed Description"
              fullWidth
              required
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe your issue in detail so our administration team can review and resolve it promptly."
              sx={{
                '& .MuiInputBase-root': { fontFamily: "'Inter', sans-serif" },
                '& .MuiInputLabel-root': { fontFamily: "'Inter', sans-serif" },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '&.Mui-focused fieldset': { borderColor: '#395F51' }
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#395F51' }
              }}
            />
          </DialogContent>

          <DialogActions sx={{ padding: '16px 24px', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
            <Button onClick={handleCloseModal} disabled={submitting} sx={{ color: '#64748B', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                bgcolor: '#395F51',
                '&:hover': { bgcolor: '#2C4A3F' },
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                borderRadius: '8px',
                padding: '10px 22px',
                textTransform: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {submitting ? <CircularProgress size={24} style={{ color: '#FFF' }} /> : 'Submit Complaint'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Complaint Detail Dialog */}
      <Dialog
        open={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            borderRadius: '16px',
            border: '1.5px solid #CBD5E1',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden'
          }
        }}
      >
        {selectedComplaint && (
          <>
            <DialogTitle sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, color: '#0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '20px 24px' }}>
              <span>Complaint Ticket #{selectedComplaint.id}</span>
              {getStatusChip(selectedComplaint.status)}
            </DialogTitle>
            <DialogContent dividers sx={{ fontFamily: "'Inter', sans-serif", padding: '24px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#0F172A', fontSize: '1.1rem', fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>
                {selectedComplaint.subject}
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
                {selectedComplaint.description}
              </p>

              {selectedComplaint.pickupId && (
                <div style={{ marginTop: '14px', padding: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
                  <strong style={{ color: '#0F172A' }}>Linked Pickup Request:</strong> #{selectedComplaint.pickupId} ({formatCategory(selectedComplaint.pickupCategory)})
                </div>
              )}

              {selectedComplaint.adminResponse ? (
                <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}>
                  <strong style={{ color: '#065F46', display: 'block', marginBottom: '4px', fontWeight: 800 }}>Admin Resolution & Response:</strong>
                  <span style={{ color: '#047857', whiteSpace: 'pre-wrap' }}>{selectedComplaint.adminResponse}</span>
                </div>
              ) : (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '8px', fontSize: '0.85rem', color: '#92400E', fontFamily: "'Inter', sans-serif" }}>
                  Pending administration review and official response.
                </div>
              )}

              <div style={{ marginTop: '16px', fontSize: '0.775rem', color: '#64748B', fontFamily: "'Inter', sans-serif" }}>
                Filed on: {formatDateTime(selectedComplaint.createdAt)}
              </div>
            </DialogContent>
            <DialogActions sx={{ p: 2, backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
              <Button onClick={() => setSelectedComplaint(null)} sx={{ color: '#395F51', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </div>
  );
};

export default CustomerComplaintsPage;
