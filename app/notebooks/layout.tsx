import React from 'react';
import {CustomProps} from "@/types/common/CustomProps";
import type {Metadata} from "next";


export const metadata: Metadata = {
    title: "Notebooks | Rubberduck",
    description: "Rubberduck AI - Your AI-powered coding assistant",
    icons: {
        icon: "/rubberduck_logo.ico",
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
    },

};

function Layout({children}: CustomProps) {


    return (
        <div className="notebooks-layout">
            {children}
        </div>
    );
}

export default Layout;