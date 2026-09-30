import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPickup, clearCreateSuccess } from '../../store/pickupSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const WASTE_CATEGORIES = [
  { value: 'PLASTIC', label: 'Plastic (Bottles, Packaging, Containers)' },
  { value: 'PAPER', label: 'Paper & Cardboard (Newspapers, Boxes)' },
  { value: 'GLASS', label: 'Glass (Bottles, Jars)' },
  { value: 'METAL', label: 'Metal & Aluminum (Cans, Scrap Metal)' },
  { value: 'ORGANIC', label: 'Organic / Food Waste' },
  { value: 'E_WASTE', label: 'E-Waste (Electronics, Appliances, Cables)' },
  { value: 'MIXED', label: 'Mixed Recyclables' },
  { value: 'OTHER', label: 'Other Waste Materials' },
];

const TIME_SLOTS = [
  '09:00 AM - 12:00 PM (Morning)',
  '12:00 PM - 03:00 PM (Afternoon)',
  '03:00 PM - 06:00 PM (Evening)',
];

const SERVICE_AREAS = [
  { value: 'Zone 1', label: 'Zone 1' },
  { value: 'Zone 2', label: 'Zone 2' },
  { value: 'Zone 3', label: 'Zone 3' },
  { value: 'Zone 4', label: 'Zone 4' },
];

const CreatePickupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { creating, error } = useSelector((state) => state.pickups);

  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [formData, setFormData] = useState({
    wasteCategory: 'PLASTIC',
    description: '',
    pickupAddress: '',
    serviceArea: 'Zone 1',
    preferredDate: getTodayString(),
    preferredTime: TIME_SLOTS[0],
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.wasteCategory) errors.wasteCategory = 'Waste category is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.pickupAddress.trim()) errors.pickupAddress = 'Pickup address is required';
    if (!formData.preferredDate) {
      errors.preferredDate = 'Preferred date is required';
    } else if (formData.preferredDate < getTodayString()) {
      errors.preferredDate = 'Date cannot be in the past';
    }
    if (!formData.preferredTime) errors.preferredTime = 'Preferred time slot is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || creating) return;

    const resultAction = await dispatch(createPickup(formData));
    if (createPickup.fulfilled.match(resultAction)) {
      dispatch(clearCreateSuccess());
      const newPickup = resultAction.payload;
      navigate(`/customer/pickups/${newPickup.id}`);
    }
  };

  return (
    <div className="create-pickup-page-wrapper">
      <button className="btn-back-link" onClick={() => navigate('/customer/pickups')}>
        <ArrowBackIcon fontSize="small" /> Back to My Pickups
      </button>

      <div className="form-card-container">
        <div className="form-card-header">
          <h2>Request Waste Pickup</h2>
          <p>Fill in the details below to schedule a waste collection request.</p>
        </div>

        {error && (
          <Alert severity="error" className="form-alert-message">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate className="pickup-request-form">
          {/* Waste Category */}
          <div className="form-group-item">
            <label className="field-label">Waste Category *</label>
            <select
              name="wasteCategory"
              value={formData.wasteCategory}
              onChange={handleChange}
              className={`custom-select-input ${formErrors.wasteCategory ? 'has-error' : ''}`}
              disabled={creating}
            >
              {WASTE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {formErrors.wasteCategory && (
              <span className="field-error-text">{formErrors.wasteCategory}</span>
            )}
          </div>

          {/* Description */}
          <div className="form-group-item">
            <label className="field-label">Description & Quantity *</label>
            <textarea
              name="description"
              rows={3}
              placeholder="e.g. Approximately 3 bags of plastic packaging and bottles."
              value={formData.description}
              onChange={handleChange}
              className={`custom-textarea-input ${formErrors.description ? 'has-error' : ''}`}
              disabled={creating}
            />
            {formErrors.description && (
              <span className="field-error-text">{formErrors.description}</span>
            )}
          </div>

          {/* Service Area */}
          <div className="form-group-item">
            <label className="field-label">Service Area / Zone *</label>
            <select
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              className="custom-select-input"
              disabled={creating}
            >
              {SERVICE_AREAS.map((area) => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
          </div>

          {/* Pickup Address */}
          <div className="form-group-item">
            <label className="field-label">Pickup Address *</label>
            <textarea
              name="pickupAddress"
              rows={2}
              placeholder="Enter your complete street address, house/apt number, landmark..."
              value={formData.pickupAddress}
              onChange={handleChange}
              className={`custom-textarea-input ${formErrors.pickupAddress ? 'has-error' : ''}`}
              disabled={creating}
            />
            {formErrors.pickupAddress && (
              <span className="field-error-text">{formErrors.pickupAddress}</span>
            )}
          </div>

          {/* Date & Time Row */}
          <div className="form-row-two-col">
            <div className="form-group-item">
              <label className="field-label">Preferred Date *</label>
              <input
                type="date"
                name="preferredDate"
                min={getTodayString()}
                value={formData.preferredDate}
                onChange={handleChange}
                className={`custom-text-input ${formErrors.preferredDate ? 'has-error' : ''}`}
                disabled={creating}
              />
              {formErrors.preferredDate && (
                <span className="field-error-text">{formErrors.preferredDate}</span>
              )}
            </div>

            <div className="form-group-item">
              <label className="field-label">Preferred Time Slot *</label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className={`custom-select-input ${formErrors.preferredTime ? 'has-error' : ''}`}
                disabled={creating}
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {formErrors.preferredTime && (
                <span className="field-error-text">{formErrors.preferredTime}</span>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions-row">
            <button
              type="button"
              className="btn-form-cancel"
              onClick={() => navigate('/customer/pickups')}
              disabled={creating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-form-submit"
              disabled={creating}
            >
              {creating ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <AddCircleOutlinedIcon fontSize="small" /> Submit Pickup Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePickupPage;
