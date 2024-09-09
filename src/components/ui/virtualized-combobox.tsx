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
import useMediaQuery from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'

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

interface ComboboxButtonProps
  extends Pick<
    // eslint-disable-next-line no-use-before-define
    VirtualizedComboboxProps,
    'disabled' | 'id'
  > {
  placeholder?: string
  open: boolean
  label: string | null
}

const ComboboxButton = React.forwardRef<HTMLButtonElement, ComboboxButtonProps>(
  ({ open, placeholder, label, ...props }, ref) => {
    const textToDisplay = label ?? placeholder
    const isPlaceholder = label === null

    return (
      <Button
        {...props}
        ref={ref} // Forward the ref to the Button component
        variant="outline"
        role="combobox"
        aria-label={placeholder}
        aria-expanded={open}
        className="justify-between w-full"
      >
        <span
          title={textToDisplay}
          className={cn(
            'overflow-hidden text-ellipsis',
            isPlaceholder && 'text-muted-foreground font-normal',
          )}
        >
          {textToDisplay}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  },
)

ComboboxButton.displayName = 'ComboboxButton'

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
  id,
  options,
  searchPlaceholder = 'Search items...',
  noResultsText = 'No results found',
  noItemSelectedText = 'Select an item',
  width = '25rem',
  height = '25rem',
  selectedOption,
  onSelectOption,
  disabled,
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState<boolean>(false)

  const isMd = useMediaQuery('(max-width: 48em)')

  const label =
    options.find((option) => option.value === selectedOption)?.label ?? null

  if (isMd) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <ComboboxButton
            id={id}
            open={open}
            disabled={disabled}
            label={label}
            placeholder={noItemSelectedText}
          />
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <DrawerHeader className="text-start border-b">
              <DrawerTitle className="capitalize">{id}</DrawerTitle>
              <DrawerDescription>{noItemSelectedText}</DrawerDescription>
            </DrawerHeader>
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
            />{' '}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ComboboxButton
          id={id}
          open={open}
          disabled={disabled}
          label={label}
          placeholder={noItemSelectedText}
        />
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
