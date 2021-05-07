import React from 'react'

type wordProp = {
    word: string,
    highlight: boolean
}

const Words = ({word, highlight}: wordProp) => {
    return (
        <div className="word" style={{backgroundColor: (highlight? 'yellow': 'transparent')}}>
            {word}
        </div>
    )
}

export default Words
