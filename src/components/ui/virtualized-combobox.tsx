import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

type Option = {
  value: string
  label: string
}

interface VirtualizedCommandProps {
  options: Option[]
  placeholder: string
  noResultsText: string
  height: string
  selectedOption: string
  onSelectOption?: (option: string) => void
}

const VirtualizedCommand = ({
  options,
  placeholder,
  height,
  noResultsText,
  selectedOption,
  onSelectOption,
}: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] =
    React.useState<Option[]>(options)
  const parentRef = React.useRef(null)

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  })

  const virtualOptions = virtualizer.getVirtualItems()

  const handleSearch = (search: string) => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      ),
    )
  }

  return (
    <Command shouldFilter={false}>
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
      <CommandGroup
        ref={parentRef}
        style={{
          contain: 'strict',
          height,
        }}
        className="w-full overflow-y-auto"
      >
        <CommandEmpty>{noResultsText}</CommandEmpty>
        <div
          style={{
            height: virtualizer.getTotalSize(),
          }}
          className="relative w-full"
        >
          <CommandList
            style={{
              transform: `translateY(${virtualOptions[0]?.start ?? 0}px)`,
            }}
            className="w-full absolute top-0 left-0 overflow-visible"
          >
            {virtualOptions.map((virtualRow) => {
              const option = filteredOptions[virtualRow.index]

              return (
                <CommandItem
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  onSelect={onSelectOption}
                  value={option.value}
                >
                  <Check
                    className={cn(
                      'mr-2 size-4 flex-shrink-0',
                      selectedOption === option.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              )
            })}
          </CommandList>
        </div>
      </CommandGroup>
    </Command>
  )
}

export interface VirtualizedComboboxProps {
  options: Option[]
  searchPlaceholder?: string
  noResultsText?: string
  noItemSelectedText?: string
  width?: string
  height?: string
  id?: string
  selectedOption: string | null
  disabled?: boolean
  onSelectOption: (value: string | null) => void
}

export function VirtualizedCombobox({
  options,
  searchPlaceholder = 'Search items...',
  noResultsText = 'No results found',
  noItemSelectedText = 'Select an item',
  width = '25rem',
  height = '25rem',
  id,
  disabled,
  selectedOption,
  onSelectOption,
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState<boolean>(false)

  const optionPlaceHolder = selectedOption
    ? options.find((option) => option.value === selectedOption)?.label
    : noItemSelectedText

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          <span
            title={optionPlaceHolder}
            className="overflow-hidden text-ellipsis"
          >
            {optionPlaceHolder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width }}>
        <VirtualizedCommand
          height={height}
          options={options}
          noResultsText={noResultsText}
          placeholder={searchPlaceholder}
          selectedOption={selectedOption ?? ''}
          onSelectOption={(value) => {
            onSelectOption(value === selectedOption ? null : value)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
