export const mockIncident = {
  id: "INC-002",
  type: "Data Exfiltration",
  rank: 1,
  score: 93.7,
  priority: "Critical",
  status: "Open",
  detectedTime: "10:42 AM",

  sourceIp: "192.168.1.22",
  destinationIp: "185.220.101.24",

  targetAsset: "Customer Database",
  assetType: "Database Server",

  affectedUsers: 500,

  dataCategory: "Customer Financial Data",
  detectionSource: "DLP",

  factors: {
    severity: 9,
    assetImportance: 10,
    affectedUsers: 8,
    dataSensitivity: 10,
    attackConfidence: 9.5,
    businessImpact: 10
  },

  reasons: [
    "Critical customer database affected",
    "Highly sensitive customer data involved",
    "High confidence that the attack is real",
    "Large number of users potentially affected",
    "Significant potential business impact"
  ],

  nextIncident: {
    id: "INC-008",
    type: "Malware Detection",
    rank: 2,
    score: 89.2,

    factors: {
      severity: 9,
      assetImportance: 8,
      affectedUsers: 4,
      dataSensitivity: 8,
      attackConfidence: 9,
      businessImpact: 9
    }
  },

  comparisonReason:
    "Data Exfiltration ranks above Malware Detection because it affects a more critical asset, involves more sensitive data, impacts more users and has greater overall business impact."
};
