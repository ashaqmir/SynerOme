import { IAddress } from "./models";

export interface IOrder {
    productReference: string;
    userMail: string;
    shippingAddress: IAddress;
    price: number;
    tax: number;
    amountPaid: number;
    payPalStatus: string;

}