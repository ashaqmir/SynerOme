export interface IFacetimeRequest {
    idFrom: string;
    nameFrom: string;
    idTo: string;
    nameTo: string
    status:string; //pending -->(accepted, deleted)
}