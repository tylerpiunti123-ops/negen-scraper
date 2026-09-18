export interface QuoteVehicleType {
  id: string;
  label: string;
}

export const quoteVehicleTypes: QuoteVehicleType[] = [
  { id: "sedan", label: "Sedan" },
  { id: "coupe", label: "Coupe" },
  { id: "suv", label: "SUV" },
  { id: "truck", label: "Truck" },
  { id: "van", label: "Van" },
  { id: "exotic", label: "Exotic / Sports" },
];

export interface QuoteNeed {
  id: string;
  label: string;
  description: string;
}

export const quoteNeeds: QuoteNeed[] = [
  { id: "paint-correction", label: "Paint Correction", description: "Swirls, scratches, dull finish" },
  { id: "ceramic-coating", label: "Ceramic Coating", description: "Long-term gloss & protection" },
  { id: "headlight-restoration", label: "Headlight Restoration", description: "Cloudy, oxidized lenses" },
  { id: "interior-detailing", label: "Interior Detailing", description: "Deep clean & conditioning" },
  { id: "exterior-detailing", label: "Exterior Detailing", description: "Wash, decontamination, finish" },
  { id: "not-sure", label: "Not Sure Yet", description: "Get a recommendation" },
];

export const quoteSteps = [
  { id: "vehicle", title: "YOUR VEHICLE" },
  { id: "needs", title: "WHAT DOES IT NEED?" },
  { id: "condition", title: "SHOW US THE CONDITION" },
  { id: "quote", title: "GET YOUR QUOTE" },
] as const;
