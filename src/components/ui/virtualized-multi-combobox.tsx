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
import { Check, ChevronsUpDown, SearchSlash, X } from 'lucide-react'
import * as React from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'
import { Badge } from './badge'

type Option = {
  value: string
  label: string
}

interface VirtualizedCommandProps {
  options: Option[]
  placeholder: string
  noResultsText: string
  height: string
  selectedOptions: string[]
  onSelectOptions?: (options: string[]) => void
}

const VirtualizedCommand = ({
  options,
  placeholder,
  height,
  noResultsText,
  selectedOptions,
  onSelectOptions,
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

  const onSelectOption = (value: string) => {
    const newSelectedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter((option) => option !== value)
      : [...selectedOptions, value]

    onSelectOptions?.(newSelectedOptions)
  }

  const selectAll = () => {
    onSelectOptions?.(filteredOptions.map((option) => option.value))
  }

  const diselectAll = () => {
    onSelectOptions?.([])
  }

  const hasAll = filteredOptions.every((option) =>
    selectedOptions.some((value) => value === option.value),
  )

  return (
    <Command shouldFilter={false}>
      <CommandInput
        endElement={
          <Button
            onClick={hasAll ? diselectAll : selectAll}
            variant="ghost"
            className="shrink-0 h-11 rounded-none"
          >
            {hasAll ? 'Desmarcar todos' : 'Marcar todos'}
          </Button>
        }
        onValueChange={handleSearch}
        placeholder={placeholder}
      />

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
                      selectedOptions.includes(option.value)
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
    VirtualizedMultiComboboxProps,
    'disabled' | 'id'
  > {
  placeholder?: string
  open: boolean
  selectedOptions: Option[]
  removeSelectedOption: (value: string) => void
  removeAllSelectedOptions: () => void
}

const ComboboxButton = React.forwardRef<HTMLButtonElement, ComboboxButtonProps>(
  (
    {
      open,
      placeholder,
      selectedOptions,
      removeSelectedOption,
      removeAllSelectedOptions,
      ...props
    },
    ref,
  ) => {
    const labels = selectedOptions.map((option) => option.label)

    const hasLabels = labels.length > 0
    const contentToDisplay = hasLabels ? labels : placeholder
    const isPlaceholder = !hasLabels

    return (
      <Button
        {...props}
        ref={ref} // Forward the ref to the Button component
        variant="outline"
        role="combobox"
        aria-label={placeholder}
        aria-expanded={open}
        className="justify-between w-full h-min-10"
      >
        <span
          title={
            Array.isArray(contentToDisplay)
              ? contentToDisplay.join(', ')
              : contentToDisplay
          }
          className={cn(
            'overflow-hidden flex flex-wrap gap-1',
            isPlaceholder && 'text-muted-foreground font-normal text-ellipsis',
          )}
        >
          {Array.isArray(contentToDisplay)
            ? contentToDisplay.map((label, index) => (
                <Badge key={label}>
                  {label}
                  <div
                    role="button" // can't have a button inside a button
                    onClick={(e) => {
                      e.preventDefault()
                      removeSelectedOption(selectedOptions[index].value)
                    }}
                    className="size-4 flex justify-center items-center"
                  >
                    <X className="size-3" />
                  </div>
                </Badge>
              ))
            : contentToDisplay}
        </span>
        {hasLabels ? (
          <div
            onClick={(e) => {
              e.preventDefault()
              removeAllSelectedOptions()
            }}
            role="button"
            className="size-4 shrink-0 opacity-50"
          >
            <SearchSlash className="text-primary size-4" />
          </div>
        ) : (
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        )}
      </Button>
    )
  },
)

ComboboxButton.displayName = 'ComboboxButton'

export interface VirtualizedMultiComboboxProps {
  options: Option[]
  searchPlaceholder?: string
  noResultsText?: string
  noItemSelectedText?: string
  width?: string
  height?: string
  id?: string
  selectedOptions: string[]
  disabled?: boolean
  onSelectOptions: (value: string[]) => void
}

export function VirtualizedMultiCombobox({
  id,
  options,
  searchPlaceholder = 'Search items...',
  noResultsText = 'No results found',
  noItemSelectedText = 'Select an item',
  width = '25rem',
  height = '25rem',
  selectedOptions,
  onSelectOptions,
  disabled,
}: VirtualizedMultiComboboxProps) {
  const [open, setOpen] = React.useState<boolean>(false)

  const isMd = useMediaQuery('(max-width: 48em)')

  const selectedOptionsObject = selectedOptions.flatMap(
    (option) => options.find((o) => o.value === option) ?? [],
  )

  const removeAllSelectedOptions = () => onSelectOptions([])

  if (isMd) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <ComboboxButton
            id={id}
            open={open}
            disabled={disabled}
            selectedOptions={selectedOptionsObject}
            placeholder={noItemSelectedText}
            removeSelectedOption={(value) => {
              onSelectOptions(
                selectedOptions.filter((option) => option !== value),
              )
            }}
            removeAllSelectedOptions={removeAllSelectedOptions}
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
              selectedOptions={selectedOptions}
              onSelectOptions={onSelectOptions}
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
          selectedOptions={selectedOptionsObject}
          placeholder={noItemSelectedText}
          removeSelectedOption={(value) => {
            onSelectOptions(
              selectedOptions.filter((option) => option !== value),
            )
          }}
          removeAllSelectedOptions={removeAllSelectedOptions}
        />
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width }}>
        <VirtualizedCommand
          height={height}
          options={options}
          noResultsText={noResultsText}
          placeholder={searchPlaceholder}
          selectedOptions={selectedOptions}
          onSelectOptions={onSelectOptions}
        />
      </PopoverContent>
    </Popover>
  )
}
