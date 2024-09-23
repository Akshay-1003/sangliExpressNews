'use client';
import { HelmetProvider } from 'react-helmet-async';
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import AuthProvider from "@/provider/AuthProvider";
import ToastProvider from "@/provider/toast.provider";
import {UserProvider} from "@/hooks/useFetchUserInfo";
const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate loading delay
  }, []);

  return (
    <HelmetProvider>
    <UserProvider>
    <ToastProvider>
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        {loading ? <Loader /> : <AuthProvider>{children}</AuthProvider>}
      </div>
    </ToastProvider>
    </UserProvider>
    </HelmetProvider>
  );
};

export default ClientLayout;
