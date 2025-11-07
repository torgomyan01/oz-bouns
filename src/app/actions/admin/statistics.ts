"use server";

import { prisma } from "@/lib/prisma";

export type StatisticsResponse = {
  ok: boolean;
  data?: {
    totalUsers: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
  };
  message?: string;
};

export async function getStatisticsAction(): Promise<StatisticsResponse> {
  try {
    const [totalUsers, totalOrders, pendingOrders, completedOrders] =
      await Promise.all([
        prisma.users.count(),
        prisma.orders.count(),
        prisma.orders.count({
          where: { status: "pending" },
        }),
        prisma.orders.count({
          where: { status: "completed" },
        }),
      ]);

    return {
      ok: true,
      data: {
        totalUsers,
        totalOrders,
        pendingOrders,
        completedOrders,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: "Չհաջողվեց ստանալ վիճակագրությունը",
    };
  }
}

export type DailyOrdersResponse = {
  ok: boolean;
  data?: Array<{
    date: string;
    count: number;
  }>;
  message?: string;
};

export async function getDailyOrdersForMonthAction(): Promise<DailyOrdersResponse> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    // Get all orders for current month
    const orders = await prisma.orders.findMany({
      where: {
        created_at: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        created_at: true,
      },
    });

    // Group by date
    const dailyCounts: Record<string, number> = {};

    // Initialize all days of the month with 0
    const daysInMonth = endOfMonth.getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(now.getFullYear(), now.getMonth(), day);
      const dateKey = date.toISOString().split("T")[0];
      dailyCounts[dateKey] = 0;
    }

    // Count orders per day
    orders.forEach((order) => {
      const dateKey = order.created_at.toISOString().split("T")[0];
      if (dailyCounts[dateKey] !== undefined) {
        dailyCounts[dateKey]++;
      }
    });

    // Convert to array format
    const result = Object.entries(dailyCounts)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Չհաջողվեց ստանալ օրական պատվերների վիճակագրությունը",
    };
  }
}
