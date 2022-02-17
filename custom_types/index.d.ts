import { Request } from 'express';
import * as core from 'express-serve-static-core';

interface RequestCustom extends Request {
  requestTime?: string;
}

interface Query extends core.Query {}
