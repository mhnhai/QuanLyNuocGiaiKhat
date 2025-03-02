import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import revenueService from '../services/revenue.service';
import costService from "../services/cost.service";

const DataChart = () => {
    const [period, setPeriod] = useState('month');
    const [value, setValue] = useState('');
    const [revenueData, setRevenueData] = useState(null);
    const [costData, setCostData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const handleFetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [revenueResponse, costResponse] = await Promise.all([
                revenueService.getRevenue(period, value.replace(/-/g, '')),
                costService.getCost(period, value.replace(/-/g, ''))
            ]);
            setRevenueData(revenueResponse);
            setCostData(costResponse);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (revenueData && costData && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            chartInstanceRef.current = new Chart(ctx, {
                type: 'line',
                data: getChartData(),
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Thời gian'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Số tiền (Triệu đồng)'
                            }
                        }
                    }
                }
            });
        }
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        }
    }, [revenueData, costData]);

    const getChartData = () => {
        if (!revenueData || !costData) return {};

        const labels = period === 'year' ?
            Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`) :
            period === 'years' ?
                Array.from({ length: 5 }, (_, i) => `Năm ${value - 4 + i}`) :
                period === 'month' ?
                    Array.from({ length: revenueData.daily_revenue.length }, (_, i) => `Day ${i + 1}`) :
                    ['Total'];

        const revenueDataset = {
            label: 'Doanh thu',
            data: period === 'year' ? revenueData.monthly_revenue :
                period === 'years' ? revenueData.yearly_revenue :
                    period === 'month' ? revenueData.daily_revenue :
                        [revenueData.revenue],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
        };

        const costDataset = {
            label: 'Chi phí',
            data: period === 'year' ? costData.monthly_cost :
                period === 'years' ? costData.yearly_cost :
                    period === 'month' ? costData.daily_cost :
                        [costData.cost],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
        };

        return {
            labels,
            datasets: [revenueDataset, costDataset]
        };
    };

    return (
        <div>
            <div className="card bg-base-100 w-96 shadow-lg p-4">
                <p>Thống kê theo:</p>
                <select className="select select-sm select-primary" value={period} onChange={(e) => setPeriod(e.target.value)}>
                    <option value="month">Ngày trong tháng</option>
                    <option value="year">Tháng trong năm</option>
                    <option value="years">5 năm qua</option>
                </select>
                <p>Thời gian:</p>
                {period === 'month' && (
                    <input
                        type="month"
                        className="input input-primary input-sm"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                )}
                {period !== 'month' && (
                    <input
                        type="number"
                        className="input input-primary input-sm"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        min={2000}
                        max={2100}
                    />
                )}
            </div>
            <div>
                <button onClick={handleFetchData}>Xem doanh thu</button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {revenueData && costData && (
                <div style={{width: '1000px', height: 'auto'}}>
                    <canvas ref={chartRef}></canvas>
                </div>
            )}
        </div>
    );
};

export default DataChart;