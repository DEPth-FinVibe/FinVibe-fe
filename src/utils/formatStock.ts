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

/**
 * 거래량 표기. formatTradingValue와 동일하게 만/억 단위를 쓴다.
 * (K/M 영문 축약을 쓰면 같은 화면에서 "억"과 "10.7K"가 섞여 보인다)
 */
export function formatVolume(volume: number): string {
  if (volume >= 1_0000_0000) {
    return `${(volume / 1_0000_0000).toFixed(1)}억`;
  }
  // 10만 주 미만은 만 단위로 뭉치면 정보 손실이 커서 원래 수치를 보여준다
  if (volume >= 10_0000) {
    return `${Math.round(volume / 1_0000).toLocaleString("ko-KR")}만`;
  }
  return volume.toLocaleString("ko-KR");
}
