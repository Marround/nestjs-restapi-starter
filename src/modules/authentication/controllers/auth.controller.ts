import {Controller, Post, HttpStatus, Body, Res, Headers, UseGuards} from '@nestjs/common';
import {AuthService} from "../services/auth.service";
import {UserInsideDto} from "../dto/user.dto";
import {Roles} from "../decorators/roles.decorator";
import {AccessGuard} from "../guards/access.guard";

@Controller('api/auth')
@UseGuards(AccessGuard)
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Roles()
    @Post('login')
    public login(@Res() res, @Body() body: UserInsideDto) {
        try {
            this.authService.login(body.email, body.password).then(data => {
                res.status(HttpStatus.OK).json(data);
            }).catch(error => {
                res.status(HttpStatus.BAD_REQUEST).json(error);
            })
        } catch (error) {
            throw error;
        }
    }

    @Roles('isUser')
    @Post('tokenInfo')
    public getTokenInfo(@Res() res, @Headers() headers: any) {
        this.authService.info(headers.authorization ? headers.authorization.split(' ')[1] : '').then(data => {
            res.status(HttpStatus.OK).json(data);
        }, err => {
            res.status(HttpStatus.BAD_REQUEST).json(err);
        })
    }
    @Roles()
    @Post('register')
    public register(@Res() res, @Body() body: any) {
        this.authService.register(body.email, body.username, body.password).then(data => {
            res.status(HttpStatus.CREATED).json(data);
        }, error => {
            res.status(HttpStatus.BAD_REQUEST).json(error);
        });
    }

    @Roles()
    @Post('token')
    public getToken(@Res() res, @Headers() headers: any) {
        this.authService.getToken(headers.authorization ? headers.authorization.split(' ')[1] : '').then(data => {
            res.status(HttpStatus.OK).json(data);
        }, err => {
            res.status(HttpStatus.BAD_REQUEST).json(err);
        })
    }
}