import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
    timeseries: Record<string, any>,
    currPrice: number,
    prevPrice: number
}

export default function Chart({ timeseries, currPrice ,prevPrice }: Props) {
    const data = Object.entries(timeseries).map(([date, values]) => ({
        date,
        close: values.Close,
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={`${currPrice - prevPrice > 0 ?  "#418f4b" : "#bd5050" }`} stopOpacity={0.5} />
                        <stop offset="95%" stopColor={`${currPrice - prevPrice > 0 ?  "#418f4b" : "#bd5050" }`} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }} 
                    tickLine={false}
                    tickFormatter={(date) => {
                        const d = new Date(date);
                        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    }}
                />
                <YAxis 
                    domain={["auto", "auto"]} 
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v.toFixed(0)}`}
                />
                <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Close"]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                />
                <Area 
                    type="monotone" 
                    dataKey="close" 
                    stroke={`${currPrice - prevPrice > 0 ?  "#418f4b" : "#bd5050" }`}
                    strokeWidth={2}
                    fill="url(#colorClose)"
                    dot={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}