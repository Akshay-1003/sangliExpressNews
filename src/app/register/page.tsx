"use client";
import InputField from "@/components/InputField";
import { LOGIN_ROUTE, PROFILE_ROUTE } from "@/constants/routes";
import useAuthentication from "@/hooks/useAuthentication";
import { auth } from "../../../firebase/firebase";
import { RegisterValidation } from "@/validationSchema/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  useAuthentication();
  const { handleSubmit, register, formState: { errors }, reset } = RegisterValidation();

  const submitForm = async (values: any) => {
    console.log("Register form values", values);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      alert("User Registered Successfully");
      reset();
      router.push(PROFILE_ROUTE);
    } catch (e: any) {
      console.log("Error: ", e.message);
      alert("Something went wrong, please try again");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-400/20 via-blue-300 to-purple-400/60">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Register</h2>
        
        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
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

          <div>
            <InputField
              register={register}
              error={errors.password}
              type="password"
              placeholder="Enter Your Password Here..."
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
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href={LOGIN_ROUTE}>
              <span className="text-blue-500 font-semibold hover:underline">
                Login Here
              </span>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
