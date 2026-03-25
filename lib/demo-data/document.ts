import type { ContractDocument } from "../types/legal-demo";

export const seedDocument: ContractDocument = {
  id: "document-vendor-msa-v3",
  title: "Vendor MSA v3",
  version: "3.2",
  sections: [
    {
      id: "section-indemnity",
      title: "Indemnity",
      order: 1,
      clauses: [
        {
          id: "clause-indemnity-1",
          sectionId: "section-indemnity",
          order: 1,
          title: "Vendor indemnity",
          text: "Vendor will defend, indemnify, and hold harmless Customer, its affiliates, and their officers, directors, employees, and agents from any claims arising out of the Services, the Data, or any breach of this Agreement, except to the extent caused by Customer Materials or Customer instructions.",
        },
      ],
    },
    {
      id: "section-liability",
      title: "Limitation of Liability",
      order: 2,
      clauses: [
        {
          id: "clause-liability-1",
          sectionId: "section-liability",
          order: 1,
          title: "Liability cap",
          text: "Each party's aggregate liability will not exceed the fees paid or payable in the twelve months before the event giving rise to the claim, except for confidentiality breaches and indemnity obligations.",
        },
      ],
    },
    {
      id: "section-data-protection",
      title: "Data Protection",
      order: 3,
      clauses: [
        {
          id: "clause-data-1",
          sectionId: "section-data-protection",
          order: 1,
          title: "Security incident notice",
          text: "Vendor will notify Customer of any Security Incident within 72 hours after confirmation and will maintain a current subprocessor list on request.",
        },
      ],
    },
    {
      id: "section-termination",
      title: "Term and Renewal",
      order: 4,
      clauses: [
        {
          id: "clause-renewal-1",
          sectionId: "section-termination",
          order: 1,
          title: "Auto-renewal",
          text: "The Agreement renews automatically for successive 12 month terms unless either party gives at least 90 days' written notice before the end of the then-current term.",
        },
      ],
    },
  ],
};
