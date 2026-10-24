interface DoodleProps {
    className?: string;
    color?: string;
}

export function Starburst({ className = "", color = "var(--panel)" }: DoodleProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={4}
            strokeLinecap="round"
            style={{ color }}
        >
            {Array.from({ length: 12 }, (_, i) => (
                <line
                    key={i}
                    x1="50"
                    y1="30"
                    x2="50"
                    y2={i % 2 === 0 ? 6 : 16}
                    transform={`rotate(${i * 30} 50 50)`}
                />
            ))}
        </svg>
    );
}

export function Sparkle({ className = "", color = "var(--peach-ink)" }: DoodleProps) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor" style={{ color }}>
            <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12 6.6-.6 11.4-5.4 12-12z" />
        </svg>
    );
}

export function Squiggle({ className = "", color = "var(--peach)" }: DoodleProps) {
    return (
        <svg
            viewBox="0 0 200 20"
            className={className}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={4}
            strokeLinecap="round"
            style={{ color }}
        >
            <path d="M4 12c12-12 24 12 36 0s24 12 36 0 24 12 36 0 24 12 36 0 24 12 36 0" />
        </svg>
    );
}

export function Curl({ className = "", color = "var(--peach)" }: DoodleProps) {
    return (
        <svg
            viewBox="0 0 160 160"
            className={className}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={22}
            strokeLinecap="round"
            style={{ color }}
        >
            <path d="M20 30c60-20 110 20 80 60s-80 10-50 50" />
        </svg>
    );
}

export function Smiley({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
            <circle cx="24" cy="24" r="24" style={{ fill: "var(--peach)" }} />
            <circle cx="17" cy="19" r="2.5" style={{ fill: "var(--panel)" }} />
            <circle cx="31" cy="19" r="2.5" style={{ fill: "var(--panel)" }} />
            <path
                d="M14 28c2 6 6 9 10 9s8-3 10-9"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ stroke: "var(--panel)" }}
            />
        </svg>
    );
}

// Text running around a circle, slowly spinning, with a smile in the middle
export function RoundBadge({ text }: { text: string }) {
    const unit = `${text.toUpperCase()} • `;
    const label = unit.repeat(Math.ceil(44 / unit.length));

    return (
        <div className="relative h-full w-full">
            <svg viewBox="0 0 120 120" className="badge-spin h-full w-full" aria-hidden="true">
                <defs>
                    <path id="round-badge-path" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
                </defs>
                <text fontSize="10" fontWeight="700" letterSpacing="1.5" fill="currentColor">
                    <textPath href="#round-badge-path">{label}</textPath>
                </text>
            </svg>
            <span
                className="absolute inset-0 flex items-center justify-center text-3xl"
                style={{ color: "var(--peach-ink)" }}
            >
                ☺
            </span>
        </div>
    );
}