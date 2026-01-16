"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function AuthButtons() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="text-sm text-muted-foreground">Loading...</div>;
    }

    if (session) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    {session.user?.image && (
                        <Image
                            src={session.user.image}
                            alt="User Avatar"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    )}
                    <span className="text-sm font-medium hidden md:block">
                        {session.user?.name || session.user?.email}
                    </span>
                </div>
                <button
                    onClick={() => signOut()}
                    className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-destructive"
                    title="Se déconnecter"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => signIn("keycloak")}
            className="flex items-center gap-2 bg-marker hover:bg-markerHover text-secondary-foreground font-medium px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>Se connecter</span>
        </button>
    );
}
