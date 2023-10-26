import type { CreateAddressDto, Address } from "./Address"

export interface Company {
    companyId: number,
    name: string,
    telephone: string,
    mobile: string,
    email: string,
    address: Address
}
export interface CreateCompanyDto {
 
    name: string,
    telephone: string,
    mobile: string,
    email: string | null,
    address: CreateAddressDto | null
}

export interface CreateCompanyAllDto {
 
  name: string,
  telephone: string,
  mobile: string,
  email: string | null,
  addressLine1: string,
    addressLine2: string,
    addressLine3: string,
    city: string,
    country: string,
    postcode: string,
    unitNumber: string,
    streetNumber: string,
    streetName: string,
    suburb: string,
    gps: string,
    latitude: null | number ,
    longitude: null | number ,
    docLocation: string
}
// function createDefaultCompany(config: CreateCompanyDto): { companyName: string | null;} {
//     return {
//         companyName: config.companyName,
//     };
//   }
  //let defaultCompany = createDefaultCompany({ companyName: "name", telephoneNo: +06373 });
export { companyInfoHeader as companyInfoHeader}

const companyInfoHeader = [
    {
      groupTag: "basic",
      groupName: "Detail of Company",
      cols: "3",
      group: [
        { text: "COMPANY NAME", value: "name" },
        { text: "TELEPHONE", value: "telephone" },
        { text: "Mobile No", value: "mobile" },
        { text: "Email", value: "email" },
        
      ],
    },
    {
      groupTag: "address",
      groupName: "Detail of Address",
      cols: "3",
      group: [
        { text: "AddressLine", value: "addressLine1" },
        { text: "City", value: "city" },
        { text: "COUNTRY", value: "country" },
        { text: "DocLocation", value: "docLocation" },
        { text: "GPS", value: "gps" },
        { text: "Latitude", value: "latitude" },
        { text: "Longitude", value: "longitude" },
        { text: "PostCode", value: "postcode" },
        { text: "StreetName", value: "streetName" },
        { text: "StreetNumber", value: "streetNumber" },
        { text: "Suburb", value: "suburb" },
        { text: "UnitNumber", value: "unitNumber" },
      ],
    },
  ];