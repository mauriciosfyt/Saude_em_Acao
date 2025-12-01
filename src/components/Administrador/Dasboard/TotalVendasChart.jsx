﻿import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Sector, Tooltip, ResponsiveContainer } from "recharts";
import "./TotalVendasChart.css";

const TotalVendasChart = (props) => {
  const { total = 0, titulo = "Total de Reservas", breakdown = [] } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  console.log('[TotalVendasChart] Props recebidas:', { total, titulo, breakdown });

  const data = useMemo(() => {
    if (!breakdown || breakdown.length === 0) {
      console.log('[TotalVendasChart] Sem breakdown');
      return [];
    }
    const filtered = breakdown
      .filter(item => item && item.value > 0)
      .map(item => ({
        name: item.label,
        value: item.value,
        color: item.color
      }));
    console.log('[TotalVendasChart] Dados filtrados:', filtered);
    return filtered;
  }, [breakdown]);

  const renderShape = (shapeProps) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, value, percent } = shapeProps;
    const sin = Math.sin(-RADIAN * (midAngle || 0));
    const cos = Math.cos(-RADIAN * (midAngle || 0));
    const sx = (cx || 0) + (outerRadius || 0 + 10) * cos;
    const sy = (cy || 0) + (outerRadius || 0 + 10) * sin;
    const mx = (cx || 0) + (outerRadius || 0 + 30) * cos;
    const my = (cy || 0) + (outerRadius || 0 + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={(outerRadius || 0) + 6} outerRadius={(outerRadius || 0) + 10} fill={fill} />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={12}>{value}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={11}>{((percent || 0) * 100).toFixed(1)}%</text>
      </g>
    );
  };

  if (data.length === 0) {
    return (
      <div className="total-vendas-card">
        <h3>{titulo}</h3>
        <div className="chart-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#999" }}>
            <p>Nenhum dado disponível</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="total-vendas-card">
      <h3>{titulo}</h3>
      <div className="chart-wrapper" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ResponsiveContainer width="100%" height={380}>
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie activeIndex={activeIndex} activeShape={renderShape} data={data} cx="50%" cy="50%" innerRadius={65} outerRadius={110} fill="#8884d8" dataKey="value" onMouseEnter={(e, i) => setActiveIndex(i)}>
              {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={v => [v.toLocaleString("pt-BR"), "Quantidade"]} contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "8px", padding: "8px" }} />
          </PieChart>
        </ResponsiveContainer>
        {/* Total no centro do círculo */}
        <div className="total-center-inside">
          <span className="total-value">{Number(total).toLocaleString("pt-BR")}</span>
          <span className="total-label">Total</span>
        </div>
      </div>
    </div>
  );
};

export default TotalVendasChart;