
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllEntries } from "@/utils/storageUtils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DiaryEntry, MoodType } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, addMonths, subMonths, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

type TimeRange = "week" | "month";

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

// Type for processed chart data
interface ChartDataPoint {
  fullDate: Date;
  displayDate: string;
  value: number;
  color: string;
  note: string;
  xPosition: number; // Normalized position within the day (0-1)
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<{start: Date, end: Date}>({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });
  
  // Update date range when selected date or time range changes
  useEffect(() => {
    if (timeRange === "week") {
      setDateRange({
        start: startOfWeek(selectedDate, { weekStartsOn: 0 }),
        end: endOfWeek(selectedDate, { weekStartsOn: 0 }),
      });
    } else {
      setDateRange({
        start: startOfMonth(selectedDate),
        end: endOfMonth(selectedDate),
      });
    }
  }, [selectedDate, timeRange]);

  const { data: entries = [] } = useQuery({
    queryKey: ["mood-entries"],
    queryFn: getAllEntries,
  });

  const handlePrevious = () => {
    if (timeRange === "week") {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const handleNext = () => {
    if (timeRange === "week") {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  const formatTimeRangeDisplay = (): string => {
    if (timeRange === "week") {
      return `${format(dateRange.start, "d MMM")} - ${format(dateRange.end, "d MMM yyyy")}`;
    } else {
      return format(selectedDate, "MMMM yyyy");
    }
  };

  const getFilteredData = () => {
    // First, filter entries by the date range
    const filtered = entries.filter((entry: DiaryEntry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= dateRange.start && entryDate <= dateRange.end;
    });

    // Group entries by date
    const entriesByDay = filtered.reduce<Record<string, DiaryEntry[]>>((acc, entry) => {
      const dateString = format(new Date(entry.date), 'yyyy-MM-dd');
      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(entry);
      return acc;
    }, {});

    // Create data points with proper positioning
    const chartData: ChartDataPoint[] = [];
    
    Object.entries(entriesByDay).forEach(([dateString, dayEntries]) => {
      const date = new Date(dateString);
      const displayDate = format(date, 'd MMM', { locale: undefined });
      
      // Calculate position for each entry within the day
      dayEntries.forEach((entry, index) => {
        // Position is distributed evenly across the day's width
        const xPosition = dayEntries.length === 1 ? 0.5 : index / (dayEntries.length - 1 || 1);
        
        chartData.push({
          fullDate: date,
          displayDate,
          value: moodToValue(entry.mood),
          color: getMoodColor(moodToValue(entry.mood)),
          note: entry.text,
          xPosition
        });
      });
    });

    // Sort by date and then by position within the day
    return chartData.sort((a, b) => {
      if (isSameDay(a.fullDate, b.fullDate)) {
        return a.xPosition - b.xPosition;
      }
      return a.fullDate.getTime() - b.fullDate.getTime();
    });
  };

  const chartData = getFilteredData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="p-3 bg-white shadow-lg">
          <p className="text-sm font-medium">{data.displayDate}</p>
          <p className="text-sm text-muted-foreground">{getMoodLabel(data.value)}</p>
          {data.note && (
            <p className="text-xs mt-1 max-w-60 overflow-hidden text-ellipsis">{data.note}</p>
          )}
        </Card>
      );
    }
    return null;
  };

  // Generate tick values for the X-axis - one tick per unique day
  const xAxisTicks = Array.from(new Set(chartData.map(item => item.displayDate)));

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">สถิติอารมณ์</h1>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="เลือกช่วงเวลา" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">สัปดาห์</SelectItem>
              <SelectItem value="month">เดือน</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center border rounded-md px-2 py-1 gap-2 bg-background">
            <Button variant="ghost" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatTimeRangeDisplay()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="ghost" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <XAxis 
              dataKey="displayDate" 
              ticks={xAxisTicks}
              tickLine={true}
              axisLine={true}
              padding={{ left: 30, right: 30 }}
            />
            <YAxis 
              domain={[0, 5]} 
              ticks={[1, 2, 3, 4, 5]} 
              padding={{ top: 20, bottom: 20 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#9b87f5"
              strokeWidth={2}
              dot={{ 
                fill: (data: ChartDataPoint) => data.color, 
                r: 5,
                strokeWidth: 1,
                stroke: "#9b87f5"
              }}
              activeDot={{ 
                r: 7, 
                fill: "#7E69AB",
                stroke: "#ffffff",
                strokeWidth: 2
              }}
              connectNulls={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
