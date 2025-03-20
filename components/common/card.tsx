import React from 'react';
type Props = {
  index?: number;
  description: string;
  title?: string;
  image?: string;
};

function Card(props: Props) {
  const { description, title, image, index } = props;
  return (
    <div className="min-[100px] flex flex-col items-center justify-center gap-2 border border-slate-600/35 rounded-lg py-3 px-4 shadow-sm shadow-black/30">
      <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex justify-center items-center">
        <span className="text-xl font-bold">{index}</span>
      </div>
      <p className="text-center text-lg font-bold text-gray-900 dark:text-white">{description}</p>
    </div>
  );
}

export default Card;
