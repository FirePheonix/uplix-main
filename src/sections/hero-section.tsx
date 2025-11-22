"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // Adjust to your path
import { TextEffect } from "@/components/TextEffect"; // Adjust to your path
import { AnimatedGroup } from "@/components/AnimatedGroup"; // Adjust to your path
import CircularGallery from "@/components/circular-gallery"; // Adjust to your path
import { Instrument_Serif } from "next/font/google";
import { motion } from "framer-motion";
import ignore from "ignore";

const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: ["400"],
});


const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: "blur(12px)",
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: {
                type: "spring",
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
};

export function HeroSection2() {
    const defaultItems = [
        {
            image: `https://res.cloudinary.com/harshitproject/image/upload/v1746774805/Behance-screen.png`,
            text: "Behance",
        },
        {
            image: `https://res.cloudinary.com/harshitproject/image/upload/v1746774805/Notion-screen.png`,
            text: "Notion",
        },
        {
            image: `https://res.cloudinary.com/harshitproject/image/upload/v1746774806/One-screen.png`,
            text: "One",
        },
        {
            image: `https://res.cloudinary.com/harshitproject/image/upload/v1746774807/Reddit-nj7hwh.png`,
            text: "Reddit",
        },
        {
            image: `https://res.cloudinary.com/harshitproject/image/upload/v1746774805/Behance-screen.png`,
            text: "Behance",
        },
        {
            image: `https://res.cloudinary.com/harshitproject/image/upload/v1746774805/Notion-screen.png`,
            text: "Notion",
        },
    ];

    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <main className="z-10">
                <section>
                    <div className={`relative overflow-hidden pt-2 md:pt-4 ${instrumentSerif.className}`}>
                        {/* Constrained content for the hero text */}
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">

                                <motion.p
                                    initial={{ opacity: 0, filter: "blur(8px)" }}
                                    animate={{ opacity: 1, filter: "blur(0px)" }}
                                    transition={{ duration: 0.6 }}
                                    className="mt-8 text-balance text-6xl dark:text-white text-black md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                                >
                                    Create your entire<br/>
                                    social media presence<br/>
                                    from <span className="text-blue-500">scratch.</span><br/>
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, filter: "blur(8px)" }}
                                    animate={{ opacity: 1, filter: "blur(0px)" }}
                                    transition={{ duration: 0.6 }}
                                    className="text-2xl mb-2 mx-auto dark:text-white/70 text-black/70 text-balance block"
                                >
                                    Create content. Schedule posts. Find creators. Manage Socials.
                                </motion.p>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                                >
                                    <div key={1} className="">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-md px-5 text-base dark:bg-white bg-black"
                                        >
                                            <Link href="#link">
                        <span className="text-nowra dark:text-black text-white">
                          Browse Designs
                        </span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="rounded-md px-5 bg-foreground/10"
                                    >
                                        <Link href="#link">
                      <span className="text-nowrap dark:text-white text-black">
                        Submit Your Work
                      </span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <div className="mt-12 w-screen relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw]">
                            <CircularGallery
                                items={defaultItems}
                                bend={-9}
                                textColor="#ffffff"
                                borderRadius={0.03}
                            />
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
