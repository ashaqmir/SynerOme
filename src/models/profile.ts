export interface IProfile {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
   
    street: string,
    city: string;   
    country: string;
    region: string;
    zip: string;

    dob: string;
    birthgender: string;
    currentgender:string;

    bodyweight:string;
    height:string;
    race:string;
    sleepquality: string;

    isNutritionist: boolean;
    nutritionistLicenseNumber: string;
}
