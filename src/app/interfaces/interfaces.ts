export interface AuthResponse {
    msg: string;
    jwt: string;
    ok:  boolean;
}
export interface VerifyPlaceResponse{
    ok:      boolean;
    results: Place;
}

export interface Place {
    latitud:     number;
    longitud:    number;
    descripcion: string;
    centro:      string;
}

export interface InfoPlace{
    visitId: string;
    placeUid: string;
    info: Place;
    fecha: Date;
}

export interface VisitPlace{
    
    fecha: Date;
    place: Place;

}
export interface VerifyUserResponse {
    ok:  boolean;
    msg: string;
}

export interface RegisterVisitResponse {
    msg:      string;
    time:     Date;
    visitUID: string;
    ok:       boolean;
}

export interface CheckRisk {
    msg:     string;
    results: Result[];
    ok:      boolean;
}

export interface Result {
    Total_Visitas_Riesgo: number;
    UIDLugar:             string;
    NombreLugar:          string;
}
