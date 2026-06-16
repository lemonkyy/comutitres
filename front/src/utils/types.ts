export type Pass = {
  id: string;
  name: string,
  description?: string,
  prices: Price[],
};

export type Price = {
  id: string,
  amount: number,
}
