// Uttar Pradesh e-District (edistrict.up.gov.in) Sandbox Adapter
// Conforms to UP Right to Public Services Act (Janhit Guarantee) 2011

export const edistrictAdapter = {
  verifyCertificate({ certType, certNumber, applicationNumber, district = 'Lucknow' }) {
    if (!certNumber) {
      return {
        valid: false,
        error: 'Certificate number is required (e.g., 24151001004829)'
      };
    }

    const cleanNum = certNumber.trim().replace(/\s+/g, '');
    const isStandardFormat = /^\d{12,16}$/.test(cleanNum) || cleanNum.startsWith('UP');

    // Simulate verified issuance metadata
    const typesMap = {
      'income': { name: 'आय प्रमाण पत्र (Income Certificate)', authority: 'Tehsildar', sla: 15, validityYears: 3 },
      'domicile': { name: 'निवास प्रमाण पत्र (Domicile Certificate)', authority: 'Sub-Divisional Magistrate', sla: 20, validityYears: 10 },
      'caste': { name: 'जाति प्रमाण पत्र (Caste Certificate)', authority: 'Tehsildar', sla: 20, validityYears: 10 },
      'birth': { name: 'जन्म प्रमाण पत्र (Birth Certificate)', authority: 'Registrar (Birth & Death)', sla: 7, validityYears: 99 }
    };

    const typeKey = (certType || 'income').toLowerCase().includes('income') ? 'income'
      : (certType || '').toLowerCase().includes('domicile') || (certType || '').toLowerCase().includes('residence') ? 'domicile'
      : (certType || '').toLowerCase().includes('caste') ? 'caste' : 'income';

    const selectedType = typesMap[typeKey];

    // Compute synthetic issue date within valid period
    const issueDate = new Date();
    issueDate.setMonth(issueDate.getMonth() - 8);
    const validUntil = new Date(issueDate);
    validUntil.setFullYear(validUntil.getFullYear() + selectedType.validityYears);

    const isExpired = new Date() > validUntil;

    return {
      success: true,
      verified: isStandardFormat,
      portal: 'Uttar Pradesh e-District Portal (edistrict.up.gov.in)',
      statutoryAct: 'Uttar Pradesh Right to Public Services Act, 2011',
      certificateDetails: {
        certificateType: selectedType.name,
        certificateNumber: cleanNum,
        applicationNumber: applicationNumber || `UP-ED-2024-${Math.floor(1000000 + Math.random() * 9000000)}`,
        applicantName: 'Verified Beneficiary',
        district,
        tehsil: 'Sadar / Aliganj',
        issuingAuthority: selectedType.authority,
        issueDate: issueDate.toISOString().split('T')[0],
        validUntil: validUntil.toISOString().split('T')[0],
        status: isExpired ? 'Expired' : 'Active & Statutory Valid',
        qrSecurityHash: 'SHA256:' + Buffer.from(cleanNum + 'UP_EDISTRICT_LEGAL_SEAL').toString('hex').slice(0, 32)
      },
      slaGuarantee: {
        statutoryMaxDays: selectedType.sla,
        firstAppellateAuthority: 'Sub-Divisional Magistrate (SDM)',
        secondAppellateAuthority: 'District Magistrate (DM)'
      }
    };
  }
};
