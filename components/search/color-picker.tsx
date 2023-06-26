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
  const currentColor = params?.color || '';

  // colors should be an array of objects with name, color and border color:
  const colors = [
    { name: 'red', color: 'bg-red-600', text: 'text-red-800' },
    { name: 'orange', color: 'bg-orange-600', text: 'text-orange-800' },
    { name: 'yellow', color: 'bg-yellow-400', text: 'text-yellow-600' },
    { name: 'green', color: 'bg-green-600', text: 'text-green-800' },
    { name: 'cyan', color: 'bg-cyan-600', text: 'text-cyan-800' },
    { name: 'blue', color: 'bg-blue-600', text: 'text-blue-800' },
    { name: 'purple', color: 'bg-purple-600', text: 'text-purple-800' },
    { name: 'black', color: 'bg-black', text: 'text-neutral-400' },
    { name: 'white', color: 'bg-white', text: 'text-neutral-600' },
  ];

  function getColorClass(color: string, text: string) {
    const myText = currentColor === color ? 'text-black' : text;
    return `cursor-pointer h-6 w-6 rounded-full ${color} ${myText}`;
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
      {colors.map((color, i: Key) =>
        currentColor === color.name ? (
          <Icons.checkCircle
            key={i}
            className={getColorClass(color.color, color.text)}
            onClick={() => clickColor(color.name)}
          />
        ) : (
          <Icons.circle
            key={i}
            className={getColorClass(color.color, color.text)}
            onClick={() => clickColor(color.name)}
          />
        )
      )}
      <Icons.circleSlashed
        onClick={() => clickColor('')}
        className="mr-4 h-6 w-6 cursor-pointer text-neutral-600"
      />
    </div>
  );
}
