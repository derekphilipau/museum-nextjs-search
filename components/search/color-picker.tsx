'use client';

import { Key } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Icons } from '@/components/icons';

interface ColorPickerProps {
  params?: any;
}

export function ColorPicker({ params }: ColorPickerProps) {
  const router = useRouter();
  const pathname = usePathname();

  // colors should be an array of objects with name, color and border color:
  const colors = [
    { name: 'red', color: 'bg-red-600', border: 'border-red-800' },
    { name: 'orange', color: 'bg-orange-600', border: 'border-orange-800' },
    { name: 'yellow', color: 'bg-yellow-400', border: 'border-yellow-600' },
    { name: 'green', color: 'bg-green-600', border: 'border-green-800' },
    { name: 'cyan', color: 'bg-cyan-600', border: 'border-cyan-800' },
    { name: 'blue', color: 'bg-blue-600', border: 'border-blue-800' },
    { name: 'purple', color: 'bg-purple-600', border: 'border-purple-800' },
    { name: 'black', color: 'bg-black', border: 'border-black' },
    { name: 'white', color: 'bg-white', border: 'border-neutral-600' },
  ];

  function getColorClass(color: string, border: string) {
    return `cursor-pointer h-6 w-6 rounded-full border-2 ${color} ${border}`;
  }

  function clickColor(name: string) {
    const updatedParams = new URLSearchParams(params);
    if (name === '') updatedParams.delete('color');
    else updatedParams.set('color', name);
    updatedParams.delete('p');
    router.push(`${pathname}?${updatedParams}`);
  }

  return (
    <div className="flex w-full flex-wrap gap-1">
      {colors.map((color, i: Key) => (
        <div
          key={i}
          className={getColorClass(color.color, color.border)}
          onClick={() => clickColor(color.name)}
        ></div>
      ))}
      <Icons.circleSlashed
        onClick={() => clickColor('')}
        className="mr-4 h-6 w-6 cursor-pointer text-neutral-600"
      />
    </div>
  );
}
