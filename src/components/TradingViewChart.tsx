"use client";

import { useEffect, useRef } from "react";

// Embeds TradingView's officially-sanctioned "Advanced Chart" widget
// (https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/) -
// free, no API key, no scraping/ToS risk (unlike the earlier Yahoo Finance
// approach this replaced). Data freshness/real-time-ness is entirely
// TradingView's own - what a visitor sees depends on their TradingView
// account and the exchange's data licensing, which is out of our control
// and not something we should claim a specific delay/accuracy for.
//
// The widget requires its JSON config to be the literal text content of the
// injected <script> tag (not just appended some other way), and it doesn't
// react to prop changes on its own - so this re-creates the script/container
// from scratch whenever the symbol changes.
export default function TradingViewChart({
  symbol,
  height = 400,
}: {
  symbol: string;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = "calc(100% - 32px)";
    widgetDiv.style.width = "100%";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.text = JSON.stringify({
      autosize: true,
      symbol,
      interval: "5",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "2",
      locale: "en",
      allow_symbol_change: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    container.appendChild(widgetDiv);
    container.appendChild(script);
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container"
      style={{ height, width: "100%" }}
    />
  );
}
