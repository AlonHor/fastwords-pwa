import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Word from './components/Word'

function App() {
  const [words, setWords] = useState([])
  const [erroredWord, setErroredWord] = useState([])
  const [originalWord, setOriginalWord] = useState([])
  const [disabled, setDisabled] = useState(false)
  const [initialTime, setInitialTime] = useState(new Date())
  const [time, setTime] = useState(0)
  const [round, setRound] = useState(0)
  const [timeRunning, setTimeRunning] = useState(true)
  const [finishedTime, setFinishedTime] = useState(0)

  // let allWords = []

  function createErroredWord(word, consonants, vowels) {
    const ORIGINAL_WORD = word
    let i = 0
    while (i < 10) {
      let candidateForReplacement1 = Math.floor(Math.random() * word.length)
      let candidateForReplacement2 = Math.floor(Math.random() * word.length)
      if (candidateForReplacement1 === candidateForReplacement2) {
        i++
        continue
      }
      if (
        vowels.has(word[candidateForReplacement1]) &&
        consonants.has(word[candidateForReplacement2])
      ) {
        i++
        continue
      }
      if (
        vowels.has(word[candidateForReplacement2]) &&
        consonants.has(word[candidateForReplacement1])
      ) {
        i++
        continue
      }
      let temp = word[candidateForReplacement1]
      word =
        word.substring(0, candidateForReplacement1) +
        word[candidateForReplacement2] +
        word.substring(candidateForReplacement1 + 1)
      word =
        word.substring(0, candidateForReplacement2) +
        temp +
        word.substring(candidateForReplacement2 + 1)
      break
    }
    if (i === 10) return null
    // else if (allWords.includes(word)) return null
    else {
      setOriginalWord(ORIGINAL_WORD)
      return word
    }
  }

  function nextWord() {
    setErroredWord(null)
    setOriginalWord(null)
    if (round === 10) {
      setTime(new Date() - initialTime)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setTimeRunning(false)
      setFinishedTime(time)
      return
    }
    fetch('https://random-word-api.herokuapp.com/word?number=8')
      .then((res) => res.json())
      .then((data) => {
        const vowels = new Set(['a', 'e', 'i', 'o', 'u'])
        const consonants = new Set(
          'bcdfghjklmnpqrstvwxyz'.split('').filter((c) => !vowels.has(c))
        )
        let words = data
        let erroredWord
        let wordInListOfWordsIndex
        do {
          wordInListOfWordsIndex = Math.floor(Math.random() * words.length)
          let word = words[wordInListOfWordsIndex]
          erroredWord = createErroredWord(word, consonants, vowels)
        } while (erroredWord === null)
        words[wordInListOfWordsIndex] = erroredWord
        setErroredWord(erroredWord)
        setDisabled(false)
        setWords(words)
        setRound((round) => round + 1)
      })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(nextWord, [])

  useEffect(() => {
    setInitialTime(new Date())
    setInterval(() => {
      let temp = Math.round((new Date() - initialTime) / 100) / 10
      setTime(Number.isInteger(temp) ? `${temp}.0` : temp)
    }, 100)
    // fetch('https://random-word-api.herokuapp.com/all')
    //   .then((res) => res.json())
    //   .then((data) => (allWords = data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  window.onselectstart = (e) => e.preventDefault()

  return (
    <>
      {timeRunning ? (
        <>
          <ToastContainer />
          <h2 className="Title">
            Time: {time}s, Round: {round}
          </h2>
          <div className={`Words ${erroredWord === null ? 'Shrink' : ''}`}>
            {words.map((word) => (
              <Word
                key={word}
                word={word}
                erroredWord={erroredWord === word}
                originalWord={originalWord}
                nextWord={nextWord}
                disabled={disabled}
                setDisabled={setDisabled}
              />
            ))}
          </div>
        </>
      ) : (
        <div>
          <h2 className="Title">You finished in {finishedTime}s</h2>
          <button
            className="Button"
            style={{ backgroundColor: 'green' }}
            onClick={() => window.location.reload()}
          >
            Play again
          </button>
        </div>
      )}
    </>
  )
}

export default App
