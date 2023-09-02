import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const config: FirebaseOptions = {}

const app = initializeApp(config);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
