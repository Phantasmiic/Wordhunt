const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export async function validateWord(word) {
  try {
    const response = await fetch(`${API_BASE}/validate-word/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word }),
    })

    if (!response.ok) {
      return { valid: false, reason: 'http_error' }
    }

    return response.json()
  } catch {
    return { valid: false, reason: 'network_error' }
  }
}
