import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid';
import { useEffect, useRef, useState } from 'react';
import { Character, Environment, PlayType, Speed, Stage } from '../lib/enums';
import type { PlayProps } from './PlayCard';
import { Play } from './PlayCard';

interface IFilter {
  id: string;
  name: string;
  options: {
    value: string;
    label: string;
    checked: boolean;
  }[];
}

const generateFilters = (optionsEnum: object, sliceAll = false) => {
  const enumArray = sliceAll ? Object.keys(optionsEnum).slice(1) : Object.keys(optionsEnum);
  return enumArray.map((item) => ({ value: item.toLowerCase(), label: item, checked: false }));
};

const filterEnums = [
  { enum: PlayType, name: 'Type' },
  { enum: Character, name: 'Character', sliceAll: true },
  { enum: Stage, name: 'Stage', sliceAll: true },
  { enum: Speed, name: 'Speed', sliceAll: true },
  { enum: Environment, name: 'Environment' },
  { enum: { '1': '1', '2': '2', '3': '3', '4': '4', '5': '5' }, name: 'Difficulty' }
];

const filtersObject = filterEnums.map((item) => ({ id: item.name.toLowerCase(), name: item.name, options: generateFilters(item.enum, item.sliceAll) }));

const filterPlay = (play: PlayProps, filters: IFilter[]): boolean => {
  let value = true;
  filters.forEach((filter) => {
    const checkedOptions = filter.options.filter((option) => option.checked).map((option) => option.label);
    if (checkedOptions.length > 0 && !checkedOptions.includes(play[filter.id])) {
      value = false;
    }
  });
  return value;
};

const applyFilter = (playList: PlayProps[], filters: IFilter[]): { play: PlayProps; visible: boolean }[] => {
  return playList.map((play) => ({
    play,
    visible: filterPlay(play, filters)
  }));
};

export const Playbook = (playList: PlayProps[]): JSX.Element => {
  const [filters, setFilters] = useState(filtersObject);
  const playComponents = useRef(
    Object.values(playList)
      .map((play) => ({ play, component: <Play {...play}></Play> }))
      .reverse()
  );
  const [filteredPlays, setFilteredPlays] = useState(
    Object.values(playList)
      .map((play) => ({ play, visible: true }))
      .reverse()
  );
  const [playFullWidth, setPlayWidth] = useState(false);

  useEffect(() => {
    setFilteredPlays(applyFilter(Object.values(playList), filters).reverse());
  }, [filters]);

  return (
    <div className="bg-bg-light dark:bg-bg-dark w-full">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-8 pb-6">
          <h1 className="text-3xl font-bold text-t-dark dark:text-t-light mb-[-4px] pl-2 text-2xl tracking-wide">LLB PLAYBOOK</h1>
          <button onClick={() => setPlayWidth(!playFullWidth)} type="button" className="invisible sm:visible -m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
            <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <section aria-labelledby="playbook-heading" className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <form className="hidden lg:block">
              {filters.map((filter) => (
                <Disclosure as="div" key={filter.id} className="border-b border-gray-200 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-bg-light dark:bg-bg-dark py-3 text-sm text-t-dark dark:text-t-light">
                          <span className="font-medium text-t-dark dark:text-t-light mb-[-4px] pl-2 text-l tracking-wide">{filter.name}</span>
                          <span className="ml-6 flex items-center">
                            {open ? <MinusIcon className="h-5 w-5" aria-hidden="true" /> : <PlusIcon className="h-5 w-5" aria-hidden="true" />}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {filter.options.map((option, idx) => (
                            <div key={option.value} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`filter-${filter.id}-${idx}`}
                                checked={option.checked}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                onChange={() => {
                                  const newFilters = filters.map((f) => {
                                    if (f.name === filter.name) {
                                      const newOptions = f.options.map((o) => {
                                        if (o.label === option.label) {
                                          return { ...o, checked: !o.checked };
                                        }
                                        return o;
                                      });
                                      return { ...f, options: newOptions };
                                    }
                                    return f;
                                  });
                                  setFilters(newFilters);
                                }}
                              />
                              <label className="ml-3 text-sm text-t-dark dark:text-t-light">{option.label}</label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </form>
            <div className="flex flex-wrap lg:col-span-3">
              {playComponents.current.map((play, idx) => (
                <div className={`${filteredPlays[idx].visible ? '' : 'hidden'} ${playFullWidth ? 'w-full' : 'w-1/2'} p-2`} key={`play-${idx}`}>
                  {play.component}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};