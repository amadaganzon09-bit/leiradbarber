"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
    progress: number;
    setProgress: (progress: number) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <LoadingContext.Provider value={{ progress, setProgress, isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}
