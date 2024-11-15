"use client";

import { BarChart } from "@/components/ui/BarChart";
import DateRangePicker from "@/components/ui/DateRangePicker";
import Loading from "@/components/ui/Loading";
import { addDays, differenceInDays, format } from "date-fns";
import qs from "qs";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
type ChartData = {
  date: string;
  count: number;
};
const MainPage = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    addDays(new Date(), -7),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;
  const isValidDateRange = (dateRange: [Date | null, Date | null]) => {
    if (!dateRange[0] || !dateRange[1]) return false;
    const daysDifference = differenceInDays(dateRange[1], dateRange[0]);
    return daysDifference <= 7;
  };

  const queryString = (dateRange: [Date | null, Date | null]) => {
    return qs.stringify({
      startDate: dateRange[0] ? format(dateRange[0], "yyyy-MM-dd") : undefined,
      endDate: dateRange[1] ? format(dateRange[1], "yyyy-MM-dd") : undefined,
    });
  };

  const { data, error, isLoading } = useSWR(() => {
    if (!isValidDateRange(dateRange)) return null;
    const query = queryString(dateRange);
    return `/api/users/history?${query}`;
  });

  const [chartData, setChartData] = useState<ChartData[]>([]);

  const updateDateRange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
  };

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      const daysDifference = differenceInDays(dateRange[1], dateRange[0]);
      if (daysDifference > 7) toast.warn("일주일 간격으로 조회해주세요.");
    }
  }, [dateRange]);

  useEffect(() => {
    if (data && data.code === "REQ000") {
      setChartData(data.list);
    }
  }, [data]);
  return (
    <div className="flex flex-col items-center justify-center">
      {isLoading && <Loading loading={isLoading} />}
      <div className="w-[80%] flex justify-end">
        <div className="w-[300px]">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setDateRange={updateDateRange}
          />
        </div>
      </div>

      <div className="w-[80%] mt-8">
        <BarChart chartData={chartData} />
      </div>
    </div>
  );
};

export default MainPage;
