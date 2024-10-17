import Jwt from 'jsonwebtoken'

import { globalConfig } from '@/configs/global.config'

export interface TokenPayload {
  jti: string
  sub: string
}

export type VerifyResult =
  | {
      valid: true
      payload: TokenPayload
    }
  | {
      valid: false
      payload: null
    }

export function signAccess({ jti, sub, ...payload }: TokenPayload): string {
  return Jwt.sign(payload, globalConfig.security.accessTokenSecret, {
    jwtid: jti,
    subject: sub,
    expiresIn: globalConfig.security.accessTokenLifetime,
  })
}

export function verifyAccess(token: string): VerifyResult {
  try {
    const payload = Jwt.verify(
      token,
      globalConfig.security.accessTokenSecret,
    ) as TokenPayload
    return { valid: true, payload }
  } catch (error) {
    return { valid: false, payload: null }
  }
}

export function signRefresh({ jti, sub, ...payload }: TokenPayload): string {
  return Jwt.sign(payload, globalConfig.security.refreshTokenSecret, {
    jwtid: jti,
    subject: sub,
    expiresIn: globalConfig.security.refreshTokenLifetime,
  })
}

export function verifyRefresh(token: string): VerifyResult {
  try {
    const payload = Jwt.verify(
      token,
      globalConfig.security.refreshTokenSecret,
    ) as TokenPayload
    return { valid: true, payload }
  } catch (error) {
    return { valid: false, payload: null }
  }
}
