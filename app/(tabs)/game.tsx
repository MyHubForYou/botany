import React, { useRef, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

//import {wordbank} from './wordbank.txt';

//import fs from 'fs';

import * as fs from 'fs/promises';
//import * as rd from 'readline';

export default function HornwordGame() {

  const textInputs = useRef([]);
  const [winMessage, setWinMessage] = useState('');

  const focusLeft = (event, rowIndex, colIndex) => {
    if (event.nativeEvent.key === 'Backspace') {

      //readWordBank();

      if (colIndex > 0 && !textInputs.current[rowIndex][colIndex].value) {
        // Moves focus to the previous TextInput if the current cell is empty
        textInputs.current[rowIndex][colIndex - 1].focus();
      } 
    }
  };

  
  const focusRight = (text, rowIndex, colIndex, ) => {
    if (text.length > 0 && colIndex < 6) {
      // Move focus to the next TextInput
      console.log(answerInputs.current);
      textInputs.current[rowIndex][colIndex + 1].focus();
    }
  };

  const answer = '1234567890';
  const answerInputs = useRef('');

  //how many hornworms you will see in a game
  const numberOfAnswers = 3;

  const correctAnswer = useRef([]);

  //correctAnswer.current[0] = 'correct';

// Function to read the contents of the file
function readWordBank() {
  try {
    // Read the contents of the file synchronously
    const data = fs.readFile('wordbank.txt', 'utf8');

    console.log(data.toString());

    // Split the contents into an array of lines
    const wordBankArray = data.split('\n');
    

    console.log(wordBankArray);

    // Remove any empty lines
    const wordBank = wordBankArray.filter(word => word.trim() !== '');

    // Select a random word
    //const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];

    const randomWord = wordBank[0];

    console.error('random selected word: ', randomWord);

    return randomWord;
  } catch (err) {
    console.error('Error reading wordbank.txt:', err);
    return '';
  }
}

  function assignCorrectAnswer() {

    for (let i = 0; i < numberOfAnswers; i++) {

      //change later!
      //correctAnswer.current[i] = 'correct';

      correctAnswer.current[i] = readWordBank();

      console.log(correctAnswer.current[i]);

    }


  }

  const checkAnswer = () => {

    if (answerInputs.current.length === answer.length) {

    if (answerInputs.current === answer) {
      console.log('Congratulations! You win!');
      setWinMessage('correct!');
    } else {
      console.log('lose');
      setWinMessage('wrong answer');
    }

    }
    else {
        setWinMessage('');
    }

  };

  useEffect(() => {
    checkAnswer();
  }, [answerInputs, answer]);

  const renderRow = (rowIndex, wordLength) => (
    <View style={styles.row} key={rowIndex}>
      {[...Array(rowIndex)].map((_, colIndex) => (
        <TextInput 
          key={colIndex}
          style={styles.worm}
          maxLength={1}
          onChangeText={(text) => {
            answerInputs.current = answerInputs.current.slice(0, colIndex) + text + answerInputs.current.slice(colIndex);
            focusRight(text, rowIndex, colIndex, wordLength);
          }}
          onKeyPress={(event) => {
            if (event.nativeEvent.key === 'Enter') {
              checkAnswer();
            } 
            else if (event.nativeEvent.key === 'Backspace') {
              focusLeft(event, rowIndex, colIndex);
            }
          }}
          ref={(input) => {
            if (!textInputs.current[rowIndex]) textInputs.current[rowIndex] = [];
            textInputs.current[rowIndex][colIndex] = input;
          }}
        />
      ))}
    </View>
  );

  const renderSpace = (rowIndex,  wordLength) => (
    <View style={styles.row} key={rowIndex}>
      {[...Array(wordLength)].map((_, colIndex) => (
        <div
          key={colIndex}
          style={styles.branch}
        />
      ))}
    </View>
  );

  function render() {

    const wordLength = useRef([]);
    
    assignCorrectAnswer();

    for (let i = 0; i < numberOfAnswers; i++) {

      //change later!
      wordLength.current[i] = correctAnswer.current[i].length;

      console.log("word #", i, correctAnswer.current[i], " length = ", wordLength.current[i]);

    }

    return (


    <>
     
      {[...Array(1)].map((_, rowIndex) => renderRow(wordLength.current[rowIndex], wordLength.current[rowIndex]))}
      {[...Array(1)].map((_, rowIndex) => renderSpace(rowIndex,  wordLength.current[rowIndex]))}

      
      
    </>

    );

  }

  return (

    <View style={styles.container}>
      <View style={styles.skyBG}>
      {winMessage ? <Text>{winMessage}</Text> : null}

      
      {render()}

      
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: 'black',
    textAlign: 'center',
  },
  worm: {
    width: 30,
    height: 30,
    borderWidth: 1,
    backgroundColor: 'lightgreen',
    borderColor: 'black',
    textAlign: 'center',
    borderRadius: 9.5
  },
  branch: {
    width: 31,
    height: 10,
    borderWidth: 10,
    backgroundColor: 'brown',
    borderColor: 'black',
    textAlign: 'center',
    borderRadius: 1
  },
  skyBG: {
    flex: 1,
    width: 400,
    height: 2000,
    backgroundColor: '#87CEEB', // Fallback color in case gradients are not supported
    backgroundImage: 'linear-gradient(to bottom, #87CEEB, #1E90FF)', // Top to bottom gradient
    backgroundRepeat: 'no-repeat',
    alignItems: 'center',
    backgroundSize: 'cover',
    borderColor: 'black',
    borderWidth: 2.5,
    borderHeight: 2.5,
    backgroundAttachment: 'fixed', // Ensures the background stays fixed while scrolling
  }
});