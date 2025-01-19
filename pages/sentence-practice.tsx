import { BoxLayout } from '@/components/BoxLayout';
import { QuestionLayout } from '@/components/QuestionLayout';
import { TowSpaceTextBox } from '@/components/TwoSpaceTextBox';
import { Button } from '@/components/Button/Button';
import { BigButton } from '@/components/Button/BigButton';
import { PlusButton } from '@/components/Button/PlusButton';
import { SwitchBtn } from '@/components/SwitchButton';
import { useState, useEffect } from 'react';
import sentenceDataJson from '@/data/sentence_data.json';
import { NextButton } from '@/components/Button/NextButton';
import { setFips } from 'crypto';
import { ScoreButton } from '@/components/Button/ScoreButton';

interface bookDataProps {
    id: number; 
    name: string; 
    category: string; 
    language: string; 
    average_score: number;
}

interface sentenceDataProps {
    book_id: number,
    id: number,
    front: string,
    back: string,
    additional_info: string,
    memo: string,
    score?: number | undefined
}

const SentencePracticePage = (): JSX.Element => {
    const bookId = 1;
    const [sentenceDataAll, setSentenceDataAll] = useState<sentenceDataProps[][]>(sentenceDataJson);
    const [sentenceData, setSentenceData] = useState<sentenceDataProps[]>(bookId > sentenceDataAll.length ? sentenceDataAll[bookId] : sentenceDataAll[0]);
    const [selectedCategory, setSelectedCategory] = useState<'문장' | '대화' | '단어'>('문장');
    const [curSentenceIdx, setCurSentenceIdx] = useState<number>(0);
    const [flipped, setFlipped] = useState<boolean>(false);
    const [showAdditionalInfo, setShowAdditionalInfo] = useState<boolean>(false);
    const [selectedScore, setSelectedScore] = useState<number | undefined>();
    const [totalScore, setTotalScore] = useState<number>(0);

    useEffect(() => {
      sentenceData.map(item => ({
        ...item,
        score: 0 // 기본값으로 score를 추가. 필요한 값으로 수정 가능
      }))
    }, [])

    const handleSwitchBtnClick = (category: '문장' | '대화' | '단어') => {
        setSelectedCategory(category);
    }

    // const filterDataByCategory = () => {
    //     setFilteredData(sentenceData.filter((data) => (
    //         data. === selectedCategory
    //     ))) 
    // }
    // useEffect(() => {
    //     if (sentenceData) {
    //         filterDataByCategory();
    //     }
    // }, [selectedCategory])

    const handleScoreButtonClick = (score: number) => {
      // 현재 sentenceData의 점수를 기록 
      setSelectedScore(score);
      setSentenceData((prevData) =>
        prevData.map((sentence, i) =>
          i === curSentenceIdx ? { ...sentence, score } : sentence
        )
      );
    }

    const handleNextButtonClick = () => {              
      if (curSentenceIdx < sentenceData.length - 1) {
        setCurSentenceIdx(prev => prev + 1)
      }
      setFlipped(false);
      setSelectedScore(undefined);
    }

    const handlePrevButtonClick = () => {              
      if (curSentenceIdx < sentenceData.length - 1) {
        setCurSentenceIdx(prev => prev - 1)
      }
      setFlipped(false);
      setSelectedScore(undefined);
    }

    const showTotalScore = () => {
      let scoreSum = 0;
      sentenceData.forEach((data: sentenceDataProps) => {
        scoreSum += data.score ? data.score : 0;
      })
      setTotalScore(scoreSum / sentenceData.length)
    }

    useEffect(() => {
      setSelectedScore(sentenceData[curSentenceIdx].score)
    }, [curSentenceIdx])


  return (
    <div className="flex justify-center w-full m-auto mt-10 text-textBlue">
      <div className="flex-col justify-center items-center w-[400px] h-[932px] space-y-5 p-5">
        <div className="flex justify-end items-center w-full h-10">
          <PlusButton />
        </div>
        <div className="flex justify-center items-center w-full h-10">
          <div className="flex justify-center items-center bg-toggleBlue w-[150px] h-[40px] text-center rounded-[10px] mb-5">
            <div>{"중국어 수업"}</div>
          </div>
        </div>
        <div className="justify-items-center w-full" onClick={() => setFlipped(prev => !prev)}>
        <BoxLayout
              children={
                <div className='w-full flex flex-col justify-center items-center p-3'>
                  <div 
                    className='h-[200px] flex flex-col space-y-5 justify-center items-center text-center'
                    
                  >
                    <div className='font-semibold'>{flipped ? sentenceData[curSentenceIdx].front : sentenceData[curSentenceIdx].back}</div>
                    {flipped && <div 
                      className='h-[2rem] text-gray-300' 
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowAdditionalInfo(prev => !prev)
                        }}>
                        {showAdditionalInfo ? sentenceData[curSentenceIdx].additional_info : "성조 보기"}
                    </div>}
                  </div>  
                  <div className="flex justify-end items-center w-full h-10 space-x-1">
                  <NextButton
                      isPrev={true} 
                      onClick={() => handlePrevButtonClick()} />
                     {
                      [1, 2, 3, 4, 5].map((idx) => (
                        <ScoreButton isSelected={selectedScore === idx} score={idx} onClick={handleScoreButtonClick}/>
                      ))}
                      
                        <NextButton
                        isPrev={false} 
                        onClick={() => handleNextButtonClick()} />
                      
                  </div>
                  {curSentenceIdx >= sentenceData.length - 1 &&
                    <div>
                        <Button onClick={showTotalScore} text='점수보기'/>
                        <div>{totalScore}</div>
                    </div>}
                  
                </div>
              }/>
              
        </div>
        
      </div>
    </div>
  );
};

export default SentencePracticePage;