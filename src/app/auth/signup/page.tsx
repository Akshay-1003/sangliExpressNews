'use client'
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../../../../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import Link from "next/link";
import { LOGIN_ROUTE, PROFILE_ROUTE } from "@/constants/routes";
import { RegisterValidation } from "@/validationSchema/auth";
import useAuthentication from "@/hooks/useAuthentication";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";

function Register() {
  
  const router = useRouter();
  useAuthentication();
  const { handleSubmit, register, formState: { errors }, reset } = RegisterValidation();
console.log(errors);
  const handleRegister = async (values: any) => {
    debugger;
    console.log("Register form values", values);
    try {
      await createUserWithEmailAndPassword(auth,values.email, values.password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          photo: ""
        });
      }
      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
      reset();
      router.push(PROFILE_ROUTE);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!!", {
        position: "bottom-center",
      });
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-400/20 via-blue-300 to-purple-400/60">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h3 className="mb-6 text-center text-3xl font-bold text-gray-800">Sign Up</h3>

        <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
          <div className="mb-4">
           
            <InputField
              register={register}
              error={errors.firstName}
              type="text"
              placeholder="Enter Your firstName Here..."
              name="firstName"
              label="First Name"
            />
          </div>

          <div className="mb-4">
            
            <InputField
              register={register}
              error={errors.lastName}
              type="text"
              placeholder="Enter Your Email Here..."
              name="lastName"
              label="Last Name"
            />
          </div>

          <div className="mb-4">
            
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
              type="text"
              placeholder="Enter Your Email Here..."
              name="password"
              label="Password"
            />
          </div>
          <div>
            <InputField
              register={register}
              error={errors.cnfPassword}
              type="password"
              placeholder="Enter Your Confirm Password Here..."
              name="cnfPassword"
              label="Confirm Password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">
            Already registered?{" "}
            <Link href={LOGIN_ROUTE}>
              <span className="text-blue-500 font-semibold hover:underline">
                Login
              </span>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
