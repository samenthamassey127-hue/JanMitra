// Direct Benefit Transfer (DBT) & NPCI Aadhaar Seeding Adapter
// Simulates PFMS / NPCI Aadhaar Payment Bridge System (APBS) status checks

export const dbtAdapter = {
  checkSeedingStatus(aadhaarLast4) {
    if (!aadhaarLast4 || !/^\d{4}$/.test(aadhaarLast4.trim())) {
      return {
        success: false,
        error: 'Valid last 4 digits of Aadhaar required (e.g., 4829)'
      };
    }

    const lastDigit = parseInt(aadhaarLast4.trim().slice(-1), 10);
    // Simulate realistic ground reality: ~85% seeded, ~15% requiring bank camp intervention
    const isSeeded = lastDigit !== 3 && lastDigit !== 7;

    return {
      success: true,
      query: { aadhaarMasked: `XXXX-XXXX-${aadhaarLast4.trim()}` },
      gateway: 'NPCI Aadhaar Payment Bridge System (APBS) / PFMS Gateway',
      seedingStatus: {
        isAadhaarSeeded: isSeeded,
        statusLabel: isSeeded ? 'Active & DBT Enabled' : 'NPCI Inactive / Seeding Pending',
        mappedBank: isSeeded ? 'State Bank of India (SBI)' : 'None / Inactive Link',
        lastUpdated: isSeeded ? '2024-03-12' : 'Not Linked',
        directBenefitTransferEligible: isSeeded,
        resolutionAction: isSeeded
          ? 'Ready for direct benefit credit without manual submission.'
          : 'Visit your bank branch with Aadhaar copy and submit NPCI Mandate Form (डीबीटी मैंडेट फॉर्म).'
      },
      schemesAffected: [
        'UP Post-Matric Scholarship',
        'PM Kisan Samman Nidhi',
        'UP Old Age & Widow Pension'
      ]
    };
  }
};
