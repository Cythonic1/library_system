import React from "react";
import ImageSlider from "./image-slider";

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <div className="flex flex-1 items-center justify-center p-6 md:w-1/2">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
            <div className="hidden md:block md:w-1/2">
                <ImageSlider />
            </div>
        </div>
    );
}

export default Layout;
