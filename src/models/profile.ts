import { IAddress } from "./models";

export interface IProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string
    phone: string;

    Addresses: IAddress[]

    dob: string;
    birthgender: string;
    currentgender: string;

    bodyweight: string;
    height: string;
    race: string;
    sleepquality: string;

    isNutritionist: boolean;
    nutritionistLicenseNumber: string;

    isProfileComplete: boolean;

    profilePicUrl: string;

    callId: number;
    isAdmin: boolean;
}
