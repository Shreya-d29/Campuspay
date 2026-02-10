import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const data = [
    { name: 'Mon', volume: 400, transactions: 24 },
    { name: 'Tue', volume: 300, transactions: 13 },
    { name: 'Wed', volume: 200, transactions: 98 },
    { name: 'Thu', volume: 278, transactions: 39 },
    { name: 'Fri', volume: 189, transactions: 48 },
    { name: 'Sat', volume: 239, transactions: 38 },
    { name: 'Sun', volume: 349, transactions: 43 },
];

const categoryData = [
    { name: 'Food', value: 45, color: '#00ffd5' },
    { name: 'Entertainment', value: 25, color: '#9d00ff' },
    { name: 'Transport', value: 15, color: '#00ff88' },
    { name: 'Education', value: 15, color: '#ff0088' },
];

const DashboardCharts = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
            {/* Volume Chart */}
            <div className="glass-card" style={{ padding: '24px', height: '300px' }}>
                <h4 style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Platform Volume (ALGO)</h4>
                <ResponsiveContainer width="100%" height="80%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `$${v}`}
                        />
                        <Tooltip
                            contentStyle={{ background: '#111', border: '1px solid var(--glass-border)', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: 'var(--accent-cyan)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="volume"
                            stroke="var(--accent-cyan)"
                            fillOpacity={1}
                            fill="url(#colorVolume)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Spending Breakdown */}
            <div className="glass-card" style={{ padding: '24px', height: '300px' }}>
                <h4 style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Spending Breakdown</h4>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{ background: '#111', border: '1px solid var(--glass-border)', borderRadius: '8px', fontSize: '12px' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardCharts;
