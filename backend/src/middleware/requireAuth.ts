import { CognitoJwtVerifier } from "aws-jwt-verify";
import { type Request, type Response, type NextFunction } from "express";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID!,
});

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace(/^Bearer /, '');
    if (!token) return res.status(401).json({ error: 'Missing token'});
    try {
        const payload = await verifier.verify(token);
        res.locals.userId = payload.sub;
        next();
    } catch (err){
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};