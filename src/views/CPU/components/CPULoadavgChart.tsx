import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useQuery } from "react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { fetchCPU } from "../../../api/cpu";
import { toTime } from "../../../utils/formatNumber";
import Loading from "../../../components/Loading";
import SelectBlock from "../../../components/SelectBlock";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * CPU 平均负载组件
 */
const CPULoadavgChart = () => {
  const [period, setPeriod] = useState(300);
  const {
    status,
    data: CPULoadavgData,
    error,
  } = useQuery<any>(["CpuLoadavg", period], async () => {
    const res: any = await fetchCPU("CpuLoadavg", period);

    const timestamps = res.DataPoints[0].Timestamps.slice(-10).map(
      (item: number) => toTime(item)
    );
    const values = res.DataPoints[0].Values.slice(-10);
    return {
      labels: timestamps,
      datasets: [
        {
          label: "CPU 平均负载",
          data: values,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };
  });

  if (status === "loading") return <Loading title="CPU 平均负载" />;
  if (status === "error") {
    return <h2>Error:{error}</h2>;
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginTop: "50px" }}>
        <Box sx={{ mr: 5 }}>
          <Typography variant="h5">CPU 平均负载</Typography>
        </Box>

        <SelectBlock period={period} setPeriod={setPeriod} />
      </div>

      <Line
        height={70}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const,
            },
            title: {
              display: true,
              text: "CPU 平均负载",
            },
          },
        }}
        data={CPULoadavgData}
      />
    </>
  );
};

export default CPULoadavgChart;
