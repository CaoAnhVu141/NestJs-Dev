import {
    BadRequestException,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'http';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("Vui lòng đăng nhập lại để tiếp tục nào!");
        }

        // check permission
        const tagetMethod = request.method;
        const tagetEndpoind = request.route?.path;

        const permission = user?.permission ?? [];

        const isExist = permission.find(permission => 
            tagetMethod === permission.method && tagetEndpoind === permission.apiPath);
        if(!isExist){
            throw new ForbiddenException("Bạn không có quyền truy cập endpoind này");
        }
        return user;
    }
}