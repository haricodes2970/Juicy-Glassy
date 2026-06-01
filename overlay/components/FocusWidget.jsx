export default function FocusWidget() {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const progress = 65
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="glass-card p-4 flex flex-col items-center gap-3">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider self-start">
        Today's Focus
      </h3>

      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" className="transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#6C63FF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: 'drop-shadow(0 0 6px rgba(108,99,255,0.4))' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-white">45</span>
          <span className="text-[10px] text-text-muted">minutes</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-success" />
        <span>29 min remaining</span>
      </div>

      <button className="w-full glass-button text-xs text-center py-2 rounded-lg">
        Start Focus Session
      </button>
    </div>
  )
}
