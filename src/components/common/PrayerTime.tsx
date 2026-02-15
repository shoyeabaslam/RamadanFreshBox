"use client"

import { Clock, Sunrise, Sunset } from 'lucide-react'
import { useEffect, useState } from 'react'

export const PrayerTime = ({ isMobile }: { isMobile: boolean }) => {
    const [currentTime, setCurrentTime] = useState<string>("")

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                })
            )
        }

        updateTime()
        const interval = setInterval(updateTime, 1000)

        return () => clearInterval(interval)
    }, [])

    // Static times for now - In sha Allah, we'll connect to real prayer times API later
    const sehriTime = "4:45 AM"
    const iftarTime = "6:30 PM"

    if (isMobile) {
        // Mobile: Horizontal layout at bottom, static position
        return (
            <div className="xl:hidden w-full bg-linear-to-r from-primary/5 via-accent/5 to-primary/5 border-t border-primary/10 backdrop-blur-sm">
                <div className="grid grid-cols-3 divide-x divide-primary/10">
                    {/* Current Time */}
                    <div className="flex flex-col items-center justify-center gap-1 p-3">
                        <div className="p-2 rounded-full bg-primary/10">
                            <Clock className="w-4 h-4 text-primary animate-pulse" />
                        </div>
                        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">
                            Current
                        </p>
                        <p className="text-xs font-bold text-primary">
                            {currentTime || "Loading..."}
                        </p>
                    </div>

                    {/* Sehri Time */}
                    <div className="flex flex-col items-center justify-center gap-1 p-3 bg-primary/5">
                        <div className="p-2 rounded-full bg-primary/15 animate-pulse-slow">
                            <Sunrise className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">
                            Sehri Ends
                        </p>
                        <p className="text-xs font-bold text-foreground">
                            {sehriTime}
                        </p>
                    </div>

                    {/* Iftar Time */}
                    <div className="flex flex-col items-center justify-center gap-1 p-3 bg-accent/5">
                        <div className="p-2 rounded-full bg-accent/20 animate-pulse-slow">
                            <Sunset className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">
                            Iftar Time
                        </p>
                        <p className="text-xs font-bold text-foreground">
                            {iftarTime}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Desktop: Card layout on bottom right, absolute position
    return (
        <div className="hidden xl:block absolute bottom-4 right-20 z-10">
            <div className="bg-white/98 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden animate-slide-in-right min-w-65">
                <div className="p-4 space-y-3">
                    {/* Current Time */}
                    <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-primary/15">
                                    <Clock className="w-5 h-5 text-primary animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        Current Time
                                    </p>
                                    <p className="text-lg font-bold text-primary">
                                        {currentTime || "Loading..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sehri Time */}
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-linear-to-br from-primary/20 to-primary/10 animate-pulse-slow">
                                <Sunrise className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">
                                    Sehri Ends (Fajr)
                                </p>
                                <p className="text-base font-bold text-foreground">
                                    {sehriTime}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Iftar Time */}
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/5 transition-colors border border-transparent hover:border-accent/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-linear-to-br from-accent/30 to-accent/15 animate-pulse-slow">
                                <Sunset className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">
                                    Iftar Time (Maghrib)
                                </p>
                                <p className="text-base font-bold text-foreground">
                                    {iftarTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-linear-to-r from-primary/5 to-accent/5 px-4 py-2 text-center border-t border-primary/10">
                    <p className="text-[10px] text-muted-foreground italic">
                        May Allah accept your fast 🤲
                    </p>
                </div>
            </div>
        </div>
    )
}
