import * as jwt from "jsonwebtoken";

const generateAccessToken = (payload: any, secret: string) => {
    return jwt.sign(payload, secret, { expiresIn: "10m" });
};

const generateRefreshToken = (payload: any, secret: string) => {
    return jwt.sign(payload, secret, { expiresIn: "1d" });
};

export { generateAccessToken, generateRefreshToken }