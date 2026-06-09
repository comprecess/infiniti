// Venture OS SVG Icons - replacing emoji with vector icons matching platform style
// These follow the same pattern as existing icons in /shared/icons/

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// 📊 → Bar Chart icon (Current Valuation)
export const BarChartIcon = ({ size = 24, color = '#a5b4fc', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="12" width="4" height="9" rx="1" fill={color} opacity="0.7"/>
    <rect x="10" y="7" width="4" height="14" rx="1" fill={color}/>
    <rect x="17" y="3" width="4" height="18" rx="1" fill={color} opacity="0.85"/>
  </svg>
);

// 📈 → Trending Up icon (Projected Valuation / ARR Growth)
export const TrendingUpIcon = ({ size = 24, color = '#34d399', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 17L9 11L13 15L21 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 7H21V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 🚀 → Rocket/Launch icon (Best Case / Product Milestones)
export const LaunchIcon = ({ size = 24, color = '#f472b6', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2C12 2 7 7 7 12C7 14.5 8 16.5 9.5 18L12 22L14.5 18C16 16.5 17 14.5 17 12C17 7 12 2 12 2Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="11" r="2.5" fill={color} opacity="0.6"/>
    <path d="M5 16C5 16 3 18 3 20C5 20 7 18 7 18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M19 16C19 16 21 18 21 20C19 20 17 18 17 18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// 🌍 → Globe/Market icon (Market Expansion)
export const GlobeIcon = ({ size = 24, color = '#60a5fa', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/>
    <ellipse cx="12" cy="12" rx="4" ry="9" stroke={color} strokeWidth="1.5"/>
    <path d="M3.5 9H20.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M3.5 15H20.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// 🤝 → Handshake/Partnership icon (Strategic Partnerships)
export const PartnershipIcon = ({ size = 24, color = '#fbbf24', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7 11L3 7L6 4L10 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 11L21 7L18 4L14 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 8L12 10L14 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14L10 16L12 14L14 16L16 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14L6 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 14L18 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 16L9 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 16L15 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// 💡 → Lightbulb/Insight icon (Recommendations)
export const InsightIcon = ({ size = 24, color = '#c084fc', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9 21H15" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M10 18H14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 3C8.13 3 5 6.13 5 10C5 12.38 6.19 14.47 8 15.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V15.74C17.81 14.47 19 12.38 19 10C19 6.13 15.87 3 12 3Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3V6" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    <path d="M17.5 6.5L15.5 8.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    <path d="M6.5 6.5L8.5 8.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

// ⚡ → Bolt/Action icon (Impact)
export const BoltIcon = ({ size = 24, color = '#fbbf24', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" fill={color} opacity="0.2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 🎯 → Target icon (KPI / Goals)
export const TargetIcon = ({ size = 24, color = '#f87171', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="5.5" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="2" fill={color}/>
  </svg>
);

// Document/File icon for Knowledge Assets
export const DocViewIcon = ({ size = 24, color = '#a5b4fc', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14 2H6C5.45 2 5 2.45 5 3V21C5 21.55 5.45 22 6 22H18C18.55 22 19 21.55 19 21V7L14 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V7H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 13H15" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M9 16H13" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// Download icon
export const DownloadIcon = ({ size = 24, color = '#00c896', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 3V15M12 15L8 11M12 15L16 11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Eye/Preview icon
export const PreviewIcon = ({ size = 24, color = '#a5b4fc', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 5C5.636 5 2 12 2 12C2 12 5.636 19 12 19C18.364 19 22 12 22 12C22 12 18.364 5 12 5Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8"/>
  </svg>
);
