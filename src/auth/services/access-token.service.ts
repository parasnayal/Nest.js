import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../../config/env.validation.js';
import { jwtVerify, SignJWT } from 'jose';

export class AccessTokenService {
  private readonly secret: Uint8Array;
  private readonly issuer: string;
  private readonly audience: string;

  constructor(private readonly config: ConfigService<EnvConfig, true>) {
    this.secret = new TextEncoder().encode(
      this.config.get('JWT_ACCESS_SECRET', {
        infer: true,
      }),
    );

    this.issuer = this.config.get('JWT_ISSUER', {
      infer: true,
    });

    this.audience = this.config.get('JWT_AUDIENCE', {
      infer: true,
    });
  }

  async sign(userId: number): Promise<string> {
    return new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(String(userId))
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(this.secret);
  }

//   async verify(token: string) {
//     return jwtVerify(token, this.secret, {
//       algorithms: ["HS256"],
//       issuer: this.issuer,
//       audience: this.audience,
//     });
//   }
}
