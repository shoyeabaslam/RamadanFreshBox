"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { banner_1 } from "@/assets"
import Image from "next/image"
import { Sunrise, Sunset, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { PrayerTime } from "./PrayerTime"

export function Banner() {
    return (
        <Carousel className="w-[100vw] max-h-[40vh]">
            <CarouselContent>
                {Array.from({ length: 1 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="relative w-full aspect-video max-h-[40vh]">
                            <Image
                                src={banner_1}
                                alt={`Banner ${index + 1}`}
                                fill
                                className="object-cover object-center"
                                priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-black/40" />

                            {/* Center Content - Title and Tags */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 sm:px-6 md:px-8">
                                <h1
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[oklch(0.75_0.12_85)] mb-1 sm:mb-2 text-center animate-fade-in leading-tight"
                                    style={{ fontFamily: "'Great Vibes', cursive" }}
                                >
                                    Share the Blessings of Ramadan
                                </h1>
                                <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl text-[oklch(0.97_0.02_85)] mb-3 sm:mb-4 md:mb-6 text-center animate-fade-in-up">
                                    <span>WITH A</span> <span><strong>RAMADAN FRESH BOX</strong></span>
                                </h2>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center animate-fade-in-up max-w-[90%] sm:max-w-full">
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/90 text-primary hover:bg-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium backdrop-blur-sm"
                                    >
                                        🍎 Fresh Iftar Fruits
                                    </Badge>
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/90 text-primary hover:bg-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium backdrop-blur-sm"
                                    >
                                        🤲 Order · Donate · Sponsor
                                    </Badge>
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/90 text-primary hover:bg-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium backdrop-blur-sm"
                                    >
                                        🚚 Before Maghrib Delivery
                                    </Badge>
                                </div>
                            </div>
                            <PrayerTime isMobile={false} />

                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}
