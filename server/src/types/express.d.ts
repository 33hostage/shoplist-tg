interface TelegramAuthUser {
    id: string | number;
    first_name: string;
    username?: string;
    authToken: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TelegramAuthUser; 
    }
  }
}