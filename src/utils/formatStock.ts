export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

export function formatPriceWithSymbol(price: number): string {
  return `₩${price.toLocaleString("ko-KR")}`;
}

export function formatChangeRate(rate: number): string {
  // 0.00%일 때는 부호 없이 표시
  if (rate === 0 || Math.abs(rate) < 0.01) {
    return "0.00%";
  }
  const sign = rate > 0 ? "+" : "";
  return `${sign}${rate.toFixed(2)}%`;
}

export function formatTradingValue(value: number): string {
  if (value >= 1_0000_0000_0000) {
    return `${(value / 1_0000_0000_0000).toFixed(0)}조`;
  }
  if (value >= 1_0000_0000) {
    return `${Math.round(value / 1_0000_0000).toLocaleString("ko-KR")}억`;
  }
  if (value >= 1_0000) {
    return `${Math.round(value / 1_0000).toLocaleString("ko-KR")}만`;
  }
  return value.toLocaleString("ko-KR");
}

export function formatVolume(volume: number): string {
  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(1)}M`;
  }
  if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(1)}K`;
  }
  return volume.toString();
}
