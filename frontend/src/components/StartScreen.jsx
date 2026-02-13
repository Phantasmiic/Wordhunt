export default function StartScreen({ settings, onSettingsChange, onStart }) {
  return (
    <div className="app-shell" style={{ '--page-bg': settings.backgroundColor }}>
      <div className="start-card">
        <h1>Word Hunt</h1>
        <p>Press start to begin</p>

        <div className="settings-grid">
          <label>
            Board Size
            <select
              value={settings.boardSize}
              onChange={(event) => onSettingsChange('boardSize', Number(event.target.value))}
            >
              {[3, 4, 5, 6].map((size) => (
                <option key={size} value={size}>
                  {size}x{size}
                </option>
              ))}
            </select>
          </label>

          <label>
            Layout
            <select
              value={settings.layout}
              onChange={(event) => onSettingsChange('layout', event.target.value)}
            >
              <option value="random">Random</option>
              <option value="balanced_vowels">Balanced Vowels</option>
            </select>
          </label>

          <label>
            Time (seconds)
            <input
              type="number"
              min="20"
              max="300"
              value={settings.durationSeconds}
              onChange={(event) =>
                onSettingsChange('durationSeconds', Math.max(20, Number(event.target.value) || 80))
              }
            />
          </label>

          <label>
            End Condition
            <select
              value={settings.endCondition}
              onChange={(event) => onSettingsChange('endCondition', event.target.value)}
            >
              <option value="timer">Timer</option>
              <option value="target_words">Target Words</option>
            </select>
          </label>

          {settings.endCondition === 'target_words' ? (
            <label>
              Target Words
              <input
                type="number"
                min="1"
                max="500"
                value={settings.targetWords}
                onChange={(event) => onSettingsChange('targetWords', Math.max(1, Number(event.target.value) || 20))}
              />
            </label>
          ) : null}

          <label>
            Background
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(event) => onSettingsChange('backgroundColor', event.target.value)}
            />
          </label>
        </div>

        <button className="start-button" type="button" onClick={onStart}>
          Start
        </button>
      </div>
    </div>
  )
}
