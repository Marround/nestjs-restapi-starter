import {BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards} from '@nestjs/common';
import {AccessGuard} from "../../authentication/guards/access.guard";
import {Roles} from "../../authentication/decorators/roles.decorator";
import {FileManagerService} from "../services/filemanager.service";
import {FileDto} from "../dto/file.dto";

@Controller('api/management')
@UseGuards(AccessGuard)
export class FileManagerController {
    constructor(private readonly fileService: FileManagerService) {}

    @Roles('isAdmin')
    @Get('fileListFromDir')
    @HttpCode(HttpStatus.OK)
    public async fileListFromDir(@Query() query) {
        try {
            return await this.fileService.getFilesListFromDir('./assets/img/news/');
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    @Roles('isAdmin')
    @Get('fileListFromDB')
    @HttpCode(HttpStatus.OK)
    public async fileListFromDB(@Query() query) {
        try {
            return await this.fileService.getFileListFromDB();
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    @Roles('isAdmin')
    @Get('inspectFiles')
    @HttpCode(HttpStatus.OK)
    public async inspectFiles(@Query() query) {
        try {
            return await this.fileService.inspectFiles();
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    @Roles('isAdmin')
    @Post('createFile')
    @HttpCode(HttpStatus.OK)
    public async createFile(@Body() body: FileDto) {
        try {
            return await this.fileService.addFile(body);
        }catch (error) {
            throw new BadRequestException(error);
        }
    }
}