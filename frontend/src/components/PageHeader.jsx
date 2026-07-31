import React from "react";

const PageHeader = ({ title, subtitle, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content">{title}</h1>
            {subtitle && <p className="text-base-content/60 mt-1 text-sm">{subtitle}</p>}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
);

export default PageHeader;
