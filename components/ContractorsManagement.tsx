import { useState } from "react";
import { Contractors } from "./Contractors";
import { ContractorDetailView } from "./ContractorDetailView";

export function ContractorsManagement() {
  const [selectedContractorId, setSelectedContractorId] = useState<string | null>(null);

  const handleViewDetails = (contractorId: string) => {
    setSelectedContractorId(contractorId);
  };

  const handleBack = () => {
    setSelectedContractorId(null);
  };

  if (selectedContractorId) {
    return <ContractorDetailView contractorId={selectedContractorId} onBack={handleBack} />;
  }

  return <Contractors onViewDetails={handleViewDetails} />;
}
