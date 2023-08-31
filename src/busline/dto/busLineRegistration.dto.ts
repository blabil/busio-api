import { IsNotEmpty, IsString } from "class-validator";

export class busLineRegistrationDto{

    @IsNotEmpty({message: 'Nie podano numeru linii.'})
    public number: string;

    @IsNotEmpty({message: 'Nie podano odcinka trasy!.'})
    @IsString()
    public part: string;

    @IsNotEmpty({message: 'Nie podano odcinka trasy!.'})
    public pola;

    @IsNotEmpty({message: 'Nie podano odcinka trasy!.'})
    public czas;
}