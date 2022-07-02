import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import Role from 'src/entities/roles.enum';
import { JwtGuard } from '../auth/guard/jwt.guard';
import RoleGuard from '../auth/guard/roles.guard';
import { AdminService } from './admin.service';

@ApiTags('Admin') 
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ){}

    @Get()
    @UseGuards(RoleGuard(Role.Admin))
    @UseGuards(JwtGuard)
    @HttpCode(200)
    async getData() {
        const getDashboards = await this.adminService.getData();
        return getDashboards;
    }
}
