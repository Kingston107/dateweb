/** Shared step-indicator dots. Pass step index to highlight one dot; omit for all-active. */
export function ProgressDots({ step }: { step?: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: step === undefined || i === step ? 24 : 8,
            height: 8,
            borderRadius: 9999,
            background: step === undefined || i === step ? '#C84D75' : '#F5A7C0',
            transition: 'width 0.3s ease, background 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}
