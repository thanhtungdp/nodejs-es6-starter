const COIN_PER_VND = 2000

export function convertAmountToCoin (amount) {
  return parseInt(amount / COIN_PER_VND)
}
