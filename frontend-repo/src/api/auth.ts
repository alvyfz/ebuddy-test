import { auth } from "@/config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// export function onAuthStateChanged(cb) {
//   return _onAuthStateChanged(auth, cb);
// }

export async function signInWithGoogle(setCookies: any) {
  const provider = new GoogleAuthProvider();

  try {
    const result: any = await signInWithPopup(auth, provider);
    const token = result?.user?.accessToken as string;
    setCookies("Authorization", token as string);

    return result.user;
  } catch (error: any) {
    throw new Error("Error signing in with Google: " + error.message);
  }
}

export async function signOut(setCookies: any) {
  try {
    const res = await auth.signOut();
    setCookies("Authorization", "");
    return res;
  } catch (error: any) {
    throw new Error("Error signing in with Google: " + error.message);
  }
}
