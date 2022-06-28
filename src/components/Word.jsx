import React, { useState } from 'react'

function Word({
  word,
  originalWord,
  erroredWord,
  nextWord,
  disabled,
  setDisabled,
}) {
  const [reveal, setReveal] = useState(false)

  function pickWord(e) {
    if (!disabled) {
      e.preventDefault()
      setReveal(true)
      setDisabled(true)
      setTimeout(() => {
        setReveal(false)
        erroredWord ? nextWord() : setDisabled(false)
      }, 1000)
    }
  }
  return (
    <button
      onClick={pickWord}
      className="Button"
      style={{
        backgroundColor: reveal ? (erroredWord ? 'green' : '#f00') : 'gray',
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
