import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SignUpAuthoDto } from './dto/signUpAuth.dto';
import { SignInAuthoDto } from './dto/signInAuth.dto';
import * as bcrpyt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../utils/constans';
import { Response } from 'express';
import { Role } from '@prisma/client'

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService){};

    async signup(dto: SignUpAuthoDto){
        const {email, fullName, phone, password, role, address} = dto;

        const foundUser = await this.prisma.user.findUnique({where: {email: email}});
        if (foundUser){
            throw new BadRequestException('Użytkownik o podanym adresie email istnieje w bazie danych.');
        }
        const hashedPassword = await this.hashPassword(password);

        const user = await this.prisma.user.create({
            data: {
                email: email,
                passwordHash: hashedPassword,
                role: Role[role as keyof Role],
                profile : {
                    create: {
                        fullName: fullName,
                        phone: phone,
                        address: address
                    }
                }
            }
        })

        return {message: 'Pomyslnie zarejestrowano użytkownika'};
    }

    async signin(dto: SignInAuthoDto){
        console.log("dziala");
        const {email, password} = dto;
        const foundUser = await this.prisma.user.findUnique(
            {
                where: {
                    email: email
                },
                include: {
                    profile: true
                }
            });
        
        
        if (!foundUser){
            throw new BadRequestException('Podano nieprawidłowe dane logowania.');
        }

        const isMatch = await this.comparePassword({
            password,
            hash: foundUser.passwordHash,
        });
        if(!isMatch){
            throw new BadRequestException('Podano nieprawidłowe dane logowania.');
        }

        const token = await this.signToken({
            id: foundUser.id,
            email: foundUser.email, 
            role: foundUser.role,
            fullName: foundUser.profile.fullName
        })

        if(!token){
            throw new ForbiddenException();
        }


        return {message: 'Zalogowano pomyślnie', token: token};
    }

    logout(res: Response){
        res.clearCookie('token');
        res.send({message: "Wylogowano pomyślnie."});

    }

    async hashPassword(password: string)
    {
        const sor = 10;
        const hashedPassword = await bcrpyt.hash(password,sor);
        return hashedPassword;
    }

    async comparePassword(args: {password: string, hash: string})
    {
        return await bcrpyt.compare(args.password, args.hash);
    }

    async signToken(args: {id:string, email:string, role: string, fullName: string})
    {
        const payLoad = args;

        return this.jwt.signAsync(payLoad, {secret: jwtSecret})
    }
}