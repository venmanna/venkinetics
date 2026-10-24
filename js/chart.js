/**
 * Apex Pulse - High-DPI Canvas Charts
 * Hardware-accelerated, zero-dependency charts with emerald glow and gradients.
 */

export class ChartEngine {
  static setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set display size
    const width = rect.width || canvas.parentElement.clientWidth || 320;
    const height = rect.height || 180;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, width, height, dpr };
  }

  // Draw Weight Trend Chart
  static renderWeightChart(canvas, data, unit = 'kg') {
    if (!canvas || !data || data.length === 0) return;
    const { ctx, width, height } = this.setupCanvas(canvas);

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 20, bottom: 35, left: 45 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const weights = data.map((d) => d.weight);
    let minW = Math.min(...weights);
    let maxW = Math.max(...weights);
    if (minW === maxW) {
      minW -= 1;
      maxW += 1;
    }
    const range = (maxW - minW) * 1.15;
    const baseMin = minW - (maxW - minW) * 0.08;

    // Grid lines & Y-axis labels
    const steps = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillStyle = '#64748b';
    ctx.font = '11px "Outfit", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= steps; i++) {
      const val = baseMin + (range * i) / steps;
      const y = padding.top + chartHeight - (chartHeight * i) / steps;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillText(val.toFixed(1) + ' ' + unit, padding.left - 8, y);
    }

    if (data.length === 1) {
      const x = padding.left + chartWidth / 2;
      const y = padding.top + chartHeight / 2;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    // Points calculation
    const points = data.map((d, idx) => {
      const x = padding.left + (chartWidth * idx) / (data.length - 1);
      const y = padding.top + chartHeight - ((d.weight - baseMin) / range) * chartHeight;
      return { x, y, ...d };
    });

    // Draw Gradient Area under curve
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding.bottom);
    ctx.lineTo(points[0].x, points[0].y);

    // Smooth Bezier curve
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      ctx.bezierCurveTo(cx, p0.y, cx, p1.y, p1.x, p1.y);
    }

    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw Glowing Stroke Line
    ctx.save();
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      ctx.bezierCurveTo(cx, p0.y, cx, p1.y, p1.x, p1.y);
    }
    ctx.stroke();
    ctx.restore();

    // Draw End Point Indicator & Value
    const lastPoint = points[points.length - 1];
    ctx.fillStyle = '#0a0e10';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Date X-axis labels (first, mid, last)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "Outfit", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(points[0].date.slice(5), points[0].x, height - padding.bottom + 8);

    ctx.textAlign = 'right';
    ctx.fillText(lastPoint.date.slice(5), lastPoint.x, height - padding.bottom + 8);

    if (points.length > 4) {
      const mid = points[Math.floor(points.length / 2)];
      ctx.textAlign = 'center';
      ctx.fillText(mid.date.slice(5), mid.x, height - padding.bottom + 8);
    }
  }

  // Draw 7-Day Calorie Bar Chart
  static renderCalorieBarChart(canvas, daysData, target = 2400) {
    if (!canvas || !daysData || daysData.length === 0) return;
    const { ctx, width, height } = this.setupCanvas(canvas);

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 25, right: 15, bottom: 28, left: 35 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxCal = Math.max(...daysData.map((d) => d.calories), target * 1.15, 1000);

    // Target benchmark line
    const targetY = padding.top + chartHeight - (target / maxCal) * chartHeight;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(width - padding.right, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px "Outfit", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Target ' + target, width - padding.right, targetY - 5);

    // Draw Bars
    const barWidth = Math.min(26, (chartWidth / daysData.length) * 0.65);
    const stepX = chartWidth / daysData.length;

    daysData.forEach((day, idx) => {
      const x = padding.left + idx * stepX + (stepX - barWidth) / 2;
      const barH = Math.max(4, (day.calories / maxCal) * chartHeight);
      const y = padding.top + chartHeight - barH;

      const isToday = idx === daysData.length - 1;
      const isOver = day.calories > target + 150;

      // Color selection
      let grad = ctx.createLinearGradient(0, y, 0, y + barH);
      if (isOver) {
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(1, '#9f1239');
      } else if (isToday) {
        grad.addColorStop(0, '#34d399');
        grad.addColorStop(1, '#059669');
      } else {
        grad.addColorStop(0, '#10b981');
        grad.addColorStop(1, '#064e3b');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Day label
      ctx.fillStyle = isToday ? '#34d399' : '#64748b';
      ctx.font = isToday ? 'bold 10px "Outfit", sans-serif' : '10px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(day.label || day.date.slice(5), x + barWidth / 2, height - padding.bottom + 8);

      // Value above bar
      if (day.calories > 0) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = '9px "Outfit", sans-serif';
        ctx.fillText(Math.round(day.calories), x + barWidth / 2, y - 4);
      }
    });
  }
}
