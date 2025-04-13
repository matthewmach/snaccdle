import Select from 'react-select'
//import Header from './header'
import {useEffect, useState} from 'react'
import {useNavigate, useParams, useLocation} from 'react-router-dom';

type OptionType = {value: string; label: string};
type ResponseType = {name: string, song: string};


const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles) => {
    return {
      ...styles,
      color: 'black',
    };
  },
};

export default function Snaccdle() {
  const {year = "2025", month = "feburary", song_index = "0" } = useParams<{ year: string; month: string; song_index: string }>();

  const [selectedOption, setSelectedOption] = useState(null);
  const handleChange = (selected) => {
    setSelectedOption(selected);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [tryAgain, setTryAgain] = useState(false);
  const [numGuesses, setNumGuesses] = useState(5);
  const [song, setSong] = useState<ResponseType>({name: "N/A", song: "N/A"});
  const [options, setOptions] = useState<OptionType[]>([]);

  const [isLastSong, setIsLastSong] = useState(false);


  function handleGuess(selectedOption:OptionType | null){
    if (selectedOption != null){
        const label = selectedOption.label;
        console.log(song.name)
        if (song.name == label)
            setDone(true);
        else if (!wrongGuesses.includes(label)){
            if (numGuesses == 1)
                setDone(true)
            setWrongGuesses([...wrongGuesses, label]);
            setNumGuesses(numGuesses-1)
            setTryAgain(false)
        }
        else
            setTryAgain(true)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await fetch(`/form_data/${year}/${month}.json`);
            if (!res.ok) throw new Error('Data load error');
            const data = await res.json();

            setOptions(data.slice().sort(
                (a: ResponseType,b: ResponseType) => {
                    return a.name.localeCompare(b.name); // Sort strings alphabetically in reverse
                }
                ).map((response: ResponseType) => ({
                value: response.name,
                label: response.name
              })));
            
            setSong(data[+song_index - 1]);
            setIsLastSong(+song_index != data.length);

            console.log("Finished loading data");
        } catch (err) {
            console.error('Error loading data:', err);
        }
    };

    if (year && month && song_index) {
        fetchData();
    }

    setSelectedOption(null)
    setWrongGuesses([])
    setNumGuesses(5)
    setDone(false)
  }, [year, month, song_index, location]);


  return (
    <div className="flex flex-col items-center">
      <div className="min-w-3xl">
        <iframe style={{clipPath: "inset(0 0 0 0 round 15px)"}} src={song.song} width="100%" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        {!done && (
            <div className='pt-5'>
            <div className='text-center font-bold pb-5'>
                {tryAgain ? "Person already guessed!" : +numGuesses + " guesses remaining!"}
            </div>
            <Select 
                styles={colourStyles}
                options={options}
                value={selectedOption}
                onChange={handleChange}
                isSearchable={true} // Enable search functionality
                isClearable={true} // Allow clearing the selected option
                placeholder="Who submitted this one?"
            />
            <div className='w-full pt-4'>
                <button 
                key={"Submit"} 
                onClick={() => handleGuess(selectedOption)}
                className="w-full h-10 bg-blue-500 hover:bg-blue-700 rounded-lg"
                >
                {"Submit"}
                </button>
            </div>
            <div className='grid grid-cols-1 gap-4 pt-10'>
                {wrongGuesses.map((wrong) => (
                    <div
                            key={wrong}
                            className="bg-transparent border-2 border-white text-white p-4 rounded-2xl text-start w-full"
                        >
                            ❌ {wrong}
                        </div>
                ))
                }
            </div>
        </div>
        )}
        {done && +numGuesses > 0 && +numGuesses < 5  && (
            <div className='flex flex-col items-center pt-20'>
                <div className='text-green-600 font-bold text-3xl pb-5'>
                    Good Job!
                </div>
                <div className='flex flex-row'>
                    <div className='text-white text-xl pr-2'>
                        The answer was  
                    </div>
                    <div className='text-green-600 font-bold text-xl'>
                    {song.name}
                </div>
                </div>
            </div>
        )}
        {done && +numGuesses == 5  && (
            <div className='flex flex-col items-center pt-20'>
                <div className='text-green-600 font-bold text-3xl pb-5'>
                    Ur crazy
                </div>
                <div className='flex flex-row'>
                    <div className='text-white text-xl pr-2'>
                        The answer was  
                    </div>
                    <div className='text-green-600 font-bold text-xl'>
                    {song.name}
                </div>
                </div>
            </div>
        )}
        {done && +numGuesses == 0  && (
            <div className='flex flex-col items-center pt-20'>
                <div className='text-red-600 font-bold text-3xl pb-5'>
                    You should know this person better smh
                </div>
                <div className='flex flex-row'>
                    <div className='text-white text-xl pr-2'>
                        The answer was  
                    </div>
                    <div className='text-red-600 font-bold text-xl'>
                    {song.name}
                </div>
                </div>
            </div>
        )}
      </div>
      <div className='flex justify-between items-center w-3xl pt-10'>
            {song_index != "1" ? (<button 
            key={"Prev"} 
            onClick={() => navigate(`/${year}/${month}/${+song_index-1}` as never)}
            className="text-5xl"
            >
            ⏪
            </button>) : <div />}
            {isLastSong ? (<button 
            key={"Next"} 
            onClick={() => navigate(`/${year}/${month}/${+song_index+1}` as never)}
            className="text-5xl"
            >
            ⏩
            </button>) : <div />}
      </div>
    </div>
  );
}
