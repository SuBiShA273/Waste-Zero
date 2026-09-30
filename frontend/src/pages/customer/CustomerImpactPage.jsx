import React, { useEffect, useState } from 'react';
import { impactService } from '../../services/impactService';
import ParkIcon from '@mui/icons-material/Park';
import Co2Icon from '@mui/icons-material/Co2';
import RecyclingIcon from '@mui/icons-material/Recycling';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { formatCategory, formatDateTime } from '../../utils/formatters';

const CustomerImpactPage = () => {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await impactService.getMyImpact();
        setImpactData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load environmental impact data');
      } finally {
        setLoading(false);
      }
    };
    fetchImpact();
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'PLASTIC': return '#0EA5E9';
      case 'PAPER': return '#D97706';
      case 'GLASS': return '#059669';
      case 'METAL': return '#4F46E5';
      case 'ORGANIC': return '#65A30D';
      case 'E_WASTE': return '#EA580C';
      case 'MIXED': return '#475569';
      default: return '#395F51';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <CircularProgress style={{ color: '#395F51' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '20px auto' }}>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  const { totalWasteRecycled = 0, totalCo2Saved = 0, categoryImpacts = [], recycledPickups = [], disclaimer } = impactData || {};

  return (
    <div className="impact-page-container" style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Disclaimer Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #CBD5E1',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#EFF6FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1D4ED8',
          flexShrink: 0
        }}>
          <InfoOutlinedIcon fontSize="small" />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>Informational Estimate Disclaimer</h4>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
            {disclaimer || 'Estimated values calculated using standard waste category emission factors.'}
          </p>
        </div>
      </div>

      {/* Top Overview Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* Total Waste Recycled Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#F2F6F4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#395F51',
            flexShrink: 0
          }}>
            <RecyclingIcon style={{ fontSize: '28px' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, display: 'block' }}>
              Total Waste Recycled
            </span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
              {totalWasteRecycled} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>kg</span>
            </span>
          </div>
        </div>

        {/* Estimated CO2 Avoided Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#ECFDF5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#059669',
            flexShrink: 0
          }}>
            <Co2Icon style={{ fontSize: '32px' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, display: 'block' }}>
              Est. CO₂e Avoided
            </span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
              {totalCo2Saved} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>kg CO₂e</span>
            </span>
          </div>
        </div>

        {/* Recycled Batches Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1D4ED8',
            flexShrink: 0
          }}>
            <ParkIcon style={{ fontSize: '28px' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, display: 'block' }}>
              Recycled Batches
            </span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
              {recycledPickups.length} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>pickups</span>
            </span>
          </div>
        </div>

      </div>

      {/* Waste Breakdown By Category Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1.5px solid #CBD5E1',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
          Environmental Impact by Waste Category
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
          {categoryImpacts.map((catItem) => {
            const catColor = getCategoryColor(catItem.category);
            return (
              <div
                key={catItem.category}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
                    {formatCategory(catItem.category)}
                  </span>
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '6px',
                    backgroundColor: catColor + '15',
                    color: catColor
                  }}>
                    {catItem.conversionFactor}x Factor
                  </span>
                </div>
                
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                  {catItem.totalWeight} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748B' }}>kg</span>
                </div>

                <div style={{ fontSize: '0.825rem', color: '#475569', fontWeight: 600 }}>
                  ≈ {catItem.co2Saved} kg CO₂e avoided
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recycled Pickups History List Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1.5px solid #CBD5E1',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
          Recent Recycled Pickups Log
        </h3>

        {recycledPickups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
            <LocalShippingIcon style={{ fontSize: '48px', color: '#94A3B8', marginBottom: '8px' }} />
            <h4 style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>No confirmed recycled pickups logged yet</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              Pickups count toward your environmental impact after an admin confirms them as RECYCLED.
            </p>
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Pickup ID</th>
                  <th>Category</th>
                  <th>Actual Weight</th>
                  <th>CO₂e Avoided</th>
                  <th>Recycled Date</th>
                </tr>
              </thead>
              <tbody>
                {recycledPickups.map((pickup) => (
                  <tr key={pickup.id}>
                    <td className="font-semibold" style={{ color: '#0F172A' }}>#WZ-{pickup.id}</td>
                    <td>{formatCategory(pickup.wasteCategory)}</td>
                    <td className="font-semibold" style={{ color: '#0F172A' }}>
                      {pickup.actualWeight} kg
                    </td>
                    <td className="font-semibold" style={{ color: '#395F51' }}>
                      {Math.round((pickup.actualWeight * 1.5) * 100) / 100} kg CO₂e
                    </td>
                    <td style={{ color: '#64748B' }}>
                      {pickup.recycledAt ? formatDateTime(pickup.recycledAt) : 'Recycled'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default CustomerImpactPage;
