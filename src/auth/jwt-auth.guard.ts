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
import { IS_PUBLIC_PERMISSION } from 'src/decorator/customize';

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

        const isPublicPermission = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_PERMISSION,[
            context.getHandler(),
            context.getClass()
        ]);
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("Vui lòng đăng nhập lại để tiếp tục nào!");
        }

        // check permission
        const tagetMethod = request.method;
        const tagetEndpoind = request.route?.path as string;

        const permission = user?.permission ?? [];

        let isExist = permission.find(permission => 
            tagetMethod === permission.method && tagetEndpoind === permission.apiPath);
        if(tagetEndpoind.startsWith("/api/v1/auth")) isExist = true
        if(!isExist && !isPublicPermission){
            throw new ForbiddenException("Bạn không có quyền truy cập endpoind này");
        }
        return user;
    }
}