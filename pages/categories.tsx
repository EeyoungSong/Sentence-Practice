import { BigButton } from '@/components/Button/BigButton';
import { PlusButton } from '@/components/Button/PlusButton';
import { SwitchBtn } from '@/components/SwitchButton';
import { useState, useEffect } from 'react';
import bookDataJson from '@/data/book_data.json';
import { useRouter } from 'next/router';

interface bookDataProps {
  id: number;
  name: string;
  category: string;
  language: string;
  average_score: number;
}

const CategoryPage = (): JSX.Element => {
  const [bookData, setBookData] = useState<bookDataProps[]>(bookDataJson);
  const [filteredData, setFilteredData] = useState<bookDataProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'문장' | '대화' | '단어'>('문장');
  const router = useRouter();

  useEffect(() => {
    setBookData(bookDataJson);
  }, []);

  const handleSwitchBtnClick = (category: '문장' | '대화' | '단어'): void => {
    setSelectedCategory(category);
  };

  const filterDataByCategory = (): void => {
    setFilteredData(bookData.filter((data) => data.category === selectedCategory));
  };
  useEffect(() => {
    if (bookData) {
      filterDataByCategory();
    }
  }, [selectedCategory]);

  const handleBookClick = (id: number): void => {
    console.log(id);
    router.push({
      pathname: '/sentence-practice',
      query: { id: String(id) },
    });
  };

  return (
    <div className="flex justify-center w-full m-auto mt-10 text-textBlue">
      <div className="flex-col justify-center items-center w-[400px] h-[932px] space-y-5 p-5">
        <div className="flex justify-end items-center w-full h-10">
          <PlusButton />
        </div>
        <SwitchBtn handleClickButton={handleSwitchBtnClick} />
        <div className="flex justify-end items-center w-full h-10">
          <div className="flex justify-center items-center bg-white w-[100px] h-[40px] text-center rounded-[10px]">
            <div>중국어</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 justify-items-center w-full text-center">
          {filteredData.map((data) => (
            <BigButton key={data.id} bookId={data.id} text={data.name} onClick={handleBookClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
