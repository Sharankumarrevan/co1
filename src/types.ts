export interface Organization {
  id: number;
  organizationName: string;
  organizationCode: string;
  registrationNumber: string;
  emailId: string;
  contactNumber: string;
  addressLine1: string;
  city: string;
  pinCode: string;
  tenantCode: string;
  status: string;             // e.g. "Inactive"
  financialYearStart: string; // e.g. "Month 4"
}


export interface Subsidiary {
  id: number;
  subsidiaryName: string;
  subsidiaryCode: string;
  subsidiaryDescription: string;
  locationCode: string;
  organizationCode: string;
}

// existing Organization + Subsidiary types...

export interface Location {
  id: number;
  locationCode: string;
  locationName: string;
  regionCode: string;
  countryCode: string;
  stateCode: string;
  city: string;
  pincode: string;
}


export interface Designation {
  id: number;
  designationCode: string;
  designationName: string;
}




