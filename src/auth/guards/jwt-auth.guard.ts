import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticatedRequest } from '../auth.types.js';
import { jwtVerify } from 'jose';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access token required');
    }

    const token = authorization.slice(7);

    if (!token) {
      throw new UnauthorizedException('Access token required');
    }

    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not configured');
    }

    try {
      const key = new TextEncoder().encode(secret);

      const { payload } = await jwtVerify(token, key, {
        algorithms: ['HS256'],
        issuer: 'task-manager-api',
        audience: 'task-manager-api',
      });

      const userId = Number(payload.sub);

      if (!Number.isSafeInteger(userId) || userId <= 0) {
        throw new Error('Invalid token subject');
      }

      req.auth = {
        id: userId,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
