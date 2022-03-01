import { Request } from 'express';
import * as core from 'express-serve-static-core';

interface RequestCustom extends Request {
  user?: any;
}

interface Query extends core.Query {}

export type JWTLoginType = {
  id: string;
  iat: number;
  exp: number;
};
