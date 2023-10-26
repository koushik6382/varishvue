export interface Address {
    AddressId: number,
    addressLine1: string | null,
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
    latitude: number,
    longitude: number,
    docLocation: string
}
export interface CreateAddressDto {
  
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
