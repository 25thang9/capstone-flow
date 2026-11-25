
"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";

import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

function shorten(text: string, max: number) {
    return text.length > max
        ? `${text.slice(0, max - 1)}…`
        : text;
}

const departmentConfig = {
    open: {
        label: "Đang nhận",
        color: "var(--chart-1)",
    },
    closed: {
        label: "Đã đóng",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export type DepartmentTopicDatum = {
    name: string;
    open: number;
    closed: number;
};

export function TopicsByDepartmentChart({
    data,
}: {
    data: DepartmentTopicDatum[];
}) {
    return (
        <>
            <ChartContainer
                config={departmentConfig}
                className="h-72 w-full"
                aria-hidden="true"
            >
                <BarChart
                    data={data}
                    margin={{
                        top: 8,
                        right: 8,
                        bottom: 0,
                        left: -16,
                    }}
                    barSize={28}
                >
                    <CartesianGrid vertical={false} />

                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        tickFormatter={(value: string) =>
                            shorten(
                                value.replace("Vật lý ", "VL "),
                                14
                            )
                        }
                    />

                    <YAxis
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                    />

                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />

                    <ChartLegend
                        content={<ChartLegendContent />}
                    />

                    <Bar
                        dataKey="open"
                        stackId="status"
                        fill="var(--color-open)"
                        isAnimationActive={false}
                    />

                    <Bar
                        dataKey="closed"
                        stackId="status"
                        fill="var(--color-closed)"
                        isAnimationActive={false}
                    />
                </BarChart>
            </ChartContainer>

            <table className="sr-only">
                <caption>Số đề tài theo bộ môn</caption>

                <thead>
                    <tr>
                        <th scope="col">Bộ môn</th>
                        <th scope="col">Đang nhận</th>
                        <th scope="col">Đã đóng</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((row) => (
                        <tr key={row.name}>
                            <th scope="row">{row.name}</th>
                            <td>{row.open}</td>
                            <td>{row.closed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
