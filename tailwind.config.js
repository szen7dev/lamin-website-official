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
      backgroundImage: {
        "gradient-1": "linear-gradient(90deg, #4173E3 0%, #1250DC 50%, #0E40B0 100%)",
        "gradient-2": "linear-gradient(180deg, #4173E3 0%, #1250DC 50%, #0E40B0 100%)",
        "gradient-3":
          "linear-gradient(180deg, rgba(65, 115, 227, 0.8) 0%, rgba(18, 80, 220, 0.8) 50%, rgba(14, 64, 176, 0.8) 100%)",
        "gradient-4": "linear-gradient(90deg, #1250DC 0%, #0E40B0 100%)",
        "gradient-5": "linear-gradient(90deg, #FF5246 0%, #CD1A0C 100%)",
        "light-0":
          "linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))",
        "light-1":
          "linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.18))",
        "light-2":
          "linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.16))",
        "light-3":
          "linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.14))",
        "light-4":
          "linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12))",
        "light-6":
          "linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))",
        "light-8":
          "linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08))",
        "light-12":
          "linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.06))",
        "light-16":
          "linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04))",
        "light-24":
          "linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1250DC",
          foreground: "hsl(var(--primary-foreground))",
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
        secondary: {
          DEFAULT: "#667085",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF0000",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F2F4F7",
          foreground: "#667085",
        },
        accent: {
          DEFAULT: "#F9FAFB",
          foreground: "#101828",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#101828",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#101828",
        },
        // Grayscale
        grayscale: {
          0: "#FCFCFD",
          5: "#F9F9FB",
          10: "#EFF1F5",
          20: "#DCDFEA",
          30: "#B9C0D4",
          40: "#7D89B0",
          50: "#5D6B98",
          60: "#4A5578",
          70: "#404968",
          80: "#30374F",
          90: "#111322",
          100: "#0E101B",
        },

        // Primary Colors

        // Error Colors
        error: {
          DEFAULT: "#FF0000",
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
          foreground: "#FFFFFF",
        },

        // Info Colors
        info: {
          DEFAULT: "#2897FF",
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
          foreground: "#FFFFFF",
        },

        // Success Colors
        success: {
          DEFAULT: "#38CB1C",
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
          foreground: "#FFFFFF",
        },

        // Warning Colors
        warning: {
          DEFAULT: "#FFE200",
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
          foreground: "#000000",
        },

        // Link Colors
        link: {
          DEFAULT: "#0E55FF",
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
          foreground: "#FFFFFF",
        },

        // UI Component Colors
        background: "#F1F4FD",
        foreground: "#101828",
        border: "#EAECF0",
        input: "#EAECF0",
        ring: "#3582EE",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
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
