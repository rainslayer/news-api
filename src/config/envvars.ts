import dotenv from 'dotenv'

dotenv.config();

export interface IEnvVars {
  serverPort: number;
  wssPort: number;
  mongodbConnectString: string;
  jwtSecret: string;
  corsOrigin: string;
}

export const envVars: IEnvVars = {
  serverPort: parseInt(process.env.PORT ?? "8080"),
  wssPort: parseInt(process.env.WSS_PORT ?? "8990"),
  mongodbConnectString: process.env.MONGODB_CONNECT_STRING ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:8080"
}
