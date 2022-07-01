import React, { useState } from 'react'

function Word({
  word,
  originalWord,
  erroredWord,
  nextRound,
  disabled,
  setDisabled,
  correct,
}) {
  const [reveal, setReveal] = useState(false)

  function pickWord(e) {
    if (!disabled) {
      e.preventDefault()
      setReveal(true)
      setDisabled(true)
      erroredWord && correct()
      setTimeout(() => {
        setReveal(false)
        erroredWord ? nextRound() : setDisabled(false)
      }, 1000)
    }
  }
  return (
    <button
      onClick={pickWord}
      className="Button"
      style={{
        backgroundColor: reveal && (erroredWord ? 'green' : '#f00'),
      }}
      disabled={disabled}
    >
      {word}
      {reveal && erroredWord && (
        <>
          {' - '}
          {originalWord}
        </>
      )}
    </button>
  )
}

export default Word
