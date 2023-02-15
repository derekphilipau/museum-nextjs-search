import Link from "next/link"

export function TermCard({ term }) {
  let href = '';
  let name = '';
  if (term.field === 'primaryConstituent') {
    name = 'Artist';
    href = `/search/collections?primaryConstituent=${term.value}`;
  }
  else if (term.field === 'classification') {
    name = 'Classification';
    href = `/search/collections?classification=${term.value}`;
  }
  else if (term.field === 'collections') {
    name = 'Collection'; 
    href = `/search/collections?collections=${term.value}`;
  }

  return (
    <Link href={href}>
      <div className="bg-neutral-100 p-4 hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700">
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">{term.value}</h4>
        <h5 className="text-base text-neutral-900 dark:text-white">{name}</h5>
      </div>
    </Link>
  )
}


