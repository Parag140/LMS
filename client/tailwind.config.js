// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "course-details-heading-small": ["26px", "36px"],
        "course-details-heading-large": ["36px", "48px"],
        "home-heading-small": ["28px", "34px"],
        "home-heading-large": ["48px", "56px"],
        default: ["15px", "21px"],
      },
      gridTemplateColumns: {
        auto: "repeat(auto-fit, minmax(200px, 1fr))",
      },
      spacing: {
        "section-height": "500px",
      },
      maxWidth: {
        "course-card": "424px",
      },
      boxShadow: {
        "custom-card": "0px 4px 15px 2px rgba(0,0,0,0.1)",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        blue: {
          50: "#EFF6FF",
          100: "#E6F0FF",
          500: "#2563EB", // first config
          600: "#3B82F6", // second config's 500 → shifted
        },
        green: {
          50: "#ECFDF5",
          100: "#E7F9ED",
          500: "#22C55E", // first config
          600: "#10B981", // second config's 500 → shifted
        },
        purple: {
          50: "#F5F3FF",
          100: "#F3E8FF",
          500: "#9333EA", // first config
          600: "#8B5CF6", // second config's 500 → shifted
        },
        indigo: {
          50: "#EEF2FF",
          600: "#4F46E5",
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["hover", "focus"],
      borderColor: ["hover", "focus"],
      transform: ["hover", "focus"],
      opacity: ["group-hover"],
      translate: ["group-hover"],
    },
  },
  plugins: [],
};
