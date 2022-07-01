import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Word from './components/Word'
import importedEasyWords from './data/easy-words.txt'

function App() {
  const [words, setWords] = useState([])
  const [erroredWord, setErroredWord] = useState([])
  const [originalWord, setOriginalWord] = useState([])
  const [disabled, setDisabled] = useState(false)
  const [initialTime, setInitialTime] = useState(new Date())
  const [time, setTime] = useState(0)
  const [round, setRound] = useState(0)
  const [timeRunning, setTimeRunning] = useState(false)
  const [finishedTime, setFinishedTime] = useState(0)
  const [level, setLevel] = useState('Easy')

  let allEasyWords

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
      if (word[candidateForReplacement1] === word[candidateForReplacement2]) {
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
    // else if (allHardWords.includes(word)) return null
    else if (allEasyWords.includes(word)) return null
    else {
      setOriginalWord(ORIGINAL_WORD)
      return word
    }
  }

  function nextRound() {
    fetchEasyWords().finally(createRandomWords)
  }

  function createRandomWords() {
    fetchEasyWords()
    setErroredWord(null)
    setOriginalWord(null)
    if (round === 10) {
      setTime(new Date() - initialTime)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setTimeRunning(false)
      setFinishedTime(time)
      return
    }

    const randomWords = []
    while (randomWords.length < 8) {
      let randomWord =
        allEasyWords[Math.floor(Math.random() * allEasyWords.length)]
      if (round <= 3) {
        setLevel('Easy')
        if (randomWord.length > 5) continue // easy
      }
      if (round === 4 || round === 5) {
        // round 5 to 6
        setLevel('Medium')
        if (randomWord.length < 6 || randomWord.length > 7) continue // medium
      }
      if (round >= 6) {
        // round 7 to 10
        setLevel('Hard')
        if (randomWord.length < 7) continue // hard
      }
      if (randomWords.includes(randomWord)) continue
      randomWords.push(randomWord)
    }

    const vowels = new Set(['a', 'e', 'i', 'o', 'u'])
    const consonants = new Set(
      'bcdfghjklmnpqrstvwxyz'.split('').filter((c) => !vowels.has(c))
    )
    let erroredWord
    let wordInListOfWordsIndex
    do {
      wordInListOfWordsIndex = Math.floor(Math.random() * randomWords.length)
      let word = randomWords[wordInListOfWordsIndex]
      erroredWord = createErroredWord(word, consonants, vowels)
    } while (erroredWord === null)
    randomWords[wordInListOfWordsIndex] = erroredWord
    setErroredWord(erroredWord)
    setDisabled(false)
    setWords(randomWords)
    setRound((round) => round + 1)
  }

  function correct() {
    var correctAudio = new Audio('correct.mp3')
    correctAudio.play()
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(startGame, [])

  async function fetchEasyWords() {
    const res = await fetch(importedEasyWords)
    const text = await res.text()
    allEasyWords = text.split('\r\n')
  }

  function startGame() {
    fetchEasyWords().finally(() => {
      firstRound()
    })
  }

  function firstRound() {
    nextRound()
    setTimeRunning(true)
    setInitialTime(new Date())
    setInterval(() => {
      let temp = Math.round((new Date() - initialTime) / 100) / 10
      setTime(Number.isInteger(temp) ? `${temp}.0` : temp)
    }, 100)
  }

  window.onselectstart = (e) => e.preventDefault()

  return (
    <>
      <ToastContainer />
      {timeRunning ? (
        <>
          <h2 className="Title">
            Time: {time}s, Round: {round} {level}
          </h2>
          <div className="Words">
            {words.map((word) => (
              <Word
                key={word}
                word={word}
                erroredWord={erroredWord === word}
                originalWord={originalWord}
                nextRound={nextRound}
                disabled={disabled}
                setDisabled={setDisabled}
                correct={correct}
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
