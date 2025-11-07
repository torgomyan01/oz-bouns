"use client";

import AdminMainTemplate from "@/components/layout/admin/admin-main-template";
import { SITE_URL } from "@/utils/consts";
import { useEffect, useState } from "react";
import { Card, CardBody, Spinner } from "@heroui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  getStatisticsAction,
  getDailyOrdersForMonthAction,
} from "@/app/actions/admin/statistics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function Page() {
  const [statistics, setStatistics] = useState<{
    totalUsers: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
  } | null>(null);
  const [dailyOrders, setDailyOrders] = useState<
    Array<{ date: string; count: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [statsResult, dailyResult] = await Promise.all([
        getStatisticsAction(),
        getDailyOrdersForMonthAction(),
      ]);

      if (!statsResult.ok) {
        setError(statsResult.message || "Չհաջողվեց բեռնել վիճակագրությունը");
        return;
      }
      setStatistics(statsResult.data || null);

      if (!dailyResult.ok) {
        setError(
          dailyResult.message ||
            "Չհաջողվեց բեռնել օրական պատվերների վիճակագրությունը",
        );
        return;
      }
      setDailyOrders(dailyResult.data || []);
    } catch (e: any) {
      setError("Չհաջողվեց բեռնել տվյալները");
    } finally {
      setLoading(false);
    }
  }

  const chartData = {
    labels: dailyOrders.map((item) => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: "Պատվերների քանակ",
        data: dailyOrders.map((item) => item.count),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Ամսվա կտրվածքով պատվերների քանակ",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return (
      <AdminMainTemplate pathname={SITE_URL.ADMIN_AND}>
        <div className="flex justify-center items-center h-[400px]">
          <Spinner size="lg" />
        </div>
      </AdminMainTemplate>
    );
  }

  return (
    <AdminMainTemplate pathname={SITE_URL.ADMIN_AND}>
      <div className="space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardBody>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500 mb-1">
                    Ընդհանուր օգտատերեր
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {statistics.totalUsers}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500 mb-1">
                    Ընդհանուր պատվերներ
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {statistics.totalOrders}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500 mb-1">
                    Հաստատված պատվերներ
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {statistics.completedOrders}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500 mb-1">
                    Չհաստատված պատվերներ
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {statistics.pendingOrders}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Chart */}
        <Card>
          <CardBody>
            <div className="h-[400px]">
              {dailyOrders.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Տվյալներ չկան</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminMainTemplate>
  );
}

export default Page;
