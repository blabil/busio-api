import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service'
import { SignUpAuthoDto } from 'src/auth/dto/signUpAuth.dto';
import * as bcrpyt from 'bcrypt';
import { Role } from '@prisma/client';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    async getUser(id: string, req: Request){
        const user = await this.prisma.user.findUnique({where: {id}, include: {profile:true}})

        if(!user)
        {
            throw new NotFoundException();
        }
          
        
        delete user.passwordHash;
        return user;
    }

    async getUsers(){
        const users = await this.prisma.user.findMany({select: {id:true, email:true, role:true, profile: true}});
        return users;
    }

    async deleteUser(id: string, res: Response)
    {
        const user = await this.prisma.user.findUnique({where: {id}, include: {profile: true}})
        if(!user)
        {
            throw new NotFoundException();
        }

        await this.prisma.user.delete({where : {id: id}});


        return res.send({message: `Usunięto użytkownika ${user.profile.fullName}`});
    }

    async updateUser(id: string, dto: SignUpAuthoDto, res: Response){
        const {email, fullName, phone, password, role, address} = dto;

        const hashedPassword = await this.hashPassword(password);
        const user = await this.prisma.user.update({
            where: {id},
            data: {
                email: email,
                passwordHash: hashedPassword,
                role: Role[role as keyof Role],
                profile: {
                    update: {
                        fullName: fullName,
                        phone: phone,
                        address: address
                    }
                }        
            }
        
        })

        return ({message: `Pomyślnie edytowano użytkownika!`});
    }

    async hashPassword(password: string)
    {
        const sor = 10;
        const hashedPassword = await bcrpyt.hash(password,sor);
        return hashedPassword;
    }
}
