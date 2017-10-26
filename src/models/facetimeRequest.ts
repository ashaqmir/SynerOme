export interface IFacetimeRequest {
    idFrom: string;
    nameFrom: string;
    idTo: string;
    nameTo: string
    status: string; //pending -->(accepted, deleted)

     callIdTo: number;
     callIdFrom: number;
}

export interface IFacetimeRequestView {
    idFrom: string;
    nameFrom: string;
    idTo: string;
    nameTo: string
    status: string; //pending -->(accepted, deleted)
    key: string;

    callIdTo: number;
    callIdFrom: number;
}