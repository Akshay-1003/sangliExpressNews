"use client";
import React from "react";
import { auth, db } from "../../../../firebase/firebase";
import { toast } from "react-toastify";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import googlelogo from "../../../../public/images/icon/google.png";
import Image from "next/image";
import { doc, setDoc } from "firebase/firestore";
import InputField from "@/components/InputField";
import { PROFILE_ROUTE, REGISTER_ROUTE } from "@/constants/routes";
import { LoginValidation } from "@/validationSchema/auth";
import { useRouter } from "next/navigation";
import useAuthentication from "@/hooks/useAuthentication";

function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = LoginValidation();
  const router = useRouter();
  useAuthentication();
  const submitForm = async (values: any) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
      router.push(PROFILE_ROUTE);
    } catch (error) {
      console.log("Login Error ", error);
      toast.error("Login failed. Please try again.");
    }
  };
  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      const user = result.user;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: user.displayName,
          photo: user.photoURL,
          lastName: "",
        });
        toast.success("User logged in Successfully", {
          position: "top-center",
        });
        window.location.href = "/home";
      }
    });
  };

  return (
    <div className="bg-gray-50 flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg md:w-1/2">
        <h2 className="text-gray-800 mb-6 text-center text-3xl font-bold">
          Sign In
        </h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          New user?{" "}
          <a href="/auth/signup" className="text-blue-600 hover:underline">
            Create an account
          </a>
        </p>

        <form onSubmit={handleSubmit(submitForm)} className="">
          <div>
            <InputField
              register={register}
              error={errors.email}
              type="text"
              placeholder="Enter Your Email Here..."
              name="email"
              label="Email"
            />
          </div>

          <div className="mb-4">
            <InputField
              register={register}
              error={errors.password}
              type="password"
              placeholder="Enter Your Password Here..."
              name="password"
              label="Password"
            />
          </div>

          <div className="mb-2 flex justify-between">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="border-gray-300 w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="text-gray-500 bg-white px-2">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 flex w-full items-center justify-center rounded-md border bg-white px-4 py-2"
            onClick={googleLogin}
          >
            <Image
              src={googlelogo.src}
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
