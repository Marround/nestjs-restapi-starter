import {Component, Inject} from "@nestjs/common";
import {Model} from "mongoose";
import {IFile} from "../interfaces/file.interface";
import * as fs from "fs"
import * as path from "path"
import * as async_hooks from "async_hooks"
import {FileDto} from "../dto/file.dto";
import {classToClass, plainToClass} from "class-transformer";

@Component()
export class FileManagerService {
    constructor(@Inject('FileModelToken') private readonly fileModel: Model<IFile>) {

    }

    async getFilesListFromDir(targetDir): Promise<String[]> {
        let fileList = [];
        fs.readdirSync(targetDir).forEach(file => {
            if (fs.statSync(targetDir + file).isFile()) {
                fileList.push(targetDir + file);
            }
        });

        return await fileList;
    }

    async getFileListFromDB(): Promise<FileDto[]> {
        const fileListDB = await this.fileModel.find().exec();
        let fileList = [];
        fileListDB.forEach(file => {
            fileList.push(plainToClass<FileDto, object>(FileDto, file.toObject(), {excludePrefixes: ["_"]}))
        });
        return await fileList;
    }

    async addFile(createFile: FileDto): Promise<FileDto> {
        delete createFile.id;
        const createdFile = new this.fileModel(createFile);
        return await classToClass(plainToClass<FileDto, object>(FileDto, (await createdFile.save()).toObject(), {
            excludePrefixes: ["_"]
        }));
    }

    async inspectFiles(): Promise<any> {
        let dirArr = this.getDirTree('./assets/');
        let files = [], newFiles = [];
        const foundFiles = await this.fileModel.find().exec();

        for(let i = 0; i < dirArr.length; i++) {
            fs.readdirSync(dirArr[i]).forEach(file => {
                if (fs.statSync(dirArr[i] + file).isFile()) {
                    let newFile = new FileDto;
                    newFile.path = dirArr[i];
                    newFile.name = file;
                    newFile.alt = '';
                    newFile.description = '';

                    files.push(newFile);
                }
            });
        }

        newFiles = files.filter(file => {
            let contains = foundFiles.filter(found => {
                return found.path+found.name === file.path+file.name
            }).length === 0;
            if (contains) {
                this.addFile(file).then((createdFile) => {
                    console.log(createdFile.path+createdFile.name + ' added.')
                });
            }
            return contains;
        });

        return await newFiles;
    }

    private getDirTree(baseDir) {
        let foldres = [];
        fs.readdirSync(baseDir).forEach((dir) => {
            if (fs.statSync(baseDir  + dir).isDirectory()) {
                foldres.push(baseDir + dir + '/');
                foldres.push(...this.getDirTree(baseDir + dir + '/'))
            }
        });
        return foldres;
    }
}