// "use server";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { getUserInfo } from "@/lib/actions";
import { AuthContext } from "@/provider/AuthProvider";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserContextType {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
export function useUser() {
    return useContext(UserContext);
  }
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user }: any = AuthContext();
  const userDetails = user?.user || null;
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const getUserInfoDetails = async () => {
          try {
            const data: any = await getUserInfo(user.uid);
            setUserInfo(data as UserInfo);
            setLoading(false);
          } catch (err) {
            setError("Failed to fetch user info");
            setLoading(false);
          }
        };

        getUserInfoDetails();

      } else {
        setUserInfo(null);
      }
      setLoading(false); 
    });

    return () => unsubscribe(); 
  }, []);
  return (
    <UserContext.Provider value={{ userInfo, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
