
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Nujmooz brand colors
				'nujmooz-green': 'hsl(var(--nujmooz-green))',
				'nujmooz-dark-green': 'hsl(var(--nujmooz-dark-green))',
				'nujmooz-light-gray': 'hsl(var(--nujmooz-light-gray))',
				'nujmooz-medium-gray': 'hsl(var(--nujmooz-medium-gray))',
				'nujmooz-dark': 'hsl(var(--nujmooz-dark))',
				'nujmooz-border': 'hsl(var(--nujmooz-border))',
				// OfSpace cosmic brand colors
				'ofspace-cosmic-purple': 'hsl(var(--ofspace-cosmic-purple))',
				'ofspace-cosmic-blue': 'hsl(var(--ofspace-cosmic-blue))',
				'ofspace-cosmic-cyan': 'hsl(var(--ofspace-cosmic-cyan))',
				'ofspace-cosmic-green': 'hsl(var(--ofspace-cosmic-green))',
				'ofspace-dark-bg': 'hsl(var(--ofspace-dark-bg))',
				'ofspace-medium-bg': 'hsl(var(--ofspace-medium-bg))',
				'ofspace-light-bg': 'hsl(var(--ofspace-light-bg))',
				'ofspace-text-light': 'hsl(var(--ofspace-text-light))',
				'ofspace-text-muted': 'hsl(var(--ofspace-text-muted))',
				'ofspace-accent': 'hsl(var(--ofspace-accent))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				arabic: ['IBM Plex Sans Arabic', 'sans-serif'],
				sans: ['IBM Plex Sans Arabic', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'cosmic-float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'cosmic-glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(147, 51, 234, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.8)' }
				},
				'gradient-shift': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'cosmic-float': 'cosmic-float 3s ease-in-out infinite',
				'cosmic-glow': 'cosmic-glow 2s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 15s ease infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
