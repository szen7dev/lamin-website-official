/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Grayscale
        grayscale: {
          0: "#FCFCFD",
          5: "#F9FAFB",
          10: "#F2F4F7",
          20: "#EAECF0",
          30: "#D0D5DD",
          40: "#98A2B3",
          50: "#667085",
          60: "#475467",
          70: "#344054",
          80: "#1D2939",
          90: "#101828",
          100: "#0C111D",
        },

        // Primary Colors
        primary: {
          5: "#1250DC",
          10: "#1A5BE1",
          20: "#2368E5",
          30: "#2C75EA",
          40: "#3582EE",
          50: "#4990F1",
          60: "#5D9DF5",
          70: "#71ABF8",
          80: "#85B8FC",
          90: "#99C6FF",
          100: "#ADD3FF",
        },

        // Error Colors
        error: {
          5: "#FF0000",
          10: "#FF1A1A",
          20: "#FF3333",
          30: "#FF4D4D",
          40: "#FF6666",
          50: "#FF8080",
          60: "#FF9999",
          70: "#FFB3B3",
          80: "#FFCCCC",
          90: "#FFE6E6",
          100: "#FFFFFF",
        },

        // Info Colors
        info: {
          5: "#2897FF",
          10: "#3EA1FF",
          20: "#54ACFF",
          30: "#6AB7FF",
          40: "#80C2FF",
          50: "#96CDFF",
          60: "#ACD8FF",
          70: "#C2E3FF",
          80: "#D8EEFF",
          90: "#EEF9FF",
          100: "#FFFFFF",
        },

        // Success Colors
        success: {
          5: "#38CB1C",
          10: "#4CD033",
          20: "#60D54A",
          30: "#74DA61",
          40: "#88DF78",
          50: "#9CE48F",
          60: "#B0E9A6",
          70: "#C4EEBD",
          80: "#D8F3D4",
          90: "#ECF8EB",
          100: "#FFFFFF",
        },

        // Warning Colors
        warning: {
          5: "#FFE200",
          10: "#FFE51A",
          20: "#FFE833",
          30: "#FFEB4D",
          40: "#FFEE66",
          50: "#FFF180",
          60: "#FFF499",
          70: "#FFF7B3",
          80: "#FFFACC",
          90: "#FFFCE6",
          100: "#FFFFFF",
        },

        // Link Colors
        link: {
          5: "#0E55FF",
          10: "#2767FF",
          20: "#4079FF",
          30: "#598BFF",
          40: "#739DFF",
          50: "#8CAFFF",
          60: "#A6C1FF",
          70: "#BFD3FF",
          80: "#D9E5FF",
          90: "#F2F7FF",
          100: "#FFFFFF",
        },

        // Background
        background: "#F1F4FD",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        // Dark Mode Shadows
        "dark-00": "0 0 0 0 #12121200",
        "dark-08": "0 8px 8px 0 #12121224",
        "dark-12": "0 12px 12px 0 #12121233",
        "dark-16": "0 16px 16px 0 #12121242",
        "dark-24": "0 24px 24px 0 #12121266",

        // Light Mode Shadows
        "light-00": "0 0 0 0 #00000033",
        "light-08": "0 8px 8px 0 #00000033",
        "light-12": "0 12px 12px 0 #00000033",
        "light-16": "0 16px 16px 0 #00000033",
        "light-24": "0 24px 24px 0 #00000033",

        // Effect Shadows
        "01": "0 1px 1px 0 #00000024",
        "02": "0 2px 2px 0 #00000024",
        "04": "0 4px 4px 0 #00000024",
        "08": "0 8px 8px 0 #00000024",
        12: "0 12px 12px 0 #00000024",
        16: "0 16px 16px 0 #00000024",
        24: "0 24px 24px 0 #00000024",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

