import type { SavedSearchesProps } from "../types/types";

const SavedSearches = ({savedSearches, onApply, onDelete}: SavedSearchesProps) => {

  return (
    <div className="grid grid-cols-1 justify-items-center text-center gap-2">
      {savedSearches.map((savedSearch) => (
        <div key={savedSearch.id} onClick={() => onApply(savedSearch)} className="flex justify-center items-center text-sm w-full max-w-3xl p-1 gap-3 border-2 border-gray-300 rounded-md duration-300 hover:scale-105 cursor-pointer md:justify-around md:gap-0 md:text-lg">
          <p>{savedSearch.section}</p>
          <p>{savedSearch.query}</p>
          <p>{savedSearch.orderBy}</p>
          <p>From: {savedSearch.fromDate}</p>
          <p>To: {savedSearch.toDate}</p>
          <button onClick={(e) => {e.stopPropagation(); onDelete(savedSearch)}} className="border-2 border-red-500 rounded-lg p-1 w-10 text-red-500">X</button>
        </div>
      ))}
    </div>
  );
}

export default SavedSearches;