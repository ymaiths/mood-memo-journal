
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllEntries } from "@/utils/storageUtils";
import { Card } from "@/components/ui/card";
import { DiaryEntry, MoodType } from "@/types";

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

  const getFilteredData = () => {
    const now = new Date();
    const filtered = entries.filter((entry: DiaryEntry) => {
      const entryDate = new Date(entry.date);
      if (timeRange === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return entryDate >= weekAgo;
      } else if (timeRange === "month") {
        return (
          entryDate.getMonth() === now.getMonth() &&
          entryDate.getFullYear() === now.getFullYear()
        );
      } else {
        return entryDate.getFullYear() === now.getFullYear();
      }
    });

    return filtered.map((entry: DiaryEntry) => ({
      date: new Date(entry.date).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
      }),
      value: moodToValue(entry.mood),
      color: getMoodColor(moodToValue(entry.mood)),
      note: entry.text,
    }));
  };

  const chartData = getFilteredData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <Card className="p-3 bg-white shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{getMoodLabel(value)}</p>
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
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#9b87f5"
              strokeWidth={2}
              dot={{ fill: "#9b87f5", r: 4 }}
              activeDot={{ r: 6, fill: "#7E69AB" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
