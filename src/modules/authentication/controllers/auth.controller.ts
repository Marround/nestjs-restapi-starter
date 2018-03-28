import {Get, Controller, Post, HttpStatus, Body, Res, Headers, UseGuards} from '@nestjs/common';
import {AuthService} from "../services/auth.service";
import {TokenService} from "../services/token.service";
import {AccessGuard} from "../guards/access.guard";
import {Roles} from "../decorators/roles.decorator";

@Controller('api/auth')
// @UseGuards(AccessGuard)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokenService
    ) {}

    @Post('tokenInfo')
    // @Roles('isUser')
    public getTokenInfo(@Res() res, @Headers() headers: any) {
        this.authService.info(headers.authorization ? headers.authorization.split(' ')[1] : '').then(data => {
            res.status(HttpStatus.OK).json(data);
        }, err => {
            res.status(HttpStatus.BAD_REQUEST).json(err);
        })
    }

    @Post('register')
    public register(@Res() res, @Body() body: any) {
        this.authService.register(body.email, body.username, body.password).then(data => {
            res.status(HttpStatus.CREATED).json(data);
        }, error => {
            res.status(HttpStatus.BAD_REQUEST).json(error);
        });
    }

    @Post('token')
    public getToken(@Res() res, @Body() body: any) {
        if (body.email) {
            this.tokenService.createToken(body).then(data => {
                res.status(HttpStatus.OK).json(data);
            }).catch(err => {
                res.status(HttpStatus.BAD_REQUEST).json({
                    status: HttpStatus.BAD_REQUEST,
                    message: err
                });
            });
        } else {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: 'Отсуствует поле email!'
            });
        }
    }

    @Get('authorized')
    public async authorized() {
        console.log('Authorized route...');
        return 'Authorized route...';
    }
}