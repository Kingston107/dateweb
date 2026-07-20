/**
 * heartConfig — static configuration for each floating heart decoration.
 *
 * Extracted here so the LandingPage component stays clean and the
 * particle array can be easily adjusted (count, positions, sizes).
 *
 * Values were chosen to create a scattered, organic look across the
 * full viewport without clustering near the main content area.
 */

export interface HeartConfig {
  id: string
  left: string
  top: string
  size: number
  duration: number
  delay: number
  opacity: number
}

export const HEART_CONFIGS: HeartConfig[] = [
  // Top-left cluster
  { id: 'h1',  left: '4%',   top: '8%',  size: 14, duration: 4.2, delay: 0,    opacity: 0.18 },
  { id: 'h2',  left: '9%',   top: '22%', size: 10, duration: 5.1, delay: 0.8,  opacity: 0.12 },
  { id: 'h3',  left: '2%',   top: '48%', size: 18, duration: 3.8, delay: 1.5,  opacity: 0.14 },
  { id: 'h4',  left: '14%',  top: '72%', size: 11, duration: 4.6, delay: 2.3,  opacity: 0.10 },
  { id: 'h5',  left: '7%',   top: '88%', size: 16, duration: 5.4, delay: 0.4,  opacity: 0.13 },

  // Top-right cluster
  { id: 'h6',  left: '90%',  top: '6%',  size: 12, duration: 4.0, delay: 1.1,  opacity: 0.16 },
  { id: 'h7',  left: '82%',  top: '18%', size: 20, duration: 5.8, delay: 0.6,  opacity: 0.11 },
  { id: 'h8',  left: '94%',  top: '35%', size: 9,  duration: 3.5, delay: 2.0,  opacity: 0.15 },
  { id: 'h9',  left: '78%',  top: '62%', size: 15, duration: 4.9, delay: 1.8,  opacity: 0.12 },
  { id: 'h10', left: '88%',  top: '80%', size: 13, duration: 4.3, delay: 0.2,  opacity: 0.17 },

  // Center-scattered (avoiding content center zone ~30-70% y)
  { id: 'h11', left: '32%',  top: '4%',  size: 11, duration: 4.7, delay: 1.3,  opacity: 0.10 },
  { id: 'h12', left: '55%',  top: '3%',  size: 8,  duration: 5.0, delay: 2.6,  opacity: 0.09 },
  { id: 'h13', left: '70%',  top: '92%', size: 14, duration: 4.1, delay: 0.9,  opacity: 0.13 },
  { id: 'h14', left: '40%',  top: '93%', size: 10, duration: 5.3, delay: 1.7,  opacity: 0.10 },
  { id: 'h15', left: '20%',  top: '14%', size: 9,  duration: 3.9, delay: 3.1,  opacity: 0.08 },
]
