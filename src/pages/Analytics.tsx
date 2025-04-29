
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllEntries } from "@/utils/storageUtils";
import { Card } from "@/components/ui/card";
import { DiaryEntry, MoodType } from "@/types";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { format, subDays, eachDayOfInterval, startOfDay, endOfDay, subMonths, subYears, isWithinInterval } from "date-fns";

type TimeRange = "week" | "month" | "year";

// Helper to convert mood type to number value
const moodToValue = (mood: MoodType): number => {
  const moodValues: Record<MoodType, number> = {
    [MoodType.VERY_HAPPY]: 5,
    [MoodType.HAPPY]: 4,
    [MoodType.NEUTRAL]: 3,
    [MoodType.SAD]: 2,
    [MoodType.VERY_SAD]: 1,
  };
  return moodValues[mood];
};

// Helper to get mood color
const getMoodColor = (value: number): string => {
  const colors = {
    5: "#F2FCE2", // Very Happy
    4: "#FFDEE2", // Happy
    3: "#FDE1D3", // Neutral
    2: "#E5DEFF", // Sad
    1: "#ea384c", // Very Sad
  };
  return colors[value as keyof typeof colors] || colors[3];
};

// Helper to get Thai mood label
const getMoodLabel = (value: number): string => {
  const labels = {
    5: "สุขมาก 😄",
    4: "สุข 🙂",
    3: "เฉย ๆ 😐",
    2: "ไม่ค่อยโอเค 🙁",
    1: "เศร้า 😢",
  };
  return labels[value as keyof typeof labels] || labels[3];
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  
  const { data: entries = [] } = useQuery({
    queryKey: ["mood-entries"],
    queryFn: getAllEntries,
  });

  const getTimeRangeInterval = () => {
    const now = new Date();
    
    if (timeRange === "week") {
      return {
        start: startOfDay(subDays(now, 6)),
        end: endOfDay(now)
      };
    } else if (timeRange === "month") {
      return {
        start: startOfDay(subMonths(now, 1)),
        end: endOfDay(now)
      };
    } else {
      return {
        start: startOfDay(subYears(now, 1)),
        end: endOfDay(now)
      };
    }
  };

  const getFilteredData = () => {
    const interval = getTimeRangeInterval();
    const dateFormat = timeRange === "year" ? "MMM" : "d MMM";
    
    // Generate all days in the interval to ensure uniform X-axis
    const allDays = eachDayOfInterval(interval);
    
    // Create a map to organize entries by day
    const entriesByDay = new Map<string, DiaryEntry[]>();
    
    // Group entries by day
    entries.forEach((entry: DiaryEntry) => {
      const entryDate = new Date(entry.date);
      
      if (isWithinInterval(entryDate, interval)) {
        const dateKey = format(entryDate, "yyyy-MM-dd");
        
        if (!entriesByDay.has(dateKey)) {
          entriesByDay.set(dateKey, []);
        }
        
        entriesByDay.get(dateKey)?.push(entry);
      }
    });
    
    // Generate chart data with evenly distributed entries within each day
    const chartData = [];
    
    // Process each day in the interval
    allDays.forEach((day, dayIndex) => {
      const dateKey = format(day, "yyyy-MM-dd");
      const displayDate = format(day, dateFormat, { locale: thaiLocale });
      const dayEntries = entriesByDay.get(dateKey) || [];
      
      if (dayEntries.length > 0) {
        // If there are entries for this day, distribute them evenly
        dayEntries.forEach((entry, entryIndex) => {
          const moodValue = moodToValue(entry.mood);
          // Create a position within the day based on the entry index
          const entryPosition = dayEntries.length > 1 ? 
            entryIndex / (dayEntries.length - 1) : 0.5;
          
          chartData.push({
            date: displayDate,
            fullDate: new Date(entry.date),
            value: moodValue,
            color: getMoodColor(moodValue),
            entryText: entry.text,
            entryTime: entry.time,
            // Each day gets a unique x position (dayIndex), and entries are spaced within that day
            xPosition: dayIndex + entryPosition,
            actualEntry: true,
            // Ensure each point has a unique key
            key: `${dayIndex}-${entryIndex}`
          });
        });
      } else {
        // For days without entries, add a placeholder for the x-axis
        chartData.push({
          date: displayDate,
          fullDate: day,
          value: null,
          xPosition: dayIndex,
          actualEntry: false,
          key: `empty-${dayIndex}`
        });
      }
    });
    
    return chartData;
  };

  // Temporary Thai locale for date formatting
  const thaiLocale = {
    formatLong: {
      date: () => "dd/MM/yyyy"
    },
    localize: {
      month: (month: number) => {
        const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        return months[month];
      }
    },
    options: {
      weekStartsOn: 0
    }
  } as any;

  const chartData = getFilteredData();

  const chartConfig = {
    mood: {
      label: "อารมณ์",
      theme: {
        light: "#9b87f5",
        dark: "#7E69AB"
      }
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && payload[0].payload.actualEntry) {
      const data = payload[0].payload;
      return (
        <Card className="p-3 bg-white shadow-lg">
          <p className="text-sm font-medium">{label} {data.entryTime || ""}</p>
          <p className="text-sm text-muted-foreground">{getMoodLabel(data.value)}</p>
          {data.entryText && (
            <p className="text-xs mt-1 max-w-[200px] break-words">{data.entryText}</p>
          )}
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">สถิติอารมณ์</h1>
        <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="เลือกช่วงเวลา" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">สัปดาห์</SelectItem>
            <SelectItem value="month">เดือน</SelectItem>
            <SelectItem value="year">ปี</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-6">
        <ChartContainer config={chartConfig} className="h-[400px]">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
              interval={timeRange === "year" ? 0 : timeRange === "month" ? Math.floor(chartData.length / 10) : 0}
              scale="point"
            />
            <YAxis 
              domain={[0, 5]} 
              ticks={[1, 2, 3, 4, 5]}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-mood)"
              strokeWidth={2}
              dot={(props) => {
                if (!props.payload.actualEntry) return null;
                return (
                  <circle 
                    cx={props.cx} 
                    cy={props.cy} 
                    r={4}
                    fill="var(--color-mood)"
                    stroke="none"
                  />
                );
              }}
              activeDot={{ r: 6, fill: "#7E69AB" }}
              connectNulls={true}
            />
          </LineChart>
        </ChartContainer>
      </Card>
    </div>
  );
}
