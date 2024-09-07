"use client";
import { auth } from "../../firebase/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import admin from 'firebase-admin';

import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const Context = createContext({});

type UserT = {
    user: any,
    isLogin: boolean
}

const AuthProvider = ({children}:any) =>{
    const [loading, setLoading] = useState<boolean>(true)
    const initialState = {
        user:null,
        isLogin:false
    }
    const [user, setUser] = useState<UserT>(initialState);

    useEffect(()=>{
        const subscribe = onAuthStateChanged(auth, (user) => {
            setUser({isLogin: user ? true : false, user: user});
            setLoading(false);
        });
        return subscribe;
    },[])

   


    return (
        <Context.Provider value={{user,setUser}}>
            {loading && (<div className="h-screen flex w-full justify-center items-center">Loading...</div>)}
            {!loading && children}
        </Context.Provider>
    )
}

export const AuthContext = () => useContext(Context);

export default AuthProvider;