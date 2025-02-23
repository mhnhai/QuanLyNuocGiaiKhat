import React, { useState } from 'react';
import revenueService from '../services/revenue.service';

const Revenue = () => {
    const [dateType, setDateType] = useState('date');
    const [dateValue, setDateValue] = useState('');
    const [revenue, setRevenue] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchRevenue = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await revenueService.getRevenue(dateType, dateValue.replace(/-/g, ''));
            setRevenue(data.revenue);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Revenue</h1>
            <div>
                <label>
                    Select Type:
                    <select value={dateType} onChange={(e) => setDateType(e.target.value)}>
                        <option value="date">Date</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select>
                </label>
                {dateType === 'date' && (
                    <label>
                        Date:
                        <input
                            type="date"
                            value={dateValue}
                            onChange={(e) => setDateValue(e.target.value)}
                        />
                    </label>
                )}
                {dateType === 'month' && (
                    <label>
                        Month:
                        <input
                            type="month"
                            value={dateValue}
                            onChange={(e) => setDateValue(e.target.value)}
                        />
                    </label>
                )}
                {dateType === 'year' && (
                    <label>
                        Year:
                        <input
                            type="number"
                            value={dateValue}
                            onChange={(e) => setDateValue(e.target.value)}
                            min="1900"
                            max="2100"
                            placeholder="YYYY"
                        />
                    </label>
                )}
                <button onClick={handleFetchRevenue}>Fetch Revenue</button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {revenue !== null && <p>Revenue: {revenue}</p>}
        </div>
    );
};

export default Revenue;