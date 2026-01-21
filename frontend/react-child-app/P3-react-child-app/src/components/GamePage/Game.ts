// Game entity type for GamesDashboard and related components
export interface Game {
  id: number;
  name: string;
  tags: string[];
  price: number;
  rating: number;
  description?: string;
  // Add other properties as needed
}
