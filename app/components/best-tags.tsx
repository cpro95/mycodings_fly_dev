import LinkOrAnchor from './link-or-anchor'

export default function BestTags({ bestTags }: { bestTags: Array<string> }) {
  const linkStyle =
    'bg-gray-100 text-gray-800 text-md font-medium inline-flex items-center px-4 py-2 rounded mr-2 dark:bg-gray-700 dark:text-gray-300'
  return (
    <>
      <div className='inline-flex' role='group'>
        <LinkOrAnchor href={`.`} className={linkStyle}>
          all
        </LinkOrAnchor>
        {bestTags ? (
          bestTags.map(b => (
            <LinkOrAnchor href={`?q=${b}`} className={linkStyle} key={b}>
              {b}
            </LinkOrAnchor>
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
