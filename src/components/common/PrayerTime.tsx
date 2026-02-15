"use client"

import { Sunrise, Sunset, Calendar, Moon } from 'lucide-react'

const ramadan2026Hyderabad = [
  { day: 1,  date: "2026-02-19", weekday: "Thu", iftar: "6:25", sehar: "5:19" },
  { day: 2,  date: "2026-02-20", weekday: "Fri", iftar: "6:25", sehar: "5:18" },
  { day: 3,  date: "2026-02-21", weekday: "Sat", iftar: "6:26", sehar: "5:18" },
  { day: 4,  date: "2026-02-22", weekday: "Sun", iftar: "6:26", sehar: "5:18" },
  { day: 5,  date: "2026-02-23", weekday: "Mon", iftar: "6:27", sehar: "5:17" },
  { day: 6,  date: "2026-02-24", weekday: "Tue", iftar: "6:27", sehar: "5:17" },
  { day: 7,  date: "2026-02-25", weekday: "Wed", iftar: "6:27", sehar: "5:15" },
  { day: 8,  date: "2026-02-26", weekday: "Thu", iftar: "6:27", sehar: "5:15" },
  { day: 9,  date: "2026-02-27", weekday: "Fri", iftar: "6:27", sehar: "5:14" },
  { day: 10, date: "2026-02-28", weekday: "Sat", iftar: "6:28", sehar: "5:14" },
  { day: 11, date: "2026-03-01", weekday: "Sun", iftar: "6:28", sehar: "5:13" },
  { day: 12, date: "2026-03-02", weekday: "Mon", iftar: "6:28", sehar: "5:11" },
  { day: 13, date: "2026-03-03", weekday: "Tue", iftar: "6:28", sehar: "5:11" },
  { day: 14, date: "2026-03-04", weekday: "Wed", iftar: "6:29", sehar: "5:10" },
  { day: 15, date: "2026-03-05", weekday: "Thu", iftar: "6:29", sehar: "5:10" },
  { day: 16, date: "2026-03-06", weekday: "Fri", iftar: "6:29", sehar: "5:09" },
  { day: 17, date: "2026-03-07", weekday: "Sat", iftar: "6:30", sehar: "5:08" },
  { day: 18, date: "2026-03-08", weekday: "Sun", iftar: "6:30", sehar: "5:08" },
  { day: 19, date: "2026-03-09", weekday: "Mon", iftar: "6:30", sehar: "5:07" },
  { day: 20, date: "2026-03-10", weekday: "Tue", iftar: "6:30", sehar: "5:06" },
  { day: 21, date: "2026-03-11", weekday: "Wed", iftar: "6:30", sehar: "5:05" },
  { day: 22, date: "2026-03-12", weekday: "Thu", iftar: "6:31", sehar: "5:05" },
  { day: 23, date: "2026-03-13", weekday: "Fri", iftar: "6:31", sehar: "5:04" },
  { day: 24, date: "2026-03-14", weekday: "Sat", iftar: "6:31", sehar: "5:03" },
  { day: 25, date: "2026-03-15", weekday: "Sun", iftar: "6:31", sehar: "5:02" },
  { day: 26, date: "2026-03-16", weekday: "Mon", iftar: "6:32", sehar: "5:01" },
  { day: 27, date: "2026-03-17", weekday: "Tue", iftar: "6:32", sehar: "5:00" },
  { day: 28, date: "2026-03-18", weekday: "Wed", iftar: "6:32", sehar: "5:00" },
  { day: 29, date: "2026-03-19", weekday: "Thu", iftar: "6:32", sehar: "4:59" },
  { day: 30, date: "2026-03-20", weekday: "Fri", iftar: "6:33", sehar: "4:58" }
];

// Get current Ramadan day data
const getCurrentRamadanDay = () => {
  const today = new Date().toISOString().split('T')[0]
  const startDate = ramadan2026Hyderabad[0].date
  
  // If current date is before Ramadan, show first day
  if (today < startDate) {
    return ramadan2026Hyderabad[0]
  }
  
  // Find matching date in Ramadan array
  const currentDay = ramadan2026Hyderabad.find(day => day.date === today)
  
  // If date matches, return it; otherwise return first day
  return currentDay || ramadan2026Hyderabad[0]
}

// Format date consistently
const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-')
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[Number.parseInt(month) - 1]} ${Number.parseInt(day)}, ${year}`
}

export const PrayerTime = ({ isMobile }: { isMobile: boolean }) => {
  const ramadanDay = getCurrentRamadanDay()
  const today = new Date().toISOString().split('T')[0]
  const isBeforeRamadan = today < ramadan2026Hyderabad[0].date
  const isAfterRamadan = today > ramadan2026Hyderabad.at(-1)!.date
  
  // Helper functions for display text
  const getRamadanDayText = () => {
    if (isBeforeRamadan) return 'Starting Soon'
    if (isAfterRamadan) return 'Completed'
    return `Day ${ramadanDay.day}`
  }

  const getRamadanHeaderText = () => {
    if (isBeforeRamadan) return 'Ramadan Starts'
    if (isAfterRamadan) return 'Ramadan'
    return 'Ramadan 2026'
  }

  const getRamadanTitleText = () => {
    if (isBeforeRamadan) return 'Feb 19th'
    if (isAfterRamadan) return 'Completed'
    return `Day ${ramadanDay.day} of 30`
  }

  // Format date with weekday
  const formattedDate = `${ramadanDay.weekday}, ${formatDate(ramadanDay.date)}`

  if (isMobile) {
    // Mobile: Horizontal layout at bottom
    return (
      <div className="xl:hidden w-full bg-linear-to-r from-primary/10 via-accent/10 to-primary/10 border-t-2 border-primary/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Ramadan Day Badge */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/20">
                <Moon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground font-medium uppercase">Ramadan Day</p>
                <p className="text-sm font-bold text-primary">
                  {getRamadanDayText()}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[9px] text-muted-foreground font-medium uppercase">Date</p>
                <p className="text-xs font-bold text-foreground">
                  {formatDate(ramadanDay.date).split(',')[0]}
                </p>
              </div>
            </div>

            {/* Sehri */}
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-[9px] text-muted-foreground font-medium uppercase">Sehri</p>
                <p className="text-xs font-bold text-foreground">{ramadanDay.sehar} AM</p>
              </div>
            </div>

            {/* Iftar */}
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-[9px] text-muted-foreground font-medium uppercase">Iftar</p>
                <p className="text-xs font-bold text-foreground">{ramadanDay.iftar} PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Desktop: Card layout on bottom right
  return (
    <div className="hidden xl:block fixed bottom-6 right-6 z-50">
      <div className="bg-card backdrop-blur-xl rounded-xl shadow-2xl border border-primary/20 overflow-hidden animate-slide-in-right w-72">
        {/* Header with Ramadan Day */}
        <div className="bg-primary px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-white/20">
                <Moon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-white/80 font-medium uppercase tracking-wide">
                  {getRamadanHeaderText()}
                </p>
                <p className="text-lg font-bold text-white">
                  {getRamadanTitleText()}
                </p>
              </div>
            </div>
            {!isBeforeRamadan && !isAfterRamadan && (
              <div className="text-right">
                <p className="text-[9px] text-white/70">Left</p>
                <p className="text-sm font-bold text-white">{30 - ramadanDay.day}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Date Info */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-foreground">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Sehri Time */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30">
            <div className="p-2 rounded-full bg-orange-500">
              <Sunrise className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-orange-700 dark:text-orange-400 font-semibold uppercase tracking-wide">
                Sehri Ends
              </p>
              <p className="text-xl font-bold text-orange-900 dark:text-orange-300">
                {ramadanDay.sehar} AM
              </p>
            </div>
          </div>

          {/* Iftar Time */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30">
            <div className="p-2 rounded-full bg-amber-600">
              <Sunset className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wide">
                Iftar Time
              </p>
              <p className="text-xl font-bold text-amber-900 dark:text-amber-300">
                {ramadanDay.iftar} PM
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/50 px-4 py-2 text-center border-t border-border">
          <p className="text-[9px] text-muted-foreground font-medium">
            May Allah accept your fast 🤲
          </p>
        </div>
      </div>
    </div>
  )
}
